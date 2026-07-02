import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ArrowRight, TrendingUp, LayoutGrid, Star } from 'lucide-react';
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
      {/* Hero 区域 - 专业蓝色渐变风格 */}
      <section className="relative overflow-hidden rounded-2xl animate-slide-up" style={{
        background: 'linear-gradient(160deg, #0f2640 0%, #1a3a5c 40%, #1e4d78 100%)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.06)'
      }}>
        {/* 装饰性圆形背景 */}
        <div className="absolute right-[-60px] top-[-80px] w-80 h-80 rounded-full opacity-30" style={{ background: 'rgba(255, 255, 255, 0.03)' }} />
        <div className="absolute right-[120px] bottom-[-100px] w-48 h-48 rounded-full opacity-80" style={{ background: 'rgba(201, 168, 76, 0.08)' }} />
        
        <div className="relative z-10 p-8 sm:p-12 lg:p-14 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-4 backdrop-blur-sm" style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              📈 实时数据 · 专业选基
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white mb-3">
              精选优质<span style={{ color: '#e0c878' }}>基金</span>
              <br />
              助力财富稳健增长
            </h1>
            <p className="text-sm sm:text-base leading-relaxed mb-6 max-w-lg" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
              涵盖股票型、债券型、混合型、指数型及货币型全品类基金，智能筛选，数据透明，为您的每一笔投资保驾护航。
            </p>
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">8,200+</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>精选基金</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">¥3.6万亿</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>管理规模</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.7%</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>系统可用率</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setSipOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-full transition-all hover:-translate-y-0.5"
                style={{
                  background: '#c9a84c',
                  color: '#1a1a1a',
                  border: '1.5px solid #c9a84c',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)'
                }}
              >
                <Calculator className="w-4 h-4" />
                定投计算器
              </button>
              <Link
                to="/funds"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-full transition-all hover:-translate-y-0.5"
                style={{
                  background: 'transparent',
                  color: 'rgba(255, 255, 255, 0.9)',
                  border: '1.5px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <LayoutGrid className="w-4 h-4" />
                浏览基金
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center w-56 h-56 rounded-full border-2 border-dashed" style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderColor: 'rgba(255, 255, 255, 0.15)'
          }}>
            <span className="text-7xl opacity-80">📊</span>
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
