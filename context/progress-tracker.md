# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Foundation — Design System & UI Primitives (feature spec `01-design-system`)

## Current Goal

- Install and configure shadcn/ui, add the base UI primitive components, install `lucide-react`, provide a `cn()` helper, and ensure everything renders against the dark theme.

## Completed

- `01-design-system`: Initialized and configured shadcn/ui (Next.js template, radix base, neutral base color, CSS variables) for Next.js 16 + Tailwind v4.
  - Added UI primitives in `components/ui/`: `button`, `card`, `dialog`, `input`, `tabs`, `textarea`, `scroll-area` (generated, unmodified).
  - Installed `lucide-react` (plus `class-variance-authority`, `clsx`, `tailwind-merge`, `radix-ui`, `tw-animate-css`).
  - `lib/utils.ts` exposes the `cn()` Tailwind class-merge helper.
  - Theme tokens written to `app/globals.css`; forced dark-only by adding the `dark` class to `<html>` in `app/layout.tsx` so no default light styling appears.
  - Verified: `tsc --noEmit` and `next build` both pass.

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
