import { CreditCard, Smartphone, WalletCards } from 'lucide-react'

export const paymentTypes = [
  {
    id: 'kpay',
    label: 'KPay',
    provider: 'KBZPay',
    description: 'KBZPay transfers',
    icon: Smartphone,
    activeClass: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-100 dark:ring-emerald-500/20 [--card-glow:rgba(16,185,129,0.45)]',
    iconClass: 'bg-emerald-600 text-white',
    idleIconClass: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  {
    id: 'wavepay',
    label: 'WavePay',
    provider: 'WavePay',
    description: 'WavePay transfers',
    icon: WalletCards,
    activeClass: 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-950 dark:text-amber-100 ring-2 ring-amber-100 dark:ring-amber-500/20 [--card-glow:rgba(245,158,11,0.45)]',
    iconClass: 'bg-amber-500 text-white',
    idleIconClass: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
  {
    id: 'ayapay',
    label: 'AyaPay',
    provider: 'AYA Pay',
    description: 'AYA Pay transfers',
    icon: CreditCard,
    activeClass: 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-950 dark:text-rose-100 ring-2 ring-rose-100 dark:ring-rose-500/20 [--card-glow:rgba(244,63,94,0.45)]',
    iconClass: 'bg-rose-600 text-white',
    idleIconClass: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300',
  },
] as const

export type PaymentTypeId = (typeof paymentTypes)[number]['id']
