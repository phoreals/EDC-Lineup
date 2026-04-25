# EDC Lineup - Visual Design System

> Design tokens, color system, typography, spacing, and component styling reference.
> Last updated: 2026-04-25

---

## Color System

All colors use HSLA format. Primitives (Layer 1) are raw values; semantic tokens (Layer 2) reference them by intent.

### Neutrals

| Token | Value | Usage |
|-------|-------|-------|
| `--color-neutral-950` | `hsla(0,0%,5%,1)` | Page background |
| `--color-neutral-800` | `hsla(0,0%,11%,1)` | Raised surfaces |
| `--color-neutral-700` | `hsla(0,0%,22%,1)` | Default borders |
| `--color-neutral-600` | `hsla(0,0%,32%,1)` | Subtle borders |
| `--color-neutral-400` | `hsla(0,0%,64%,1)` | Muted text |
| `--color-neutral-100` | `hsla(0,0%,96%,1)` | Primary text |

### Brand

| Token | Value | Usage |
|-------|-------|-------|
| `--color-purple-500` | `hsla(271,91%,65%,1)` | Brand primary |
| `--color-purple-400` | `hsla(270,95%,85%,1)` | Accent text |
| `--color-orange-400` | `hsla(25,95%,53%,1)` | Gradient endpoint |
| `--color-blue-500` | `hsla(217,91%,60%,1)` | Alt gradient endpoint |

### Danger

| Token | Value |
|-------|-------|
| `--color-red-500` | `hsla(0,84%,60%,1)` |

### Stage Palette (9 stages)

Each stage has three tokens: `bg`, `border`, `text`. All follow the same pattern: dark desaturated background, vibrant border, light tinted text.

| Stage | Hue | Border |
|-------|-----|--------|
| Neon Garden | 55 (Gold) | `hsla(55,88%,50%,1)` |
| Wasteland | 355 (Red) | `hsla(355,92%,65%,1)` |
| Stereobloom | 25 (Orange) | `hsla(25,96%,62%,1)` |
| Kinetic Field | 330 (Pink) | `hsla(330,88%,68%,1)` |
| Basspod | 110 (Green) | `hsla(110,72%,52%,1)` |
| Bionic Jungle | 240 (Indigo) | `hsla(240,86%,74%,1)` |
| Quantum Valley | 165 (Teal) | `hsla(165,82%,50%,1)` |
| Circuit Grounds | 280 (Purple) | `hsla(280,90%,70%,1)` |
| Cosmic Meadow | 200 (Cyan) | `hsla(200,92%,66%,1)` |

---

## Semantic Tokens

### Backgrounds

| Token | Resolves to |
|-------|-------------|
| `--bg-page` | `neutral-950` |
| `--bg-surface-raised` | `neutral-800` |
| `--bg-overlay` | `neutral-950` at 65% opacity |
| `--bg-hover` | `purple-500` at 5% opacity |
| `--bg-favorited` | `linear-gradient(135deg, purple-500@12%, orange-400@12%)` |

### Text

| Token | Resolves to |
|-------|-------------|
| `--text-primary` | `neutral-100` |
| `--text-muted` | `neutral-400` |
| `--text-accent` | `purple-400` |
| `--text-inverse` | `neutral-950` |

### Gradients

| Token | Value |
|-------|-------|
| `--gradient-brand` | `linear-gradient(135deg, purple-500, orange-400)` |
| `--gradient-brand-alt` | `linear-gradient(135deg, purple-500, blue-500)` |
| `--gradient-fav` | `linear-gradient(135deg, amber-400, amber-600)` |
| `--gradient-fade-l` | Left edge fade to transparent |
| `--gradient-fade-r` | Right edge fade to transparent |

### SVG Paint Server

A shared `<linearGradient id="pill-grad">` is defined in Controls.jsx for applying brand gradient to SVG strokes/fills. Referenced via `stroke: url(#pill-grad)` in CSS or `strokeColor="url(#pill-grad)"` as a JSX prop.

---

## Typography

### Font

`Space Grotesk`, sans-serif (`--font-primary`)

### Scale

| Token | Size |
|-------|------|
| `--text-2xs` | 8px |
| `--text-xs` | 10px |
| `--text-sm` | 12px |
| `--text-sm-plus` | 14px |
| `--text-base` | 16px |
| `--text-lg` | 18px |
| `--text-xl` | 20px |
| `--text-2xl` | 24px |
| `--text-3xl` | 32px |
| `--text-4xl` | 40px |

### Weights

| Token | Value |
|-------|-------|
| `--font-weight-normal` | 400 |
| `--font-weight-bold` | 700 |

### Line Heights

| Token | Value |
|-------|-------|
| `--leading-none` | 1 |
| `--leading-tight` | 1.2 |
| `--leading-snug` | 1.3 |

### Fluid Typography

Schedule grid and header use `clamp()` for fluid sizing:
- Header h1: `clamp(24px, 5vw, 40px)`
- Stage headers: `clamp(8px, 1cqi + 4px, 12px)`
- Set block names: `clamp(8px, 1cqi + 4px, 12px)`

---

## Spacing

4px base unit with 8pt grid:

