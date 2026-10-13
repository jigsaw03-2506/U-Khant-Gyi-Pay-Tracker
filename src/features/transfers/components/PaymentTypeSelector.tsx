import { paymentTypes, type PaymentTypeId } from '../types/payment-types'

interface PaymentTypeSelectorProps {
  selected: PaymentTypeId
  onSelect: (paymentType: PaymentTypeId) => void
}

export function PaymentTypeSelector({
  selected,
  onSelect,
}: PaymentTypeSelectorProps) {
  return (
    <aside aria-label="Payment types" className="min-w-0">
      <h2 className="mb-3 px-1 text-xs font-bold uppercase tracking-wider text-slate-500">
        Payment type <span className="normal-case tracking-normal">ရွေးချယ်ပါ</span>
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 xl:flex-col xl:overflow-visible xl:pb-0">
        {paymentTypes.map((paymentType) => {
          const Icon = paymentType.icon
          const active = selected === paymentType.id

          return (
            <button
              key={paymentType.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(paymentType.id)}
              className={`flex min-h-[76px] min-w-44 flex-1 items-center gap-3 rounded-2xl border p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 xl:min-w-0 xl:flex-none ${
                active
                  ? paymentType.activeClass
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
              }`}
            >
              <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${active ? paymentType.iconClass : paymentType.idleIconClass}`}>
                <Icon size={21} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold">{paymentType.label}</span>
                <span className="mt-1 block text-xs text-slate-500">{paymentType.description}</span>
              </span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
