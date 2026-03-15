import { Badge } from "@/components/ui/badge"

const AVATAR_INITIALS = ["BA", "RC", "DJ", "MG", "KL"]

export function LoginBrandPanel() {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-accent p-10">
      {/* Gradient overlay simulating studio photo */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background/60 to-background/90" />

      {/* Content */}
      <div className="relative flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground text-sm">
          B
        </div>
        <span className="text-lg font-bold tracking-tight text-foreground">BARS</span>
      </div>

      <div className="relative space-y-6">
        <Badge
          variant="secondary"
          className="w-fit gap-1.5 border border-primary/30 bg-primary/10 text-primary"
        >
          <span className="size-1.5 rounded-full bg-primary animate-pulse inline-block" />
          SYSTEM ONLINE
        </Badge>

        <div className="space-y-2">
          <h1 className="text-4xl font-black leading-tight tracking-tight text-foreground">
            Drop bars faster
            <br />
            <span className="text-primary">powered by AI.</span>
          </h1>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {AVATAR_INITIALS.map((initials) => (
              <div
                key={initials}
                className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-bold text-primary-foreground"
              >
                {initials}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Join <span className="font-semibold text-foreground">2,000+</span> Bisaya artists today.
          </p>
        </div>
      </div>
    </div>
  )
}
