import { ethers } from 'ethers';
import stakingPoolABI from '@/abis/StakingPool.json';
import tokenABI from '@/abis/MyTokenV2.json';
import { MYTOKENV2_ADDRESS, STAKING_POOL_ADDRESS } from '@/config';

export const useStakingPool = (provider: ethers.BrowserProvider | null) => {
  let cachedDecimals: number | null = null;

  const getStakingPool = (runner: ethers.BrowserProvider | ethers.Signer) => {
    return new ethers.Contract(STAKING_POOL_ADDRESS, stakingPoolABI.abi, runner);
  };

  const getToken = (runner: ethers.BrowserProvider | ethers.Signer) => {
    return new ethers.Contract(MYTOKENV2_ADDRESS, tokenABI.abi, runner);
  };

  const getTokenDecimals = async () => {
    if (cachedDecimals !== null) {
      return cachedDecimals;
    }
    if (!provider) {
      throw new Error('Provider not ready');
    }
    const token = getToken(provider);
    const d = await token.decimals();
    const n = Number(d);
    cachedDecimals = Number.isFinite(n) ? n : 18;
    return cachedDecimals;
  };

  const loadTokenDecimals = async () => {
    return await getTokenDecimals();
  };

  const loadTotalStaked = async () => {
    if (!provider) {
      throw new Error('Provider not ready');
    }
    const decimals = await getTokenDecimals();
    const pool = getStakingPool(provider);
    const v = await pool.totalStaked();
    return ethers.formatUnits(v, decimals);
  };

  const loadUserStaked = async (account: string) => {
    if (!provider) {
      throw new Error('Provider not ready');
    }
    const decimals = await getTokenDecimals();
    const pool = getStakingPool(provider);
    const v = await pool.balances(account);
    return ethers.formatUnits(v, decimals);
  };

  const loadUserEarned = async (account: string) => {
    if (!provider) {
      throw new Error('Provider not ready');
    }
    const decimals = await getTokenDecimals();
    const pool = getStakingPool(provider);
    const v = await pool.earned(account);
    return ethers.formatUnits(v, decimals);
  };

  const loadAllowanceRaw = async (owner: string) => {
    if (!provider) {
      throw new Error('Provider not ready');
    }
    const token = getToken(provider);
    const v = await token.allowance(owner, STAKING_POOL_ADDRESS);
    return BigInt(v.toString());
  };

  const loadAllowance = async (owner: string) => {
    if (!provider) {
      throw new Error('Provider not ready');
    }
    const decimals = await getTokenDecimals();
    const token = getToken(provider);
    const v = await token.allowance(owner, STAKING_POOL_ADDRESS);
    return ethers.formatUnits(v, decimals);
  };

  const approve = async (amount: string, signer: ethers.Signer) => {
    const decimals = await getTokenDecimals();
    const token = getToken(signer);
    const parsed = ethers.parseUnits(amount, decimals);
    const tx = await token.approve(STAKING_POOL_ADDRESS, parsed);
    await tx.wait();
  };

  const stake = async (amount: string, signer: ethers.Signer) => {
    const decimals = await getTokenDecimals();
    const pool = getStakingPool(signer);
    const parsed = ethers.parseUnits(amount, decimals);
    const tx = await pool.stake(parsed);
    await tx.wait();
  };

  const unstake = async (amount: string, signer: ethers.Signer) => {
    const decimals = await getTokenDecimals();
    const pool = getStakingPool(signer);
    const parsed = ethers.parseUnits(amount, decimals);
    const tx = await pool.unstake(parsed);
    await tx.wait();
  };

  const harvest = async (signer: ethers.Signer) => {
    const pool = getStakingPool(signer);
    const tx = await pool.harvest();
    await tx.wait();
  };

  return {
    loadTokenDecimals,
    loadTotalStaked,
    loadUserStaked,
    loadUserEarned,
    loadAllowance,
    loadAllowanceRaw,
    approve,
    stake,
    unstake,
    harvest,
  };
};
