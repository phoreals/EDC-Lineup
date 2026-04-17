import { useState, useRef, useCallback, useEffect } from 'react';
import { STAGES } from '../data/lineup';
import { useStickyHeight } from '../hooks/useStickyHeight';
import { IconSearch, IconBack, IconFilter, IconCompact, IconList, IconColumns, IconChevronDown } from './Icons';
import styles from './Controls.module.scss';

const TABS = [
  { id: 'SCHEDULE',  label: 'Schedule' },
  { id: 'LIST',      label: 'List View' },
];

const LIST_MODES = [
  { id: 'list',     label: 'A to Z',   Icon: IconList },
  { id: 'compact',  label: 'By Day',   Icon: IconCompact },
  { id: 'byStage',  label: 'By Stage', Icon: IconColumns },
];

const DAY_FILTERS = [
  { id: 'FRIDAY',    label: 'Friday' },
  { id: 'SATURDAY',  label: 'Saturday' },
  { id: 'SUNDAY',    label: 'Sunday' },
];

// Close dropdown on click outside or Escape
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = e => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return { open, setOpen, ref };
}

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
  listMode,
  onListModeChange,
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const controlsRef  = useStickyHeight();
  const mobileInputRef = useRef(null);

  const tabsScrollRef  = useRef(null);
  const tabsWrapperRef = useRef(null);
  useScrollFades(tabsScrollRef, tabsWrapperRef);

  const filterDropdown = useDropdown();
  const modeDropdown = useDropdown();

  const hasFilters = activeStages.size > 0 || favOnly;
  const filterCount = activeStages.size + (favOnly ? 1 : 0);

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

  const currentMode = LIST_MODES.find(m => m.id === listMode) || LIST_MODES[0];

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
          <div className={styles.actionGroup}>
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
            <button className={styles.searchToggle} onClick={openMobileSearch} aria-label="Open search">
              <IconSearch />
            </button>
            <div className={styles.filterDropdownWrap} ref={filterDropdown.ref}>
          <button
            className={`${styles.filterBtn} ${filterDropdown.open ? styles.active : ''}`}
            onClick={() => filterDropdown.setOpen(v => !v)}
            aria-label="Filters"
            aria-expanded={filterDropdown.open}
          >
            <IconFilter />
            {filterCount > 0 && (
              <span className={styles.badge}>{filterCount}</span>
            )}
          </button>

          {filterDropdown.open && (
            <div className={styles.dropdown}>
              <button
                className={`${styles.dropdownItem} ${favOnly ? styles.active : ''}`}
                onClick={onFavToggle}
              >
                <span>★ Favorited</span>
                {favOnly && <span className={styles.checkmark}>✓</span>}
              </button>

              <div className={styles.divider} />

              {STAGES.map(stage => (
                <button
                  key={stage}
                  className={`${styles.dropdownItem} ${activeStages.has(stage) ? styles.active : ''}`}
                  onClick={() => onStageToggle(stage)}
                >
                  <span>{stage}</span>
                  {activeStages.has(stage) && <span className={styles.checkmark}>✓</span>}
                </button>
              ))}

              {hasFilters && (
                <>
                  <div className={styles.divider} />
                  <button className={styles.dropdownItem} onClick={onClearFilters}>
                    <span className={styles.clearText}>Clear All</span>
                  </button>
                </>
              )}
            </div>
          )}
            </div>
          </div>
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
          <>
            {/* Desktop: segmented toggle */}
            <div className={styles.modeToggle}>
              {LIST_MODES.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  className={`${styles.modeBtn} ${listMode === id ? styles.active : ''}`}
                  onClick={() => onListModeChange(id)}
                  aria-label={label}
                  title={label}
                >
                  <Icon size={14} />
                  <span className={styles.modeLabel}>{label}</span>
                </button>
              ))}
            </div>

            {/* Mobile: dropdown */}
            <div className={styles.modeDropdownWrap} ref={modeDropdown.ref}>
              <button
                className={styles.modeDropdownBtn}
                onClick={() => modeDropdown.setOpen(v => !v)}
                aria-expanded={modeDropdown.open}
              >
                <currentMode.Icon size={14} />
                <span className={styles.modeDropdownLabel}>{currentMode.label}</span>
                <IconChevronDown />
              </button>

              {modeDropdown.open && (
                <div className={styles.dropdown}>
                  {LIST_MODES.map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      className={`${styles.dropdownItem} ${listMode === id ? styles.active : ''}`}
                      onClick={() => { onListModeChange(id); modeDropdown.setOpen(false); }}
                    >
                      <span className={styles.dropdownItemLeft}>
                        <Icon size={14} />
                        <span>{label}</span>
                      </span>
                      {listMode === id && <span className={styles.checkmark}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
