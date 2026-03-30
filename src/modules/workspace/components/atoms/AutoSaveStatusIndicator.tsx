"use client"

import { useEffect, useState } from "react"

export type SaveStatus = "idle" | "saving" | "saved" | "error"

interface AutoSaveStatusIndicatorProps {
  status: SaveStatus
}

export function AutoSaveStatusIndicator({ status }: AutoSaveStatusIndicatorProps) {
  const [savedVisible, setSavedVisible] = useState(true)

  useEffect(() => {
    if (status !== "saved") return
    const timer = setTimeout(() => setSavedVisible(false), 2000)
    return () => {
      clearTimeout(timer)
      setSavedVisible(true)
    }
  }, [status])

  if (status === "idle" || (status === "saved" && !savedVisible)) return null

  const label =
    status === "saving"
      ? "Saving…"
      : status === "saved"
        ? "Saved"
        : "Save failed"

  const colorClass =
    status === "saving"
      ? "text-muted-foreground"
      : status === "saved"
        ? "text-green-400"
        : "text-destructive"

  return (
    <span className={`text-xs font-medium transition-opacity ${colorClass}`}>
      {label}
    </span>
  )
}
