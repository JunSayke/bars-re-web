import { Music } from "lucide-react"

interface BpmBadgeProps {
  bpm: number
}

export function BpmBadge({ bpm }: BpmBadgeProps) {
  return (
    <div className="flex items-center gap-1 text-primary text-xs font-semibold">
      <Music className="h-3.5 w-3.5" />
      <span>{bpm} BPM</span>
    </div>
  )
}
