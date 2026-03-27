import Link from "next/link"

interface EditorTopNavProps {
  sessionTitle: string
  onSettingsClick?: () => void
}

export function EditorTopNav({ sessionTitle, onSettingsClick }: EditorTopNavProps) {
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
        <button
          type="button"
          onClick={onSettingsClick}
          className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="Session settings"
        >
          <span className="material-symbols-outlined text-base" aria-hidden>
            settings
          </span>
        </button>
      </div>
    </header>
  )
}
