import { useState } from 'react'
import { Toaster, toast } from 'sonner'
import { LogOut } from 'lucide-react'
import { AppHeader, type AppScreen } from './components/layout/AppHeader'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { TransferPage } from './features/transfers/TransferPage'
import { useTransfers } from './features/transfers/hooks/useTransfers'
import type { Transaction } from './features/transfers/types/transfer.types'
import { LoginPage } from './features/auth/LoginPage'
import { useAuth } from './features/auth/useAuth'

function ShopApp({ email, onLogout }: { email: string; onLogout: () => void }) {
  const { transfers, loading, error, saveTransfer, deleteTransfer } = useTransfers()
  const [activeScreen, setActiveScreen] = useState<AppScreen>('transfer')
  const [editingTransaction, setEditingTransaction] = useState<Transaction>()

  async function handleSave(transaction: Transaction) {
    const updating = editingTransaction?.id === transaction.id
    // Throws if Firebase rejects the write; TransferForm shows the error.
    await saveTransfer(transaction)
    setEditingTransaction(undefined)
    toast.success(updating ? 'Transaction updated in Firebase.' : 'Transaction saved to Firebase.')
  }

  function handleEdit(transaction: Transaction) {
    setEditingTransaction(transaction)
    setActiveScreen('transfer')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    toast.info('Transaction loaded in the form for editing.')
  }

  return (
    <>
      <AppHeader activeScreen={activeScreen} onNavigate={(screen) => {
        if (screen === 'dashboard') setEditingTransaction(undefined)
        setActiveScreen(screen)
      }} />

      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-end gap-3 px-4 pt-3 text-xs text-slate-500 sm:px-6 lg:px-8">
        {loading && <span>Firebase မှ data ဆွဲယူနေသည်…</span>}
        <span className="truncate">{email}</span>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-semibold text-slate-600 hover:bg-slate-100"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      {error && (
        <div className="mx-auto mt-3 max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            Firebase မှ data မရပါ: {error}. Firestore rules နဲ့ internet ကို စစ်ပါ။
          </p>
        </div>
      )}

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
    </>
  )
}

function App() {
  const { user, checking, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Toaster position="top-right" richColors closeButton />
      {checking ? (
        <div className="grid min-h-screen place-items-center text-sm text-slate-500">Loading…</div>
      ) : user ? (
        <ShopApp email={user.email ?? ''} onLogout={() => void logout()} />
      ) : (
        <LoginPage />
      )}
    </div>
  )
}

export default App
