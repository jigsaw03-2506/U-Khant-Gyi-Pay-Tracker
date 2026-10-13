import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import {
  transferProviders,
  type Transaction,
} from '../types/transfer.types'

/** Firestore collection that holds one document ("row") per transfer. */
export const TRANSFERS_COLLECTION = 'transfers'

/** Old localStorage key, used only to move existing records into Firebase once. */
const LEGACY_STORAGE_KEY = 'shwe-transfer-transactions-v1'

const transfersRef = collection(db, TRANSFERS_COLLECTION)

function isTransaction(value: unknown): value is Transaction {
  if (!value || typeof value !== 'object') return false

  const item = value as Record<string, unknown>
  const isDate = (candidate: unknown) =>
    typeof candidate === 'string' && Number.isFinite(new Date(candidate).getTime())
  const isOptionalText = (candidate: unknown) =>
    candidate === undefined || candidate === null || typeof candidate === 'string'

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

/** Plain object with only the Transaction fields (Firestore rejects unknown types). */
function toFirestore(transaction: Transaction): Record<string, unknown> {
  return {
    id: transaction.id,
    transactionType: transaction.transactionType,
    provider: transaction.provider,
    dateTime: transaction.dateTime,
    customerName: transaction.customerName,
    phoneNumber: transaction.phoneNumber,
    accountInformation: transaction.accountInformation,
    amount: transaction.amount,
    serviceFee: transaction.serviceFee,
    cashReceived: transaction.cashReceived,
    cashPaid: transaction.cashPaid,
    referenceNumber: transaction.referenceNumber,
    notes: transaction.notes,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
  }
}

/**
 * Waits for Firebase to confirm a write when online. When offline, Firestore
 * keeps the write in its local queue and sends it automatically later, so we
 * don't block the UI waiting for a server that can't be reached.
 */
async function commit(write: Promise<void>): Promise<void> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    write.catch((error) => console.error('Queued Firebase write failed.', error))
    return
  }
  await write
}

/**
 * Listens to the transfers collection, newest first. The callback runs once
 * with the current data and again whenever any row is added, edited or deleted
 * (on this device or another one). Returns an unsubscribe function.
 */
export function subscribeToTransfers(
  onData: (transactions: Transaction[]) => void,
  onError: (error: Error) => void,
): () => void {
  const transfersQuery = query(transfersRef, orderBy('dateTime', 'desc'))

  return onSnapshot(
    transfersQuery,
    (snapshot) => {
      const transactions: Transaction[] = []
      snapshot.forEach((document) => {
        const data = { ...document.data(), id: document.id }
        if (isTransaction(data)) transactions.push(data)
        else console.warn(`Ignored invalid transfer document: ${document.id}`)
      })
      onData(transactions)
    },
    onError,
  )
}

/** Inserts a new transfer row, or replaces it if the same id already exists (edit). */
export function saveTransferRow(transaction: Transaction): Promise<void> {
  return commit(setDoc(doc(transfersRef, transaction.id), toFirestore(transaction)))
}

export function deleteTransferRow(id: string): Promise<void> {
  return commit(deleteDoc(doc(transfersRef, id)))
}

/**
 * One-time move of records saved by the old localStorage version of the app.
 * Uses the same ids, so running it twice never creates duplicates.
 * Returns how many records were uploaded.
 */
export async function migrateLegacyLocalTransfers(): Promise<number> {
  let stored: string | null = null
  try {
    stored = localStorage.getItem(LEGACY_STORAGE_KEY)
  } catch {
    return 0
  }
  if (!stored) return 0

  let parsed: unknown
  try {
    parsed = JSON.parse(stored)
  } catch {
    return 0
  }
  if (!Array.isArray(parsed)) return 0

  const legacy = parsed.filter(isTransaction)
  // Firestore batches are limited to 500 writes.
  for (let start = 0; start < legacy.length; start += 450) {
    const batch = writeBatch(db)
    for (const transaction of legacy.slice(start, start + 450)) {
      batch.set(doc(transfersRef, transaction.id), toFirestore(transaction))
    }
    await batch.commit()
  }

  try {
    localStorage.setItem(`${LEGACY_STORAGE_KEY}-migrated`, stored)
    localStorage.removeItem(LEGACY_STORAGE_KEY)
  } catch {
    // Not fatal: ids are reused, so a second run would not duplicate anything.
  }
  return legacy.length
}
