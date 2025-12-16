import { ethers } from 'ethers';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import stakingPoolABI from '@/abis/StakingPool.json';
import tokenABI from '@/abis/MyTokenV2.json';
import { MYTOKENV2_ADDRESS, STAKING_POOL_ADDRESS } from '@/config';

export const useStakingPool = (provider: ethers.BrowserProvider | null) => {
  const cachedDecimalsRef = useRef<number | null>(null);

  useEffect(() => {
    cachedDecimalsRef.current = null;
  }, [provider]);

  const poolReader = useMemo(() => {
    if (!provider) return null;
    return new ethers.Contract(STAKING_POOL_ADDRESS, stakingPoolABI.abi, provider);
  }, [provider]);

  const tokenReader = useMemo(() => {
    if (!provider) return null;
    return new ethers.Contract(MYTOKENV2_ADDRESS, tokenABI.abi, provider);
  }, [provider]);

  const getStakingPool = useCallback((runner: ethers.BrowserProvider | ethers.Signer) => {
    return new ethers.Contract(STAKING_POOL_ADDRESS, stakingPoolABI.abi, runner);
  }, []);

  const getToken = useCallback((runner: ethers.BrowserProvider | ethers.Signer) => {
    return new ethers.Contract(MYTOKENV2_ADDRESS, tokenABI.abi, runner);
  }, []);

  const getTokenDecimals = useCallback(async () => {
    if (cachedDecimalsRef.current !== null) {
      return cachedDecimalsRef.current;
    }
    if (!tokenReader) {
      throw new Error('Provider not ready');
    }
    const d = await tokenReader.decimals();
    const n = Number(d);
    cachedDecimalsRef.current = Number.isFinite(n) ? n : 18;
    return cachedDecimalsRef.current;
  }, [tokenReader]);

  const loadTokenDecimals = useCallback(async () => {
    return await getTokenDecimals();
  }, [getTokenDecimals]);

  const loadTotalStaked = useCallback(async () => {
    if (!poolReader) throw new Error('Provider not ready');
    const decimals = await getTokenDecimals();
    const v = await poolReader.totalStaked();
    return ethers.formatUnits(v, decimals);
  }, [getTokenDecimals, poolReader]);

  const loadTotalStakedRaw = useCallback(async (): Promise<bigint> => {
    if (!poolReader) throw new Error('Provider not ready');
    const v = await poolReader.totalStaked();
    return BigInt(v.toString());
  }, [poolReader]);

  const loadUserStaked = useCallback(
    async (account: string) => {
      if (!poolReader) throw new Error('Provider not ready');
      const decimals = await getTokenDecimals();
      const v = await poolReader.balances(account);
      return ethers.formatUnits(v, decimals);
    },
    [getTokenDecimals, poolReader],
  );

  const loadUserEarned = useCallback(
    async (account: string) => {
      if (!poolReader) throw new Error('Provider not ready');
      const decimals = await getTokenDecimals();
      const v = await poolReader.earned(account);
      return ethers.formatUnits(v, decimals);
    },
    [getTokenDecimals, poolReader],
  );

  const loadUserEarnedRaw = useCallback(
    async (account: string): Promise<bigint> => {
      if (!poolReader) throw new Error('Provider not ready');
      const v = await poolReader.earned(account);
      return BigInt(v.toString());
    },
    [poolReader],
  );

  const loadAllowanceRaw = useCallback(
    async (owner: string) => {
      if (!tokenReader) throw new Error('Provider not ready');
      const v = await tokenReader.allowance(owner, STAKING_POOL_ADDRESS);
      return BigInt(v.toString());
    },
    [tokenReader],
  );

  const loadAllowance = useCallback(
    async (owner: string) => {
      if (!tokenReader) throw new Error('Provider not ready');
      const decimals = await getTokenDecimals();
      const v = await tokenReader.allowance(owner, STAKING_POOL_ADDRESS);
      return ethers.formatUnits(v, decimals);
    },
    [getTokenDecimals, tokenReader],
  );

  const approve = useCallback(
    async (amount: string, signer: ethers.Signer) => {
      const decimals = await getTokenDecimals();
      const token = getToken(signer);
      const parsed = ethers.parseUnits(amount, decimals);
      const tx = await token.approve(STAKING_POOL_ADDRESS, parsed);
      await tx.wait();
    },
    [getToken, getTokenDecimals],
  );

  const stake = useCallback(
    async (amount: string, signer: ethers.Signer) => {
      const decimals = await getTokenDecimals();
      const pool = getStakingPool(signer);
      const parsed = ethers.parseUnits(amount, decimals);
      const tx = await pool.stake(parsed);
      await tx.wait();
    },
    [getStakingPool, getTokenDecimals],
  );

  const unstake = useCallback(
    async (amount: string, signer: ethers.Signer) => {
      const decimals = await getTokenDecimals();
      const pool = getStakingPool(signer);
      const parsed = ethers.parseUnits(amount, decimals);
      const tx = await pool.unstake(parsed);
      await tx.wait();
    },
    [getStakingPool, getTokenDecimals],
  );

  const harvest = useCallback(
    async (signer: ethers.Signer) => {
      const pool = getStakingPool(signer);
      const tx = await pool.harvest();
      await tx.wait();
    },
    [getStakingPool],
  );

  const loadTokenOwner = useCallback(async () => {
    if (!tokenReader) throw new Error('Provider not ready');
    return await tokenReader.owner();
  }, [tokenReader]);

  const loadPoolOwner = useCallback(async () => {
    if (!poolReader) throw new Error('Provider not ready');
    return await poolReader.owner();
  }, [poolReader]);

  const loadPoolTokenBalance = useCallback(async () => {
    if (!tokenReader) throw new Error('Provider not ready');
    const decimals = await getTokenDecimals();
    const v = await tokenReader.balanceOf(STAKING_POOL_ADDRESS);
    return ethers.formatUnits(v, decimals);
  }, [getTokenDecimals, tokenReader]);

  const loadPoolTokenBalanceRaw = useCallback(async (): Promise<bigint> => {
    if (!tokenReader) throw new Error('Provider not ready');
    const v = await tokenReader.balanceOf(STAKING_POOL_ADDRESS);
    return BigInt(v.toString());
  }, [tokenReader]);

  const loadRewardFundRaw = useCallback(async (): Promise<bigint> => {
    if (!poolReader) throw new Error('Provider not ready');
    const v = await poolReader.rewardFund();
    return BigInt(v.toString());
  }, [poolReader]);

  const tryLoadRewardFundRaw = useCallback(async (): Promise<bigint | null> => {
    try {
      return await loadRewardFundRaw();
    } catch (e: any) {
      const msg = String(e?.reason ?? e?.shortMessage ?? e?.message ?? e);
      if (/unrecognized selector/i.test(msg) || /missing revert data/i.test(msg)) {
        return null;
      }
      throw e;
    }
  }, [loadRewardFundRaw]);

  const loadRewardFund = useCallback(async () => {
    const decimals = await getTokenDecimals();
    const v = await loadRewardFundRaw();
    return ethers.formatUnits(v, decimals);
  }, [getTokenDecimals, loadRewardFundRaw]);

  // Owner: 仅把奖励 token 转入池子合约（不分配）
  const injectReward = useCallback(
    async (amount: string, signer: ethers.Signer) => {
      const decimals = await getTokenDecimals();
      const parsed = ethers.parseUnits(amount, decimals);
      const token = getToken(signer);
      const tx = await token.transfer(STAKING_POOL_ADDRESS, parsed);
      await tx.wait();
    },
    [getToken, getTokenDecimals],
  );

  // Token Owner: 直接转账给用户发放奖励（不经过 StakingPool 记账）
  const rewardTransfer = useCallback(
    async (to: string, amount: string, signer: ethers.Signer) => {
      const decimals = await getTokenDecimals();
      const parsed = ethers.parseUnits(amount, decimals);
      const token = getToken(signer);
      const tx = await token.transfer(to, parsed);
      await tx.wait();
    },
    [getToken, getTokenDecimals],
  );

  // Pool Owner: 使用“已注入”的奖励在池内分配（不转账）
  const distributeOnly = useCallback(
    async (amount: string, signer: ethers.Signer) => {
      const decimals = await getTokenDecimals();
      const parsed = ethers.parseUnits(amount, decimals);
      const pool = getStakingPool(signer);
      const tx = await pool.distribute(parsed);
      await tx.wait();
    },
    [getStakingPool, getTokenDecimals],
  );

  const distributeOnlyRaw = useCallback(
    async (amountRaw: bigint, signer: ethers.Signer) => {
      const pool = getStakingPool(signer);
      const tx = await pool.distribute(amountRaw);
      await tx.wait();
    },
    [getStakingPool],
  );

  // Owner: 先把奖励 token 转账到池子合约，再调用 distribute 进行分配
  const distributeReward = useCallback(
    async (amount: string, signer: ethers.Signer) => {
      await injectReward(amount, signer);
      try {
        await distributeOnly(amount, signer);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        const msg = String(e?.reason ?? e?.shortMessage ?? e?.message ?? e);
        if (/allowance exceeded/i.test(msg)) {
          throw new Error(
            '当前部署的 StakingPool 仍在用 transferFrom 拉取奖励，需要先 approve；请重新部署最新合约版本（distribute 不再需要授权）。',
          );
        }
        throw e;
      }
    },
    [distributeOnly, injectReward],
  );

  return {
    loadTokenDecimals,
    loadTotalStaked,
    loadTotalStakedRaw,
    loadUserStaked,
    loadUserEarned,
    loadUserEarnedRaw,
    loadAllowance,
    loadAllowanceRaw,
    approve,
    stake,
    unstake,
    harvest,
    loadTokenOwner,
    loadPoolOwner,
    loadPoolTokenBalance,
    loadPoolTokenBalanceRaw,
    loadRewardFund,
    loadRewardFundRaw,
    tryLoadRewardFundRaw,
    injectReward,
    rewardTransfer,
    distributeOnly,
    distributeOnlyRaw,
    distributeReward,
  };
};
