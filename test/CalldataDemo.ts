import { expect } from 'chai';
import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

describe('CalldataDemo', () => {
  async function deployCalldataDemoFixture() {
    const CalldataDemo = await ethers.getContractFactory('CalldataDemo');
    const demo = await CalldataDemo.deploy();
    return { demo };
  }

  it('Calldata 参数可以正常读取 length', async function () {
    const { demo } = await loadFixture(deployCalldataDemoFixture);
    const length = await demo.testCalldata([1, 2, 3]);
    expect(length).to.equal(3n);
  });
});
