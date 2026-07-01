import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trash2, AlertTriangle, ArrowRight } from 'lucide-react';
import type { Fund, FundDetail } from '@/types';
import { fetchFundDetail } from '@/services/api';
import { useWatchlistStore } from '@/stores/watchlistStore';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import ComplianceNotice from '@/components/common/ComplianceNotice';
import WatchlistTable from '@/components/watchlist/WatchlistTable';
import PortfolioAnalysis from '@/components/watchlist/PortfolioAnalysis';

export default function WatchlistPage() {
  const { watchlist, remove, clear } = useWatchlistStore();
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!watchlist || watchlist.length === 0) {
        setFunds([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const results = await Promise.all(
        watchlist.map((id) => fetchFundDetail(id).catch(() => null))
      );
      if (cancelled) return;
      // FundDetail 是 Fund 的扩展类型，可直接赋给 Fund[]
      setFunds(results.filter((r): r is FundDetail => r !== null));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [watchlist]);

  const hasFunds = funds.length > 0;

  return (
    <div className="section-container section-padding space-y-5">
      {/* 头部 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-gold-400" />
            我的自选
          </h1>
          <p className="text-muted text-xs sm:text-sm mt-1">
            {hasFunds ? `共 ${funds.length} 只基金` : '暂无自选基金'}
          </p>
        </div>
        {hasFunds && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('确定清空全部自选吗？')) clear();
            }}
            className="glass-button inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-loss hover:text-loss"
          >
            <Trash2 className="w-3.5 h-3.5" />
            清空
          </button>
        )}
      </div>

      {/* 自选列表 */}
      {loading ? (
        <LoadingSpinner label="加载自选基金..." />
      ) : !hasFunds ? (
        <div className="glass-card p-8">
          <EmptyState
            icon={<Star className="w-12 h-12 text-gold-400/60" />}
            message="自选列表为空，去基金列表页添加您关注的基金"
          />
          <div className="text-center -mt-4 pb-2">
            <Link
              to="/funds"
              className="glass-button-gold inline-flex items-center gap-1.5 px-4 py-2 text-xs"
            >
              浏览基金
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          <WatchlistTable funds={funds} onRemove={remove} />

          {/* 穿透分析 */}
          <PortfolioAnalysis fundIds={watchlist} />

          {/* 数据不足提示 */}
          {watchlist.length < 2 && (
            <div className="glass-card p-4 flex items-center gap-2 text-xs text-muted">
              <AlertTriangle className="w-4 h-4 text-gold-400/60 flex-shrink-0" />
              <span>添加至少 2 只基金可解锁组合穿透分析功能</span>
            </div>
          )}
        </>
      )}

      <ComplianceNotice />
    </div>
  );
}
