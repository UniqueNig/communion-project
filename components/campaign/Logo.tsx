"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function Logo({ className = "" }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [darkVariantFailed, setDarkVariantFailed] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={className} aria-hidden />;
  }

  if (failed) {
    return (
      <span
        className={`font-display font-bold tracking-tight text-foreground ${className}`}
      >
        TCC
      </span>
    );
  }

  const isLight = resolvedTheme === "light";

  // The logo file is pure white. On light backgrounds, prefer a dedicated
  // dark version (public/brand/logo-dark.png); until one is added, darken
  // the white logo with a filter so it stays visible.
  if (isLight && !darkVariantFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/brand/logo-dark.png"
        alt="The Communion Center"
        onError={() => setDarkVariantFailed(true)}
        className={className}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/logo.png"
      alt="The Communion Center"
      onError={() => setFailed(true)}
      className={className}
      style={isLight ? { filter: "brightness(0)" } : undefined}
    />
  );
}
