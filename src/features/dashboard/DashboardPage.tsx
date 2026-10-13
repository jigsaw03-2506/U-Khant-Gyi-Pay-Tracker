import { useState } from "react";
import { AppFooter } from "../../components/layout/AppFooter";
import { TransferHistoryPanel } from "../transfers/components/TransferHistoryPanel";
import type { Transaction } from "../transfers/types/transfer.types";
import { getLocalDateKey } from "../transfers/utils/transfer-utils";
import { TransferSummary } from "./components/TransferSummary";

interface DashboardPageProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => Promise<void> | void;
}

export function DashboardPage({
  transactions,
  onEdit,
  onDelete,
}: DashboardPageProps) {
  const [summaryDate, setSummaryDate] = useState(() =>
    getLocalDateKey(new Date().toISOString()),
  );

  return (
    <>
      <main className="mx-auto w-full max-w-[1600px] space-y-8 px-4 py-7 sm:px-6 lg:px-8">
        <TransferSummary
          transactions={transactions}
          summaryDate={summaryDate}
          onSummaryDateChange={setSummaryDate}
        />
        <TransferHistoryPanel
          transactions={transactions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <AppFooter />
      </main>
    </>
  );
}
