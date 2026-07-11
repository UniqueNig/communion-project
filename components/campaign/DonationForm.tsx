"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

type Currency = "NGN" | "USD";

const PRESETS: Record<Currency, number[]> = {
  NGN: [50_000, 100_000, 200_000, 500_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000],
  USD: [50, 100, 200, 500, 1000, 2000, 3000, 6250],
};

const SYMBOL: Record<Currency, string> = { NGN: "₦", USD: "$" };

function formatAmount(amount: number, currency: Currency) {
  return `${SYMBOL[currency]}${amount.toLocaleString("en-US")}`;
}

type DonationFormProps = {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  remaining: number;
};

export function DonationForm({
  currency,
  onCurrencyChange,
  remaining,
}: DonationFormProps) {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(
    PRESETS.NGN[1]
  );
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedPreset(PRESETS[currency][1]);
    setCustomAmount("");
  }, [currency]);

  function handlePresetClick(amount: number) {
    setSelectedPreset(amount);
    setCustomAmount("");
  }

  function handleGiveRemaining() {
    setCustomAmount(String(remaining));
    setSelectedPreset(null);
  }

  function handleCustomChange(value: string) {
    setCustomAmount(value);
    setSelectedPreset(null);
  }

  const amount = customAmount ? Number(customAmount) : selectedPreset ?? 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@"))
      return setError("Please enter a valid email address.");
    if (!amount || amount <= 0)
      return setError("Please choose or enter an amount.");

    setLoading(true);
    try {
      const res = await fetch("/api/donations/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, amount, currency }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Could not reach the payment provider. Please try again.");
      setLoading(false);
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 w-full max-w-xl"
    >
      <div>
        <p className="text-sm text-foreground/60 mb-2">Give in</p>
        <div className="inline-flex rounded-full bg-foreground/5 border border-foreground/10 p-1">
          {(["NGN", "USD"] as Currency[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCurrencyChange(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                currency === c
                  ? "bg-linear-to-r from-gold-500 to-gold-600 text-charcoal-950"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {c === "NGN" ? "Naira" : "US Dollars"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-foreground/60 mb-3">Choose an amount</p>
        {remaining > 0 ? (
          <button
            type="button"
            onClick={handleGiveRemaining}
            className="mb-3 flex w-full items-center justify-between gap-3 rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-2.5 text-left transition-colors hover:border-gold-500/50 cursor-pointer"
          >
            <span className="text-sm text-foreground/70">
              {formatAmount(remaining, currency)} still needed to reach the
              goal. Giving more than this is very welcome too.
            </span>
            <span className="whitespace-nowrap text-sm font-semibold text-accent-ink">
              Give this amount
            </span>
          </button>
        ) : (
          <p className="mb-3 text-sm text-foreground/60">
            This project has been fully funded. Any additional gift goes
            toward the next season of ministry.
          </p>
        )}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {PRESETS[currency].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className={`rounded-xl border px-3 py-2.5 text-sm sm:text-base font-medium transition-all cursor-pointer ${
                selectedPreset === preset
                  ? "border-gold-500 bg-gold-500/15 text-accent-ink"
                  : "border-foreground/10 bg-foreground/3 text-foreground/80 hover:border-foreground/25"
              }`}
            >
              {formatAmount(preset, currency)}
            </button>
          ))}
        </div>
        <input
          type="number"
          min={1}
          placeholder={`Custom amount (${currency})`}
          value={customAmount}
          onChange={(e) => handleCustomChange(e.target.value)}
          className="mt-3 w-full rounded-xl border border-foreground/10 bg-foreground/3 px-4 py-2.5 text-foreground placeholder:text-foreground/40 outline-none focus:border-gold-500 transition-colors"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Full name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl border border-foreground/10 bg-foreground/3 px-4 py-2.5 text-foreground placeholder:text-foreground/40 outline-none focus:border-gold-500 transition-colors"
        />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-foreground/10 bg-foreground/3 px-4 py-2.5 text-foreground placeholder:text-foreground/40 outline-none focus:border-gold-500 transition-colors"
        />
      </div>
      <p className="text-xs text-foreground/40 -mt-3">
        Leave your name blank to give anonymously.
      </p>

      {currency === "NGN" && (
        <p className="-mt-3 text-xs text-foreground/50 leading-relaxed">
          Not comfortable entering card details online? That's
          understandable. After clicking Give, choose Transfer on the next
          screen and you'll get a one-time account number to pay from your
          own banking app. No card needed.
        </p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className="w-full rounded-xl bg-linear-to-r from-gold-500 via-gold-600 to-violet-500 px-6 py-3.5 font-display font-semibold text-charcoal-950 disabled:opacity-60 cursor-pointer"
      >
        {loading
          ? "Redirecting to secure payment..."
          : `Give ${amount ? formatAmount(amount, currency) : ""} ${
              currency === "NGN" ? "via Paystack" : "via Flutterwave"
            }`}
      </motion.button>

      <p className="text-xs text-foreground/40 text-center">
        You'll be redirected to {currency === "NGN" ? "Paystack" : "Flutterwave"}
        's secure checkout to complete your gift.
      </p>
    </motion.form>
  );
}
