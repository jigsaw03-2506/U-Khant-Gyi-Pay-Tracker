interface MoneyInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function MoneyInput({
  value,
  onChange,
  placeholder = '0',
}: MoneyInputProps) {
  return (
    <span className="relative flex min-w-0 items-center">
      <span className="pointer-events-none absolute left-3 z-10 text-xs font-semibold text-slate-500">MMK</span>
      <input
        className="h-11 w-full min-w-0 rounded-lg border border-slate-300 bg-white pl-12 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
        type="number"
        min="0"
        step="1"
        inputMode="numeric"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </span>
  )
}
