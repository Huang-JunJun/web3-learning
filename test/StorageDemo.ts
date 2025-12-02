import { expect } from 'chai';
import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

describe('StorageDemo', () => {
  async function deployStorageDemoFixture() {
    const StorageDemo = await ethers.getContractFactory('StorageDemo');
    const demo = await StorageDemo.deploy();
    return { demo };
  }

  it('storage 会改变 score', async function () {
    const { demo } = await loadFixture(deployStorageDemoFixture);
    await demo.changeStorage();
    expect(await demo.user()).to.equal(100n); // score 改为100
  });
});
