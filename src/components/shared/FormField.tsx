import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
}

export function FormField({
  label,
  required = false,
  hint,
  error,
  children,
}: FormFieldProps) {
  return (
    <label className="flex min-w-0 flex-col gap-2 text-sm font-medium leading-5 text-slate-700">
      <span>
        {label}
        {required && <span className="text-rose-700"> *</span>}
        {hint && <span className="ml-2 text-xs font-normal text-slate-500">{hint}</span>}
      </span>
      {children}
      {error && <span className="text-xs font-medium text-rose-700">{error}</span>}
    </label>
  )
}
