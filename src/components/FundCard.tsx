import { Link } from 'react-router-dom';
import { Star, StarIcon, User, Layers } from 'lucide-react';
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
  
  // 安全访问数据
  const yearlyReturn = fund.yearlyReturn ?? 0;
  const nav = fund.nav ?? 0;
  const riskLevel = fund.riskLevel ?? 3;

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
          <div className="flex gap-0.5 shrink-0" role="img" aria-label={`风险等级 ${riskLevel} 级`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                  i < riskLevel
                    ? 'fill-gold-500 text-gold-500'
                    : 'text-surface-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 基金经理和规模信息 */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4 text-xs text-muted">
          {fund.manager && fund.manager !== '--' && (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {fund.manager}
            </span>
          )}
          {fund.scale && fund.scale !== '--' && (
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" />
              {fund.scale}
            </span>
          )}
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted mb-1">近一年收益</p>
            <span
              className={`text-xl sm:text-2xl font-bold font-display ${
                isPositive ? 'text-gain' : 'text-loss'
              }`}
            >
              {isPositive ? '+' : ''}{yearlyReturn.toFixed(2)}%
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted mb-1">单位净值</p>
            <span className="text-base sm:text-lg font-semibold text-white">{nav.toFixed(4)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}