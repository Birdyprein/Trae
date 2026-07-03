import type { RiskMetrics } from '@/types';
import { formatNumber, formatPercent, getChangeColor, safeNumber } from '@/utils/formatters';

interface RiskMetricsCardsProps {
  metrics: RiskMetrics;
}

interface MetricConfig {
  key: keyof RiskMetrics;
  label: string;
  desc: string;
  format: (v: number) => string;
  useChangeColor: boolean;
}

const METRICS: MetricConfig[] = [
  { key: 'maxDrawdown', label: '最大回撤', desc: '历史最大跌幅', format: (v) => formatPercent(v), useChangeColor: true },
  { key: 'volatility', label: '波动率', desc: '年化波动', format: (v) => formatPercent(v), useChangeColor: false },
  { key: 'sharpeRatio', label: '夏普比率', desc: '风险调整收益', format: (v) => formatNumber(v, 2), useChangeColor: true },
  { key: 'alpha', label: 'Alpha', desc: '超额收益', format: (v) => formatPercent(v), useChangeColor: true },
];

export default function RiskMetricsCards({ metrics }: RiskMetricsCardsProps) {
  return (
    <div className="glass-card p-4 sm:p-6">
      <h3 className="text-base font-medium mb-4">风险指标</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {METRICS.map((m) => {
          const value = safeNumber(metrics?.[m.key]);
          const color = m.useChangeColor ? getChangeColor(value) : 'text-white';
          return (
            <div key={m.key} className="glass-metric-box p-3">
              <div className="text-xs text-muted mb-1">{m.label}</div>
              <div className={`text-xl font-display font-bold ${color}`}>
                {m.format(value)}
              </div>
              <div className="text-[10px] text-muted mt-0.5">{m.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
