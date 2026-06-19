import { useState } from 'react';
import { Search } from 'lucide-react';
import { useFunds } from '@/hooks/useFunds';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import FundTable from '@/components/FundTable';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 8;

export default function FundListPage() {
  const { funds, search, setSearch, typeFilter, setTypeFilter, sortField, sortDir, toggleSort } = useFunds();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(funds.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const paged = funds.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 animate-on-scroll">
        <h1 className="font-display text-3xl font-bold text-white mb-2">基金列表</h1>
        <p className="text-muted">浏览和筛选优质基金产品</p>
      </div>

      <div className="space-y-5 mb-8 animate-on-scroll stagger-1">
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar
          typeFilter={typeFilter}
          onTypeChange={(t) => { setTypeFilter(t); setPage(1); }}
          sortField={sortField}
          sortDir={sortDir}
          onToggleSort={toggleSort}
        />
      </div>

      {funds.length === 0 ? (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="text-muted text-lg">未找到匹配的基金</p>
          <p className="text-sm text-muted mt-2">尝试调整搜索条件或筛选条件</p>
        </div>
      ) : (
        <>
          <div className="animate-on-scroll stagger-2">
            <FundTable funds={paged} />
          </div>
          <Pagination
            current={currentPage}
            total={funds.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}