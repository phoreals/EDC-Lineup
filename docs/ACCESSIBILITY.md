# EDC Lineup - Accessibility

> ARIA patterns, keyboard support, focus management, color contrast, motion, and touch targets.
> Last updated: 2026-04-25

---

## ARIA Attributes

### aria-label

Every icon-only button has a descriptive label:

| Element | Label |
|---------|-------|
| Search inputs | "Search artists" |
| Clear search buttons | "Clear search" |
| Filter button | "Filters" |
| Column size dropdown trigger | "Column size" |
| Grid layout button | "Grid layout" |
| List layout button | "List layout" |
| Column size buttons | "Narrow" / "Medium" / "Wide" |
| Mode pills | "A to Z" / "By Day" / "By Stage" |

Artist cards compose a label from name + stage + time + favorite status.

### aria-expanded

Dropdown triggers announce open/closed state:
- Filter button: `aria-expanded={filterDropdown.open}`
- Column size dropdown: `aria-expanded={sizeDropdown.open}`

### aria-pressed

Favorite toggles announce their state:
- Artist cards: `aria-pressed={isFav}`
- Schedule set blocks: `aria-pressed={isFav}`

### aria-hidden

Decorative elements are hidden from assistive technology:
- All SVG icons in `Icons.jsx`
- Heart icons in cards (`<span aria-hidden="true">`)
- Tab indicator bar
- Gradient `<defs>` SVG
- Filter summary mask SVG

### role

Non-`<button>` interactive elements declare their role:
- Artist cards: `<div role="button">`
- Schedule set blocks: `<div role="button">`

---

## Keyboard Support

### Global Keys

| Key | Context | Action |
|-----|---------|--------|
| Tab | Anywhere | Navigate focusable elements |
| Escape | Dropdown open | Close dropdown |
| Escape | Mobile search open | Close search |

### Button Activation

All `<button>` elements respond to Enter and Space natively. Custom `role="button"` elements (artist cards, set blocks) handle both explicitly:

```jsx
onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToggle(name)}
```

### Search Input

| Key | Desktop | Mobile |
|-----|---------|--------|
| Enter | Blurs input | Submits and closes search overlay |

### Dynamic tabIndex

When mobile search is open, normal controls become unfocusable and search controls become focusable:

| Element | Search closed | Search open |
|---------|--------------|-------------|
| Tab buttons | `tabIndex={0}` | `tabIndex={-1}` |
| Mobile search input | `tabIndex={-1}` | `tabIndex={0}` |
| Clear button (mobile) | `tabIndex={-1}` | `tabIndex={0}` |
| Back button | `tabIndex={-1}` | `tabIndex={0}` |

---

## Focus Management

### Focus Ring

Consistent across all interactive elements:

```scss
&:focus-visible {
  outline: 2px solid var(--color-brand);   // purple-500
  outline-offset: 1px;
}
```

Tab buttons use `outline-offset: -2px` to keep the ring inside the button boundary.

### Pointer Focus Suppression

```scss
:focus:not(:focus-visible) { outline: none; }
```

Focus ring only appears for keyboard navigation, not mouse clicks.

### Auto-Focus

Mobile search input receives focus after a 50ms delay when the search overlay opens:

```js
setTimeout(() => mobileInputRef.current?.focus(), 50);
```

### Dropdown Close

Dropdowns close on:
- Click outside (mousedown listener on document)
- Escape key (keydown listener on document)
- Item selection (explicit close call)

### Mobile Search Close

Mobile search overlay closes on:
- Back button tap
- Enter key with text entered
- Tap outside the search area (mousedown + touchstart listeners)

---

## Semantic HTML

### Heading Hierarchy

- `<h1>`: "EDC Las Vegas 2026" (Header component)
- No `<h2>`-`<h6>` — grid sections use styled `<span>` elements within `<section>` tags

### Landmarks

| Element | Component |
|---------|-----------|
| `<main>` | App.jsx wraps all grid content |
| `<section>` | AlphaGrid (letter groups), CompactGrid (day groups), ByStageGrid (stage groups) |

### Native Buttons

All controls bar elements use native `<button>` elements: tabs, pills, toggles, search, filter, dropdown items, clear buttons.

### Search Highlight

Search matches use semantic `<mark>` elements with custom styling (purple glow background, underline).

---

## Color Contrast

### Text on Dark Background (`neutral-950`)

| Text | Color | Approx Ratio | WCAG |
|------|-------|---------------|------|
| Primary | `neutral-100` (96% white) | ~18:1 | AAA |
| Muted | `neutral-400` (64% gray) | ~5.5:1 | AA |
| Accent | `purple-400` (85% lightness) | ~9:1 | AAA |
| Brand | `purple-500` (65% lightness) | ~5:1 | AA |

### Interactive States

| State | Text | Background | Notes |
|-------|------|------------|-------|
| Active pill/button | `--text-inverse` (dark) | `--gradient-brand` | High contrast inverse |
| Active filter pill | gradient text | transparent | Gradient provides visible distinction |
| Hover | `--color-brand` | unchanged | Purple on dark surface |

### Search Highlight

`<mark>` uses `background: purple-500@20%` with `color: inherit` and `text-decoration: underline` for dual visual cue (color + underline).

---

## Reduced Motion

```scss
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Disables:
- Dropdown enter/exit animations
- Tab indicator slide
- Button hover/press transitions
- Card hover transitions
- Search overlay transitions
- Smooth scroll-to-top on tab change

---

## Touch Targets

### Tap Target Mixin

Mobile buttons use an invisible `::after` pseudo-element to expand the touch area to 36px minimum while keeping visual size at 28px:

```scss
@mixin tap-target {
  @media (max-width: $bp-mobile) {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      top: 50%; left: 50%;
      min-width: var(--tap-target-mobile);  // 36px
      width: 100%;
      height: var(--tap-target-mobile);
      transform: translate(-50%, -50%);
    }
  }
}
```

### Applied To

- Search toggle
- Back button
- Filter button
- Column size cycle button
- Layout toggle buttons
- Day pills
- Mode pills
- Active filter pills
- Clear filters button

### Size Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--control-height-sm-mobile` | 28px | Visual button size |
| `--tap-target-mobile` | 36px | Minimum touch area |
| `--control-height-mobile` | 36px | Row 1 controls |

---

## Screen Reader Considerations

### Composite Labels

Artist cards build descriptive labels:
```
"Alesso — Kinetic Field — Fri 9:00p – 10:30p — favorited"
```

Schedule set blocks include:
```
"Artist Name — 7:30p – 9:00p — favorited"
```

### State Communication

- Favorite state via `aria-pressed`
- Dropdown state via `aria-expanded`
- Active tab via visible gradient indicator (no explicit `aria-selected` — tabs use button pattern, not tablist)

### Decorative Content Hidden

All SVG icons, gradient definitions, mask SVGs, heart spans, and tab indicators are marked `aria-hidden="true"`.

---

## Known Limitations

1. **No live regions**: filter count badge updates and active filter summary changes are not announced via `aria-live`. Screen reader users must navigate to the badge to discover the count.
2. **No tablist pattern**: Schedule/Browse tabs use individual buttons rather than `role="tablist"` + `role="tab"` + arrow key navigation.
3. **Section headers**: grid section headers (letter groups, day headers, stage headers) use styled `<span>` elements rather than heading elements (`<h2>`-`<h6>`).
4. **Toast notification**: FavToast (currently hidden) lacks `role="alert"` or `aria-live="polite"` for automatic announcement.
