import { useMemo, useState } from 'react'
import { FileText } from 'lucide-react'
import { toast } from 'sonner'
import { AppFooter } from '../../components/layout/AppFooter'
import { AppHeader } from '../../components/layout/AppHeader'
import { DeleteTransferDialog } from './components/DeleteTransferDialog'
import { TransferDetailsDialog } from './components/TransferDetailsDialog'
import { TransferFilters } from './components/TransferFilters'
import { TransferForm } from './components/TransferForm'
import { TransferTable } from './components/TransferTable'
import { useTransfers } from './hooks/useTransfers'
import type {
  Transaction,
  TransferFiltersValue,
} from './types/transfer.types'
import {
  filterAndSortTransfers,
  getLocalDateKey,
} from './utils/transfer-utils'
import { TransferSummary } from '../dashboard/components/TransferSummary'

const PAGE_SIZE = 8

const initialFilters: TransferFiltersValue = {
  search: '',
  transactionType: 'all',
  provider: 'all',
  dateFrom: '',
  dateTo: '',
  sortOrder: 'newest',
}

export function TransferPage() {
  const { transfers, saveTransfer, deleteTransfer } = useTransfers()
  const [summaryDate, setSummaryDate] = useState(() =>
    getLocalDateKey(new Date().toISOString()),
  )
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [editingTransaction, setEditingTransaction] = useState<Transaction>()
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null)

  const filteredTransfers = useMemo(
    () => filterAndSortTransfers(transfers, filters),
    [transfers, filters],
  )
  const pageCount = Math.max(1, Math.ceil(filteredTransfers.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageTransfers = filteredTransfers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  function changeFilters(nextFilters: TransferFiltersValue) {
    setFilters(nextFilters)
    setPage(1)
  }

  function clearFilters() {
    setFilters(initialFilters)
    setPage(1)
  }

  function handleSave(transaction: Transaction) {
    try {
      saveTransfer(transaction)
      const isUpdate = editingTransaction?.id === transaction.id
      setEditingTransaction(undefined)
      toast.success(
        isUpdate ? 'Transaction updated successfully.' : 'Transaction saved successfully.',
      )
    } catch (error) {
      console.error('Unable to save transaction.', error)
      throw error
    }
  }

  function handleEdit(transaction: Transaction) {
    setSelectedTransaction(null)
    setEditingTransaction(transaction)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    toast.info('Transaction loaded in the form for editing.')
  }

  function handleDelete() {
    if (!pendingDelete) return

    try {
      deleteTransfer(pendingDelete.id)
      setPendingDelete(null)
      toast.success('Transaction deleted.')
    } catch (error) {
      console.error('Unable to delete transaction.', error)
      toast.error('Could not delete this transaction. Try again.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl px-4 pb-8 pt-7 sm:px-6 lg:px-8">
        <TransferSummary
          transactions={transfers}
          summaryDate={summaryDate}
          onSummaryDateChange={setSummaryDate}
        />

        <TransferForm
          key={editingTransaction?.id ?? 'new-transfer'}
          editingTransaction={editingTransaction}
          onSave={handleSave}
          onCancelEdit={() => setEditingTransaction(undefined)}
        />

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6" id="history">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-800"><FileText size={18} /></div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold tracking-tight text-slate-900">Transaction history</h2>
              <p className="mt-1 text-sm leading-5 text-slate-600">Review and manage all your shop’s recorded transfers.</p>
            </div>
            <div className="ml-auto shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              {transfers.length} {transfers.length === 1 ? 'record' : 'records'}
            </div>
          </div>
          <TransferFilters
            filters={filters}
            onChange={changeFilters}
            onClear={clearFilters}
          />
          <TransferTable
            transactions={pageTransfers}
            totalCount={filteredTransfers.length}
            page={currentPage}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            onView={setSelectedTransaction}
            onEdit={handleEdit}
            onDelete={setPendingDelete}
            onClearFilters={clearFilters}
          />
        </section>
        <AppFooter />
      </main>

      <TransferDetailsDialog
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        onEdit={handleEdit}
      />
      <DeleteTransferDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
