import { FileText, AudioLines } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import type { ThumbnailType } from "../../schemas/workspace.schema"

interface SessionThumbnailProps {
  thumbnailType: ThumbnailType
  className?: string
}

export function SessionThumbnail({ thumbnailType, className }: SessionThumbnailProps) {
  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground",
        className
      )}
    >
      {thumbnailType === "beat-linked" ? (
        <AudioLines className="size-5" />
      ) : (
        <FileText className="size-5" />
      )}
    </div>
  )
}
