interface MoneyInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  readOnly?: boolean
}

// Text input (not type="number") so mouse-wheel / trackpad scrolling can never
// change the amount, and arrow keys can't nudge it by accident. Only digits are
// kept; commas are shown for readability but stored without them.
export function MoneyInput({
  value,
  onChange,
  placeholder = '0',
  readOnly = false,
}: MoneyInputProps) {
  const display = value === '' ? '' : Number(value).toLocaleString('en-US')

  return (
    <span className="relative flex min-w-0 items-center">
      <span className="pointer-events-none absolute left-3 z-10 text-xs font-semibold text-slate-500 dark:text-slate-400">MMK</span>
      <input
        className="h-11 w-full min-w-0 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900/70 pl-12 pr-3 text-sm tabular-nums text-slate-800 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-slate-400 dark:hover:border-white/25 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-500/20 read-only:cursor-not-allowed read-only:bg-slate-100 dark:read-only:bg-white/5 read-only:text-slate-600 dark:read-only:text-slate-400 read-only:hover:border-slate-300 dark:read-only:hover:border-white/15"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={display}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={(event) => {
          const digits = event.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
          onChange(digits)
        }}
      />
    </span>
  )
}
