import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, Space, Typography, Descriptions, Input, Button, Divider, message } from 'antd';
import { ethers } from 'ethers';
import { useWallet } from '@/hooks/useWallet';
import { useStakingPool } from '@/hooks/useStakingPool';
import { humanizeEthersError } from '@/common/humanizeEthersError';
import { STAKING_POOL_ADDRESS } from '@/config';

const StakingPoolPage = () => {
  const { provider, address, signer, connectWallet } = useWallet();
  const {
    loadTokenDecimals,
    loadTotalStaked,
    loadTotalStakedRaw,
    loadUserStaked,
    loadUserEarned,
    loadAllowance,
    loadAllowanceRaw,
    approve,
    stake,
    unstake,
    harvest,
    loadTokenOwner,
    loadPoolOwner,
    loadPoolTokenBalanceRaw,
    injectReward,
    rewardTransfer,
    distributeOnly,
    distributeReward,
  } = useStakingPool(provider);

  const [tokenDecimals, setTokenDecimals] = useState(18);

  const [totalStaked, setTotalStaked] = useState('');
  const [userStaked, setUserStaked] = useState('');
  const [earned, setEarned] = useState('');
  const [allowance, setAllowance] = useState('');
  const [allowanceRaw, setAllowanceRaw] = useState<bigint>(0n);
  const [poolOwner, setPoolOwner] = useState('');
  const [tokenOwner, setTokenOwner] = useState('');
  const [rewardPoolBalance, setRewardPoolBalance] = useState('');

  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [injectAmount, setInjectAmount] = useState('');
  const [rewardTo, setRewardTo] = useState('');
  const [rewardPayAmount, setRewardPayAmount] = useState('');

  const [infoLoading, setInfoLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [stakeLoading, setStakeLoading] = useState(false);
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [harvestLoading, setHarvestLoading] = useState(false);
  const [distributeLoading, setDistributeLoading] = useState(false);
  const [rewardPayLoading, setRewardPayLoading] = useState(false);
  const [injectLoading, setInjectLoading] = useState(false);

  const txBusy =
    approveLoading ||
    stakeLoading ||
    unstakeLoading ||
    harvestLoading ||
    distributeLoading ||
    rewardPayLoading ||
    injectLoading;
  const isPoolOwner =
    poolOwner && address ? poolOwner.toLowerCase() === address.toLowerCase() : false;
  const isTokenOwner =
    tokenOwner && address ? tokenOwner.toLowerCase() === address.toLowerCase() : false;

  const infoRequestIdRef = useRef(0);

  const refreshInfo = useCallback(async (): Promise<boolean> => {
    if (!address) return false;

    const requestId = ++infoRequestIdRef.current;
    try {
      setInfoLoading(true);
      const [total, staked, reward, a, aRaw] = await Promise.all([
        loadTotalStaked(),
        loadUserStaked(address),
        loadUserEarned(address),
        loadAllowance(address),
        loadAllowanceRaw(address),
      ]);
      const [poolO, tokenO, poolBalRaw, totalRaw] = await Promise.all([
        loadPoolOwner(),
        loadTokenOwner(),
        loadPoolTokenBalanceRaw(),
        loadTotalStakedRaw(),
      ]);
      if (infoRequestIdRef.current !== requestId) return false;
      setTotalStaked(total);
      setUserStaked(staked);
      setEarned(reward);
      setAllowance(a);
      setAllowanceRaw(aRaw);
      setPoolOwner(poolO);
      setTokenOwner(tokenO);
      const rewardRaw = poolBalRaw > totalRaw ? poolBalRaw - totalRaw : 0n;
      setRewardPoolBalance(ethers.formatUnits(rewardRaw, tokenDecimals));
      return true;
    } catch (e: any) {
      if (infoRequestIdRef.current !== requestId) return false;
      message.error(humanizeEthersError(e));
      return false;
    } finally {
      if (infoRequestIdRef.current === requestId) {
        setInfoLoading(false);
      }
    }
  }, [
    address,
    loadAllowance,
    loadAllowanceRaw,
    loadPoolOwner,
    loadPoolTokenBalanceRaw,
    loadTokenOwner,
    loadTotalStaked,
    loadTotalStakedRaw,
    loadUserEarned,
    loadUserStaked,
    tokenDecimals,
  ]);

  const handleRefresh = async () => {
    const ok = await refreshInfo();
    if (ok) message.success('质押信息已刷新');
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
  }, [loadTokenDecimals, provider]);

  useEffect(() => {
    if (!provider || !address) {
      return;
    }
    void refreshInfo();
  }, [address, provider, refreshInfo]);

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
      if (!provider || !address || !signer) {
        message.warning('请先连接钱包');
        return;
      }
      if (!stakeAmount) {
        message.warning('请输入质押数量');
        return;
      }
      setApproveLoading(true);
      await approve(stakeAmount, signer);
      message.success('授权成功');
      await refreshInfo();
    } catch (e: any) {
      message.error(humanizeEthersError(e));
    } finally {
      setApproveLoading(false);
    }
  };

  const handleStake = async () => {
    try {
      if (!provider || !address || !signer) {
        message.warning('请先连接钱包');
        return;
      }
      if (!stakeAmount) {
        message.warning('请输入质押数量');
        return;
      }
      setStakeLoading(true);
      await stake(stakeAmount, signer);
      message.success('质押成功');
      setStakeAmount('');
      await refreshInfo();
    } catch (e: any) {
      message.error(humanizeEthersError(e));
    } finally {
      setStakeLoading(false);
    }
  };

  const handleUnstake = async () => {
    try {
      if (!provider || !address || !signer) {
        message.warning('请先连接钱包');
        return;
      }
      if (!unstakeAmount) {
        message.warning('请输入解除质押数量');
        return;
      }
      setUnstakeLoading(true);
      await unstake(unstakeAmount, signer);
      message.success('解除质押成功');
      setUnstakeAmount('');
      await refreshInfo();
    } catch (e: any) {
      message.error(humanizeEthersError(e));
    } finally {
      setUnstakeLoading(false);
    }
  };

  const handleHarvest = async () => {
    try {
      if (!provider || !address || !signer) {
        message.warning('请先连接钱包');
        return;
      }
      setHarvestLoading(true);
      await harvest(signer);
      message.success('领取奖励成功');
      await refreshInfo();
    } catch (e: any) {
      message.error(humanizeEthersError(e));
    } finally {
      setHarvestLoading(false);
    }
  };

  const handleDistribute = async () => {
    try {
      if (!provider || !address || !signer) {
        message.warning('请先连接钱包');
        return;
      }
      if (!isPoolOwner) {
        message.warning('只有池子 Owner 才能派发奖励');
        return;
      }
      if (!rewardAmount) {
        message.warning('请输入派发奖励数量');
        return;
      }
      setDistributeLoading(true);
      await distributeReward(rewardAmount, signer);
      message.success('派发奖励成功');
      setRewardAmount('');
      await refreshInfo();
    } catch (e: any) {
      message.error(humanizeEthersError(e));
    } finally {
      setDistributeLoading(false);
    }
  };

  const handleInject = async () => {
    try {
      if (!provider || !address || !signer) {
        message.warning('请先连接钱包');
        return;
      }
      if (!isPoolOwner) {
        message.warning('只有池子 Owner 才能注入奖励');
        return;
      }
      if (!injectAmount) {
        message.warning('请输入注入奖励数量');
        return;
      }
      setInjectLoading(true);
      await injectReward(injectAmount, signer);
      message.success('奖励已注入质押池');
      setInjectAmount('');
      await refreshInfo();
    } catch (e: any) {
      message.error(humanizeEthersError(e));
    } finally {
      setInjectLoading(false);
    }
  };

  const handleDistributeOnly = async () => {
    try {
      if (!provider || !address || !signer) {
        message.warning('请先连接钱包');
        return;
      }
      if (!isPoolOwner) {
        message.warning('只有池子 Owner 才能派发奖励');
        return;
      }
      if (!rewardAmount) {
        message.warning('请输入派发奖励数量');
        return;
      }
      setDistributeLoading(true);
      await distributeOnly(rewardAmount, signer);
      message.success('派发奖励成功（使用已注入资金）');
      setRewardAmount('');
      await refreshInfo();
    } catch (e: any) {
      message.error(humanizeEthersError(e));
    } finally {
      setDistributeLoading(false);
    }
  };

  const handleRewardPay = async () => {
    try {
      if (!provider || !address || !signer) {
        message.warning('请先连接钱包');
        return;
      }
      if (!isTokenOwner) {
        message.warning('只有代币部署者（Token Owner）才能发放奖励');
        return;
      }
      const to = (rewardTo || address).trim();
      if (!ethers.isAddress(to)) {
        message.warning('请输入正确的接收地址');
        return;
      }
      if (!rewardPayAmount) {
        message.warning('请输入发放奖励数量');
        return;
      }
      setRewardPayLoading(true);
      await rewardTransfer(to, rewardPayAmount, signer);
      message.success('奖励发放成功（直接转账）');
      setRewardPayAmount('');
      setRewardTo('');
    } catch (e: any) {
      message.error(humanizeEthersError(e));
    } finally {
      setRewardPayLoading(false);
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
            <Descriptions.Item label="质押池地址">{STAKING_POOL_ADDRESS}</Descriptions.Item>
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
            <Descriptions.Item label="奖励池 Token 数量">
              {rewardPoolBalance ? `${rewardPoolBalance} TOKEN` : '0'}
            </Descriptions.Item>
          </Descriptions>
          <Button
            type="default"
            loading={
              infoLoading ||
              approveLoading ||
              stakeLoading ||
              unstakeLoading ||
              harvestLoading ||
              distributeLoading ||
              rewardPayLoading ||
              injectLoading
            }
            disabled={infoLoading || txBusy}
            onClick={handleRefresh}
          >
            刷新质押信息
          </Button>
        </Space>

        <Divider />

        {isPoolOwner && (
          <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
            <Typography.Title level={5}>发放奖励（注入质押池）</Typography.Title>
            <Typography.Text type="secondary">
              Pool Owner 将奖励 Token 直接转入 StakingPool 合约，用于后续派发/用户领取。
            </Typography.Text>
            <Space orientation="horizontal" size="middle">
              <Input
                placeholder="注入奖励数量"
                style={{ width: 240 }}
                value={injectAmount}
                onChange={(e) => setInjectAmount(e.target.value)}
                disabled={infoLoading || txBusy}
              />
              <Button
                type="primary"
                loading={injectLoading}
                disabled={infoLoading || txBusy}
                onClick={handleInject}
              >
                注入到质押池
              </Button>
            </Space>
          </Space>
        )}

        {isTokenOwner && (
          <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
            <Typography.Title level={5}>发放奖励（Token Owner）</Typography.Title>
            <Typography.Text type="secondary">
              直接从代币部署者钱包转账给用户，不经过 StakingPool 记账。
            </Typography.Text>
            <Space orientation="horizontal" size="middle" wrap>
              <Input
                placeholder="接收地址（默认当前用户）"
                style={{ width: 420 }}
                value={rewardTo}
                onChange={(e) => setRewardTo(e.target.value)}
                disabled={infoLoading || txBusy}
              />
              <Input
                placeholder="奖励数量"
                style={{ width: 220 }}
                value={rewardPayAmount}
                onChange={(e) => setRewardPayAmount(e.target.value)}
                disabled={infoLoading || txBusy}
              />
              <Button
                type="primary"
                loading={rewardPayLoading}
                disabled={infoLoading || txBusy}
                onClick={handleRewardPay}
              >
                直接转账发放
              </Button>
            </Space>
          </Space>
        )}

        {isPoolOwner && (
          <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
            <Typography.Title level={5}>派发奖励（Owner）</Typography.Title>
            <Typography.Text type="secondary">
              可选流程：先“注入到质押池”，再点击“仅派发”；或直接点击“转账并派发”（两笔交易）。
            </Typography.Text>
            <Space orientation="horizontal" size="middle">
              <Input
                placeholder="输入派发奖励数量"
                style={{ width: 240 }}
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                disabled={infoLoading || txBusy}
              />
              <Button
                type="default"
                loading={distributeLoading}
                disabled={infoLoading || txBusy}
                onClick={handleDistributeOnly}
              >
                仅派发（已注入）
              </Button>
              <Button
                type="primary"
                loading={distributeLoading}
                disabled={infoLoading || txBusy}
                onClick={handleDistribute}
              >
                转账并派发
              </Button>
            </Space>
          </Space>
        )}

        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Typography.Title level={5}>质押</Typography.Title>
          <Space orientation="horizontal" size="middle">
            <Input
              placeholder="输入要质押的数量"
              style={{ width: 240 }}
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              disabled={infoLoading || txBusy}
            />
            {needApprove ? (
              <Button
                type="primary"
                loading={approveLoading}
                disabled={infoLoading || txBusy}
                onClick={handleApprove}
              >
                先授权
              </Button>
            ) : (
              <Button
                type="primary"
                loading={stakeLoading}
                disabled={infoLoading || txBusy}
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
              disabled={infoLoading || txBusy}
            />
            <Button
              danger
              type="primary"
              loading={unstakeLoading}
              disabled={infoLoading || txBusy}
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
            disabled={infoLoading || txBusy}
            onClick={handleHarvest}
          >
            领取奖励
          </Button>
        </Space>

      </Space>
    </Card>
  );
};

export default StakingPoolPage;
