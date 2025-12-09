import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import VaultPage from '../pages/VaultPage';
import BankPoolPage from '../pages/BankPoolPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="vault" element={<VaultPage />} />
        <Route path="bank" element={<BankPoolPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
