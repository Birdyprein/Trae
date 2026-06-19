import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
      <input
        type="text"
        placeholder="搜索基金名称或代码..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-10 py-3 bg-surface-card border border-surface-border rounded-xl
                   text-white placeholder-muted text-sm
                   focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20
                   transition-all duration-300"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}