"use client";

import { useEffect } from "react";
import { RotateCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background bg-mesh-dawn text-foreground flex items-center justify-center px-6">
      <div className="glass-panel rounded-3xl p-10 max-w-md text-center">
        <h1 className="font-display text-2xl font-bold">
          Something went wrong
        </h1>
        <p className="mt-3 text-foreground/70">
          We hit an unexpected error loading this page. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-gold-500 to-gold-600 px-6 py-3 font-display font-semibold text-charcoal-950 cursor-pointer"
        >
          <RotateCw size={16} />
          Try again
        </button>
      </div>
    </div>
  );
}
