"use client"

import React, { useEffect, useRef } from "react"

interface BarInputRowProps {
  lineNumber: number
  value: string
  onChange: (value: string) => void
  onAddAfter: () => void
  onRemove: () => void
  onPasteLines?: (lines: string[]) => void
  isRemoveDisabled: boolean
  /** When true, this input will receive focus. Used for keyboard-driven caret placement. */
  isFocused?: boolean
}

function BarInputRowBase({
  lineNumber,
  value,
  onChange,
  onAddAfter,
  onRemove,
  onPasteLines,
  isRemoveDisabled,
  isFocused,
}: BarInputRowProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // 11.4 / 11.5 / 11.6 / 11.7 — move caret to this row whenever isFocused flips to true
  useEffect(() => {
    if (isFocused) inputRef.current?.focus()
  }, [isFocused])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      onAddAfter()
    }
    // Keyboard removal respects isRemoveDisabled (spec: cannot remove the only remaining bar).
    // The × button also enforces this via its `disabled` prop.
    if (e.key === "Backspace" && value === "" && !isRemoveDisabled) {
      e.preventDefault()
      onRemove()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (!onPasteLines) return
    const pasted = e.clipboardData.getData("text")
    const lines = pasted.split("\n").map((l) => l.trimEnd()).filter((l) => l.length > 0)
    if (lines.length <= 1) return
    // Multi-line paste: suppress default and distribute across bar lines
    e.preventDefault()
    onPasteLines(lines)
  }

  return (
    <div className="flex items-center gap-2 group">
      <span className="w-6 shrink-0 text-xs font-mono text-muted-foreground select-none text-right">
        {String(lineNumber).padStart(2, "0")}
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground/50 py-1"
        placeholder="Type a bar…"
      />
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={onAddAfter}
          className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-xs"
          aria-label="Add bar after"
        >
          +
        </button>
        <button
          type="button"
          onClick={onRemove}
          disabled={isRemoveDisabled}
          className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors text-xs disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Remove bar"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export const BarInputRow = React.memo(BarInputRowBase)
