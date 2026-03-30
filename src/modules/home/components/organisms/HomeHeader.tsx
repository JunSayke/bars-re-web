import { HomeAuthLink } from "../atoms/HomeAuthLink";

export function HomeHeader() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-center px-8 h-16 w-full">
        <div className="text-2xl font-black tracking-tighter text-primary uppercase">
          BARS
        </div>

        <div className="flex items-center gap-6">
          <HomeAuthLink className="performance-gradient text-white px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-wider active:scale-95 transition-all">
            Start Writing
          </HomeAuthLink>
        </div>
      </div>
    </header>
  );
}
