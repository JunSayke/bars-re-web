## Why

The Editor Workspace needs a dedicated Verse Snippets panel — a floating, draggable, and resizable workspace tool that acts as a creative draft room for lyric notes, bars, and reusable phrases. Without it, rappers lose ideas between sessions and have no structural way to organize, reuse, or insert saved content into their active session.

## What Changes

- Add a new **Verse Snippets panel** to the Editor Workspace as a draggable, resizable floating window
- Enable the panel to be toggled from the Workspace Window Menu (bottom-right corner button)
- Allow users to **create** new verse snippets with freeform content and optional tags
- Allow users to **edit** existing verse snippets inline
- Allow users to **delete** verse snippets with a confirmation step
- Allow users to **search** snippets by content keyword
- Allow users to **filter** snippets by tag (All, Chorus, Verse, Hook, Freestyle, Bridge)
- Allow users to **insert** a snippet's content into the active session at the current cursor position
- Enforce business rules: max 200 snippets per user, max 200 words per snippet
- Add MSW mock handlers and fixture data for all snippet CRUD operations

## Capabilities

### New Capabilities

- `manage-verse-snippets`: Full CRUD management of verse snippets within the Editor Workspace — creating, editing, deleting, searching, filtering by tag, and inserting snippets into the active session. Includes a draggable/resizable floating panel UI, word-count and snippet-limit enforcement, and tag-based organization.

### Modified Capabilities

<!-- No existing capabilities have requirement-level changes in this transaction. -->

## Impact

- **src/modules/workspace/**: New types, schemas, hooks, services, and components for snippets
  - `types/snippet.types.ts` — Snippet and Tag domain types
  - `schemas/snippet.schema.ts` — Zod validation schemas
  - `hooks/useSnippets.ts` — TanStack Query hooks (list, create, update, delete)
  - `mocks/snippet.fixtures.ts` — Fixture snippets and tags
  - `mocks/snippet.handlers.ts` — MSW handlers for `/snippets` endpoints
  - New atomic components: `SnippetCard`, `SnippetTagBadge`, `SnippetCountBadge`
  - New molecule: `SnippetListItem`, `SnippetSearchBar`, `SnippetTagFilter`
  - New organisms: `SnippetList`, `SnippetFormDialog`
  - New template wrapper: `SnippetsPanel` (draggable + resizable floating window)
- **EditorPage.tsx**: Wire in panel toggle state from workspace window menu
- **src/shared/mocks/**: Register new snippet MSW handlers
- **No new routes** — panel lives within the existing `/workspaces/editor` page
- **No external dependencies added** — uses existing react-hook-form, zod, @tanstack/react-query, and shadcn/ui primitives; draggable behavior uses CSS + pointer events (no new drag library)
