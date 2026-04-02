"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/shared/config/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Auth params in the URL mean Supabase is about to exchange a code or process a hash token.
    // We must NOT act on INITIAL_SESSION in this case — it carries any pre-existing session from
    // before the link was clicked, which would incorrectly redirect a recovery link to /workspaces.
    const searchParams = new URLSearchParams(window.location.search)
    const hashParams = new URLSearchParams(window.location.hash.slice(1))
    const hasAuthParams =
      searchParams.has("code") || window.location.hash.length > 1
    // URL-level recovery signal set by forgotPassword's redirectTo param.
    // Acts as a fallback for PKCE flows where PASSWORD_RECOVERY may fire as SIGNED_IN.
    const isRecoveryUrl =
      searchParams.get("type") === "recovery" || hashParams.get("type") === "recovery"

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && isRecoveryUrl)) {
        router.replace("/reset?recovery=1")
      } else if (event === "INITIAL_SESSION") {
        // When auth params are present, wait for the real event (SIGNED_IN / PASSWORD_RECOVERY)
        // that fires after Supabase processes the URL. When absent (direct visit), use the
        // current session to decide where to go.
        if (!hasAuthParams) {
          router.replace(session ? "/workspaces" : "/login")
        }
      } else if (event === "SIGNED_IN" && session) {
        router.replace("/workspaces")
      } else if (!session) {
        router.replace("/login")
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground text-sm">Signing in…</p>
    </div>
  )
}
