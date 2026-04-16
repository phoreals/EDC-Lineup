import { useState, useRef, useCallback, useEffect } from 'react';
import { STAGES } from '../data/lineup';
import { useStickyHeight } from '../hooks/useStickyHeight';
import { IconSearch, IconBack, IconFilter, IconCompact, IconList } from './Icons';
import styles from './Controls.module.scss';

const TABS = [
  { id: 'SCHEDULE',  label: 'Schedule' },
  { id: 'LIST',      label: 'List View' },
  { id: 'BY_STAGE',  label: 'By Stage' },
];

const DAY_FILTERS = [
  { id: 'FRIDAY',    label: 'Fri' },
  { id: 'SATURDAY',  label: 'Sat' },
  { id: 'SUNDAY',    label: 'Sun' },
];

// Attaches a scroll listener to a ref'd element and toggles
// scrolledLeft / scrolledRight classes on a target element.
function useScrollFades(scrollRef, targetRef) {
  const update = useCallback(() => {
    const el = scrollRef.current;
    const target = targetRef.current;
    if (!el || !target) return;

    const scrollable = el.scrollWidth > el.clientWidth;
    const atStart    = el.scrollLeft <= 2;
    const atEnd      = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - 2;

    target.classList.toggle('scrolledLeft',  scrollable && !atStart);
    target.classList.toggle('scrolledRight', scrollable && !atEnd);
  }, [scrollRef, targetRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [scrollRef, update]);

  return update;
}

export function Controls({
  activeDay,
  onDayChange,
  query,
  onQueryChange,
  activeStages,
  onStageToggle,
  favOnly,
  onFavToggle,
  onClearFilters,
  activeFilterDays,
  onFilterDayToggle,
  compactMode,
  onCompactToggle,
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const controlsRef  = useStickyHeight();
  const mobileInputRef = useRef(null);

  // Refs for scroll containers and their fade wrapper targets
  const tabsScrollRef    = useRef(null);
  const tabsWrapperRef   = useRef(null);
  const filtersScrollRef = useRef(null);
  const filtersTrackRef  = useRef(null);

  useScrollFades(tabsScrollRef,    tabsWrapperRef);
  useScrollFades(filtersScrollRef, filtersTrackRef);

  const hasFilters = activeStages.size > 0 || favOnly;

  const openMobileSearch = useCallback(() => {
    setMobileSearchOpen(true);
    setTimeout(() => mobileInputRef.current?.focus(), 50);
  }, []);

  const closeMobileSearch = useCallback(() => {
    setMobileSearchOpen(false);
    onQueryChange('');
  }, [onQueryChange]);

  const handleTabClick = useCallback(day => {
    onDayChange(day);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onDayChange]);

  return (
    <div className={styles.controls} ref={controlsRef}>

      {/* ── Top row ── */}
      <div className={styles.topRow}>

        {mobileSearchOpen && (
          <button className={styles.backBtn} onClick={closeMobileSearch} aria-label="Close search">
            <IconBack />
          </button>
        )}

        {!mobileSearchOpen && (
          <div className={styles.tabsWrapper} ref={tabsWrapperRef}>
            <div className={styles.tabs} ref={tabsScrollRef}>
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  className={`${styles.tab} ${activeDay === id ? styles.active : ''}`}
                  onClick={() => handleTabClick(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className={styles.tabFadeLeft} />
            <div className={styles.tabFadeRight} />
          </div>
        )}

        {/* Desktop search — hidden on mobile via CSS */}
        <div className={`${styles.searchBox} ${styles.desktop}`}>
          <span className={styles.searchIcon}><IconSearch /></span>
          <input
            className={styles.searchInput}
            placeholder="Search artists..."
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            aria-label="Search artists"
          />
          {query && (
            <button className={styles.clearInput} onClick={() => onQueryChange('')} aria-label="Clear search">
              ×
            </button>
          )}
        </div>

        {/* Mobile search box — only mounted when open */}
        {mobileSearchOpen && (
          <div className={`${styles.searchBox} ${styles.mobile} ${styles.open}`}>
            <span className={styles.searchIcon}><IconSearch /></span>
            <input
              ref={mobileInputRef}
              className={styles.searchInput}
              placeholder="Search artists..."
              value={query}
              onChange={e => onQueryChange(e.target.value)}
              aria-label="Search artists"
            />
            {query && (
              <button className={styles.clearInput} onClick={() => onQueryChange('')} aria-label="Clear search">
                ×
              </button>
            )}
          </div>
        )}

        {!mobileSearchOpen && (
          <>
            <button className={styles.searchToggle} onClick={openMobileSearch} aria-label="Open search">
              <IconSearch />
            </button>
            <button
              className={`${styles.filterToggle} ${filtersOpen ? styles.active : ''}`}
              onClick={() => setFiltersOpen(v => !v)}
              aria-label={filtersOpen ? 'Hide filters' : 'Show filters'}
              aria-expanded={filtersOpen}
            >
              <IconFilter />
              {!filtersOpen && activeStages.size + (favOnly ? 1 : 0) > 0 && (
                <span className={styles.badge}>{activeStages.size + (favOnly ? 1 : 0)}</span>
              )}
            </button>
          </>
        )}
      </div>

      {/* ── Day filter row ── */}
      <div className={styles.dayFilterRow}>
        <div className={styles.dayPills}>
          {DAY_FILTERS.map(({ id, label }) => (
            <button
              key={id}
              className={`${styles.dayPill} ${activeFilterDays.has(id) ? styles.active : ''}`}
              onClick={() => onFilterDayToggle(id)}
            >
              {label}
            </button>
          ))}
        </div>
        {activeDay === 'LIST' && (
          <button
            className={styles.compactToggle}
            onClick={onCompactToggle}
            aria-label={compactMode ? 'Switch to list view' : 'Switch to compact view'}
            title={compactMode ? 'List view' : 'Compact view'}
          >
            {compactMode ? <IconList size={14} /> : <IconCompact size={14} />}
            <span className={styles.compactLabel}>{compactMode ? 'List' : 'Compact'}</span>
          </button>
        )}
      </div>

      {/* ── Filters row ── */}
      <div className={`${styles.filtersRow} ${filtersOpen ? styles.open : ''}`}>
        <div className={styles.filtersTrack} ref={filtersTrackRef}>
          <div className={styles.filtersInner} ref={filtersScrollRef}>
            <button
              className={`${styles.pill} ${styles.fav} ${favOnly ? styles.active : ''}`}
              onClick={onFavToggle}
            >
              ★ Favorited
            </button>

            <div className={styles.divider} />

            {STAGES.map(stage => (
              <button
                key={stage}
                className={`${styles.pill} ${activeStages.has(stage) ? styles.active : ''}`}
                onClick={() => onStageToggle(stage)}
              >
                {stage}
              </button>
            ))}
          </div>

          <div className={styles.filterFadeLeft} />
          <div className={styles.filterFadeRight} />
        </div>

        <button
          className={`${styles.clearBtn} ${hasFilters ? styles.visible : ''}`}
          onClick={onClearFilters}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
