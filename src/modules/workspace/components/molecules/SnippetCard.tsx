import { Button } from "@/components/ui/button"
import type { Snippet } from "../../types/snippet.types"
import { SnippetTagBadge } from "../atoms/SnippetTagBadge"

interface SnippetCardProps {
  snippet: Snippet
  onInsert: (snippet: Snippet) => void
  onEdit: (snippet: Snippet) => void
  onDelete: (snippet: Snippet) => void
}

export function SnippetCard({ snippet, onInsert, onEdit, onDelete }: SnippetCardProps) {
  const previewLines = snippet.content.split("\n").filter(Boolean).slice(0, 2)

  return (
    <div className="rounded-md border border-border bg-card p-3 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <span
          className="text-sm font-semibold text-foreground leading-tight cursor-pointer hover:underline"
          onClick={() => onEdit(snippet)}
        >
          {snippet.title}
        </span>
        <div className="flex gap-1 flex-shrink-0">
          {snippet.tags.map((tag) => (
            <SnippetTagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {previewLines.length > 0 ? (
          previewLines.map((line, i) => (
            <div
              key={i}
              className="h-4 rounded text-xs text-muted-foreground truncate"
              style={{ maxWidth: i === 0 ? "90%" : "70%" }}
            >
              {line}
            </div>
          ))
        ) : (
          <>
            <div className="h-3 w-[90%] rounded bg-muted" />
            <div className="h-3 w-[65%] rounded bg-muted" />
          </>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        <Button size="sm" className="flex-1 h-7 text-xs" onClick={() => onInsert(snippet)}>
          Insert
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="flex-1 h-7 text-xs"
          onClick={() => onEdit(snippet)}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 h-7 text-xs text-destructive hover:text-destructive"
          onClick={() => onDelete(snippet)}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}
