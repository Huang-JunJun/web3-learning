import { ConfigProvider, theme } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#4c8dff',
          colorInfo: '#4c8dff',
          colorSuccess: '#27c281',
          colorWarning: '#f5b740',
          colorError: '#ff6b6b',
          colorBgBase: '#070b14',
          colorBgContainer: '#101725',
          colorBgElevated: '#121b2b',
          colorBorder: 'rgba(132, 153, 191, 0.22)',
          colorBorderSecondary: 'rgba(132, 153, 191, 0.14)',
          colorText: '#f5f7ff',
          colorTextSecondary: 'rgba(226, 234, 255, 0.68)',
          borderRadius: 16,
          borderRadiusLG: 20,
          boxShadowSecondary: '0 18px 50px rgba(0, 0, 0, 0.28)',
        },
      }}
    >
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
