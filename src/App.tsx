import { useState } from 'react'
import { Toaster, toast } from 'sonner'
import { AppHeader, type AppScreen } from './components/layout/AppHeader'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { TransferPage } from './features/transfers/TransferPage'
import { useTransfers } from './features/transfers/hooks/useTransfers'
import type { Transaction } from './features/transfers/types/transfer.types'
import { LoginPage } from './features/auth/LoginPage'
import { useAuth } from './features/auth/useAuth'
import { isAdminEmail } from './features/auth/roles'

function ShopApp({ email, onLogout }: { email: string; onLogout: () => void }) {
  const isAdmin = isAdminEmail(email)
  // Employees never load the transfer list; Firestore rules block it anyway.
  const { transfers, loading, error, saveTransfer, deleteTransfer } = useTransfers(isAdmin)
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
      <AppHeader
        activeScreen={activeScreen}
        email={email}
        isAdmin={isAdmin}
        onLogout={onLogout}
        onNavigate={(screen) => {
          if (screen === 'dashboard') setEditingTransaction(undefined)
          setActiveScreen(screen)
        }}
      />

      {loading && (
        <div className="mx-auto max-w-[1600px] px-4 pt-3 text-right text-xs text-slate-500 dark:text-slate-400 sm:px-6 lg:px-8">
          Firebase မှ data ဆွဲယူနေသည်…
        </div>
      )}

      {error && (
        <div className="mx-auto mt-3 max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <p className="rounded-xl border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 p-3 text-sm text-rose-800 dark:text-rose-300">
            Firebase မှ data မရပါ: {error}. Firestore rules နဲ့ internet ကို စစ်ပါ။
          </p>
        </div>
      )}

      {activeScreen === 'transfer' || !isAdmin ? (
        <TransferPage
          isAdmin={isAdmin}
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
    <div className="min-h-screen text-slate-900 dark:text-slate-50">
      <Toaster position="top-right" richColors closeButton theme="dark" />
      {checking ? (
        <div className="grid min-h-screen place-items-center text-sm text-slate-500 dark:text-slate-400">Loading…</div>
      ) : user ? (
        <ShopApp email={user.email ?? ''} onLogout={() => void logout()} />
      ) : (
        <LoginPage />
      )}
    </div>
  )
}

export default App
