import Link from "next/link";
import { ROUTES } from "@/shared/constants/routes";

export function HomeCTA() {
  return (
    <section className="py-32 px-8 relative overflow-hidden bg-background">
      {/* Background image */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPTNbiV7V2j9K9663waxc24xoLO1s6tHO4eLNil_2GRktPbfW4MwF4Q4z6r3IRzv7BFXq8xf-XyMjgRI1AjICgEGw-1swtru6tlE0rZs3s5DoO5XRj8d0XjgAaKb3YZu858SOqPN1aB0AmmsxgV94Yh8LV16ni2nX_iSS00yd2_G5IFv7GVNaoo92ASL-7lp1BsObyEhkcuUJ71BEweBeCtqbFmRs7H8ITNdjL6y_UcQeC34XphKXHDNXVoD66u0xof01Dv7JgxNmh"
          alt="Wide shot of a crowd at a dynamic underground hip-hop concert"
          className="w-full h-full object-cover grayscale"
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tight">
          Ali na!.
        </h2>
        <p className="text-xl text-muted-foreground mb-12">
          Join 1,000+ Cebuano artists rewriting the rules of the game with AI
          precision.
        </p>
        <div className="inline-block glass-card p-2 rounded-2xl border border-border/20">
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="performance-gradient text-white px-12 py-6 rounded-xl text-xl font-bold uppercase tracking-wider hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-all inline-block"
          >
            Join the Collective
          </Link>
        </div>
      </div>
    </section>
  );
}
