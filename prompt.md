Project Path: web

Source Tree:

```txt
web
├── README.md
├── app
│   ├── (auth)
│   │   ├── forgot
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── reset
│   │   │   └── page.tsx
│   │   └── signup
│   │       └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── settings
│   │   ├── account
│   │   │   └── page.tsx
│   │   └── profile
│   │       └── page.tsx
│   └── workspaces
│       ├── editor
│       │   └── page.tsx
│       └── page.tsx
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src
│   ├── components
│   │   ├── atoms
│   │   │   ├── Icon.tsx
│   │   │   └── logo.tsx
│   │   └── ui
│   │       ├── badge.tsx
│   │       └── button.tsx
│   ├── modules
│   └── shared
│       └── lib
│           └── utils.ts
└── tsconfig.json

```

`README.md`:

```md
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server (this project prefers `pnpm` — see "Switching to pnpm" below):

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Auth pages are available at `/login` and `/signup` (they live under the `(auth)` route group).

Components follow Atomic Design under `src/components`:
- `atoms/` — building blocks (Logo, Icon, Button, Input, Label, Divider)
- `molecules/` — composed components (FormField, PasswordField, SocialButton)
- `organisms/` — composed layouts (AuthForm, AuthAside)

Run `pnpm dev` and visit `/login` to see the new auth layout.

Switching to pnpm
-----------------

This repository prefers `pnpm`. To switch locally:

1. Install pnpm (via Corepack or npm):

```bash
corepack prepare pnpm@8 --activate
# or
npm i -g pnpm
```

2. Remove the npm lockfile (if present) and install with pnpm:

```bash
git rm --cached package-lock.json || true
pnpm install
```

This will create `pnpm-lock.yaml` and use pnpm's node_modules layout.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```

`app/(auth)/forgot/page.tsx`:

```tsx

export default function ForgotPage() {
  return (
    <div>Forgot Password</div>
  );
}

```

`app/(auth)/layout.tsx`:

```tsx
import React from "react";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Auth - Bisaya AI Rap",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-row overflow-hidden">
      {children}
    </div>
  );
}

```

`app/(auth)/login/page.tsx`:

```tsx

export default function LoginPage() {
  return (
    <div>Login Page</div>
  );
}

```

`app/(auth)/reset/page.tsx`:

```tsx

export const metadata = {
  title: "Reset Password - Bisaya AI Rap System",
};

export default function ResetPasswordPage() {
  return (
    <div>Reset Password</div>
  );
}

```

`app/(auth)/signup/page.tsx`:

```tsx

export default function SignupPage() {
  return (
    <div>Signup Page</div>
  );
}

```

`app/globals.css`:

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.9842 0.0034 247.8575);
  --foreground: oklch(0.2077 0.0398 265.7549);
  --card: oklch(1.0000 0 0);
  --card-foreground: oklch(0.2077 0.0398 265.7549);
  --popover: oklch(1.0000 0 0);
  --popover-foreground: oklch(0.2077 0.0398 265.7549);
  --primary: oklch(0.5854 0.2041 277.1173);
  --primary-foreground: oklch(1.0000 0 0);
  --secondary: oklch(0.9288 0.0126 255.5078);
  --secondary-foreground: oklch(0.2795 0.0368 260.0310);
  --muted: oklch(0.9683 0.0069 247.8956);
  --muted-foreground: oklch(0.5544 0.0407 257.4166);
  --accent: oklch(0.9299 0.0334 272.7879);
  --accent-foreground: oklch(0.3984 0.1773 277.3662);
  --destructive: oklch(0.6368 0.2078 25.3313);
  --destructive-foreground: oklch(1.0000 0 0);
  --border: oklch(0.9288 0.0126 255.5078);
  --input: oklch(0.9288 0.0126 255.5078);
  --ring: oklch(0.5854 0.2041 277.1173);
  --chart-1: oklch(0.5854 0.2041 277.1173);
  --chart-2: oklch(0.6056 0.2189 292.7172);
  --chart-3: oklch(0.6559 0.2118 354.3084);
  --chart-4: oklch(0.8606 0.1731 91.9357);
  --chart-5: oklch(0.7971 0.1339 211.5302);
  --sidebar: oklch(1.0000 0 0);
  --sidebar-foreground: oklch(0.2077 0.0398 265.7549);
  --sidebar-primary: oklch(0.5854 0.2041 277.1173);
  --sidebar-primary-foreground: oklch(1.0000 0 0);
  --sidebar-accent: oklch(0.9299 0.0334 272.7879);
  --sidebar-accent-foreground: oklch(0.3984 0.1773 277.3662);
  --sidebar-border: oklch(0.9288 0.0126 255.5078);
  --sidebar-ring: oklch(0.5854 0.2041 277.1173);
  --font-sans: Afacad, ui-sans-serif, sans-serif, system-ui;
  --font-serif: Adamina, ui-serif, serif;
  --font-mono: Fira Code, ui-monospace, monospace;
  --radius: 0.5rem;
  --shadow-x: 0;
  --shadow-y: 0.2rem;
  --shadow-blur: 0.5rem;
  --shadow-spread: 0;
  --shadow-opacity: 0.05;
  --shadow-color: #0F172A;
  --shadow-2xs: 0 0.2rem 0.5rem 0 hsl(222.2222 47.3684% 11.1765% / 0.03);
  --shadow-xs: 0 0.2rem 0.5rem 0 hsl(222.2222 47.3684% 11.1765% / 0.03);
  --shadow-sm: 0 0.2rem 0.5rem 0 hsl(222.2222 47.3684% 11.1765% / 0.05), 0 1px 2px -1px hsl(222.2222 47.3684% 11.1765% / 0.05);
  --shadow: 0 0.2rem 0.5rem 0 hsl(222.2222 47.3684% 11.1765% / 0.05), 0 1px 2px -1px hsl(222.2222 47.3684% 11.1765% / 0.05);
  --shadow-md: 0 0.2rem 0.5rem 0 hsl(222.2222 47.3684% 11.1765% / 0.05), 0 2px 4px -1px hsl(222.2222 47.3684% 11.1765% / 0.05);
  --shadow-lg: 0 0.2rem 0.5rem 0 hsl(222.2222 47.3684% 11.1765% / 0.05), 0 4px 6px -1px hsl(222.2222 47.3684% 11.1765% / 0.05);
  --shadow-xl: 0 0.2rem 0.5rem 0 hsl(222.2222 47.3684% 11.1765% / 0.05), 0 8px 10px -1px hsl(222.2222 47.3684% 11.1765% / 0.05);
  --shadow-2xl: 0 0.2rem 0.5rem 0 hsl(222.2222 47.3684% 11.1765% / 0.13);
  --tracking-normal: -0.025em;
  --spacing: 0.25rem;
}

