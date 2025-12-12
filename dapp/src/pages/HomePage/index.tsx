import { Card, Button, Space, Typography, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import WalletInfo from '../../components/WalletInfo/WalletInfo';

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
  const { address, chainId, chainNetwork, balance, connectWallet, disconnectWallet } = useWallet();

  const moduleCardStyle: React.CSSProperties = {
    width: '100%',
    height: 220,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Card hoverable>
        <Title level={3}>当前钱包</Title>
        {address ? (
          <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
            <WalletInfo
              address={address}
              chainId={chainId}
              chainNetwork={chainNetwork}
              balance={balance}
              onDisconnect={disconnectWallet}
            />
          </Space>
        ) : (
          <Button type="primary" onClick={connectWallet}>
            连接 MetaMask
          </Button>
        )}
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card hoverable style={moduleCardStyle}>
            <Space orientation="vertical" size="small">
              <Title level={4} style={{ marginBottom: 0 }}>
                代币管理 MyTokenV2
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                铸造测试代币、给指定地址转账，并查看授权额度与合约地址。
              </Paragraph>
            </Space>
            <Link to="/token">
              <Button type="primary" block>
                进入代币管理模块
              </Button>
            </Link>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card hoverable style={moduleCardStyle}>
            <Space orientation="vertical" size="small">
              <Title level={4} style={{ marginBottom: 0 }}>
                金库 SimpleVaultSafe
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                查看金库版本号、余额，并后续进行存款、取款等操作。
              </Paragraph>
            </Space>
            <Link to="/vault">
              <Button type="primary" block>
                进入金库模块
              </Button>
            </Link>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card hoverable style={moduleCardStyle}>
            <Space orientation="vertical" size="small">
              <Title level={4} style={{ marginBottom: 0 }}>
                质押池 StakingPool
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                后续将接入质押收益模块，支持存入、提取与领取奖励。
              </Paragraph>
            </Space>
            <Link to="/staking">
              <Button type="primary" block>
                进入质押池模块
              </Button>
            </Link>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card hoverable style={moduleCardStyle}>
            <Space orientation="vertical" size="small">
              <Title level={4} style={{ marginBottom: 0 }}>
                资金池 BankPool
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                模拟流动性资金池与份额分配逻辑，用于深入理解 DeFi。
              </Paragraph>
            </Space>
            <Link to="/bank">
              <Button type="primary" block>
                进入资金池模块
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>

      <Card hoverable>
        <Title level={4}>学习进度</Title>
        <Paragraph>
          <Text>
            当前已完成：钱包连接、SimpleVaultSafe 金库读写、BankPool ETH 资金池前端接入、StakingPool
            质押池基础交互，以及 MyTokenV2 代币管理入口。
          </Text>
          <br />
          <Text>
            下一步：完善 StakingPool 奖励分发与收益展示，并继续优化整体 UI 与合约交互体验。
          </Text>
        </Paragraph>
      </Card>
    </Space>
  );
};

export default HomePage;
