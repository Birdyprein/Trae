import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ArrowRight, LayoutGrid, Star, Briefcase } from 'lucide-react';
import type { Fund, MarketIndex, NavPoint } from '@/types';
import { fetchMarketIndices, fetchIndexHistory, fetchFundList } from '@/services/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ComplianceNotice from '@/components/common/ComplianceNotice';
import MarketIndexCard from '@/components/market/MarketIndexCard';
import MarketTrendChart from '@/components/market/MarketTrendChart';
import SectorBoard from '@/components/market/SectorBoard';
import FundCard from '@/components/fund/FundCard';
import SIPCalculator from '@/components/calculator/SIPCalculator';

export default function HomePage() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [indicesLoading, setIndicesLoading] = useState(true);

  const [trendData, setTrendData] = useState<NavPoint[]>([]);
  const [trendLoading, setTrendLoading] = useState(true);

  const [funds, setFunds] = useState<Fund[]>([]);
  const [fundsLoading, setFundsLoading] = useState(true);

  const [sipOpen, setSipOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMarketIndices();
        setIndices(data);
      } finally {
        setIndicesLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchIndexHistory(30);
        setTrendData(data);
      } finally {
        setTrendLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchFundList(1, 6, { sortBy: 'year1Return', sortOrder: 'desc' });
        setFunds(res.funds ?? []);
      } finally {
        setFundsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="section-container section-padding space-y-8 sm:space-y-10">
      {/* Hero 区域 */}
      <section className="glass-card p-6 sm:p-10 lg:p-14 relative overflow-hidden animate-slide-up">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            <span className="gradient-text-gold">洞察市场脉搏</span>
            <br />
            <span className="text-white">科学配置基金资产</span>
          </h1>
          <p className="mt-4 text-secondary text-sm sm:text-base leading-relaxed max-w-2xl">
            一站式基金信息展示与分析平台，提供市场指数、板块行情、基金筛选、组合穿透分析等全链路工具，
            助您在透明数据中做出明智决策。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSipOpen(true)}
              className="glass-button-gold inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium"
            >
              <Calculator className="w-4 h-4" />
              定投计算器
            </button>
            <Link
              to="/funds"
              className="glass-button inline-flex items-center gap-2 px-5 py-2.5 text-sm text-white font-medium"
            >
              <LayoutGrid className="w-4 h-4" />
              浏览基金
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/portfolio"
              className="glass-button inline-flex items-center gap-2 px-5 py-2.5 text-sm text-white font-medium"
            >
              <Briefcase className="w-4 h-4" />
              查看持仓
            </Link>
            <Link
              to="/watchlist"
              className="glass-button inline-flex items-center gap-2 px-5 py-2.5 text-sm text-white font-medium"
            >
              <Star className="w-4 h-4" />
              查看自选
            </Link>
          </div>
        </div>
      </section>

      {/* 市场指数 */}
      <section>
        <SectionHeader title="市场指数" subtitle="实时跟踪主流指数行情" />
        {indicesLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {indices.length === 0 ? (
              <div className="col-span-full text-center text-muted text-sm py-8">暂无指数数据</div>
            ) : (
              indices.slice(0, 6).map((idx) => (
                <MarketIndexCard key={idx.code} index={idx} />
              ))
            )}
          </div>
        )}
      </section>

      {/* 市场趋势图 */}
      <section>
        <SectionHeader title="上证指数 30 日走势" subtitle="近期市场趋势概览" />
        <MarketTrendChart
          data={trendData}
          title="上证指数"
          loading={trendLoading}
        />
      </section>

      {/* 热门板块（组件内部自取数据） */}
      <section>
        <SectionHeader title="热门板块" subtitle="申万一级板块涨跌" />
        <SectorBoard />
      </section>

      {/* 精选基金 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <SectionHeader
            title="精选基金"
            subtitle="按近一年收益排序的优质基金"
            inline
          />
          <Link
            to="/funds"
            className="glass-button inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gold-300"
          >
            查看更多
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {fundsLoading ? (
          <LoadingSpinner />
        ) : funds.length === 0 ? (
          <div className="glass-card p-6 flex flex-col items-center text-center text-muted text-sm">
            <Star className="w-8 h-8 mb-2 text-gold-400/40" />
            暂无基金数据
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {funds.map((fund, idx) => (
              <FundCard key={fund.id ?? fund.code} fund={fund} index={idx} />
            ))}
          </div>
        )}
      </section>

      <ComplianceNotice />

      <SIPCalculator isOpen={sipOpen} onClose={() => setSipOpen(false)} />
    </div>
  );
}

function SectionHeader({
  title, subtitle, inline = false,
}: { title: string; subtitle?: string; inline?: boolean }) {
  return (
    <div className={inline ? '' : 'mb-4'}>
      <h2 className="text-lg sm:text-xl font-semibold text-white">{title}</h2>
      {subtitle && <p className="text-muted text-xs sm:text-sm mt-1">{subtitle}</p>}
    </div>
  );
}
