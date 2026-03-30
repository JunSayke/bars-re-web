"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/shared/config/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/workspaces")
      } else {
        router.replace("/login")
      }
    })
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground text-sm">Signing in…</p>
    </div>
  )
}
