import { useState, type FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { LogIn, WalletCards } from "lucide-react";
import { auth, isFirebaseConfigured } from "../../lib/firebase";

function describeError(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email သို့မဟုတ် password မှားနေပါတယ်။";
    case "auth/too-many-requests":
      return "အကြိမ်များစွာ မှားလို့ ခဏပိတ်ထားပါတယ်။ နောက်မှ ပြန်ကြိုးစားပါ။";
    case "auth/network-request-failed":
      return "Internet မရပါ။ ချိတ်ဆက်မှု စစ်ပြီး ပြန်ကြိုးစားပါ။";
    case "auth/operation-not-allowed":
      return "Firebase Console မှာ Email/Password sign-in ကို Enable မလုပ်ရသေးပါ။";
    default:
      return `Login မအောင်မြင်ပါ (${code})`;
  }
}

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (loginError) {
      const code = (loginError as { code?: string }).code ?? "unknown";
      setError(describeError(code));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/70 p-6 card-shadow"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 dark:text-amber-100 shadow-lg shadow-amber-500/20">
            <WalletCards size={22} />
          </span>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              U Khant Gyi ငွေလွှဲ / ငွေထုတ်{" "}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">ဆိုင်အကောင့်ဖြင့် ဝင်ပါ</p>
          </div>
        </div>

        {!isFirebaseConfigured && (
          <p className="rounded-lg bg-amber-50 dark:bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200">
            Firebase key မထည့်ရသေးပါ။ <code>.env.example</code> ကို{" "}
            <code>.env.local</code> အဖြစ် copy ကူးပြီး Firebase key တွေ ဖြည့်ပါ။
            ပြီးရင် <code>npm run dev</code> ကို ပြန် run ပါ။
          </p>
        )}

        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Email
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900/70 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900/70 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20"
          />
        </label>

        {error && (
          <p className="rounded-lg bg-rose-50 dark:bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-60"
        >
          <LogIn size={17} />
          {busy ? "ဝင်နေသည်…" : "Login"}
        </button>
      </form>
    </div>
  );
}
