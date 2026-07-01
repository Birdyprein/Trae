import { Link } from 'react-router-dom';
import { StarIcon } from 'lucide-react';
import type { Fund } from '@/types';
import { useWatchlistStore } from '@/stores/watchlistStore';

interface Props {
  funds: Fund[];
}

function WatchlistButton({ id }: { id: string }) {
  const { toggle, has } = useWatchlistStore();
  const isWatched = has(id);

  return (
    <button
      type="button"
      aria-label={isWatched ? '取消自选' : '加入自选'}
      onClick={(e) => {
        e.stopPropagation();
        toggle(id);
      }}
      className="p-1 rounded hover:bg-gold-500/10 transition-colors"
    >
      <StarIcon
        className={`w-4 h-4 transition-colors ${
          isWatched ? 'fill-gold-400 text-gold-400' : 'text-muted hover:text-gold-400'
        }`}
      />
    </button>
  );
}

export default function FundTable({ funds }: Props) {
  // 空数据处理
  if (!funds || funds.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-muted text-sm">暂无基金数据</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto rounded-lg sm:rounded-xl border border-surface-border">
      <table className="w-full text-xs sm:text-sm min-w-[640px]">
        <thead>
          <tr className="bg-surface-card/50">
            <th className="w-8 sm:w-10 px-2 sm:px-3 py-2.5 sm:py-3.5 text-muted font-medium"></th>
            <th className="text-left px-3 sm:px-5 py-2.5 sm:py-3.5 text-muted font-medium whitespace-nowrap">基金名称</th>
            <th className="text-left px-3 sm:px-5 py-2.5 sm:py-3.5 text-muted font-medium whitespace-nowrap hidden sm:table-cell">代码</th>
            <th className="text-left px-3 sm:px-5 py-2.5 sm:py-3.5 text-muted font-medium whitespace-nowrap hidden md:table-cell">类型</th>
            <th className="text-right px-3 sm:px-5 py-2.5 sm:py-3.5 text-muted font-medium whitespace-nowrap">单位净值</th>
            <th className="text-right px-3 sm:px-5 py-2.5 sm:py-3.5 text-muted font-medium whitespace-nowrap">日涨跌幅</th>
            <th className="text-right px-3 sm:px-5 py-2.5 sm:py-3.5 text-muted font-medium whitespace-nowrap">近一年收益</th>
          </tr>
        </thead>
        <tbody>
          {funds.map((fund, i) => {
            // 安全访问数据
            const nav = fund.nav ?? 0;
            const dailyChange = fund.dailyChange ?? 0;
            const yearlyReturn = fund.yearlyReturn ?? 0;
            
            return (
              <tr
                key={fund.id || `fund-${i}`}
                className={`border-t border-surface-border transition-colors hover:bg-surface-hover ${
                  i % 2 === 0 ? 'bg-surface-card/30' : ''
                }`}
              >
                <td className="px-2 sm:px-3 py-2.5 sm:py-3.5">
                  <WatchlistButton id={fund.id} />
                </td>
                <td className="px-3 sm:px-5 py-2.5 sm:py-3.5">
                  <Link to={`/funds/${fund.id}`} className="text-white hover:text-gold-400 transition-colors font-medium">
                    {fund.name || '未知基金'}
                  </Link>
                </td>
                <td className="px-3 sm:px-5 py-2.5 sm:py-3.5 text-muted hidden sm:table-cell">{fund.code || '--'}</td>
                <td className="px-3 sm:px-5 py-2.5 sm:py-3.5 hidden md:table-cell">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 whitespace-nowrap">
                    {fund.type || '未知'}
                  </span>
                </td>
                <td className="px-3 sm:px-5 py-2.5 sm:py-3.5 text-right text-white whitespace-nowrap">{nav.toFixed(4)}</td>
                <td className={`px-3 sm:px-5 py-2.5 sm:py-3.5 text-right font-medium whitespace-nowrap ${dailyChange >= 0 ? 'text-gain' : 'text-loss'}`}>
                  {dailyChange >= 0 ? '+' : ''}{dailyChange.toFixed(2)}%
                </td>
                <td className={`px-3 sm:px-5 py-2.5 sm:py-3.5 text-right font-medium whitespace-nowrap ${yearlyReturn >= 0 ? 'text-gain' : 'text-loss'}`}>
                  {yearlyReturn >= 0 ? '+' : ''}{yearlyReturn.toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}