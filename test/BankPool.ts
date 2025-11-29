import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('BankPool', () => {
  async function deployBankPoolFixture() {
    const [owner, user1, user2] = await ethers.getSigners();
    const BankPool = await ethers.getContractFactory('BankPool');
    const pool = await BankPool.deploy();

    return { pool, owner, user1, user2 };
  }

  it('初次存款应该 1:1 铸造 shares', async () => {
    const { pool, user1 } = await loadFixture(deployBankPoolFixture);
    const depositAmount = 1000n;

    await expect(pool.connect(user1).deposit({ value: depositAmount })).to.not.be.reverted;

    expect(await pool.totalAssets()).to.equal(depositAmount);
    expect(await pool.totalShares()).to.equal(depositAmount);
  });

  it('第二次存款应该按比例铸造 shares', async () => {
    const { pool, user1, user2 } = await loadFixture(deployBankPoolFixture);
    const firstDeposit = 1000n;
    const secondDeposit = 500n;

    await expect(pool.connect(user1).deposit({ value: firstDeposit })).to.not.be.reverted;
    await expect(pool.connect(user2).deposit({ value: secondDeposit })).to.not.be.reverted;

    expect(await pool.totalAssets()).to.equal(firstDeposit + secondDeposit);
    expect(await pool.totalShares()).to.equal(1500n); // user1 得到 1000 shares，user2 得到 500 shares
  });

  it('取款应该按 shares 比例计算资产', async () => {
    const { pool, user1 } = await loadFixture(deployBankPoolFixture);
    const depositAmount = 1000n;
    const withdrawShares = 500n;

    await expect(pool.connect(user1).deposit({ value: depositAmount })).to.not.be.reverted;
    await expect(pool.connect(user1).withdraw(withdrawShares)).to.not.be.reverted;

    expect(await pool.totalAssets()).to.equal(depositAmount - withdrawShares);
    expect(await pool.totalShares()).to.equal(depositAmount - withdrawShares);
  });

  it('收益增长时 shares 不变但资产变多', async () => {
    const { pool, user1 } = await loadFixture(deployBankPoolFixture);
    const depositAmount = 1000n;
    const profitAmount = 500n;

    await expect(pool.connect(user1).deposit({ value: depositAmount })).to.not.be.reverted;

    // 模拟收益增长
    await ethers.provider.send('evm_increaseTime', [3600]); // 增加时间以模拟收益
    await ethers.provider.send('evm_mine', []); // 挖一个块

    // 直接向合约地址发送以模拟收益
    await ethers.provider.send('eth_sendTransaction', [
      {
        from: user1.address,
        to: await pool.getAddress(),
        value: '0x' + profitAmount.toString(16),
      },
    ]);

    expect(await pool.totalAssets()).to.equal(depositAmount + profitAmount);
    expect(await pool.totalShares()).to.equal(depositAmount); // shares 不变
  });

  it('不能取超过自己 shares 的数额', async () => {
    const { pool, user1 } = await loadFixture(deployBankPoolFixture);
    const depositAmount = 1000n;
    const withdrawShares = 1500n;

    await expect(pool.connect(user1).deposit({ value: depositAmount })).to.not.be.reverted;

    await expect(pool.connect(user1).withdraw(withdrawShares)).to.be.revertedWith(
      'Insufficient shares',
    );
  });
});
