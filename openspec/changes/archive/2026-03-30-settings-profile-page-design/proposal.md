## Why

The Settings Profile page currently exists as a minimal text form with no visual identity — no avatar preview, no styled header, and no navigation affordance to reach settings from within the app. Users on both the Workspaces and Editor pages have a gear icon but no quick path to their profile, and the avatar URL field is a blind text input with no feedback.

## What Changes

- Add a page header to `ProfilePage` matching the dark-card style from the Account Settings screenshot (title + subtitle).
- Enhance the Avatar URL field: add a live image preview that renders the user's avatar when a valid URL is present, with a fallback initials circle using the primary color.
- Update the user avatar button in `WorkspacesTopNav` and the editor's top nav to display the user's actual avatar image (from profile) instead of the hardcoded `U` letter.
- Add a gear icon (`settings`) to every top-nav header that routes to `/settings/profile`.
- Ensure the Account Settings page (`app/settings/account/`) is implemented with the full UI from the provided screenshot (Change Email + Change Password sections).

## Capabilities

### New Capabilities
- `settings-profile-page`: Enhanced Profile Settings page with page header, avatar preview, and live image display.
- `settings-account-page`: Account Settings page with Change Email and Change Password sections matching the reference UI.

### Modified Capabilities
- `manage-sessions`: `WorkspacesTopNav` gear icon now navigates to `/settings/profile` instead of invoking `onSettingsClick`; avatar shows real user image.

## Impact

- `src/modules/settings/components/ProfilePage.tsx` — primary edit target.
- `src/modules/workspace/components/organisms/WorkspacesTopNav.tsx` — avatar + gear link update.
- `src/modules/workspace/components/organisms/EditorTopNav.tsx` — gear link update.
- `app/settings/account/page.tsx` — scaffold full AccountSettingsPage component.
- New component: `src/modules/settings/components/AccountPage.tsx`.
- No database schema changes; avatar URL already stored in `profiles.avatar_url`.
- No new dependencies; uses existing shadcn/ui (`Avatar`, `Button`, `Input`, `Label`, `Card`) and Lucide icons.
