"use client"

import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { useSynonymQuery } from "../../hooks/useSynonymQuery"
import type { SynonymEntry } from "../../types/thesaurus.types"

interface SynonymFinderTabProps {
  onSelectWord: (word: string) => void
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-3 w-1/3 rounded bg-muted mb-3" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ResultsTable({
  entries,
  onSelect,
}: {
  entries: SynonymEntry[]
  onSelect: (word: string) => void
}) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border">
          <th className="pb-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Word
          </th>
          <th className="pb-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Category
          </th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, i) => (
          <tr key={i} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
            <td className="py-1.5 pr-4">
              <button
                type="button"
                onClick={() => onSelect(entry.word)}
                className="text-purple-400 hover:text-purple-300 hover:underline cursor-pointer text-left"
              >
                {entry.word}
              </button>
            </td>
            <td className="py-1.5 text-muted-foreground">
              {entry.pos?.toUpperCase() ?? "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function SynonymFinderTab({ onSelectWord }: SynonymFinderTabProps) {
  const [inputValue, setInputValue] = useState("")
  const [submittedTerm, setSubmittedTerm] = useState("")

  const { result, isLoading, isError, refetch } = useSynonymQuery(submittedTerm)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed) return
    setSubmittedTerm(trimmed)
  }

  const entries = result?.synonyms ?? []
  const hasNoResults = !isLoading && !isError && submittedTerm && entries.length === 0

  return (
    <div className="flex flex-col gap-4 h-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
        <label htmlFor="synonym-query" className="text-xs font-medium text-muted-foreground">
          Query
        </label>
        <div className="flex gap-2">
          <input
            id="synonym-query"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter Bisaya term…"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Search"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Results</p>
        {isLoading && <LoadingSkeleton />}

        {isError && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-destructive">Something went wrong. Please try again.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="self-start text-xs text-muted-foreground underline hover:text-foreground transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {hasNoResults && (
          <p className="text-xs text-muted-foreground italic">
            No synonyms found for &ldquo;{submittedTerm}&rdquo;.
          </p>
        )}

        {!isLoading && !isError && entries.length > 0 && (
          <ResultsTable entries={entries} onSelect={onSelectWord} />
        )}
      </div>
    </div>
  )
}
