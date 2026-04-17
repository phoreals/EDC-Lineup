# EDC 2026 Lineup

React + Vite app for browsing the EDC 2026 festival lineup. Filter by day or stage, search artists, and star your must-see sets.

## Features

- **Schedule View** — timeline grid showing all stages with set times, fluid sizing via `clamp()` and container queries
- **List View** — artists displayed in 3 sub-modes:
  - **A to Z** — all artists sorted alphabetically with letter headers, showing stage and set time
  - **By Day** — artists grouped by stage under each day
  - **By Stage** — artists grouped by day under each stage, with stages side by side when space allows
- **Day Filters** — Friday / Saturday / Sunday; single-select toggle on Schedule, multi-select on List View
- **Stage Filters** — dropdown checklist to filter by stage or favorites
- **Search** — instant artist search across all views
- **Favorites** — star artists to highlight them; persisted to localStorage

## Stack

- **React 18** — component architecture
- **Vite 5** — dev server & build
- **SCSS Modules** — scoped component styles with nesting
- **Sass** — `@use` namespacing, modern-compiler API
- **Vitest** — unit tests with jsdom

## Design System

All tokens use HSLA color format. Tokens live in two SCSS partials under `src/styles/`:

### `_primitives.scss` — Layer 1
Raw values emitted as CSS custom properties on `:root`. Includes stage palette colors (`--stage-*-bg`, `--stage-*-border`, `--stage-*-text`), spacing, typography, and layout tokens.

### `_tokens.scss` — Layer 2
Semantic names that reference Layer 1 CSS custom properties by intent (e.g. `--bg-page`, `--text-primary`, `--gradient-brand`).

Runtime values like `--sticky-top` are written by JS.

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
│   ├── Icons.jsx                        # SVG icon components
│   ├── ScheduleGrid.jsx / .module.scss  # Timeline schedule view
│   ├── StageColumn.jsx / .module.scss   # Stage column in list view
│   └── __tests__/                       # Component tests
├── data/
│   ├── lineup.js                        # Artist data + helpers
│   ├── schedule.js                      # Set time data + helpers
│   └── __tests__/                       # Data tests
├── hooks/
│   ├── useFavorites.js                  # localStorage-backed favorites
│   ├── useStickyHeight.js               # ResizeObserver → --sticky-top
│   └── __tests__/                       # Hook tests
├── styles/
│   ├── _primitives.scss                 # Layer 1: raw value tokens (HSLA)
│   ├── _tokens.scss                     # Layer 2: semantic tokens + :root CSS vars
│   └── global.scss                      # Reset + base styles
├── App.jsx                              # Root: all state lives here
└── main.jsx                             # Vite entry
```

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
