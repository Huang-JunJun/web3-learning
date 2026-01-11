import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('StakingPool', () => {
  async function deployStakingPoolFixture() {
    const [owner, user1, user2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory('MyTokenV2');
    const token = await Token.deploy();
    await token.waitForDeployment();

    const StakingPool = await ethers.getContractFactory('StakingPool');
    const pool = await StakingPool.deploy(await token.getAddress());
    await pool.waitForDeployment();

    return { owner, user1, user2, token, pool };
  }

  it('用户可以 stake 并更新余额和 totalStaked', async () => {
    const { owner, user1, token, pool } = await loadFixture(deployStakingPoolFixture);
    await token.transfer(await user1.getAddress(), ethers.parseEther('1000'));
    await token.connect(user1).approve(await pool.getAddress(), ethers.parseEther('500'));
    await pool.connect(user1).stake(ethers.parseEther('500'));

    const userBalance = await pool.balances(await user1.getAddress());
    const totalStaked = await pool.totalStaked();

    expect(userBalance).to.equal(ethers.parseEther('500'));
    expect(totalStaked).to.equal(ethers.parseEther('500'));
  });

  it('用户可以 unstake 并取回本金', async () => {
    const { owner, user1, token, pool } = await loadFixture(deployStakingPoolFixture);
    await token.transfer(await user1.getAddress(), ethers.parseEther('1000'));
    await token.connect(user1).approve(await pool.getAddress(), ethers.parseEther('500'));
    await pool.connect(user1).stake(ethers.parseEther('500'));

    await pool.connect(user1).unstake(ethers.parseEther('200'));

    const userBalance = await pool.balances(await user1.getAddress());
    const totalStaked = await pool.totalStaked();
    const userTokenBalance = await token.balanceOf(await user1.getAddress());

    expect(userBalance).to.equal(ethers.parseEther('300'));
    expect(totalStaked).to.equal(ethers.parseEther('300'));
    expect(userTokenBalance).to.equal(ethers.parseEther('700'));
  });

  it('distribute 后用户可以按占比领取奖励', async () => {
    const { owner, user1, user2, token, pool } = await loadFixture(deployStakingPoolFixture);
    await token.transfer(await user1.getAddress(), ethers.parseEther('1000'));
    await token.transfer(await user2.getAddress(), ethers.parseEther('1000'));
    await token.connect(user1).approve(await pool.getAddress(), ethers.parseEther('500'));
    await token.connect(user2).approve(await pool.getAddress(), ethers.parseEther('300'));
    await pool.connect(user1).stake(ethers.parseEther('500'));
    await pool.connect(user2).stake(ethers.parseEther('300'));

    // 分发奖励
    await token.connect(owner).approve(await pool.getAddress(), ethers.parseEther('800'));
    await pool.connect(owner).fundAndDistribute(ethers.parseEther('800'));

    expect(await pool.earned(await user1.getAddress())).to.equal(ethers.parseEther('500'));
    expect(await pool.earned(await user2.getAddress())).to.equal(ethers.parseEther('300'));
  });

  it('多次 harvest 不会重复领取同一份奖励', async () => {
    const { owner, user1, token, pool } = await loadFixture(deployStakingPoolFixture);
    await token.transfer(await user1.getAddress(), ethers.parseEther('1000'));
    await token.connect(user1).approve(await pool.getAddress(), ethers.parseEther('500'));
    await pool.connect(user1).stake(ethers.parseEther('500'));

    // 分发奖励
    await token.connect(owner).approve(await pool.getAddress(), ethers.parseEther('500'));
    await pool.connect(owner).fundAndDistribute(ethers.parseEther('500'));

    // 第一次 harvest
    await pool.connect(user1).harvest();
    const balanceAfterFirstHarvest = await token.balanceOf(await user1.getAddress());
    expect(balanceAfterFirstHarvest).to.equal(ethers.parseEther('1000'));
    // 第二次 harvest 应该没有可领奖励并 revert
    await expect(pool.connect(user1).harvest()).to.be.revertedWith('No rewards to harvest');
  });

  it('未质押用户不能 unstake 或领取奖励', async () => {
    const { owner, user1, token, pool } = await loadFixture(deployStakingPoolFixture);
    await expect(pool.connect(user1).unstake(ethers.parseEther('100'))).to.be.revertedWith(
      'Insufficient staked balance',
    );
    await expect(pool.connect(user1).harvest()).to.be.revertedWith('No rewards to harvest');
  });

  it('fundAndDistribute 分配正确且 harvest 会扣减 rewardFund', async () => {
    const { owner, user1, user2, token, pool } = await loadFixture(deployStakingPoolFixture);

    await token.transfer(await user1.getAddress(), ethers.parseEther('1000'));
    await token.transfer(await user2.getAddress(), ethers.parseEther('1000'));

    await token.connect(user1).approve(await pool.getAddress(), ethers.parseEther('500'));
    await token.connect(user2).approve(await pool.getAddress(), ethers.parseEther('1000'));

    await pool.connect(user1).stake(ethers.parseEther('500'));
    await pool.connect(user2).stake(ethers.parseEther('1000'));

    const rptBefore = await pool.rewardPerTokenStored();

    await token.connect(owner).approve(await pool.getAddress(), ethers.parseEther('450'));
    await pool.connect(owner).fundAndDistribute(ethers.parseEther('450'));

    const rptAfter = await pool.rewardPerTokenStored();
    expect(rptAfter).to.be.gt(rptBefore);

    expect(await pool.earned(await user1.getAddress())).to.equal(ethers.parseEther('150'));
    expect(await pool.earned(await user2.getAddress())).to.equal(ethers.parseEther('300'));

    const fundBefore = await pool.rewardFund();
    const balBefore = await token.balanceOf(await user1.getAddress());

    await pool.connect(user1).harvest();

    const balAfter = await token.balanceOf(await user1.getAddress());
    expect(balAfter - balBefore).to.equal(ethers.parseEther('150'));

    const fundAfter = await pool.rewardFund();
    expect(fundBefore - fundAfter).to.equal(ethers.parseEther('150'));

    expect(await pool.earned(await user2.getAddress())).to.equal(ethers.parseEther('300'));
  });

  it('分数分配不丢失（多轮分配摊平截断误差）', async () => {
    const { owner, user1, user2, token, pool } = await loadFixture(deployStakingPoolFixture);

    await token.transfer(await user1.getAddress(), ethers.parseEther('10'));
    await token.transfer(await user2.getAddress(), ethers.parseEther('10'));

    await token.connect(user1).approve(await pool.getAddress(), ethers.parseEther('1'));
    await token.connect(user2).approve(await pool.getAddress(), ethers.parseEther('2'));

    await pool.connect(user1).stake(ethers.parseEther('1'));
    await pool.connect(user2).stake(ethers.parseEther('2'));

    await token.connect(owner).approve(await pool.getAddress(), ethers.parseEther('1'));
    await pool.connect(owner).fundAndDistribute(ethers.parseEther('1'));

    const rpt = await pool.rewardPerTokenStored();
    expect(rpt).to.be.gt(0n);

    const earnedA1 = await pool.earned(await user1.getAddress());
    const earnedB1 = await pool.earned(await user2.getAddress());
    const sum1 = earnedA1 + earnedB1;
    const total1 = ethers.parseEther('1');
    expect(sum1 <= total1).to.equal(true);

    await token.connect(owner).approve(await pool.getAddress(), ethers.parseEther('2'));
    await pool.connect(owner).fundAndDistribute(ethers.parseEther('2'));

    const earnedA2 = await pool.earned(await user1.getAddress());
    const earnedB2 = await pool.earned(await user2.getAddress());
    const sum2 = earnedA2 + earnedB2;
    const total2 = ethers.parseEther('3');
    const diff = total2 - sum2;
    expect(diff >= 0n).to.equal(true);
    expect(diff <= 5n).to.equal(true);
  });
});
