# Shwe Transfer

A responsive shop-management app for recording Myanmar money transfers. It supports Deposit (ငွေထုတ်) and Withdraw (ငွေလွှဲ) transactions, daily movement summaries, and searchable transaction history.

## Run locally

```sh
npm install
npm run dev
```

For a production build, run `npm run build`.

## Code structure

- `src/features/transfers/` contains the transaction page, form, history components, hook, types, persistence service, and pure helpers.
- `src/features/dashboard/` contains the daily transaction summary components.
- `src/components/layout/` contains the app header and footer.
- `src/components/shared/` contains reusable form controls.
- `src/App.tsx` sets up the app-level notification region and renders the transfer page.

## Data and calculations

Transactions are stored in this browser's localStorage; no server or database is used. Clearing browser storage removes the saved records.

- Deposit records store the electronic transfer under `amount` and the actual cash paid under `cashPaid`.
- Withdraw records store the electronic transfer under `amount` and the actual cash collected under `cashReceived`.
- Service fees are stored and summarized separately; they are not added to or deducted from transfer amounts or cash movement.
- Dashboard values are calculated from saved records for the selected date. Movement figures are transaction movements, not verified account balances.
