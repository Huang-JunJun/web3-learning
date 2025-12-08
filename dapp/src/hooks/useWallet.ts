import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export const useWallet = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState('');
  const [chainNetwork, setChainNetwork] = useState('');
  const [balance, setBalance] = useState('');
  const [signer, setSigner] = useState<ethers.JsonRpcSigner>();

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('请安装 MetaMask');
      return;
    }

    const _provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(_provider);

    const accounts = await _provider.send('eth_requestAccounts', []);
    const addr = accounts[0];
    setAddress(addr);

    const network = await _provider.getNetwork();
    setChainId(network.chainId.toString());
    setChainNetwork(network.name);

    const bal = await _provider.getBalance(addr);
    setBalance(ethers.formatEther(bal));

    const _signer = await _provider.getSigner();
    setSigner(_signer);
  };

  const disconnectWallet = () => {
    setAddress('');
    setChainId('');
    setChainNetwork('');
    setBalance('');
    setProvider(null);
  };

  const setupListeners = () => {
    if (!window.ethereum) {
      return;
    }

    window.ethereum.on('accountsChanged', async (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        const next = accounts[0];
        setAddress(next);
        if (provider) {
          const bal = await provider.getBalance(next);
          setBalance(ethers.formatEther(bal));
        }
      }
    });

    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
  };

  useEffect(() => {
    setupListeners();
  }, [provider]);

  return {
    provider,
    address,
    chainId,
    chainNetwork,
    balance,
    signer,
    connectWallet,
    disconnectWallet,
  };
};
