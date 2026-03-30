## 1. Top Navigation Updates

- [x] 1.1 Remove `onSettingsClick` prop from `EditorTopNav` and replace the gear `<button>` with `<Link href="/settings/profile">` from `next/link`
- [x] 1.2 Remove `onSettingsClick` prop from `WorkspacesTopNav` and replace the gear `<button>` with `<Link href="/settings/profile">` from `next/link`
- [x] 1.3 In `WorkspacesTopNav`, import `useProfileQuery` from `@/modules/settings` and replace the hardcoded `"U"` avatar button with a shadcn `<Avatar>` / `<AvatarImage>` / `<AvatarFallback>` that displays `avatarUrl` or the user's first initial
- [x] 1.4 Verify `useProfileQuery` is exported from `src/modules/settings/index.ts`; add export if missing
- [x] 1.5 Remove any `onSettingsClick` prop being passed to `WorkspacesTopNav` or `EditorTopNav` at their call sites

## 2. Profile Settings Page Enhancements

- [x] 2.1 Add a styled page header block to `ProfilePage.tsx` (title: "Profile Settings", subtitle: "Manage your display name and avatar.")
- [x] 2.2 Add a `useWatch` call (or `watch("avatarUrl")`) in `ProfilePage` to get the live avatar URL value from RHF
- [x] 2.3 Render a shadcn `<Avatar>` preview above the form that shows `<AvatarImage>` when `watchedAvatarUrl` is non-empty, and `<AvatarFallback>` with the first letter of `displayName` otherwise
- [x] 2.4 Ensure the Avatar preview size is large enough to be useful (e.g. `size-20` / `size-24`)
- [x] 2.5 Confirm the Avatar URL field still shows helper text "Paste a link to your avatar image."

## 3. Account Settings Page

- [x] 3.1 Create `src/modules/settings/hooks/useUpdateEmailMutation.ts` — calls `supabase.auth.updateUser({ email })` inside a TanStack `useMutation`
- [x] 3.2 Create `src/modules/settings/hooks/useUpdatePasswordMutation.ts` — calls `supabase.auth.updateUser({ password })` inside a TanStack `useMutation`
- [x] 3.3 Add Zod schemas for `UpdateEmailPayload` and `UpdatePasswordPayload` in `src/modules/settings/schemas/settings.schema.ts`
- [x] 3.4 Create `src/modules/settings/components/AccountPage.tsx` with:
  - Page header ("Account Settings" + subtitle)
  - "Change Email" card section with Current Email (read-only) + New Email input + "Update Email" button
  - "Change Password" card section with Current Password + New Password + Confirm New Password inputs + "Change Password" button
  - Each section uses `useForm` + `zodResolver` with the corresponding schema
  - Mutations wired to submit handlers with success/error feedback
- [x] 3.5 Export `AccountPage` from `src/modules/settings/index.ts`
- [x] 3.6 Update `app/settings/account/page.tsx` to import and render `AccountPage` (same thin wrapper pattern as `ProfilePage`)

## 4. Validation & Cleanup

- [x] 4.1 Run `pnpm build` and fix any TypeScript errors from removed `onSettingsClick` prop
- [x] 4.2 Verify avatar preview updates live on the Profile Settings page by running `pnpm dev` and editing the Avatar URL field
- [x] 4.3 Verify the Account Settings page renders correctly at `/settings/account` in dev mode
- [x] 4.4 Verify clicking the gear icon in both `WorkspacesTopNav` and `EditorTopNav` navigates to `/settings/profile`