.dark {
  --background: oklch(0.2077 0.0398 265.7549);
  --foreground: oklch(0.9842 0.0034 247.8575);
  --card: oklch(0.2795 0.0368 260.0310);
  --card-foreground: oklch(0.9842 0.0034 247.8575);
  --popover: oklch(0.2795 0.0368 260.0310);
  --popover-foreground: oklch(0.9842 0.0034 247.8575);
  --primary: oklch(0.6056 0.2189 292.7172);
  --primary-foreground: oklch(1.0000 0 0);
  --secondary: oklch(0.3717 0.0392 257.2870);
  --secondary-foreground: oklch(0.9842 0.0034 247.8575);
  --muted: oklch(0.2795 0.0368 260.0310);
  --muted-foreground: oklch(0.7107 0.0351 256.7878);
  --accent: oklch(0.3984 0.1773 277.3662);
  --accent-foreground: oklch(0.9842 0.0034 247.8575);
  --destructive: oklch(0.7106 0.1661 22.2162);
  --destructive-foreground: oklch(1.0000 0 0);
  --border: oklch(0.3717 0.0392 257.2870);
  --input: oklch(0.3717 0.0392 257.2870);
  --ring: oklch(0.6056 0.2189 292.7172);
  --chart-1: oklch(0.6056 0.2189 292.7172);
  --chart-2: oklch(0.7090 0.1592 293.5412);
  --chart-3: oklch(0.7192 0.1690 13.4280);
  --chart-4: oklch(0.9052 0.1657 98.1108);
  --chart-5: oklch(0.8651 0.1153 207.0778);
  --sidebar: oklch(0.2795 0.0368 260.0310);
  --sidebar-foreground: oklch(0.9842 0.0034 247.8575);
  --sidebar-primary: oklch(0.6056 0.2189 292.7172);
  --sidebar-primary-foreground: oklch(1.0000 0 0);
  --sidebar-accent: oklch(0.3984 0.1773 277.3662);
  --sidebar-accent-foreground: oklch(0.9842 0.0034 247.8575);
  --sidebar-border: oklch(0.3717 0.0392 257.2870);
  --sidebar-ring: oklch(0.6056 0.2189 292.7172);
  --font-sans: Afacad, ui-sans-serif, sans-serif, system-ui;
  --font-serif: Adamina, ui-serif, serif;
  --font-mono: Fira Code, ui-monospace, monospace;
  --radius: 0.5rem;
  --shadow-x: 0;
  --shadow-y: 0.3rem;
  --shadow-blur: 0.7rem;
  --shadow-spread: 0;
  --shadow-opacity: 0.3;
  --shadow-color: #000000;
  --shadow-2xs: 0 0.3rem 0.7rem 0 hsl(0 0% 0% / 0.15);
  --shadow-xs: 0 0.3rem 0.7rem 0 hsl(0 0% 0% / 0.15);
  --shadow-sm: 0 0.3rem 0.7rem 0 hsl(0 0% 0% / 0.30), 0 1px 2px -1px hsl(0 0% 0% / 0.30);
  --shadow: 0 0.3rem 0.7rem 0 hsl(0 0% 0% / 0.30), 0 1px 2px -1px hsl(0 0% 0% / 0.30);
  --shadow-md: 0 0.3rem 0.7rem 0 hsl(0 0% 0% / 0.30), 0 2px 4px -1px hsl(0 0% 0% / 0.30);
  --shadow-lg: 0 0.3rem 0.7rem 0 hsl(0 0% 0% / 0.30), 0 4px 6px -1px hsl(0 0% 0% / 0.30);
  --shadow-xl: 0 0.3rem 0.7rem 0 hsl(0 0% 0% / 0.30), 0 8px 10px -1px hsl(0 0% 0% / 0.30);
  --shadow-2xl: 0 0.3rem 0.7rem 0 hsl(0 0% 0% / 0.75);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);

  --tracking-tighter: calc(var(--tracking-normal) - 0.05em);
  --tracking-tight: calc(var(--tracking-normal) - 0.025em);
  --tracking-normal: var(--tracking-normal);
  --tracking-wide: calc(var(--tracking-normal) + 0.025em);
  --tracking-wider: calc(var(--tracking-normal) + 0.05em);
  --tracking-widest: calc(var(--tracking-normal) + 0.1em);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    letter-spacing: var(--tracking-normal);
  }
}


