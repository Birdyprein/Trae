import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, TrendingUp, Layers } from 'lucide-react';
import { useFund } from '@/hooks/useFunds';
import NavChart from '@/components/NavChart';
import PerformanceTable from '@/components/PerformanceTable';
import RiskMetricsCards from '@/components/RiskMetricsCards';

export default function FundDetailPage() {
  const { id } = useParams<{ id: string }>();
  const fund = useFund(id!);

  if (!fund) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-muted text-lg">基金未找到</p>
        <Link to="/funds" className="text-gold-400 hover:text-gold-300 mt-4 inline-block">
          返回基金列表
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/funds"
        className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">返回列表</span>
      </Link>

      {/* Fund Info Header */}
      <div className="glass-card p-6 lg:p-8 mb-8 animate-on-scroll">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">{fund.name}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20">
                {fund.type}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                代码: {fund.code}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                经理: {fund.manager}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                成立: {fund.establishDate}
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                规模: {fund.scale.toFixed(2)}亿
              </span>
            </div>
          </div>

          <div className="flex gap-8 lg:gap-12">
            <div className="text-center">
              <p className="text-xs text-muted mb-1">单位净值</p>
              <p className="text-2xl font-bold text-white">{fund.nav.toFixed(4)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted mb-1">累计净值</p>
              <p className="text-2xl font-bold text-white">{fund.accumulatedNav.toFixed(4)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted mb-1">日涨跌幅</p>
              <p className={`text-2xl font-bold ${fund.dailyChange >= 0 ? 'text-gain' : 'text-loss'}`}>
                {fund.dailyChange >= 0 ? '+' : ''}{fund.dailyChange.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-8 animate-on-scroll stagger-1">
        <NavChart data={fund.navHistory} />
      </div>

      {/* Performance & Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="animate-on-scroll stagger-2">
          <PerformanceTable returns={fund.returns} />
        </div>
        <div className="animate-on-scroll stagger-3">
          <RiskMetricsCards metrics={fund.riskMetrics} />
        </div>
      </div>

      {/* Risk Level */}
      <div className="glass-card p-6 animate-on-scroll stagger-4">
        <h3 className="text-lg font-display font-bold text-white mb-3">风险等级</h3>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-8 h-2 rounded-full ${
                  level <= fund.riskLevel ? 'bg-gold-500' : 'bg-surface-border'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted">
            {['', '低风险', '中低风险', '中风险', '中高风险', '高风险'][fund.riskLevel]}
          </span>
        </div>
      </div>
    </div>
  );
}