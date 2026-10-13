import { ArrowLeftRight, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import type { Transaction } from '../types/transfer.types'
import { TransferTableRow } from './TransferTableRow'

interface TransferTableProps {
  transactions: Transaction[]
  totalCount: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onView: (transaction: Transaction) => void
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
  onClearFilters: () => void
}

export function TransferTable({
  transactions,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onClearFilters,
}: TransferTableProps) {
  if (transactions.length === 0) {
    const hasSavedTransfers = totalCount > 0

    return (
      <div className="flex flex-col items-center px-4 py-12 text-center">
        <div className="grid size-12 place-items-center rounded-xl bg-emerald-50 text-emerald-800">
          {hasSavedTransfers ? <Search size={23} /> : <ArrowLeftRight size={24} />}
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-800">{hasSavedTransfers ? 'No matching transactions' : 'No transactions yet'}</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
          {hasSavedTransfers
            ? 'Try changing your search or filters to find a transaction.'
            : 'Your saved transfers will show up here. Add your first transaction above.'}
        </p>
        {hasSavedTransfers && (
          <button className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={onClearFilters}>
            Clear all filters
          </button>
        )}
      </div>
    )
  }

  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize))
  const firstItem = (page - 1) * pageSize + 1
  const lastItem = Math.min(page * pageSize, totalCount)

  return (
    <>
      <div className="-mx-4 overflow-x-auto sm:-mx-6">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-3 text-xs font-semibold text-slate-600">Date & time</th>
              <th className="px-3 py-3 text-xs font-semibold text-slate-600">Type</th>
              <th className="px-3 py-3 text-xs font-semibold text-slate-600">Provider</th>
              <th className="px-3 py-3 text-xs font-semibold text-slate-600">Customer</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-slate-600">Amount</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-slate-600">Fee</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-slate-600">Cash received</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-slate-600">Cash paid</th>
              <th className="px-3 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <TransferTableRow
                key={transaction.id}
                transaction={transaction}
                onView={() => onView(transaction)}
                onEdit={() => onEdit(transaction)}
                onDelete={() => onDelete(transaction)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-600">
        <span>
          Showing <strong className="font-semibold text-slate-800">{firstItem}–{lastItem}</strong> of <strong className="font-semibold text-slate-800">{totalCount}</strong> transactions
        </span>
        <div className="flex items-center gap-2">
          <button
            className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={page <= 1}
            aria-label="Previous page"
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            <ChevronLeft size={16} />
          </button>
          <span>Page <strong className="font-semibold text-slate-800">{page}</strong> of {pageCount}</span>
          <button
            className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={page >= pageCount}
            aria-label="Next page"
            onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  )
}
