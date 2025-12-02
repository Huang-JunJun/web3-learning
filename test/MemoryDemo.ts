import { expect } from 'chai';
import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

describe('MemoryDemo', () => {
  async function deployMemoryDemoFixture() {
    const MemoryDemo = await ethers.getContractFactory('MemoryDemo');
    const demo = await MemoryDemo.deploy();
    return { demo };
  }

  it('Memory 不会改变 score', async function () {
    const { demo } = await loadFixture(deployMemoryDemoFixture);
    await demo.changeMemory();
    expect(await demo.user()).to.equal(0n); // score 不变
  });
});
