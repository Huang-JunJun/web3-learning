import { ethers } from 'ethers';
import bankPoolABI from '../abis/BankPool.json';
import { BANK_POOL_ADDRESS } from '../config';

type BankPoolContract = ethers.Contract & {
  totalAssets: () => Promise<bigint>;
  totalShares: () => Promise<bigint>;
  userShares: (user: string) => Promise<bigint>;
  previewWithdraw?: (user: string) => Promise<bigint>;
  deposit: (overrides?: { value: bigint }) => Promise<ethers.TransactionResponse>;
  withdraw: (shares: bigint) => Promise<ethers.TransactionResponse>;
};

export const useBankPool = (provider: ethers.BrowserProvider | null) => {
  const getContract = (): BankPoolContract => {
    if (!provider) {
      throw new Error('Provider not ready');
    }
    return new ethers.Contract(
      BANK_POOL_ADDRESS,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (bankPoolABI as any).abi,
      provider,
    ) as BankPoolContract;
  };

  const loadTotalAssets = async () => {
    const contract = getContract();
    const value = await contract.totalAssets();
    return ethers.formatEther(value);
  };

  const loadTotalShares = async () => {
    const contract = getContract();
    const value = await contract.totalShares();
    return ethers.formatEther(value);
  };

  const loadUserShares = async (address: string) => {
    const contract = getContract();
    const value = await contract.userShares(address);
    return ethers.formatEther(value);
  };

  const loadPreviewWithdraw = async (address: string) => {
    const contract = getContract();
    if (!contract.previewWithdraw) {
      return null;
    }
    const value = await contract.previewWithdraw(address);
    return ethers.formatEther(value);
  };

  const deposit = async (amount: string, signer: ethers.Signer) => {
    const contract = getContract().connect(signer) as BankPoolContract;
    const value = ethers.parseEther(amount);
    const tx = await contract.deposit({ value });
    await tx.wait();
  };

  const withdraw = async (shares: string, signer: ethers.Signer) => {
    const contract = getContract().connect(signer) as BankPoolContract;
    const value = BigInt(shares);
    const tx = await contract.withdraw(value);
    await tx.wait();
  };

  return {
    loadTotalAssets,
    loadTotalShares,
    loadUserShares,
    loadPreviewWithdraw,
    deposit,
    withdraw,
  };
};
