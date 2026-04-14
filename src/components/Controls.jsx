import { useState, useRef, useCallback, useEffect } from 'react';
import { STAGES } from '../data/lineup';
import { useStickyHeight } from '../hooks/useStickyHeight';
import { IconSearch, IconBack } from './Icons';
import styles from './Controls.module.scss';

const TABS = [
  { id: 'ALL_DAYS',  label: 'All Days' },
  { id: 'FRIDAY',    label: 'Friday' },
  { id: 'SATURDAY',  label: 'Saturday' },
  { id: 'SUNDAY',    label: 'Sunday' },
  { id: 'BY_STAGE',  label: 'By Stage' },
  { id: 'COMPACT',   label: 'Compact' },
  { id: 'SCHEDULE',  label: 'Schedule' },
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
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
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
          <button className={styles.searchToggle} onClick={openMobileSearch} aria-label="Open search">
            <IconSearch />
          </button>
        )}
      </div>

      {/* ── Filters row ── */}
      <div className={styles.filtersRow}>
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
