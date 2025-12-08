import { useState } from 'react';
import { Card, Button, Descriptions, Space, Input, Typography, Divider } from 'antd';
import { useWallet } from '../../hooks/useWallet';
import { useSimpleVault } from '../../hooks/useSimpleVault';
import { useEffect } from 'react';

const VaultPage = () => {
  const { provider, address, connectWallet, signer } = useWallet();
  const { loadVersion, loadVaultBalance, deposit, withdraw } = useSimpleVault(provider);

  const [version, setVersion] = useState('');
  const [balance, setBalance] = useState('');
  const [infoLoading, setInfoLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [error, setError] = useState('');

  const handleLoadInfo = async () => {
    try {
      setError('');
      if (!provider || !address) {
        alert('请先连接钱包');
        return;
      }
      setInfoLoading(true);
      const v = await loadVersion();
      const b = await loadVaultBalance();
      setVersion(v);
      setBalance(b);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setInfoLoading(false);
    }
  };

  const handleDeposit = async () => {
    try {
      setError('');
      if (!provider || !address || !signer) {
        alert('请先连接钱包');
        return;
      }
      if (!depositAmount) {
        alert('请输入存款金额');
        return;
      }
      setDepositLoading(true);
      await deposit(depositAmount, signer);
      const b = await loadVaultBalance();
      setBalance(b);
      setDepositAmount('');
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setDepositLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setError('');
      if (!provider || !address || !signer) {
        alert('请先连接钱包');
        return;
      }
      if (!withdrawAmount) {
        alert('请输入取款金额');
        return;
      }
      setWithdrawLoading(true);
      await withdraw(withdrawAmount, signer);
      const b = await loadVaultBalance();
      setBalance(b);
      setWithdrawAmount('');
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setWithdrawLoading(false);
    }
  };

  useEffect(() => {
    if (!provider || !address) {
      return;
    }
    const run = async () => {
      try {
        setError('');
        setInfoLoading(true);
        const v = await loadVersion();
        const b = await loadVaultBalance();
        setVersion(v);
        setBalance(b);
      } catch (e: any) {
        setError(e?.message ?? String(e));
      } finally {
        setInfoLoading(false);
      }
    };
    run();
  }, [provider, address, loadVersion, loadVaultBalance]);

  if (!address) {
    return (
      <Card>
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <Typography.Title level={3}>SimpleVaultSafe 金库</Typography.Title>
          <Typography.Text>请先连接钱包以加载金库信息。</Typography.Text>
          <Button type="primary" onClick={connectWallet}>
            连接钱包
          </Button>
        </Space>
      </Card>
    );
  }

  return (
    <Card>
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Typography.Title level={3}>SimpleVaultSafe 金库</Typography.Title>

        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="当前地址">{address}</Descriptions.Item>
            <Descriptions.Item label="版本号">{version || '-'}</Descriptions.Item>
            <Descriptions.Item label="金库余额">
              {balance ? `${balance} ETH` : '-'}
            </Descriptions.Item>
          </Descriptions>
          <Button
            type="default"
            loading={infoLoading || depositLoading || withdrawLoading}
            disabled={depositLoading || withdrawLoading}
            onClick={handleLoadInfo}
          >
            读取金库信息
          </Button>
        </Space>

        <Divider />

        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Typography.Title level={5}>存入 ETH</Typography.Title>
          <Space orientation="horizontal" size="middle">
            <Input
              placeholder="输入存款金额，例如 0.1"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              style={{ width: 200 }}
            />
            <Button type="primary" loading={depositLoading} onClick={handleDeposit}>
              存款
            </Button>
          </Space>
        </Space>

        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Typography.Title level={5}>取出 ETH</Typography.Title>
          <Space orientation="horizontal" size="middle">
            <Input
              placeholder="输入取款金额，例如 0.05"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              style={{ width: 200 }}
            />
            <Button danger type="primary" loading={withdrawLoading} onClick={handleWithdraw}>
              取款
            </Button>
          </Space>
        </Space>

        {error && <Typography.Text type="danger">{error}</Typography.Text>}
      </Space>
    </Card>
  );
};

export default VaultPage;
