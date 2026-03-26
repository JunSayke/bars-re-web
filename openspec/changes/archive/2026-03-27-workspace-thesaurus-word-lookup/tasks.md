## 1. Types, Schema, and Service

- [x] 1.1 Create `src/modules/workspace/types/thesaurus.types.ts` — define `WordLookupResult`, `HomonymEntry`, and `TranslationEntry` TypeScript interfaces
- [x] 1.2 Create `src/modules/workspace/schemas/thesaurus.schema.ts` — Zod schema for `WordLookupResult` (used for runtime validation of MSW responses)
- [x] 1.3 Create `src/modules/workspace/services/thesaurus.service.ts` — `lookupWord(term: string): Promise<WordLookupResult>` fetch wrapper for `GET /thesaurus/lookup?query=<term>`

## 2. Mock Data and MSW Handler

- [x] 2.1 Create `src/modules/workspace/mocks/thesaurus.fixtures.ts` — define at least 3 fixture entries (e.g., `balak`, `kanta`, `damgo`) with definitions, homonyms, and translations
- [x] 2.2 Create `src/modules/workspace/mocks/thesaurus.handlers.ts` — MSW `http.get` handler for `GET /thesaurus/lookup` that returns matching fixture or empty result
- [x] 2.3 Register `thesaurusHandlers` in `src/shared/mocks/browser.ts` handler array
- [x] 2.4 Register `thesaurusHandlers` in `src/shared/mocks/server.ts` handler array (if present)

## 3. TanStack Query Hook

- [x] 3.1 Add thesaurus query keys to `src/modules/workspace/hooks/queryKeys.ts` (e.g., `thesaurusKeys.lookup(term)`)
- [x] 3.2 Create `src/modules/workspace/hooks/useWordLookupQuery.ts` — TanStack Query hook with `enabled: !!term`, using `thesaurusKeys.lookup(term)` and `lookupWord` service

## 4. Atom Components

- [x] 4.1 Create `src/modules/workspace/components/atoms/ThesaurusTabButton.tsx` — single tab button with `isActive` and `isDisabled` props; active state shows purple bottom-border underline
- [x] 4.2 Create `src/modules/workspace/components/atoms/HomonymChip.tsx` — clickable pill button that calls `onClick(word)` when pressed
- [x] 4.3 Create `src/modules/workspace/components/atoms/WordResultCard.tsx` — card rendering word header, Definition section (with expand/collapse chevron), Homonyms section (chip list), and Translations section; accepts a `WordLookupResult` prop and an `onHomonymClick` callback

## 5. Molecule and Organism Components

- [x] 5.1 Create `src/modules/workspace/components/molecules/WordLookupTab.tsx` — form with query input (label "Query", placeholder "Enter Bisaya term…"), submit on Enter, loading skeleton, results via `WordResultCard`, empty and error states, and diamond navigate button stub
- [x] 5.2 Create `src/modules/workspace/components/organisms/ThesaurusTabs.tsx` — renders the five tab buttons (Word Lookup, Rhyme, Synonyms, Anagrams, Wordplay) using `ThesaurusTabButton`; Word Lookup is the only active content renderer; other tabs render a "Coming soon" stub

## 6. ThesaurusPanel Template

- [x] 6.1 Create `src/modules/workspace/components/templates/ThesaurusPanel.tsx` — draggable/resizable floating panel (mirrors `SnippetsPanel.tsx` pattern) with title "Thesaurus Tools", a close button, and `ThesaurusTabs` as its body; initial size 520 × 600 px, positioned near the top-right of the viewport

## 7. Editor Integration

- [x] 7.1 Import `ThesaurusPanel` in `src/modules/workspace/components/EditorPage.tsx`
- [x] 7.2 Render `<ThesaurusPanel onClose={() => handleTogglePanel("thesaurus")} />` inside `EditorPage` when `openPanels.has("thesaurus")` is true

## 8. Barrel Exports

- [x] 8.1 Verify that new public types and components are exported through `src/modules/workspace/index.ts` if required by the barrel convention
