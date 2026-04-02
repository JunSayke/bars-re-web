"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UiScaleWidget } from "@/components/atoms/UiScaleWidget"

interface EditorTopNavProps {
  sessionTitle: string
}

export function EditorTopNav({ sessionTitle }: EditorTopNavProps) {
  const router = useRouter()
  const [navigating, setNavigating] = useState(false)

  function navigate(href: string) {
    setNavigating(true)
    router.push(href)
  }

  return (
    <>
      {navigating && <div className="fixed inset-0 z-[9999] cursor-wait" />}
      <header className="flex items-center gap-4 px-6 py-3 border-b border-border/40 bg-card">
        <button
          type="button"
          onClick={() => navigate("/workspaces")}
          disabled={navigating}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0 disabled:opacity-50 disabled:cursor-wait"
        >
          <span className="text-sm">←</span>
          <span>Back to Library</span>
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-foreground truncate">{sessionTitle}</h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <UiScaleWidget />
          <div className="w-px h-4 bg-border/60" />
          <button
            type="button"
            onClick={() => navigate("/settings/profile")}
            disabled={navigating}
            className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-wait"
            aria-label="Session settings"
          >
            <span className="material-symbols-outlined text-base" aria-hidden>
              settings
            </span>
          </button>
        </div>
      </header>
    </>
  )
}