```

`app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const beVietnam = Be_Vietnam_Pro({
  weight: ["400","700","900"],
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${beVietnam.variable} antialiased dark`}
      >
              {children}
      </body>
    </html>
  );
}

```

`app/page.tsx`:

```tsx

export const metadata = {
  title: "Bisaya AI Rap System - Welcome",
};

export default function Home() {
  return (
    <div>Welcome to the Bisaya AI Rap System</div>
  );
}

```

`app/settings/account/page.tsx`:

```tsx

export const metadata = {
  title: "Change Password - Bisaya AI Rap System",
};

export default function SettingsSecurityPage() {
  return (
    <div>Account Settings</div>
  );
}

```

`app/settings/profile/page.tsx`:

```tsx

export const metadata = {
  title: "Edit Profile - Bisaya AI Rap System",
};

export default function SettingsProfilePage() {
  return (
    <div>Edit Profile Page</div>
  );
}

```

`app/workspaces/editor/page.tsx`:

```tsx

export const metadata = {
  title: "Workspace - Bisaya AI Rap System",
};

export default function EditorWorkspacePage() {
  return (
    <div>Workspace Editor Page</div>
  );
}

```

`app/workspaces/page.tsx`:

```tsx
export default function WorkspacesPage() {
  return (
    <div>Workspaces</div>
  )
}
```

`components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/shared/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/shared/lib",
    "hooks": "@/shared/hooks"
  },
  "registries": {}
}

```

`eslint.config.mjs`:

```mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

```

`next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

```

`package.json`:

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@tanstack/react-query": "^5.90.21",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.576.0",
    "next": "16.1.6",
    "radix-ui": "^1.4.3",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-hook-form": "^7.71.2",
    "tailwind-merge": "^3.5.0",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@tanstack/react-query-devtools": "^5.91.3",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "shadcn": "^3.8.5",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.4.0",
    "typescript": "^5"
  },
  "packageManager": "pnpm@10.26.1+sha512.664074abc367d2c9324fdc18037097ce0a8f126034160f709928e9e9f95d98714347044e5c3164d65bd5da6c59c6be362b107546292a8eecb7999196e5ce58fa"
}

```

`pnpm-workspace.yaml`:

```yaml
ignoredBuiltDependencies:
  - sharp
  - unrs-resolver

```

`postcss.config.mjs`:

```mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

```

`public/file.svg`:

```svg
<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>
```

`public/globe.svg`:

```svg
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
```

`public/next.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
```

`public/vercel.svg`:

```svg
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>
```

`public/window.svg`:

```svg
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>
```

`src/components/atoms/Icon.tsx`:

```tsx
import React from "react";

type IconProps = React.HTMLAttributes<HTMLSpanElement> & {
  name: string;
  size?: number | string;
};

export const Icon: React.FC<IconProps> = ({ name, size = 20, className = "", ...props }) => {
  return (
    <span
      className={`material-symbols-outlined align-middle ${className}`}
      style={{ fontSize: size }}
      aria-hidden
      {...props}
    >
      {name}
    </span>
  );
};

export default Icon;

```

`src/components/atoms/logo.tsx`:

```tsx
import React from "react";

export const Logo: React.FC<{ size?: number }> = ({ size = 36 }) => {
  return (
    <div className="flex items-center gap-3" aria-hidden>
      <div className="flex items-center justify-center rounded-full bg-linear-to-br from-primary to-primary-dark shadow-lg text-white" style={{ width: size, height: size }}>
        <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
      </div>
      <h2 className="text-lg font-semibold tracking-tight text-white">Bisaya AI Rap</h2>
    </div>
  );
};

export default Logo;


```

`src/components/ui/badge.tsx`:

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/shared/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

```

`src/components/ui/button.tsx`:

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

```

`src/shared/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "baseUrl": ".",
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}

```