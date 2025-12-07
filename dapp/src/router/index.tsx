import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import VaultPage from '../pages/VaultPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="vault" element={<VaultPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
