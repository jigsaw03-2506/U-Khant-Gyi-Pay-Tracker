# Shwe Transfer — Firebase ချိတ်ဆက်နည်း (အဆင့်ဆင့်)

ဒီ app မှာ **Save** နှိပ်တိုင်း Firebase **Firestore** ထဲက `transfers` collection (table) ထဲကို document (row) အသစ်တစ်ခု insert ဖြစ်ပါတယ်။
Browser tab ပိတ်ပြီး ပြန်ဖွင့်လည်း၊ တခြားဖုန်း/ကွန်ပျူတာကနေ ဝင်လည်း data တွေ အကုန် ပြန်ပေါ်နေပါမယ်။

---

## အဆင့် ၀ — လိုအပ်တာများ

1. **Node.js** (version 20 နဲ့အထက်) — https://nodejs.org မှာ "LTS" ကို download ပြီး install လုပ်ပါ။
   Install ပြီးရင် VS Code Terminal မှာ စစ်ကြည့်ပါ —
   ```sh
   node -v
   npm -v
   ```
2. **VS Code** — https://code.visualstudio.com
3. **Google account** တစ်ခု (Firebase အတွက်)

---

## အဆင့် ၁ — Project ကို VS Code မှာ ဖွင့်ပါ

1. Zip ဖိုင်ကို ဖြည် (Extract) ပါ။ `vibecoding` folder ထွက်လာပါမယ်။
2. VS Code → **File → Open Folder…** → `vibecoding` folder ကို ရွေးပါ။
3. **Terminal → New Terminal** ဖွင့်ပြီး library တွေ install လုပ်ပါ —
   ```sh
   npm install
   ```
   (ပထမအကြိမ် ၁–၃ မိနစ်လောက် ကြာနိုင်ပါတယ်။ `firebase` library လည်း ဒီမှာ ပါပြီးသား install ဖြစ်ပါမယ်။)

---

## အဆင့် ၂ — Firebase Project အသစ် ဖန်တီးပါ

1. https://console.firebase.google.com ကို ဖွင့်ပြီး Google account နဲ့ ဝင်ပါ။
2. **Create a project** (သို့ **Add project**) ကို နှိပ်ပါ။
3. Project name ထည့်ပါ (ဥပမာ `shwe-transfer`) → **Continue**
4. Google Analytics — မလိုပါ၊ ပိတ်ထားလို့ရပါတယ် → **Create project**
5. ပြီးသွားရင် **Continue** နှိပ်ပါ။

---

## အဆင့် ၃ — Web App ထည့်ပြီး Config key တွေ ယူပါ

1. Project Overview စာမျက်နှာမှာ **`</>` (Web)** icon ကို နှိပ်ပါ။
2. App nickname: `shwe-transfer-web` → **Register app**
   ("Also set up Firebase Hosting" ကို အခုမရွေးလည်း ရပါတယ်)
3. အောက်ပါလို code တစ်ပိုင်း ပေါ်လာပါမယ် —
   ```js
   const firebaseConfig = {
     apiKey: "AIza....",
     authDomain: "shwe-transfer.firebaseapp.com",
     projectId: "shwe-transfer",
     storageBucket: "shwe-transfer.firebasestorage.app",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcdef..."
   };
   ```
   ဒီတန်ဖိုးတွေကို နောက်အဆင့်မှာ သုံးပါမယ်။
   (နောက်မှ ပြန်ကြည့်ချင်ရင် — ⚙️ **Project settings → General → Your apps** မှာ ရှိပါတယ်။)

---

## အဆင့် ၄ — `.env.local` ဖိုင်ထဲ key တွေ ထည့်ပါ

1. VS Code မှာ `.env.example` ဖိုင်ကို **copy** ကူးပြီး နာမည်ကို **`.env.local`** လို့ ပြောင်းပါ။
   Terminal နဲ့ဆိုရင် —
   ```sh
   # Windows (PowerShell)
   copy .env.example .env.local
   # Mac / Linux
   cp .env.example .env.local
   ```
