## 1. Supabase Schema — Create `snippets` Table

- [x] 1.1 In the Supabase project dashboard (or via a migration SQL file), create the `snippets` table:
  ```sql
  CREATE TABLE snippets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    content text NOT NULL,
    tags text[] NOT NULL DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  );
  ```
- [x] 1.2 Enable Row Level Security on `snippets` and add user-scoped policy:
  ```sql
  ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Users manage their own snippets"
    ON snippets FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  ```
- [x] 1.3 (Optional but recommended) Add a DB-level character limit guard:
  ```sql
  ALTER TABLE snippets ADD CONSTRAINT snippets_content_length CHECK (char_length(content) <= 10000);
  ```

## 2. Update `database.types.ts`

- [x] 2.1 In `src/shared/config/database.types.ts`, add the `snippets` table to the `Tables` record with full `Row`, `Insert`, and `Update` shapes:
  ```ts
  snippets: {
    Row: {
      id: string
      user_id: string
      title: string
      content: string
      tags: string[]
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      user_id: string
      title: string
      content: string
      tags?: string[]
      created_at?: string
      updated_at?: string
    }
    Update: {
      id?: string
      user_id?: string
      title?: string
      content?: string
      tags?: string[]
      created_at?: string
      updated_at?: string
    }
    Relationships: []
  }
  ```

## 3. Rewrite `snippet.service.ts`

- [x] 3.1 Replace the module-level `const BASE` and `handleResponse` helper with a `@/shared/config/supabase` import. Add module-level JSDoc: `@module: workspace`, `@layer: service`, `@scope: module`, `@deps: @/shared/config/supabase`.
- [x] 3.2 Add private helper `getAuthUser(): Promise<string>` — calls `supabase.auth.getUser()`, throws `{ message: "Unauthorized" }` if `data.user` is null, returns `data.user.id`. (Mirrors the identical helper in `session.service.ts` and `editor.service.ts`.)
- [x] 3.3 Rewrite `getSnippets(): Promise<Snippet[]>` — calls `getAuthUser()`, then `supabase.from("snippets").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(200)`. Throws on Supabase error. Maps each row SnippetTag validation: validate `row.tags` with `snippetTagSchema.array().safeParse(row.tags)` — use parsed value on success, `[]` on failure. Maps snake_case columns to camelCase `Snippet` type: `id`, `userId: row.user_id`, `title`, `content`, `tags`, `createdAt: row.created_at`, `updatedAt: row.updated_at`.
- [x] 3.4 Rewrite `createSnippet(payload: CreateSnippetPayload): Promise<Snippet>` — calls `getAuthUser()`, count-checks with `supabase.from("snippets").select("id", { count: "exact", head: true }).eq("user_id", userId)` — throws `{ message: "Snippet limit reached" }` if `count >= 200`. Inserts with `supabase.from("snippets").insert({ title: payload.title, content: payload.content, tags: payload.tags, user_id: userId }).select().single()`. Throws on Supabase error. Returns mapped `Snippet`.
- [x] 3.5 Rewrite `updateSnippet(id: string, payload: UpdateSnippetPayload): Promise<Snippet>` — calls `getAuthUser()`, calls `supabase.from("snippets").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", id).eq("user_id", userId).select().single()`. Throws on Supabase error. Returns mapped `Snippet`.
- [x] 3.6 Rewrite `deleteSnippet(id: string): Promise<void>` — calls `getAuthUser()`, calls `supabase.from("snippets").delete().eq("id", id).eq("user_id", userId)`. Throws on Supabase error.
- [x] 3.7 Remove the now-unused `const BASE`, `handleResponse`, and any `fetch` imports. Confirm no other file in the workspace module imports from `snippet.service.ts` in a way that expects the old REST-based shape.

## 4. Smoke Testing

- [x] 4.1 Start the dev server pointed at the Supabase dev project (`.env.local` with valid `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`). Log in as an authenticated user. Open the Verse Snippets panel and confirm it loads without error and the list is empty (no MSW fixtures).
- [x] 4.2 Create a new snippet (title + content + tag). Verify the snippet appears in the panel list. Open the Supabase dashboard and confirm a row exists in `snippets` with the correct `user_id`, `title`, `content`, and `tags`.
- [x] 4.3 Reload the page. Verify the snippet is still displayed in the panel — confirming Supabase persistence across page reloads.
- [x] 4.4 Edit the snippet — change the title or content. Verify the update is reflected in the panel and in the Supabase `snippets` row (`updated_at` advances).
- [x] 4.5 Delete the snippet. Verify it is removed from the panel immediately (optimistic) and the row is deleted from Supabase.
- [/] 4.6 Create 200 snippets (or seed the DB directly). Attempt to create a 201st — verify the error toast displays "You have reached the maximum limit of 200 snippets." and no Supabase insert is attempted. (tested after logout feature is implemented)
- [x] 4.7 Log in as a second test user. Verify that snippets created by the first user are NOT visible — confirming RLS isolation.
- [/] 4.8 Attempt to call `getSnippets()` in a browser console without an active auth session (simulate by clearing the session cookie). Verify the service throws `Unauthorized` and no data is returned. (tested after logout feature is implemented)
- [x] 4.9 Run `pnpm lint` and `pnpm build` — confirm zero TypeScript and ESLint errors introduced by this change.
