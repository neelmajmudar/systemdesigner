# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Prisma Schema & Data Layer (`05-prisma`) — complete. Project data models, the cached Prisma client singleton, and the first migration are in place. The data layer is ready; the next unit is wiring API routes that use `lib/prisma.ts` to replace the `04-project-dialogs` mock data and the hook's simulated submits.

## Current Goal

- Build the project persistence API routes (`app/api/...`) on top of `lib/prisma.ts`, replacing `lib/mock-projects.ts` and the simulated submits in `hooks/use-project-dialogs.ts` with real reads/writes against the `Project` / `ProjectCollaborator` models.

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
- `04-project-dialogs`: Built the `/editor` home screen, project create/rename/delete dialogs, and owner-only sidebar actions. Mock data only — no API calls or persistence.
  - `types/project.ts`: `Project` interface (`id`, `name`, `slug`, `access`) with `ProjectAccess` = `"owner" | "collaborator"`.
  - `lib/mock-projects.ts`: `MOCK_OWNED_PROJECTS` / `MOCK_SHARED_PROJECTS` fixtures. `lib/slug.ts`: `slugify()` helper (lowercase, non-alphanumeric → hyphen, trimmed) used for the live slug preview.
  - `hooks/use-project-dialogs.ts`: dedicated hook owning dialog state (`activeDialog`), the target `activeProject`, shared form `name`, and `isLoading`. Exposes `openCreate/openRename/openDelete/close`, `setName`, and `submitCreate/submitRename/submitDelete`. Submits run a 500ms simulated-latency lifecycle (toggles `isLoading`, then resets) since there is no persistence yet; `close()` is a no-op while loading.
  - `components/editor/editor-home.tsx`: centered, card-less home content — `Create a project or open an existing one` heading, supporting description, and a `New Project` button with the `Plus` icon that opens the Create dialog.
  - `components/editor/dialogs/`: `create-project-dialog` (name input + live slug preview that updates as you type), `rename-project-dialog` (prefilled + auto-focused name input, current name in the description, Enter submits via form), and `delete-project-dialog` (destructive confirmation only, no input, destructive confirm button). All reuse the existing `editor-dialog.tsx` wrapper.
  - `components/editor/project-list-item.tsx`: a project row; for owned projects it renders a hover-revealed `MoreHorizontal` dropdown (`Rename` / destructive `Delete`). Actions are hidden for shared/collaborator projects.
  - `components/editor/project-sidebar.tsx`: now renders the mock owned/shared lists (scrollable, empty-state fallback) and forwards `onCreate/onRename/onDelete`; bottom `New Project` button and sidebar toggle behavior unchanged.
  - `components/editor/editor-shell.tsx`: instantiates `useProjectDialogs`, renders the home content, mounts the three dialogs, and adds a mobile-only (`md:hidden`) backdrop scrim that closes the sidebar on outside tap.
  - Added shadcn `dropdown-menu` and `label` primitives via `npx shadcn@latest add` (generated, unmodified).
  - Centering fix: the editor home content was pinned under the navbar because the canvas container (`relative flex-1`, `display:block` with an `auto` specified height) could not resolve the child's `h-full`. Fixed by making the canvas container itself center its in-flow child (`flex items-center justify-center`) and dropping `h-full` from `editor-home.tsx`; the absolute sidebar/scrim overlays are unaffected. Verified in-browser that the heading/description/CTA are vertically and horizontally centered (the sidebar is a floating overlay over the centered content, by design).
  - Verified: `tsc --noEmit`, `eslint`, and the dev `/editor` route compile with no errors.
- `05-prisma`: Added the project data models, the Prisma client singleton, and the first migration.
  - `prisma/models/project.prisma`: multi-file schema model file (config uses `schema: "prisma/"`). `ProjectStatus` enum (`DRAFT`, `ARCHIVED`). `Project` model — `id` (cuid), `ownerId` (Clerk user ID), `name`, optional `description`, `status` (`@default(DRAFT)`), optional `canvasJsonPath` (future Vercel Blob reference), `createdAt`/`updatedAt`, and a `collaborators` relation; indexed on `ownerId` and `createdAt`. `ProjectCollaborator` model — `id`, `projectId` + `project` relation with `onDelete: Cascade`, `email`, `createdAt`; `@@unique([projectId, email])`, plus indexes on `email` and `[projectId, createdAt]`.
  - `lib/prisma.ts`: cached singleton. Branches on `DATABASE_URL` — a `prisma+postgres://` URL uses `new PrismaClient({ accelerateUrl }).$extends(withAccelerate())`; any other URL uses a direct `@prisma/adapter-pg` (`PrismaPg`) adapter. Client is cached on `globalThis` outside production for hot-reload safety. Imports `PrismaClient` from the generated client at `@/app/generated/prisma/client`.
  - Installed `@prisma/extension-accelerate` (the only addition; `prisma`, `@prisma/client`, `@prisma/adapter-pg`, and `pg` were already present) to support the Accelerate branch.
  - Migration `20260624080555_init_projects` created and applied against the Prisma Postgres database; the generated client lives at `app/generated/prisma`.
  - Verified: `npx prisma migrate dev` applied cleanly, `eslint` reports no errors on `lib/prisma.ts`, and `npm run build` passes (TypeScript included).

## In Progress

- None.

## Next Up

- Project persistence API routes under `app/api/` using `lib/prisma.ts`, replacing the `04-project-dialogs` mock data and simulated submits with real CRUD against `Project` / `ProjectCollaborator` (with Clerk ownership checks at the mutation boundary).

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Prisma 7 with the `prisma-client` generator: the client is generated to `app/generated/prisma` and must be imported from `@/app/generated/prisma/client` (never `@prisma/client`). A driver adapter (or `accelerateUrl`) is mandatory at runtime — `new PrismaClient()` with no options throws.
- `lib/prisma.ts` is the single Prisma access point. It branches on the `DATABASE_URL` scheme so the same code works for direct Postgres (`@prisma/adapter-pg`) and Prisma Accelerate (`prisma+postgres://` → `withAccelerate()`), with the instance cached on `globalThis` outside production.

## Session Notes

- `/` redirects authenticated users to `/editor` as specified in `03-auth`, but the `/editor` route does not exist yet (the editor chrome components from `02-editor-chrome` are not yet mounted on a page). Building the `/editor` route is a separate, not-yet-implemented unit.
- Clerk is Core 3 (`@clerk/nextjs` v7). `ClerkProvider` must sit inside `<body>`, themes come from `@clerk/ui` (not `@clerk/themes`), and `auth()` exposes `isAuthenticated`.
- shadcn is pinned to style `radix-nova` in `components.json` (component library: radix, base color: neutral). Use `npx shadcn@latest add <component> -y` for future primitives; never hand-edit `components/ui/*`.
- Dark mode is enforced via the `dark` class on `<html>` rather than per-token overrides. `globals.css` still carries the generated light `:root` block, which is inert while `dark` is applied.
