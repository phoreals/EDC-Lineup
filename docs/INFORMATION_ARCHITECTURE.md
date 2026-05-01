# EDC Lineup - Information Architecture

> Content model, navigation structure, data relationships, and user flows.
> Last updated: 2026-04-27

---

## Content Model

### Entities

```
Festival
 └─ 3 Days (Friday 5/15, Saturday 5/16, Sunday 5/17)
     └─ 10 Stages per day (9 main + "Smaller Stages" combined)
         └─ ~11 Sets per stage (artist + start time + duration)

Artist (global namespace, ~200+ unique names)
 └─ Performs on 1 stage per day, with possible multiple appearances across days
 └─ Smaller Stages artists also carry a sub-stage name (e.g., "Forest House")
 └─ Can be marked as favorite (persisted to localStorage)
```

### Data Sources

| File | Contains | Structure |
|------|----------|-----------|
| `src/data/lineup.js` | `LINEUP[day]` | Array of artist names per day |
| `src/data/schedule.js` | `SCHEDULE[day][stage]` | Array of `{ artist, start, duration[, stage] }` |
| `src/data/stageColors.js` | `STAGE_COLORS[stage]` | `{ bg, border, text }` CSS var references |
| `src/data/lineup.js` | `STAGE_ORDER` | Canonical display order of 10 stages |
| `src/data/lineup.js` | `DAYS`, `DAY_DATES` | Day constants and date display strings |

Smaller Stages entries include an optional `stage` field for the real venue name (e.g., `"Forest House"`, `"Art Cars"`). The helper `getSubStage(day, artist)` in `schedule.js` returns this sub-stage name.

### Relationships

- **Artist → Stage**: 1:1 per day for main stages; Smaller Stages artists carry an additional sub-stage name
- **Artist → Day**: 1:many (an artist can appear on multiple days, including b2b appearances)
- **Stage → Day**: present on all 3 days
- **Favorite → Artist**: many:many (user selects from any artist)

---

## Navigation Structure

### Primary Navigation

```
┌─────────────┬──────────────┐
│  Schedule   │   Browse     │
└─────────────┴──────────────┘
```

Two top-level tabs. Animated indicator bar slides between them.

### Sub-Navigation (contextual)

**Schedule view:**
```
[ Friday ] [ Saturday ] [ Sunday ]     ...     [ S ][ M ][ L ]
   day pills (single-select)              column size toggle
```

**Browse view:**
```
[ A to Z ] [ By Day ] [ By Stage ]     ...     [ Grid ][ List ]
   mode pills                              layout toggle
```

### Full Navigation Tree

```
Root
├─ SCHEDULE
│  ├─ Day: Friday | Saturday | Sunday
│  ├─ Column size: Small | Medium | Large
│  └─ Content: ScheduleGrid (time-based stage columns)
│
└─ BROWSE
   ├─ Mode
   │  ├─ A to Z → AlphaGrid (letter sections)
   │  ├─ By Day → CompactGrid (day → stage sections)
   │  └─ By Stage → ByStageGrid (stage → day sections)
   ├─ Layout: Grid | List
   └─ Day filter: Friday, Saturday, Sunday (multi-select)
```

---

## View Structure

### Schedule View (ScheduleGrid)

Time-based grid. Each column is a stage; vertical position = time.

```
┌──────┬──────────┬──────────┬──────────┬─────
│ Time │ Kinetic  │ Circuit  │ Cosmic   │ ...
├──────┼──────────┼──────────┼──────────┼─────
│ 5:00 │          │ Artist A │          │
│ 5:30 │ Artist B │    |     │          │
│ 6:00 │    |     │          │ Artist C │
│ 6:30 │          │ Artist D │    |     │
└──────┴──────────┴──────────┴──────────┴─────
```

- Time gutter: sticky left column, hour labels
- Stage header: sticky top row, stage names with color
- Set blocks: positioned absolutely, height = duration
- Block content: artist name, time range, heart icon
- Time span: 5:00 PM to 6:00 AM (13 hours)

### A to Z View (AlphaGrid)

Flat alphabetical listing, deduplicated across days.

```
── # ──────────────────
  4B, Kinetic Field, Fri 7:30p

── A ──────────────────
  Afrojack, Circuit Grounds, Sat 11p
  Alesso, Kinetic Field, Fri 9p

── B ──────────────────
  ...
```

Card shows: name, stage, day + time, favorite toggle.

### By Day View (CompactGrid)

Artists grouped by day, then by stage within each day.

```
── Friday ──────────────────────────────
  Kinetic Field    Circuit Grounds    Cosmic Meadow
  ┌──────────┐    ┌──────────┐       ┌──────────┐
  │ Artist A │    │ Artist C │       │ Artist E │
  │ Artist B │    │ Artist D │       │ Artist F │
  └──────────┘    └──────────┘       └──────────┘

── Saturday ────────────────────────────
  ...
```

