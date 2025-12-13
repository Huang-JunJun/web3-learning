// useSimpleVault.ts
import { ethers } from 'ethers';
import { useCallback, useMemo } from 'react';
import vaultABI from '../abis/SimpleVaultSafe.json';
import { VAULT_ADDRESS } from '../config';

type SimpleVaultSafeContract = ethers.Contract & {
  deposit: (overrides?: { value: bigint }) => Promise<ethers.TransactionResponse>;
  withdraw: (amount: bigint) => Promise<ethers.TransactionResponse>;
  vaultBalance: () => Promise<bigint>;
  version: () => Promise<string>;
};

export const useSimpleVault = (provider: ethers.BrowserProvider | null) => {
  const contract = useMemo(() => {
    if (!provider) return null;
    return new ethers.Contract(
      VAULT_ADDRESS,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (vaultABI as any).abi,
      provider,
    ) as SimpleVaultSafeContract;
  }, [provider]);

  const getContract = useCallback((): SimpleVaultSafeContract => {
    if (!contract) {
      throw new Error('Provider not ready');
    }
    return contract;
  }, [contract]);

  const loadVersion = useCallback(async () => {
    return await getContract().version();
  }, [getContract]);

  const loadVaultBalance = useCallback(async () => {
    const bal = await getContract().vaultBalance();
    return ethers.formatEther(bal);
  }, [getContract]);

  const deposit = useCallback(async (amount: string, signer: ethers.Signer) => {
    const contract = getContract().connect(signer) as SimpleVaultSafeContract;
    const value = ethers.parseEther(amount);
    const tx = await contract.deposit({ value });
    await tx.wait();
  }, [getContract]);

  const withdraw = useCallback(async (amount: string, signer: ethers.Signer) => {
    const contract = getContract().connect(signer) as SimpleVaultSafeContract;
    const value = ethers.parseEther(amount);
    const tx = await contract.withdraw(value);
    await tx.wait();
  }, [getContract]);

  return {
    loadVersion,
    loadVaultBalance,
    deposit,
    withdraw,
  };
};
