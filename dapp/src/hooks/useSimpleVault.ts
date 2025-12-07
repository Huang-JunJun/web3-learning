import { ethers } from 'ethers';
import vaultABI from '../abis/SimpleVaultSafe.json';
import { VAULT_ADDRESS } from '../config';

export const useSimpleVault = (provider: ethers.BrowserProvider | null) => {
  const getContract = () => {
    if (!provider) throw new Error('Provider not ready');
    return new ethers.Contract(VAULT_ADDRESS, vaultABI.abi, provider);
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

  return {
    loadVersion,
    loadVaultBalance,
  };
};
