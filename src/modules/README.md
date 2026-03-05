# Modules

Each feature lives under `src/modules/<feature-name>/` and is divided into four layers.

```
src/modules/
├─ editor-workspace/
├─ ai-analyzer-feedback/
├─ snippet-management/
├─ thesaurus/
└─ user-management/
```

---

## Layer Structure

```
<feature>/
├─ domain/
├─ application/
│  └─ dto/
├─ infrastructure/
└─ presentation/
   ├─ components/
   │  ├─ atoms/
   │  ├─ molecules/
   │  └─ organisms/
   └─ hooks/
```

> Only create a folder when you have files to put in it. Don't pre-create empty layers.

---

## 1. `domain/`

Pure business concepts — **no React, no Next.js, no HTTP**.

| Convention | What it is | Example |
|-----------|-----------|---------|
| `<noun>.types.ts` | TypeScript interfaces and type aliases shared across the feature's layers. The most common file in this layer. | `editor.types.ts` |
| `<noun>.constants.ts` | Named constants scoped to the feature (limits, status values, magic strings). | `editor.constants.ts` |
| `<noun>.errors.ts` | Typed error classes for rule violations or invalid states. Add only when a plain `Error` message isn't enough. | `editor.errors.ts` |
| `<noun>.entity.ts` | *(optional)* An object with a unique identity and business rules attached to it. Add only when the concept clearly owns behavior beyond what a plain type provides. | `workspace.entity.ts` |
| `<noun>.value-object.ts` | *(optional)* An immutable object defined entirely by its value, not by identity. Add only when immutability and structural equality need to be enforced explicitly. | `line-content.value-object.ts` |

```typescript
// workspace.types.ts — shared interfaces used across all layers
export type EditorMode = "write" | "review" | "preview";

export interface WorkspaceLine {
  id: string;
  text: string;
  index: number;
}

export interface Workspace {
  id: string;
  title: string;
  lines: WorkspaceLine[];
}
```

```typescript
// editor.constants.ts — named constants, no magic values in code
export const MAX_LINE_LENGTH = 280;
export const DEFAULT_EDITOR_MODE: EditorMode = "write";
export const AUTOSAVE_DELAY_MS = 2000;
```

```typescript
// editor.errors.ts — typed errors for known failure states
export class WorkspaceNotFoundError extends Error {
  constructor(id: string) {
    super(`Workspace "${id}" does not exist`);
    this.name = "WorkspaceNotFoundError";
  }
}
```

```typescript
// workspace.entity.ts — identity + business rules (add only when a plain type isn't enough)
export class WorkspaceEntity {
  constructor(
    readonly id: string,
    private title: string,
    private lines: string[]
  ) {}

  rename(title: string) {
    if (!title.trim()) throw new Error("Title cannot be blank");
    this.title = title;
  }

  getTitle() { return this.title; }
}
```

```typescript
// line-content.value-object.ts — immutable, equality by value (add only when you need enforced immutability)
export class LineContent {
  readonly text: string;

  constructor(text: string) {
    this.text = text.trim();
  }

  equals(other: LineContent) {
    return this.text === other.text;
  }
}
```

---

## 2. `application/`

Use-case orchestration and repository interfaces. **No React, no framework imports.**

| Convention | What it is | Example |
|-----------|-----------|---------|
| `<noun>.repository.ts` | A TypeScript interface that declares what data operations this feature needs. Infrastructure provides the concrete implementation. | `workspace.repository.ts` |
| `<noun>.utils.ts` | Pure, side-effect-free helpers for transforming or validating data. Not tied to React. | `editorContent.utils.ts` |
| `<verb>-<noun>.use-case.ts` | *(optional)* A single user-facing action. Add when orchestration logic is complex enough that a hook alone becomes hard to follow. | `save-workspace.use-case.ts` |

```typescript
// workspace.repository.ts — interface only; infrastructure implements this
import type { Workspace } from "../domain/workspace.types";

export interface WorkspaceRepository {
  findById(id: string): Promise<Workspace | null>;
  findAll(): Promise<Workspace[]>;
  save(workspace: Workspace): Promise<void>;
  delete(id: string): Promise<void>;
}
```

```typescript
// editorContent.utils.ts — pure helpers, no side effects, no React
export function truncateTitle(title: string, max = 50): string {
  return title.length > max ? `${title.slice(0, max)}…` : title;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
```

```typescript
// save-workspace.use-case.ts — one action, one responsibility (add when a hook gets too complex)
import type { WorkspaceRepository } from "../workspace.repository";
import type { SaveWorkspaceDto } from "../dto/workspace.dto";

export async function saveWorkspace(
  repo: WorkspaceRepository,
  input: SaveWorkspaceDto
): Promise<void> {
  const workspace = await repo.findById(input.id);
  if (!workspace) throw new WorkspaceNotFoundError(input.id);
  workspace.title = input.title;
  await repo.save(workspace);
}
```

### `dto/`

Plain data shapes (no methods) passed between layers.

