import { useState } from 'react'
import { FileText, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import type { Transaction } from '../types/transfer.types'
import { formatMMK } from '../utils/transfer-utils'

interface TransferTableRowProps {
  transaction: Transaction
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export function TransferTableRow({
  transaction,
  onView,
  onEdit,
  onDelete,
}: TransferTableRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isDeposit = transaction.transactionType === 'deposit'

  return (
    <tr className="border-t border-slate-100 dark:border-white/5 transition-colors hover:bg-slate-50/70 dark:hover:bg-white/[0.03]">
      <td className="whitespace-nowrap px-3 py-3 text-sm text-slate-700 dark:text-slate-200">
        <span className="block font-medium text-slate-800 dark:text-slate-100">
          {new Intl.DateTimeFormat('en', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }).format(new Date(transaction.dateTime))}
        </span>
        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
          {new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' })
            .format(new Date(transaction.dateTime))}
        </span>
      </td>
      <td className="px-3 py-3">
        <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${isDeposit ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-200' : 'bg-sky-100 dark:bg-sky-500/15 text-sky-900 dark:text-sky-200'}`}>
          <span className={`size-1.5 rounded-full ${isDeposit ? 'bg-emerald-700' : 'bg-sky-700'}`} />{isDeposit ? 'Deposit' : 'Withdraw'}
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-3 text-sm text-slate-600 dark:text-slate-400">{transaction.provider}</td>
      <td className="px-3 py-3">
        <span className="block break-words text-sm font-medium text-slate-800 dark:text-slate-100">{transaction.customerName}</span>
        {transaction.phoneNumber && <span className="mt-1 block break-words text-xs text-slate-500 dark:text-slate-400">{transaction.phoneNumber}</span>}
      </td>
      <td className="whitespace-nowrap px-3 py-3 text-right text-sm font-semibold text-slate-800 dark:text-slate-100">{formatMMK(transaction.amount)}</td>
      <td className="whitespace-nowrap px-3 py-3 text-right text-sm text-slate-600 dark:text-slate-400">{formatMMK(transaction.serviceFee)}</td>
      <td className="whitespace-nowrap px-3 py-3 text-right text-sm text-slate-600 dark:text-slate-400">{formatMMK(transaction.cashReceived)}</td>
      <td className="whitespace-nowrap px-3 py-3 text-right text-sm text-slate-600 dark:text-slate-400">{formatMMK(transaction.cashPaid)}</td>
      <td className="px-3 py-3 text-right">
        <div className="relative inline-block">
          <button
            className="grid size-9 place-items-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-emerald-800"
            aria-label="Transaction actions"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MoreHorizontal size={18} />
          </button>
          {menuOpen && (
            <>
              <button
                className="fixed inset-0 z-10 cursor-default"
                aria-label="Close actions"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/70 p-1 shadow-lg">
                <button className="flex h-10 w-full items-center gap-2 rounded-lg px-3 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5" onClick={() => { setMenuOpen(false); onView() }}>
                  <FileText size={15} />View details
                </button>
                <button className="flex h-10 w-full items-center gap-2 rounded-lg px-3 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5" onClick={() => { setMenuOpen(false); onEdit() }}>
                  <Pencil size={15} />Edit transaction
                </button>
                <button className="flex h-10 w-full items-center gap-2 rounded-lg px-3 text-left text-sm text-rose-800 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10" onClick={() => { setMenuOpen(false); onDelete() }}>
                  <Trash2 size={15} />Delete
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
