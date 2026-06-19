import type { MarketIndex } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  data: MarketIndex;
  index: number;
}

export default function MarketIndexCard({ data, index }: Props) {
  const isPositive = data.changePercent >= 0;

  return (
    <div
      className="glass-card p-5 animate-on-scroll"
      style={{ animationDelay: `${0.1 * (index + 1)}s` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted">{data.name}</span>
        <span className="text-xs text-muted">{data.code}</span>
      </div>
      <div className="text-2xl font-bold font-display text-white mb-2">
        {data.value.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
      </div>
      <div className="flex items-center gap-2">
        {isPositive ? (
          <TrendingUp className="w-4 h-4 text-gain" />
        ) : (
          <TrendingDown className="w-4 h-4 text-loss" />
        )}
        <span className={`text-sm font-semibold ${isPositive ? 'text-gain' : 'text-loss'}`}>
          {isPositive ? '+' : ''}{data.change.toFixed(2)} ({isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}