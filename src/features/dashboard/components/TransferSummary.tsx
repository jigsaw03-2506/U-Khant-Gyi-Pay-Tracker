import {
  ArrowDownLeft,
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  Coins,
  Send,
  Smartphone,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { SummaryCard } from './SummaryCard'
import {
  calculateTransferSummary,
  formatMMK,
  getLocalDateKey,
} from '../../transfers/utils/transfer-utils'
import type { Transaction } from '../../transfers/types/transfer.types'

export interface SummaryRange {
  from: string
  to: string
}

type RangePreset = 'today' | 'thisMonth' | 'lastMonth' | 'custom'

const PRESET_LABELS: Record<Exclude<RangePreset, 'custom'>, string> = {
  today: 'Today',
  thisMonth: 'This month',
  lastMonth: 'Last month',
}

function toDateKey(date: Date): string {
  return getLocalDateKey(date.toISOString())
}

function getPresetRange(preset: Exclude<RangePreset, 'custom'>): SummaryRange {
  const now = new Date()
  if (preset === 'today') {
    const today = toDateKey(now)
    return { from: today, to: today }
  }
  const monthOffset = preset === 'thisMonth' ? 0 : -1
  return {
    from: toDateKey(new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)),
    to: toDateKey(new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 0)),
  }
}

function getActivePreset(range: SummaryRange): RangePreset {
  const presets = Object.keys(PRESET_LABELS) as Exclude<RangePreset, 'custom'>[]
  return presets.find((preset) => {
    const presetRange = getPresetRange(preset)
    return presetRange.from === range.from && presetRange.to === range.to
  }) ?? 'custom'
}

