// scripts/deployMyTokenV2.ts
import { ethers } from 'hardhat';
import { saveDeployment } from './deployUtils';

const main = async () => {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying MyTokenV2 with account:', await deployer.getAddress());

  const Token = await ethers.getContractFactory('MyTokenV2');
  const token = await Token.deploy(); // 如果构造函数有参数，这里传参

  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log('MyTokenV2 deployed to:', address);

  saveDeployment({
    contract: 'MyTokenV2',
    address,
    network: (await token.runner?.provider?.getNetwork())?.name ?? 'unknown',
    deployer: await deployer.getAddress(),
  });
};

void main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
