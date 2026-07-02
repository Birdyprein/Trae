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
  const changeText = change === undefined || change === null
    ? '--'
    : `${change >= 0 ? '+' : ''}${formatNumber(change)}`;

  return (
    <div className="card-light p-4 animate-fade-in cursor-default">
      <div className="text-xs font-medium mb-1" style={{ color: '#6b7280', letterSpacing: '0.02em' }}>
        {name}
      </div>
      <div className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-mono, monospace)', letterSpacing: '-0.3px' }}>
        {formatNumber(value)}
      </div>
      <div className={`text-sm font-semibold font-mono ${color}`}>
        {changeText} ({formatPercent(changePercent)})
      </div>
    </div>
  );
}
