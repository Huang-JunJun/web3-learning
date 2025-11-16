import { expect } from 'chai';
import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

describe('MyToken', () => {
  async function deployMyTokenFixture() {
    const [owner, user1, user2] = await ethers.getSigners();
    const MyToken = await ethers.getContractFactory('MyToken');
    const token = await MyToken.deploy();
    return { owner, user1, user2, token };
  }

  describe('Supply', () => {
    it('部署后总供应量在 owner 地址上', async () => {
      const { token, owner } = await loadFixture(deployMyTokenFixture);
      const totalSupply = await token.totalSupply();
      const ownerBalance = await token.balanceOf(owner.address);

      expect(totalSupply).to.equal(ownerBalance);
    });
  });

  describe('Transfer', () => {
    it('transfer 正常转账, user1收到100个代币', async () => {
      const { user1, user2, owner, token } = await loadFixture(deployMyTokenFixture);
      const amount = ethers.parseUnits('100', 18);
      await token.connect(owner).transfer(user1.address, amount);
      const user1Balance = await token.balanceOf(user1.address);

      expect(user1Balance).to.equal(amount);
    });
    it('transfer 超出余额应 revert', async () => {
      const { user1, user2, token } = await loadFixture(deployMyTokenFixture);
      const amount = ethers.parseUnits('100', 18);

      await expect(token.connect(user1).transfer(user2.address, amount)).to.revertedWith(
        'Insufficient balance',
      );
    });
  });

  describe('Approve', async () => {
    it('approve 正常授权', async () => {
      const { owner, user1, user2, token } = await loadFixture(deployMyTokenFixture);
      const amount = ethers.parseUnits('500', 18);
      // 所有者对user1授权500个代币
      await token.connect(owner).approve(user1.address, amount);
      const allowance = await token.allowance(owner.address, user1.address);

      expect(allowance).to.equal(amount);
    });
  });

  describe('TransferFrom', async () => {
    it('transferFrom 正常工作', async () => {
      const { owner, user1, user2, token } = await loadFixture(deployMyTokenFixture);
      const amount = ethers.parseUnits('300', 18);
      await token.connect(owner).approve(user1.address, amount);
      await token.connect(user1).transferFrom(owner.address, user2.address, amount);
      const user2Balance = await token.balanceOf(user2.address);
      const allowance = await token.allowance(owner.address, user1.address);

      expect(user2Balance).to.equal(amount);
    });
    it('transferFrom 超出 allowance 应 revert', async () => {
      const { owner, user1, user2, token } = await loadFixture(deployMyTokenFixture);
      const amount = ethers.parseUnits('100', 18);
      const transferTokens = ethers.parseUnits('200', 18);
      await token.connect(owner).approve(user1.address, amount);

      await expect(
        token.connect(user1).transferFrom(owner.address, user2.address, transferTokens),
      ).to.revertedWith('Insufficient allowance');
    });
  });
});
