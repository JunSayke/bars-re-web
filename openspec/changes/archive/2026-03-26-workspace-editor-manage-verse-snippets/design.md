## Context

The Editor Workspace page (`EditorPage`) is the core creative environment. It currently has a `BeatPlayerBar` at the bottom and a `BarsEditor` in the main area. A workspace window menu (bottom-right floating button) is visible in the UI mockup but not yet wired to any panel.

The Verse Snippets panel is a new floating tool window — analogous to a sticky note pad — where rappers save reusable phrases, drafts, or lyric fragments. It is toggled from the workspace window menu and must not interfere with the main bars editor.

All data for snippets is isolated from the session; snippets belong to the user (not the session). This is consistent with the class diagram (`Snippet.userId`, not `sessionId`).

## Goals / Non-Goals

**Goals:**
- Add a Verse Snippets floating panel (draggable + resizable) to the Editor Workspace
- Implement full client-side CRUD: list, create, edit, delete snippets
- Tag-based filtering (All, Chorus, Verse, Hook, Freestyle, Bridge) and keyword search
- Insert a snippet's content inline at the user's current bar position
- Enforce business constraints: 200-snippet limit, 200-word limit per snippet
- Wire the panel toggle into the workspace window menu (bottom-right)
- Full MSW mock implementation for local development without backend

**Non-Goals:**
- Real-time collaborative snippet editing
- Snippet sharing across users
- Rich text / markdown rendering inside snippet content
- Drag-and-drop reordering of snippets
- Persisting panel position between sessions (position is ephemeral per page load)

## Decisions

### D1 — Snippet data is user-scoped, not session-scoped
**Decision:** `Snippet.userId` is the foreign key; snippets are not bound to a session.
**Rationale:** The sequence diagram confirms session-agnostic snippets. Users carry their snippet library across all sessions. A session ID filter would be artificial.
**Alternative considered:** Session-scoped snippets — rejected because it limits reuse across sessions, which is the entire value proposition.

### D2 — Draggable/resizable panel via CSS + pointer events (no external drag library)
**Decision:** Implement drag via `onPointerDown`/`onPointerMove`/`onPointerUp` on the panel header and resize via a corner drag handle — no `react-dnd`, `@dnd-kit/core`, or `framer-motion`.
**Rationale:** The panel is the only draggable element in the application. Adding a full drag library for one component is disproportionate to the need. CSS transform + pointer events handles it cleanly.
**Alternative considered:** `framer-motion` drag — rejected (new dependency for one use case); `react-resizable` — rejected (requires controlled sizes with pixel accuracy, adds bloat).

### D3 — Panel state lives in EditorPage; snippet data lives in TanStack Query
**Decision:** Panel open/closed, position (x,y), and size (w,h) are `useState` in `EditorPage`. Snippet data (list, optimistic create/update/delete) is managed via TanStack Query hooks.
**Rationale:** Panel transform state is purely UI with no server sync required. Snippets are server data. Mixing them in one state bucket would be incorrect.

### D4 — Snippet schemas and hooks added to the workspace module (not a new module)
**Decision:** All snippet types, schemas, hooks, and mocks live under `src/modules/workspace/` — specifically `schemas/snippet.schema.ts`, `types/snippet.types.ts`, `hooks/useSnippets.ts`, `mocks/snippet.fixtures.ts`, `mocks/snippet.handlers.ts`.
**Rationale:** Snippets are used exclusively in the Editor Workspace. The workspace module does not yet exceed the "too large" threshold (8 pages, 15 hooks, 3 sub-domains). Splitting to a new module for one transaction adds unnecessary complexity.

### D5 — Snippet form uses React Hook Form + Zod (consistent with auth module)
**Decision:** New snippet / edit snippet dialog uses `useForm` from `react-hook-form` with `zodResolver`.
**Rationale:** All existing form flows (login, signup, create session) use this pattern. Consistency loweres cognitive load.

### D6 — Snippet word count is computed client-side before submission
**Decision:** `wordCount` is derived from `content.trim().split(/\s+/).filter(Boolean).length` on the client. The backend is the authority for enforcement but client shows live feedback.
**Rationale:** Same pattern as bars word count. No server round-trip needed for inline feedback.

### D7 — The "Insert" action appends snippet content to the currently-focused bar
**Decision:** Inserting a snippet appends its `content` to the text of the last focused bar. If no bar is focused, it appends a new bar to the last section.
**Rationale:** Snippets are lyric fragments; appending to the current bar is the most natural insertion point. Implementing true cursor-position insertion into a `<textarea>` requires selection API work that is disproportionate for a v1 feature.

### D8 — Tag list is a fixed enum (not user-defined)
**Decision:** Tags are drawn from a fixed set: `All`, `Chorus`, `Verse`, `Hook`, `Freestyle`, `Bridge`. The backend still uses `Tag` entities for flexibility but the UI restricts to this list.
**Rationale:** The UI mockup shows exactly these tabs. Open-ended tagging introduces UX complexity (tag management UI, deduplication) with no benefit in v1.

## Risks / Trade-offs

- **[Risk] Pointer events for drag may feel imprecise on touch screens** → Mitigation: acceptable for v1 desktop use case; touch support can be added later with `onTouchStart/Move/End` as an enhancement.
- **[Risk] Panel can be dragged off-screen** → Mitigation: clamp x/y within viewport bounds on `pointerup` using `Math.max(0, Math.min(window.innerWidth - w, x))`.
- **[Risk] Snippet list fetched globally (not per-session) may load many items** → Mitigation: server-side pagination + client-side max 80 visible items, consistent with UI mockup showing `80 / 200 snippets`.
- **[Risk] "Insert" overwrites bar text if user types in bar between inserting** → Mitigation: insert appends (does not replace), mitigating accidental overwrites.
