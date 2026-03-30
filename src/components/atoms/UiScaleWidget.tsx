"use client"

import { useUiScale } from "@/shared/providers/UiScaleProvider"

export function UiScaleWidget() {
  const { uiScale, increase, decrease } = useUiScale()

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={decrease}
        disabled={uiScale <= 80}
        className="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs"
        aria-label="Decrease font size"
      >
        A−
      </button>
      <span className="text-xs text-muted-foreground tabular-nums w-8 text-center select-none">
        {uiScale}%
      </span>
      <button
        type="button"
        onClick={increase}
        disabled={uiScale >= 120}
        className="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs"
        aria-label="Increase font size"
      >
        A+
      </button>
    </div>
  )
}
