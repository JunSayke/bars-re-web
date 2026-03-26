## Why

Users on the Workspaces page need a way to start a new rap writing session — currently the "New Session" button exists in the UI but triggers no action. Without session creation, the core write-and-edit flow is unreachable, blocking the primary product value.

## What Changes

- Add a **New Rap Session** modal dialog triggered by the "New Session" button on the Workspaces page.
- Implement a `useCreateSessionMutation` hook that calls `POST /sessions` via MSW mock.
- Add a mock `POST /sessions` handler and session fixtures to `workspace` module mocks.
- On successful creation, navigate the user to `/workspaces/editor?id=<sessionId>`.
- Session title is required; topic/idea is optional. If no title is provided, a default `"Untitled — [date]"` is auto-applied client-side before submission.
- Display an inline validation error if title is empty on submit.
- Disable the "Create Session" button and show a loading state while the request is in flight.
- Show an error toast if the mock returns a failure (e.g., 429 session limit reached).

## Capabilities

### New Capabilities

- `create-new-session`: Introduces the dialog-based flow for creating a new rap writing session from the Workspaces page, including form validation, mutation hook, MSW mock, and post-creation navigation.

### Modified Capabilities

- `manage-sessions`: The "New Session" button on the session list page must be wired to open the new dialog. This is a behavioral change to an existing UI element (not a spec-level requirement change — no existing spec requirement is being removed or replaced, only the button's previously inert state is activated).

## Impact

- `src/modules/workspace/components/` — new atoms, molecules, organisms, and templates for the dialog and page wiring
- `src/modules/workspace/hooks/` — `useCreateSessionMutation.ts` (new)
- `src/modules/workspace/mocks/` — `workspace.handlers.ts` extended with `POST /sessions`; `workspace.fixtures.ts` extended with session factory data
- `src/modules/workspace/schemas/` — Zod schema for `CreateSessionInput`
- `src/modules/workspace/types/` — `Session` type (new or extended)
- `app/workspaces/page.tsx` — no change (WorkspacesPage already owns the button; wiring happens inside the module)
- No new routes, no new pages — the dialog is rendered inline on the existing Workspaces page
