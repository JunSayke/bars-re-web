// @module: shared
// @layer: config
// @scope: global
// @deps: @/shared/config/supabase.browser

// Re-export the SSR-aware singleton so all existing `import { supabase }` callers
// share the same GoTrueClient instance as those using createSupabaseBrowserClient().
import { createSupabaseBrowserClient } from "./supabase.browser"

export const supabase = createSupabaseBrowserClient()
