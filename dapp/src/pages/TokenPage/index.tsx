import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, Space, Typography, Descriptions, Input, Button, Alert, Divider, message } from 'antd';
import { ethers } from 'ethers';
import { useWallet } from '@/hooks/useWallet';
import tokenABI from '@/abis/MyTokenV2.json';
import { MYTOKENV2_ADDRESS, STAKING_POOL_ADDRESS } from '@/config';
import { humanizeEthersError } from '@/common/humanizeEthersError';

const TokenPage = () => {
  const { provider, signer, address, connectWallet } = useWallet();

  const [totalSupply, setTotalSupply] = useState('');
  const [balance, setBalance] = useState('');
  const [allowance, setAllowance] = useState('');
  const [tokenOwner, setTokenOwner] = useState('');

  const [mintAmount, setMintAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [approveAmount, setApproveAmount] = useState('');

  const [loading, setLoading] = useState(false);
  const txBusy = loading;
  const isOwner =
    tokenOwner && address ? tokenOwner.toLowerCase() === address.toLowerCase() : false;

  const getTokenContract = useCallback(() => {
    if (!provider) {
      throw new Error('Provider not ready');
    }
    return new ethers.Contract(MYTOKENV2_ADDRESS, tokenABI.abi, provider);
  }, [provider]);

  const infoRequestIdRef = useRef(0);

  const refreshInfo = useCallback(async (): Promise<boolean> => {
    if (!provider || !address) {
      return false;
    }
    const requestId = ++infoRequestIdRef.current;
    try {
      const token = getTokenContract();
      const decimals = await token.decimals();

      const [owner, supply, bal, alw] = await Promise.all([
        token.owner(),
        token.totalSupply(),
        token.balanceOf(address),
        token.allowance(address, STAKING_POOL_ADDRESS),
      ]);

      if (infoRequestIdRef.current !== requestId) return false;
      setTokenOwner(owner);
      setTotalSupply(ethers.formatUnits(supply, decimals));
      setBalance(ethers.formatUnits(bal, decimals));
      setAllowance(ethers.formatUnits(alw, decimals));
      return true;
    } catch (e: any) {
      if (infoRequestIdRef.current !== requestId) return false;
      message.error(humanizeEthersError(e));
      return false;
    } finally {
      // no loading state for refreshInfo yet
    }
  }, [address, getTokenContract, provider]);

  useEffect(() => {
    if (provider && address) {
      void refreshInfo();
    }
  }, [address, provider, refreshInfo]);

  const handleMint = async () => {
    try {
      setLoading(true);
      if (!signer) {
        message.warning('请先连接钱包');
        return;
      }
      if (!mintAmount) {
        message.warning('请输入铸造数量');
        return;
      }
      const token = new ethers.Contract(MYTOKENV2_ADDRESS, tokenABI.abi, signer);
      const decimals = await token.decimals();
      const tx = await token.mint(ethers.parseUnits(mintAmount, decimals));
      await tx.wait();
      setMintAmount('');
      await refreshInfo();
      message.success('铸造成功');
    } catch (e: any) {
      message.error(humanizeEthersError(e));
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    try {
      setLoading(true);
      if (!signer) {
        message.warning('请先连接钱包');
        return;
      }
      if (!transferTo) {
        message.warning('请输入接收地址');
        return;
      }
      if (!transferAmount) {
        message.warning('请输入转账数量');
        return;
      }
      const token = new ethers.Contract(MYTOKENV2_ADDRESS, tokenABI.abi, signer);
      const decimals = await token.decimals();
      const tx = await token.transfer(transferTo, ethers.parseUnits(transferAmount, decimals));
      await tx.wait();
      setTransferTo('');
      setTransferAmount('');
      await refreshInfo();
      message.success('转账成功');
    } catch (e: any) {
      message.error(humanizeEthersError(e));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setLoading(true);
      if (!signer) {
        message.warning('请先连接钱包');
        return;
      }
      if (!approveAmount) {
        message.warning('请输入授权数量');
        return;
      }
      const token = new ethers.Contract(MYTOKENV2_ADDRESS, tokenABI.abi, signer);
      const decimals = await token.decimals();
      const tx = await token.approve(
        STAKING_POOL_ADDRESS,
        ethers.parseUnits(approveAmount, decimals),
      );
      await tx.wait();
      setApproveAmount('');
      await refreshInfo();
      message.success('授权成功');
    } catch (e: any) {
      message.error(humanizeEthersError(e));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    const ok = await refreshInfo();
    if (ok) message.success('代币信息已刷新');
  };

  if (!address) {
    return (
      <Card>
        <Space orientation="vertical">
          <Typography.Title level={3}>代币管理 MyTokenV2</Typography.Title>
          <Typography.Text>请先连接钱包</Typography.Text>
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
        <Typography.Title level={3}>代币管理 MyTokenV2</Typography.Title>

        <Descriptions bordered column={1}>
          <Descriptions.Item label="Token 合约地址">{MYTOKENV2_ADDRESS}</Descriptions.Item>
          <Descriptions.Item label="Token Owner（初始持有者）">
            {tokenOwner || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="我的钱包地址">{address}</Descriptions.Item>
          <Descriptions.Item label="StakingPool 合约地址">{STAKING_POOL_ADDRESS}</Descriptions.Item>
          <Descriptions.Item label="总供应量">{totalSupply || '-'}</Descriptions.Item>
          <Descriptions.Item label="我的余额">{balance || '0'}</Descriptions.Item>
          <Descriptions.Item label="allowance(我的地址 → 质押池)">
            {allowance || '0'}
          </Descriptions.Item>
        </Descriptions>

        <Button onClick={handleRefresh} disabled={txBusy}>
          刷新代币信息
        </Button>

        <Alert
          type={isOwner ? 'success' : 'warning'}
          title={isOwner ? '当前钱包是 Token Owner' : '当前钱包不是 Token Owner'}
          description={
            isOwner
              ? '你可以执行铸造（mint）与对外转账（transfer）。'
              : '你无法铸造（mint）。如需给自己发币，请切换到 Token Owner 钱包或让 Owner 转账给你。'
          }
          showIcon
        />

        <Divider />

        <Card size="small" title="Owner 操作区" style={{ width: '100%' }}>
          <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
            <Space orientation="vertical">
              <Typography.Title level={5}>铸造（mint）</Typography.Title>
              <Space>
                <Input
                  style={{ width: 300 }}
                  placeholder="铸造数量"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  disabled={!isOwner || txBusy}
                />
                <Button
                  type="primary"
                  loading={loading}
                  onClick={handleMint}
                  disabled={!isOwner || txBusy}
                >
                  铸造
                </Button>
              </Space>
            </Space>

            <Space orientation="vertical">
              <Typography.Title level={5}>转账（transfer）</Typography.Title>
              <Space>
                <Input
                  style={{ width: 400 }}
                  placeholder="接收地址"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  disabled={!isOwner || txBusy}
                />
                <Input
                  style={{ width: 200 }}
                  placeholder="数量"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  disabled={!isOwner || txBusy}
                />
                <Button loading={loading} onClick={handleTransfer} disabled={!isOwner || txBusy}>
                  转账
                </Button>
              </Space>
            </Space>
          </Space>
        </Card>

        <Card size="small" title="普通用户操作区" style={{ width: '100%' }}>
          <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
            <Space orientation="vertical">
              <Typography.Title level={5}>授权给质押池（approve）</Typography.Title>
              <Typography.Text type="secondary">
                你是在 MyTokenV2 上发起
                approve：授权人是你的钱包地址（owner），被授权方是质押池合约（spender）。
              </Typography.Text>
              <Space>
                <Input
                  style={{ width: 300 }}
                  placeholder="授权数量（给质押池可用）"
                  value={approveAmount}
                  onChange={(e) => setApproveAmount(e.target.value)}
                  disabled={txBusy}
                />
                <Button type="primary" loading={loading} onClick={handleApprove} disabled={txBusy}>
                  授权
                </Button>
              </Space>
            </Space>
          </Space>
        </Card>

      </Space>
    </Card>
  );
};

export default TokenPage;
