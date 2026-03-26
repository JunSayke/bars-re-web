interface BeatProgressBarProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}

export function BeatProgressBar({ currentTime, duration, onSeek }: BeatProgressBarProps) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={currentTime}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="w-28 accent-primary cursor-pointer"
        aria-label="Seek"
      />
      <span className="text-xs text-muted-foreground whitespace-nowrap tabular-nums">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  )
}
