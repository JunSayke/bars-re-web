## Context

The Thesaurus panel in the workspace editor already renders five tabs — Word Lookup, Rhyme, Synonyms, Anagrams, and Wordplay — but only Word Lookup is wired up. The `@junsayke/cebuano-thesaurus` package (Node.js only, `better-sqlite3`) already ships `getRhymes()`, which returns ranked phonetic candidates with type metadata (`perfect`, `family`, `additive`, `assonance`) and syllable counts. The word-lookup Route Handler at `GET /api/thesaurus/lookup` is the established pattern to follow.

The Rhyme tab currently has `isDisabled={true}` and its click handler is a no-op. The `ThesaurusTabs` component owns tab state but has no shared word state across tabs, so clicking a rhyme chip to pre-fill Word Lookup requires lifting that state.

## Goals / Non-Goals

**Goals:**
- Wire up the "Rhyme" tab with a `RhymeFinderTab` molecule that calls a new Route Handler.
- Expose `GET /api/thesaurus/rhyme?query=<term>` using `getRhymes()` from the cebuano-thesaurus package.
- Display results as chip groups ordered: perfect → family → additive → assonance.
- Allow clicking a rhyme chip to switch to the Word Lookup tab pre-filled with that word.
- Follow the established arch pattern: Route Handler → `thesaurus.service.ts` client fn → TanStack Query hook → molecule component.

**Non-Goals:**
- No Supabase persistence (no `RhymeSearchHistory` table, no cache service).
- No pagination or infinite scroll on rhyme results.
- No Synonyms, Anagrams, or Wordplay tabs (separate changes).
- No server-side options knobs (limit/randomness sliders exposed to the user).

## Decisions

### Decision 1: Route Handler at `/api/thesaurus/rhyme` (not a Server Action)

The `@junsayke/cebuano-thesaurus` package is Node.js only. A Route Handler running in the Node.js runtime (no `export const runtime = "edge"`) satisfies this constraint and mirrors the existing `/api/thesaurus/lookup` pattern. Server Actions could also work but Route Handlers are already the established pattern for thesaurus calls.

**Alternative considered**: Inline `getRhymes()` inside a Server Action — rejected because the word-lookup architecture uses Route Handlers and consistency is more important than a marginal DX gain.

### Decision 2: `getRhymes` with fixed `limit: 20, maxSyllableOffset: 1`

This surfaces meaningful results without overwhelming the chip list. `randomness: 0` is used to ensure deterministic ordering so TanStack Query cache hits return identical results.

**Alternative considered**: Exposing limit/randomness as query params — rejected per non-goals scope.

### Decision 3: Cross-tab pre-fill via lifted state in `ThesaurusTabs`

`ThesaurusTabs` will hold `activeWord: string` state. When a rhyme chip is clicked, it sets `activeTab` to `"word-lookup"` and `activeWord` to the chip's word. `WordLookupTab` receives `initialTerm?: string` and treats it as a controlled jump (runs query when `initialTerm` changes).

**Alternative considered**: URL query params for cross-tab nav — over-engineered for a client-only panel; also Thesaurus panel is embedded inside the editor, not a routable page.

### Decision 4: Group chips by rhyme type in a single flat result card

Chips are visually grouped with a small uppercase type label (PERFECT, FAMILY, ADDITIVE, ASSONANCE). No accordion or collapse — groups are short enough to show inline. Empty groups are hidden.

**Alternative considered**: Separate sections per type with collapsible headers — adds complexity for no UX gain at the expected result counts (~5-15 total chips).

## Risks / Trade-offs

- **[Risk] Large result sets slow render** → Mitigated by capping `limit: 20` in the Route Handler.
- **[Risk] `better-sqlite3` native module not available in some deployment environments** → Same risk already accepted by the word-lookup Route Handler; not new.
- **[Risk] `initialTerm` prop creates implicit coupling between `ThesaurusTabs` state and `WordLookupTab`** → Mitigated by keeping `initialTerm` as a one-way data-in prop; `WordLookupTab` manages its own local `inputValue`/`submittedTerm` state.
