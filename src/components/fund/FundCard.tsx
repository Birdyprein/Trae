import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Fund } from '@/types';
import { FUND_TYPE_COLORS } from '@/constants';
import { useWatchlistStore } from '@/stores/watchlistStore';
import { formatNav, formatPercent, getChangeColor, safeString } from '@/utils/formatters';

interface FundCardProps {
  fund: Fund;
  index: number;
}

function RiskStars({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={10}
          className={i < level ? 'fill-gold-400 text-gold-400' : 'text-white/15'}
        />
      ))}
    </div>
  );
}

export default function FundCard({ fund, index }: FundCardProps) {
  const toggle = useWatchlistStore((s) => s.toggle);
  const isWatched = useWatchlistStore((s) => s.watchlist.includes(fund.id));
  const typeColor = FUND_TYPE_COLORS[fund.type] ?? '#D4A853';
  const yearlyColor = getChangeColor(fund.yearlyReturn);
  const dailyColor = getChangeColor(fund.dailyChange);

  const handleToggleWatch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(fund.id);
  };

  return (
    <Link
      to={`/funds/${fund.id}`}
      className="glass-card p-4 block animate-fade-in hover:scale-[1.01]"
      style={{ animationDelay: `${Math.min(index, 10) * 30}ms` }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs px-1.5 py-0.5 rounded shrink-0"
              style={{ background: `${typeColor}22`, color: typeColor }}
            >
              {safeString(fund.type)}
            </span>
            <span className="text-xs text-muted shrink-0">{safeString(fund.code)}</span>
          </div>
          <h3 className="text-sm font-medium text-white line-clamp-2 leading-snug">
            {safeString(fund.name)}
          </h3>
        </div>
        <button
          onClick={handleToggleWatch}
          className="shrink-0 p-1 rounded-md hover:bg-white/5 transition-colors"
          aria-label={isWatched ? '取消自选' : '加入自选'}
        >
          <Star
            size={18}
            className={isWatched ? 'fill-gold-400 text-gold-400' : 'text-white/30'}
          />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <RiskStars level={fund.riskLevel ?? 0} />
        <span className="text-xs text-muted">{safeString(fund.manager)}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="text-xs text-muted mb-0.5">单位净值</div>
          <div className="text-sm font-display font-medium text-white">
            {formatNav(fund.nav)}
          </div>
          <div className={`text-xs ${dailyColor}`}>{formatPercent(fund.dailyChange)}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted mb-0.5">近一年收益</div>
          <div className={`text-lg font-display font-bold ${yearlyColor}`}>
            {formatPercent(fund.yearlyReturn)}
          </div>
        </div>
      </div>
    </Link>
  );
}
