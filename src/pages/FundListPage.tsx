import { useEffect, useState, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import type { Fund, BasicFilter, AdvancedFilter } from '@/types';
import { fetchFundList } from '@/services/api';
import { useFilterStore } from '@/stores/filterStore';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import FundTable from '@/components/fund/FundTable';
import FundCard from '@/components/fund/FundCard';
import FundFilterBar from '@/components/fund/FundFilterBar';
import FundAdvancedFilter from '@/components/fund/FundAdvancedFilter';

const PAGE_SIZE = 20;
const SCROLL_KEY = 'fund-list-scroll';

function saveScrollState(page: number, keyword: string) {
  sessionStorage.setItem(SCROLL_KEY, JSON.stringify({
    scrollY: window.scrollY,
    page,
    keyword,
    timestamp: Date.now(),
  }));
}

function loadScrollState(): { scrollY: number; page: number; keyword: string } | null {
  try {
    const raw = sessionStorage.getItem(SCROLL_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // 30 分钟内有效
    if (Date.now() - data.timestamp > 30 * 60 * 1000) return null;
    return data;
  } catch {
    return null;
  }
}

export default function FundListPage() {
  const { basic, advanced, showAdvanced } = useFilterStore();

  // 挂载时一次性恢复状态，之后不再读取 sessionStorage
  const savedState = useRef(loadScrollState()).current;
  const isRestoringRef = useRef(!!savedState);
  const savedScrollY = useRef(savedState?.scrollY ?? 0);

  const [funds, setFunds] = useState<Fund[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(savedState?.page ?? 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState(savedState?.keyword ?? '');
  const [restored, setRestored] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildParams = useCallback((kw: string, b: BasicFilter, a: AdvancedFilter) => {
    const type = b.type && b.type.length > 0 ? b.type.join(',') : undefined;
    return {
      type,
      sortBy: b.sortBy,
      sortOrder: b.sortOrder,
      keyword: kw || undefined,
      ...(a.minYear1Return !== undefined && { minYear1Return: a.minYear1Return }),
      ...(a.minYear3Return !== undefined && { minYear3Return: a.minYear3Return }),
      ...(a.minEstablishYears !== undefined && { minEstablishYears: a.minEstablishYears }),
      ...(a.excludeNewFunds && { excludeNewFunds: true }),
    };
  }, []);

  const loadFunds = useCallback(
    async (p: number, kw: string, b: BasicFilter, a: AdvancedFilter) => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      setError(null);
      try {
        const res = await fetchFundList(p, PAGE_SIZE, buildParams(kw, b, a), abortRef.current.signal);
        setFunds(res.funds ?? []);
        setTotal(res.total ?? 0);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError('基金数据加载失败，请稍后重试');
        setFunds([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [buildParams]
  );

  // 初始加载 + 恢复完成后恢复滚动位置
  useEffect(() => {
    loadFunds(page, keyword, basic, advanced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 筛选/排序/高级筛选变化时回到第 1 页（恢复期间不执行）
  useEffect(() => {
    if (isRestoringRef.current) return;
    setPage(1);
    loadFunds(1, keyword, basic, advanced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basic.sortBy, basic.sortOrder, advanced]);

  // 关键字防抖（恢复期间不执行）
  useEffect(() => {
    if (isRestoringRef.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      loadFunds(1, keyword, basic, advanced);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  // 翻页
  useEffect(() => {
    if (isRestoringRef.current) return;
    loadFunds(page, keyword, basic, advanced);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // 数据加载完成后恢复滚动位置
  useEffect(() => {
    if (!loading && funds.length > 0 && !restored) {
      if (isRestoringRef.current && savedScrollY.current > 0) {
        window.scrollTo({ top: savedScrollY.current, behavior: 'instant' as ScrollBehavior });
      }
      isRestoringRef.current = false;
      setRestored(true);
    }
  }, [loading, funds.length, restored]);

  // 保存滚动位置
  useEffect(() => {
    const handleScroll = () => {
      if (scrollSaveRef.current) clearTimeout(scrollSaveRef.current);
      scrollSaveRef.current = setTimeout(() => {
        saveScrollState(page, keyword);
      }, 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollSaveRef.current) clearTimeout(scrollSaveRef.current);
    };
  }, [page, keyword]);

  // 离开页面时保存状态
  useEffect(() => {
    return () => {
      saveScrollState(page, keyword);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [page, keyword]);

  return (
    <div className="section-container section-padding space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">基金列表</h1>
        <p className="text-muted text-xs sm:text-sm mt-1">共 {total.toLocaleString()} 只基金</p>
      </div>

      {/* 搜索栏 */}
      <SearchBar onSearch={setKeyword} placeholder="搜索基金代码或名称" defaultValue={keyword} />

      {/* 基础筛选 */}
      <FundFilterBar />

      {/* 高级筛选 */}
      {showAdvanced && (
        <div className="animate-slide-up">
          <FundAdvancedFilter />
        </div>
      )}

      {/* 基金展示 */}
      {loading ? (
        <LoadingSpinner label="加载基金数据..." />
      ) : error ? (
        <div className="glass-card p-8">
          <EmptyState
            icon={<X className="w-12 h-12 text-gain/60" />}
            message={error}
          />
          <div className="text-center -mt-4 pb-2">
            <button
              type="button"
              onClick={() => loadFunds(page, keyword, basic, advanced)}
              className="glass-button-gold inline-flex items-center px-4 py-2 text-xs"
            >
              重试
            </button>
          </div>
        </div>
      ) : funds.length === 0 ? (
        <div className="glass-card p-8">
          <EmptyState
            icon={<X className="w-12 h-12 text-gold-400/60" />}
            message="未找到匹配基金，请尝试调整筛选条件或更换关键词"
          />
        </div>
      ) : (
        <>
          {/* 桌面：表格；移动：卡片网格 */}
          <div className="hidden md:block">
            <FundTable funds={funds} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
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
    </div>
  );
}
