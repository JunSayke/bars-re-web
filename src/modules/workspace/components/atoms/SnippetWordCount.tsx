import { cn } from "@/shared/lib/utils"

interface SnippetWordCountProps {
  count: number
}

const MAX_WORDS = 200
const WARNING_THRESHOLD = 180

export function SnippetWordCount({ count }: SnippetWordCountProps) {
  const isWarning = count >= WARNING_THRESHOLD
  const isAtLimit = count >= MAX_WORDS

  return (
    <span
      className={cn(
        "text-xs font-mono font-medium select-none",
        isAtLimit
          ? "text-destructive"
          : isWarning
            ? "text-amber-400"
            : "text-muted-foreground"
      )}
    >
      {count} / {MAX_WORDS} words
    </span>
  )
}
