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
