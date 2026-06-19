import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Fund } from '@/types';

interface Props {
  fund: Fund;
  index: number;
}

export default function FundCard({ fund, index }: Props) {
  const isPositive = fund.yearlyReturn >= 0;

  return (
    <Link
      to={`/funds/${fund.id}`}
      className={`glass-card p-6 cursor-pointer animate-on-scroll stagger-${index + 1}`}
      style={{ animationDelay: `${0.1 * (index + 1)}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-bold text-white mb-1">{fund.name}</h3>
          <span className="inline-block text-xs px-2.5 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20">
            {fund.type}
          </span>
        </div>
        <div className="flex gap-0.5" role="img" aria-label={`风险等级 ${fund.riskLevel} 级`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
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
            className={`text-2xl font-bold font-display ${
              isPositive ? 'text-gain' : 'text-loss'
            }`}
          >
            {isPositive ? '+' : ''}{fund.yearlyReturn.toFixed(2)}%
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted mb-1">单位净值</p>
          <span className="text-lg font-semibold text-white">{fund.nav.toFixed(4)}</span>
        </div>
      </div>
    </Link>
  );
}