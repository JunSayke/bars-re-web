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

      <SectionToggle title="Homonyms">
        {result.homonyms.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {result.homonyms.map((h, i) => (
              <HomonymChip key={i} word={h.word} onClick={onHomonymClick} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">No homonyms found.</p>
        )}
      </SectionToggle>

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
