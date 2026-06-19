import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export default function Pagination({ current, total, pageSize, onChange }: Props) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(totalPages, current + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="p-2 rounded-lg text-muted hover:text-white hover:bg-surface-card disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      {start > 1 && (
        <>
          <button onClick={() => onChange(1)} className="w-9 h-9 rounded-lg text-sm text-muted hover:text-white hover:bg-surface-card transition-colors">1</button>
          {start > 2 && <span className="text-muted">...</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
            p === current
              ? 'bg-gold-500 text-surface'
              : 'text-muted hover:text-white hover:bg-surface-card'
          }`}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-muted">...</span>}
          <button onClick={() => onChange(totalPages)} className="w-9 h-9 rounded-lg text-sm text-muted hover:text-white hover:bg-surface-card transition-colors">{totalPages}</button>
        </>
      )}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === totalPages}
        className="p-2 rounded-lg text-muted hover:text-white hover:bg-surface-card disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}