import { ethers } from 'hardhat';

async function main() {
  const SimpleVaultSafe = await ethers.getContractFactory('SimpleVaultSafe');
  const vault = await SimpleVaultSafe.deploy();

  await vault.waitForDeployment();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
