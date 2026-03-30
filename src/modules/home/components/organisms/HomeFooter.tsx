const FOOTER_LINKS = [
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Cebuano Rap Archive", href: "#" },
  { label: "API", href: "#" },
] as const;

export function HomeFooter() {
  return (
    <footer className="bg-black py-12 px-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
        <div className="text-lg font-bold text-primary">BARS</div>

        <div className="flex flex-wrap justify-center gap-8">
          {FOOTER_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-[0.6875rem] uppercase tracking-[0.05em] text-foreground/40 hover:text-primary transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="text-[0.6875rem] uppercase tracking-[0.05em] text-foreground/40">
          © 2026 BARS.
        </div>
      </div>
    </footer>
  );
}
