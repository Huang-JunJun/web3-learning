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
    await pool.connect(owner).distribute(ethers.parseEther('800'));

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
    await pool.connect(owner).distribute(ethers.parseEther('500'));

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
});