function formatDateKey(dateKey: string): string {
  const date = new Date(`${dateKey}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? dateKey
    : new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date)
}

interface TransferSummaryProps {
  transactions: Transaction[]
  summaryRange: SummaryRange
  onSummaryRangeChange: (range: SummaryRange) => void
}

export function TransferSummary({
  transactions,
  summaryRange,
  onSummaryRangeChange,
}: TransferSummaryProps) {
  const totals = calculateTransferSummary(transactions, summaryRange.from, summaryRange.to)
  const activePreset = getActivePreset(summaryRange)
  const dateLabel = summaryRange.from === summaryRange.to
    ? formatDateKey(summaryRange.from)
    : `${formatDateKey(summaryRange.from)} – ${formatDateKey(summaryRange.to)}`
  const summaryContext = activePreset === 'custom' ? 'Selected range' : PRESET_LABELS[activePreset]

  function changeFrom(from: string) {
    if (!from) return
    onSummaryRangeChange({ from, to: from > summaryRange.to ? from : summaryRange.to })
  }

  function changeTo(to: string) {
    if (!to) return
    onSummaryRangeChange({ from: to < summaryRange.from ? to : summaryRange.from, to })
  }

  return (
    <>
      <section className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" id="dashboard">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-emerald-800">
            <span className="size-2 rounded-full bg-emerald-500" /> YOUR SHOP AT A GLANCE
          </div>
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            Good day, shop owner <span className="text-amber-500">✦</span>
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Here’s how your money transfer business is doing.
          </p>
        </div>
        <div className="flex min-w-0 flex-col gap-2 sm:items-end">
          <div className="flex w-fit max-w-full flex-wrap gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm" role="group" aria-label="Summary period">
            {(Object.keys(PRESET_LABELS) as Exclude<RangePreset, 'custom'>[]).map((preset) => (
              <button
                key={preset}
                type="button"
                aria-pressed={activePreset === preset}
                onClick={() => onSummaryRangeChange(getPresetRange(preset))}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${activePreset === preset ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-emerald-50'}`}
              >
                {PRESET_LABELS[preset]}
              </button>
            ))}
          </div>
          <div className={`flex h-11 w-fit max-w-full items-center gap-2 rounded-lg border bg-white px-3 text-slate-600 shadow-sm focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 ${activePreset === 'custom' ? 'border-emerald-500' : 'border-slate-200'}`}>
            <CalendarDays size={17} className="shrink-0 text-emerald-800" />
            <input
              type="date"
              value={summaryRange.from}
              onChange={(event) => changeFrom(event.target.value)}
              aria-label="Summary from date"
              className="min-w-0 border-0 bg-transparent text-xs text-slate-800 outline-none"
            />
            <span className="shrink-0 text-xs text-slate-500">to</span>
            <input
              type="date"
              value={summaryRange.to}
              onChange={(event) => changeTo(event.target.value)}
              aria-label="Summary to date"
              className="min-w-0 border-0 bg-transparent text-xs text-slate-800 outline-none"
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-4" aria-label="Transaction summary">
        <SummaryCard title="Deposit amount" amount={totals.depositAmount} note="Electronic money received" icon={<ArrowDownToLine size={19} />} tone="green" context={summaryContext} />
        <SummaryCard title="Withdraw amount" amount={totals.withdrawAmount} note="Electronic money sent" icon={<Send size={18} />} tone="blue" context={summaryContext} />
        <SummaryCard title="Service fees earned" amount={totals.serviceFees} note="Recorded fees · separate from movements" icon={<Coins size={19} />} tone="amber" context={summaryContext} />
        <SummaryCard title="Physical cash received" amount={totals.cashReceived} note="Cash collected from customers" icon={<ArrowDownLeft size={19} />} tone="teal" context={summaryContext} />
        <SummaryCard title="Physical cash paid" amount={totals.cashPaid} note="Cash handed to customers" icon={<ArrowUpRight size={19} />} tone="rose" context={summaryContext} />
        <article className="flex h-full min-w-0 flex-col rounded-xl border border-violet-200 bg-violet-50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-lg bg-violet-100 text-violet-800"><ArrowLeftRight size={18} /></span>
            <span className="text-xs font-medium text-slate-500">{summaryContext}</span>
          </div>
          <div className="mt-4 text-sm font-medium text-slate-600">Transactions</div>
          <div className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{totals.transactionCount}<small className="ml-1 text-sm font-medium text-slate-600">txns</small></div>
          <div className="mt-auto pt-2 text-xs leading-5 text-slate-600">Total transactions recorded</div>
        </article>
      </section>

      <section className="mt-9" aria-labelledby="movement-title">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-800"><ArrowLeftRight size={18} /></span>
            <div>
              <h2 id="movement-title" className="text-lg font-bold tracking-tight text-slate-900">Money movements</h2>
              <p className="mt-1 text-xs leading-5 text-slate-600">Calculated from saved records · not verified account balances</p>
            </div>
          </div>
          <span className="flex items-center gap-2 text-xs font-medium text-slate-600"><CalendarDays size={15} />{dateLabel}</span>
        </div>
        <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-2 lg:grid-cols-4">
          <MovementItem title="Physical cash received" amount={totals.cashReceived} description="Cash collected from customers" positive icon={<ArrowDownLeft size={18} />} />
          <MovementItem title="Physical cash paid" amount={totals.cashPaid} description="Cash handed to customers" positive={false} icon={<ArrowUpRight size={18} />} />
          <MovementItem title="Net physical cash" amount={totals.netCash} description="Cash received − cash paid" positive={totals.netCash >= 0} icon={<Banknote size={18} />} />
          <MovementItem title="Electronic money received" amount={totals.electronicReceived} description="Deposit transaction amounts" positive icon={<ArrowDownToLine size={18} />} />
          <MovementItem title="Electronic money sent" amount={totals.electronicSent} description="Withdraw transaction amounts" positive={false} icon={<Send size={18} />} />
          <MovementItem title="Net electronic movement" amount={totals.netElectronic} description="Received − sent" positive={totals.netElectronic >= 0} icon={<Smartphone size={18} />} />
        </div>
      </section>
    </>
  )
}

function MovementItem({
  title,
  amount,
  description,
  positive,
  icon,
}: {
  title: string
  amount: number
  description: string
  positive: boolean
  icon: ReactNode
}) {
  const amountTone = amount === 0
    ? 'text-slate-700'
    : positive
      ? 'text-emerald-800'
      : 'text-rose-800'

  return (
    <article className="flex h-full min-h-36 min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${positive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{icon}</span>
        <span className="text-sm font-semibold leading-5 text-slate-700">{title}</span>
      </div>
      <div className={`mt-auto wrap-break-word text-lg font-bold leading-6 tracking-tight ${amountTone}`}>
        {amount > 0 ? '+' : ''}{formatMMK(amount)}
      </div>
      <span className="text-xs leading-5 text-slate-600">{description}</span>
    </article>
  )
}
