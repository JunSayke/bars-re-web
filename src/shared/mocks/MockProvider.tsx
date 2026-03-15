"use client"

import { useEffect, useRef } from "react"

export function MockProvider({ children }: { children: React.ReactNode }) {
  const started = useRef(false)

  useEffect(() => {
    if (started.current || process.env.NEXT_PUBLIC_API_MOCKING !== "enabled") return
    started.current = true
    import("./index").then(({ startMocking }) => startMocking())
  }, [])

  return <>{children}</>
}
