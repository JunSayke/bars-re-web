interface SectionBadgeProps {
  syllableCount: number
  barCount: number
}

export function SectionBadge({ syllableCount, barCount }: SectionBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-mono font-medium text-muted-foreground tracking-wide select-none">
      <span>SYLLABLES: {syllableCount}</span>
      <span className="text-border">|</span>
      <span>BARS: {barCount}</span>
    </span>
  )
}
