import { Progress } from "@/components/ui/progress"

const MAX_SESSIONS = 100

interface SessionCountBarProps {
  count: number
}

export function SessionCountBar({ count }: SessionCountBarProps) {
  const percentage = Math.min((count / MAX_SESSIONS) * 100, 100)

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
        {count}/{MAX_SESSIONS} Sessions
      </span>
      <Progress value={percentage} className="h-1.5" />
    </div>
  )
}
