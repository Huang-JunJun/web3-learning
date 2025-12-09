import { ethers } from 'hardhat';

const main = async () => {
  const [deployer] = await ethers.getSigners();

  const BankPool = await ethers.getContractFactory('BankPool');
  const bankPool = await BankPool.deploy();
  await bankPool.waitForDeployment();
};

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
