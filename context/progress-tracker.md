# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Authentication — wire Clerk into the app: provider, auth pages, route protection, redirects, and user menu (feature spec `03-auth`)

## Current Goal

- Integrate Clerk for user identity and route protection: wrap the root layout with `ClerkProvider` (dark theme themed via existing CSS variables), add minimal two-panel sign-in/sign-up pages, protect all routes except the public auth paths via `proxy.ts`, redirect `/` based on auth state, and surface the `UserButton` in the editor navbar.

## Completed

- `01-design-system`: Initialized and configured shadcn/ui (Next.js template, radix base, neutral base color, CSS variables) for Next.js 16 + Tailwind v4.
  - Added UI primitives in `components/ui/`: `button`, `card`, `dialog`, `input`, `tabs`, `textarea`, `scroll-area` (generated, unmodified).
  - Installed `lucide-react` (plus `class-variance-authority`, `clsx`, `tailwind-merge`, `radix-ui`, `tw-animate-css`).
  - `lib/utils.ts` exposes the `cn()` Tailwind class-merge helper.
  - Theme tokens written to `app/globals.css`; forced dark-only by adding the `dark` class to `<html>` in `app/layout.tsx` so no default light styling appears.
  - Verified: `tsc --noEmit` and `next build` both pass.
- `02-editor-chrome`: Added the base editor chrome components in `components/editor/`.
  - `editor-navbar.tsx`: fixed-height (`h-14`) top navbar with left/center/right sections, dark `bg-card` background and a subtle bottom border. Left section holds a sidebar toggle button that swaps `PanelLeftOpen` / `PanelLeftClose` based on `isSidebarOpen`; right section now holds Clerk's `UserButton` (see `03-auth`).
  - `project-sidebar.tsx`: floating left overlay (`absolute`, `z-40`) that slides in from the left via a transform on the `isOpen` prop so it does not push page content. Header with `Projects` title + close button, shadcn `Tabs` (`My Projects` / `Shared`) each showing an empty placeholder state, and a full-width `New Project` button with the `Plus` icon pinned to the bottom.
  - `editor-dialog.tsx`: reusable dialog pattern wrapping the shadcn `Dialog`, supporting `title`, `description`, and `footer` actions, styled with existing `globals.css` tokens (`bg-popover` / `text-popover-foreground`). No concrete dialogs built yet — the pattern is ready for future use.
  - Verified: `tsc --noEmit` passes and `eslint components/editor` reports no errors.
- `03-auth`: Wired Clerk into the Next.js app for identity and route protection.
  - Installed `@clerk/ui` for the `dark` theme.
  - `app/layout.tsx`: root layout wraps children in `ClerkProvider` (placed inside `<body>` per Clerk Core 3) using the `dark` theme as the base, with `appearance.variables` mapped to the app's existing `globals.css` tokens (`var(--card)`, `var(--primary)`, `var(--border)`, `var(--destructive)`, etc.) — no hardcoded colors. The forced `dark` class on `<html>` is unchanged.
  - `proxy.ts` (project root, not `middleware.ts`): protected-first `clerkMiddleware`. Public routes are derived from the `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` env vars; every other route calls `auth.protect()`.
  - Added `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up` to `.env.local` (standard Clerk env vars; publishable + secret keys left intact).
  - `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx`: Clerk `<SignIn>` / `<SignUp>` rendered inside a shared `components/auth/auth-shell.tsx`. On large screens it is a two-panel layout; right panel centers the Clerk form. On small screens the left panel is hidden (`lg:flex`) so only the form shows.
  - Left panel is a centered marketing column: an uppercase `Ghost AI` eyebrow, a large `text-4xl` `h1` headline, a supporting paragraph, and three feature cards. Each card is a bordered `bg-card/40` block with a bold title and a muted description (no icons). All styling uses existing shadcn tokens.
  - `app/page.tsx`: now a server component that reads `await auth()` and redirects authenticated users to `/editor` and everyone else to `/sign-in`.
  - `components/editor/editor-navbar.tsx`: right section now renders Clerk's built-in `UserButton`; default user menu/profile flows untouched.
  - Verified: `npm run build` passes; `proxy.ts` is detected as Middleware and all routes compile.

## In Progress

- None.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Add decisions that affect the system design or data model.

## Session Notes

- `/` redirects authenticated users to `/editor` as specified in `03-auth`, but the `/editor` route does not exist yet (the editor chrome components from `02-editor-chrome` are not yet mounted on a page). Building the `/editor` route is a separate, not-yet-implemented unit.
- Clerk is Core 3 (`@clerk/nextjs` v7). `ClerkProvider` must sit inside `<body>`, themes come from `@clerk/ui` (not `@clerk/themes`), and `auth()` exposes `isAuthenticated`.
- shadcn is pinned to style `radix-nova` in `components.json` (component library: radix, base color: neutral). Use `npx shadcn@latest add <component> -y` for future primitives; never hand-edit `components/ui/*`.
- Dark mode is enforced via the `dark` class on `<html>` rather than per-token overrides. `globals.css` still carries the generated light `:root` block, which is inert while `dark` is applied.
