import { Sparkles, TrendingDown, Activity, ShieldCheck } from 'lucide-react';
import type { PortfolioAnalysis } from '@/types';
import { formatNumber, safeNumber } from '@/utils/formatters';

interface StyleExposureProps {
  styleExposure: PortfolioAnalysis['styleExposure'];
  portfolioRisk: PortfolioAnalysis['portfolioRisk'];
}

const MARKET_CAP_LABELS: Record<string, string> = {
  large: '大盘',
  mid: '中盘',
  small: '小盘',
  mixed: '混合',
};

const STYLE_LABELS: Record<string, string> = {
  value: '价值型',
  growth: '成长型',
  balanced: '平衡型',
};

function getScoreColor(score: number, reverse = false): string {
  if (reverse) {
    if (score >= 70) return 'text-loss';
    if (score >= 40) return 'text-gold-400';
    return 'text-gain';
  }
  if (score >= 70) return 'text-gain';
  if (score >= 40) return 'text-gold-400';
  return 'text-loss';
}

function ScoreBar({ value, max = 100, reverse = false }: { value: number; max?: number; reverse?: boolean }) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  const color = reverse
    ? value >= 70 ? 'bg-gain' : value >= 40 ? 'bg-gold-400' : 'bg-loss'
    : value >= 70 ? 'bg-loss' : value >= 40 ? 'bg-gold-400' : 'bg-gain';
  return (
    <div className="h-1.5 bg-surface-hover rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function StyleExposure({ styleExposure, portfolioRisk }: StyleExposureProps) {
  const se = styleExposure ?? { marketCap: 'mixed', style: 'balanced', score: 0 };
  const pr = portfolioRisk ?? {
    estimatedMaxDrawdown: 0,
    estimatedVolatility: 0,
    diversificationScore: 0,
  };

  const marketCapLabel = MARKET_CAP_LABELS[se.marketCap] ?? '混合';
  const styleLabel = STYLE_LABELS[se.style] ?? '平衡型';
  const styleScore = safeNumber(se.score);
  const drawdown = safeNumber(pr.estimatedMaxDrawdown);
  const volatility = safeNumber(pr.estimatedVolatility);
  const diversification = safeNumber(pr.diversificationScore);

  return (
    <div className="glass-data-card p-4 sm:p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-gold-400" />
        <h3 className="text-white text-base font-medium">风格暴露</h3>
      </div>

      {/* 风格象限 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="glass-metric-box p-3">
          <div className="text-muted text-xs mb-1">市值风格</div>
          <div className="text-white text-base font-medium">{marketCapLabel}</div>
        </div>
        <div className="glass-metric-box p-3">
          <div className="text-muted text-xs mb-1">投资风格</div>
          <div className="text-gold-300 text-base font-medium">{styleLabel}</div>
        </div>
      </div>

      {/* 风格评分 */}
      <div className="glass-metric-box p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted text-xs">风格评分</span>
          <span className={`text-sm font-mono font-bold ${getScoreColor(styleScore)}`}>
            {formatNumber(styleScore)}
          </span>
        </div>
        <ScoreBar value={styleScore} />
      </div>

      {/* 风险指标 */}
      <div className="space-y-3">
        <div className="text-muted text-xs uppercase tracking-wider">组合风险</div>

        <div className="glass-metric-box p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-gain" />
              <span className="text-secondary text-xs">预估最大回撤</span>
            </div>
            <span className="text-gain text-sm font-mono font-medium">
              {formatNumber(drawdown)}%
            </span>
          </div>
          <ScoreBar value={Math.abs(drawdown)} max={40} reverse />
        </div>

        <div className="glass-metric-box p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-secondary text-xs">预估波动率</span>
            </div>
            <span className="text-gold-300 text-sm font-mono font-medium">
              {formatNumber(volatility)}%
            </span>
          </div>
          <ScoreBar value={volatility} max={40} reverse />
        </div>

        <div className="glass-metric-box p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-loss" />
              <span className="text-secondary text-xs">分散度评分</span>
            </div>
            <span className={`text-sm font-mono font-bold ${getScoreColor(diversification)}`}>
              {formatNumber(diversification)}
            </span>
          </div>
          <ScoreBar value={diversification} />
        </div>
      </div>
    </div>
  );
}
