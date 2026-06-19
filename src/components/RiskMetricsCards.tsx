import type { RiskMetrics } from '@/types';
import { TrendingDown, Activity, Gauge, Target } from 'lucide-react';

interface Props {
  metrics: RiskMetrics;
}

const items: { label: string; key: keyof RiskMetrics; icon: typeof TrendingDown; suffix: string; desc: string }[] = [
  { label: '最大回撤', key: 'maxDrawdown', icon: TrendingDown, suffix: '%', desc: '历史最大亏损幅度' },
  { label: '年化波动率', key: 'volatility', icon: Activity, suffix: '%', desc: '收益波动程度' },
  { label: '夏普比率', key: 'sharpeRatio', icon: Gauge, suffix: '', desc: '风险调整后收益' },
  { label: 'Alpha', key: 'alpha', icon: Target, suffix: '%', desc: '超额收益能力' },
];

export default function RiskMetricsCards({ metrics }: Props) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-display font-bold text-white mb-4">风险指标</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          const val = metrics[item.key];
          return (
            <div
              key={item.key}
              className="bg-surface-card/50 border border-surface-border rounded-xl p-4 hover:border-gold-500/20 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-gold-400" />
                <span className="text-xs text-muted">{item.label}</span>
              </div>
              <div className="text-xl font-bold text-white mb-1">
                {val.toFixed(2)}{item.suffix}
              </div>
              <p className="text-xs text-muted">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}