2. `.env.local` ကိုဖွင့်ပြီး အဆင့် ၃ က တန်ဖိုးတွေ ဖြည့်ပါ (quote `"` မထည့်ရပါ) —
   ```
   VITE_FIREBASE_API_KEY=AIza....
   VITE_FIREBASE_AUTH_DOMAIN=shwe-transfer.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=shwe-transfer
   VITE_FIREBASE_STORAGE_BUCKET=shwe-transfer.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
   VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef...
   ```
3. Save လုပ်ပါ။ (`.env.local` ကို git ထဲ မတင်အောင် `.gitignore` မှာ ထည့်ပြီးသားပါ။)

---

## အဆင့် ၅ — Firestore Database ဖွင့်ပါ

1. Firebase Console ဘယ်ဘက် menu → **Build → Firestore Database**
2. **Create database** ကို နှိပ်ပါ။
3. Location — **`asia-southeast1` (Singapore)** ကို ရွေးပါ (မြန်မာနဲ့ အနီးဆုံး)။
   ⚠️ Location ကို နောက်မှ ပြောင်းလို့ မရပါ။
4. **Start in production mode** ကို ရွေး → **Create**

---

## အဆင့် ၆ — Security Rules ထည့်ပါ (အရေးကြီး)

ဒီ rules က login ဝင်ထားတဲ့ ဆိုင်အကောင့်ကလွဲရင် ဘယ်သူမှ ငွေစာရင်းကို ဖတ်/ပြင်လို့ မရအောင် ကာကွယ်ပေးပါတယ်။

1. **Firestore Database → Rules** tab ကို နှိပ်ပါ။
2. ရှိပြီးသား စာတွေကို အကုန်ဖျက်ပြီး project ထဲက **`firestore.rules`** ဖိုင်ထဲက စာအားလုံးကို copy ကူး paste ပါ။
3. **Publish** နှိပ်ပါ။

---

## အဆင့် ၇ — Login အကောင့် ဖန်တီးပါ

1. ဘယ်ဘက် menu → **Build → Authentication** → **Get started**
2. **Sign-in method** tab → **Email/Password** → **Enable** ဖွင့် → **Save**
3. **Users** tab → **Add user**
   - Email: ဆိုင်သုံးမယ့် email (ဥပမာ `shop@example.com`)
   - Password: အနည်းဆုံး ၆ လုံး၊ ခန့်မှန်းရခက်တာ ထားပါ
   - **Add user**

ဝန်ထမ်းတစ်ယောက်ချင်းစီအတွက် အကောင့်သီးသန့် လိုချင်ရင် ဒီမှာပဲ user ထပ်ထည့်ပါ။ (အကောင့်အားလုံး data အတူတူ မြင်ရပါမယ်။)

---

## အဆင့် ၈ — App ကို Run ပါ

```sh
npm run dev
```

Terminal မှာ `http://localhost:5173` လို link ပေါ်လာပါမယ်။ Ctrl (Mac မှာ Cmd) နှိပ်ပြီး click လုပ်ပါ။

1. အဆင့် ၇ က email / password နဲ့ **Login** ဝင်ပါ။
2. Transfer form ဖြည့်ပြီး **Save** နှိပ်ပါ → "Transaction saved to Firebase." ပေါ်ရပါမယ်။
3. Firebase Console → **Firestore Database → Data** မှာ `transfers` collection ထဲ document အသစ် ဝင်နေတာ မြင်ရပါမယ်။
4. **စမ်းသပ်ရန်** — Browser tab ကို ပိတ်ပြီး ပြန်ဖွင့်ပါ → စာရင်းတွေ ဆက်ရှိနေရပါမယ်။

> 💡 `.env.local` ကို ပြင်ပြီးတိုင်း `npm run dev` ကို ရပ် (Ctrl + C) ပြီး ပြန် run ရပါတယ်။

---

