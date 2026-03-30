## Why

The workspace module currently has a placeholder `WorkspacesPage` with no session management functionality. Users need to view, open, rename, and delete their rap writing sessions from a centralized library view before they can begin editing. This is the entry point to the entire editor experience.

## What Changes

- Add a fully functional `WorkspacesPage` that lists all sessions belonging to the authenticated user
- Display session count indicator (e.g. "24/100 SESSIONS") with a progress bar
- Each session card shows: thumbnail icon, title, topic badge, bar preview snippet, last modified timestamp, overflow menu, and a play button
- Three-dot overflow menu per card with **Rename** and **Delete** actions
- Inline rename interaction (inline input or dialog)
- Delete confirmation dialog before permanent removal
- Empty state UI when the user has no sessions
- Error toast when a delete or rename operation fails
- Mock API handlers for `GET /sessions`, `PATCH /sessions/:id/rename`, `DELETE /sessions/:id`
- Session fixtures with realistic Bisaya rap session data

## Capabilities

### New Capabilities

- `manage-sessions`: Browse, rename, and delete rap writing sessions from the workspace library view. Includes session list rendering, overflow menu actions, inline rename, confirmation-gated delete, empty state, and error feedback.

### Modified Capabilities

*(none — no existing caps change requirements)*

## Impact

- `src/modules/workspace/components/WorkspacesPage.tsx` — full replacement with real UI
- `src/modules/workspace/mocks/workspace.fixtures.ts` — add session list fixtures
- `src/modules/workspace/mocks/workspace.handlers.ts` — add list, rename, delete handlers
- `src/modules/workspace/schemas/workspace.schema.ts` — add/extend session schema types
- `src/modules/workspace/types/workspace.types.ts` — session list types
- `src/modules/workspace/hooks/` — new query hooks (`useSessionsQuery`, `useRenameSessionMutation`, `useDeleteSessionMutation`)
- `src/modules/workspace/services/workspace.service.ts` — API calls for session operations
- New atomic/molecule components under `src/modules/workspace/components/` (session card, overflow menu, dialogs)
- `src/shared/mocks/` — updated to include new handlers
