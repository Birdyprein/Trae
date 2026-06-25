import { useState, useEffect } from 'react';
import { Search, Calculator, Loader2 } from 'lucide-react';
import { useFundDataStore } from '@/stores/fundDataStore';
import type { SortField } from '@/types';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import FundTable from '@/components/FundTable';
import Pagination from '@/components/Pagination';
import FundCompare from '@/components/FundCompare';
import SIPCalculator from '@/components/SIPCalculator';

const PAGE_SIZE = 50;

export default function FundListPage() {
  const funds = useFundDataStore((s) => s.funds);
  const totalFunds = useFundDataStore((s) => s.totalFunds);
  const loading = useFundDataStore((s) => s.loading);
  const currentPage = useFundDataStore((s) => s.currentPage);
  const currentType = useFundDataStore((s) => s.currentType);
  const loadFundPage = useFundDataStore((s) => s.loadFundPage);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('yearlyReturn');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showCompare, setShowCompare] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    const type = typeFilter === '' ? 'all' : typeFilter;
    loadFundPage(1, type);
  }, [typeFilter, loadFundPage]);

  const handlePageChange = (page: number) => {
    const type = typeFilter === '' ? 'all' : typeFilter;
    loadFundPage(page, type);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleTypeChange = (type: string) => {
    setTypeFilter(type);
  };

  const handleSortChange = (field: SortField, dir: 'asc' | 'desc') => {
    setSortField(field);
    setSortDir(dir);
  };

  const displayFunds = search
    ? funds.filter(
        (f) =>
          f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.code.includes(search)
      )
    : funds;

  return (
    <div className="section-container py-6 sm:py-8 lg:py-10">
      {/* Header */}
      <div className="mb-6 sm:mb-8 animate-on-scroll">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">基金列表</h1>
            <p className="text-muted text-xs sm:text-sm">浏览和筛选优质基金产品</p>
          </div>
          <button
            onClick={() => setShowCalculator(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg sm:rounded-xl hover:from-green-700 hover:to-green-800 transition-colors shadow-lg text-sm"
          >
            <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
            定投计算器
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 sm:space-y-5 mb-5 sm:mb-8 animate-on-scroll stagger-1">
        <SearchBar value={search} onChange={handleSearchChange} />
        <FilterBar
          typeFilter={typeFilter as any}
          onTypeChange={handleTypeChange}
          sortField={sortField}
          sortDir={sortDir}
          onSortChange={handleSortChange}
          onOpenCompare={() => setShowCompare(true)}
        />
      </div>

      {/* Fund Count */}
      <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500 flex items-center gap-2">
        共找到 <span className="font-semibold text-blue-600">{totalFunds.toLocaleString()}</span> 只基金
        {loading && <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-blue-500" />}
      </div>

      {/* Fund Table */}
      {funds.length === 0 && !loading ? (
        <div className="text-center py-12 sm:py-20 animate-on-scroll">
          <Search className="w-10 h-10 sm:w-12 sm:h-12 text-muted mx-auto mb-3 sm:mb-4" />
          <p className="text-muted text-base sm:text-lg">未找到匹配的基金</p>
          <p className="text-xs sm:text-sm text-muted mt-1 sm:mt-2">尝试调整搜索条件或筛选条件</p>
        </div>
      ) : (
        <>
          <div className="animate-on-scroll stagger-2 relative">
            {loading && (
              <div className="absolute inset-0 bg-surface/50 flex items-center justify-center z-10 rounded-lg sm:rounded-xl">
                <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
              </div>
            )}
            <FundTable funds={displayFunds} />
          </div>
          <Pagination
            current={currentPage}
            total={search ? displayFunds.length : totalFunds}
            pageSize={search ? displayFunds.length : PAGE_SIZE}
            onChange={handlePageChange}
          />
        </>
      )}

      {/* Modals */}
      {showCompare && (
        <FundCompare funds={funds} onClose={() => setShowCompare(false)} />
      )}
      
      {showCalculator && (
        <SIPCalculator onClose={() => setShowCalculator(false)} />
      )}
    </div>
  );
}
