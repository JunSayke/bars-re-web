import Link from "next/link";
import { Logo } from "@/components/atoms/logo";

export const metadata = {
  title: "Bisaya AI Rap System - Welcome",
};

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0" />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Logo size={36} />
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link className="text-sm font-medium text-slate-400 hover:text-primary transition-colors" href="/login">Login</Link>
          <Link className="text-sm font-medium text-slate-400 hover:text-primary transition-colors" href="/about">About</Link>
        </nav>

        <button className="md:hidden text-white" aria-label="Open menu">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center w-full max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-8 md:gap-10 animate-fade-in-up">
          <div className="flex flex-col gap-4 max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Flow Freely in Bisaya.
            </h1>
            <p className="text-base md:text-lg text-slate-400 leading-relaxed font-light">
              Overcome writer's block and expand your vocabulary effortlessly. <br className="hidden md:block" />
              An all-in-one AI workspace streamlined for modern lyricists.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
            <Link href="/editor/workspace" className="group relative flex items-center justify-center gap-2 h-12 min-w-[200px] px-8 rounded-lg bg-primary hover:bg-primary/90 text-white text-base font-bold tracking-wide transition-all duration-300 shadow-[0_0_20px_-5px_rgba(91,19,236,0.5)] hover:shadow-[0_0_25px_-5px_rgba(91,19,236,0.7)] hover:-translate-y-0.5">
              <span>Enter Studio</span>
              <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full py-8 text-center">
        <p className="text-xs text-slate-500 font-normal">© 2024 Bisaya AI Rap System. Empowering creativity.</p>
      </footer>
    </div>
  );
}
