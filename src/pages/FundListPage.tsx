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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 animate-on-scroll">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">基金列表</h1>
            <p className="text-muted">浏览和筛选优质基金产品</p>
          </div>
          <button
            onClick={() => setShowCalculator(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-colors shadow-lg"
          >
            <Calculator className="w-5 h-5" />
            定投计算器
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-5 mb-8 animate-on-scroll stagger-1">
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
      <div className="mb-4 text-sm text-gray-500 flex items-center gap-2">
        共找到 <span className="font-semibold text-blue-600">{totalFunds.toLocaleString()}</span> 只基金
        {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
      </div>

      {/* Fund Table */}
      {funds.length === 0 && !loading ? (
        <div className="text-center py-20 animate-on-scroll">
          <Search className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="text-muted text-lg">未找到匹配的基金</p>
          <p className="text-sm text-muted mt-2">尝试调整搜索条件或筛选条件</p>
        </div>
      ) : (
        <>
          <div className="animate-on-scroll stagger-2 relative">
            {loading && (
              <div className="absolute inset-0 bg-surface/50 flex items-center justify-center z-10 rounded-xl">
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
