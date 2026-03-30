// @module: auth
// @layer: hook
// @scope: module
// @deps: @/shared/config/supabase.browser, @/shared/constants/routes, auth.types.ts

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseBrowserClient } from "@/shared/config/supabase.browser"

const supabase = createSupabaseBrowserClient()
import { ROUTES } from "@/shared/constants/routes"
import type { AuthUser } from "../types/auth.types"

export function useAuthSession() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          accessToken: session.access_token,
        })
      }
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email ?? "",
            accessToken: session.access_token,
          })
        } else {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    router.push(ROUTES.AUTH.LOGIN)
  }

  return { user, isLoading, signOut }
}
