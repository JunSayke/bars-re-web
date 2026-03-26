## 1. Types & Schemas

- [x] 1.1 Create `src/modules/workspace/schemas/snippet.schema.ts` — Zod schemas: `snippetTagSchema` (enum), `snippetSchema`, `createSnippetPayloadSchema`, `updateSnippetPayloadSchema`
- [x] 1.2 Create `src/modules/workspace/types/snippet.types.ts` — re-export Zod-inferred types: `SnippetTag`, `Snippet`, `CreateSnippetPayload`, `UpdateSnippetPayload`

## 2. Mock Data & MSW Handlers

- [x] 2.1 Create `src/modules/workspace/mocks/snippet.fixtures.ts` — at least 3 fixture snippets with varied tags (`Chorus`, `Verse`, `Hook`) matching the UI mockup (titles: "Mao ni akong tingog", "Ako kasingkasing", "Kini ang tingog sa mga Bisaya")
- [x] 2.2 Create `src/modules/workspace/mocks/snippet.handlers.ts` — MSW handlers for:
  - `GET /snippets` → returns fixture list
  - `POST /snippets` → creates + returns new snippet; returns 422 if fixture count ≥ 200
  - `PATCH /snippets/:id` → updates matching fixture snippet
  - `DELETE /snippets/:id` → removes matching fixture snippet; returns 200
- [x] 2.3 Register snippet handlers in `src/shared/mocks/browser.ts` (and `server.ts` if present) by importing and spreading `snippetHandlers`

## 3. Service & Query Hooks

- [x] 3.1 Create `src/modules/workspace/hooks/useSnippetsQuery.ts` — `useQuery` fetching `GET /snippets` with key `snippetKeys.list()`; returns `{ snippets, isLoading, isError }`
- [x] 3.2 Create `src/modules/workspace/hooks/useCreateSnippetMutation.ts` — `useMutation` posting `POST /snippets`; on success invalidates snippets list
- [x] 3.3 Create `src/modules/workspace/hooks/useUpdateSnippetMutation.ts` — `useMutation` patching `PATCH /snippets/:id`; on success invalidates snippets list
- [x] 3.4 Create `src/modules/workspace/hooks/useDeleteSnippetMutation.ts` — `useMutation` deleting `DELETE /snippets/:id`; optimistic update removes snippet from cache; on error restores previous cache
- [x] 3.5 Add snippet query keys to `src/modules/workspace/hooks/queryKeys.ts`: `snippets: () => ["snippets"] as const`, `snippet: (id: string) => ["snippets", id] as const`

## 4. Atomic Components

- [x] 4.1 Create `src/modules/workspace/components/atoms/SnippetTagBadge.tsx` — small pill badge rendering a `SnippetTag` label using `var(--accent)` background; accepts `tag: SnippetTag` prop
- [x] 4.2 Create `src/modules/workspace/components/atoms/SnippetWordCount.tsx` — inline label showing `N / 200 words`; warning color when ≥ 180 words; accepts `count: number` prop

## 5. Molecule Components

- [x] 5.1 Create `src/modules/workspace/components/molecules/SnippetCard.tsx` — card displaying snippet title, truncated content preview (2 skeleton lines of varying width), tag badges, plus "Insert" (primary) and "Delete" (ghost/destructive) buttons; accepts `snippet: Snippet`, `onInsert`, `onEdit`, `onDelete` callbacks
- [x] 5.2 Create `src/modules/workspace/components/molecules/SnippetSearchBar.tsx` — search input + "Search" button row; accepts `value`, `onChange`, `onSearch` props
- [x] 5.3 Create `src/modules/workspace/components/molecules/SnippetTagFilter.tsx` — horizontal row of tag toggle buttons (All, Chorus, Verse, Hook, Freestyle, Bridge); highlights active tag; accepts `activeTag`, `onTagChange` props
- [x] 5.4 Create `src/modules/workspace/components/molecules/SnippetFormDialog.tsx` — modal dialog with title input (required), content textarea (required, 200-word limit), tag multi-select; live word count via `SnippetWordCount`; validates with React Hook Form + Zod; accepts `open`, `onOpenChange`, `defaultValues`, `onSubmit` props

