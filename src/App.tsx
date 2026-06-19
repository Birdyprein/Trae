import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import FundListPage from '@/pages/FundListPage';
import FundDetailPage from '@/pages/FundDetailPage';
import WatchlistPage from '@/pages/WatchlistPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/funds" element={<FundListPage />} />
          <Route path="/funds/:id" element={<FundDetailPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}