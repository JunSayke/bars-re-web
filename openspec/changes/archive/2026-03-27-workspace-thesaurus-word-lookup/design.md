## Context

The workspace editor (`EditorPage.tsx`) already manages a set of `openPanels` via `WorkspaceWindowMenu`. The **Snippets** panel (`SnippetsPanel.tsx`) already demonstrates the draggable/resizable floating-window pattern used for workspace transactions — it uses `pointer events` + `position: fixed` + `transform: translate` with `setPointerCapture` for smooth drag without jitter.

The Thesaurus module is a **new vertical slice** under `src/modules/workspace/` (same module as the editor, since the thesaurus transaction is workspace-scoped). It has five sub-tools (Word Lookup, Rhyme, Synonyms, Anagrams, Wordplay); this change implements only **Word Lookup**. All remaining tabs are rendered as stubs.

All data is mocked via MSW — no real backend calls.

**Reference SDD:** `waterfall-docs/SDD/modules/2-thesaurus/README.md`
**UI reference:** attached screenshots (dark floating card with "Thesaurus Tools" heading, tab strip, query input, results card with Definition / Homonyms / Translations sections, diamond "navigate" button).

---

## Goals / Non-Goals

**Goals:**
- Implement the `ThesaurusPanel` draggable/resizable floating window, opened via the existing "Thesaurus" checkbox in `WorkspaceWindowMenu`.
- Implement the `WordLookupTab` with query input, results card (word header, Definition, Homonyms, Translations), skeleton loading states, and the diamond "Navigate to Tool" button.
- Wire to `useWordLookupQuery` (TanStack Query `GET /thesaurus/lookup?query=<term>`).
- MSW mock handler + fixture for the word-lookup endpoint.
- Render other four tab buttons (Rhyme, Synonyms, Anagrams, Wordplay) as disabled stubs.
- Match the visual design exactly (dark card, purple active tab underline, chip pills for Homonyms, etc.).

**Non-Goals:**
- Rhyme, Synonyms, Anagrams, Wordplay tabs (stubs only — no content).
- Real backend or AI fallback integration (out of scope; MSW only).
- Session word cache persistence on frontend.
- "Navigate to Tool" pre-fill behavior across tabs (button renders but navigation is a no-op stub for now).

---

## Decisions

### D1: Co-locate thesaurus within `src/modules/workspace/` (not a new module)

The thesaurus panel only ever appears inside the workspace editor. It reads the `openPanels` state owned by `EditorPage`. Creating a separate `src/modules/thesaurus/` module would require cross-module prop drilling or a global store for panel open/close, which violates the architecture's rule that modules never import from each other.

**Alternative:** New `src/modules/thesaurus/` module connected via a shared context.  
**Rejected because:** Adds cross-module coupling for no architectural benefit at this stage.

### D2: Reuse the `SnippetsPanel` drag/resize pattern verbatim

`SnippetsPanel.tsx` implements drag-via-`setPointerCapture` and bottom-right corner resize. The same approach will be used for `ThesaurusPanel.tsx` — a new template file that is structurally identical but has a different title, initial size, and renders the thesaurus tab content.

**Alternative:** Extract a generic `FloatingPanel` template shared by both.  
**Rejected because:** Premature abstraction at this point; two instances do not justify a shared component. Can be refactored once a third panel appears.

### D3: Query on explicit submit (Enter / button click), not on keystroke

Word lookup is a heavier operation conceptually. Firing on every keystroke would cause MSW noise and won't match the backend's expected behavior (exact/partial match). The query is fired when the user presses Enter or submits the form.

**Alternative:** Debounced on-type search.  
**Rejected because:** Inconsistent with the SDD sequence diagram which shows `submitQuery(term)` as the trigger.

### D4: Single `useWordLookupQuery` hook with `enabled: !!term`

The hook takes the submitted `term` string and uses `enabled: !!term` so TanStack Query only fires when a term is present. The query key includes the term, so different terms are cached independently.

### D5: Tabs rendered as `<button>` elements with active state via `data-active`

The five tabs are rendered as plain `<button>` elements styled with a purple bottom-border for the active tab. Shadcn's `<Tabs>` component is not used — the thesaurus has its own distinct sub-tool routing, not a radix-tabs pattern, and the custom styling is simpler to achieve directly.

**Alternative:** Use shadcn `<Tabs>`.  
**Rejected because:** The thesaurus tab bar has a distinct visual treatment (full-width divider, purple underline only on active) that would require significant Radix override.

### D6: Skeleton loading state using animated `div` bars

Loading state uses `div` elements with `bg-muted animate-pulse rounded` to mimic the skeleton bars shown in the UI screenshots — matching the reference design exactly.

---

## Risks / Trade-offs

- **[Risk] Tab stub UX** — Clicking Rhyme/Synonyms/Anagrams/Wordplay shows nothing. Users may think it's broken.  
  → Mitigation: Disabled styling (`opacity-50 cursor-not-allowed`) with a tooltip "Coming soon" on hover.

- **[Risk] Panel z-index conflict** — Both Snippets and Thesaurus panels use `z-index: 50`; if both are open they may overlap without a "bring to front" mechanism.  
  → Mitigation: Acceptable for now (no overlapping priority needed for MVP); note this for future floating window manager work.

- **[Risk] MSW handler registration** — The new `thesaurus.handlers.ts` must be added to `src/shared/mocks/browser.ts` handler list. Forgetting this causes silent 404s in development.  
  → Mitigation: The tasks checklist includes this step explicitly.

---

## Component Map

```
src/modules/workspace/
  components/
    templates/
      ThesaurusPanel.tsx           ← draggable/resizable shell (mirrors SnippetsPanel)
    organisms/
      ThesaurusTabs.tsx            ← tab strip + active tab routing
    molecules/
      WordLookupTab.tsx            ← query input + results card
    atoms/
      WordResultCard.tsx           ← results display (definition, homonyms, translations)
      HomonymChip.tsx              ← clickable pill that pre-fills the query input
      ThesaurusTabButton.tsx       ← single tab button with active/disabled states
  hooks/
    useWordLookupQuery.ts          ← TanStack Query GET /thesaurus/lookup
  services/
    thesaurus.service.ts           ← fetch wrapper for /thesaurus/lookup
  mocks/
    thesaurus.fixtures.ts          ← mock WordLookupResult objects
    thesaurus.handlers.ts          ← MSW GET /thesaurus/lookup handler
  types/
    thesaurus.types.ts             ← WordLookupResult, HomonymEntry, TranslationEntry
  schemas/
    thesaurus.schema.ts            ← Zod schema for WordLookupResult
```

`EditorPage.tsx` renders `<ThesaurusPanel>` when `openPanels.has("thesaurus")`, passing `onClose` to remove it from the set.

---

## Migration Plan

No migration required — purely additive frontend change. MSW runs in development and test environments only.

**Rollback:** Remove the `ThesaurusPanel` render from `EditorPage` and delete the new files. No database or API contract changes.

---

## Open Questions

- None blocking implementation. The "Navigate to Tool" pre-fill across tabs will be designed when subsequent thesaurus tabs are implemented.
