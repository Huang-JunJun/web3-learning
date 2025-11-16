import { expect } from 'chai';
import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

describe('SimpleVault', () => {
  async function deployVaultFixture() {
    // 1. 拿 signer
    const [deployer, user] = await ethers.getSigners();
    // 2. 部署合约
    const SimpleVault = await ethers.getContractFactory('SimpleVault');
    const simpleVault = (await SimpleVault.deploy()) as any;
    // 3. 返回合约实例 + 一些常用变量
    return { deployer, user, simpleVault };
  }

  describe('Deposit', () => {
    it('存款后，内部余额应该增加', async () => {
      const { simpleVault, user } = await loadFixture(deployVaultFixture);
      const amount = ethers.parseEther('1');
      await simpleVault.connect(user).deposit({ value: amount });
      const balance = await simpleVault.balanceOf(user.address);

      expect(balance).to.equal(amount);
    });
    it('存款后，合约的ETH余额应该增加', async () => {
      const { simpleVault, deployer } = await loadFixture(deployVaultFixture);
      const amount = ethers.parseEther('1');
      await simpleVault.connect(deployer).deposit({ value: amount });
      const vaultBalance = await simpleVault.vaultBalance();

      expect(vaultBalance).to.equal(amount);
    });
  });

  describe('Withdraw', () => {
    it('余额足够时可以提现', async () => {
      const { simpleVault, user } = await loadFixture(deployVaultFixture);
      const depositAmount = ethers.parseEther('1');
      await simpleVault.connect(user).deposit({ value: depositAmount });
      const withdrawAmount = ethers.parseEther('0.5');
      await simpleVault.connect(user).withdraw(withdrawAmount);
      const balance = await simpleVault.balanceOf(user.address);

      expect(balance).to.equal(depositAmount - withdrawAmount);
    });
    it('余额不足时应该revert', async () => {
      const { simpleVault, user } = await loadFixture(deployVaultFixture);
      const withdrawAmount = ethers.parseEther('1');

      await expect(simpleVault.connect(user).withdraw(withdrawAmount)).to.be.revertedWith(
        'Insufficient balance',
      );
    });
  });

  describe('Version', () => {
    it('返回的版本号应该是 1.0.0', async () => {
      const { simpleVault } = await loadFixture(deployVaultFixture);
      const v = await simpleVault.version();
      expect(v).to.equal('1.0.0');
    });
  });
});
