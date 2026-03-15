export function SignupBrandPanel() {
  return (
    <div className="flex h-full w-full flex-col justify-between bg-accent p-10">
      {/* Logo / App name */}
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground text-sm">
          B
        </div>
        <span className="text-lg font-bold tracking-tight text-foreground">
          Bisaya AI Rap System
        </span>
      </div>

      {/* Waveform illustration */}
      <div className="flex flex-col items-center gap-8">
        <svg
          viewBox="0 0 200 80"
          className="w-full max-w-xs text-primary opacity-80"
          aria-hidden
        >
          {[4, 12, 8, 20, 35, 50, 40, 60, 45, 55, 38, 28, 42, 30, 18, 26, 14, 10, 22, 8].map(
            (h, i) => (
              <rect
                key={i}
                x={i * 10 + 2}
                y={(80 - h) / 2}
                width={6}
                height={h}
                rx={3}
                fill="currentColor"
              />
            )
          )}
        </svg>

        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-black leading-tight tracking-tight text-foreground">
            Elevate Your Flow
            <br />
            <span className="text-primary">with AI</span>
          </h1>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Craft authentic Bisaya rap lyrics in seconds. Our AI understands
            your dialect, your rhythm, and your style.
          </p>
        </div>
      </div>

      <div className="text-xs text-muted-foreground/50 text-center">
        © {new Date().getFullYear()} Bisaya AI Rap System
      </div>
    </div>
  )
}
