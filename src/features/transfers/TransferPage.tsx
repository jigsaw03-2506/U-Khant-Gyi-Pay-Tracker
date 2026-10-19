import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { AppFooter } from "../../components/layout/AppFooter";
import { PaymentTypeSelector } from "./components/PaymentTypeSelector";
import { TransferForm } from "./components/TransferForm";
import { TransferHistoryPanel } from "./components/TransferHistoryPanel";
import { paymentTypes, type PaymentTypeId } from "./types/payment-types";
import type { Transaction } from "./types/transfer.types";

interface TransferPageProps {
  isAdmin: boolean;
  transactions: Transaction[];
  editingTransaction?: Transaction;
  onSave: (transaction: Transaction) => Promise<void> | void;
  onCancelEdit: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => Promise<void> | void;
}

export function TransferPage({
  isAdmin,
  transactions,
  editingTransaction,
  onSave,
  onCancelEdit,
  onEdit,
  onDelete,
}: TransferPageProps) {
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentTypeId>(
    () =>
      paymentTypes.find(
        (item) => item.provider === editingTransaction?.provider,
      )?.id ?? "kpay",
  );
  const paymentType = paymentTypes.find(
    (item) => item.id === selectedPaymentType,
  )!;
  const paymentTransactions = transactions.filter(
    (transaction) => transaction.provider === paymentType.provider,
  );

  function handleSave(transaction: Transaction) {
    return onSave(transaction);
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[250px_minmax(0,1fr)]">
        <PaymentTypeSelector
          selected={selectedPaymentType}
          onSelect={setSelectedPaymentType}
        />

        <section className="min-w-0 space-y-5">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/70 p-4 card-shadow sm:p-5">
            <div className="mb-5 flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
              <span className="grid size-10 place-items-center rounded-xl bg-[#eaf0ff] dark:bg-blue-500/15 text-[#243d83] dark:text-blue-300">
                <ArrowLeftRight size={19} />
              </span>
              <div className="min-w-0">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  Transfer box{" "}
                  <span className="font-medium text-slate-500 dark:text-slate-400">
                    · {paymentType.label}
                  </span>
                </h1>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Record a transfer for your selected payment service.
                </p>
              </div>
              {isAdmin && (
              <span className="ml-auto hidden rounded-full bg-slate-100 dark:bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 sm:inline-flex">
                {paymentTransactions.length}{" "}
                {paymentTransactions.length === 1 ? "transfer" : "transfers"}
              </span>
              )}
            </div>

            <TransferForm
              key={`${editingTransaction?.id ?? "new"}-${paymentType.provider}`}
              editingTransaction={editingTransaction}
              defaultProvider={paymentType.provider}
              canEditServiceFee={isAdmin}
              onSave={handleSave}
              onCancelEdit={onCancelEdit}
            />
          </div>

          {isAdmin && (
            <TransferHistoryPanel
              transactions={paymentTransactions}
              onEdit={onEdit}
              onDelete={onDelete}
              showProviderFilter={false}
              compactHeading
            />
          )}
        </section>
      </div>
      <AppFooter />
    </main>
  );
}
