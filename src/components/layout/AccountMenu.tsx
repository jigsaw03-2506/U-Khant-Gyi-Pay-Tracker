import { useEffect, useRef, useState } from "react";
import { LogOut, Settings, UserRound } from "lucide-react";

interface AccountMenuProps {
  email: string;
  isAdmin: boolean;
  onLogout: () => void;
}

export function AccountMenu({ email, isAdmin, onLogout }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside the menu or pressing Escape.
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label="Settings"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="grid size-10 place-items-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/70 text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <Settings size={17} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-2 text-slate-800 dark:text-slate-100 card-shadow"
        >
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400">
              <UserRound size={17} />
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{email}</div>
              <span
                className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  isAdmin
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
                    : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400"
                }`}
              >
                {isAdmin ? "Admin" : "Employee"}
              </span>
            </div>
          </div>

          <div className="my-1 border-t border-slate-100 dark:border-white/5" />

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex min-h-10 w-full items-center gap-2 rounded-lg px-2 text-sm font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
