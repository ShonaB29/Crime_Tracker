import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Brain, Map, Network, ArrowRight } from "lucide-react";
import kspEmblem from "@/assets/ksp-emblem.png";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KSP Crime Intelligence & Analytical Platform" },
      {
        name: "description",
        content:
          "AI-powered crime intelligence, analytics, hotspot prediction and investigation assistance for the Karnataka State Police.",
      },
      { property: "og:title", content: "KSP Crime Intelligence Platform" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: Brain,
    title: "AI Intelligence",
    desc: "Hotspot prediction, risk scoring & anomaly detection.",
  },
  { icon: Map, title: "Geo Analytics", desc: "Interactive Karnataka crime maps & heatmaps." },
  {
    icon: Network,
    title: "Network Analysis",
    desc: "Uncover criminal associations & repeat offenders.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Role-Based",
    desc: "JWT sessions with granular access control.",
  },
];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-50" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "var(--gradient-glow)" }}
      />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <img src={kspEmblem} alt="KSP" className="h-10 w-10" />
          <span className="font-display font-bold text-foreground">KSP Intelligence</span>
        </div>
        <Link to="/auth">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6">
        <section className="flex flex-col items-center py-16 text-center sm:py-24">
          <span className="mb-5 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-accent">
            Karnataka State Police
          </span>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight text-foreground sm:text-6xl">
            Crime Intelligence &amp; Analytical Platform
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Transform isolated records into actionable intelligence with AI-powered analytics, crime
            prediction, hotspot detection, and investigation assistance.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/auth" search={{ mode: "register" }}>
              <Button size="lg">
                Request Access <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline">
                Officer Sign In
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-5 pb-24 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-accent">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
