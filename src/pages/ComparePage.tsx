import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GitCompareArrows, Trash2, ArrowRight, AlertCircle } from 'lucide-react';
import type { FundDetail } from '@/types';
import { fetchFundDetail } from '@/services/api';
import { useCompareStore } from '@/stores/compareStore';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import ComplianceNotice from '@/components/common/ComplianceNotice';
import CompareTable from '@/components/compare/CompareTable';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();
  const [funds, setFunds] = useState<FundDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!compareList || compareList.length === 0) {
        setFunds([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const results = await Promise.all(
        compareList.map((id) => fetchFundDetail(id).catch(() => null))
      );
      if (cancelled) return;
      setFunds(results.filter((r): r is FundDetail => r !== null));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [compareList]);

  const isEmpty = !compareList || compareList.length === 0;

  return (
    <div className="section-container section-padding space-y-5">
      {/* 头部 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <GitCompareArrows className="w-5 h-5 text-gold-400" />
            基金对比
          </h1>
          <p className="text-muted text-xs sm:text-sm mt-1">
            {funds.length > 0 ? `正在对比 ${funds.length} 只基金（最多 5 只）` : '从基金详情页加入对比项'}
          </p>
        </div>
        {!isEmpty && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('确定清空全部对比项吗？')) clearCompare();
            }}
            className="glass-button inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-loss hover:text-loss"
          >
            <Trash2 className="w-3.5 h-3.5" />
            清空
          </button>
        )}
      </div>

      {/* 内容区 */}
      {loading ? (
        <LoadingSpinner label="加载对比数据..." />
      ) : isEmpty ? (
        <div className="glass-card p-8">
          <EmptyState
            icon={<GitCompareArrows className="w-12 h-12 text-gold-400/60" />}
            message="对比列表为空，从基金列表或详情页加入对比项（最多 5 只）"
          />
          <div className="text-center -mt-4 pb-2">
            <Link
              to="/funds"
              className="glass-button-gold inline-flex items-center gap-1.5 px-4 py-2 text-xs"
            >
              去选基金
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* 仅 1 只基金时的提示 */}
          {funds.length === 1 && (
            <div className="glass-card p-3 flex items-center gap-2 text-xs text-gold-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>当前仅 1 只基金，加入更多基金可查看最佳值高亮对比</span>
            </div>
          )}

          <CompareTable funds={funds} onRemove={removeFromCompare} />

          {/* 添加更多入口 */}
          {funds.length < 5 && (
            <div className="text-center">
              <Link
                to="/funds"
                className="glass-button-gold inline-flex items-center gap-1.5 px-4 py-2 text-sm"
              >
                继续添加对比
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </>
      )}

      <ComplianceNotice />
    </div>
  );
}
