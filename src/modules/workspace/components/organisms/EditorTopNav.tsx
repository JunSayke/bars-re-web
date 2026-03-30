import Link from "next/link"
import { UiScaleWidget } from "@/components/atoms/UiScaleWidget"

interface EditorTopNavProps {
  sessionTitle: string
}

export function EditorTopNav({ sessionTitle }: EditorTopNavProps) {
  return (
    <header className="flex items-center gap-4 px-6 py-3 border-b border-border/40 bg-card">
      <Link
        href="/workspaces"
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
      >
        <span className="text-sm">←</span>
        <span>Back to Library</span>
      </Link>

      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-foreground truncate">{sessionTitle}</h1>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <UiScaleWidget />
        <div className="w-px h-4 bg-border/60" />
        <Link
          href="/settings/profile"
          className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="Session settings"
        >
          <span className="material-symbols-outlined text-base" aria-hidden>
            settings
          </span>
        </Link>
      </div>
    </header>
  )
}
