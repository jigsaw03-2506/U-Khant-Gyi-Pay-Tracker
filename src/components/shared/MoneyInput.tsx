interface MoneyInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

// Text input (not type="number") so mouse-wheel / trackpad scrolling can never
// change the amount, and arrow keys can't nudge it by accident. Only digits are
// kept; commas are shown for readability but stored without them.
export function MoneyInput({
  value,
  onChange,
  placeholder = '0',
}: MoneyInputProps) {
  const display = value === '' ? '' : Number(value).toLocaleString('en-US')

  return (
    <span className="relative flex min-w-0 items-center">
      <span className="pointer-events-none absolute left-3 z-10 text-xs font-semibold text-slate-500">MMK</span>
      <input
        className="h-11 w-full min-w-0 rounded-lg border border-slate-300 bg-white pl-12 pr-3 text-sm tabular-nums text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={display}
        placeholder={placeholder}
        onChange={(event) => {
          const digits = event.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
          onChange(digits)
        }}
      />
    </span>
  )
}
