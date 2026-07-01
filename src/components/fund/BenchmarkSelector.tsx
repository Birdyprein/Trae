import { Check } from 'lucide-react';
import { PRESET_BENCHMARKS } from '@/constants';
import type { Benchmark } from '@/types';

interface BenchmarkSelectorProps {
  selected: string[];
  onChange: (codes: string[]) => void;
}

export default function BenchmarkSelector({ selected, onChange }: BenchmarkSelectorProps) {
  const toggle = (benchmark: Benchmark) => {
    if (selected.includes(benchmark.code)) {
      onChange(selected.filter((c) => c !== benchmark.code));
    } else {
      onChange([...selected, benchmark.code]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted">选择基准（可多选）</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {PRESET_BENCHMARKS.map((benchmark) => {
          const isSelected = selected.includes(benchmark.code);
          return (
            <button
              key={benchmark.code}
              onClick={() => toggle(benchmark)}
              className={`glass-button flex items-center justify-between px-3 py-2.5 text-sm transition-all ${
                isSelected
                  ? '!bg-gold-400/15 !border-gold-400/40 !text-gold-300'
                  : 'text-secondary'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`flex items-center justify-center w-4 h-4 rounded border shrink-0 transition-all ${
                    isSelected
                      ? 'bg-gold-400 border-gold-400'
                      : 'border-white/20'
                  }`}
                >
                  {isSelected && <Check size={12} className="text-black" />}
                </span>
                <span className="truncate">{benchmark.name}</span>
              </div>
              <span className="text-[10px] text-muted shrink-0 ml-2">
                {benchmark.type === 'index' ? '指数' : '同类'}
              </span>
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted">已选 {selected.length} 项</span>
          <button
            onClick={() => onChange([])}
            className="text-xs text-muted hover:text-white transition-colors"
          >
            清空
          </button>
        </div>
      )}
    </div>
  );
}
