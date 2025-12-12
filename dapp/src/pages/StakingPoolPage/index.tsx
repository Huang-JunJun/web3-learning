import { useEffect, useMemo, useState } from 'react';
import { Card, Space, Typography, Descriptions, Input, Button, Alert, Divider } from 'antd';
import { ethers } from 'ethers';
import { useWallet } from '@/hooks/useWallet';
import { useStakingPool } from '@/hooks/useStakingPool';

const StakingPoolPage = () => {
  const { provider, address, signer, connectWallet } = useWallet();
  const {
    loadTokenDecimals,
    loadTotalStaked,
    loadUserStaked,
    loadUserEarned,
    loadAllowance,
    loadAllowanceRaw,
    approve,
    stake,
    unstake,
    harvest,
  } = useStakingPool(provider);

  const [tokenDecimals, setTokenDecimals] = useState(18);

  const [totalStaked, setTotalStaked] = useState('');
  const [userStaked, setUserStaked] = useState('');
  const [earned, setEarned] = useState('');
  const [allowance, setAllowance] = useState('');
  const [allowanceRaw, setAllowanceRaw] = useState<bigint>(0n);

  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  const [infoLoading, setInfoLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [stakeLoading, setStakeLoading] = useState(false);
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [harvestLoading, setHarvestLoading] = useState(false);

  const [error, setError] = useState('');

  const refreshInfo = async () => {
    if (!address) {
      return;
    }
    try {
      setError('');
      setInfoLoading(true);
      const [total, staked, reward, a, aRaw] = await Promise.all([
        loadTotalStaked(),
        loadUserStaked(address),
        loadUserEarned(address),
        loadAllowance(address),
        loadAllowanceRaw(address),
      ]);
      setTotalStaked(total);
      setUserStaked(staked);
      setEarned(reward);
      setAllowance(a);
      setAllowanceRaw(aRaw);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setInfoLoading(false);
    }
  };

  useEffect(() => {
    if (!provider) {
      return;
    }
    const run = async () => {
      try {
        const d = await loadTokenDecimals();
        setTokenDecimals(d);
      } catch {
        setTokenDecimals(18);
      }
    };
    void run();
  }, [provider]);

  useEffect(() => {
    if (!provider || !address) {
      return;
    }
    const run = async () => {
      await refreshInfo();
    };
    void run();
  }, [provider, address]);

  const needApprove = useMemo(() => {
    if (!stakeAmount) {
      return false;
    }
    try {
      const parsed = ethers.parseUnits(stakeAmount, tokenDecimals);
      return parsed > allowanceRaw;
    } catch {
      return false;
    }
  }, [stakeAmount, tokenDecimals, allowanceRaw]);

  const handleApprove = async () => {
    try {
      setError('');
      if (!provider || !address || !signer) {
        setError('请先连接钱包');
        return;
      }
      if (!stakeAmount) {
        setError('请输入质押数量');
        return;
      }
      setApproveLoading(true);
      await approve(stakeAmount, signer);
      await refreshInfo();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setApproveLoading(false);
    }
  };

  const handleStake = async () => {
    try {
      setError('');
      if (!provider || !address || !signer) {
        setError('请先连接钱包');
        return;
      }
      if (!stakeAmount) {
        setError('请输入质押数量');
        return;
      }
      setStakeLoading(true);
      await stake(stakeAmount, signer);
      setStakeAmount('');
      await refreshInfo();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setStakeLoading(false);
    }
  };

  const handleUnstake = async () => {
    try {
      setError('');
      if (!provider || !address || !signer) {
        setError('请先连接钱包');
        return;
      }
      if (!unstakeAmount) {
        setError('请输入解除质押数量');
        return;
      }
      setUnstakeLoading(true);
      await unstake(unstakeAmount, signer);
      setUnstakeAmount('');
      await refreshInfo();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setUnstakeLoading(false);
    }
  };

  const handleHarvest = async () => {
    try {
      setError('');
      if (!provider || !address || !signer) {
        setError('请先连接钱包');
        return;
      }
      setHarvestLoading(true);
      await harvest(signer);
      await refreshInfo();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setHarvestLoading(false);
    }
  };

  if (!address) {
    return (
      <Card>
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <Typography.Title level={3}>质押池（StakingPool）</Typography.Title>
          <Typography.Text>请先连接钱包后再进行质押、解除质押或领取奖励操作。</Typography.Text>
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
        <Typography.Title level={3}>质押池（StakingPool）</Typography.Title>

        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="池子总质押">
              {totalStaked ? `${totalStaked} TOKEN` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="我的质押">
              {userStaked ? `${userStaked} TOKEN` : '0'}
            </Descriptions.Item>
            <Descriptions.Item label="当前可领取奖励">
              {earned ? `${earned} TOKEN` : '0'}
            </Descriptions.Item>
            <Descriptions.Item label="当前授权额度">
              {allowance ? `${allowance} TOKEN` : '0'}
            </Descriptions.Item>
          </Descriptions>
          <Button
            type="default"
            loading={
              infoLoading || approveLoading || stakeLoading || unstakeLoading || harvestLoading
            }
            disabled={approveLoading || stakeLoading || unstakeLoading || harvestLoading}
            onClick={refreshInfo}
          >
            刷新质押信息
          </Button>
        </Space>

        <Divider />

        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Typography.Title level={5}>质押</Typography.Title>
          <Space orientation="horizontal" size="middle">
            <Input
              placeholder="输入要质押的数量"
              style={{ width: 240 }}
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
            />
            {needApprove ? (
              <Button
                type="primary"
                loading={approveLoading}
                disabled={stakeLoading || unstakeLoading || harvestLoading}
                onClick={handleApprove}
              >
                先授权
              </Button>
            ) : (
              <Button
                type="primary"
                loading={stakeLoading}
                disabled={approveLoading || unstakeLoading || harvestLoading}
                onClick={handleStake}
              >
                质押
              </Button>
            )}
          </Space>
        </Space>

        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Typography.Title level={5}>解除质押</Typography.Title>
          <Space orientation="horizontal" size="middle">
            <Input
              placeholder="输入要解除的质押数量"
              style={{ width: 240 }}
              value={unstakeAmount}
              onChange={(e) => setUnstakeAmount(e.target.value)}
            />
            <Button
              danger
              type="primary"
              loading={unstakeLoading}
              disabled={approveLoading || stakeLoading || harvestLoading}
              onClick={handleUnstake}
            >
              解除质押
            </Button>
          </Space>
        </Space>

        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Typography.Title level={5}>奖励</Typography.Title>
          <Button
            type="primary"
            loading={harvestLoading}
            disabled={approveLoading || stakeLoading || unstakeLoading}
            onClick={handleHarvest}
          >
            领取奖励
          </Button>
        </Space>

        {error && <Alert type="error" title="操作失败" description={error} showIcon />}
      </Space>
    </Card>
  );
};

export default StakingPoolPage;
