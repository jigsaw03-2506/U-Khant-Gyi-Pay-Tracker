import { Wallet } from 'lucide-react'

export function AppFooter() {
  return (
    <footer className="flex flex-col justify-between gap-3 py-6 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center">
      <span className="leading-5">
        Shwe Transfer <span className="px-1 text-slate-400 dark:text-slate-500">·</span> Simple, thoughtful shop management
      </span>
      <span className="flex items-center gap-2"><Wallet size={14} /> Your data stays on this device</span>
    </footer>
  )
}
