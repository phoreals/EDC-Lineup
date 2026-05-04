# EDC Lineup - UX Documentation

> Complete interaction reference for the EDC Lineup web app.
> Last updated: 2026-05-03

---

## Views

The app has two top-level views, toggled via the **Timetable / Browse** tabs in the sticky controls bar. A third view ("My Schedule") is accessible via a toast prompt and replaces the controls bar with a minimal toolbar.

### Timetable View

Time-based grid showing artist sets across stages. Each column is a stage; rows are time slots (1.2 px/min). A sticky time gutter on the left shows hour labels.

**Column sizes** (S / M / L) control stage column widths using `clamp()` for fluid scaling. A `data-narrow` attribute triggers compact time formatting when the container is < 600 px.

The schedule runs from 5:00 PM Friday through ~6:00 AM Sunday. Times > 24:00 wrap correctly (25:00 = 1:00 AM next day).

### Browse View

Three sub-modes selected via **mode pills**:

| Mode | Description |
|------|-------------|
| **A to Z** | Artists grouped by first letter, deduplicated across days |
| **By Day** | Day columns, each with stage sub-columns |
| **By Stage** | Stage sections, each with day sub-columns |

A **layout toggle** (grid / list) switches between auto-fill columns and single-column list. In list mode, By Day and By Stage cards display artist name and set time inline on a single row (name truncates with ellipsis if needed). A to Z keeps name and time on separate lines since it also displays the stage name.

Artists within each stage column are sorted by set start time (earliest first).

### My Schedule View

A standalone, read-only page showing only favorited artist sets in chronological order. Reached via a "View My Schedule (List)" toast that appears when the Favorited filter is toggled on.

- **No controls bar** — Header (title + "My Schedule" tagline) only
- **Back button** — outlined pill with back arrow icon ("Return to Favorited View"), non-sticky, at top of page
- **Layout** — up to 3 columns side by side, one per day (Friday / Saturday / Sunday); only days with favorites render a column; collapses to 1 column on mobile
- **Non-interactive cards** — no hearts, no click handlers; artist name with stage and time on the same line (e.g., "Kinetic Field · 7:00pm – 8:00pm")
- **Copy toast** — "Copy to Clipboard" with copy icon; shows "Copied!" + check icon on success; dismissable

---

## Controls Bar

Sticky bar at the top with two rows.

### Top Row

| Element | Desktop | Mobile |
|---------|---------|--------|
| **Tabs** (Timetable / Browse) | Horizontal tabs with animated indicator | Same, narrower |
| **Search** | Always-visible input with clear button | Hidden; search icon opens full-width overlay |
| **Filter button** | Icon button with badge count | Same, smaller tap target |

### Sub-Nav Row

| Context | Left side | Right side |
|---------|-----------|------------|
| Timetable view | Day pills (Fri / Sat / Sun) | Column size toggle (S / M / L) |
| Browse view | Mode pills (A to Z / By Day / By Stage) | Layout toggle (grid / list) |

---

## Interaction Patterns

### Cycle-on-Reselect

Clicking an already-active option cycles to the next one. This applies to:

| Control | Options | Cycle order |
|---------|---------|-------------|
| Tabs (2 options) | Timetable, Browse | Timetable -> Browse -> Timetable |
| Layout toggle (2 options) | Grid, List | Grid -> List -> Grid |
| Day pills (3 options) | Friday, Saturday, Sunday | No-op (click inactive to select) |
| Mode pills (3 options) | A to Z, By Day, By Stage | No-op (click inactive to select) |
| Column size (3 options) | S, M, L | No-op (click inactive to select) |

Clicking an **inactive** option always selects it directly.

### Search

- **Desktop**: type in the persistent input; clear with X button; Enter blurs.
- **Mobile**: tap search icon to open overlay. Closes on: back button, Enter with text, or tap outside the search area. Closing clears the query.
- Filters artist names in real time (case-insensitive substring match).
- Applied across all grid views.

### Filter Dropdown

Opened by the filter button (funnel icon). Contains:

1. **Favorites toggle** -- heart icon, checkbox-style
2. **Day filters** (Browse view only) -- multi-select checkboxes
3. **Stage filters** -- multi-select, all 10 stages listed
4. **Clear All** button at bottom

Closes on: click outside, Escape key, or selecting an item (stays open for multi-select items; closes on Clear All).

Badge on filter button shows total active filter count.

All filters use AND logic (must match every active filter).

### Active Filters Summary

When filters are active, a summary row appears below the controls bar:

- "Filtering by" label with pills for each active filter
- Each pill has an X button to remove that filter
- Horizontal scroll with fade gradient on mobile
- Mobile pill labels are shortened: "Favorited" shows heart icon only, days show 3-letter abbreviations (Fri/Sat/Sun), stages show first word (exception: "Stereobloom" -> "Stereo")
- "Clear All" button to reset everything

### Favorites

- Click any artist card or set block to toggle favorite.
- Keyboard: Enter or Space on focused card.
- Persisted to `localStorage` (`edc-lineup-favorites`).
- Visual feedback: filled heart, gradient background, bold name, accent text color.

---

## Responsive Behavior

**Breakpoint**: 800 px (`$bp-mobile`)

