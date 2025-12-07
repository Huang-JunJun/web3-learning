// src/router/index.tsx
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import VaultPage from '../pages/VaultPage';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/vault" element={<VaultPage />} />
    </Routes>
  );
};
