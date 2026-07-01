import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import FundListPage from '@/pages/FundListPage';
import FundDetailPage from '@/pages/FundDetailPage';
import WatchlistPage from '@/pages/WatchlistPage';
import ComparePage from '@/pages/ComparePage';

/**
 * 根组件
 * 配置路由：
 * - /              -> HomePage
 * - /funds         -> FundListPage
 * - /funds/:code   -> FundDetailPage
 * - /watchlist     -> WatchlistPage
 * - /compare       -> ComparePage
 * 所有路由共享 Layout（含动态背景、导航栏、页脚）
 */
const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/funds" element={<FundListPage />} />
        <Route path="/funds/:code" element={<FundDetailPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Route>
    </Routes>
  );
};

export default App;
