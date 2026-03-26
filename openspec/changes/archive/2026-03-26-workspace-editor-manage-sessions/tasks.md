## 1. Schema & Types

- [x] 1.1 Add `sessionSummarySchema` (Zod) to `workspace.schema.ts` — fields: `id`, `title`, `topic`, `previewSnippet`, `thumbnailType`, `lastModifiedAt`
- [x] 1.2 Export `SessionSummary` and `ThumbnailType` types from `workspace.schema.ts`
- [x] 1.3 Add `renameSessionPayloadSchema` (`{ title: string }`) and `renameSessionResponseSchema` to `workspace.schema.ts`

## 2. Mock Data & Handlers

- [x] 2.1 Replace `workspace.fixtures.ts` session list: add `mockSessions: SessionSummary[]` array with 4 realistic Bisaya rap sessions (varying topics: "STREET LIFE", "HUSTLE", "REGGAE RAP", "IMPROV"; relative timestamps)
- [x] 2.2 Add `GET /sessions` handler to `workspace.handlers.ts` — returns `mockSessions` array
- [x] 2.3 Add `PATCH /sessions/:id/rename` handler — finds session in `mockSessions` by id, updates title, returns updated `SessionSummary`
- [x] 2.4 Add `DELETE /sessions/:id` handler — returns `204 No Content`

## 3. Service Layer

- [x] 3.1 Create `src/modules/workspace/services/workspace.service.ts` (or extend if exists) — add `getSessions()`, `renameSession(id, title)`, `deleteSession(id)` functions using `fetch` against `NEXT_PUBLIC_API_URL`

## 4. Query Hooks

- [x] 4.1 Create `src/modules/workspace/hooks/useSessionsQuery.ts` — TanStack Query `useQuery` fetching `GET /sessions`, query key `["sessions"]`
- [x] 4.2 Create `src/modules/workspace/hooks/useRenameSessionMutation.ts` — `useMutation` for PATCH rename, invalidates `["sessions"]` on success
- [x] 4.3 Create `src/modules/workspace/hooks/useDeleteSessionMutation.ts` — `useMutation` for DELETE, optimistic cache update (remove) with rollback on error, shows error toast via `sonner` on failure

## 5. Atom Components

- [x] 5.1 Create `src/modules/workspace/components/atoms/SessionThumbnail.tsx` — renders a Lucide icon (`FileText` for lyrics, `AudioLines` for beat-linked) based on `thumbnailType` prop; inside a small square rounded container
- [x] 5.2 Create `src/modules/workspace/components/atoms/TopicBadge.tsx` — renders a `<Badge>` (shadcn) with `variant="outline"` and uppercase topic text in a muted accent color
- [x] 5.3 Create `src/modules/workspace/components/atoms/SessionCountBar.tsx` — renders "X/100 SESSIONS" label + `<Progress>` (shadcn) bar showing percentage of 100

## 6. Molecule Components

- [x] 6.1 Create `src/modules/workspace/components/molecules/SessionOverflowMenu.tsx` — shadcn `DropdownMenu` triggered by a `MoreHorizontal` icon button; items: "Rename" (calls `onRename` prop), "Delete" (calls `onDelete` prop)
- [x] 6.2 Create `src/modules/workspace/components/molecules/RenameSessionDialog.tsx` — shadcn `Dialog` with a controlled text input and "Cancel" / "Save" buttons; "Save" disabled when input is empty; calls `onConfirm(newTitle)` prop
- [x] 6.3 Create `src/modules/workspace/components/molecules/DeleteSessionDialog.tsx` — shadcn `AlertDialog` with "Cancel" and "Delete" (destructive) buttons; calls `onConfirm()` prop
- [x] 6.4 Create `src/modules/workspace/components/molecules/SessionCard.tsx` — composes `SessionThumbnail`, `TopicBadge`, preview snippet text, timestamp, `SessionOverflowMenu`, and stub play button (`Play` icon); calls `onOpen` on card body click

## 7. Organism Component

- [x] 7.1 Create `src/modules/workspace/components/organisms/SessionsList.tsx` — renders `SessionCountBar`, list of `SessionCard`s (with wired rename/delete mutations and dialogs), or `EmptyState` when list is empty; wires `RenameSessionDialog` and `DeleteSessionDialog` with local open/close state

## 8. Page Assembly

- [x] 8.1 Update `WorkspacesPage.tsx` — replace placeholder with page layout: page title "Sessions", `SessionCountBar`, "New Session" button (stub, navigates to `/workspaces/editor` with no id), and `SessionsList`; use `useSessionsQuery` for data

## 9. Barrel Exports & Integration

- [x] 9.1 Verify `src/modules/workspace/index.ts` still exports `WorkspacesPage` and `EditorPage` correctly after changes
- [x] 9.2 Ensure `src/shared/mocks/browser.ts` includes workspace handlers (verify `workspaceHandlers` is imported and spread in the handlers list)
