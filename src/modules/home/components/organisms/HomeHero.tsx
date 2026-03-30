import Link from "next/link";
import { ROUTES } from "@/shared/constants/routes";

export function HomeHero() {
  return (
    <section className="relative min-h-[921px] flex items-center justify-center overflow-hidden px-8">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl w-full text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-muted border border-border/20">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[0.6875rem] uppercase tracking-[0.05em] text-muted-foreground">
            Live Beta: Bisaya AI v2.4
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[3.5rem] md:text-[5.5rem] font-black leading-[0.9] tracking-[-0.04em] mb-8 uppercase">
          Drop bars faster <br />
          <span className="gradient-text">powered by AI.</span>
        </h1>

        {/* Subtext */}
        <p className="text-muted-foreground max-w-2xl mx-auto mb-12 text-lg leading-relaxed">
          Master the Cebuano flow with the first AI-driven lyrical workstation
          designed for the modern rapper. Rhyme, record, and refine in one
          unified space.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="performance-gradient text-white px-10 py-5 rounded-xl text-lg font-bold uppercase tracking-wider shadow-[0_10px_30px_rgba(139,92,246,0.3)] active:scale-95 transition-all"
          >
            Start Session
          </Link>
        </div>
      </div>
    </section>
  );
}
