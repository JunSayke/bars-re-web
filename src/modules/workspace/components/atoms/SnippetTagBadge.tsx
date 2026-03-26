import type { SnippetTag } from "../../types/snippet.types"

interface SnippetTagBadgeProps {
  tag: SnippetTag
}

export function SnippetTagBadge({ tag }: SnippetTagBadgeProps) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
    >
      {tag}
    </span>
  )
}
