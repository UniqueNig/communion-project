"use client";

import { useState } from "react";
import { Reveal } from "@/components/campaign/Reveal";
import { ProgressBar } from "@/components/campaign/ProgressBar";
import { DonationForm } from "@/components/campaign/DonationForm";

type Currency = "NGN" | "USD";

const SYMBOL: Record<Currency, string> = { NGN: "₦", USD: "$" };

function formatAmount(amount: number, currency: Currency) {
  return `${SYMBOL[currency]}${Math.round(amount).toLocaleString("en-US")}`;
}

type GiveSectionProps = {
  raisedNGN: number;
  goalNGN: number;
  percent: number;
  usdRate: number;
};

export function GiveSection({ raisedNGN, goalNGN, percent, usdRate }: GiveSectionProps) {
  const [currency, setCurrency] = useState<Currency>("NGN");

  const raised = currency === "NGN" ? raisedNGN : raisedNGN / usdRate;
  const goal = currency === "NGN" ? goalNGN : goalNGN / usdRate;
  const remaining = Math.ceil(Math.max(goal - raised, 0));

  return (
    <div className="grid lg:grid-cols-2 gap-14 items-start">
      <Reveal>
        <p className="text-xs tracking-widest uppercase text-accent-ink">
          The Ask
        </p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
          Join us in this vision
        </h2>
        <p className="mt-5 text-foreground/70 leading-relaxed">
          To bring this vision to life, covering the solar lighting
          installation and the music/media equipment upgrade, we are looking
          at a total investment of{" "}
          <span className="text-accent-ink font-semibold">
            {formatAmount(goal, currency)}
          </span>
          .
        </p>
        <p className="mt-4 text-foreground/70 leading-relaxed">
          Whether through a full sponsorship, a partial contribution, or
          connecting us with others who share this vision, every seed sown
          here goes directly toward equipping TCC for the next season of
          ministry.
        </p>
        <div className="mt-8">
          <ProgressBar
            raised={raised}
            goal={goal}
            percent={percent}
            currency={currency}
          />
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <DonationForm
          currency={currency}
          onCurrencyChange={setCurrency}
          remaining={remaining}
        />
      </Reveal>
    </div>
  );
}
