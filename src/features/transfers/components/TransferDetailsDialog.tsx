import * as Dialog from '@radix-ui/react-dialog'
import { X, Pencil } from 'lucide-react'
import { formatMMK } from '../utils/transfer-utils'
import type { Transaction } from '../types/transfer.types'

interface TransferDetailsDialogProps {
  transaction: Transaction | null
  onClose: () => void
  onEdit: (transaction: Transaction) => void
}

export function TransferDetailsDialog({
  transaction,
  onClose,
  onEdit,
}: TransferDetailsDialogProps) {
  const isDeposit = transaction?.transactionType === 'deposit'

  return (
    <Dialog.Root open={transaction !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[51] max-h-[90vh] w-[min(470px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
          {transaction && (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold tracking-widest text-slate-500">TRANSACTION DETAILS</div>
                  <Dialog.Title className="mt-2 text-xl font-bold tracking-tight text-slate-900">{transaction.customerName}</Dialog.Title>
                </div>
                <Dialog.Close asChild>
                  <button className="grid size-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Close details">
                    <X size={18} />
                  </button>
                </Dialog.Close>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${isDeposit ? 'bg-emerald-100 text-emerald-900' : 'bg-sky-100 text-sky-900'}`}>
                  <span className={`size-1.5 rounded-full ${isDeposit ? 'bg-emerald-700' : 'bg-sky-700'}`} />{isDeposit ? 'Deposit' : 'Withdraw'}
                </span>
                <span className="text-xs text-slate-500">ID · {transaction.id.slice(0, 8)}</span>
              </div>
              <div className="my-4 flex flex-col gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <span className="text-xs text-slate-600">Transaction amount</span>
                <strong className="text-2xl font-bold tracking-tight text-emerald-900">{formatMMK(transaction.amount)}</strong>
                <small className="text-xs text-slate-600">
                  {transaction.provider} ·{' '}
                  {new Intl.DateTimeFormat('en', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(transaction.dateTime))}
                </small>
              </div>
              <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
                <Detail label="Service fee" value={formatMMK(transaction.serviceFee)} />
                {isDeposit ? (
                  <Detail label="Physical cash paid" value={formatMMK(transaction.cashPaid)} />
                ) : (
                  <Detail label="Physical cash received" value={formatMMK(transaction.cashReceived)} />
                )}
                <Detail label="Phone number" value={transaction.phoneNumber || '—'} />
                <Detail label="Account name / number" value={transaction.accountInformation || '—'} />
                <Detail label="Reference number" value={transaction.referenceNumber || '—'} />
                <Detail
                  label="Last updated"
                  value={new Intl.DateTimeFormat('en', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(transaction.updatedAt))}
                />
                <div className="sm:col-span-2">
                  <Detail label="Notes" value={transaction.notes || '—'} />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={onClose}>Close</button>
                <button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900" onClick={() => onEdit(transaction)}>
                  <Pencil size={15} />Edit transaction
                </button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs text-slate-500">{label}</span>
      <strong className="break-words text-sm font-medium text-slate-800">{value}</strong>
    </div>
  )
}
