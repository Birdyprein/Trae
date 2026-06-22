import { useMemo, useState, useEffect } from 'react';
import { useFundDataStore } from '@/stores/fundDataStore';
import type { Fund, FundType, SortField } from '@/types';

export function useFunds() {
  const allFunds = useFundDataStore((s) => s.funds);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<FundType | '全部'>('全部');
  const [sortField, setSortField] = useState<SortField>('yearlyReturn');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    let result = [...allFunds];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (f) => f.name.toLowerCase().includes(s) || f.code.includes(s)
      );
    }

    if (typeFilter !== '全部') {
      result = result.filter((f) => f.type === typeFilter);
    }

    result.sort((a, b) => {
      const val = sortDir === 'desc' ? b[sortField] - a[sortField] : a[sortField] - b[sortField];
      return val;
    });

    return result;
  }, [allFunds, search, typeFilter, sortField, sortDir]);

  const setSort = (field: SortField, dir: 'asc' | 'desc') => {
    setSortField(field);
    setSortDir(dir);
  };

  return { funds: filtered, search, setSearch, typeFilter, setTypeFilter, sortField, sortDir, setSort };
}

export function useFund(id: string): Fund | undefined {
  const allFunds = useFundDataStore((s) => s.funds);
  return useMemo(() => allFunds.find((f) => f.id === id), [allFunds, id]);
}

export function useRealDataLoader() {
  const loadRealData = useFundDataStore((s) => s.loadRealData);
  useEffect(() => {
    loadRealData();
  }, []);
}