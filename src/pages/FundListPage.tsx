import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GitCompareArrows, ArrowRight, X } from 'lucide-react';
import type { Fund, BasicFilter } from '@/types';
import { fetchFundList } from '@/services/api';
import { useFilterStore } from '@/stores/filterStore';
import { useCompareStore } from '@/stores/compareStore';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import FundTable from '@/components/fund/FundTable';
import FundCard from '@/components/fund/FundCard';
import FundFilterBar from '@/components/fund/FundFilterBar';
import FundAdvancedFilter from '@/components/fund/FundAdvancedFilter';

const PAGE_SIZE = 20;

export default function FundListPage() {
  const { basic, advanced, showAdvanced } = useFilterStore();
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();

  const [funds, setFunds] = useState<Fund[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildParams = useCallback((kw: string, b: BasicFilter) => {
    const type = b.type && b.type.length > 0 ? b.type.join(',') : undefined;
    return {
      type,
      sortBy: b.sortBy,
      sortOrder: b.sortOrder,
      keyword: kw || undefined,
    };
  }, []);

  const loadFunds = useCallback(
    async (p: number, kw: string, b: BasicFilter) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchFundList(p, PAGE_SIZE, buildParams(kw, b));
        setFunds(res.funds ?? []);
        setTotal(res.total ?? 0);
      } catch {
        setError('基金数据加载失败，请稍后重试');
        setFunds([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [buildParams]
  );

  // 筛选/排序变化时回到第 1 页
  useEffect(() => {
    setPage(1);
    loadFunds(1, keyword, basic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basic.type, basic.sortBy, basic.sortOrder, basic.riskLevel, advanced]);

  // 关键字防抖
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      loadFunds(1, keyword, basic);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  // 翻页
  useEffect(() => {
    loadFunds(page, keyword, basic);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="section-container section-padding space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">基金列表</h1>
        <p className="text-muted text-xs sm:text-sm mt-1">共 {total.toLocaleString()} 只基金</p>
      </div>

      {/* 搜索栏（自带防抖） */}
      <SearchBar onSearch={setKeyword} placeholder="搜索基金代码或名称" />

      {/* 两栏布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* 左侧筛选栏 */}
        <aside className="space-y-4">
          <div className="card-light p-5 lg:sticky lg:top-20">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🔍</span>
              基金筛选
            </h3>
            
            {/* 基础筛选（组件内部使用 store） */}
            <FundFilterBar />

            {/* 高级筛选（组件内部使用 store，自带展开/折叠按钮在 FundFilterBar 中） */}
            {showAdvanced && (
              <div className="animate-slide-up mt-4">
                <FundAdvancedFilter />
              </div>
            )}
          </div>
        </aside>

        {/* 右侧基金列表 */}
        <section>
          {loading ? (
            <LoadingSpinner label="加载基金数据..." />
          ) : error ? (
            <div className="card-light p-8">
              <EmptyState
                icon={<X className="w-12 h-12 text-red-500/60" />}
                message={error}
              />
              <div className="text-center -mt-4 pb-2">
                <button
                  type="button"
                  onClick={() => loadFunds(page, keyword, basic)}
                  className="px-6 py-2 text-sm font-bold rounded-full transition-all hover:-translate-y-0.5"
                  style={{
                    background: '#c9a84c',
                    color: '#1a1a1a',
                    border: '1.5px solid #c9a84c',
                  }}
                >
                  重试
                </button>
              </div>
            </div>
          ) : funds.length === 0 ? (
            <div className="card-light p-8">
              <EmptyState
                icon={<X className="w-12 h-12 text-gray-400" />}
                message="未找到匹配基金，请尝试调整筛选条件或更换关键词"
              />
            </div>
          ) : (
            <>
              {/* 桌面：表格；移动：卡片网格 */}
              <div className="hidden md:block">
                <FundTable funds={funds} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                {funds.map((fund, idx) => (
                  <FundCard key={fund.id ?? fund.code} fund={fund} index={idx} />
                ))}
              </div>

              <Pagination
                current={page}
                total={total}
                pageSize={PAGE_SIZE}
                onChange={setPage}
              />
            </>
          )}
        </section>
      </div>

      {/* 对比浮动按钮 */}
      {compareList.length > 0 && (
        <div className="fixed bottom-4 inset-x-0 flex justify-center z-40 px-4 pointer-events-none">
          <div className="glass-card pointer-events-auto px-4 py-3 flex items-center gap-3 max-w-full">
            <GitCompareArrows className="w-5 h-5 text-gold-400 flex-shrink-0" />
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide max-w-[50vw]">
              {compareList.map((id) => (
                <span
                  key={id}
                  className="glass-badge flex items-center gap-1 whitespace-nowrap"
                >
                  {id}
                  <button
                    type="button"
                    onClick={() => removeFromCompare(id)}
                    className="hover:text-gain"
                    aria-label="移出对比"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
            <Link
              to="/compare"
              className="glass-button-gold inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium whitespace-nowrap"
            >
              对比
              <ArrowRight className="w-3 h-3" />
            </Link>
            <button
              type="button"
              onClick={clearCompare}
              className="text-muted hover:text-gain text-xs whitespace-nowrap"
            >
              清空
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
