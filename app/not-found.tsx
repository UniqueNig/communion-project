import Link from "next/link";
import { Compass } from "lucide-react";
import { Logo } from "@/components/campaign/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background bg-mesh-dawn text-foreground flex items-center justify-center px-6">
      <div className="glass-panel rounded-3xl p-10 max-w-md text-center">
        <Logo className="h-8 w-auto mx-auto mb-8" />
        <Compass className="mx-auto text-gold-400" size={48} />
        <h1 className="mt-6 font-display text-2xl font-bold">
          This page doesn&apos;t exist
        </h1>
        <p className="mt-3 text-foreground/70">
          The link you followed may be broken, or the page may have moved.
          Let&apos;s get you back to the project.
        </p>
        <Link
          href="/give/solar-media"
          className="mt-8 inline-block rounded-full bg-linear-to-r from-gold-500 to-gold-600 px-6 py-3 font-display font-semibold text-charcoal-950"
        >
          Back to the project page
        </Link>
      </div>
    </div>
  );
}
