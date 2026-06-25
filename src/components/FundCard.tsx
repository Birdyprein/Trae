import { Link } from 'react-router-dom';
import { Star, StarIcon } from 'lucide-react';
import type { Fund } from '@/types';
import { useWatchlistStore } from '@/stores/watchlistStore';

interface Props {
  fund: Fund;
  index: number;
}

export default function FundCard({ fund, index }: Props) {
  const isPositive = fund.yearlyReturn >= 0;
  const { toggle, has } = useWatchlistStore();
  const isWatched = has(fund.id);

  return (
    <div
      className={`glass-card p-4 sm:p-6 cursor-pointer animate-on-scroll relative group`}
      style={{ animationDelay: `${0.1 * (index + 1)}s` }}
    >
      <button
        type="button"
        aria-label={isWatched ? '取消自选' : '加入自选'}
        onClick={(e) => {
          e.stopPropagation();
          toggle(fund.id);
        }}
        className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 p-1.5 rounded-lg transition-all z-10
                   hover:bg-gold-500/10"
      >
        <StarIcon
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
            isWatched ? 'fill-gold-400 text-gold-400' : 'text-muted group-hover:text-gold-400'
          }`}
        />
      </button>

      <Link to={`/funds/${fund.id}`} className="block">
        <div className="flex items-start justify-between mb-3 sm:mb-4 pr-7 sm:pr-8">
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-white mb-1 line-clamp-1">{fund.name}</h3>
            <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20">
              {fund.type}
            </span>
          </div>
          <div className="flex gap-0.5 shrink-0" role="img" aria-label={`风险等级 ${fund.riskLevel} 级`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                  i < fund.riskLevel
                    ? 'fill-gold-500 text-gold-500'
                    : 'text-surface-border'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted mb-1">近一年收益</p>
            <span
              className={`text-xl sm:text-2xl font-bold font-display ${
                isPositive ? 'text-gain' : 'text-loss'
              }`}
            >
              {isPositive ? '+' : ''}{fund.yearlyReturn.toFixed(2)}%
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted mb-1">单位净值</p>
            <span className="text-base sm:text-lg font-semibold text-white">{fund.nav.toFixed(4)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}