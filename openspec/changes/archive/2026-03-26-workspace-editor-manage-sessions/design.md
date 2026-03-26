## Context

The workspace module exists but `WorkspacesPage` is a shell placeholder. The Bisaya AI Rap platform needs a library view where users manage their rap writing sessions — the gateway to the editor. This change implements manage-sessions transaction using MSW mocks (no backend integration yet), following the vertical-slice architecture defined in `structure-architecture.md`.

Current state: `WorkspacesPage` renders a static placeholder text. The module has a schema for `WritingSession` (single session with bars), mock handlers for single-session fetch and draft save only.

Constraints:
- Vertical-slice: all feature logic lives under `src/modules/workspace/`
- Atomic design: components decompose into atoms → molecules → organisms
- TanStack Query v5 for data fetching and mutations
- MSW for mock API; fixtures contain realistic Bisaya session data
- shadcn/ui primitives + Tailwind CSS 4 (`globals.css` theme)
- Next.js App Router — `app/workspaces/page.tsx` stays a thin re-export

## Goals / Non-Goals

**Goals:**
- Render a session list with real-looking cards (title, topic badge, bar preview, timestamp, icons)
- Session count indicator with progress bar (e.g. "24/100 SESSIONS")
- Three-dot overflow menu per card → Rename and Delete actions
- Inline rename flow (dialog with pre-filled input)
- Delete confirmation dialog
- Empty state when no sessions exist
- Error toast on mutation failure (using sonner, already in project)
- Optimistic UI for delete (remove card immediately, restore on error)
- Mock API: `GET /sessions`, `PATCH /sessions/:id/rename`, `DELETE /sessions/:id`
- Clicking the session card opens `app/workspaces/editor?id=<id>`
- Play button per card (no-op stub in this transaction — beat playback is 4.4)

**Non-Goals:**
- Real backend API integration
- Pagination / infinite scroll (the mock list is bounded)
- Search/filter on the sessions page (deferred to later transaction)
- Creating new sessions (4.2 Create New Session is a separate transaction)
- Beat audio playback functionality (4.4 Import and Play Beat)

## Decisions

### 1. Session list schema stays separate from WritingSession

The `WritingSession` schema is a heavy editing schema (full bars array). A `SessionSummary` type covering `id, title, topic, previewSnippet, lastModifiedAt, thumbnailType` is introduced for the list view. This avoids over-fetching and keeps mock fixtures lean.

**Alternative considered:** Reuse `WritingSession` with optional bar truncation — rejected because it couples the editor schema to the list view.

### 2. Optimistic delete, server-state rename

Delete removes the card immediately from the TanStack Query cache and restores on error. Rename waits for the mock response before updating the title (the success path is instant in mocks, so latency is negligible, but this matches the real-world pattern).

**Alternative considered:** Optimistic rename — skipped to keep mutation logic simple for a mock-first pass.

### 3. Component decomposition (Atomic Design)

```
organisms/
  SessionsList.tsx          — full list, empty state, count indicator
molecules/
  SessionCard.tsx           — single card with all sub-elements
  SessionOverflowMenu.tsx   — three-dot dropdown
  RenameSessionDialog.tsx   — dialog with controlled input
  DeleteSessionDialog.tsx   — confirmation dialog
atoms/
  SessionThumbnail.tsx      — icon variant based on thumbnail type
  TopicBadge.tsx            — colored badge pill
  SessionCountBar.tsx       — "X/100 SESSIONS" + progress bar
```

`WorkspacesPage.tsx` composes `SessionsList` at the page level.

### 4. MSW handlers extend existing workspace.handlers.ts

The existing handlers cover single-session GET and draft PATCH. New handlers are added to the same file:
- `GET /sessions` → returns array of `SessionSummary`
- `PATCH /sessions/:id/rename` → returns updated `SessionSummary`
- `DELETE /sessions/:id` → returns `204`

### 5. Hook file naming

Following the auth module pattern: `useSessionsQuery.ts`, `useRenameSessionMutation.ts`, `useDeleteSessionMutation.ts` — each in `src/modules/workspace/hooks/`.

### 6. Routing on card click

Card click navigates to `/workspaces/editor?id=<sessionId>` using Next.js `useRouter` push. The editor page already exists; session loading by query param is out of scope here.

## Risks / Trade-offs

- **Mock data diverges from future real API** → Mitigation: schema types are defined via Zod so the API contract is explicit; swapping MSW for real calls requires only service layer changes.
- **Play button is a stub** → Mitigation: renders a disabled-looking button with correct icon; 4.4 transaction will wire up actual playback. A `TODO` comment marks the stub.
- **Optimistic delete may flash if error handling delay is long** → Mitigation: error toast fires on the same render cycle as the restore; acceptable for MVP.
