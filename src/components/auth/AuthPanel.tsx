"use client";

import { useAuth } from "./AuthProvider";
import { useState } from "react";
import Link from "next/link";

export function AuthPanel({ compact = false }: { compact?: boolean }) {
  const { user, loading, token, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("admin@matprog.local");
  const [password, setPassword] = useState("MatProg!2345");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await signIn(email, password);
    if (res.error) setError(res.error);
    setBusy(false);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-xs text-muted">{user.email}</span>
            <button
              onClick={signOut}
              className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold text-charcoal"
            >
              Logout
            </button>
            <Link
              href="/dashboard"
              className="rounded-pill bg-orange px-3 py-1 text-xs font-semibold text-charcoal"
            >
              Dashboard
            </Link>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold text-charcoal"
          >
            Login
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white/80 p-4 shadow-card ring-1 ring-line backdrop-blur">
      <h3 className="text-base font-semibold text-charcoal">Auth Panel</h3>
      {user ? (
        <div className="mt-2 space-y-2 text-sm text-stone">
          <p>Signed in as:</p>
          <div className="rounded-xl bg-cloud px-3 py-2 text-charcoal">
            <div>{user.email}</div>
            <div className="truncate text-xs text-muted">Token: {token?.slice(0, 18)}...</div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/dashboard"
              className="rounded-pill bg-orange px-4 py-2 text-sm font-semibold text-charcoal"
            >
              Dashboard
            </Link>
            <button
              onClick={signOut}
              className="rounded-pill bg-charcoal px-4 py-2 text-sm font-semibold text-ivory"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="mt-3 space-y-3">
          <div className="space-y-1 text-sm">
            <label className="text-muted">Email</label>
            <input
              className="w-full rounded-xl border border-line px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="username"
            />
          </div>
          <div className="space-y-1 text-sm">
            <label className="text-muted">Password</label>
            <input
              className="w-full rounded-xl border border-line px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
            />
          </div>
          {error && <div className="text-xs text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={busy || loading}
            className="w-full rounded-pill bg-orange px-4 py-2 text-sm font-semibold text-charcoal disabled:opacity-60"
          >
            {busy ? "Signing in..." : "Login"}
          </button>
        </form>
      )}
    </div>
  );
}

