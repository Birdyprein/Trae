import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  className?: string;
}

/**
 * 分页组件
 * - glass-button 样式
 * - 显示页码、上一页、下一页
 */
const Pagination: React.FC<PaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
  className = '',
}) => {
  const totalPages: number = Math.max(1, Math.ceil((total ?? 0) / (pageSize || 1)));

  if (totalPages <= 1) {
    return null;
  }

  // 生成页码列表（带省略号）
  const getPageItems = (): (number | '...')[] => {
    const items: (number | '...')[] = [];
    const delta = 1; // 当前页左右各显示 1 个

    const left = Math.max(1, current - delta);
    const right = Math.min(totalPages, current + delta);

    if (left > 1) {
      items.push(1);
      if (left > 2) items.push('...');
    }
    for (let i = left; i <= right; i++) {
      items.push(i);
    }
    if (right < totalPages) {
      if (right < totalPages - 1) items.push('...');
      items.push(totalPages);
    }
    return items;
  };

  const pageItems = getPageItems();
  const prevDisabled = current <= 1;
  const nextDisabled = current >= totalPages;

  const baseBtn =
    'glass-button min-w-[2rem] h-8 px-2 text-sm flex items-center justify-center transition-colors';

  return (
    <nav
      className={`flex items-center gap-1.5 ${className}`}
      aria-label="分页"
    >
      <button
        type="button"
        className={`${baseBtn} ${prevDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        onClick={() => !prevDisabled && onChange(current - 1)}
        disabled={prevDisabled}
        aria-label="上一页"
      >
        <ChevronLeft size={16} />
      </button>

      {pageItems.map((item, idx) =>
        item === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="text-white/40 text-sm px-1 select-none"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`${baseBtn} ${
              item === current
                ? '!bg-gold-400/20 !border-gold-400/40 !text-gold-300'
                : ''
            }`}
            aria-current={item === current ? 'page' : undefined}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        className={`${baseBtn} ${nextDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        onClick={() => !nextDisabled && onChange(current + 1)}
        disabled={nextDisabled}
        aria-label="下一页"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
