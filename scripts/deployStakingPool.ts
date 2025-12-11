import { ethers } from 'hardhat';

const main = async () => {
  const stakingTokenAddress = '0xYourStakingTokenAddressHere';

  const StakingPool = await ethers.getContractFactory('StakingPool');
  const stakingPool = await StakingPool.deploy(stakingTokenAddress);
  await stakingPool.waitForDeployment();

  const address = await stakingPool.getAddress();
  console.log('StakingPool deployed to:', address);
};

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
