import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted" />
      <input
        type="text"
        aria-label="搜索基金"
        placeholder="搜索基金名称或代码..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 sm:pl-12 pr-9 sm:pr-10 py-2 sm:py-3 bg-surface-card border border-surface-border rounded-lg sm:rounded-xl
                   text-white placeholder-muted text-xs sm:text-sm
                   focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20
                   transition-all duration-300"
      />
      {value && (
        <button
          type="button"
          aria-label="清除搜索"
          onClick={() => onChange('')}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      )}
    </div>
  );
}