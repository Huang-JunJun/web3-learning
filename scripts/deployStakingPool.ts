import { ethers } from 'hardhat';
import { loadDeployment, saveDeployment } from './deployUtils';

const main = async () => {
  const [deployer] = await ethers.getSigners();
  const { address: stakingTokenAddress } = loadDeployment('MyTokenV2');
  const StakingPool = await ethers.getContractFactory('StakingPool');
  const stakingPool = await StakingPool.deploy(stakingTokenAddress);
  await stakingPool.waitForDeployment();

  const address = await stakingPool.getAddress();
  console.log('StakingPool deployed to:', address);

  saveDeployment({
    contract: 'StakingPool',
    address,
    network: (await ethers.provider.getNetwork()).name,
    deployer: await deployer.getAddress(),
  });

  console.log('\nNext: run `ts-node scripts/updateConfig.ts` to sync `dapp/src/config.ts`.\n');
};

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
