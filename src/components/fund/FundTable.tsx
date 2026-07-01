import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Fund } from '@/types';
import { useWatchlistStore } from '@/stores/watchlistStore';
import { formatNav, formatPercent, getChangeColor, safeString } from '@/utils/formatters';

interface FundTableProps {
  funds: Fund[];
}

export default function FundTable({ funds }: FundTableProps) {
  const toggle = useWatchlistStore((s) => s.toggle);
  const watchlist = useWatchlistStore((s) => s.watchlist);

  const handleToggleWatch = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(id);
  };

  if (!funds || funds.length === 0) {
    return (
      <div className="glass-table flex items-center justify-center py-16">
        <div className="text-center">
          <div className="text-sm text-muted mb-1">暂无符合条件的基金</div>
          <div className="text-xs text-muted">请调整筛选条件后重试</div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-table overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="text-xs text-muted border-b border-surface-divider">
            <th className="px-3 py-3 text-left font-normal w-10">自选</th>
            <th className="px-3 py-3 text-left font-normal">名称</th>
            <th className="px-3 py-3 text-left font-normal hidden sm:table-cell">代码</th>
            <th className="px-3 py-3 text-left font-normal hidden md:table-cell">类型</th>
            <th className="px-3 py-3 text-right font-normal">净值</th>
            <th className="px-3 py-3 text-right font-normal">日涨跌</th>
            <th className="px-3 py-3 text-right font-normal">近1年</th>
          </tr>
        </thead>
        <tbody>
          {funds.map((fund) => {
            const isWatched = watchlist.includes(fund.id);
            const dailyColor = getChangeColor(fund.dailyChange);
            const yearlyColor = getChangeColor(fund.yearlyReturn);
            return (
              <tr
                key={fund.id}
                className="glass-table-row"
              >
                <td className="px-3 py-3">
                  <button
                    onClick={(e) => handleToggleWatch(e, fund.id)}
                    className="p-1 rounded hover:bg-white/5 transition-colors"
                    aria-label={isWatched ? '取消自选' : '加入自选'}
                  >
                    <Star
                      size={16}
                      className={isWatched ? 'fill-gold-400 text-gold-400' : 'text-white/30'}
                    />
                  </button>
                </td>
                <td className="px-3 py-3">
                  <Link to={`/funds/${fund.id}`} className="text-white hover:text-gold-400 transition-colors line-clamp-1">
                    {safeString(fund.name)}
                  </Link>
                </td>
                <td className="px-3 py-3 hidden sm:table-cell text-muted font-mono text-xs">
                  {safeString(fund.code)}
                </td>
                <td className="px-3 py-3 hidden md:table-cell text-secondary text-xs">
                  {safeString(fund.type)}
                </td>
                <td className="px-3 py-3 text-right font-mono text-white">
                  {formatNav(fund.nav)}
                </td>
                <td className={`px-3 py-3 text-right font-mono ${dailyColor}`}>
                  {formatPercent(fund.dailyChange)}
                </td>
                <td className={`px-3 py-3 text-right font-mono font-medium ${yearlyColor}`}>
                  {formatPercent(fund.yearlyReturn)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
