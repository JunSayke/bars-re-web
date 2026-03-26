## Context

The `/workspaces/editor` route is an empty shell with no frontend implementation. The Write and Edit Bars transaction is the foundational piece of the Editor Workspace module — every other editor feature (beat player, verse snippets) sits alongside or below it. The backend will serve `GET /sessions/:id` to load session data and `PATCH /sessions/:id/draft` to persist bar edits.

Key constraints from `structure-architecture.md`:
- Next.js is a **pure frontend** — all data is owned by the NestJS backend
- All feature logic lives in `src/modules/workspace/` (vertical slice)
- Component structure follows Atomic Design: atoms → molecules → organisms → templates → pages
- MSW is used for all API mocking in development; no real API calls during local dev
- TanStack Query v5 manages all server state
- React Hook Form + Zod handle form inputs; bars in the editor are plain React state (not a form)

The SDD for 4.3 defines the core domain: a `WritingSession` contains one or more `Bar` value objects. Bars are organized visually into named sections (VERSE 1, CHORUS, VERSE 2, BRIDGE) which are a UI-level grouping concept — not a separate backend entity per the ERD.

---

## Goals / Non-Goals

**Goals:**
- Render a functional bar editor UI at `/workspaces/editor` that matches the provided UI mockup (dark theme, numbered rows, section labels, syllable/bar count badges)
- Support adding and removing bar rows within sections
- Display real-time syllable count and bar count per section via client-side computation
- Display a total word count indicator with a 1000-word guard
- Implement debounced auto-save that POSTs to `PATCH /sessions/:id/draft` and shows save status
- Integrate MSW mock handlers so the editor is fully functional in development without a backend
- Wire `app/workspaces/editor/page.tsx` to the new `EditorPage` component

**Non-Goals:**
- Beat player bar (covered in a separate `import-and-play-beat` transaction)
- Verse Snippets panel (covered in a separate `manage-verse-snippets` transaction)
- Session creation dialog (covered in `create-new-session` transaction)
- Real Bisaya NLP syllable counting — a best-effort heuristic counter is sufficient
- Offline / local-first persistence (IndexedDB, service worker caching)
- Rich text formatting (bold, italic, markdown) — bars are plain text inputs
- Section drag-and-drop reordering (keyboard move-up/move-down buttons are supported via tasks 11.8)

---

## Decisions

### D1 — Sections are a UI-only grouping concept, not a separate data entity

**Decision:** Bars are stored as a flat array in the backend (`Bar[]` keyed by `session_id`). Section membership is encoded as a `section` string on each bar (`"verse-1"`, `"chorus"`, `"verse-2"`) rather than a separate `Section` table. The UI groups bars by their `section` field.

**Rationale:** The SDD ERD for 4.3 has only `Session` and `Bar` tables with no separate `Section` entity. Adding a section entity now would require schema changes outside this transaction's scope. The section field on `Bar` gives sufficient flexibility for all current section types.

**Alternative considered:** A separate `Section` entity with ordering — deferred as over-engineering for MVP.

---

### D2 — Client-side syllable counting

**Decision:** Syllable counts are computed entirely on the client using a heuristic algorithm (vowel-run detection suitable for Bisaya/Filipino phonology). No server round-trip for syllabics.

**Rationale:** Real-time badge updates require sub-keystroke latency. A server round-trip for syllable counts on every keystroke would cause noticeable lag and high request volume. The SDD mentions a `computeSyllables()` service but this is also adequately approximated client-side for display purposes.

**Alternative considered:** Server-side computation via `GET /sessions/:id/syllables` — rejected due to latency; suitable only if exact NLP accuracy is required (future enhancement).

---

### D3 — Debounced auto-save (1 s idle + 30 s max interval)

**Decision:** Auto-save fires 1 second after the user stops typing (debounce), with a hard ceiling of 30 seconds between saves. The save is a PATCH to `/sessions/:id/draft` with the full bars array.

**Rationale:** This balances API load against data safety. Saving the full bars array (rather than a diff) keeps the endpoint simple and idempotent. The SDD sequence diagram shows a 30-second auto-save timer; adding a 1-second debounce reduces unnecessary saves during active typing.

**Alternative considered:** On-every-keypress save — too aggressive; optimistic save with diff patching — too complex for MVP.

---

### D4 — Local React state for bars; TanStack Query for server synchronisation

**Decision:** The bars array is held in local React state (`useState`) within the editor component. TanStack Query handles the initial `GET /sessions/:id` fetch and the `PATCH /sessions/:id/draft` mutation. The mutation updates server state; local state continues to drive the UI optimistically.

**Rationale:** The bars editor is a continuous editing surface — not a submit-once form. React Hook Form is appropriate for discrete form submissions (login, create session), but not for a live multi-row editor. `useState` gives direct imperitive control over row insertion and deletion.

**Alternative considered:** Zustand or Jotai for editor state — deferred; adds a new dependency. The editor is contained within a single component tree, so React state is sufficient.

---

### D5 — `EditorPage` owns state; organisms are purely presentational

**Decision:** `EditorPage` is the single stateful container. It fetches session data, holds the bars array, handles debounced save, and passes props down to `BarsEditor` and `EditorTopNav`. Organisms, molecules, and atoms are all presentational (props-only).

**Rationale:** Follows the Atomic Design contract in `structure-architecture.md` — only the page or template layer manages data. Organisms must remain reusable and side-effect free.

---

### D6 — Section label supports a finite set of named types

**Decision:** Section types are defined as a TypeScript union: `"verse" | "chorus" | "bridge" | "hook" | "outro"`. The section number (e.g., "VERSE 1", "VERSE 2") is derived from counting sections of the same type. This lets the UI display "VERSE 1", "VERSE 2", etc., without storing the display label in the database.

**Rationale:** Avoids storing derived display strings. Keeps renaming refactors cheap.

---

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Heuristic syllable counter is inaccurate for complex Bisaya compounds | Mark the badge as "approx" in a tooltip; plan a backend NLP enhancement post-MVP |
| Auto-save fires during a network outage, blocking the user from knowing their content is safe | Show a persistent "Save failed — retrying" badge; retain bars in local state; retry on next save cycle |
| Word count limit check only on save (not on keypress) may surprise users near 1000 words | Display a warning badge when word count exceeds 800 (80% threshold); hard-block save at 1000 |
| A large number of bars (100+) could cause input re-render thrashing | Use `React.memo` on `BarInputRow` and key by stable `barId` |
| Mock data in fixtures may drift from real API contract | Define Zod schemas first; derive TypeScript types and mock fixtures from the same schema |
