import { useState } from 'react'
import { ArrowLeftRight, Landmark, Menu } from 'lucide-react'

export function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function closeMobileMenu() {
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header className="relative z-20 flex h-16 items-center gap-2 border-b border-slate-200 bg-white px-4 sm:gap-10 sm:px-7 lg:px-10">
        <a className="flex shrink-0 items-center gap-3" href="#" aria-label="Shwe Transfer home">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-800 text-white shadow-sm"><ArrowLeftRight size={22} strokeWidth={2.4} /></span>
          <span className="flex flex-col leading-none">
            <strong className="text-sm font-bold tracking-tight text-slate-900">Shwe Transfer</strong>
            <small className="mt-1 text-[9px] font-semibold tracking-[0.16em] text-slate-500">SHOP MANAGEMENT</small>
          </span>
        </a>
        <nav className="hidden h-full items-center gap-7 md:flex" aria-label="Main navigation">
          <a className="flex h-full items-center gap-2 border-b-2 border-emerald-700 text-sm font-semibold text-emerald-800" href="#dashboard" onClick={closeMobileMenu}>
            <Landmark size={16} />Overview
          </a>
          <a className="flex h-full items-center gap-2 border-b-2 border-transparent text-sm font-medium text-slate-600 transition hover:text-emerald-800" href="#transaction-form" onClick={closeMobileMenu}>
            <ArrowLeftRight size={16} />Transactions
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-900 sm:inline-flex"><span className="size-2 rounded-full bg-emerald-500" />Local mode</span>
          <div className="hidden size-9 place-items-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-900 sm:grid" aria-label="Shop owner">S</div>
        </div>
        <button
          className="grid size-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 md:hidden"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <Menu size={20} />
        </button>
      </header>
      {mobileMenuOpen && (
        <nav className="absolute right-3 top-14 z-30 flex w-48 flex-col rounded-xl border border-slate-200 bg-white p-2 shadow-lg md:hidden" aria-label="Mobile navigation">
          <a className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-slate-700 hover:bg-emerald-50" href="#dashboard" onClick={closeMobileMenu}>
            <Landmark size={16} />Overview
          </a>
          <a className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-slate-700 hover:bg-emerald-50" href="#transaction-form" onClick={closeMobileMenu}>
            <ArrowLeftRight size={16} />Transactions
          </a>
        </nav>
      )}
    </>
  )
}
