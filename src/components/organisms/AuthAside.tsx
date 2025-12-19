import React from "react";

export const AuthAside: React.FC<{ variant?: 'default' | 'signup' }> = ({ variant = 'default' }) => {
  return (
    <div className="relative hidden w-0 flex-1 lg:block bg-[#0f0b18]">
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#1b1026_0%,transparent_40%),linear-gradient(90deg,#0f0b18,rgba(11,6,26,0.6))] opacity-95"></div>
        <div className="absolute inset-0 bg-linear-to-t from-[#161022] via-[#5b13ec]/20 to-[#161022]/40 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute inset-0 bg-linear-to-r from-[#161022] via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-primary/30 blur-[100px]"></div>
        {variant === 'signup' ? (
          <div className="absolute inset-0 flex items-center justify-center z-20 px-8">
            <div className="max-w-lg text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-primary/20 p-4 backdrop-blur-sm border border-primary/30">
                  <span className="material-symbols-outlined text-5xl text-white">graphic_eq</span>
                </div>
              </div>
              <h2 className="text-4xl font-black leading-tight tracking-tight text-white mb-4">Elevate Your Flow with AI</h2>
              <p className="text-base text-slate-200 font-medium leading-relaxed opacity-90">Join the community of creators redefining Bisaya rap. Let our AI handle the beat matching while you focus on the bars.</p>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 p-20 text-white z-20">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl shadow-2xl">
              <span className="flex h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
              <span className="text-xs font-semibold tracking-wide uppercase text-white/90">SYSTEM ONLINE</span>
            </div>
            <h2 className="mb-4 max-w-lg text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">Drop bars faster <br /><span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-400">powered by AI.</span></h2>
            <p className="mb-6 text-sm text-slate-300/80">Create, refine and release Bisaya bars with speed — powered by smart suggestions and structured prompts.</p>
            <div className="flex items-center gap-4 text-slate-300">
              <div className="flex -space-x-3 items-center">
                <img src="/avatars/a1.svg" alt="Artist avatar" className="inline-block h-10 w-10 rounded-full ring-2 ring-[#0f0713] border-2 border-transparent object-cover" />
                <img src="/avatars/a2.svg" alt="Artist avatar" className="inline-block h-10 w-10 rounded-full ring-2 ring-[#0f0713] border-2 border-transparent object-cover" />
                <img src="/avatars/a3.svg" alt="Artist avatar" className="inline-block h-10 w-10 rounded-full ring-2 ring-[#0f0713] border-2 border-transparent object-cover" />
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0f0713] bg-linear-to-br from-[#6b21a8] to-[#5b13ec] text-xs font-bold text-white -ml-2 z-10 shadow-lg">+2k</div>
              </div>
              <p className="text-sm font-medium">Join 2,000+ Bisaya artists today.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthAside;
