import { cn } from "@/shared/lib/utils"

interface WordCountIndicatorProps {
  wordCount: number
  maxWords?: number
}

export function WordCountIndicator({ wordCount, maxWords = 1000 }: WordCountIndicatorProps) {
  const isWarning = wordCount >= 800
  const isAtLimit = wordCount >= maxWords

  return (
    <span
      className={cn(
        "text-[0.75em] font-mono font-medium select-none",
        isAtLimit
          ? "text-destructive"
          : isWarning
            ? "text-amber-400"
            : "text-muted-foreground"
      )}
    >
      Words: {wordCount} / {maxWords}
    </span>
  )
}
