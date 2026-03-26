import { cn } from "@/shared/lib/utils"
import type { SnippetTag } from "../../types/snippet.types"

const ALL_TAGS = ["All", "Chorus", "Verse", "Hook", "Freestyle", "Bridge"] as const
type TagFilterValue = SnippetTag | "All"

interface SnippetTagFilterProps {
  activeTag: TagFilterValue
  onTagChange: (tag: TagFilterValue) => void
}

export function SnippetTagFilter({ activeTag, onTagChange }: SnippetTagFilterProps) {
  return (
    <div className="flex gap-1 flex-wrap">
      {ALL_TAGS.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onTagChange(tag as TagFilterValue)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
            activeTag === tag
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
