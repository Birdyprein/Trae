import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, GitCompareArrows, Calculator, ArrowLeft, ShoppingCart } from 'lucide-react';
import type { FundDetail, NavPoint, BenchmarkHistory } from '@/types';
import { fetchFundDetail, fetchFundNav, fetchBenchmarkHistory } from '@/services/api';
import { useWatchlistStore } from '@/stores/watchlistStore';
import { useCompareStore } from '@/stores/compareStore';
import { FUND_TYPE_COLORS, RISK_LEVELS } from '@/constants';
import {
  formatPercent, formatNav, formatScale, formatDate,
  getChangeColor, safeNumber, safeString,
} from '@/utils/formatters';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import NavChart from '@/components/fund/NavChart';
import PerformanceTable from '@/components/fund/PerformanceTable';
import RiskMetricsCards from '@/components/fund/RiskMetricsCards';
import AssetAllocationChart from '@/components/fund/AssetAllocationChart';
import HoldingsTable from '@/components/fund/HoldingsTable';
import ManagerCard from '@/components/fund/ManagerCard';
import SIPCalculator from '@/components/calculator/SIPCalculator';
import PurchaseModal from '@/components/fund/PurchaseModal';

const TIME_RANGES = [
  { label: '1月', days: 30 },
  { label: '3月', days: 90 },
  { label: '6月', days: 180 },
  { label: '1年', days: 365 },
  { label: '3年', days: 1095 },
  { label: '全部', days: 3650 },
];

