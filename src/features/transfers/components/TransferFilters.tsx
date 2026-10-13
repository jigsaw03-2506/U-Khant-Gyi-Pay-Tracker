import {
  CalendarDays,
  ChevronDown,
  Filter,
  Search,
  X,
} from 'lucide-react'
import { transferProviders, type TransferFiltersValue } from '../types/transfer.types'

interface TransferFiltersProps {
  filters: TransferFiltersValue
  onChange: (filters: TransferFiltersValue) => void
  onClear: () => void
  showProviderFilter?: boolean
}

export function TransferFilters({
  filters,
  onChange,
  onClear,
  showProviderFilter = true,
}: TransferFiltersProps) {
  const hasActiveFilters =
    filters.search ||
    filters.transactionType !== 'all' ||
    filters.provider !== 'all' ||
    filters.dateFrom ||
    filters.dateTo

  function updateFilter<Key extends keyof TransferFiltersValue>(
    key: Key,
    value: TransferFiltersValue[Key],
  ) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 py-3">
      <label className="flex h-10 min-w-48 flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 text-slate-500 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 sm:basis-56">
        <Search size={16} className="shrink-0" />
        <input
          className="min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          placeholder="Search customer, phone or reference…"
          value={filters.search}
          onChange={(event) => updateFilter('search', event.target.value)}
        />
        <kbd className="hidden rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-500 sm:inline">⌘ K</kbd>
      </label>
      <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-slate-500">
        <Filter size={15} className="shrink-0" />
        <select
          className="max-w-28 appearance-none border-0 bg-transparent text-sm text-slate-700 outline-none"
          value={filters.transactionType}
          onChange={(event) =>
            updateFilter(
              'transactionType',
              event.target.value as TransferFiltersValue['transactionType'],
            )
          }
          aria-label="Filter by transaction type"
        >
          <option value="all">All types</option>
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
        </select>
        <ChevronDown size={14} className="shrink-0" />
      </label>
      {showProviderFilter && (
        <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-slate-500">
          <select
            className="max-w-32 appearance-none border-0 bg-transparent text-sm text-slate-700 outline-none"
            value={filters.provider}
            onChange={(event) => updateFilter('provider', event.target.value)}
            aria-label="Filter by provider"
          >
            <option value="all">All providers</option>
            {transferProviders.map((provider) => <option key={provider}>{provider}</option>)}
          </select>
          <ChevronDown size={14} className="shrink-0" />
        </label>
      )}
      <label className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-slate-200 px-2 text-slate-500 sm:flex-none sm:px-3">
        <CalendarDays size={15} className="shrink-0" />
        <input
          className="w-full min-w-0 border-0 bg-transparent text-xs text-slate-700 outline-none sm:w-28"
          aria-label="Filter from date"
          type="date"
          value={filters.dateFrom}
          onChange={(event) => updateFilter('dateFrom', event.target.value)}
        />
        <span className="text-slate-400">–</span>
        <input
          className="w-full min-w-0 border-0 bg-transparent text-xs text-slate-700 outline-none sm:w-28"
          aria-label="Filter to date"
          type="date"
          value={filters.dateTo}
          onChange={(event) => updateFilter('dateTo', event.target.value)}
        />
      </label>
      <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-slate-500">
        <select
          className="appearance-none border-0 bg-transparent text-sm text-slate-700 outline-none"
          value={filters.sortOrder}
          onChange={(event) =>
            updateFilter('sortOrder', event.target.value as TransferFiltersValue['sortOrder'])
          }
          aria-label="Sort transactions"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
        <ChevronDown size={14} className="shrink-0" />
      </label>
      {hasActiveFilters && (
        <button className="inline-flex min-h-10 items-center gap-1 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900" type="button" onClick={onClear}>
          <X size={14} />Clear
        </button>
      )}
    </div>
  )
}
