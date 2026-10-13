# Shwe Transfer

A responsive shop-management app for recording Myanmar money transfers. It supports Deposit (ငွေထုတ်) and Withdraw (ငွေလွှဲ) transactions, daily movement summaries, and searchable transaction history.

## Run locally

First connect Firebase — see **[FIREBASE_SETUP_MM.md](FIREBASE_SETUP_MM.md)** (Burmese step-by-step guide).

```sh
npm install
cp .env.example .env.local   # then fill in your Firebase web app keys
npm run dev
```

For a production build, run `npm run build`.

## Code structure

- `src/features/transfers/` contains the transaction page, form, history components, hook, types, persistence service, and pure helpers.
- `src/features/dashboard/` contains the daily transaction summary components.
- `src/components/layout/` contains the app header and footer.
- `src/components/shared/` contains reusable form controls.
- `src/lib/firebase.ts` initializes Firebase (Auth + Firestore with offline cache) from `VITE_FIREBASE_*` env vars.
- `src/features/auth/` contains the email/password login screen.
- `src/App.tsx` gates the app behind login, sets up notifications and renders the transfer page.

## Data and calculations

Transactions are stored in Firebase Cloud Firestore, collection `transfers`, one document per transaction (document ID = transaction `id`). Saving a new transaction inserts one document; editing updates that document; deleting removes it. The UI subscribes with `onSnapshot`, so data survives closing the tab and syncs across devices. Access is limited to signed-in users by `firestore.rules`. Records left in the old localStorage key are uploaded once on first sign-in.

- Deposit records store the electronic transfer under `amount` and the actual cash paid under `cashPaid`.
- Withdraw records store the electronic transfer under `amount` and the actual cash collected under `cashReceived`.
- Service fees are stored and summarized separately; they are not added to or deducted from transfer amounts or cash movement.
- Dashboard values are calculated from saved records for the selected date. Movement figures are transaction movements, not verified account balances.
