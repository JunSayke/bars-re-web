// @module: app
// @layer: proxy
// @scope: global
// @deps: @supabase/ssr, next/server, @/shared/constants/routes

import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { ROUTES } from "@/shared/constants/routes"

// ── Route classification ────────────────────────────────────────────────────

/** Auth pages that authenticated users should be redirected away from. */
const AUTH_REDIRECT_ROUTES = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.SIGNUP,
  ROUTES.AUTH.FORGOT,
]

/** Routes that require an authenticated session. */
const PROTECTED_PREFIXES = ["/workspaces", "/settings"]

// ── Proxy ───────────────────────────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Refresh session — do not remove
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Skip guard for API routes (auth at service layer)
  if (pathname.startsWith("/api/")) return supabaseResponse

  // Unauthenticated → protected route → redirect to login
  if (!user && PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    const url = request.nextUrl.clone()
    url.pathname = ROUTES.AUTH.LOGIN
    return NextResponse.redirect(url)
  }

  // Authenticated → auth page (except /reset) → redirect to workspaces
  if (user && AUTH_REDIRECT_ROUTES.some((r) => pathname === r)) {
    const url = request.nextUrl.clone()
    url.pathname = ROUTES.WORKSPACES.INDEX
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
