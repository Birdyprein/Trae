import { ChevronDown, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { FUND_TYPES } from '@/constants';
import { useFilterStore } from '@/stores/filterStore';
import type { FundType, SortField } from '@/types';

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'year1Return', label: '近1年收益' },
  { value: 'year3Return', label: '近3年收益' },
  { value: 'scale', label: '基金规模' },
  { value: 'maxDrawdown', label: '最大回撤' },
  { value: 'sharpeRatio', label: '夏普比率' },
  { value: 'establishDate', label: '成立时间' },
];

export default function FundFilterBar() {
  const { basic, setBasic, showAdvanced, toggleAdvanced } = useFilterStore();

  const selectedTypes = basic.type ?? [];

  const toggleType = (type: FundType) => {
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setBasic({ type: next.length === 0 ? undefined : next });
  };

  const toggleSortOrder = () => {
    setBasic({ sortOrder: basic.sortOrder === 'asc' ? 'desc' : 'asc' });
  };

  return (
    <div className="glass-data-card p-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
        {/* 基金类型按钮组 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-muted mr-1 shrink-0">类型</span>
            {FUND_TYPES.map((type) => {
              const active = selectedTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`glass-button px-2.5 py-1 text-xs transition-all ${
                    active
                      ? '!bg-gold-400/20 !border-gold-400/40 !text-gold-300'
                      : 'text-secondary'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* 排序 */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <ArrowUpDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <select
              value={basic.sortBy ?? 'year1Return'}
              onChange={(e) => setBasic({ sortBy: e.target.value as SortField })}
              className="glass-input pl-8 pr-7 py-1.5 text-xs appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-surface-data text-white">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
          <button
            onClick={toggleSortOrder}
            className="glass-button px-2 py-1.5 text-xs text-secondary"
            title={basic.sortOrder === 'asc' ? '升序' : '降序'}
          >
            {basic.sortOrder === 'asc' ? '↑ 升序' : '↓ 降序'}
          </button>

          {/* 高级筛选切换 */}
          <button
            onClick={toggleAdvanced}
            className={`glass-button flex items-center gap-1 px-2.5 py-1.5 text-xs transition-all ${
              showAdvanced
                ? '!bg-gold-400/20 !border-gold-400/40 !text-gold-300'
                : 'text-secondary'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">高级筛选</span>
          </button>
        </div>
      </div>
    </div>
  );
}
