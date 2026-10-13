import { useState } from 'react'
import { Toaster, toast } from 'sonner'
import { AppHeader, type AppScreen } from './components/layout/AppHeader'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { TransferPage } from './features/transfers/TransferPage'
import { useTransfers } from './features/transfers/hooks/useTransfers'
import type { Transaction } from './features/transfers/types/transfer.types'

function App() {
  const { transfers, saveTransfer, deleteTransfer } = useTransfers()
  const [activeScreen, setActiveScreen] = useState<AppScreen>('transfer')
  const [editingTransaction, setEditingTransaction] = useState<Transaction>()

  function handleSave(transaction: Transaction) {
    const updating = editingTransaction?.id === transaction.id
    saveTransfer(transaction)
    setEditingTransaction(undefined)
    toast.success(updating ? 'Transaction updated successfully.' : 'Transaction saved successfully.')
  }

  function handleEdit(transaction: Transaction) {
    setEditingTransaction(transaction)
    setActiveScreen('transfer')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    toast.info('Transaction loaded in the form for editing.')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Toaster position="top-right" richColors closeButton />
      <AppHeader activeScreen={activeScreen} onNavigate={(screen) => {
        if (screen === 'dashboard') setEditingTransaction(undefined)
        setActiveScreen(screen)
      }} />
      {activeScreen === 'transfer' ? (
        <TransferPage
          transactions={transfers}
          editingTransaction={editingTransaction}
          onSave={handleSave}
          onCancelEdit={() => setEditingTransaction(undefined)}
          onEdit={handleEdit}
          onDelete={deleteTransfer}
        />
      ) : (
        <DashboardPage
          transactions={transfers}
          onEdit={handleEdit}
          onDelete={deleteTransfer}
        />
      )}
    </div>
  )
}

export default App
