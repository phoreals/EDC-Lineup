# EDC 2026 Lineup

React + Vite app for browsing the EDC 2026 festival lineup. Filter by day or stage, search artists, and star your must-see sets.

## Features

- **Schedule View** — timeline grid showing all stages with set times, fluid sizing via `clamp()` and container queries; empty stages auto-hide when filtering by favorites or search; long artist names use soft hyphens for clean word breaks in narrow columns
- **List View** — artists displayed in 3 sub-modes:
  - **A to Z** — all artists sorted alphabetically with letter headers, showing stage and set time
  - **By Day** — artists grouped by stage under each day
  - **By Stage** — artists grouped by day under each stage, with stages side by side when space allows
- **Day Filters** — Friday / Saturday / Sunday; single-select toggle on Schedule, multi-select on List View
- **Stage Filters** — dropdown checklist to filter by stage or favorites; animated enter/exit transitions
- **Search** — instant artist search across all views; mobile search bar slides in/out with animation
- **Favorites** — star artists to highlight them; persisted to localStorage
- **Dynamic Header** — tagline updates per view: "Schedule for Friday, May 15, 2026" or "Browse the lineup alphabetically"

## Stack

- **React 18** — component architecture
- **Vite 5** — dev server & build
- **SCSS Modules** — scoped component styles with nesting
- **Sass** — `@use` namespacing, modern-compiler API
- **Vitest** — unit tests with jsdom

## Design System

All tokens use HSLA color format. Tokens live in two SCSS partials under `src/styles/`:

### `_primitives.scss` — Layer 1
Raw values emitted as CSS custom properties on `:root`. Includes stage palette colors (`--stage-*-bg`, `--stage-*-border`, `--stage-*-text`), spacing, typography, layout tokens, and z-index layers (`--z-schedule-*`, `--z-sticky-section`, `--z-nav`, etc.).

### `_tokens.scss` — Layer 2
Semantic names that reference Layer 1 CSS custom properties by intent (e.g. `--bg-page`, `--text-primary`, `--gradient-brand`).

Runtime values like `--sticky-top` are written by JS via `useStickyHeight`.

### Sizing Hierarchy
Controls use a two-tier sizing system:
- **Row 1** (tabs, search): `--control-height` (48px) / `--control-height-mobile` (36px)
- **Row 2 & 3** (pills, toggles, filters): `--control-height-sm` (36px) / `--control-height-sm-mobile` (28px)

Mobile touch targets are extended to `--tap-target-mobile` (36px) via a `::after` pseudo-element, keeping visual sizes compact while meeting accessibility targets.

### Accessibility
- `prefers-reduced-motion` disables all animations/transitions globally
- All interactive elements have `:focus-visible` outlines
- Tooltips provide contextual info (artist times, action descriptions) without duplicating visible text
- SVG gradient fills on active filter states via shared `#pill-grad` defs

## Project Structure

```
src/
├── components/
│   ├── AlphaGrid.jsx / .module.scss     # A to Z alphabetical view
│   ├── ArtistCard.jsx / .module.scss    # Individual artist entry
│   ├── ByStageGrid.jsx / .module.scss   # By Stage view with day columns per stage
│   ├── CompactGrid.jsx / .module.scss   # By Day view (compact artist list)
│   ├── Controls.jsx / .module.scss      # Nav tabs, day filters, dropdowns
│   ├── DayGrid.jsx / .module.scss       # Day grid (legacy)
│   ├── Header.jsx / .module.scss        # Page header
│   ├── Highlight.jsx                    # Search highlighting + word break hints (soft hyphens)
│   ├── Icons.jsx                        # SVG icon components
│   ├── ScheduleGrid.jsx / .module.scss  # Timeline schedule view
│   ├── StageColumn.jsx / .module.scss   # Stage column in list view
│   └── __tests__/                       # Component tests
├── data/
│   ├── lineup.js                        # Artist data, stage order, day-date mapping + helpers
│   ├── schedule.js                      # Set time data + helpers
│   ├── stageColors.js                   # Stage → CSS custom property color mapping
│   └── __tests__/                       # Data tests
├── hooks/
│   ├── useFavorites.js                  # localStorage-backed favorites
│   ├── useStickyHeight.js               # ResizeObserver → --sticky-top
│   └── __tests__/                       # Hook tests
├── styles/
│   ├── _primitives.scss                 # Layer 1: raw value tokens (HSLA)
│   ├── _tokens.scss                     # Layer 2: semantic tokens + :root CSS vars
│   ├── _list-card.scss                  # Shared card/list mixins for list views
│   └── global.scss                      # Reset, base styles, prefers-reduced-motion
├── App.jsx                              # Root: all state lives here
└── main.jsx                             # Vite entry
```

## Documentation

- **[UX Reference](docs/UX.md)** — complete interaction guide: views, controls, responsive behavior, keyboard/accessibility, animations, and state management

## Getting Started

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Build & Deploy

```bash
npm run build
npm run preview
```

Deploys to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`.

## Testing

```bash
npm run test        # run once
npm run test:watch  # watch mode
npm run lint        # eslint
```
