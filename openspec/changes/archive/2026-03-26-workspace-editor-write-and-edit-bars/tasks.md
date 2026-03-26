## 1. Module Scaffolding

- [x] 1.1 Create `src/modules/workspace/` directory structure: `components/`, `components/atoms/`, `components/molecules/`, `components/organisms/`, `components/templates/`, `hooks/`, `schemas/`, `services/`, `types/`, `mocks/`
- [x] 1.2 Create `src/modules/workspace/index.ts` barrel that exports `EditorPage` and `WorkspacesPage`
- [x] 1.3 Create `src/modules/workspace/meta.ts` with module metadata (name, description)

## 2. Types and Schemas

- [x] 2.1 Create `src/modules/workspace/types/workspace.types.ts` — define `SectionType` union (`"verse" | "chorus" | "bridge" | "hook" | "outro"`), `Bar`, `WritingSession`, `SaveDraftPayload`, `SaveResult` TypeScript types
- [x] 2.2 Create `src/modules/workspace/schemas/workspace.schema.ts` — define Zod schemas for `barSchema`, `writingSessionSchema`, `saveDraftPayloadSchema`, `saveResultSchema`; derive and export inferred TypeScript types from schemas
- [x] 2.3 Verify all types in `workspace.types.ts` are consistent with (or replaced by) Zod-inferred types from `workspace.schema.ts`

## 3. Service Layer

- [x] 3.1 Create `src/modules/workspace/services/workspace.service.ts` — implement `getSession(sessionId: string): Promise<WritingSession>` (GET `/sessions/:id`) and `saveDraft(sessionId: string, payload: SaveDraftPayload): Promise<SaveResult>` (PATCH `/sessions/:id/draft`) using `fetch` with typed request/response
- [x] 3.2 Create `src/modules/workspace/hooks/queryKeys.ts` — define TanStack Query key factories: `workspaceKeys.session(id)`, `workspaceKeys.draft(id)`
- [x] 3.3 Create `src/modules/workspace/hooks/useGetSessionQuery.ts` — TanStack Query `useQuery` wrapping `getSession`; expose `session`, `isLoading`, `isError`
- [x] 3.4 Create `src/modules/workspace/hooks/useSaveDraftMutation.ts` — TanStack Query `useMutation` wrapping `saveDraft`; expose `mutate`, `isPending`, `isError`, `isSuccess`

## 4. Syllable Count Utility

- [x] 4.1 Create `src/shared/lib/syllable-count.ts` — implement `countSyllables(text: string): number` using a heuristic vowel-run algorithm suitable for Bisaya/Filipino phonology (treat contiguous vowel groups as one syllable; minimum 1 syllable per non-empty word)
- [x] 4.2 Write inline unit-style validation comments for at least 5 Bisaya word examples to document expected outputs

## 5. MSW Mocks

- [x] 5.1 Create `src/modules/workspace/mocks/workspace.fixtures.ts` — define `mockSession` fixture: a `WritingSession` with at least 3 sections (VERSE 1 with 4 bars, CHORUS with 2 bars, VERSE 2 with 2 partial bars) matching the provided UI mockup content
- [x] 5.2 Create `src/modules/workspace/mocks/workspace.handlers.ts` — define MSW handlers: `GET /sessions/:id` returns `mockSession`; `PATCH /sessions/:id/draft` returns `{ success: true }`
- [x] 5.3 Register workspace handlers in `src/shared/mocks/browser.ts` — import and spread `workspaceHandlers` into the handlers array
- [x] 5.4 Register workspace handlers in `src/shared/mocks/server.ts` — same import and spread pattern

## 6. Atom Components

- [x] 6.1 Create `src/modules/workspace/components/atoms/BarInputRow.tsx` — single-line `<input>` with two-digit line-number label; props: `lineNumber`, `value`, `onChange`, `onAddAfter`, `onRemove`, `isRemoveDisabled`; wrap in `React.memo`
- [x] 6.2 Create `src/modules/workspace/components/atoms/SectionBadge.tsx` — read-only pill displaying `SYLLABLES: N | BARS: N`; props: `syllableCount`, `barCount`; styled to match dark theme badge from UI mockup
- [x] 6.3 Create `src/modules/workspace/components/atoms/AutoSaveStatusIndicator.tsx` — renders save state text; props: `status: "idle" | "saving" | "saved" | "error"`; shows "Saving…" / "Saved" / "Save failed" in appropriate colors; "Saved" fades after 2 s via `useEffect` timeout
- [x] 6.4 Create `src/modules/workspace/components/atoms/WordCountIndicator.tsx` — read-only counter label; props: `wordCount`, `maxWords: 1000`; renders `Words: N / 1000`; applies warning style at ≥ 800 and error style at 1000

