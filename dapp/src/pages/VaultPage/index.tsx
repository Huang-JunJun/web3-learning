import { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { useSimpleVault } from '../../hooks/useSimpleVault';

const VaultPage = () => {
  const { provider, address, connectWallet } = useWallet();
  const { loadVersion, loadVaultBalance } = useSimpleVault(provider);

  const [version, setVersion] = useState('');
  const [balance, setBalance] = useState('');

  const handleLoad = async () => {
    debugger;
    if (!provider) {
      alert('请先连接钱包');
      return;
    }
    debugger;

    const v = await loadVersion();
    const b = await loadVaultBalance();
    setVersion(v);
    setBalance(b);
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>SimpleVaultSafe</h1>

      {!address ? (
        <button onClick={connectWallet}>连接钱包</button>
      ) : (
        <>
          <p>当前地址：{address}</p>
          <button onClick={handleLoad}>读取金库信息</button>
          <p>版本号：{version}</p>
          <p>金库余额：{balance} ETH</p>
        </>
      )}
    </div>
  );
};

export default VaultPage;
