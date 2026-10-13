import {
  transferProviders,
  type Transaction,
} from '../types/transfer.types'

const STORAGE_KEY = 'shwe-transfer-transactions-v1'

function isTransaction(value: unknown): value is Transaction {
  if (!value || typeof value !== 'object') return false

  const item = value as Record<string, unknown>
  const isDate = (candidate: unknown) =>
    typeof candidate === 'string' && Number.isFinite(new Date(candidate).getTime())
  const isOptionalText = (candidate: unknown) =>
    candidate === undefined || typeof candidate === 'string'

  return (
    typeof item.id === 'string' &&
    (item.transactionType === 'deposit' || item.transactionType === 'withdraw') &&
    transferProviders.some((provider) => provider === item.provider) &&
    isDate(item.dateTime) &&
    typeof item.customerName === 'string' &&
    typeof item.amount === 'number' &&
    Number.isFinite(item.amount) &&
    item.amount > 0 &&
    typeof item.serviceFee === 'number' &&
    Number.isFinite(item.serviceFee) &&
    item.serviceFee >= 0 &&
    typeof item.cashReceived === 'number' &&
    Number.isFinite(item.cashReceived) &&
    item.cashReceived >= 0 &&
    typeof item.cashPaid === 'number' &&
    Number.isFinite(item.cashPaid) &&
    item.cashPaid >= 0 &&
    (item.transactionType === 'deposit'
      ? item.cashReceived === 0
      : item.cashPaid === 0) &&
    isOptionalText(item.phoneNumber) &&
    isOptionalText(item.accountInformation) &&
    isOptionalText(item.referenceNumber) &&
    isOptionalText(item.notes) &&
    isDate(item.createdAt) &&
    isDate(item.updatedAt)
  )
}

export function loadTransfers(): Transaction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      throw new Error('Stored transactions are not a list')
    }

    const validTransactions = parsed.filter(isTransaction)
    if (validTransactions.length !== parsed.length) {
      console.warn('Some invalid transaction records were ignored.')
    }
    return validTransactions
  } catch (error) {
    console.error('Unable to load saved transactions from localStorage.', error)
    return []
  }
}

export function saveTransfers(transactions: Transaction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
}
