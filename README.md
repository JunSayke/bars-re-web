# BARS Frontend

Next.js frontend with shadcn/ui components, Tailwind CSS, and API integration.

## Features

- ✅ Next.js 15 with App Router
- ✅ shadcn/ui components
- ✅ Tailwind CSS 4
- ✅ TypeScript
- ✅ Authentication context
- ✅ Axios API client with interceptors
- ✅ Protected routes
- ✅ Responsive design

## Prerequisites

- Node.js 18+
- pnpm 9+

## Environment Variables

Create `.env` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Installation

```bash
pnpm install
```

## Running the Application

### Development

```bash
pnpm dev:web
```

The app will be available at `http://localhost:3000`

### Build

```bash
pnpm build:web
```

### Production

```bash
pnpm start
```

## Project Structure

```
src/
├── app/                  # Pages and layouts
├── components/           # Reusable UI components
├── contexts/             # React contexts (Auth, etc.)
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and API client
└── globals.css           # Global styles
```

## Pages

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Protected dashboard (requires authentication)

## Authentication

The app uses JWT tokens stored in localStorage. The auth context handles:
- User login
- User registration
- Token refresh on requests
- Logout
- Protected route navigation

## API Integration

The Axios client is configured to:
- Auto-attach JWT tokens to all requests
- Redirect to login on 401 responses
- Handle errors gracefully
