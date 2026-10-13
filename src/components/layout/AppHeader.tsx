import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  LayoutDashboard,
  Settings,
  WalletCards,
} from "lucide-react";

export type AppScreen = "transfer" | "dashboard";

interface AppHeaderProps {
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
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
      day: "2-digit",
      month: "short",
    }).format(now),
  };
}

export function AppHeader({ activeScreen, onNavigate }: AppHeaderProps) {
  const [clock, setClock] = useState(getClockLabel);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(getClockLabel()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const navItems = [
    { id: "transfer", label: "Transfer", icon: ArrowLeftRight },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  ] as const;

  return (
    <header className="bg-[#14234a] text-white shadow-md">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 items-center gap-x-4 gap-y-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-700 text-white shadow-inner">
            <WalletCards size={23} />
          </span>
          <div className="min-w-0">
            <div className="truncate text-base font-bold tracking-tight sm:text-lg">
              U Khant Gyi
            </div>
            <div className="mt-0.5 text-xs font-medium text-blue-200">
              ငွေလွှဲ / ငွေထုတ်
            </div>
          </div>
        </div>

        <div className="col-span-2 row-start-2 flex w-full justify-center gap-2 sm:col-span-1 sm:col-start-2 sm:row-start-auto sm:w-auto">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activeScreen === id;
            return (
              <button
                key={id}
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => onNavigate(id)}
                className={`flex min-h-11 min-w-40 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition sm:flex-none ${
                  active
                    ? "bg-amber-500 text-[#18254a] shadow-sm hover:bg-amber-400"
                    : "bg-blue-900/70 text-blue-100 hover:bg-blue-800"
                }`}
              >
                <Icon size={17} />
                {label}
              </button>
            );
          })}
        </div>

        <div className="col-start-2 row-start-1 ml-auto flex items-center gap-3 sm:col-start-3 sm:row-start-auto">
          <span
            className="grid size-9 place-items-center rounded-full border border-blue-300/30 bg-white text-[#14234a]"
            aria-label="Settings"
          >
            <Settings size={17} />
          </span>
          <div className="text-right leading-tight">
            <div className="text-sm font-semibold tabular-nums">
              {clock.time}
            </div>
            <div className="mt-1 text-[11px] text-blue-200">{clock.date}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
