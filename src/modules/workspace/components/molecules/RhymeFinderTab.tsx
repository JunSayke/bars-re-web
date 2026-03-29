"use client"

import { useState } from "react"
import { useRhymeQuery } from "../../hooks/useRhymeQuery"
import type { RhymeCandidate } from "../../types/thesaurus.types"

const RHYME_TYPE_ORDER = ["perfect", "family", "additive", "assonance"] as const

interface RhymeFinderTabProps {
  onSelectWord: (word: string) => void
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="h-3 w-1/4 rounded bg-muted" />
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-6 w-16 rounded-full bg-muted" />
        ))}
      </div>
      <div className="h-3 w-1/4 rounded bg-muted mt-2" />
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-6 w-14 rounded-full bg-muted" />
        ))}
      </div>
    </div>
  )
}

function RhymeChip({ word, onClick }: { word: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground hover:bg-purple-500/20 hover:text-purple-400 transition-colors cursor-pointer"
    >
      {word}
    </button>
  )
}

function ChipGroup({
  rhymeType,
  candidates,
  onSelect,
}: {
  rhymeType: string
  candidates: RhymeCandidate[]
  onSelect: (word: string) => void
}) {
  const unique = candidates.filter(
    (c, i, arr) => arr.findIndex((x) => x.word === c.word) === i,
  )
  if (unique.length === 0) return null
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
        {rhymeType}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {unique.map((c) => (
          <RhymeChip key={c.word} word={c.word} onClick={() => onSelect(c.word)} />
        ))}
      </div>
    </div>
  )
}

export function RhymeFinderTab({ onSelectWord }: RhymeFinderTabProps) {
  const [inputValue, setInputValue] = useState("")
  const [submittedTerm, setSubmittedTerm] = useState("")

  const { result, isLoading, isError, refetch } = useRhymeQuery(submittedTerm)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed) return
    setSubmittedTerm(trimmed)
  }

  const candidates = result?.candidates ?? []
  const hasNoResults =
    !isLoading && !isError && submittedTerm && candidates.length === 0

  return (
    <div className="flex flex-col gap-4 h-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
        <label htmlFor="rhyme-query" className="text-xs font-medium text-muted-foreground">
          Query
        </label>
        <input
          id="rhyme-query"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter Bisaya term…"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          autoComplete="off"
        />
      </form>

      <div className="flex-1 overflow-y-auto">
        {isLoading && <LoadingSkeleton />}

        {isError && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-destructive">
              Something went wrong. Please try again.
            </p>
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
            No rhymes found for &ldquo;{submittedTerm}&rdquo;.
          </p>
        )}

        {!isLoading && !isError && candidates.length > 0 && (
          <div className="flex flex-col gap-4">
            {RHYME_TYPE_ORDER.map((type) => {
              const group = candidates.filter((c) => c.rhymeType === type)
              return (
                <ChipGroup
                  key={type}
                  rhymeType={type}
                  candidates={group}
                  onSelect={onSelectWord}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
