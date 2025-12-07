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
    <Space size="middle" style={{ width: '100%' }}>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="地址">
          <Text copyable>{address}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="网络">
          <Space>
            <Tag color="geekblue">{chainNetwork || '未知网络'}</Tag>
            <Text type="secondary">Chain ID: {chainId ?? '-'}</Text>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="余额">{balance ? `${balance} ETH` : '-'}</Descriptions.Item>
      </Descriptions>

      {onDisconnect && (
        <Button danger onClick={onDisconnect}>
          断开连接
        </Button>
      )}
    </Space>
  );
};

export default WalletInfo;
