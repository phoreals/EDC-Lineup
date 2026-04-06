# EDC 2026 Lineup

React + Vite app for browsing the EDC 2026 festival lineup. Filter by day or stage, search artists, and star your must-see sets.

## Stack

- **React 18** — component architecture
- **Vite 5** — dev server & build
- **SCSS Modules** — scoped component styles with nesting
- **Sass** — `@use` namespacing, mixins, variables

## Design System

Tokens live in two SCSS partials under `src/styles/`:

### `_primitives.scss` — Layer 1
Raw values with natural-language names. Never referenced directly in components.
```scss
$color-purple-500: #a855f7;
$space-4:          16px;
$text-base:        16px;
```

### `_tokens.scss` — Layer 2
Semantic names that reference primitives via `@use`. These are what components import.
```scss
$color-brand:    p.$color-purple-500;
$bg-surface:     p.$color-neutral-950;
$gradient-brand: linear-gradient(135deg, p.$color-purple-500 0%, p.$color-orange-400 100%);
```

CSS custom properties (`--sticky-top`) are emitted from `_tokens.scss` for values that JS needs to read/write at runtime.

## Project Structure

```
src/
├── components/
│   ├── ArtistCard.jsx / .module.scss
│   ├── ByStageGrid.jsx / .module.scss
│   ├── Controls.jsx / .module.scss
│   ├── DayGrid.jsx / .module.scss
│   ├── Header.jsx / .module.scss
│   ├── Icons.jsx
│   └── StageColumn.jsx / .module.scss
├── data/
│   └── lineup.js            # Artist data + helpers
├── hooks/
│   ├── useFavorites.js      # localStorage-backed favorites
│   └── useStickyHeight.js   # ResizeObserver → --sticky-top
├── styles/
│   ├── _primitives.scss     # Layer 1: raw value tokens
│   ├── _tokens.scss         # Layer 2: semantic tokens + :root CSS vars
│   └── global.scss          # Reset + base styles
├── App.jsx                  # Root: all state lives here
└── main.jsx                 # Vite entry
```

## Getting Started

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Build

```bash
npm run build
npm run preview
```

## Push to GitHub

```bash
git init
git remote add origin https://github.com/phoreals/EDC-Lineup.git
git add .
git commit -m "Refactor: React + Vite + SCSS modules + 8pt design system"
git push -f origin main
```