## Data ပုံစံ (Firestore ထဲမှာ)

Collection: **`transfers`** — document တစ်ခု = transfer တစ်ခု (document ID = transfer `id`)

| Field | အမျိုးအစား | ဥပမာ |
|---|---|---|
| `id` | string | `3f2a…` |
| `transactionType` | `deposit` / `withdraw` | `deposit` |
| `provider` | string | `KBZPay` |
| `dateTime` | ISO date string | `2026-10-13T09:30:00.000Z` |
| `customerName` | string | `Ko Aung` |
| `phoneNumber`, `accountInformation`, `referenceNumber`, `notes` | string (optional) | |
| `amount` | number | `50000` |
| `serviceFee` | number | `500` |
| `cashReceived`, `cashPaid` | number | `0`, `50000` |
| `createdAt`, `updatedAt` | ISO date string | |

- **Save (အသစ်)** → document အသစ်တစ်ခု insert
- **Edit ပြီး Save** → အဲ့ document တစ်ခုတည်းကိုပဲ update
- **Delete** → အဲ့ document ကို ဖျက်

---

## အရင် browser ထဲက data တွေ

အရင် version (localStorage) မှာ သိမ်းထားတဲ့ စာရင်းတွေ ရှိရင်၊ အဲ့ browser ကနေ ပထမဆုံး login ဝင်တဲ့အခါ Firebase ထဲကို **အလိုအလျောက် ပြောင်းတင်** ပေးပါတယ်။ ("Moved N saved transfers…" message ပေါ်ပါမယ်။) ID တူတူသုံးလို့ နှစ်ခါ ထပ်မနေပါ။

---

## Internet ပြတ်သွားရင်

Firestore offline cache ဖွင့်ထားပါတယ်။ Internet ပြတ်နေချိန် Save လုပ်ထားတာတွေ device ထဲမှာ ခဏသိမ်းထားပြီး internet ပြန်ရတာနဲ့ Firebase ဆီ အလိုအလျောက် ပို့ပေးပါတယ်။

---

## (ရွေးချယ်စရာ) Internet ပေါ် တင်ချင်ရင် — Firebase Hosting

ဆိုင်က ဖုန်း/ကွန်ပျူတာ ဘယ်ကနေမဆို link နဲ့ ဖွင့်လို့ရအောင် —

```sh
npm install -g firebase-tools
firebase login
```

`.firebaserc` ဖိုင်ထဲက `YOUR_FIREBASE_PROJECT_ID` ကို သင့် project ID (ဥပမာ `shwe-transfer`) နဲ့ အစားထိုးပါ။ ပြီးရင် —

```sh
npm run deploy
```

ပြီးသွားရင် `https://shwe-transfer.web.app` လို link ရပါမယ်။ (ဒီ command က `firestore.rules` ကိုပါ တစ်ခါတည်း upload လုပ်ပေးပါတယ်။)

---

## ပြဿနာ ဖြေရှင်းနည်း

| တွေ့ရတဲ့ error | ဖြေရှင်းနည်း |
|---|---|
| Login စာမျက်နှာမှာ "Firebase key မထည့်ရသေးပါ" | `.env.local` ဖိုင်နာမည်/တန်ဖိုး စစ်ပြီး `npm run dev` ပြန် run |
| `auth/operation-not-allowed` | အဆင့် ၇ — Email/Password ကို Enable လုပ်ပါ |
| `auth/invalid-credential` | Email/Password မှားနေ၊ Authentication → Users မှာ စစ်ပါ |
| "Missing or insufficient permissions" | အဆင့် ၆ — Rules ကို Publish လုပ်ပြီးပြီလား စစ်ပါ |
| `auth/invalid-api-key` | `.env.local` ထဲ `VITE_FIREBASE_API_KEY` မှန်/မမှန် စစ်ပါ |
| `npm` command မတွေ့ | Node.js install ပြီး VS Code ကို ပိတ်ပြီး ပြန်ဖွင့်ပါ |
