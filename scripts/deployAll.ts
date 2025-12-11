// scripts/deployAll.ts
import { ethers } from 'hardhat';
import { saveDeployment, loadDeployment } from './deployUtils';
import { clearDeployments } from './deployUtils';
import { execSync } from 'child_process';

async function deployMyTokenV2() {
  const [deployer] = await ethers.getSigners();
  console.log('\n=== Deploying MyTokenV2 ===');

  const Token = await ethers.getContractFactory('MyTokenV2');
  const token = await Token.deploy();

  await token.waitForDeployment();
  const address = await token.getAddress();

  saveDeployment({
    contract: 'MyTokenV2',
    address,
    network: 'localhost',
    deployer: await deployer.getAddress(),
  });

  return address;
}

async function deploySimpleVaultSafe() {
  const [deployer] = await ethers.getSigners();
  console.log('\n=== Deploying SimpleVaultSafe ===');

  const Vault = await ethers.getContractFactory('SimpleVaultSafe');
  const vault = await Vault.deploy();

  await vault.waitForDeployment();
  const address = await vault.getAddress();

  saveDeployment({
    contract: 'SimpleVaultSafe',
    address,
    network: 'localhost',
    deployer: await deployer.getAddress(),
  });

  return address;
}

async function deployBankPool() {
  const [deployer] = await ethers.getSigners();
  console.log('\n=== Deploying BankPool ===');

  const BankPool = await ethers.getContractFactory('BankPool');
  const bankpool = await BankPool.deploy();

  await bankpool.waitForDeployment();
  const address = await bankpool.getAddress();

  saveDeployment({
    contract: 'BankPool',
    address,
    network: 'localhost',
    deployer: await deployer.getAddress(),
  });

  return address;
}

async function deployStakingPool() {
  const [deployer] = await ethers.getSigners();
  console.log('\n=== Deploying StakingPool ===');

  // 依赖 MyTokenV2
  const { address: tokenAddress } = loadDeployment('MyTokenV2');

  const StakingPool = await ethers.getContractFactory('StakingPool');
  const pool = await StakingPool.deploy(tokenAddress);

  await pool.waitForDeployment();
  const address = await pool.getAddress();

  saveDeployment({
    contract: 'StakingPool',
    address,
    network: 'localhost',
    deployer: await deployer.getAddress(),
  });

  return address;
}

async function main() {
  console.log('\nCleaning all deployment...\n');
  clearDeployments();

  console.log('\n🚀 Starting full deployment...\n');

  const token = await deployMyTokenV2();
  console.log('MyTokenV2 →', token);

  const vault = await deploySimpleVaultSafe();
  console.log('SimpleVaultSafe →', vault);

  const bankpool = await deployBankPool();
  console.log('BankPool →', bankpool);

  const staking = await deployStakingPool();
  console.log('StakingPool →', staking);

  execSync('npx ts-node scripts/updateConfig.ts', { stdio: 'inherit' });
  console.log('\n🎉 All contracts deployed successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