| Convention | What it is | Example |
|-----------|-----------|---------|
| `<noun>.dto.ts` | Defines the exact shape of data entering or leaving the application layer. Prevents domain internals from leaking to the UI. | `workspace.dto.ts` |

```typescript
// workspace.dto.ts — data shapes crossing the layer boundary
export interface WorkspaceDto {
  id: string;
  title: string;
  lines: string[];
  updatedAt: string;
}

export interface SaveWorkspaceDto {
  id: string;
  title: string;
}
```

---

## 3. `infrastructure/`

Concrete implementations of the interfaces declared in `application/`. **Allowed to use `fetch`, env vars, and third-party SDKs.**

| Convention | What it is | Example |
|-----------|-----------|---------|
| `<noun>-api.repository.ts` | Production implementation that calls a real API. | `workspace-api.repository.ts` |
| `<noun>.mock-repository.ts` | *(optional)* In-memory implementation used during development. Implements the same interface as the API variant. | `workspace.mock-repository.ts` |
| `<noun>.mock-data.ts` | *(optional)* Static seed data consumed by the mock repository. | `workspace.mock-data.ts` |
| `<noun>.mapper.ts` | *(optional)* Extract mapping logic here when converting API responses to domain types becomes complex enough to clutter the repository file. | `workspace.mapper.ts` |

```typescript
// workspace-api.repository.ts — real API, implements the same interface as the mock
import type { WorkspaceRepository } from "../application/workspace.repository";
import type { Workspace } from "../domain/workspace.types";

export class WorkspaceApiRepository implements WorkspaceRepository {
  async findById(id: string): Promise<Workspace | null> {
    const res = await fetch(`/api/workspaces/${id}`);
    if (res.status === 404) return null;
    return res.json();
  }

  async save(workspace: Workspace): Promise<void> {
    await fetch(`/api/workspaces/${workspace.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workspace),
    });
  }
}
```

```typescript
// workspace.mock-repository.ts — swap in during development without touching any other code
import type { WorkspaceRepository } from "../application/workspace.repository";
import type { Workspace } from "../domain/workspace.types";
import { MOCK_WORKSPACES } from "./workspace.mock-data";

export class WorkspaceMockRepository implements WorkspaceRepository {
  private store = structuredClone(MOCK_WORKSPACES);

  async findById(id: string) {
    return this.store.find((w) => w.id === id) ?? null;
  }

  async save(workspace: Workspace) {
    const i = this.store.findIndex((w) => w.id === workspace.id);
    i === -1 ? this.store.push(workspace) : (this.store[i] = workspace);
  }
}
```

```typescript
// workspace.mock-data.ts — realistic enough to cover the UI states you need to test
import type { Workspace } from "../domain/workspace.types";

export const MOCK_WORKSPACES: Workspace[] = [
  { id: "1", title: "My First Rap", lines: [{ id: "l1", text: "Line one", index: 0 }] },
  { id: "2", title: "Untitled Draft", lines: [] },
];
```

```typescript
// workspace.mapper.ts — (optional) extract only when mapping clutters the repository
import type { Workspace } from "../domain/workspace.types";

// Raw shape returned by the API before mapping
interface WorkspaceApiResponse {
  workspace_id: string;
  workspace_title: string;
  content_lines: { line_id: string; line_text: string; position: number }[];
}

export function toWorkspace(raw: WorkspaceApiResponse): Workspace {
  return {
    id: raw.workspace_id,
    title: raw.workspace_title,
    lines: raw.content_lines.map((l) => ({
      id: l.line_id,
      text: l.line_text,
      index: l.position,
    })),
  };
}
```

---

## 4. `presentation/`

Feature-facing UI. **Allowed to use React, Next.js, and UI libraries.**

### `hooks/`

| Convention | What it is | Example |
|-----------|-----------|---------|
| `use<PascalNoun>.ts` | A React hook that connects UI to data. Handles loading/error states and returns view-ready data. | `useWorkspaceEditor.ts` |
| `<noun>.query-keys.ts` | TanStack Query cache key factory for this feature. Lives here because it is tied to the query library, not to business logic. | `workspace.query-keys.ts` |

```typescript
// workspace.query-keys.ts — centralised cache keys; colocated with hooks because it's query-library-specific
export const workspaceQueryKeys = {
  all: ["workspaces"] as const,
  list: () => [...workspaceQueryKeys.all, "list"] as const,
  detail: (id: string) => [...workspaceQueryKeys.all, "detail", id] as const,
};
```

```typescript
// useWorkspaceEditor.ts — owns data fetching and exposes clean state to the component
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceQueryKeys } from "./workspace.query-keys";
import { WorkspaceMockRepository } from "../../infrastructure/workspace.mock-repository";

const repo = new WorkspaceMockRepository();

