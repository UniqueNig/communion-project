import type { Metadata } from "next";
import { Sun, ShieldCheck, Sparkles, Radio, PiggyBank, Phone } from "lucide-react";
import { getCampaignProgress } from "@/lib/campaignProgress";
import { Logo } from "@/components/campaign/Logo";
import { CampaignImage } from "@/components/campaign/CampaignImage";
import { GiveSection } from "@/components/campaign/GiveSection";
import { Reveal } from "@/components/campaign/Reveal";
import { ThemeToggle } from "@/components/campaign/ThemeToggle";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Solar & Media Upgrade Project | The Communion Center",
  description:
    "Help TCC move from generator dependency to solar power, and upgrade our worship & media equipment. Partner with us today.",
};

const WHY_IT_MATTERS = [
  {
    icon: Sun,
    title: "Sustainability",
    body: "Solar eliminates our dependence on fuel and reduces long-term operating costs.",
  },
  {
    icon: ShieldCheck,
    title: "Reliability",
    body: "No more power cuts in the middle of a service or event.",
  },
  {
    icon: Sparkles,
    title: "Excellence in worship",
    body: "Upgraded music and media equipment elevates the quality of our sound and visual ministry.",
  },
  {
    icon: Radio,
    title: "Wider reach",
    body: "Better media equipment strengthens our ability to reach people beyond the four walls of TCC, through livestreams, recordings, and digital content.",
  },
  {
    icon: PiggyBank,
    title: "Stewardship",
    body: "This is a one-time investment that pays for itself over time by cutting recurring generator/fuel costs.",
  },
];

const CONTACTS = [
  { name: "Pastor Ikagwu Joe", phone: "0803 450 8212" },
  { name: "Ariyo Anuoluwapo", phone: "0802 501 5699" },
];

export default async function SolarMediaPage() {
  const progress = await getCampaignProgress();

  return (
    <div className="bg-background text-foreground">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-foreground/5 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Logo className="h-8 w-auto" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#give"
              className="rounded-full bg-linear-to-r from-gold-500 to-gold-600 px-5 py-2 text-sm font-semibold text-charcoal-950 hover:opacity-90 transition-opacity"
            >
              Give Now
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-mesh-dawn pt-24">
        <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="mb-4 inline-block rounded-full border border-foreground/15 px-4 py-1.5 text-xs tracking-widest uppercase text-accent-ink">
              Partnership Proposal
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]">
              From generator noise <br />
              to{" "}
              <span className="text-gradient-gold">solar light</span>.
            </h1>
            <p className="mt-6 text-lg text-foreground/70 max-w-lg">
              We&apos;re moving The Communion Center from generator dependency
              to solar power, and upgrading the worship &amp; media equipment
              that carries our message to the world. Help us carry this
              vision.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#give"
                className="rounded-full bg-linear-to-r from-gold-500 via-gold-600 to-violet-500 px-7 py-3.5 font-display font-semibold text-charcoal-950"
              >
                Partner With Us
              </a>
              <a
                href="#situation"
                className="rounded-full border border-foreground/15 px-7 py-3.5 font-medium text-foreground/80 hover:border-foreground/30 transition-colors"
              >
                Read the vision
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <CampaignImage
              src="/images/campaign/hero-worship.jpeg"
              alt="TCC worship service"
              containerClassName="rounded-3xl h-[420px] w-full glass-panel"
              className="h-full w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* The Situation */}
      <section id="situation" className="mx-auto max-w-6xl px-6 py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <CampaignImage
              src="/images/campaign/generator-current.jpg"
              alt="TCC's current generator setup"
              containerClassName="rounded-3xl h-[340px] w-full glass-panel order-2 lg:order-1"
              className="h-full w-full object-cover"
            />
          </Reveal>
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              The Situation
            </h2>
            <p className="mt-5 text-foreground/70 leading-relaxed">
              For a while now, TCC has depended on generators to power our
              services, programs, and events. It&apos;s worked, but it&apos;s
              come at a cost: rising fuel prices, constant maintenance, noise
              that disrupts the sacredness of our gatherings, and the
              unpredictability that comes with generator failure right in the
              middle of worship, teaching, or a live-streamed service.
            </p>
            <p className="mt-4 text-foreground/70 leading-relaxed">
              We believe it&apos;s time for a change, one that&apos;s
              sustainable, reliable, and in step with where God is taking
              this house.
            </p>
          </Reveal>
        </div>
      </section>

      {/* The Vision */}
      <section id="vision" className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            The Vision
          </h2>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Reveal>
            <div className="glass-panel rounded-3xl p-8 h-full">
              <Sun className="text-gold-400" size={32} />
              <h3 className="mt-4 font-display text-xl font-semibold">
                Solar-Powered Lighting
              </h3>
              <p className="mt-3 text-foreground/70 leading-relaxed">
                Clean, consistent, and cost-effective energy that will power
                our building without interruption, without noise, and without
                the recurring fuel expense that eats into ministry resources
                every month.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glass-panel rounded-3xl p-8 h-full">
              <Radio className="text-violet-400" size={32} />
              <h3 className="mt-4 font-display text-xl font-semibold">
                Music &amp; Media Upgrade
              </h3>
              <p className="mt-3 text-foreground/70 leading-relaxed">
                The tools that carry our worship, our sound, and our message
                to the congregation and to the world through livestream and
                media distribution. Better equipment means clearer sound,
                stronger visuals, and a more excellent presentation of what
                God is doing among us.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            Why This Matters
          </h2>
        </Reveal>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY_IT_MATTERS.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.08}>
              <div className="glass-panel rounded-2xl p-6 h-full">
                <Icon className="text-gold-400" size={26} />
                <h3 className="mt-3 font-display font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-foreground/65 leading-relaxed">
                  {body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Give */}
      <section
        id="give"
        className="relative mx-auto max-w-6xl px-6 py-28 scroll-mt-20"
      >
        <GiveSection
          raisedNGN={progress.raisedNGN}
          goalNGN={progress.goalNGN}
          percent={progress.percent}
          usdRate={progress.usdRate}
        />
      </section>

      {/* Contact */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">
            Let&apos;s Talk
          </h2>
          <p className="mt-3 text-center text-foreground/60 max-w-xl mx-auto">
            This isn&apos;t just a fundraising appeal. It&apos;s an
            invitation to partner in something that will serve this house for
            years to come. We&apos;d love to talk with you further.
          </p>
        </Reveal>
        <div className="mt-10 grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {CONTACTS.map((c) => (
            <Reveal key={c.name}>
              <a
                href={`tel:${c.phone.replace(/\s/g, "")}`}
                className="glass-panel rounded-2xl p-6 flex items-center gap-4 hover:border-foreground/25 transition-colors"
              >
                <div className="shrink-0 rounded-full bg-gold-500/15 p-3">
                  <Phone className="text-gold-400" size={20} />
                </div>
                <div>
                  <p className="font-display font-semibold">{c.name}</p>
                  <p className="text-sm text-foreground/60">{c.phone}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-foreground/5 py-10">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo className="h-7 w-auto" />
          <p className="text-sm text-foreground/40 text-center sm:text-right">
            With gratitude for standing with us.
          </p>
        </div>
      </footer>
    </div>
  );
}
