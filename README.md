# Bisaya AI Rap — Prototype README

A web app for writing Bisaya rap bars. AI-assisted lyric editor with beat linking, verse snippet management, and a built-in Cebuano thesaurus.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.1 |
| Runtime | React | 19.2.4 |
| Language | TypeScript | ^5.9.3 |
| Styling | Tailwind CSS | ^4.2.2 |
| UI Components | shadcn/ui (new-york) + Radix UI | shadcn ^4.1.1 / radix-ui ^1.4.3 |
| Server State | TanStack Query v5 | ^5.95.2 |
| Forms | React Hook Form | ^7.72.0 |
| Validation | Zod | ^4.3.6 |
| Backend / Auth | Supabase (Auth · Postgres · Storage · Realtime) | supabase-js ^2.101.0 |
| AI | Vercel AI SDK (Google Gemini + Groq fallback) | ai ^6.0.141 |
| Thesaurus | @junsayke/cebuano-thesaurus (GitHub Packages) | ^1.3.1 |
| API Mocking | MSW | ^2.12.14 |
| Package Manager | pnpm | 10.26.1 |
| Node.js | — | v20+ |

---

## Demo Accounts

> These accounts are for the **local prototype** only. Register them manually via `/signup` after running `pnpm supabase db reset`, or add them through Supabase Studio at [http://localhost:54323](http://localhost:54323).

This app has a single user type — all authenticated users have the same level of access.

| # | Display Name | Email | Password |
|---|---|---|---|
| 1 | Demo User | `demo@bars.local` | `Demo1234!` |
| 2 | Test Rapper | `rapper@bars.local` | `Rapper1234!` |

> **Note:** No seed file is committed. Create these accounts manually through the signup page or Supabase Studio → Authentication → Users → Add User.

---

## Deployment Instructions

### Option A — Local Development

**Prerequisites:** Node.js v20+, pnpm v10+, Docker Desktop

#### 1. Configure the private package registry

The Cebuano thesaurus is hosted on GitHub Packages. Create a `.npmrc` file in the project root:

```
@junsayke:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<your-github-pat>
```

Generate a PAT at [GitHub → Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens) with the `read:packages` scope.

> `.npmrc` is gitignored — never commit it.

#### 2. Install dependencies

```bash
pnpm install
```

#### 3. Start local Supabase

Docker Desktop must be running.

```bash
pnpm supabase start
```

After startup, the CLI prints your local `API URL` and `anon key`. Copy them.

Apply all migrations:

```bash
pnpm supabase db reset
```

#### 4. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from supabase start>

# Set to `enabled` to use MSW mocks instead of real Supabase calls
NEXT_PUBLIC_API_MOCKING=disabled

# AI feedback — at least one key required
GOOGLE_GENERATIVE_AI_API_KEY=<from https://aistudio.google.com>
GROQ_API_KEY=<from https://console.groq.com>
```

#### 5. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

| Route | Notes |
|---|---|
| `/login` | Sign in |
| `/signup` | Register a new account |
| `/workspaces` | Session list (requires login) |
| `/workspaces/editor` | Bar editor (requires login) |
| `/settings/profile` | Profile settings (requires login) |
| Supabase Studio | [http://localhost:54323](http://localhost:54323) |

---

### Option B — Vercel Deployment

#### 1. Connect the repo

Push to GitHub and import the repo in your [Vercel dashboard](https://vercel.com/new).

#### 2. Set environment variables in Vercel

Go to **Project → Settings → Environment Variables** and add:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_API_MOCKING` | `disabled` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | (optional, recommended) |
| `GROQ_API_KEY` | (optional, fallback AI) |

> For the private package registry on Vercel, add `NPM_RC` as an environment variable containing the contents of your `.npmrc` file, or configure it in `vercel.json`.

#### 3. Deploy

```bash
pnpm build   # Verify build locally first
```

Then push to your main branch — Vercel deploys automatically.

---

## Common Commands

```bash
pnpm dev                    # Start Next.js dev server (http://localhost:3000)
pnpm build                  # Production build
pnpm lint                   # Run ESLint

pnpm supabase start         # Start local Supabase stack (requires Docker)
pnpm supabase stop          # Stop local Supabase
pnpm supabase db reset      # Re-apply all migrations
pnpm supabase gen types typescript --local > src/shared/types/database.types.ts
```
