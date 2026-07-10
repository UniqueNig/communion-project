"use client";

import { useMemo, useState } from "react";
import { Trash2, LogOut } from "lucide-react";

type Currency = "NGN" | "USD";
type Status = "pending" | "success" | "failed";

export type DonationRow = {
  _id: string;
  name: string;
  email: string;
  amount: number;
  currency: Currency;
  provider: "paystack" | "flutterwave";
  status: Status;
  reference: string;
  createdAt: string;
};

const SYMBOL: Record<Currency, string> = { NGN: "₦", USD: "$" };

function formatAmount(amount: number, currency: Currency) {
  return `${SYMBOL[currency]}${amount.toLocaleString("en-US")}`;
}

const STATUS_STYLE: Record<Status, string> = {
  success: "bg-gold-500/15 text-accent-ink",
  pending: "bg-violet-500/15 text-violet-400",
  failed: "bg-red-500/15 text-red-500",
};

export function DonorTable({ donations }: { donations: DonationRow[] }) {
  const [rows, setRows] = useState(donations);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totals = useMemo(() => {
    const successful = rows.filter((r) => r.status === "success");
    const ngn = successful
      .filter((r) => r.currency === "NGN")
      .reduce((sum, r) => sum + r.amount, 0);
    const usd = successful
      .filter((r) => r.currency === "USD")
      .reduce((sum, r) => sum + r.amount, 0);
    return { count: rows.length, ngn, usd };
  }, [rows]);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this donation record? This can't be undone.")) {
      return;
    }
    setError(null);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/donations/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Could not delete this record.");
        return;
      }
      setRows((prev) => prev.filter((r) => r._id !== id));
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin";
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold">Donors</h1>
            <p className="text-sm text-foreground/60 mt-1">
              {totals.count} record{totals.count === 1 ? "" : "s"}, {" "}
              {formatAmount(totals.ngn, "NGN")} and {formatAmount(totals.usd, "USD")}{" "}
              confirmed
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm text-foreground/70 hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <div className="glass-panel rounded-2xl overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-foreground/10 text-foreground/50">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Provider</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._id} className="border-b border-foreground/5 last:border-0">
                  <td className="px-4 py-3 text-foreground/70">
                    {new Date(row.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3 text-foreground/70">{row.email}</td>
                  <td className="px-4 py-3 font-medium">
                    {formatAmount(row.amount, row.currency)}
                  </td>
                  <td className="px-4 py-3 text-foreground/70 capitalize">
                    {row.provider}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLE[row.status]}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(row._id)}
                      disabled={deletingId === row._id}
                      aria-label="Delete record"
                      className="text-foreground/40 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-foreground/50">
                    No donations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
