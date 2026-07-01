import React, { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  defaultValue?: string;
  debounceMs?: number;
  className?: string;
}

/**
 * 搜索框
 * - glass-input 样式，带搜索图标
 * - 内置防抖处理
 */
const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = '搜索基金代码 / 名称...',
  defaultValue = '',
  debounceMs = 300,
  className = '',
}) => {
  const [value, setValue] = useState<string>(defaultValue ?? '');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 受控恢复外部默认值
  useEffect(() => {
    setValue(defaultValue ?? '');
  }, [defaultValue]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, debounceMs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timerRef.current) clearTimeout(timerRef.current);
    onSearch(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full ${className}`}
      role="search"
    >
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="glass-input w-full pl-9 pr-3 py-2 text-sm"
        aria-label={placeholder}
      />
    </form>
  );
};

export default SearchBar;
