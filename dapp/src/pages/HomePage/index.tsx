// src/pages/HomePage.tsx
import WalletInfo from '../../components/WalletInfo/WalletInfo';
import { useWallet } from '../../hooks/useWallet';

const HomePage = () => {
  const { address, chainId, chainNetwork, balance, connectWallet, disconnectWallet } = useWallet();

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h1>Web3 学习 DApp</h1>

      {address ? (
        <WalletInfo
          address={address}
          chainId={chainId}
          chainNetwork={chainNetwork}
          balance={balance}
          onDisconnect={disconnectWallet}
        />
      ) : (
        <button onClick={connectWallet}>连接 MetaMask</button>
      )}
      <a href="/vault">进入金库页面</a>
    </div>
  );
};

export default HomePage;
