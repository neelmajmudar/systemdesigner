# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Editor Chrome — base navbar and sidebar shell (feature spec `02-editor-chrome`)

## Current Goal

- Build the reusable editor chrome that frames every editor screen: the top navbar, the floating left project sidebar, and a reusable dialog pattern ready for future use.

## Completed

- `01-design-system`: Initialized and configured shadcn/ui (Next.js template, radix base, neutral base color, CSS variables) for Next.js 16 + Tailwind v4.
  - Added UI primitives in `components/ui/`: `button`, `card`, `dialog`, `input`, `tabs`, `textarea`, `scroll-area` (generated, unmodified).
  - Installed `lucide-react` (plus `class-variance-authority`, `clsx`, `tailwind-merge`, `radix-ui`, `tw-animate-css`).
  - `lib/utils.ts` exposes the `cn()` Tailwind class-merge helper.
  - Theme tokens written to `app/globals.css`; forced dark-only by adding the `dark` class to `<html>` in `app/layout.tsx` so no default light styling appears.
  - Verified: `tsc --noEmit` and `next build` both pass.
- `02-editor-chrome`: Added the base editor chrome components in `components/editor/`.
  - `editor-navbar.tsx`: fixed-height (`h-14`) top navbar with left/center/right sections, dark `bg-card` background and a subtle bottom border. Left section holds a sidebar toggle button that swaps `PanelLeftOpen` / `PanelLeftClose` based on `isSidebarOpen`; right section is intentionally empty.
  - `project-sidebar.tsx`: floating left overlay (`absolute`, `z-40`) that slides in from the left via a transform on the `isOpen` prop so it does not push page content. Header with `Projects` title + close button, shadcn `Tabs` (`My Projects` / `Shared`) each showing an empty placeholder state, and a full-width `New Project` button with the `Plus` icon pinned to the bottom.
  - `editor-dialog.tsx`: reusable dialog pattern wrapping the shadcn `Dialog`, supporting `title`, `description`, and `footer` actions, styled with existing `globals.css` tokens (`bg-popover` / `text-popover-foreground`). No concrete dialogs built yet — the pattern is ready for future use.
  - Verified: `tsc --noEmit` passes and `eslint components/editor` reports no errors.

## In Progress

- None.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Add decisions that affect the system design or data model.

## Session Notes

- shadcn is pinned to style `radix-nova` in `components.json` (component library: radix, base color: neutral). Use `npx shadcn@latest add <component> -y` for future primitives; never hand-edit `components/ui/*`.
- Dark mode is enforced via the `dark` class on `<html>` rather than per-token overrides. `globals.css` still carries the generated light `:root` block, which is inert while `dark` is applied.
