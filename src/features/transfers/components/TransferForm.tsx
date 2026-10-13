import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  CircleHelp,
  Plus,
  Send,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { FormField } from "../../../components/shared/FormField";
import { MoneyInput } from "../../../components/shared/MoneyInput";
import {
  buildTransaction,
  calculateAutomaticServiceFee,
  createEmptyTransferForm,
  createTransferFormValues,
  validateTransferForm,
} from "../utils/transfer-utils";
import {
  transferProviders,
  type Transaction,
  type TransactionType,
  type TransferFormErrors,
  type TransferFormValues,
} from "../types/transfer.types";

interface TransferFormProps {
  editingTransaction?: Transaction;
  defaultProvider?: string;
  /** Employees get the automatic fee only; the field is read-only for them. */
  canEditServiceFee: boolean;
  onSave: (transaction: Transaction) => Promise<void> | void;
  onCancelEdit: () => void;
}

export function TransferForm({
  editingTransaction,
  defaultProvider,
  canEditServiceFee,
  onSave,
  onCancelEdit,
}: TransferFormProps) {
  const [values, setValues] = useState(() =>
    editingTransaction
      ? createTransferFormValues(editingTransaction)
      : createEmptyTransferForm(defaultProvider),
  );
  const [errors, setErrors] = useState<TransferFormErrors>({});
  const [saving, setSaving] = useState(false);

  function updateField<Key extends keyof TransferFormValues>(
    key: Key,
    value: TransferFormValues[Key],
  ) {
    setValues((current) => {
      if (key === "amount") {
        const nextAmount = String(value);
        const autoFee = calculateAutomaticServiceFee(
          current.transactionType,
          Number(nextAmount),
        );

        return {
          ...current,
          amount: nextAmount,
          serviceFee: String(autoFee),
        };
      }

      if (key === "serviceFee") {
        return {
          ...current,
          serviceFee: String(value),
        };
      }

      return {
        ...current,
        [key]: value,
      };
    });

    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function changeTransactionType(transactionType: TransactionType) {
    setValues((current) => ({
      ...current,
      transactionType,
      serviceFee: String(
        calculateAutomaticServiceFee(transactionType, Number(current.amount)),
      ),
      cashReceived: "",
      cashPaid: "",
    }));
    setErrors({});
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    const validationErrors = validateTransferForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please review the highlighted fields.");
      return;
    }

    setSaving(true);
    try {
      await onSave(buildTransaction(values, editingTransaction));
      setValues(createEmptyTransferForm(defaultProvider));
      setErrors({});
    } catch (error) {
      console.error("Unable to save transaction.", error);
      toast.error(
        "Could not save this transaction to Firebase. Check your internet and try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  const isDeposit = values.transactionType === "deposit";

  return (
    <section
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
      id="transaction-form"
    >
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
          <Plus size={19} />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {editingTransaction ? "Edit transaction" : "New transaction"}
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Record a Deposit or Withdraw transfer and the actual amounts that
            changed hands.
          </p>
        </div>
        {editingTransaction && (
          <button
            className="ml-auto inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            type="button"
            onClick={onCancelEdit}
          >
            <X size={15} />
            Cancel
          </button>
        )}
      </div>

      <form className="mt-6" onSubmit={handleSubmit} noValidate>
        <div className="border-t border-slate-100 pt-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-md bg-emerald-100 text-xs font-bold text-emerald-800">
              01
            </span>
            <h3 className="text-sm font-semibold text-slate-800">
              Transaction information
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <button
              type="button"
              aria-pressed={isDeposit}
              className={`flex min-h-20 items-center gap-3 rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${isDeposit ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500" : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40"}`}
              onClick={() => changeTransactionType("deposit")}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-800">
                <ArrowDownToLine size={18} />
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <strong className="text-sm font-semibold text-slate-800">
                  Deposit{" "}
                  <span className="font-normal text-slate-600">(ငွေထုတ်)</span>
                </strong>
                <small className="text-xs leading-5 text-slate-600">
                  Customer sends money to your account
                </small>
              </span>
              <span
                className={`ml-auto grid size-5 shrink-0 place-items-center rounded-full border ${isDeposit ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-300 text-transparent"}`}
              >
                {isDeposit && <Check size={12} />}
              </span>
            </button>
            <button
              type="button"
              aria-pressed={!isDeposit}
              className={`flex min-h-20 items-center gap-3 rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${!isDeposit ? "border-sky-500 bg-sky-50 ring-1 ring-sky-500" : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/40"}`}
              onClick={() => changeTransactionType("withdraw")}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
                <Send size={17} />
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <strong className="text-sm font-semibold text-slate-800">
                  Withdraw{" "}
                  <span className="font-normal text-slate-600">(ငွေလွှဲ)</span>
                </strong>
                <small className="text-xs leading-5 text-slate-600">
                  Customer gives cash, you send money
                </small>
              </span>
              <span
                className={`ml-auto grid size-5 shrink-0 place-items-center rounded-full border ${!isDeposit ? "border-sky-700 bg-sky-700 text-white" : "border-slate-300 text-transparent"}`}
              >
                {!isDeposit && <Check size={12} />}
              </span>
            </button>
          </div>

          <div
            className={`mt-3 flex items-start gap-2 rounded-lg px-3 py-3 text-sm leading-6 ${isDeposit ? "bg-emerald-50 text-emerald-900" : "bg-sky-50 text-sky-900"}`}
          >
            <CircleHelp size={17} className="mt-0.5 shrink-0" />
            <span>
              {isDeposit
                ? "Customer transfers money to the shop's account, and the shop gives physical cash to the customer."
                : "Customer gives physical cash to the shop, and the shop transfers money to the customer's account."}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
            <FormField
              label="Transfer provider"
              required
              error={errors.provider}
            >
              <select
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition hover:border-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                value={values.provider}
                onChange={(event) =>
                  updateField("provider", event.target.value)
                }
              >
                <option value="">Select provider</option>
                {transferProviders.map((provider) => (
                  <option key={provider}>{provider}</option>
                ))}
              </select>
            </FormField>
            <FormField
              label="Transaction date & time"
              required
              error={errors.dateTime}
            >
              <input
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition hover:border-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                type="datetime-local"
                value={values.dateTime}
                onChange={(event) =>
                  updateField("dateTime", event.target.value)
                }
              />
            </FormField>
            <FormField
              label="Customer name"
              required
              error={errors.customerName}
            >
              <input
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                value={values.customerName}
                placeholder="e.g. Aye Aye"
                onChange={(event) =>
                  updateField("customerName", event.target.value)
                }
              />
            </FormField>
            <FormField label="Phone number" hint="Optional">
              <input
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                type="tel"
                value={values.phoneNumber}
                placeholder="09 123 456 789"
                onChange={(event) =>
                  updateField("phoneNumber", event.target.value)
                }
              />
            </FormField>
            <FormField label="Customer account name / number" hint="Optional">
              <input
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                value={values.accountInformation}
                placeholder="Account name or number"
                onChange={(event) =>
                  updateField("accountInformation", event.target.value)
                }
              />
            </FormField>
          </div>

          <div className="mt-7 flex flex-col gap-1 border-t border-slate-100 pt-5 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              Transfer amounts
            </h3>
            {/* <p className="text-xs leading-5 text-slate-600">
              Enter each amount independently. {serviceFeeMode === 'auto' ? 'The service fee is calculated automatically and can be edited.' : 'The service fee is manually set and will recalculate if the amount or type changes.'} Fees are not added to or deducted from cash.
            </p> */}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
            <FormField
              label="Transaction amount (MMK)"
              required
              error={errors.amount}
            >
              <MoneyInput
                value={values.amount}
                onChange={(value) => updateField("amount", value)}
              />
            </FormField>
            <FormField
              label="Service fee (MMK)"
              error={errors.serviceFee}
              hint={canEditServiceFee ? undefined : "Calculated automatically"}
            >
              <MoneyInput
                value={values.serviceFee}
                readOnly={!canEditServiceFee}
                onChange={(value) => updateField("serviceFee", value)}
              />
            </FormField>
            {isDeposit ? (
              <FormField
                label="Actual physical cash paid (MMK)"
                required
                error={errors.cashAmount}
                hint=""
              >
                <MoneyInput
                  value={values.cashPaid}
                  onChange={(value) => updateField("cashPaid", value)}
                />
              </FormField>
            ) : (
              <FormField
                label="Actual physical cash received (MMK)"
                required
                error={errors.cashAmount}
                hint=""
              >
                <MoneyInput
                  value={values.cashReceived}
                  onChange={(value) => updateField("cashReceived", value)}
                />
              </FormField>
            )}
          </div>

          <div className="mt-7 flex flex-col gap-1 border-t border-slate-100 pt-5 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              Additional details
            </h3>
            <p className="text-xs leading-5 text-slate-600">
              Reference and notes are optional.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
            <FormField label="Reference number" hint="Optional">
              <input
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                value={values.referenceNumber}
                placeholder="Transaction reference"
                onChange={(event) =>
                  updateField("referenceNumber", event.target.value)
                }
              />
            </FormField>
            <FormField label="Notes" hint="Optional">
              <input
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                value={values.notes}
                placeholder="Add a note for this transaction"
                onChange={(event) => updateField("notes", event.target.value)}
              />
            </FormField>
          </div>
        </div>

        <div className="flex min-h-20 flex-wrap items-center justify-between gap-3 border-t border-slate-100">
          <p className="flex items-center gap-2 text-xs text-slate-600">
            <span className="size-2 rounded-full bg-emerald-500" /> Saved
            privately on this device
          </p>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="size-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Saving…
              </>
            ) : (
              <>
                {editingTransaction ? <Check size={17} /> : <Plus size={18} />}
                {editingTransaction ? "Save changes" : "Save transaction"}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
