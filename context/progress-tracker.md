# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Editor Workspace Shell (`08-editor-workspace-shell`) — complete. The `/editor/[roomId]` route exists as a server component with owner/collaborator access checks, an `AccessDenied` fallback, and a full-viewport workspace layout (navbar with project name + share/AI-toggle actions, reused `ProjectSidebar` with the active room highlighted, canvas placeholder, and an AI-chat sidebar placeholder). No real canvas, Liveblocks, AI, or sharing behavior yet.

## Current Goal

- Bring the workspace canvas to life: real-time collaborative canvas (Liveblocks + React Flow) inside `/editor/[roomId]`.

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
- `06-project-apis`: Added the backend-only project REST API routes on top of `lib/prisma.ts`. No UI wiring (per spec).
  - `app/api/projects/route.ts`: `GET` lists the authenticated user's projects (`where: { ownerId: userId }`, ordered `createdAt desc`); `POST` creates a project, defaulting a missing/blank `name` to `Untitled Project` and using the schema's `cuid` ID strategy (no sequential IDs). Returns `201` on create.
  - `app/api/projects/[projectId]/route.ts`: `PATCH` renames (requires a non-empty `name`, else `400`); `DELETE` deletes. Both load the project, return `404` when missing, and enforce owner-only mutation.
  - Auth: every handler reads `userId` from Clerk's `await auth()`; missing user → `401`. A missing project and a project owned by someone else both return `404` (rename/delete) so callers cannot probe which project IDs exist. `ownerId` is always the Clerk user ID.
  - Fixed a latent type defect in `lib/prisma.ts`: `createPrismaClient` previously returned a union (Accelerate-extended vs. plain client), which made model methods like `findUnique` non-callable once a consumer existed. Unified the return type to `PrismaClient` (casting the Accelerate branch). Runtime branching is unchanged.
  - Verified: `npm run build` passes (TypeScript + route registration for `/api/projects` and `/api/projects/[projectId]`); `eslint` reports no errors on the new routes or `lib/prisma.ts`.
- `07-wire-editor-home`: Wired the editor home sidebar and dialogs to the real project API, replacing all `04-project-dialogs` mock data.
  - `lib/projects.ts`: server-only `getProjectsForUser()` data helper returning `{ owned, shared }` UI projects. Owned = `where: { ownerId: userId }`; shared = projects where a collaborator `email` matches the Clerk `currentUser()` primary email (excluding owned), each ordered `createdAt desc`. Maps DB records to the UI `Project` type with `slug = id` (the room ID doubles as the displayed slug). Returns empty lists when unauthenticated.
  - `app/editor/page.tsx`: server component now calls `getProjectsForUser()` and passes `ownedProjects` / `sharedProjects` into `EditorShell`. No client-side fetching on initial load.
  - `hooks/use-project-actions.ts` (replaces the deleted `use-project-dialogs.ts`): owns dialog state plus real mutations via `fetch`. Create locks a short unique suffix when the dialog opens, exposes a derived `roomId` (`slugify(name)-suffix`) for the live preview, `POST`s `{ id: roomId, name }`, and `router.push("/editor/<id>")`. Rename `PATCH`es `{ name }` then `router.refresh()`. Delete `DELETE`s then `router.push("/editor")` when `usePathname()` is on the active workspace (`/editor/<id>`), else `router.refresh()`. `close()` is a no-op while loading; failed responses leave the dialog open.
  - `app/api/projects/route.ts` (`POST`): now accepts an optional client-supplied `id` (the room ID) so the project ID and Liveblocks room ID stay aligned; omitting it falls back to the schema's `cuid` default. `06`'s name defaulting is unchanged.
  - `components/editor/dialogs/create-project-dialog.tsx`: preview relabeled `Room ID preview` and driven by the hook's `roomId` (no longer slugifies locally), so the preview matches the ID that is actually created.
  - `components/editor/project-sidebar.tsx`: renders `owned` / `shared` props instead of importing mock fixtures; `editor-shell.tsx` forwards the server-fetched lists and the create dialog's `roomId`.
  - Removed `lib/mock-projects.ts` and `hooks/use-project-dialogs.ts`.
  - Note: the create flow navigates to `/editor/[roomId]`, a workspace route that does not exist yet (a separate, not-yet-built unit) — navigation currently lands on a 404.
  - Post-review hardening (Bugbot): `POST /api/projects` now wraps `prisma.project.create` in a try/catch and returns `409` on a `Prisma.PrismaClientKnownRequestError` with code `P2002` (duplicate client-supplied room ID from a double submit/retry); other errors rethrow. `useProjectActions` now exposes an `error` string and surfaces failed/`!response.ok` mutations (and network exceptions) instead of returning silently; the create/rename/delete dialogs render the message in a `role="alert"` line, and `error` resets on open/close.
  - Verified: `npm run build` passes (TypeScript + all route registration); `eslint` reports no errors on the changed files.
