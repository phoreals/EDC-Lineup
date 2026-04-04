# EDC 2026 Lineup

A React + Vite app for browsing the EDC 2026 festival lineup. Filter by day or stage, search artists, and star your must-see sets.

## Stack

- **React 18** — component architecture
- **Vite 5** — dev server + build
- **CSS Modules** — scoped component styles
- **CSS Custom Properties** — two-layer design token system

## Design System

Tokens live in `src/styles/tokens.css` in two layers:

1. **Primitive tokens** — natural-language names tied to raw values
   ```css
   --color-neon-violet: #9d5cff;
   --space-4: 16px;
   --text-sm: 14px;
   ```

2. **Semantic tokens** — intent-driven names that reference primitives
   ```css
   --color-brand: var(--color-neon-violet);
   --bg-surface: var(--color-graphite-900);
   --text-accent: var(--color-soft-violet);
   ```

Spacing follows an **8pt grid**: `--space-1` (4px) through `--space-20` (80px).

## Project Structure

```
src/
├── components/
│   ├── ArtistCard.jsx       # Individual artist row
│   ├── ArtistCard.module.css
│   ├── ByStageGrid.jsx      # Cross-day by-stage view
│   ├── ByStageGrid.module.css
│   ├── Controls.jsx         # Sticky nav: tabs, search, filters
│   ├── Controls.module.css
│   ├── DayGrid.jsx          # Single-day stage grid
│   ├── DayGrid.module.css
│   ├── Header.jsx
│   ├── Header.module.css
│   ├── Icons.jsx            # SVG icon components
│   ├── StageColumn.jsx      # Stage card with artist list
│   └── StageColumn.module.css
├── data/
│   └── lineup.js            # Artist data + helper functions
├── hooks/
│   ├── useFavorites.js      # localStorage-backed favorites
│   └── useStickyHeight.js   # Measures controls height → CSS var
├── styles/
│   ├── global.css           # Reset + base styles
│   └── tokens.css           # Design system tokens (both layers)
├── App.jsx                  # Root: all state lives here
└── main.jsx                 # Vite entry point
```

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Pushing to GitHub

If you're adding this to an existing repo:

```bash
# From inside this folder
git init
git remote add origin https://github.com/phoreals/EDC-Lineup.git
git add .
git commit -m "Rebuild: React + Vite + 8pt design system"
git push -f origin main
```
