import { CreditCard, Smartphone, WalletCards } from 'lucide-react'

export const paymentTypes = [
  {
    id: 'kpay',
    label: 'KPay',
    provider: 'KBZPay',
    description: 'KBZPay transfers',
    icon: Smartphone,
    activeClass: 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-100',
    iconClass: 'bg-emerald-600 text-white',
    idleIconClass: 'bg-emerald-50 text-emerald-700',
  },
  {
    id: 'wavepay',
    label: 'WavePay',
    provider: 'WavePay',
    description: 'WavePay transfers',
    icon: WalletCards,
    activeClass: 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-100',
    iconClass: 'bg-amber-500 text-white',
    idleIconClass: 'bg-amber-50 text-amber-700',
  },
  {
    id: 'ayapay',
    label: 'AyaPay',
    provider: 'AYA Pay',
    description: 'AYA Pay transfers',
    icon: CreditCard,
    activeClass: 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-100',
    iconClass: 'bg-rose-600 text-white',
    idleIconClass: 'bg-rose-50 text-rose-700',
  },
] as const

export type PaymentTypeId = (typeof paymentTypes)[number]['id']
