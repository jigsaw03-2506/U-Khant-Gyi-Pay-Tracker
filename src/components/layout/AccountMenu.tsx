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
        className="grid size-9 place-items-center rounded-full border border-blue-300/30 bg-white text-[#14234a] transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        <Settings size={17} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 text-slate-800 shadow-lg"
        >
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600">
              <UserRound size={17} />
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{email}</div>
              <span
                className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  isAdmin
                    ? "bg-amber-100 text-amber-800"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {isAdmin ? "Admin" : "Employee"}
              </span>
            </div>
          </div>

          <div className="my-1 border-t border-slate-100" />

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex min-h-10 w-full items-center gap-2 rounded-lg px-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
