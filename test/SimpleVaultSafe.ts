import { expect } from 'chai';
import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

describe('SimpleVaultSafe', () => {
  async function deployVaultSafeFixture() {
    const [owner, user1, user2] = await ethers.getSigners();
    const VaultSafe = await ethers.getContractFactory('SimpleVaultSafe');
    const safe = await VaultSafe.deploy();
    return { owner, user1, user2, safe };
  }

  it('deposit 后 balanceOf 正确更新', async () => {
    const { user1, safe } = await loadFixture(deployVaultSafeFixture);
    const amount = ethers.parseEther('1');

    await safe.connect(user1).deposit({ value: amount });
    const balance = await safe.balanceOf(user1.address);

    expect(balance).to.equal(amount);
  });

  it('withdraw 正常工作，余额清零', async () => {
    const { user1, safe } = await loadFixture(deployVaultSafeFixture);
    const amount = ethers.parseEther('1');

    await safe.connect(user1).deposit({ value: amount });
    await safe.connect(user1).withdraw(amount);
    const balance = await safe.balanceOf(user1.address);

    expect(balance).to.equal(0);
  });

  it('withdraw 超出余额时应 revert', async () => {
    const { user1, safe } = await loadFixture(deployVaultSafeFixture);
    const amount = ethers.parseEther('1');

    await expect(safe.connect(user1).withdraw(amount)).to.be.revertedWith('Insufficient balance');
  });
});