| Feature | Desktop | Mobile |
|---------|---------|--------|
| Search | Persistent input (min-width 256 px) | Icon toggle -> full-width overlay |
| Column size toggle | 3 visible buttons (S / M / L) | Single cycle button -> dropdown |
| Button sizes | `--control-height-sm` | `--control-height-sm-mobile` |
| Tap targets | Native | Expanded to 36 px via `::after` pseudo |
| Filter pills summary | Horizontal scroll | Horizontal scroll + right fade |
| Tab indicator | Animated underline | Same, narrower tabs |

### Schedule Grid Responsive

- `ResizeObserver` detects narrow containers (< 600 px)
- Compact time formatting in narrow mode (e.g., "11p - 1a")
- Header scroll synced with body scroll
- Column widths scale fluidly via `clamp()`

---

## Animations & Transitions

| Element | Animation | Duration |
|---------|-----------|----------|
| Button hover/active | border-color, color transition | 150 ms |
| Button press | `scale(0.96)` | 150 ms |
| Dropdown open | fade in + translateY(6 px -> 0) | 200 ms |
| Dropdown close | fade out + translateY(0 -> 6 px) | 200 ms |
| Tab indicator slide | transform + width | 200 ms |
| Mobile search toggle | opacity + translateX | 150 ms |
| Search box focus | gradient ring + glow via `::before` / `::after` | 150 ms |
| Toast enter | fade in + translateY(14 px -> 0), ease-out-expo | 520 ms (120 ms delay) |
| Toast exit | fade out + translateY(0 -> 14 px) | 300 ms |
| Toast position (desktop) | Fixed bottom-right, 480 px max-width, 52 px tall | — |
| Toast position (mobile) | Fixed bottom full-width, 44 px tall | — |

---

## Keyboard & Accessibility

### Keyboard Shortcuts

| Key | Context | Action |
|-----|---------|--------|
| Tab | Global | Navigate focusable elements |
| Enter / Space | Button / card focused | Activate / toggle |
| Escape | Dropdown or mobile search open | Close |
| Enter | Search input (mobile) | Submit and close search |

### ARIA Attributes

| Attribute | Usage |
|-----------|-------|
| `aria-label` | All icon-only buttons (search, filter, layout, size) |
| `aria-expanded` | Dropdown trigger buttons |
| `aria-pressed` | Favorite toggle (artist cards / set blocks) |
| `aria-hidden="true"` | Decorative SVGs and icons |
| `role="button"` | Artist cards (non-`<button>` elements) |
| `tabIndex={0}` | Artist cards for keyboard focus |
| `title` | Tooltip text on all icon buttons |

### Focus Styles

- `focus-visible`: 2 px solid brand color outline, 1 px offset
- Search box: gradient ring (`::before`) + soft glow (`::after`) on `focus-within`
- Search box hover: brand color border

---

## Active States & Selected Styling

| Element | Selected state |
|---------|---------------|
| Tab | Brand gradient text + animated indicator bar |
| Day pill / Mode pill | Brand gradient background, white text |
| Column size button (desktop) | Brand gradient background, white icon |
| Column size button (mobile trigger) | Gradient border + gradient stroke icon |
| Column size dropdown item | Gradient text + gradient stroke on icon + checkmark |
| Layout toggle button | Brand gradient background, white icon |
| Filter button (dropdown open) | Gradient border + gradient stroke icon |
| Artist card (favorited) | Gradient background, brand border, bold name |
| Schedule set block (favorited) | Radial gradient background |
| My Schedule toast | Blur background, rounded, accent text, icon left of label; square X button flush right sized to toast height; 52 px desktop / 44 px mobile; bottom-right on desktop, full-width bottom on mobile |
| My Schedule card | Non-interactive, no heart, no hover |

---

## Data Architecture

### Sources

- `LINEUP[day]` -- array of artist names per day
- `SCHEDULE[day][stage]` -- array of `{ artist, start, duration[, stage] }` per stage per day; Smaller Stages entries include a `stage` sub-stage name
- `STAGE_ORDER` -- canonical ordering of 10 stages
- `STAGE_COLORS` -- `{ bg, border, text }` per stage

### Filter Pipeline

```
Raw data
  -> Search filter (query substring match)
  -> Stage filter (activeStages Set)
  -> Favorite filter (favOnly boolean)
  -> Day filter (activeFilterDays Set, Browse view only)
  -> Render grid
```

### State (App.jsx)

| State | Type | Default | Persistence |
|-------|------|---------|-------------|
| `activeDay` | `'SCHEDULE' \| 'LIST' \| 'MY_SCHEDULE'` | `'SCHEDULE'` | -- |
| `query` | `string` | `''` | -- |
| `activeStages` | `Set<string>` | empty | -- |
| `favOnly` | `boolean` | `false` | -- |
| `activeFilterDays` | `Set<string>` | empty | -- |
| `listMode` | `'list' \| 'compact' \| 'byStage'` | `'list'` | -- |
| `colSize` | `'sm' \| 'md' \| 'lg'` | `'md'` | -- |
| `listLayout` | `'grid' \| 'list'` | `'list'` | -- |
| `favorites` | `Set<string>` | empty | `localStorage` |

---

## Custom Hooks

| Hook | Purpose |
|------|---------|
| `useFavorites` | Manages favorites Set with localStorage sync |
| `useStickyHeight` | Measures controls bar height, writes `--sticky-top` CSS var |
| `useDropdown` (internal) | Manages open/closing state, outside-click, Escape, 300 ms close animation |
