# Branch Strategy — BARS v2

This document defines the Git branching conventions, Gitflow workflow, merge strategies, and Git Worktree usage for this project.

---

## 1. Branch Overview

| Branch | Type | Lifetime | Deploys To |
|---|---|---|---|
| `main` | Core | Permanent | Production |
| `develop` | Core | Permanent | QA / Staging (CD) |
| `hotfix` | Supporting | Long-lived | Pre-Production / UAT |
| `release/*` | Supporting | Short-lived | Pre-Production / UAT |
| `feature/*` | Supporting | Short-lived | Devs (Individuals) |
| `bug/*` | Supporting | Short-lived | Devs (Individuals) |

---

## 2. Core Branches

### `main`
- Always reflects **production-ready** code.
- **Never commit directly** to `main`.
- Only receives merges from `hotfix` and `release/*` branches.
- Every merge into `main` must be **tagged** with a version (e.g., `v2.2.0`).

### `develop`
- Integration branch for all completed features.
- Continuously deployed to **QA / Staging** on every push.
- Serves as the base for `feature/*` and `release/*` branches.

---

## 3. Supporting Branches

### `feature/*`
- **Branched from:** `develop`
- **Merges back into:** `develop`
- **Naming:** `feature/<ticket-id>-short-description`
  - e.g., `feature/BARS-42-rich-text-editor`
- Deployed to individual dev environments for local verification.
- Deleted after merging into `develop`.

### `release/*`
- **Branched from:** `develop`
- **Merges back into:** `main` and `develop`
- **Naming:** `release/<version>`
  - e.g., `release/2.2.0`
- Used for release stabilization (bug fixes, version bumps, changelogs only — no new features).
- Deployed to **Pre-Production / UAT** for final sign-off.
- Deleted after merging into `main`.

### `bug/*`
- **Branched from:** `hotfix`
- **Merges back into:** `hotfix`
- **Naming:** `bug/<ticket-id>-short-description`
  - e.g., `bug/BARS-99-login-crash`
- Scoped to a single bug fix.
- Deployed to individual dev environments for verification.
- Deleted after merging into `hotfix`.

### `hotfix`
- **Branched from:** `main` (via rebase)
- **Merges back into:** `main` and `develop`
- Used to consolidate urgent production bug fixes.
- Deployed to **Pre-Production / UAT** before merging to `main`.
- Stays long-lived as a stable hotfix integration branch; individual bugs are isolated in `bug/*`.

---

## 4. Gitflow Diagram

