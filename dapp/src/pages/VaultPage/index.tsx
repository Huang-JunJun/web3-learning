import { useState } from 'react';
import { Card, Button, Descriptions, Space } from 'antd';
import { useWallet } from '../../hooks/useWallet';
import { useSimpleVault } from '../../hooks/useSimpleVault';

const VaultPage = () => {
  const { provider, address, connectWallet } = useWallet();
  const { loadVersion, loadVaultBalance } = useSimpleVault(provider);

  const [version, setVersion] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoad = async () => {
    try {
      setError('');
      if (!provider) {
        alert('请先连接钱包');
        return;
      }
      setLoading(true);
      const v = await loadVersion();
      const b = await loadVaultBalance();
      setVersion(v);
      setBalance(b);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Space size="middle" style={{ width: '100%' }}>
        {!address ? (
          <Button type="primary" onClick={connectWallet}>
            连接钱包
          </Button>
        ) : (
          <>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="当前地址">{address}</Descriptions.Item>
              <Descriptions.Item label="版本号">{version || '-'}</Descriptions.Item>
              <Descriptions.Item label="金库余额">
                {balance ? `${balance} ETH` : '-'}
              </Descriptions.Item>
            </Descriptions>

            <Button type="primary" loading={loading} onClick={handleLoad}>
              读取金库信息
            </Button>

            {error && <span style={{ color: '#ff4d4f' }}>{error}</span>}
          </>
        )}
      </Space>
    </Card>
  );
};

export default VaultPage;
