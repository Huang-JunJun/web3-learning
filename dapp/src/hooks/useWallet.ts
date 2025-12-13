import { useCallback, useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';
import { message } from 'antd';

export const useWallet = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState('');
  const [chainNetwork, setChainNetwork] = useState('');
  const [balance, setBalance] = useState('');
  const [signer, setSigner] = useState<ethers.JsonRpcSigner>();

  const providerRef = useRef<ethers.BrowserProvider | null>(null);
  useEffect(() => {
    providerRef.current = provider;
  }, [provider]);

  const disconnectWallet = useCallback(() => {
    setAddress('');
    setChainId('');
    setChainNetwork('');
    setBalance('');
    setProvider(null);
    setSigner(undefined);
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      message.warning('请安装 MetaMask');
      return;
    }

    try {
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

      message.success('钱包连接成功');
    } catch (e: any) {
      message.error(e?.message ?? '钱包连接失败');
      return;
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
        return;
      }

      const next = accounts[0];
      setAddress(next);

      const p = providerRef.current ?? new ethers.BrowserProvider(window.ethereum);
      if (!providerRef.current) setProvider(p);

      try {
        const bal = await p.getBalance(next);
        setBalance(ethers.formatEther(bal));
        const network = await p.getNetwork();
        setChainId(network.chainId.toString());
        setChainNetwork(network.name);
        const s = await p.getSigner();
        setSigner(s);
      } catch {
        // ignore; user may be switching networks/accounts rapidly
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [disconnectWallet]);

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
