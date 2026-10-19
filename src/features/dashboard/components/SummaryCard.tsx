import type { ReactNode } from 'react'
import { formatMMK } from '../../transfers/utils/transfer-utils'

interface SummaryCardProps {
  title: string
  amount: ReactNode
  note: string
  icon: ReactNode
  tone: keyof typeof cardTones
  context: string
}

const cardTones = {
  green: 'border-emerald-200 from-emerald-50 dark:border-emerald-500/25 dark:from-emerald-500/10 [--card-glow:rgba(16,185,129,0.45)]',
  blue: 'border-sky-200 from-sky-50 dark:border-sky-500/25 dark:from-sky-500/10 [--card-glow:rgba(14,165,233,0.45)]',
  amber: 'border-amber-200 from-amber-50 dark:border-amber-500/30 dark:from-amber-500/10 [--card-glow:rgba(245,158,11,0.45)]',
  teal: 'border-teal-200 from-teal-50 dark:border-teal-500/25 dark:from-teal-500/10 [--card-glow:rgba(20,184,166,0.45)]',
  rose: 'border-rose-200 from-rose-50 dark:border-rose-500/25 dark:from-rose-500/10 [--card-glow:rgba(244,63,94,0.45)]',
  violet: 'border-violet-200 from-violet-50 dark:border-violet-500/25 dark:from-violet-500/10 [--card-glow:rgba(139,92,246,0.45)]',
}

const iconTones = {
  green: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  blue: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300',
  amber: 'bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300',
  teal: 'bg-teal-100 text-teal-800 dark:bg-teal-500/15 dark:text-teal-300',
  rose: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300',
  violet: 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300',
}

const amountTones = {
  green: 'text-emerald-800 dark:text-emerald-300',
  blue: 'text-sky-800 dark:text-sky-300',
  amber: 'text-amber-800 dark:text-amber-300',
  teal: 'text-teal-800 dark:text-teal-300',
  rose: 'text-rose-800 dark:text-rose-300',
  violet: 'text-violet-800 dark:text-violet-300',
}

export function SummaryCard({
  title,
  amount,
  note,
  icon,
  tone,
  context,
}: SummaryCardProps) {
  return (
    <article className={`flex h-full min-w-0 flex-col rounded-2xl border bg-gradient-to-br to-white p-5 card-shadow dark:to-slate-900/60 ${cardTones[tone]}`}>
      <div className="flex items-center justify-between">
        <span className={`grid size-10 place-items-center rounded-xl ${iconTones[tone]}`}>{icon}</span>
        <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:bg-white/5 dark:text-slate-400">{context}</span>
      </div>
      <div className="mt-4 text-sm font-medium leading-5 text-slate-600 dark:text-slate-400">{title}</div>
      <div className={`mt-1 break-words text-xl font-bold leading-7 tracking-tight sm:text-2xl ${amountTones[tone]}`}>{typeof amount === 'number' ? formatMMK(amount) : amount}</div>
      <div className="mt-auto pt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{note}</div>
    </article>
  )
}
