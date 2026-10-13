import { useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { AppFooter } from '../../components/layout/AppFooter'
import { PaymentTypeSelector } from './components/PaymentTypeSelector'
import { TransferForm } from './components/TransferForm'
import { TransferHistoryPanel } from './components/TransferHistoryPanel'
import { paymentTypes, type PaymentTypeId } from './types/payment-types'
import type { Transaction } from './types/transfer.types'

interface TransferPageProps {
  transactions: Transaction[]
  editingTransaction?: Transaction
  onSave: (transaction: Transaction) => void
  onCancelEdit: () => void
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export function TransferPage({
  transactions,
  editingTransaction,
  onSave,
  onCancelEdit,
  onEdit,
  onDelete,
}: TransferPageProps) {
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentTypeId>(() =>
    paymentTypes.find((item) => item.provider === editingTransaction?.provider)?.id ?? 'kpay',
  )
  const paymentType = paymentTypes.find((item) => item.id === selectedPaymentType)!
  const paymentTransactions = transactions.filter(
    (transaction) => transaction.provider === paymentType.provider,
  )

  function handleSave(transaction: Transaction) {
    onSave(transaction)
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[250px_minmax(0,1fr)]">
        <PaymentTypeSelector
          selected={selectedPaymentType}
          onSelect={setSelectedPaymentType}
        />

        <section className="min-w-0 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="grid size-10 place-items-center rounded-xl bg-[#eaf0ff] text-[#243d83]">
                <ArrowLeftRight size={19} />
              </span>
              <div className="min-w-0">
                <h1 className="text-lg font-bold tracking-tight text-slate-900">
                  Transfer box <span className="font-medium text-slate-500">· {paymentType.label}</span>
                </h1>
                <p className="mt-1 text-xs text-slate-500">
                  Record a transfer for your selected payment service.
                </p>
              </div>
              <span className="ml-auto hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 sm:inline-flex">
                {paymentTransactions.length} {paymentTransactions.length === 1 ? 'transfer' : 'transfers'}
              </span>
            </div>

            <TransferForm
              key={`${editingTransaction?.id ?? 'new'}-${paymentType.provider}`}
              editingTransaction={editingTransaction}
              defaultProvider={paymentType.provider}
              onSave={handleSave}
              onCancelEdit={onCancelEdit}
            />
          </div>

          <TransferHistoryPanel
            transactions={paymentTransactions}
            onEdit={onEdit}
            onDelete={onDelete}
            showProviderFilter={false}
            compactHeading
          />
        </section>
      </div>
      <AppFooter />
    </main>
  )
}
