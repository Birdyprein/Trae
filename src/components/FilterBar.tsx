import type { FundType, SortField } from '@/types';
import { ArrowUpDown } from 'lucide-react';

interface Props {
  typeFilter: FundType | '全部';
  onTypeChange: (type: FundType | '全部') => void;
  sortField: SortField;
  sortDir: 'asc' | 'desc';
  onSortChange: (field: SortField, dir: 'asc' | 'desc') => void;
}

const types: (FundType | '全部')[] = ['全部', '股票型', '混合型', '债券型', '货币型', '指数型'];

const sortOptions: { label: string; field: SortField }[] = [
  { label: '近一年收益', field: 'yearlyReturn' },
  { label: '基金规模', field: 'scale' },
  { label: '日涨跌幅', field: 'dailyChange' },
];

export default function FilterBar({ typeFilter, onTypeChange, sortField, sortDir, onSortChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`px-3.5 py-1.5 text-sm rounded-lg transition-all duration-300 ${
              typeFilter === type
                ? 'bg-gold-500 text-surface font-semibold'
                : 'bg-surface-card border border-surface-border text-gray-300 hover:border-gold-500/30 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-muted" />
        <label htmlFor="sort-select" className="sr-only">排序方式</label>
        <select
          id="sort-select"
          value={`${sortField}-${sortDir}`}
          onChange={(e) => {
            const [field, dir] = e.target.value.split('-') as [SortField, 'asc' | 'desc'];
            onSortChange(field, dir);
          }}
          className="bg-surface-card border border-surface-border rounded-lg px-3 py-1.5 text-sm text-white
                     focus:outline-none focus:border-gold-500/50 cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.field} value={`${opt.field}-desc`}>
              {opt.label} ↓
            </option>
          ))}
          {sortOptions.map((opt) => (
            <option key={`${opt.field}-asc`} value={`${opt.field}-asc`}>
              {opt.label} ↑
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}