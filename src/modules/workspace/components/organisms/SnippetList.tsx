import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SnippetSearchBar } from "../molecules/SnippetSearchBar"
import { SnippetTagFilter } from "../molecules/SnippetTagFilter"
import { SnippetCard } from "../molecules/SnippetCard"
import type { Snippet, SnippetTag } from "../../types/snippet.types"

const MAX_SNIPPETS = 200

type TagFilterValue = SnippetTag | "All"

interface SnippetListProps {
  snippets: Snippet[]
  isLoading: boolean
  onInsert: (snippet: Snippet) => void
  onEdit: (snippet: Snippet) => void
  onDelete: (snippet: Snippet) => void
  onNew: () => void
}

export function SnippetList({
  snippets,
  isLoading,
  onInsert,
  onEdit,
  onDelete,
  onNew,
}: SnippetListProps) {
  const [searchInput, setSearchInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTag, setActiveTag] = useState<TagFilterValue>("All")

  const filtered = snippets.filter((s) => {
    const matchesTag = activeTag === "All" || s.tags.includes(activeTag as SnippetTag)
    const matchesSearch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTag && matchesSearch
  })

  return (
    <div className="flex flex-col gap-3 h-full">
      <SnippetSearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSearch={() => setSearchQuery(searchInput)}
      />
      <SnippetTagFilter activeTag={activeTag} onTagChange={setActiveTag} />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{snippets.length} / {MAX_SNIPPETS} snippets</span>
        <span>{filtered.length} shown</span>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-2 min-h-0">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-md bg-secondary/60 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
            <p className="text-sm text-muted-foreground">No snippets found.</p>
            {snippets.length === 0 && (
              <p className="text-xs text-muted-foreground">Create your first snippet below.</p>
            )}
          </div>
        ) : (
          filtered.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              onInsert={onInsert}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {snippets.length >= MAX_SNIPPETS && (
        <p className="text-xs text-destructive text-center">
          You have reached the maximum limit of 200 snippets.
        </p>
      )}
      <Button
        className="w-full mt-auto"
        variant="outline"
        onClick={onNew}
        disabled={snippets.length >= MAX_SNIPPETS}
      >
        + New Snippet
      </Button>
    </div>
  )
}