Card shows: name, time, favorite toggle (stage is in column header). In list layout, name and time appear inline on a single row.

### By Stage View (ByStageGrid)

Artists grouped by stage, then by day within each stage.

```
── Kinetic Field ───────────────────────
  Friday           Saturday          Sunday
  ┌──────────┐    ┌──────────┐      ┌──────────┐
  │ Artist A │    │ Artist G │      │ Artist M │
  │ Artist B │    │ Artist H │      │ Artist N │
  └──────────┘    └──────────┘      └──────────┘

── Circuit Grounds ─────────────────────
  ...
```

Card shows: name, time, favorite toggle (stage + day in headers). In list layout, name and time appear inline on a single row.

---

## Filter & Search System

### Filter Dimensions

| Dimension | Type | Scope | UI Element |
|-----------|------|-------|------------|
| Search query | Text substring | All views | Search input |
| Favorites | Boolean toggle | All views | Filter dropdown |
| Stages | Multi-select (10) | All views | Filter dropdown |
| Days | Single-select (Schedule) / Multi-select (Browse) | Contextual | Day pills + filter dropdown |

### Filter Logic

All filters combine with AND logic. An artist must match every active filter to appear.

```
visible = artists
  .filter(name matches query)
  .filter(stage in activeStages, or activeStages is empty)
  .filter(isFavorite, if favOnly is true)
  .filter(day in activeFilterDays, or activeFilterDays is empty)
```

### Filter UI

**Dropdown menu** (funnel icon):
1. Favorites toggle (heart + "Favorited")
2. Divider (Browse view only)
3. Day checkboxes: Friday, Saturday, Sunday (Browse view only)
4. Divider
5. Stage checkboxes: all 9 stages
6. Clear All button

**Badge**: shows total active filter count on funnel icon.

**Active filter pills**: removable pills below controls bar when filters are active. Each pill shows filter name + X button. Horizontal scroll on mobile with fade gradient. Mobile labels are shortened: "Favorited" shows heart icon only, days show 3-letter abbreviations (Fri/Sat/Sun), stages show first word (exception: "Stereobloom" -> "Stereo").

### Filter Persistence

| When switching... | Filters... |
|-------------------|-----------|
| Schedule → Browse | Preserved |
| Browse → Schedule | Preserved (day filter becomes single-select) |
| Between browse modes | Preserved |
| Tab cycle (reselect) | Preserved |

---

## State Architecture

### State Ownership

All state lives in `App.jsx` and flows down via props.

```
App.jsx
├── activeDay          'SCHEDULE' | 'LIST'
├── query              string
├── activeStages       Set<string>
├── favOnly            boolean
├── activeFilterDays   Set<string>
├── listMode           'list' | 'compact' | 'byStage'
├── colSize            'sm' | 'md' | 'lg'
├── listLayout         'grid' | 'list'
└── favorites          Set<string>  (localStorage)
```

### State → View Mapping

| State | Affects |
|-------|---------|
| `activeDay` | Which grid component renders, sub-nav content |
| `query` | Artist filtering in all grids |
| `activeStages` | Stage visibility in all grids |
| `favOnly` | Favorite-only filter in all grids |
| `activeFilterDays` | Day selection (schedule) / day filter (browse) |
| `listMode` | Which browse grid renders |
| `colSize` | Schedule column widths |
| `listLayout` | Grid vs single-column in browse views |
| `favorites` | Heart icon fill, card highlight, filter eligibility |

---

## User Flows

### 1. Explore the Lineup

```
Land on app (Schedule, Friday)
  → Scroll horizontally to see all stages
  → Click day pills to switch days
  → OR switch to Browse tab
    → Choose mode: A to Z / By Day / By Stage
    → Toggle Grid / List layout
```

### 2. Build a Personal Schedule

```
Schedule view → scan stages
  → Click artist cards to favorite
  → Switch days, repeat
  → Toggle "Favorited" filter to see selections only
  → Check for time conflicts in schedule grid
```

### 3. Find a Specific Artist

```
Click search (or type in desktop input)
  → Type artist name (partial match, case-insensitive)
  → Results filter in real time
  → Click card to favorite
  → Clear search to return to full view
```

### 4. Filter by Stage

```
Click filter button (funnel icon)
  → Check desired stages
  → Badge updates with filter count
  → Views show only selected stages
  → Remove via pill X buttons or Clear All
```

### 5. Compare Days

```
Browse → By Day mode
  → All 3 days visible with stage sub-columns
  → Filter to favorites only
  → See which day has most favorites
  → Switch to Schedule for time-slot detail
```
