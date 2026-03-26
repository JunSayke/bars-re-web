import { Badge } from "@/components/ui/badge"

interface TopicBadgeProps {
  topic: string
}

export function TopicBadge({ topic }: TopicBadgeProps) {
  return (
    <Badge variant="outline" className="text-xs uppercase tracking-wider text-muted-foreground">
      {topic}
    </Badge>
  )
}
