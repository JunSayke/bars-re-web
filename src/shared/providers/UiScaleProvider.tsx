"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

const LS_KEY = "bars:uiScale"
const MIN = 80
const MAX = 120
const STEP = 5

interface UiScaleContextValue {
  uiScale: number
  increase: () => void
  decrease: () => void
}

const UiScaleContext = createContext<UiScaleContextValue>({
  uiScale: 100,
  increase: () => {},
  decrease: () => {},
})

export function useUiScale() {
  return useContext(UiScaleContext)
}

export function UiScaleProvider({ children }: { children: ReactNode }) {
  const [uiScale, setUiScale] = useState<number>(100)

  // Hydrate from localStorage after mount (SSR-safe)
  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY)
    if (stored !== null) {
      const parsed = parseInt(stored, 10)
      if (!isNaN(parsed)) setUiScale(Math.min(MAX, Math.max(MIN, parsed)))
    }
  }, [])

  // Persist on change
  useEffect(() => {
    localStorage.setItem(LS_KEY, String(uiScale))
  }, [uiScale])

  // Drive the HTML root font-size so all rem-based Tailwind classes scale globally
  useEffect(() => {
    document.documentElement.style.fontSize = `${uiScale}%`
  }, [uiScale])

  const increase = () => setUiScale((prev) => Math.min(prev + STEP, MAX))
  const decrease = () => setUiScale((prev) => Math.max(prev - STEP, MIN))

  return (
    <UiScaleContext.Provider value={{ uiScale, increase, decrease }}>
      {children}
    </UiScaleContext.Provider>
  )
}
