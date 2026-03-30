import type { MouseEvent } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/shared/lib/utils"

interface TopicBadgeProps {
  topic: string
  expanded?: boolean
  onToggle?: (e: MouseEvent) => void
}

export function TopicBadge({ topic, expanded = false, onToggle }: TopicBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded text-xs uppercase tracking-wider text-muted-foreground",
        onToggle && "cursor-pointer select-none hover:bg-accent",
        !expanded && "max-w-[180px] overflow-hidden text-ellipsis",
        expanded && "whitespace-normal break-all",
      )}
      onClick={onToggle}
      title={!expanded ? topic : undefined}
    >
      {topic}
    </Badge>
  )
}
