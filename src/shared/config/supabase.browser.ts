// @module: shared
// @layer: config
// @scope: global
// @deps: @supabase/ssr

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./database.types"

// Singleton — one GoTrueClient per browser context.
let _client: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createSupabaseBrowserClient() {
  if (!_client) {
    _client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return _client
}
