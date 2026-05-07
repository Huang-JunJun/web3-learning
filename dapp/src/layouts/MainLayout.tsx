import { Layout, Space, Switch, Typography } from 'antd';
import { Outlet } from 'react-router-dom';
import { useArcFiTheme } from '@/common/themeMode';

const { Header, Content } = Layout;

const MainLayout = () => {
  const { isDark, toggleMode } = useArcFiTheme();

  return (
    <Layout style={{ minHeight: '100vh' }} className="app-shell">
      <Header
        className="app-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 24px',
          height: 'auto',
          lineHeight: 'normal',
          fontSize: 20,
          fontWeight: 600,
        }}
      >
        <div className="app-brand">
          <span className="app-brand-title">ArcFi 控制台</span>
        </div>
        <Space size="middle" className="app-header-actions">
          <Space size="small" className="theme-toggle">
            <Typography.Text className="theme-toggle-label">
              {isDark ? '深色' : '浅色'}
            </Typography.Text>
            <Switch
              checked={isDark}
              checkedChildren="深"
              unCheckedChildren="浅"
              onChange={toggleMode}
            />
          </Space>
          <a href="/" className="app-nav-link">
            控制台首页
          </a>
        </Space>
      </Header>

      <Content className="app-content" style={{ padding: 24 }}>
        <div className="page-shell">
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default MainLayout;
