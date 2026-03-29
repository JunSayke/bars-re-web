export function HomeBentoGrid() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Zen Mode Workspace — col-span-8 */}
        <div className="md:col-span-8 group relative overflow-hidden rounded-xl bg-card p-10 flex flex-col justify-between min-h-[500px]">
          <div className="relative z-10">
            <span className="text-[0.6875rem] uppercase tracking-[0.05em] text-primary mb-4 block">
              Immersive Design
            </span>
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Zen Mode Workspace
            </h3>
            <p className="text-muted-foreground max-w-md">
              Eliminate distractions. A minimalist canvas that evolves with your
              rhythm, highlighting active punchlines while dimming the noise.
            </p>
          </div>
          <div className="mt-12 relative h-full">
            <div className="glass-card rounded-xl border border-border/20 p-6 absolute inset-0 transform translate-y-8 group-hover:translate-y-4 transition-transform duration-500">
              <div className="space-y-4">
                <div className="h-6 w-3/4 bg-primary/20 rounded" />
                <div className="h-8 w-full bg-primary/40 rounded" />
                <div className="h-6 w-1/2 bg-primary/20 rounded" />
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPdcwDbShJG18cEDSrLxzZ8yY8Qnrr76zndu2yS7W3zGbLIrGEoO84tlLQakScN9emLRefNaeb6QaHz4_wn_I2wIQg_53NxS811tJFKIUARuGl9liouSNyNWQ3CNh2xP2no7xJOUz2a0tdzqWUbNjE2Fz6UQ_SgmfrMf_VlSPoji1SBAK29M4wo9tTe1l00VUlXr97CRgfKsfPgC0m_-e1-c4eE3w9GGXd-72TXMYkpBknBvTiwhbY"
              alt="Futuristic music production workspace with minimalist dark neon lighting"
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity"
            />
          </div>
        </div>

        {/* AI Assistant — col-span-4 */}
        <div className="md:col-span-4 group overflow-hidden rounded-xl bg-muted p-8 flex flex-col justify-end relative">
          <div className="absolute top-0 right-0 p-8">
            <div className="w-16 h-16 rounded-full performance-gradient flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-3xl text-white">
                auto_awesome
              </span>
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              AI Assistant
            </h3>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Real-time feedback on syllable counts, internal rhymes, and
              emotional delivery for every bar you drop.
            </p>
          </div>
        </div>

        {/* Rhyme & Wordplay — col-span-4 */}
        <div className="md:col-span-4 group overflow-hidden rounded-xl bg-background border border-border/10 p-8 flex flex-col relative">
          <div className="mb-auto">
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-card text-primary text-[0.6875rem] font-bold uppercase tracking-tighter">
                Gugma
              </span>
              <span className="px-3 py-1 rounded-full bg-card text-secondary-foreground text-[0.6875rem] font-bold uppercase tracking-tighter">
                Gahum
              </span>
              <span className="px-3 py-1 rounded-full bg-card text-muted-foreground text-[0.6875rem] font-bold uppercase tracking-tighter">
                Gubat
              </span>
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Rhyme &amp; Wordplay
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The deepest Bisaya thesaurus ever built. Synonyms, anagrams, and
              metaphors tailored for street-slang and deep literary Bisaya.
            </p>
          </div>
        </div>

        {/* Library Management — col-span-8 */}
        <div className="md:col-span-8 group overflow-hidden rounded-xl bg-card p-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="text-[0.6875rem] uppercase tracking-[0.05em] text-muted-foreground mb-4 block">
              Archives
            </span>
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Library Management
            </h3>
            <p className="text-muted-foreground mb-6">
              Never lose a freestyle. Auto-organized version control for every
              draft and instant access to your recorded session history.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[
                  { icon: "folder" },
                  { icon: "mic" },
                  { icon: "history" },
                ].map(({ icon }) => (
                  <div
                    key={icon}
                    className="w-10 h-10 rounded-full border-2 border-card bg-secondary flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-sm text-foreground">
                      {icon}
                    </span>
                  </div>
                ))}
              </div>
              <span className="text-[0.6875rem] text-muted-foreground uppercase">
                3,240 tracks archived
              </span>
            </div>
          </div>

          <div className="w-full md:w-1/2 glass-card rounded-xl p-4 border border-border/10 shadow-2xl">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded bg-muted/40">
                <span className="text-xs font-mono opacity-60">
                  v3.final_mix
                </span>
                <span className="material-symbols-outlined text-sm text-primary">
                  check_circle
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded bg-muted/20">
                <span className="text-xs font-mono opacity-60">
                  freestyle_session_44
                </span>
                <span className="material-symbols-outlined text-sm opacity-40">
                  more_horiz
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded bg-muted/20">
                <span className="text-xs font-mono opacity-60">
                  draft_bars_cebu
                </span>
                <span className="material-symbols-outlined text-sm opacity-40">
                  lock
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