## 7. Molecule Components

- [x] 7.1 Create `src/modules/workspace/components/molecules/SectionGroup.tsx` — renders a section label (left-bordered uppercase heading) followed by a list of `BarInputRow` atoms and a `SectionBadge` atom below; props: `sectionLabel`, `bars`, `onBarChange`, `onAddBar`, `onRemoveBar`; computes `syllableCount` and `barCount` from bars using `countSyllables`

## 8. Organism Components

- [x] 8.1 Create `src/modules/workspace/components/organisms/BarsEditor.tsx` — renders a list of `SectionGroup` molecules and a `WordCountIndicator` atom; props: `sections` (grouped bars), `onBarsChange`, `wordCount`; computes total word count to pass to `WordCountIndicator`
- [x] 8.2 Create `src/modules/workspace/components/organisms/EditorTopNav.tsx` — top navigation bar with "Back to Library" link (navigates to `/workspaces`), session name display, settings icon button, and user avatar; props: `sessionTitle`, `onSettingsClick`; uses Next.js `<Link>` for back navigation

## 9. Template and Page Components

- [x] 9.1 Create `src/modules/workspace/components/templates/EditorShell.tsx` — full-screen dark layout template; renders top nav slot and main editor content slot; applies dark background from CSS variables consistent with `globals.css` dark theme
- [x] 9.2 Create `src/modules/workspace/components/EditorPage.tsx` — stateful page component; calls `useGetSessionQuery` to load session; holds `bars` in `useState`; implements debounced auto-save with 1 s debounce and 30 s ceiling using `useEffect` + `useSaveDraftMutation`; groups bars by section before passing to `BarsEditor`; computes total word count; blocks save and shows warning when word count ≥ 1000; renders `EditorShell` with `EditorTopNav` and `BarsEditor`; handles loading skeleton and error state

## 10. Routing Wire-up

- [x] 10.1 Update `app/workspaces/editor/page.tsx` — replace empty shell with `"use client"` directive and a re-export of `EditorPage` from `src/modules/workspace/components/EditorPage`
- [x] 10.2 Verify `app/workspaces/page.tsx` still renders correctly (not broken by workspace module additions)
- [x] 10.3 Confirm `app/layout.tsx` has `MockProvider` wrapping content so MSW is active in development

## 11. Additional Changes
- [x] 11.1 Add a feature to `[sectionLabel]` on `src\modules\workspace\components\molecules\SectionGroup.tsx` to be able to change `SectionType`
- [x] 11.2 Add 'Add Section' and 'Remove Sections' on the SectionGroup to allow users to add or remove sections
- [x] 11.3 Add a 'remove bar' function when the highlighted bar is empty and the backspace key is pressed
- [x] 11.4 Add caret switching when adding a bar when using keyboard inputs. If a bar is added via Enter Key, the caret will move to the recently added bar
- [x] 11.5 Add caret switching when removing a bar when using keyboard inputs. If a bar is removed via Backspace Key, the caret will move to the bar above the recently removed bar
- [x] 11.6 Add caret switching when removing a bar when using keyboard inputs. If a bar is removed via Backspace Key and there is no bar above the recently removed bar, the caret will move below
- [x] 11.7 Add caret switching when removing a bar when using keyboard inputs. If a bar is removed via Backspace Key and there is no more bars after the recently removed bar, otherwise the section is removed and the caret is not on any bar
- [x] 11.8 Add up arrow and down arrow buttons to swap section order
- [x] 11.9 Add a section copy button and copies all the bars on the section to clipboard

## 12. Fixes
- [x] 12.1 Update 'Add Section' to always add a section below the section that requested the add section. If there is only one section in the editor, do not remove the section

## 13. Integration Verification

- [x] 13.1 Run `pnpm dev` and navigate to `/workspaces/editor` — verify the mock session loads with VERSE 1, CHORUS, and VERSE 2 sections visible
- [x] 13.2 Type text in bar inputs — verify syllable/bar count badges update in real time without page reload
- [x] 13.3 Verify word count indicator increments as text is added and shows warning style at ≥ 800 words
- [x] 13.4 Wait 1 second after stopping typing — verify auto-save fires, status shows "Saving…" then "Saved"
- [x] 13.5 Add and remove bar rows — verify numbering updates correctly and the remove action is disabled when only one bar remains
- [x] 13.6 Click "Back to Library" — verify navigation to `/workspaces`
- [x] 13.7 Run `pnpm build` and confirm no TypeScript or lint errors
