"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { WordLookupResult } from "../../types/thesaurus.types"
import { HomonymChip } from "./HomonymChip"

interface WordResultCardProps {
  result: WordLookupResult
  onHomonymClick: (word: string) => void
}

function SectionToggle({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-1"
      >
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        {title}
      </button>
      {open && <div className="pl-1">{children}</div>}
    </div>
  )
}

export function WordResultCard({ result, onHomonymClick }: WordResultCardProps) {
  const hasExamples = result.examples.length > 0
  const hasSuggestedWords = result.suggestedWords.length > 0
  const hasHomonyms = result.homonyms.length > 0

  return (
    <div className="rounded-md border border-border bg-card p-3 flex flex-col gap-3">
      <p className="text-base font-bold text-foreground">{result.word}</p>

      <SectionToggle title="Definition">
        <ul className="flex flex-col gap-1">
          {result.definitions.map((def, i) => (
            <li key={i} className="text-xs text-muted-foreground leading-relaxed">
              {def}
            </li>
          ))}
          {result.definitions.length === 0 && (
            <li className="text-xs text-muted-foreground italic">No definitions found.</li>
          )}
        </ul>
      </SectionToggle>

      {hasExamples && (
        <SectionToggle title="Examples">
          <ul className="flex flex-col gap-2">
            {result.examples.map((ex, i) => (
              <li key={i} className="flex flex-col gap-0.5">
                <span className="text-xs text-foreground leading-relaxed">{ex.cebuano}</span>
                <span className="text-xs text-muted-foreground leading-relaxed italic">{ex.english}</span>
              </li>
            ))}
          </ul>
        </SectionToggle>
      )}

      {hasSuggestedWords && (
        <SectionToggle title="Suggested Words">
          <ul className="flex flex-col gap-0.5">
            {result.suggestedWords.map((s, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => onHomonymClick(s.word)}
                  className="w-full text-left text-xs text-foreground px-1 py-0.5 rounded hover:bg-muted transition-colors cursor-pointer"
                >
                  {s.word}
                </button>
              </li>
            ))}
          </ul>
        </SectionToggle>
      )}

      {hasHomonyms && !hasSuggestedWords && (
        <SectionToggle title="Homonyms">
          <div className="flex flex-wrap gap-1.5">
            {result.homonyms.map((h, i) => (
              <HomonymChip key={i} word={h.word} onClick={onHomonymClick} />
            ))}
          </div>
        </SectionToggle>
      )}

      <SectionToggle title="Translations">
        <ul className="flex flex-col gap-1">
          {result.translations.map((t, i) => (
            <li key={i} className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground/70">{t.language}:</span> {t.translation}
            </li>
          ))}
          {result.translations.length === 0 && (
            <li className="text-xs text-muted-foreground italic">No translations found.</li>
          )}
        </ul>
      </SectionToggle>
    </div>
  )
}
