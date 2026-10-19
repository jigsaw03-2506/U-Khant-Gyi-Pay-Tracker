import { ArrowLeftRight, ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useState } from 'react'
import type { Transaction } from '../types/transfer.types'
import { formatMMK } from '../utils/transfer-utils'
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
  const [expandedIds, setExpandedIds] = useState<string[]>([])

  function toggleExpanded(id: string) {
    setExpandedIds((current) =>
      current.includes(id)
        ? current.filter((transactionId) => transactionId !== id)
        : [...current, id],
    )
  }

  if (transactions.length === 0) {
    const hasSavedTransfers = totalCount > 0

    return (
      <div className="flex flex-col items-center px-4 py-12 text-center">
        <div className="grid size-12 place-items-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
          {hasSavedTransfers ? <Search size={23} /> : <ArrowLeftRight size={24} />}
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-100">{hasSavedTransfers ? 'No matching transactions' : 'No transactions yet'}</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">
          {hasSavedTransfers
            ? 'Try changing your search or filters to find a transaction.'
            : 'Your saved transfers will show up here. Add your first transaction above.'}
        </p>
        {hasSavedTransfers && (
          <button className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-300 dark:border-white/15 px-4 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5" onClick={onClearFilters}>
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
      <div className="space-y-3 xl:hidden">
        {transactions.map((transaction) => {
          const isDeposit = transaction.transactionType === 'deposit'
          const isExpanded = expandedIds.includes(transaction.id)

          return (
            <div key={transaction.id} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/40 dark:bg-white/[0.03]">
              <div className="flex w-full items-center gap-3 p-3 text-left">
                <span className={`inline-flex w-20 shrink-0 items-center justify-center gap-2 rounded-full px-2 py-1 text-[10px] font-semibold ${isDeposit ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-200' : 'bg-sky-100 dark:bg-sky-500/15 text-sky-900 dark:text-sky-200'}`}>
                  <span className={`size-1.5 rounded-full ${isDeposit ? 'bg-emerald-700' : 'bg-sky-700'}`} />
                  {isDeposit ? 'Deposit' : 'Withdraw'}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{transaction.customerName}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{formatMMK(transaction.amount)}</p>
                </div>

                <button
                  type="button"
                  className="grid place-items-center rounded-lg p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-white/10"
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? 'Collapse transaction details' : 'Expand transaction details'}
                  aria-controls={`mobile-transaction-details-${transaction.id}`}
                  onClick={() => toggleExpanded(transaction.id)}
                >
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>

              <div
                id={`mobile-transaction-details-${transaction.id}`}
                className={`grid transition-all duration-200 ease-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/70 px-3 py-3">
                    <dl className="space-y-2 text-sm">
                      <MobileDetail label="Date & time" value={new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(transaction.dateTime))} />
                      <MobileDetail label="Provider" value={transaction.provider} />
                      <MobileDetail label="Phone" value={transaction.phoneNumber || '—'} />
                      <MobileDetail label="Reference" value={transaction.referenceNumber || '—'} />
                      <MobileDetail label="Service fee" value={formatMMK(transaction.serviceFee)} />
                      <MobileDetail label={isDeposit ? 'Cash paid' : 'Cash received'} value={formatMMK(isDeposit ? transaction.cashPaid : transaction.cashReceived)} />
                      {transaction.notes && <MobileDetail label="Note" value={transaction.notes} />}
                    </dl>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="inline-flex min-h-9 flex-1 items-center justify-center rounded-xl border border-slate-300 dark:border-white/15 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5"
                        onClick={() => onView(transaction)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="inline-flex min-h-9 flex-1 items-center justify-center rounded-xl border border-slate-300 dark:border-white/15 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5"
                        onClick={() => onEdit(transaction)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="inline-flex min-h-9 flex-1 items-center justify-center rounded-xl border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-3 text-xs font-medium text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-500/20"
                        onClick={() => onDelete(transaction)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="hidden xl:block">
        <div className="-mx-4 overflow-x-auto sm:-mx-6">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="bg-slate-50 dark:bg-white/[0.03]">
              <tr>
                <th className="px-3 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400">Date & time</th>
                <th className="px-3 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400">Type</th>
                <th className="px-3 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400">Provider</th>
                <th className="px-3 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400">Customer</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400">Amount</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400">Fee</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400">Cash received</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400">Cash paid</th>
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
      </div>
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-white/5 pt-3 text-xs text-slate-600 dark:text-slate-400">
        <span>
          Showing <strong className="font-semibold text-slate-800 dark:text-slate-100">{firstItem}–{lastItem}</strong> of <strong className="font-semibold text-slate-800 dark:text-slate-100">{totalCount}</strong> transactions
        </span>
        <div className="flex items-center gap-2">
          <button
            className="grid size-9 place-items-center rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={page <= 1}
            aria-label="Previous page"
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            <ChevronLeft size={16} />
          </button>
          <span>Page <strong className="font-semibold text-slate-800 dark:text-slate-100">{page}</strong> of {pageCount}</span>
          <button
            className="grid size-9 place-items-center rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
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

function MobileDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="min-w-[82px] text-xs text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="min-w-0 flex-1 break-words text-right text-slate-700 dark:text-slate-200">{value}</dd>
    </div>
  )
}
