import type { ReactNode } from "react";
import kspEmblem from "@/assets/ksp-emblem.png";

/** Shared branded shell for all authentication screens. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-60" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "var(--gradient-glow)" }}
      />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src={kspEmblem}
            alt="Karnataka State Police emblem"
            className="mb-4 h-20 w-20 drop-shadow-[0_0_24px_rgba(66,165,245,0.45)]"
          />
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Karnataka State Police
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="glass rounded-2xl p-6 shadow-elegant sm:p-8">{children}</div>

        {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}

        <p className="mt-8 text-center text-xs text-muted-foreground/70">
          Crime Intelligence &amp; Analytical Platform · Authorized personnel only
        </p>
      </div>
    </div>
  );
}
