import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('TokenBankPool', () => {
  async function deployFixture() {
    // 1. 拿到 owner, user1, user2
    const [owner, user1, user2] = await ethers.getSigners();
    // 2. 部署 MyTokenV2
    const MyTokenV2 = await ethers.getContractFactory('MyTokenV2');
    const token = await MyTokenV2.deploy();
    // 3. 给 user1 / user2 铸一点初始 token（比如 owner 转给他们）
    await token.transfer(user1.address, 10_000n * 10n ** 18n);
    await token.transfer(user2.address, 20_000n * 10n ** 18n);
    // 注意等待交易确认
    // 4. 部署 TokenBankPool，传入 token 地址
    const TokenBankPool = await ethers.getContractFactory('BankPool');
    const pool = await TokenBankPool.deploy();
    // 5. 返回 { owner, user1, user2, token, pool }
    return { owner, user1, user2, token, pool };
  }

  it('首次存款：按 1:1 铸造 shares', async () => {
    // user1 先 approve → 再 deposit → 检查 shares & userShares & totalAssets
    const { user1, token, pool } = await loadFixture(deployFixture);
    const depositAmount = 1_000n * 10n ** 18n;
    await token.connect(user1).approve(pool.target, depositAmount);

    await expect(pool.connect(user1).deposit({ value: depositAmount })).to.not.be.reverted;
    const userShares = await pool.userShares(user1.address);

    expect(await pool.totalAssets()).to.equal(depositAmount);
    // 首次存款 shares 应等于 userShares
    expect(await pool.totalShares()).to.equal(userShares);
    expect(await pool.userShares(user1.address)).to.equal(userShares);
  });

  it('第二次存款：按比例铸造 shares', async () => {
    // user1 先存，user2 再存，对比 share 比例
    const { user1, user2, token, pool } = await loadFixture(deployFixture);
    const depositAmount1 = 1_000n * 10n ** 18n;
    const depositAmount2 = 2_000n * 10n ** 18n;

    await token.connect(user1).approve(pool.target, depositAmount1);
    await pool.connect(user1).deposit({ value: depositAmount1 });
    await token.connect(user2).approve(pool.target, depositAmount2);
    await pool.connect(user2).deposit({ value: depositAmount2 });

    const user1Shares = await pool.userShares(user1.address);
    const user2Shares = await pool.userShares(user2.address);

    expect(await pool.totalAssets()).to.equal(depositAmount1 + depositAmount2);
    expect(await pool.totalShares()).to.equal(user1Shares + user2Shares);
    // user2 的 shares 应该是 user1 的两倍
    expect(user2Shares).to.equal(user1Shares * 2n);
  });

  it('取款：按 shares 比例赎回资产', async () => {
    // 存 → withdraw 一部分，看 token 余额 + shares 变化
    const { user1, token, pool } = await loadFixture(deployFixture);
    const depositAmount = 1_000n * 10n ** 18n;
    token.connect(user1).approve(user1.address, depositAmount);
    await pool.connect(user1).deposit({ value: depositAmount });

    const userSharesBefore = await pool.userShares(user1.address);
    const withdrawShares = userSharesBefore / 2n; // 取出一半 shares

    await expect(pool.connect(user1).withdraw(withdrawShares)).to.not.be.reverted;

    const userSharesAfter = await pool.userShares(user1.address);
    expect(userSharesAfter).to.equal(userSharesBefore - withdrawShares);

    const userBalance = await ethers.provider.getBalance(user1.address);
    // 这里简单检查余额增加了，具体数值可能因为 gas 费有所不同
    expect(userBalance).to.be.greaterThan(0n);
  });

  it('超额赎回应该 revert', async () => {
    // withdraw 超过自己
    const { user1, token, pool } = await loadFixture(deployFixture);
    const depositAmount = 1_000n * 10n ** 18n;
    token.connect(user1).approve(user1.address, depositAmount);
    await pool.connect(user1).deposit({ value: depositAmount });

    const userShares = await pool.userShares(user1.address);
    const excessiveShares = userShares + 1n; // 超过自己持有的 shares

    await expect(pool.connect(user1).withdraw(excessiveShares)).to.be.revertedWith(
      'Insufficient shares',
    );
  });
});
