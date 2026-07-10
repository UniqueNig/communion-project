"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

export function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError("Could not reach the server. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background bg-mesh-dawn text-foreground flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="glass-panel rounded-3xl p-8 w-full max-w-sm text-center"
      >
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold-500/15">
          <Lock className="text-gold-400" size={22} />
        </div>
        <h1 className="mt-5 font-display text-xl font-bold">Admin access</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Enter the admin password to view the donor list.
        </p>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="mt-6 w-full rounded-xl border border-foreground/10 bg-foreground/3 px-4 py-2.5 text-foreground placeholder:text-foreground/40 outline-none focus:border-gold-500 transition-colors"
        />

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-linear-to-r from-gold-500 via-gold-600 to-violet-500 px-6 py-3 font-display font-semibold text-charcoal-950 disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Checking..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
