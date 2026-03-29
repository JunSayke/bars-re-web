"use client"

import { useState, useEffect } from "react"
import { Diamond } from "lucide-react"
import { useWordLookupQuery } from "../../hooks/useWordLookupQuery"
import { WordResultCard } from "../atoms/WordResultCard"

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="h-5 w-1/3 rounded bg-muted" />
      <div className="h-3 w-full rounded bg-muted" />
      <div className="h-3 w-5/6 rounded bg-muted" />
      <div className="flex gap-2 mt-1">
        <div className="h-5 w-14 rounded-full bg-muted" />
        <div className="h-5 w-16 rounded-full bg-muted" />
      </div>
      <div className="h-3 w-2/3 rounded bg-muted" />
    </div>
  )
}

interface WordLookupTabProps {
  initialTerm?: string
}

export function WordLookupTab({ initialTerm }: WordLookupTabProps) {
  const [inputValue, setInputValue] = useState("")
  const [submittedTerm, setSubmittedTerm] = useState("")

  useEffect(() => {
    if (initialTerm) {
      setInputValue(initialTerm)
      setSubmittedTerm(initialTerm)
    }
  }, [initialTerm])

  const { result, isLoading, isError } = useWordLookupQuery(submittedTerm)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed) return
    setSubmittedTerm(trimmed)
  }

  const handleHomonymClick = (word: string) => {
    setInputValue(word)
    setSubmittedTerm(word)
  }

  const hasNoResults =
    !isLoading &&
    !isError &&
    submittedTerm &&
    result !== null &&
    result.definitions.length === 0 &&
    result.homonyms.length === 0 &&
    result.translations.length === 0 &&
    result.suggestedWords.length === 0

  return (
    <div className="flex flex-col gap-4 h-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
        <label htmlFor="thesaurus-query" className="text-xs font-medium text-muted-foreground">
          Query
        </label>
        <input
          id="thesaurus-query"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter Bisaya term…"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          autoComplete="off"
        />
      </form>

      <div className="flex-1 overflow-y-auto relative">
        {isLoading && <LoadingSkeleton />}

        {isError && (
          <p className="text-xs text-destructive">
            Something went wrong. Please try again.
          </p>
        )}

        {hasNoResults && (
          <p className="text-xs text-muted-foreground italic">
            No results found for &ldquo;{submittedTerm}&rdquo;.
          </p>
        )}

        {!isLoading && !isError && result && !hasNoResults && (
          <div className="relative">
            <WordResultCard result={result} onHomonymClick={handleHomonymClick} />
            <button
              type="button"
              onClick={() => {/* navigate stub */}}
              aria-label="Navigate to tool"
              className="absolute bottom-3 right-3 p-1.5 rounded text-purple-500 hover:bg-purple-500/10 transition-colors cursor-pointer"
            >
              <Diamond className="w-4 h-4 fill-purple-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
