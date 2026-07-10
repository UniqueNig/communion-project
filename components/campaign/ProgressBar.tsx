"use client";

import { motion } from "motion/react";

type Currency = "NGN" | "USD";

type ProgressBarProps = {
  raised: number;
  goal: number;
  percent: number;
  currency: Currency;
};

const SYMBOL: Record<Currency, string> = { NGN: "₦", USD: "$" };

function formatAmount(amount: number, currency: Currency) {
  return `${SYMBOL[currency]}${Math.round(amount).toLocaleString("en-US")}`;
}

export function ProgressBar({ raised, goal, percent, currency }: ProgressBarProps) {
  return (
    <div className="w-full max-w-xl">
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-display text-2xl sm:text-3xl text-foreground">
          {formatAmount(raised, currency)}
        </span>
        <span className="text-sm text-foreground/50">
          of {formatAmount(goal, currency)} goal
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-foreground/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full bg-linear-to-r from-gold-500 to-violet-500"
        />
      </div>
      <p className="mt-2 text-sm text-foreground/50">{percent}% funded so far</p>
    </div>
  );
}
