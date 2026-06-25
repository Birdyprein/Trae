import { useState } from 'react';
import { Filter, ArrowUpDown, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import type { SortField } from '@/types';

interface FilterBarProps {
  typeFilter: string;
  onTypeChange: (type: string) => void;
  sortField: SortField;
  sortDir: 'asc' | 'desc';
  onSortChange: (field: SortField, dir: 'asc' | 'desc') => void;
  onOpenCompare?: () => void;
}

const FUND_TYPES = [
  { value: '', label: '全部类型' },
  { value: 'gp', label: '股票型' },
  { value: 'hh', label: '混合型' },
  { value: 'zq', label: '债券型' },
  { value: 'zs', label: '指数型' },
  { value: 'hb', label: '货币型' },
  { value: 'qdii', label: 'QDII' },
  { value: 'fof', label: 'FOF' },
];

const PERFORMANCE_FILTERS = [
  { value: '', label: '不限' },
  { value: 'yearlyReturn', label: '近1年收益' },
  { value: 'month6', label: '近6月收益' },
  { value: 'month3', label: '近3月收益' },
  { value: 'month1', label: '近1月收益' },
];

export default function FilterBar({
  typeFilter,
  onTypeChange,
  sortField,
  sortDir,
  onSortChange,
  onOpenCompare,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [perfFilter, setPerfFilter] = useState('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      onSortChange(field, sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'desc');
    }
  };

  const handlePerfFilter = (value: string) => {
    setPerfFilter(value);
    if (value) {
      onSortChange(value as SortField, 'desc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {FUND_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Performance Filter */}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gray-500" />
          <select
            value={perfFilter}
            onChange={(e) => handlePerfFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PERFORMANCE_FILTERS.map(item => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* More Filters Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={clsx(
            'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors',
            showFilters
              ? 'bg-blue-50 border-blue-200 text-blue-600'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          )}
        >
          <Calendar className="w-4 h-4" />
          更多筛选
        </button>

        <div className="flex-1" />

        {/* Compare Button */}
        {onOpenCompare && (
          <button
            onClick={onOpenCompare}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors shadow-sm"
          >
            <BarChart3 className="w-4 h-4" />
            基金对比
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="p-4 bg-gray-50 rounded-xl space-y-4 animate-fade-in">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">收益排序</label>
            <div className="flex flex-wrap gap-2">
              {[
                { field: 'yearlyReturn' as SortField, label: '近1年' },
                { field: 'month6' as SortField, label: '近6月' },
                { field: 'month3' as SortField, label: '近3月' },
                { field: 'month1' as SortField, label: '近1月' },
                { field: 'dailyChange' as SortField, label: '日涨跌' },
                { field: 'nav' as SortField, label: '净值' },
              ].map(item => (
                <button
                  key={item.field}
                  onClick={() => handleSort(item.field)}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors',
                    sortField === item.field
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                  )}
                >
                  {item.label}
                  {sortField === item.field && (
                    <ArrowUpDown className="w-3 h-3" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Current Sort Indicator */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>排序：</span>
        <span className="text-blue-600 font-medium">
          {sortField === 'nav' && '净值'}
          {sortField === 'dailyChange' && '日涨跌'}
          {sortField === 'yearlyReturn' && '近1年收益'}
          {sortField === 'month1' && '近1月收益'}
          {sortField === 'month3' && '近3月收益'}
          {sortField === 'month6' && '近6月收益'}
        </span>
        <span>{sortDir === 'desc' ? '降序' : '升序'}</span>
      </div>
    </div>
  );
}
