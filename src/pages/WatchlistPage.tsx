import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trash2, TrendingUp } from 'lucide-react';
import { useWatchlistStore } from '@/stores/watchlistStore';
import { funds } from '@/data/mockData';

export default function WatchlistPage() {
  const { ids, remove } = useWatchlistStore();

  const watchlistFunds = useMemo(
    () => funds.filter((f) => ids.includes(f.id)),
    [ids]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 animate-on-scroll">
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-7 h-7 text-gold-400 fill-gold-400" />
          <h1 className="font-display text-3xl font-bold text-white">自选基金</h1>
        </div>
        <p className="text-muted">管理你关注的基金，随时追踪表现</p>
      </div>

      {watchlistFunds.length === 0 ? (
        <div className="text-center py-20 animate-on-scroll">
          <Star className="w-16 h-16 text-surface-border mx-auto mb-4" />
          <p className="text-muted text-lg mb-2">暂无自选基金</p>
          <p className="text-sm text-muted mb-6">在基金列表或详情页点击星标即可添加</p>
          <Link to="/funds" className="btn-primary inline-flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            浏览基金
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {watchlistFunds.map((fund, i) => {
            const isPositive = fund.yearlyReturn >= 0;
            return (
              <div
                key={fund.id}
                className="glass-card p-5 animate-on-scroll relative group"
                style={{ animationDelay: `${0.08 * (i + 1)}s` }}
              >
                <button
                  type="button"
                  aria-label="取消自选"
                  onClick={(e) => {
                    e.preventDefault();
                    remove(fund.id);
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-gold-400 hover:bg-gold-500/10 hover:text-gold-300 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Link to={`/funds/${fund.id}`} className="block">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display text-base font-bold text-white mb-1.5 line-clamp-1">{fund.name}</h3>
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20">
                        {fund.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-4 pt-4 border-t border-surface-border">
                    <div>
                      <p className="text-xs text-muted mb-1">近一年收益</p>
                      <span className={`text-xl font-bold font-display ${isPositive ? 'text-gain' : 'text-loss'}`}>
                        {isPositive ? '+' : ''}{fund.yearlyReturn.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted mb-1">单位净值</p>
                      <span className="text-base font-semibold text-white">{fund.nav.toFixed(4)}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted mb-1">日涨跌</p>
                      <span className={`text-base font-semibold ${fund.dailyChange >= 0 ? 'text-gain' : 'text-loss'}`}>
                        {fund.dailyChange >= 0 ? '+' : ''}{fund.dailyChange.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}