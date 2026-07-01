import type { MarketIndex } from '@/types';
import { formatNumber, formatPercent, getChangeColor } from '@/utils/formatters';

interface MarketIndexCardProps {
  index: MarketIndex;
}

export default function MarketIndexCard({ index }: MarketIndexCardProps) {
  const { name, value, change, changePercent } = index;
  const color = getChangeColor(change);
  const isUp = (change ?? 0) > 0;
  const isDown = (change ?? 0) < 0;
  const arrow = isUp ? '▲' : isDown ? '▼' : '—';
  const changeText = change === undefined || change === null
    ? '--'
    : `${change >= 0 ? '+' : ''}${formatNumber(change)}`;

  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-secondary line-clamp-1">{name}</span>
        <span className={`text-xs ${color}`}>{arrow}</span>
      </div>
      <div className={`text-2xl font-display font-bold ${color}`}>
        {formatNumber(value)}
      </div>
      <div className="flex items-center gap-3 mt-1 text-sm">
        <span className={color}>{changeText}</span>
        <span className={color}>{formatPercent(changePercent)}</span>
      </div>
    </div>
  );
}