export default function FundDetailPage() {
  const { code: codeParam } = useParams<{ code: string }>();
  const code = codeParam ?? '';

  const [detail, setDetail] = useState<FundDetail | null>(null);
  const [navHistory, setNavHistory] = useState<NavPoint[]>([]);
  const [benchmarks, setBenchmarks] = useState<BenchmarkHistory[]>([]);
  const [selectedBenchmarkCodes, setSelectedBenchmarkCodes] = useState<string[]>([]);
  const [rangeDays, setRangeDays] = useState(365);
  const [loading, setLoading] = useState(true);
  const [navLoading, setNavLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sipOpen, setSipOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  const { has, toggle } = useWatchlistStore();
  const { isInCompare, addToCompare, removeFromCompare } = useCompareStore();

  // 进入页面滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [code]);

  // 加载详情
  useEffect(() => {
    if (!code) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const data = await fetchFundDetail(code);
        setDetail(data);
        if (!data) setError('基金详情加载失败');
      } catch {
        setError('基金详情加载失败');
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  // 加载净值
  const loadNav = useCallback(async (c: string, days: number) => {
    if (!c) return;
    setNavLoading(true);
    try {
      const data = await fetchFundNav(c, days);
      setNavHistory(data);
    } catch (err) {
      console.error('Nav load error:', err);
    } finally {
      setNavLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNav(code, rangeDays);
  }, [code, rangeDays, loadNav]);

  // 加载选中的基准历史（多选）
  useEffect(() => {
    if (selectedBenchmarkCodes.length === 0) {
      setBenchmarks([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const results = await Promise.all(
        selectedBenchmarkCodes.map((c) => fetchBenchmarkHistory(c, rangeDays).catch(() => null))
      );
      if (cancelled) return;
      setBenchmarks(results.filter((r): r is BenchmarkHistory => r !== null));
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedBenchmarkCodes, rangeDays]);

  if (loading) {
    return (
      <div className="section-container section-padding">
        <LoadingSpinner label="加载基金详情..." />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="section-container section-padding">
        <div className="glass-card p-8">
          <EmptyState
            icon={<Star className="w-12 h-12 text-gold-400/60" />}
            message={error ?? '该基金不存在或数据暂时无法获取'}
          />
          <div className="text-center -mt-4 pb-2">
            <Link
              to="/funds"
              className="glass-button-gold inline-flex items-center gap-1.5 px-4 py-2 text-xs"
            >
              <ArrowLeft className="w-3 h-3" />
              返回列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inWatchlist = has(detail.id ?? detail.code);
  const inCompare = isInCompare(detail.id ?? detail.code);
  const typeColor = FUND_TYPE_COLORS[safeString(detail.type)] ?? '#D4A853';
  const riskInfo = RISK_LEVELS.find((r) => r.level === safeNumber(detail.riskLevel));
  const dailyChange = safeNumber(detail.dailyChange);
  const yearlyReturn = safeNumber(detail.yearlyReturn);

  return (
    <div className="section-container section-padding space-y-5">
      {/* 返回 */}
      <Link to="/funds" className="inline-flex items-center gap-1 text-sm text-muted hover:text-gold-300">
        <ArrowLeft className="w-4 h-4" />
        返回列表
      </Link>

      {/* 顶部基本信息卡片 */}
      <section className="glass-card p-5 sm:p-6 animate-slide-up">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{safeString(detail.name)}</h1>
              <span
                className="inline-block px-2 py-0.5 rounded text-xs"
                style={{
                  color: typeColor,
                  backgroundColor: `${typeColor}1A`,
                  border: `1px solid ${typeColor}33`,
                }}
              >
                {safeString(detail.type)}
              </span>
              {riskInfo && (
                <span className="glass-badge">{riskInfo.label}</span>
              )}
            </div>
            <div className="text-muted text-xs font-mono mb-4">{safeString(detail.code)}</div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
              <InfoItem label="基金经理" value={safeString(detail.managerDetail?.name || detail.manager)} />
              <InfoItem label="基金公司" value={safeString(detail.company)} />
              <InfoItem label="基金规模" value={formatScale(detail.scale)} />
              <InfoItem label="成立日期" value={formatDate(detail.establishDate)} />
            </div>
          </div>

          {/* 净值展示 */}
          <div className="lg:w-72 glass-metric-box p-4 flex-shrink-0">
            <div className="text-muted text-xs">单位净值</div>
            <div className="text-2xl font-bold text-white font-mono mt-0.5">{formatNav(detail.nav)}</div>
            <div className={`text-sm font-mono mt-0.5 ${getChangeColor(dailyChange)}`}>
              {formatPercent(dailyChange)}
            </div>
            <div className="mt-3 pt-3 border-t border-surface-divider grid grid-cols-2 gap-3">
              <div>
                <div className="text-muted text-xs">累计净值</div>
                <div className="text-white text-sm font-mono">{formatNav(detail.accumulatedNav)}</div>
              </div>
              <div>
                <div className="text-muted text-xs">近1年</div>
                <div className={`text-sm font-mono ${getChangeColor(yearlyReturn)}`}>
                  {formatPercent(yearlyReturn)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-5 space-y-2.5">
          {/* 主操作：购买 + 定投 */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPurchaseOpen(true)}
              className="flex-1 glass-button-gold inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold"
            >
              <ShoppingCart className="w-4 h-4" />
              购买
            </button>
            <button
              type="button"
              onClick={() => setSipOpen(true)}
              className="flex-1 glass-button inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm text-white font-medium"
            >
              <Calculator className="w-4 h-4" />
              定投计算器
            </button>
          </div>
          {/* 次要操作：自选 + 对比 */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => toggle(detail.id ?? detail.code)}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium ${
                inWatchlist ? 'glass-button-gold' : 'glass-button text-white/60 hover:text-white'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${inWatchlist ? 'fill-current' : ''}`} />
              {inWatchlist ? '已加自选' : '加入自选'}
            </button>
            <button
              type="button"
              onClick={() =>
                inCompare
                  ? removeFromCompare(detail.id ?? detail.code)
                  : addToCompare(detail.id ?? detail.code)
              }
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium ${
                inCompare ? 'glass-button-gold' : 'glass-button text-white/60 hover:text-white'
              }`}
            >
              <GitCompareArrows className="w-3.5 h-3.5" />
              {inCompare ? '已加对比' : '加入对比'}
            </button>
          </div>
        </div>
      </section>

      {/* 净值走势 + 基准选择 */}
      <section>
        <h2 className="text-base sm:text-lg font-semibold text-white mb-4">净值走势</h2>
        {/* 时间范围切换 */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {TIME_RANGES.map((r) => (
            <button
              key={r.label}
              type="button"
              onClick={() => setRangeDays(r.days)}
              className={`px-3 py-1 rounded text-xs ${
                rangeDays === r.days
                  ? 'glass-button-gold'
                  : 'glass-button text-secondary'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <NavChart
          fundNav={navHistory}
          benchmarks={benchmarks}
          loading={navLoading}
        />
      </section>

      {/* 业绩表现 */}
      <section>
        <h2 className="text-base sm:text-lg font-semibold text-white mb-4">业绩表现</h2>
        <PerformanceTable performance={detail.performance} ranking={detail.ranking} />
      </section>

      {/* 风险指标（组件自带 glass-card 与标题） */}
      <RiskMetricsCards metrics={detail.riskMetrics} />

      {/* 资产配置（组件自带 glass-card 与标题，需 allocation 和 industryAllocation） */}
      <AssetAllocationChart
        allocation={detail.assetAllocation}
        industryAllocation={detail.industryAllocation}
      />

      <SIPCalculator isOpen={sipOpen} onClose={() => setSipOpen(false)} />
      <PurchaseModal isOpen={purchaseOpen} onClose={() => setPurchaseOpen(false)} fund={detail} />
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-muted text-xs">{label}</div>
      <div className="text-white text-sm mt-0.5 truncate">{value}</div>
    </div>
  );
}
