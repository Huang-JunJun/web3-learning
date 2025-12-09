import { useEffect, useState } from 'react';
import { Card, Button, Descriptions, Space, Input, Typography, Divider, Alert } from 'antd';
import { useWallet } from '../../hooks/useWallet';
import { useBankPool } from '../../hooks/useBankPool';
import { formatAmount } from '@/common/utils';

const BankPoolPage = () => {
  const { provider, address, connectWallet, signer } = useWallet();
  const {
    loadTotalAssets,
    loadTotalShares,
    loadUserShares,
    loadPreviewWithdraw,
    deposit,
    withdraw,
  } = useBankPool(provider);

  const [totalAssets, setTotalAssets] = useState('');
  const [totalShares, setTotalShares] = useState('');
  const [userShares, setUserShares] = useState('');
  const [previewAssets, setPreviewAssets] = useState<string | null>(null);

  const [infoLoading, setInfoLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawShares, setWithdrawShares] = useState('');
  const [error, setError] = useState('');

  const refreshInfo = async () => {
    if (!address) {
      return;
    }
    try {
      setError('');
      setInfoLoading(true);
      const [assets, shares, user] = await Promise.all([
        loadTotalAssets(),
        loadTotalShares(),
        loadUserShares(address),
      ]);
      setTotalAssets(assets);
      setTotalShares(shares);
      setUserShares(user);
      const preview = await loadPreviewWithdraw(address);
      setPreviewAssets(preview);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setInfoLoading(false);
    }
  };

  useEffect(() => {
    if (!provider || !address) {
      return;
    }
    const run = async () => {
      await refreshInfo();
    };
    run();
  }, [provider, address]);

  const handleDeposit = async () => {
    try {
      setError('');
      if (!provider || !address || !signer) {
        setError('请先连接钱包');
        return;
      }
      if (!depositAmount) {
        setError('请输入存款金额');
        return;
      }
      setDepositLoading(true);
      await deposit(depositAmount, signer);
      setDepositAmount('');
      await refreshInfo();
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
        setError('请先连接钱包');
        return;
      }
      if (!withdrawShares) {
        setError('请输入赎回份额');
        return;
      }
      setWithdrawLoading(true);
      await withdraw(withdrawShares, signer);
      setWithdrawShares('');
      await refreshInfo();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setWithdrawLoading(false);
    }
  };

  if (!address) {
    return (
      <Card>
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <Typography.Title level={3}>ETH 资金池（BankPool）</Typography.Title>
          <Typography.Text>请先连接钱包再进行存款或赎回操作。</Typography.Text>
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
        <Typography.Title level={3}>ETH 资金池（BankPool）</Typography.Title>

        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="池子总资产">
              {formatAmount(totalAssets, 4)} ETH
            </Descriptions.Item>

            <Descriptions.Item label="池子总份额">{formatAmount(totalShares, 4)}</Descriptions.Item>

            <Descriptions.Item label="我的份额">{formatAmount(userShares, 4)}</Descriptions.Item>

            <Descriptions.Item label="按当前份额可赎回">
              {formatAmount(previewAssets, 4)} ETH
            </Descriptions.Item>
          </Descriptions>

          <Button
            type="default"
            loading={infoLoading || depositLoading || withdrawLoading}
            disabled={depositLoading || withdrawLoading}
            onClick={refreshInfo}
          >
            刷新池子信息
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
            <Button
              type="primary"
              loading={depositLoading}
              disabled={withdrawLoading}
              onClick={handleDeposit}
            >
              存款
            </Button>
          </Space>
        </Space>

        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Typography.Title level={5}>赎回份额</Typography.Title>
          <Space orientation="horizontal" size="middle">
            <Input
              placeholder="输入要赎回的 shares 数量"
              value={withdrawShares}
              onChange={(e) => setWithdrawShares(e.target.value)}
              style={{ width: 240 }}
            />
            <Button
              danger
              type="primary"
              loading={withdrawLoading}
              disabled={depositLoading}
              onClick={handleWithdraw}
            >
              赎回
            </Button>
          </Space>
        </Space>

        {error && <Alert type="error" title="操作失败" description={error} showIcon />}
      </Space>
    </Card>
  );
};

export default BankPoolPage;
