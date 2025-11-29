import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('Ownable', () => {
  async function deployFixture() {
    const [owner, newOwner, other] = await ethers.getSigners();
    const Ownable = await ethers.getContractFactory('Ownable');
    const ownable = await Ownable.deploy();
    return { owner, newOwner, other, ownable };
  }

  it('部署者应该是 owner', async () => {
    const { owner } = await loadFixture(deployFixture);

    expect(await owner.getAddress()).to.equal(owner.address);
  });

  it('非 owner 调用 transferOwnership 应该 revert', async () => {
    const { other, ownable } = await loadFixture(deployFixture);

    await expect(ownable.connect(other).transferOwnership(other.address)).to.be.revertedWith(
      'Not owner',
    );
  });

  it('owner 可以成功 transferOwnership', async () => {
    const { owner, newOwner, ownable } = await loadFixture(deployFixture);

    await expect(ownable.connect(owner).transferOwnership(newOwner.address)).to.not.be.reverted;
    expect(await ownable.owner()).to.equal(newOwner.address);
  });

  it('newOwner 不能是 address(0)', async () => {
    const { owner, ownable } = await loadFixture(deployFixture);

    await expect(ownable.connect(owner).transferOwnership(ethers.ZeroAddress)).to.be.revertedWith(
      'New owner is zero address',
    );
  });

  it('owner 可以 renounceOwnership 成为 0 地址', async () => {
    const { owner, ownable } = await loadFixture(deployFixture);

    await expect(ownable.connect(owner).renounceOwnership()).to.not.be.reverted;
  });

  it('非 owner 调用 renounceOwnership 应该 revert', async () => {
    const { newOwner, ownable } = await loadFixture(deployFixture);

    await expect(ownable.connect(newOwner).renounceOwnership()).to.be.revertedWith('Not owner');
  });

  it('transferOwnership 应该触发 OwnershipTransferred 事件', async () => {
    const { owner, newOwner, ownable } = await loadFixture(deployFixture);

    await expect(ownable.connect(owner).transferOwnership(newOwner.address))
      .to.emit(ownable, 'OwnershipTransferred')
      .withArgs(owner.address, newOwner.address);
  });
});
