import {
  transferProviders,
  type Transaction,
  type TransferFiltersValue,
  type TransferFormErrors,
  type TransferFormValues,
  type TransferSummaryTotals,
} from '../types/transfer.types'

export function formatMMK(amount: number): string {
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount)} MMK`
}

export function toLocalDateTimeInput(date = new Date()): string {
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16)
}

export function getLocalDateKey(dateTime: string): string {
  const date = new Date(dateTime)
  if (Number.isNaN(date.getTime())) return ''

  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

export function createEmptyTransferForm(provider = ''): TransferFormValues {
  return {
    transactionType: 'deposit',
    provider,
    dateTime: toLocalDateTimeInput(),
    customerName: '',
    phoneNumber: '',
    accountInformation: '',
    amount: '',
    serviceFee: '0',
    cashReceived: '',
    cashPaid: '',
    referenceNumber: '',
    notes: '',
  }
}

export function createTransferFormValues(transaction: Transaction): TransferFormValues {
  return {
    transactionType: transaction.transactionType,
    provider: transaction.provider,
    dateTime: toLocalDateTimeInput(new Date(transaction.dateTime)),
    customerName: transaction.customerName,
    phoneNumber: transaction.phoneNumber ?? '',
    accountInformation: transaction.accountInformation ?? '',
    amount: String(transaction.amount),
    serviceFee: String(transaction.serviceFee),
    cashReceived: transaction.transactionType === 'withdraw' ? String(transaction.cashReceived) : '',
    cashPaid: transaction.transactionType === 'deposit' ? String(transaction.cashPaid) : '',
    referenceNumber: transaction.referenceNumber ?? '',
    notes: transaction.notes ?? '',
  }
}

export function validateTransferForm(values: TransferFormValues): TransferFormErrors {
  const errors: TransferFormErrors = {}
  const amount = Number(values.amount)
  const serviceFee = Number(values.serviceFee)
  const cashValue = values.transactionType === 'deposit' ? values.cashPaid : values.cashReceived
  const cashAmount = Number(cashValue)

  if (!transferProviders.some((provider) => provider === values.provider)) {
    errors.provider = 'Choose a transfer provider.'
  }
  if (!values.customerName.trim()) {
    errors.customerName = 'Enter the customer name.'
  }
  if (!values.dateTime || !Number.isFinite(new Date(values.dateTime).getTime())) {
    errors.dateTime = 'Choose the transaction date and time.'
  }
  if (!values.amount || !Number.isFinite(amount) || amount <= 0) {
    errors.amount = 'Transaction amount must be greater than zero.'
  }
  if (values.serviceFee === '' || !Number.isFinite(serviceFee) || serviceFee < 0) {
    errors.serviceFee = 'Service fee must be zero or greater.'
  }
  if (cashValue === '' || !Number.isFinite(cashAmount) || cashAmount < 0) {
    errors.cashAmount = 'Enter the actual physical cash amount (zero is allowed).'
  }

  return errors
}

export function buildTransaction(
  values: TransferFormValues,
  existing?: Transaction,
): Transaction {
  const now = new Date().toISOString()
  const cashAmount = Number(
    values.transactionType === 'deposit' ? values.cashPaid : values.cashReceived,
  )

  return {
    id: existing?.id ?? (globalThis.crypto?.randomUUID?.() ?? createFallbackId()),
    transactionType: values.transactionType,
    provider: values.provider,
    dateTime: new Date(values.dateTime).toISOString(),
    customerName: values.customerName.trim(),
    phoneNumber: values.phoneNumber.trim() || undefined,
    accountInformation: values.accountInformation.trim() || undefined,
    amount: Number(values.amount),
    serviceFee: Number(values.serviceFee),
    cashReceived: values.transactionType === 'withdraw' ? cashAmount : 0,
    cashPaid: values.transactionType === 'deposit' ? cashAmount : 0,
    referenceNumber: values.referenceNumber.trim() || undefined,
    notes: values.notes.trim() || undefined,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }
}

function createFallbackId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function calculateTransferSummary(
  transactions: Transaction[],
  summaryDate: string,
): TransferSummaryTotals {
  const dailyTransactions = transactions.filter(
    (transaction) => getLocalDateKey(transaction.dateTime) === summaryDate,
  )
  const deposits = dailyTransactions.filter((item) => item.transactionType === 'deposit')
  const withdrawals = dailyTransactions.filter((item) => item.transactionType === 'withdraw')
  const depositAmount = deposits.reduce((total, item) => total + item.amount, 0)
  const withdrawAmount = withdrawals.reduce((total, item) => total + item.amount, 0)
  const cashReceived = withdrawals.reduce((total, item) => total + item.cashReceived, 0)
  const cashPaid = deposits.reduce((total, item) => total + item.cashPaid, 0)

  return {
    depositAmount,
    withdrawAmount,
    serviceFees: dailyTransactions.reduce((total, item) => total + item.serviceFee, 0),
    cashReceived,
    cashPaid,
    transactionCount: dailyTransactions.length,
    netCash: cashReceived - cashPaid,
    electronicReceived: depositAmount,
    electronicSent: withdrawAmount,
    netElectronic: depositAmount - withdrawAmount,
  }
}

export function filterAndSortTransfers(
  transactions: Transaction[],
  filters: TransferFiltersValue,
): Transaction[] {
  const query = filters.search.trim().toLowerCase()

  return transactions
    .filter((transaction) => {
      const matchesSearch =
        !query ||
        [transaction.customerName, transaction.phoneNumber, transaction.referenceNumber]
          .some((value) => value?.toLowerCase().includes(query))
      const matchesType =
        filters.transactionType === 'all' ||
        transaction.transactionType === filters.transactionType
      const matchesProvider =
        filters.provider === 'all' || transaction.provider === filters.provider
      const transactionDate = getLocalDateKey(transaction.dateTime)

      return (
        matchesSearch &&
        matchesType &&
        matchesProvider &&
        (!filters.dateFrom || transactionDate >= filters.dateFrom) &&
        (!filters.dateTo || transactionDate <= filters.dateTo)
      )
    })
    .sort((first, second) =>
      filters.sortOrder === 'newest'
        ? new Date(second.dateTime).getTime() - new Date(first.dateTime).getTime()
        : new Date(first.dateTime).getTime() - new Date(second.dateTime).getTime(),
    )
}