| Token | Value |
|-------|-------|
| `--space-0-5` | 2px |
| `--space-1` | 4px |
| `--space-1-5` | 6px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |

### Page Gutters

| Context | Value |
|---------|-------|
| Desktop | `--page-gutter`: 72px |
| Mobile | `--page-gutter-mobile`: 16px |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-xs` | 4px | Small elements, search mark |
| `--radius-sm` | 8px | Inputs, dropdowns, mobile buttons |
| `--radius-md` | 12px | Desktop buttons |
| `--radius-card` | 16px | Artist cards |
| `--radius-column` | 20px | Active filter pills, day buttons |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-nav` | `0 4px 20px hsla(0,0%,0%,0.2)` | Controls bar |
| `--shadow-dropdown` | `0 8px 32px hsla(0,0%,0%,0.4)` | Dropdown menus |

---

## Z-Index Layers

| Layer | Value | Usage |
|-------|-------|-------|
| `--z-schedule-lines` | 0 | Hour/half-hour grid lines |
| `--z-schedule-grid` | 1 | Stage columns |
| `--z-schedule-block` | 1 | Set blocks |
| `--z-schedule-block-hover` | 5 | Hovered set block |
| `--z-schedule-time-gutter` | 15 | Time label sidebar |
| `--z-schedule-header` | 20 | Stage name header |
| `--z-sticky-section` | 50 | Sticky section headers |
| `--z-nav` | 100 | Controls bar |
| `--z-toast` | 101 | Toast notifications |
| `--z-dropdown` | 110 | Dropdown menus |

---

## Motion

### Durations

| Token | Value |
|-------|-------|
| `--duration-base` | 0.2s |
| `--duration-slow` | 0.3s |

### Easing

`--ease-default`: `ease`

### Press States

| Token | Value | Usage |
|-------|-------|-------|
| `--scale-press` | 0.97 | Button press |
| `--scale-press-subtle` | 0.98 | Schedule block press |

### Animations

**Dropdown enter**: `opacity 0 → 1, translateY(6px → 0)` over `--duration-slow`
**Dropdown exit**: reverse of enter
**Tab indicator**: `transform` + `width` over `--duration-slow`
**Search overlay (mobile)**: `opacity` + `translateX` over `--duration-base`

### Reduced Motion

`prefers-reduced-motion: reduce` sets all `animation-duration` and `transition-duration` to `0.01ms`, disables smooth scrolling.

---

## Component Patterns

### Control Sizing

| Context | Desktop | Mobile |
|---------|---------|--------|
| Row 1 (tabs, search) | 48px | 36px |
| Row 2+ (pills, toggles) | 36px | 28px |
| Tap target (invisible) | -- | 36px min |

### Button State Pattern

All interactive controls follow this progression:

| State | Border | Background | Text/Icon |
|-------|--------|------------|-----------|
| Rest | `--border-default` | `--bg-surface-raised` | `--text-muted` |
| Hover | `--color-brand` | unchanged | `--color-brand` |
| Press | unchanged | unchanged | unchanged + `scale(0.97)` |
| Active (filled) | `transparent` | `--gradient-brand` | `--text-inverse` |
| Active (outline) | gradient via `background-clip` | surface | gradient stroke via prop |

### Active Filter Pill Border

The "Filtering by" container uses an SVG `<rect>` for its border with a `clip-path: polygon()` that notches out a 2px gap where the label sits (fieldset-legend style). The clip-path approach avoids sub-pixel rendering artifacts on high-DPI screens.

### Gradient Border Technique

Used by filterBtn and colSizeCycle active states:
```scss
border-color: transparent;
background:
  linear-gradient(var(--bg-surface-raised), var(--bg-surface-raised)) padding-box,
  var(--gradient-brand) border-box;
```
Solid color must be wrapped in `linear-gradient()` for `padding-box` clipping to work.

### Gradient Text Technique

Used by active filter pills, dropdown items, header h1:
```scss
background: var(--gradient-brand);
-webkit-background-clip: text;
background-clip: text;
-webkit-text-fill-color: transparent;
```

### Gradient SVG Stroke

Two methods:
1. **CSS** (for elements inside dropdowns): `stroke: url(#pill-grad)` on the SVG element, inherited by children
2. **JSX prop** (for standalone buttons): `strokeColor="url(#pill-grad)"` set directly on shape elements

### Backdrop Blur

Sticky elements use semi-transparent overlay + blur:
```scss
background: var(--bg-overlay);       // neutral-950 at 65%
backdrop-filter: blur(8px);
-webkit-backdrop-filter: blur(8px);
```
Applied to: controls bar, schedule header.

**Sticky section headers** (browse views) use a `::before` pseudo-element for the backdrop, with a `mask-image` gradient that fades from opaque at top to transparent at bottom. This creates a soft fade-out when content scrolls behind the stuck header.

### Schedule Column Sizing

Fluid widths via `clamp()` with container query units:

| Size | Range |
|------|-------|
| sm | `clamp(54px, 8cqi + 16px, 110px)` |
| md | `clamp(72px, 12cqi + 24px, 160px)` |
| lg | `clamp(86px, 14cqi + 28px, 192px)` |
