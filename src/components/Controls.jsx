import { useState, useRef, useEffect, useCallback } from 'react';
import { STAGES } from '../data/lineup';
import { useStickyHeight } from '../hooks/useStickyHeight';
import { IconSearch, IconBack } from './Icons';
import styles from './Controls.module.css';

const TABS = [
  { id: 'ALL_DAYS',  label: 'All Days' },
  { id: 'FRIDAY',    label: 'Friday' },
  { id: 'SATURDAY',  label: 'Saturday' },
  { id: 'SUNDAY',    label: 'Sunday' },
  { id: 'BY_STAGE',  label: 'By Stage' },
];

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
  const controlsRef = useStickyHeight();
  const mobileInputRef = useRef(null);
  const desktopInputRef = useRef(null);

  const hasFilters = activeStages.size > 0 || favOnly;

  const openMobileSearch = () => {
    setMobileSearchOpen(true);
    setTimeout(() => mobileInputRef.current?.focus(), 50);
  };

  const closeMobileSearch = () => {
    setMobileSearchOpen(false);
    onQueryChange('');
  };

  const handleTabClick = day => {
    onDayChange(day);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`${styles.controls} ${mobileSearchOpen ? styles.searchActive : ''}`}
      ref={controlsRef}
    >
      {/* ── Top row: tabs + search ── */}
      <div className={styles.topRow}>
        {mobileSearchOpen && (
          <button
            className={styles.backBtn}
            onClick={closeMobileSearch}
            aria-label="Close search"
          >
            <IconBack />
          </button>
        )}

        {/* Day tabs (hidden during mobile search) */}
        {!mobileSearchOpen && (
          <div className={styles.tabsWrapper}>
            <div className={styles.tabs}>
              {TABS.map(t => (
                <button
                  key={t.id}
                  className={`${styles.tab} ${activeDay === t.id ? styles.tabActive : ''}`}
                  onClick={() => handleTabClick(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className={`${styles.fade} ${styles.fadeLeft}`} />
            <div className={`${styles.fade} ${styles.fadeRight}`} />
          </div>
        )}

        {/* Desktop search (always visible on desktop) */}
        <div className={`${styles.searchBox} ${styles.desktopSearch}`}>
          <span className={styles.searchIcon}><IconSearch /></span>
          <input
            ref={desktopInputRef}
            className={styles.searchInput}
            placeholder="Search artists…"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            aria-label="Search artists"
          />
          {query && (
            <button
              className={styles.clearInput}
              onClick={() => onQueryChange('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Mobile: search toggle button */}
        {!mobileSearchOpen && (
          <button
            className={styles.searchToggle}
            onClick={openMobileSearch}
            aria-label="Open search"
          >
            <IconSearch />
          </button>
        )}

        {/* Mobile: inline search box */}
        {mobileSearchOpen && (
          <div className={`${styles.searchBox} ${styles.mobileSearch}`}>
            <span className={styles.searchIcon}><IconSearch /></span>
            <input
              ref={mobileInputRef}
              className={styles.searchInput}
              placeholder="Search artists…"
              value={query}
              onChange={e => onQueryChange(e.target.value)}
              aria-label="Search artists"
            />
            {query && (
              <button
                className={styles.clearInput}
                onClick={() => onQueryChange('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Filter pills row ── */}
      <div className={styles.filtersRow}>
        <div className={styles.filtersTrack}>
          {/* Favorites */}
          <button
            className={`${styles.pill} ${styles.favPill} ${favOnly ? styles.pillActive : ''}`}
            onClick={onFavToggle}
          >
            ★ Favorited
          </button>

          <div className={styles.dividerV} />

          {/* Stage pills */}
          {STAGES.map(s => (
            <button
              key={s}
              className={`${styles.pill} ${activeStages.has(s) ? styles.pillActive : ''}`}
              onClick={() => onStageToggle(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          className={`${styles.clearBtn} ${hasFilters ? styles.clearVisible : ''}`}
          onClick={onClearFilters}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
