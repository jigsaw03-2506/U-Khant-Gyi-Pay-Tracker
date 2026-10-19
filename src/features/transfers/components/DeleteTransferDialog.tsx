import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { Trash2 } from 'lucide-react'

interface DeleteTransferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteTransferDialog({
  open,
  onOpenChange,
  onConfirm,
}: DeleteTransferDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-slate-950/50 dark:bg-black/70 backdrop-blur-sm" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-[51] w-[min(390px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/70 p-6 shadow-2xl">
          <div className="grid size-11 place-items-center rounded-xl bg-rose-100 dark:bg-rose-500/15 text-rose-800 dark:text-rose-300"><Trash2 size={20} /></div>
          <AlertDialog.Title className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-50">
            Delete this transaction?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            This transaction will be permanently removed from this device. This action cannot be undone.
          </AlertDialog.Description>
          <div className="mt-5 flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <button className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-300 dark:border-white/15 px-4 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5">Keep transaction</button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-rose-700 px-4 text-sm font-semibold text-white hover:bg-rose-800" onClick={onConfirm}>
                <Trash2 size={15} />Delete transaction
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
