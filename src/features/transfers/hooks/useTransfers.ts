import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  deleteTransferRow,
  migrateLegacyLocalTransfers,
  saveTransferRow,
  subscribeToTransfers,
} from '../services/transferStorage'
import type { Transaction } from '../types/transfer.types'

export function useTransfers() {
  const [transfers, setTransfers] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()

  useEffect(() => {
    const unsubscribe = subscribeToTransfers(
      (rows) => {
        setTransfers(rows)
        setLoading(false)
        setError(undefined)
      },
      (subscribeError) => {
        console.error('Unable to load transfers from Firebase.', subscribeError)
        setError(subscribeError.message)
        setLoading(false)
      },
    )

    migrateLegacyLocalTransfers()
      .then((count) => {
        if (count > 0) toast.success(`Moved ${count} saved transfers from this browser to Firebase.`)
      })
      .catch((migrationError) => {
        console.error('Unable to move local transfers to Firebase.', migrationError)
      })

    return unsubscribe
  }, [])

  // The Firestore listener updates `transfers` automatically after each write.
  async function saveTransfer(transaction: Transaction): Promise<void> {
    await saveTransferRow(transaction)
  }

  async function deleteTransfer(id: string): Promise<void> {
    await deleteTransferRow(id)
  }

  return { transfers, loading, error, saveTransfer, deleteTransfer }
}
