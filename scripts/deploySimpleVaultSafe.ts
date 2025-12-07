import { ethers } from 'hardhat';

async function main() {
  const SimpleVaultSafe = await ethers.getContractFactory('SimpleVaultSafe');
  const vault = await SimpleVaultSafe.deploy();

  await vault.waitForDeployment();

  console.log('SimpleVaultSafe deployed to:', await vault.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
