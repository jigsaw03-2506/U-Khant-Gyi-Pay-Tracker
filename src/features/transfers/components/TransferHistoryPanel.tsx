import { useMemo, useState } from 'react'
import { FileText } from 'lucide-react'
import { toast } from 'sonner'
import { DeleteTransferDialog } from './DeleteTransferDialog'
import { TransferDetailsDialog } from './TransferDetailsDialog'
import { TransferFilters } from './TransferFilters'
import { TransferTable } from './TransferTable'
import type {
  Transaction,
  TransferFiltersValue,
} from '../types/transfer.types'
import { filterAndSortTransfers } from '../utils/transfer-utils'

const PAGE_SIZE = 8
const initialFilters: TransferFiltersValue = {
  search: '',
  transactionType: 'all',
  provider: 'all',
  dateFrom: '',
  dateTo: '',
  sortOrder: 'newest',
}

interface TransferHistoryPanelProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => Promise<void> | void
  showProviderFilter?: boolean
  compactHeading?: boolean
}

export function TransferHistoryPanel({
  transactions,
  onEdit,
  onDelete,
  showProviderFilter = true,
  compactHeading = false,
}: TransferHistoryPanelProps) {
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState<Transaction | null>(null)
  const [deleting, setDeleting] = useState<Transaction | null>(null)

  const filteredTransactions = useMemo(
    () => filterAndSortTransfers(transactions, filters),
    [transactions, filters],
  )
  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageTransactions = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  function updateFilters(nextFilters: TransferFiltersValue) {
    setFilters(nextFilters)
    setPage(1)
  }

  function clearFilters() {
    setFilters(initialFilters)
    setPage(1)
  }

  async function confirmDelete() {
    if (!deleting) return
    try {
      await onDelete(deleting.id)
      setDeleting(null)
      toast.success('Transaction deleted.')
    } catch (error) {
      console.error('Unable to delete transaction.', error)
      toast.error('Could not delete this transaction. Try again.')
    }
  }

  function handleEdit(transaction: Transaction) {
    setViewing(null)
    onEdit(transaction)
  }

  return (
    <>
      <section className="contain-paint overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/70 shadow-sm">
        <div className={`flex items-center gap-3 p-4 sm:px-5 ${compactHeading ? 'border-b border-slate-100 dark:border-white/5' : ''}`}>
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-800 dark:text-blue-300">
            <FileText size={19} />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">Transaction history</h2>
            {!compactHeading && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Search, filter, review, and manage saved transfers.
              </p>
            )}
          </div>
          <span className="ml-auto shrink-0 rounded-full bg-slate-100 dark:bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
            {transactions.length} {transactions.length === 1 ? 'record' : 'records'}
          </span>
        </div>
        <div className="px-4 sm:px-5">
          <TransferFilters
            filters={filters}
            onChange={updateFilters}
            onClear={clearFilters}
            showProviderFilter={showProviderFilter}
          />
          <TransferTable
            transactions={pageTransactions}
            totalCount={filteredTransactions.length}
            page={currentPage}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            onView={setViewing}
            onEdit={handleEdit}
            onDelete={setDeleting}
            onClearFilters={clearFilters}
          />
        </div>
      </section>

      <TransferDetailsDialog
        transaction={viewing}
        onClose={() => setViewing(null)}
        onEdit={handleEdit}
      />
      <DeleteTransferDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
