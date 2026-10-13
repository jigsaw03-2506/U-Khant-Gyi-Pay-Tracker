import { useState } from 'react'
import { loadTransfers, saveTransfers } from '../services/transferStorage'
import type { Transaction } from '../types/transfer.types'

export function useTransfers() {
  const [transfers, setTransfers] = useState<Transaction[]>(loadTransfers)

  function saveTransfer(transaction: Transaction): void {
    const exists = transfers.some((item) => item.id === transaction.id)
    const nextTransfers = exists
      ? transfers.map((item) => (item.id === transaction.id ? transaction : item))
      : [transaction, ...transfers]

    saveTransfers(nextTransfers)
    setTransfers(nextTransfers)
  }

  function deleteTransfer(id: string): void {
    const nextTransfers = transfers.filter((item) => item.id !== id)
    saveTransfers(nextTransfers)
    setTransfers(nextTransfers)
  }

  return { transfers, saveTransfer, deleteTransfer }
}
