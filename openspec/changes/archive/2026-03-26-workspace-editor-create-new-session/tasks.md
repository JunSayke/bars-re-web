## 1. Schema & Types

- [x] 1.1 Add `createSessionPayloadSchema` (title: string, topic: optional string) to `workspace.schema.ts`
- [x] 1.2 Add `createSessionResponseSchema` (reuse `sessionSummarySchema`) to `workspace.schema.ts`
- [x] 1.3 Export `CreateSessionPayload` and `CreateSessionResponse` types from `workspace.schema.ts`
- [x] 1.4 Re-export new types from `workspace/types/workspace.types.ts`

## 2. Service Layer

- [x] 2.1 Add `createSession(payload: CreateSessionPayload): Promise<CreateSessionResponse>` to `workspace.service.ts` — `POST /sessions`

## 3. Mock Layer

- [x] 3.1 Add `buildMockSession(overrides?: Partial<SessionSummary>): SessionSummary` factory to `workspace.fixtures.ts`
- [x] 3.2 Add `POST /sessions` handler to `workspace.handlers.ts` — checks `sessions.length >= 100`, returns 429 if exceeded; otherwise creates a new `SessionSummary` via `buildMockSession`, appends to in-memory list, returns the new record with status 201

## 4. Mutation Hook

- [x] 4.1 Create `useCreateSessionMutation.ts` in `workspace/hooks/` — uses `useMutation`, calls `createSession`, on success invalidates `workspaceKeys.sessions()` and navigates to `/workspaces/editor?id=<sessionId>` via `useRouter`, on error shows a toast

## 5. Dialog Component

- [x] 5.1 Create `NewSessionDialog.tsx` as a molecule in `workspace/components/molecules/` — accepts `open: boolean` and `onOpenChange: (open: boolean) => void` props
- [x] 5.2 Implement the dialog form with React Hook Form + Zod (`createSessionPayloadSchema`) — SESSION TITLE field (required), TOPIC OR IDEA textarea (optional)
- [x] 5.3 Wire form submit to `useCreateSessionMutation` — show loading state on Create Session button while `isPending`, show validation error under title field when empty, close dialog on success
- [x] 5.4 Match UI design from screenshot: dark dialog background, uppercase field labels, asterisk on required field, italic "(optional)" on topic label, Cancel (ghost/secondary) and CREATE SESSION (primary) buttons

## 6. Page Wiring

- [x] 6.1 Update `WorkspacesPage.tsx` — add `useState<boolean>` for `dialogOpen`, replace `router.push` on the New Session button with `setDialogOpen(true)`, render `<NewSessionDialog open={dialogOpen} onOpenChange={setDialogOpen} />`

## 7. Barrel Exports

- [x] 7.1 Verify `NewSessionDialog` does not need to be exported from `workspace/index.ts` (it is consumed only by `WorkspacesPage` inside the same module — no export required)
