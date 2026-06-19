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
  return (
    <div className="overflow-x-auto rounded-xl border border-surface-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface-card/50">
            <th className="w-10 px-3 py-3.5 text-muted font-medium"></th>
            <th className="text-left px-5 py-3.5 text-muted font-medium">基金名称</th>
            <th className="text-left px-5 py-3.5 text-muted font-medium">代码</th>
            <th className="text-left px-5 py-3.5 text-muted font-medium">类型</th>
            <th className="text-right px-5 py-3.5 text-muted font-medium">单位净值</th>
            <th className="text-right px-5 py-3.5 text-muted font-medium">日涨跌幅</th>
            <th className="text-right px-5 py-3.5 text-muted font-medium">近一年收益</th>
          </tr>
        </thead>
        <tbody>
          {funds.map((fund, i) => (
            <tr
              key={fund.id}
              className={`border-t border-surface-border transition-colors hover:bg-surface-hover ${
                i % 2 === 0 ? 'bg-surface-card/30' : ''
              }`}
            >
              <td className="px-3 py-3.5">
                <WatchlistButton id={fund.id} />
              </td>
              <td className="px-5 py-3.5">
                <Link to={`/funds/${fund.id}`} className="text-white hover:text-gold-400 transition-colors font-medium">
                  {fund.name}
                </Link>
              </td>
              <td className="px-5 py-3.5 text-muted">{fund.code}</td>
              <td className="px-5 py-3.5">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20">
                  {fund.type}
                </span>
              </td>
              <td className="px-5 py-3.5 text-right text-white">{fund.nav.toFixed(4)}</td>
              <td className={`px-5 py-3.5 text-right font-medium ${fund.dailyChange >= 0 ? 'text-gain' : 'text-loss'}`}>
                {fund.dailyChange >= 0 ? '+' : ''}{fund.dailyChange.toFixed(2)}%
              </td>
              <td className={`px-5 py-3.5 text-right font-medium ${fund.yearlyReturn >= 0 ? 'text-gain' : 'text-loss'}`}>
                {fund.yearlyReturn >= 0 ? '+' : ''}{fund.yearlyReturn.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}