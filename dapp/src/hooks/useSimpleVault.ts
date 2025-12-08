// useSimpleVault.ts
import { ethers } from 'ethers';
import vaultABI from '../abis/SimpleVaultSafe.json';
import { VAULT_ADDRESS } from '../config';

type SimpleVaultSafeContract = ethers.Contract & {
  deposit: (overrides?: { value: bigint }) => Promise<ethers.TransactionResponse>;
  withdraw: (amount: bigint) => Promise<ethers.TransactionResponse>;
  vaultBalance: () => Promise<bigint>;
  version: () => Promise<string>;
};

export const useSimpleVault = (provider: ethers.BrowserProvider | null) => {
  const getContract = (): SimpleVaultSafeContract => {
    if (!provider) {
      throw new Error('Provider not ready');
    }
    return new ethers.Contract(
      VAULT_ADDRESS,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (vaultABI as any).abi,
      provider,
    ) as SimpleVaultSafeContract;
  };

  const loadVersion = async () => {
    const contract = getContract();
    return await contract.version();
  };

  const loadVaultBalance = async () => {
    const contract = getContract();
    const bal = await contract.vaultBalance();
    return ethers.formatEther(bal);
  };

  const deposit = async (amount: string, signer: ethers.Signer) => {
    const contract = getContract().connect(signer) as SimpleVaultSafeContract;
    const value = ethers.parseEther(amount);
    const tx = await contract.deposit({ value });
    await tx.wait();
  };

  const withdraw = async (amount: string, signer: ethers.Signer) => {
    const contract = getContract().connect(signer) as SimpleVaultSafeContract;
    const value = ethers.parseEther(amount);
    const tx = await contract.withdraw(value);
    await tx.wait();
  };

  return {
    loadVersion,
    loadVaultBalance,
    deposit,
    withdraw,
  };
};
