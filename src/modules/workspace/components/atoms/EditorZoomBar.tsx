interface EditorZoomBarProps {
  zoomLevel: number
  onZoomIn: () => void
  onZoomOut: () => void
}

export function EditorZoomBar({ zoomLevel, onZoomIn, onZoomOut }: EditorZoomBarProps) {
  return (
    <div className="flex items-center justify-start gap-1 px-4 py-1.5 border-t border-border/40 bg-card/60">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wide mr-1 select-none">
        Bars zoom
      </span>
      <button
        type="button"
        onClick={onZoomOut}
        disabled={zoomLevel <= 50}
        className="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
        aria-label="Zoom out bars editor"
      >
        −
      </button>
      <span className="text-xs text-muted-foreground tabular-nums w-10 text-center select-none">
        {zoomLevel}%
      </span>
      <button
        type="button"
        onClick={onZoomIn}
        disabled={zoomLevel >= 200}
        className="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
        aria-label="Zoom in bars editor"
      >
        +
      </button>
    </div>
  )
}
