import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  LayoutDashboard,
  WalletCards,
} from "lucide-react";
import { AccountMenu } from "./AccountMenu";

export type AppScreen = "transfer" | "dashboard";

interface AppHeaderProps {
  activeScreen: AppScreen;
  email: string;
  isAdmin: boolean;
  onNavigate: (screen: AppScreen) => void;
  onLogout: () => void;
}

function getClockLabel() {
  const now = new Date();
  return {
    time: new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(now),
    date: new Intl.DateTimeFormat("en", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }).format(now),
  };
}

export function AppHeader({
  activeScreen,
  email,
  isAdmin,
  onNavigate,
  onLogout,
}: AppHeaderProps) {
  const [clock, setClock] = useState(getClockLabel);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(getClockLabel()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const navItems = [
    { id: "transfer", label: "Transfer", icon: ArrowLeftRight },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  ] as const;
  const visibleNavItems = isAdmin
    ? navItems
    : navItems.filter((item) => item.id !== "dashboard");

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 text-slate-900 backdrop-blur-xl dark:border-white/5 dark:bg-[#070b16]/80 dark:text-slate-50">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 items-center gap-x-4 gap-y-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 shadow-lg shadow-amber-500/20">
            <WalletCards size={22} />
          </span>
          <div className="min-w-0">
            <div className="truncate text-base font-bold tracking-tight">
              U Khant Gyi
            </div>
            <div className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              ငွေလွှဲ / ငွေထုတ်
            </div>
          </div>
        </div>

        <nav className="col-span-2 row-start-2 flex w-full justify-center gap-1 rounded-2xl border border-slate-200 bg-slate-100/80 p-1 sm:col-span-1 sm:col-start-2 sm:row-start-auto sm:w-auto dark:border-white/10 dark:bg-white/5 card-shadow">
          {visibleNavItems.map(({ id, label, icon: Icon }) => {
            const active = activeScreen === id;
            return (
              <button
                key={id}
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => onNavigate(id)}
                className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:flex-none ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                }`}
              >
                <Icon size={17} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="col-start-2 row-start-1 ml-auto flex items-center gap-3 sm:col-start-3 sm:row-start-auto">
          <div className="hidden text-right leading-tight sm:block">
            <div className="text-xs font-semibold">{clock.date}</div>
            <div className="mt-1 text-xs tabular-nums text-slate-500 dark:text-slate-400">
              {clock.time}
            </div>
          </div>
          <AccountMenu email={email} isAdmin={isAdmin} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}