- `08-editor-workspace-shell`: Built the `/editor/[roomId]` workspace route as a server component with server-side access checks and a full-viewport layout. No canvas/Liveblocks/AI/sharing logic (per scope).
  - `lib/project-access.ts`: `getCurrentIdentity()` returns `{ userId, email }` from Clerk (`auth()` + `currentUser()` primary email) or `null` when unauthenticated. `getAccessibleProject(projectId, identity)` loads the project (`include: { collaborators: true }`) and returns it only when the identity is the owner or a collaborator whose email matches; returns `null` for missing or unauthorized projects.
  - `app/editor/[roomId]/page.tsx`: server component. Unauthenticated → `redirect("/sign-in")`. Missing/unauthorized project → renders `AccessDenied`. Otherwise fetches the user's project lists via `getProjectsForUser()` and renders `EditorWorkspace` with `roomId` + `projectName`. (`params` is awaited — Next.js 16 async params.)
  - `components/editor/access-denied.tsx`: server component. Centered layout, lock icon in a bordered tile, short message, and an outline `Back to projects` button linking to `/editor`.
  - `components/editor/editor-workspace-navbar.tsx`: workspace top navbar (`h-14`, `bg-card`, bottom border). Left: project-sidebar toggle (`PanelLeftOpen`/`PanelLeftClose`) + truncated project name. Right: a `Share` button (no behavior yet, per scope), an AI-sidebar toggle (`Sparkles`, `aria-pressed`), and Clerk's `UserButton`.
  - `components/editor/editor-workspace.tsx`: client shell. Reuses `useProjectActions` to keep the sidebar's create/rename/delete dialogs fully functional (delete already redirects away from the active workspace). Renders the workspace navbar, the central canvas placeholder (`bg-background`, centered message, fills remaining space), the existing `ProjectSidebar` (left floating overlay) with `activeProjectId={roomId}`, a mobile backdrop scrim, and a right slide-over AI-chat sidebar placeholder (`w-80`, toggled by `isAiSidebarOpen`).
  - `components/editor/project-sidebar.tsx` + `project-list-item.tsx`: added an optional `activeProjectId` / `isActive` prop chain so the current room is highlighted (`bg-muted` row + `text-primary` name, `aria-current="page"`). Home (`editor-shell.tsx`) is unchanged — it omits the prop, so nothing is highlighted there.
  - Verified: `npm run build` passes (TypeScript clean, `/editor/[roomId]` registered as a dynamic route); `eslint` reports no errors on the new/changed files.
  - Post-review hardening (Bugbot): (1) `project-list-item.tsx` now wraps the name/slug in a `next/link` to `/editor/{project.id}`, so sidebar rows open/switch projects (the dropdown actions stay separate). (2) `app/api/projects/[projectId]/route.ts` `PATCH`/`DELETE` now return `404` for both missing and non-owner projects (previously `403` for non-owner), removing the ID-enumeration signal. (3) `use-project-actions.ts` `submitCreate` now treats a `409` (duplicate client-supplied room ID from a double submit/retry) as success and navigates to `/editor/{roomId}` instead of leaving the dialog stuck on an error.

## In Progress

- None.

## Next Up

- Real-time collaborative canvas inside `/editor/[roomId]` (Liveblocks room provisioning + React Flow surface), replacing the canvas placeholder.

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