![Gitflow diagram](https://miro.medium.com/v2/resize:fit:720/format:webp/1*02cM3ZABlqMjb12YMkCwEA.png)

---

## 5. Workflows

### 5.1 Feature Development Flow

```
1. Rebase develop from main
   git checkout develop && git pull --rebase origin main

2. Create a feature branch
   git checkout -b feature/BARS-XX-description

3. Push and deploy to individual dev environment
   git push origin feature/BARS-XX-description

4. Merge feature into develop (squash)
   git checkout develop
   git merge --squash feature/BARS-XX-description
   git commit -m "feat(BARS-XX): description"
   git push origin develop

5. develop auto-deploys to QA/Staging (CI/CD)

6. Create release branch from develop
   git checkout -b release/2.X.0

7. Deploy release branch to Pre-Production / UAT

8. Merge release into main (three-way, no fast-forward)
   git checkout main
   git merge --no-ff release/2.X.0
   git tag v2.X.0

9. Deploy main to Production
```

### 5.2 Hotfix Flow

```
1. Rebase hotfix from main
   git checkout hotfix && git pull --rebase origin main

2. Create a bug branch from hotfix
   git checkout -b bug/BARS-XX-description

3. Deploy bug branch to individual dev environment
   git push origin bug/BARS-XX-description

4. Merge bug into hotfix (squash)
   git checkout hotfix
   git merge --squash bug/BARS-XX-description
   git commit -m "fix(BARS-XX): description"

5. Deploy hotfix to Pre-Production / UAT

6. Merge hotfix into main (three-way, no fast-forward)
   git checkout main
   git merge --no-ff hotfix
   git tag v2.X.Y

7. Deploy main to Production

8. Merge hotfix into develop (three-way, no fast-forward)
   git checkout develop
   git merge --no-ff hotfix
```

---

## 6. Merge Strategy

Different merge strategies are applied depending on the type of branch transition.

### 6.1 Squash Merge
**Used when:** `feature/*` → `develop`, `bug/*` → `hotfix`

Collapses all commits on a branch into a single clean commit on the target branch. Keeps history linear and readable.

```bash
git checkout develop
git merge --squash feature/BARS-XX-description
git commit -m "feat(BARS-XX): short description"
git branch -d feature/BARS-XX-description
```

> **Rule:** The squash commit message must follow [Conventional Commits](https://www.conventionalcommits.org/):
> `type(scope): description`
> e.g., `feat(editor): add rich text formatting toolbar`

### 6.2 No Fast-Forward (Three-Way) Merge
**Used when:** `release/*` → `main`, `hotfix` → `main`, `hotfix` → `develop`, `release/*` → `develop`

Preserves a merge commit that explicitly records when a branch was integrated. This is required for all merges into `main` and `develop` from supporting integration branches.

```bash
git checkout main
git merge --no-ff release/2.2.0 -m "chore(release): merge release/2.2.0 into main"
git tag v2.2.0
```

> **Rule:** Always supply an explicit `-m` message on `--no-ff` merges into `main`.

### 6.3 Rebase
**Used when:** Bringing `develop` or `hotfix` up to date with `main` before branching.

Replays commits on top of the latest `main`, producing a clean linear base without a merge bubble.

```bash
# Rebase develop onto main
git checkout develop
git pull --rebase origin main

# Rebase hotfix onto main
git checkout hotfix
git pull --rebase origin main
```

> **Rule:** Only rebase **before** creating new branches, never rebase shared branches that others have already checked out.

### 6.4 Fast-Forward Merge
**Used when:** Synchronizing a local tracking branch that has not diverged (e.g., pulling `main` locally).

```bash
git checkout main
git merge --ff-only origin/main
```

> **Rule:** Fast-forward is only allowed when there are no local commits ahead of the remote. Always prefer `--ff-only` explicitly to avoid accidental three-way merges.

### Summary Table

| Transition | Strategy | Command Flag |
|---|---|---|
| `feature/*` → `develop` | Squash | `--squash` |
| `bug/*` → `hotfix` | Squash | `--squash` |
| `release/*` → `main` | Three-Way (No-FF) | `--no-ff` |
| `release/*` → `develop` | Three-Way (No-FF) | `--no-ff` |
| `hotfix` → `main` | Three-Way (No-FF) | `--no-ff` |
| `hotfix` → `develop` | Three-Way (No-FF) | `--no-ff` |
| `main` → `develop` (sync) | Rebase | `--rebase` |
| `main` → `hotfix` (sync) | Rebase | `--rebase` |
| Local tracking sync | Fast-Forward | `--ff-only` |

---

## 7. Git Worktree

Git Worktree allows multiple branches to be checked out simultaneously in separate directories. This is recommended when working on a `hotfix` while `feature/*` work is in progress, or when running the app locally against different branches at the same time.

### 7.1 Setup Convention

All worktrees should be placed **outside** the main working directory under a sibling `worktrees/` folder:

```
BARS v2/
├── web/                  ← primary worktree (develop or feature branch)
└── worktrees/
    ├── hotfix/           ← git worktree for hotfix branch
    ├── release-2.2.0/    ← git worktree for a release branch
    └── main/             ← git worktree for production verification
```

### 7.2 Commands

```bash
# Add a worktree for the hotfix branch
git worktree add ../worktrees/hotfix hotfix

# Add a worktree for a specific release branch
git worktree add ../worktrees/release-2.2.0 release/2.2.0

# Add a worktree for main (read-only reference)
git worktree add ../worktrees/main main

# List all active worktrees
git worktree list

# Remove a worktree after the branch is merged and deleted
git worktree remove ../worktrees/hotfix
```

### 7.3 Rules

- Each worktree has its own **independent working directory and index** but shares the same `.git` object store.
- A branch can only be checked out in **one worktree at a time**. Attempting to check out the same branch in two worktrees will error.
- Always run `git worktree prune` periodically to clean up stale worktree references.
- Do not run `pnpm install` or build tooling from a worktree unless its `node_modules` are isolated or a separate `.env` is configured.

---

## 8. Tagging Convention

Tags are created on `main` only, immediately after a merge.

| Type | Format | Example |
|---|---|---|
| Release | `v<major>.<minor>.<patch>` | `v2.2.0` |
| Hotfix patch | `v<major>.<minor>.<patch>` | `v2.2.1` |

```bash
git tag -a v2.2.0 -m "Release 2.2.0"
git push origin v2.2.0
```

---

## 9. Branch Naming Reference

| Branch Type | Pattern | Example |
|---|---|---|
| Feature | `feature/<ticket>-<description>` | `feature/BARS-42-editor-toolbar` |
| Bug | `bug/<ticket>-<description>` | `bug/BARS-99-login-crash` |
| Release | `release/<version>` | `release/2.2.0` |
| Hotfix | `hotfix` | `hotfix` |

- Use **lowercase** and **hyphens** only. No underscores, no camelCase.
- Keep descriptions short (3–5 words max).
- Always prefix with the ticket ID when one exists.

---

## 10. Protection Rules (Recommended)

| Branch | Direct Push | Requires PR | Required Reviews | Status Checks |
|---|---|---|---|---|
| `main` | Blocked | Yes | 2 | CI must pass |
| `develop` | Blocked | Yes | 1 | CI must pass |
| `hotfix` | Blocked | Yes | 1 | CI must pass |
| `release/*` | Blocked | Yes | 1 | CI must pass |
| `feature/*` | Allowed | No | — | — |
| `bug/*` | Allowed | No | — | — |
