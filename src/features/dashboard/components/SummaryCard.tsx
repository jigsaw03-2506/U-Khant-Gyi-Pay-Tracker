import type { ReactNode } from 'react'
import { formatMMK } from '../../transfers/utils/transfer-utils'

interface SummaryCardProps {
  title: string
  amount: number
  note: string
  icon: ReactNode
  tone: 'green' | 'blue' | 'amber' | 'teal' | 'rose'
  context: string
}

const cardBackgrounds = {
  green: 'border-emerald-200 bg-emerald-50',
  blue: 'border-sky-200 bg-sky-50',
  amber: 'border-amber-200 bg-amber-50',
  teal: 'border-teal-200 bg-teal-50',
  rose: 'border-rose-200 bg-rose-50',
}

const iconTones = {
  green: 'bg-emerald-100 text-emerald-800',
  blue: 'bg-sky-100 text-sky-800',
  amber: 'bg-amber-100 text-amber-900',
  teal: 'bg-teal-100 text-teal-800',
  rose: 'bg-rose-100 text-rose-800',
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
    <article className={`flex h-full min-w-0 flex-col rounded-xl border p-5 shadow-sm ${cardBackgrounds[tone]}`}>
      <div className="flex items-center justify-between">
        <span className={`grid size-10 place-items-center rounded-lg ${iconTones[tone]}`}>{icon}</span>
        <span className="text-xs font-medium text-slate-500">{context}</span>
      </div>
      <div className="mt-4 text-sm font-medium leading-5 text-slate-600">{title}</div>
      <div className="mt-1 break-words text-xl font-bold leading-7 tracking-tight text-slate-900 sm:text-2xl">{formatMMK(amount)}</div>
      <div className="mt-auto pt-2 text-xs leading-5 text-slate-600">{note}</div>
    </article>
  )
}
