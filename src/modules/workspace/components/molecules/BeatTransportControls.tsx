import { Pause, Play, SkipBack, SkipForward } from "lucide-react"

interface BeatTransportControlsProps {
  isPlaying: boolean
  disabled?: boolean
  onTogglePlay: () => void
  onSkipBack: () => void
  onSkipForward: () => void
}

export function BeatTransportControls({
  isPlaying,
  disabled,
  onTogglePlay,
  onSkipBack,
  onSkipForward,
}: BeatTransportControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onSkipBack}
        disabled={disabled}
        className="p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Skip back"
      >
        <SkipBack className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={onTogglePlay}
        disabled={disabled}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 fill-current" />
        ) : (
          <Play className="h-4 w-4 fill-current" />
        )}
      </button>

      <button
        type="button"
        onClick={onSkipForward}
        disabled={disabled}
        className="p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Skip forward"
      >
        <SkipForward className="h-4 w-4" />
      </button>
    </div>
  )
}