## 6. Organism Components

- [x] 6.1 Create `src/modules/workspace/components/organisms/SnippetList.tsx` — renders `SnippetSearchBar`, `SnippetTagFilter`, count badge (`N / 200 snippets`), scrollable list of `SnippetCard`s, empty state, and "+ New Snippet" bottom button; receives snippet data and all callbacks as props (no data fetching)
- [x] 6.2 Create `src/modules/workspace/components/organisms/WorkspaceWindowMenu.tsx` — floating checklist panel (bottom-right) with checkboxes for Thesaurus, AI Assistant, Snippets, Library; accepts `openPanels` state and `onToggle` callback; positioned with `fixed bottom-20 right-4`

## 7. SnippetsPanel (Draggable + Resizable Floating Window)

- [x] 7.1 Create `src/modules/workspace/components/templates/SnippetsPanel.tsx` — floating `div` with:
  - `position: fixed`, initial position `bottom: 80px, right: 320px`, initial size `380×520px`
  - Drag via `onPointerDown` on panel header → tracks `pointerId`, updates `translate(x,y)` via CSS transform; clamp x/y to viewport bounds on `pointerup`
  - Resize via bottom-right corner handle → updates width/height with min `300×400px`
  - Renders title bar ("Verse Snippets"), close button (×), and `children` slot
  - Accepts `onClose` callback

## 8. Wire Up EditorPage

- [x] 8.1 Add `openPanels` state to `EditorPage` (`useState<Set<string>>(new Set())`) tracking which workspace tools are visible
- [x] 8.2 Integrate `WorkspaceWindowMenu` into `EditorPage` — renders as a fixed overlay; passes `openPanels` and `onToggle` (adds/removes panel key from Set)
- [x] 8.3 Conditionally render `SnippetsPanel` inside `EditorPage` when `"snippets"` is in `openPanels`
- [x] 8.4 Connect snippet data hooks inside `EditorPage` (or a dedicated `SnippetsPanelContainer` sub-component): `useSnippetsQuery`, `useCreateSnippetMutation`, `useUpdateSnippetMutation`, `useDeleteSnippetMutation`
- [x] 8.5 Implement "Insert" handler in `EditorPage` — splits snippet content by newlines, maps each non-empty line to a new Bar, appends to the last section via `setBars`; expose as `handleInsertSnippet(content: string)` callback passed down to `SnippetList`

## 9. Snippet Create / Edit / Delete Flow

- [x] 9.1 Wire "+ New Snippet" button to open `SnippetFormDialog` with empty `defaultValues`; on submit call `useCreateSnippetMutation.mutate`
- [x] 9.2 Wire "Edit" (via snippet card) to open `SnippetFormDialog` pre-populated with selected snippet's current values; on submit call `useUpdateSnippetMutation.mutate`
- [x] 9.3 Wire "Delete" button to call `useDeleteSnippetMutation.mutate`; show toast on error (use `sonner`)

## 10. Verification

- [x] 10.1 Verify panel opens/closes via the workspace window menu checkbox
- [x] 10.2 Verify panel is draggable and stays within viewport bounds
- [x] 10.3 Verify panel is resizable with minimum size constraints respected
- [x] 10.4 Verify snippet list renders fixture data from MSW mock on page load
- [x] 10.5 Verify search filters snippet list by keyword
- [x] 10.6 Verify tag filter narrows snippet list to selected tag
- [x] 10.7 Verify creating a snippet adds it to the top of the list
- [x] 10.8 Verify editing a snippet updates the card content in the list
- [x] 10.9 Verify deleting a snippet removes it from the list immediately
- [x] 10.10 Verify 200-word limit validation blocks form submission with the correct error message
- [ ] 10.11 Verify 200-snippet limit returns 422 from MSW mock and shows error in UI
- [x] 10.12 Verify "Insert" adds snippet lines as new bars in the correct section
- [x] 10.13 Run `pnpm lint` and `pnpm build` — confirm zero errors
