## Context

The settings module already has a working `ProfilePage` (display name + avatar URL text input) backed by `useProfileQuery` / `useUpdateProfileMutation` services that read and write to the `profiles` Supabase table. However:

- No avatar preview is shown — the URL field is blind.
- The page has no header to anchor users visually.
- `WorkspacesTopNav` hardcodes `"U"` for the user avatar and wires the gear icon to an `onSettingsClick` callback prop rather than navigating to settings.
- `EditorTopNav` has the same gear-icon callback pattern.
- `app/settings/account/page.tsx` is a bare stub — no UI for changing email or password.

The reference screenshot shows a dark-card layout with titled sections (Change Email, Change Password), purple primary buttons, and subtle icon headers — matching the existing dark-mode palette in `globals.css`.

---

## Goals / Non-Goals

**Goals:**
- Add a styled page header (`Profile Settings` + subtitle) to `ProfilePage`.
- Render the user's avatar image inside `ProfilePage` above the form, with a live preview as the URL field updates, and a fallback initials circle.
- In `WorkspacesTopNav`, replace the hardcoded `"U"` button with a real avatar that loads from `useProfileQuery`.
- Convert the gear icon in both `WorkspacesTopNav` and `EditorTopNav` from a callback prop to a Next.js `<Link href="/settings/profile">`.
- Build `AccountPage` (Change Email + Change Password) matching the reference UI screenshot; wire it into `app/settings/account/page.tsx`.

**Non-Goals:**
- File-upload for avatars (URL-based only for now).
- Supabase Auth email-change flow requiring re-verification (only UI scaffolding is in scope; the actual auth email-update mutation may be left as a future task).
- Role-based access / admin settings.
- Dark-mode toggle UI (already handled by `globals.css`).

---

## Decisions

### 1. Avatar preview via `watch` from React Hook Form
**Decision:** Use `useWatch` (or `watch`) from React Hook Form inside `ProfilePage` to reactively read the `avatarUrl` field and render a preview `<img>` / shadcn `<Avatar>` next to the form.

**Why:** The URL already flows through RHF; reading it via `watch` avoids local state duplication and stays in sync automatically.

**Alternative considered:** A separate `useState` mirrored on change — rejected for extra complexity.

### 2. Gear icon becomes a `<Link>` not a callback
**Decision:** Remove the `onSettingsClick` prop from both `WorkspacesTopNav` and `EditorTopNav`; replace the `<button>` with `<Link href="/settings/profile">`.

**Why:** No parent currently passes a meaningful `onSettingsClick` handler. A direct link is simpler, more accessible, and removes a dead prop.

**Alternative considered:** Keep the prop but default it to a router push — rejected as unnecessary indirection.

### 3. Real avatar in `WorkspacesTopNav` via `useProfileQuery`
**Decision:** Call `useProfileQuery()` inside `WorkspacesTopNav`. Use shadcn `<Avatar>` / `<AvatarImage>` / `<AvatarFallback>` to display the user's image or their display-name initial.

**Why:** The hook is already available in the settings module and returns `avatarUrl` + `displayName`. Reusing it keeps the data layer consistent.

**Boundary note:** `WorkspacesTopNav` lives in `src/modules/workspace/organisms/`. It is allowed to import from `src/modules/settings/index.ts` — but `settings` must export `useProfileQuery` from its barrel if it doesn't already. **Modules do not import from sibling internals**, only from the barrel (`index.ts`).

**Alternative considered:** Pass avatar URL as a prop drilled from a parent Server Component — rejected because `WorkspacesTopNav` is already a Client Component and has its own auth logic; a hook call is cleaner.

### 4. AccountPage as a new module component
**Decision:** Create `src/modules/settings/components/AccountPage.tsx` with two section cards (Change Email, Change Password). Each section uses its own RHF `useForm` instance. Export the component via `src/modules/settings/index.ts`.

**Why:** Matches the existing pattern (`ProfilePage.tsx` → `app/settings/profile/page.tsx`). The account page stub already imports from `@/modules/settings` in the same manner.

**Actions/services for email+password updates:** Use Supabase client methods `supabase.auth.updateUser({ email })` and `supabase.auth.updateUser({ password })` called inside `useMutation` hooks scoped to the settings module.

### 5. UI style — card sections matching reference screenshot
**Decision:** Each settings section (`Change Email`, `Change Password`) is wrapped in a `<Card>` (`bg-card rounded-xl border border-border/40 p-6`) with a small colored icon badge in the header, matching the dark-card look from the screenshot.

**Why:** Consistent with the existing dark-background design tokens in `globals.css` (dark mode: `--card: oklch(0.2795 ...)`, `--primary: oklch(0.6056 ... 292.7`)). The purple primary button (`Button variant="default"`) already matches the reference.

---

## Risks / Trade-offs

- **Avatar blinking on initial load** (WorkspacesTopNav): `useProfileQuery` has a loading state. While profile loads, show the fallback initial `U`. This is acceptable UX for a first load. → No mitigation needed beyond the existing skeleton approach.
- **Email-change auth flow (Supabase):** Changing email via `supabase.auth.updateUser({ email })` sends a confirmation link to the new address; the change is not instant. The UI should surface a toast/info message: "A confirmation link has been sent to your new email." → include success message in mutation `onSuccess`.
- **Prop removal (onSettingsClick):** Any callers that currently pass `onSettingsClick` to `WorkspacesTopNav` or `EditorTopNav` will get a TypeScript error after the prop is removed. → Check all call sites and clean the prop before merging.

---

## Migration Plan

1. Update `WorkspacesTopNav` and `EditorTopNav` (remove prop, add Link, add avatar).
2. Update `ProfilePage` (add header, avatar preview section).
3. Create `AccountPage` with Change Email + Change Password sections.
4. Wire `app/settings/account/page.tsx` to `AccountPage`.
5. Export new hooks/components from settings `index.ts`.
6. Add new mutation hooks (`useUpdateEmailMutation`, `useUpdatePasswordMutation`) under `src/modules/settings/hooks/`.

No database migrations required. No rollback needed — all changes are UI/client-side.

---

## Open Questions

- Should the `onSettingsClick` prop be fully removed or deprecated? (Assumed: remove — no active callers.)
- Should `useProfileQuery` data be lifted to a context provider to avoid duplicate fetches across `WorkspacesTopNav` and `ProfilePage`? (Assumed: defer — TanStack Query deduplicates in-flight requests with the same key.)
