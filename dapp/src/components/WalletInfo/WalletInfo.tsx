// src/components/WalletInfo/WalletInfo.tsx
import { Descriptions, Button, Space, Tag, Typography } from 'antd';

const { Text } = Typography;

type WalletInfoProps = {
  address: string | null;
  chainId: string | null;
  chainNetwork: string | null;
  balance: string | null;
  onDisconnect?: () => void;
};

const WalletInfo = ({ address, chainId, chainNetwork, balance, onDisconnect }: WalletInfoProps) => {
  if (!address) {
    return <Text>钱包未连接</Text>;
  }

  return (
    <Space size="middle" className="wallet-card" style={{ width: '100%' }}>
      <Descriptions column={1} bordered size="small" className="summary-descriptions">
        <Descriptions.Item label="当前钱包">
          <Text copyable>{address}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="当前网络">
          <Space>
            <Tag color="geekblue">{chainNetwork || '未知网络'}</Tag>
            <Text type="secondary">Chain ID: {chainId ?? '-'}</Text>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="钱包余额">{balance ? `${balance} ETH` : '-'}</Descriptions.Item>
      </Descriptions>

      {onDisconnect && (
        <div className="wallet-actions">
          <Button danger onClick={onDisconnect}>
            断开连接
          </Button>
        </div>
      )}
    </Space>
  );
};

export default WalletInfo;