export function useWorkspaceEditor(id: string) {
  const client = useQueryClient();

  const { data: workspace, isLoading } = useQuery({
    queryKey: workspaceQueryKeys.detail(id),
    queryFn: () => repo.findById(id),
  });

  const save = useMutation({
    mutationFn: repo.save.bind(repo),
    onSuccess: () => client.invalidateQueries({ queryKey: workspaceQueryKeys.all }),
  });

  return { workspace, isLoading, save };
}
```

### `schemas/`

Zod validation schemas for **user-facing forms only**.

| Convention | What it is | Example |
|-----------|-----------|---------|
| `<noun>.schema.ts` | Zod schema that validates form input before it reaches a hook. One schema file per form. Create the `schemas/` folder only once you have at least one form to validate. | `workspace.schema.ts` |

> Do not write Zod schemas in `domain/` or `application/`. Those layers receive already-validated data and rely on TypeScript types alone.

```typescript
// workspace.schema.ts — validates raw form input at the UI boundary before any business logic runs
import { z } from "zod";

export const saveWorkspaceSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
});

export type SaveWorkspaceInput = z.infer<typeof saveWorkspaceSchema>;
```

### `components/`

Feature-specific components — **not to be imported by other modules**. Follows the same atomic design hierarchy as `src/components/`.

| Folder | What it is | Example |
|--------|-----------|---------|
| `atoms/` | Smallest, single-responsibility pieces. No local business logic. | `EditorToolbarButton.tsx` |
| `molecules/` | Composed of atoms. May have minimal local state (open/closed, hover). | `EditorToolbar.tsx` |
| `organisms/` | Full feature sections. Wires hooks to molecules/atoms and owns the data-fetching boundary. | `RichTextEditor.tsx` |

> Promote a component to `src/components/` only when it is used by **two or more** features.

```tsx
// atoms/EditorToolbarButton.tsx — renders one thing, zero business logic
interface Props {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function EditorToolbarButton({ icon, label, onClick, disabled }: Props) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={label}>
      {icon}
    </button>
  );
}
```

```tsx
// molecules/EditorToolbar.tsx — composes atoms, owns the toolbar's local concerns
import { EditorToolbarButton } from "../atoms/EditorToolbarButton";

interface Props {
  onSave: () => void;
  onUndo: () => void;
  isSaving: boolean;
}

export function EditorToolbar({ onSave, onUndo, isSaving }: Props) {
  return (
    <div role="toolbar">
      <EditorToolbarButton icon="↩" label="Undo" onClick={onUndo} />
      <EditorToolbarButton icon="💾" label="Save" onClick={onSave} disabled={isSaving} />
    </div>
  );
}
```

```tsx
// organisms/RichTextEditor.tsx — wires the hook to UI; owns the data-fetching boundary
import { useWorkspaceEditor } from "../hooks/useWorkspaceEditor";
import { EditorToolbar } from "../molecules/EditorToolbar";

export function RichTextEditor({ workspaceId }: { workspaceId: string }) {
  const { workspace, isLoading, save } = useWorkspaceEditor(workspaceId);

  if (isLoading) return <p>Loading…</p>;

  return (
    <div>
      <EditorToolbar
        onSave={() => save.mutate(workspace!)}
        onUndo={() => {}}
        isSaving={save.isPending}
      />
      {/* editor lines */}
    </div>
  );
}
```

---

## Naming Quick Reference

| Layer | Pattern | Description |
|-------|---------|-------------|
| domain | `<noun>.types.ts` | Shared TS interfaces and type aliases |
| domain | `<noun>.constants.ts` | Named domain constants |
| domain | `<noun>.errors.ts` | Typed domain error classes |
| domain | `<noun>.entity.ts` | *(optional)* Identifiable object with business rules |
| domain | `<noun>.value-object.ts` | *(optional)* Immutable, equality-by-value object |
| application | `<noun>.repository.ts` | Interface (port) for data operations |
| application | `<noun>.utils.ts` | Pure helper functions (no side effects) |
| application | `<verb>-<noun>.use-case.ts` | *(optional)* Single user-facing system action |
| application/dto | `<noun>.dto.ts` | Data shape crossing layer boundaries |
| infrastructure | `<noun>-api.repository.ts` | Real API implementation of a repository |
| infrastructure | `<noun>.mock-repository.ts` | *(optional)* In-memory implementation for dev/testing |
| infrastructure | `<noun>.mock-data.ts` | *(optional)* Static seed data for mock repository |
| infrastructure | `<noun>.mapper.ts` | *(optional)* Extract when API mapping clutters the repository |
| presentation/hooks | `use<PascalNoun>.ts` | React hook connecting UI to data |
| presentation/hooks | `<noun>.query-keys.ts` | TanStack Query cache key factory |
| presentation/schemas | `<noun>.schema.ts` | Zod schema for form validation |
| presentation/components | `<PascalNoun>.tsx` | Feature-scoped UI component |

---

## Dependency Direction

```
presentation → application → domain
infrastructure → application / domain
```

- `domain` must not import from any other layer.
- `application` must not import from `infrastructure` or `presentation`.
- Cross-feature imports are **not allowed** except through `src/shared/`.
