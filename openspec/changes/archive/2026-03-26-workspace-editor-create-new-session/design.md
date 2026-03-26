## Context

The Workspaces page (`WorkspacesPage`) currently has a "New Session" button that navigates directly to `/workspaces/editor` via `router.push`. This bypasses session creation entirely — no record is persisted, no title is captured, and the editor receives no session ID to load. The `manage-sessions` spec operates on the assumption that sessions exist and have IDs, so the missing creation step is a foundational gap.

The workspace module already has a complete service layer (`workspace.service.ts`), Zod schemas (`workspace.schema.ts`), MSW handlers and fixtures (`workspace.handlers.ts` / `workspace.fixtures.ts`), and an established pattern for mutation hooks modeled after `useRenameSessionMutation` and `useDeleteSessionMutation`. There is also a pattern for modal dialogs established by `RenameSessionDialog` and `DeleteSessionDialog`.

This change introduces the missing link: a session creation dialog with form validation, a mutation hook, and post-creation navigation that carries the new session ID to the editor.

## Goals / Non-Goals

**Goals:**
- Add a controlled `NewSessionDialog` component (Dialog + form) with a required `SESSION TITLE` field and an optional `TOPIC OR IDEA` textarea.
- Wire the "New Session" button in `WorkspacesPage` to open the dialog instead of navigating directly to the editor.
- Implement `useCreateSessionMutation` following the same pattern as other mutation hooks in the module.
- Add `createSession` to `workspace.service.ts` (`POST /sessions`).
- Add `createSessionPayloadSchema` and `CreateSessionPayload` / `CreateSessionResponse` to `workspace.schema.ts`.
- Add `POST /sessions` to `workspace.handlers.ts` and a `buildMockSession` factory function to `workspace.fixtures.ts`.
- On success, navigate the user to `/workspaces/editor?id=<sessionId>` and invalidate the sessions query.
- Show a loading state on the Create Session button while the mutation is in flight.
- Show an error toast if the mock returns an error (e.g., 429 session limit exceeded).
- Client-side: if title is blank on submit, auto-apply `"Untitled — <date>"` before sending.

**Non-Goals:**
- Beat import or playback — out of scope for session creation.
- Editing existing session metadata after creation.
- EditorPage changes to read the `id` query param — that is tracked separately.
- Real backend integration — all data is mocked via MSW.
- Session limit UI enforcement (no count check before opening the dialog) — the server/mock layer returns an error if the limit is exceeded; the dialog just shows a toast.

## Decisions

### 1. Dialog-controlled state lives in `WorkspacesPage`

**Decision:** `NewSessionDialog` accepts `open` and `onOpenChange` props; `WorkspacesPage` owns the open state via `useState`.

**Rationale:** Keeps the dialog stateless (controlled), which aligns with the existing pattern used by `RenameSessionDialog` and `DeleteSessionDialog`. The dialog doesn't need to know where it's rendered. Alternative (uncontrolled, dialog manages its own open state) was rejected because it makes it harder to trigger from multiple entry points in the future.

---

### 2. Form management via React Hook Form + Zod, consistent with auth module

**Decision:** Use `useForm` from React Hook Form and `zodResolver` for the `NewSessionDialog` form.

**Rationale:** The auth module establishes this as the codebase pattern. Using raw controlled inputs or `useState` for form state would diverge from the established convention. The schema (`createSessionPayloadSchema`) lives in `workspace.schema.ts`.

---

### 3. Auto-title generated client-side before mutation dispatch

**Decision:** If the user leaves the title blank and submits, the hook or the dialog pre-fills `"Untitled — <YYYY-MM-DD>"` before passing the payload to `mutate`.

**Rationale:** Simpler to apply client-side in the submit handler than to handle it in a `beforeMutate` adapter. The SDD specifies this as AF-1 (Quick Start) — it is user-facing behavior, not backend logic. Since the title field is marked required in the form schema, a blank submit is prevented by validation; however, a separate "Quick Start" path (submitting via Enter with no title) uses the auto-title. Implementation: if the title resolves as empty after trim, replace with the generated default before calling `mutate`.

> **Note:** Based on the screenshot showing `SESSION TITLE *` as required, the primary path enforces non-empty. The Quick Start path is a secondary option. For this implementation, title is required via form validation.

---

### 4. Post-creation navigation passes `id` as a query param

**Decision:** After successful creation, navigate to `/workspaces/editor?id=<sessionId>`.

**Rationale:** Next.js App Router pages receive search params as props. The editor page needs a session ID to load the correct session. Using a query param is stateless and shareable (e.g., bookmarkable URL). Alternative (storing session ID in a global store like Zustand) was rejected as over-engineered for this pattern.

---

### 5. `CreateSessionResponse` extends `SessionSummary`

**Decision:** The `POST /sessions` response schema reuses `SessionSummary` — same shape as what the sessions list query returns.

**Rationale:** Avoids duplicating schema shape. The mock can simply push the new session summary into the in-memory sessions array and return it as the response. The created session ID for navigation is trivially read from the response.

---

### 6. MSW mock enforces 100-session limit with 429 response

**Decision:** The `POST /sessions` mock handler checks `sessions.length >= 100` before creating and returns `HttpResponse.json({ message: "Session limit reached" }, { status: 429 })` if exceeded.

**Rationale:** Aligns with the SDD (E-1 scenario). The error toast in `useCreateSessionMutation`'s `onError` handler covers this case with a user-friendly message.

## Risks / Trade-offs

- **EditorPage does not yet read `?id` param** → After navigation, the editor will load `mockSession` (the hardcoded fixture) regardless of the created session ID. This is an acceptable trade-off for the mock phase; it does not break the flow and is addressed by a separate change.
- **In-memory mock sessions list is module-level mutable state** → The existing `workspace.handlers.ts` already uses this pattern (`let sessions = [...mockSessions]`). The `POST` handler extends the same list. This is fine for dev/mock; not used in production.
- **Dialog does not reset form on close** → React Hook Form resets to defaults on unmount when `shouldUnregister` is left at default value. This is acceptable for this modal pattern.
