import { useState, useRef, useCallback, useEffect } from 'react';
import { STAGE_ORDER } from '../data/lineup';
import { useStickyHeight } from '../hooks/useStickyHeight';
import { IconSearch, IconBack, IconFilter, IconCompact, IconList, IconClose, IconHeart, IconCheck } from './Icons';
import styles from './Controls.module.scss';

const TABS = [
  { id: 'SCHEDULE',  label: 'Schedule' },
  { id: 'LIST',      label: 'Browse' },
];

const LIST_MODES = [
  { id: 'list',     label: 'A to Z' },
  { id: 'compact',  label: 'By Day' },
  { id: 'byStage',  label: 'By Stage' },
];

const COL_SIZES = [
  { id: 'sm', text: 'S', label: 'Narrow' },
  { id: 'md', text: 'M', label: 'Medium' },
  { id: 'lg', text: 'L', label: 'Wide' },
];

const DAY_FILTERS = [
  { id: 'FRIDAY',    label: 'Friday' },
  { id: 'SATURDAY',  label: 'Saturday' },
  { id: 'SUNDAY',    label: 'Sunday' },
];

// Close dropdown on click outside or Escape
const DROPDOWN_CLOSE_MS = 300; // must match --duration-slow

function useDropdown() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef(null);
  const ref = useRef(null);

  const close = useCallback(() => {
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, DROPDOWN_CLOSE_MS);
  }, []);

  const toggle = useCallback(v => {
    if (typeof v === 'boolean' ? !v : open) {
      close();
    } else {
      clearTimeout(closeTimer.current);
      setClosing(false);
      setOpen(true);
    }
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const onDown = e => {
      if (ref.current && !ref.current.contains(e.target)) close();
    };
    const onKey = e => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return { open, closing, toggle, ref };
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
  colSize,
  onColSizeChange,
  listLayout,
  onListLayoutChange,
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const controlsRef  = useStickyHeight();
  const mobileInputRef = useRef(null);

  const tabsScrollRef  = useRef(null);
  const tabIndicatorRef = useRef(null);
  const tabRefs = useRef({});

  // Slide the indicator to the active tab
  const updateIndicator = useCallback(() => {
    const indicator = tabIndicatorRef.current;
    const activeTabEl = tabRefs.current[activeDay];
    const container = tabsScrollRef.current;
    if (!indicator || !activeTabEl || !container) return;

    const containerRect = container.getBoundingClientRect();
    const tabRect = activeTabEl.getBoundingClientRect();
    indicator.style.width = `${tabRect.width}px`;
    indicator.style.transform = `translateX(${tabRect.left - containerRect.left + container.scrollLeft}px)`;
  }, [activeDay]);

  useEffect(() => {
    updateIndicator();
    const raf = requestAnimationFrame(updateIndicator);
    window.addEventListener('resize', updateIndicator);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [updateIndicator]);

  const filterDropdown = useDropdown();
  const sizeDropdown = useDropdown();

  const dayFilterCount = activeDay === 'LIST' ? activeFilterDays.size : 0;
  const hasQuery = query.trim().length > 0;
  const hasFilters = activeStages.size > 0 || favOnly || dayFilterCount > 0 || hasQuery;
  const filterCount = activeStages.size + (favOnly ? 1 : 0) + dayFilterCount + (hasQuery ? 1 : 0);

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
      <div className={`${styles.topRow} ${mobileSearchOpen ? styles.topRowSearch : ''}`}>

        {/* Normal mode: tabs + action group — always in DOM */}
        <div className={styles.topRowNormal} aria-hidden={mobileSearchOpen || undefined}>
          <div className={styles.tabsWrapper}>
            <div className={styles.tabs} ref={tabsScrollRef}>
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  ref={el => { tabRefs.current[id] = el; }}
                  className={`${styles.tab} ${activeDay === id ? styles.active : ''}`}
                  onClick={() => handleTabClick(id)}
                  tabIndex={mobileSearchOpen ? -1 : 0}
                  title={label}
                >
                  {label}
                </button>
              ))}
              <div className={styles.tabIndicator} ref={tabIndicatorRef} />
            </div>
          </div>

          <div className={styles.actionGroup}>
            {/* Desktop search — hidden on mobile via CSS */}
            <div className={`${styles.searchBox} ${styles.desktop}`}>
              <span className={styles.searchIcon}><IconSearch /></span>
              <input
                className={styles.searchInput}
                placeholder="Search artists..."
                value={query}
                onChange={e => onQueryChange(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); }}
                aria-label="Search artists"
              />
              {query && (
                <button className={styles.clearInput} onClick={() => onQueryChange('')} aria-label="Clear search">
                  <IconClose size={16} />
                </button>
              )}
            </div>
            <button className={styles.searchToggle} onClick={openMobileSearch} aria-label="Open search" title="Open search" tabIndex={mobileSearchOpen ? -1 : 0}>
              <IconSearch />
            </button>
          </div>
        </div>

        {/* Search mode: back button + search input — always in DOM, mobile only */}
        <div className={styles.topRowSearchGroup} aria-hidden={!mobileSearchOpen || undefined}>
          <button className={styles.backBtn} onClick={closeMobileSearch} aria-label="Close search" title="Close search" tabIndex={mobileSearchOpen ? 0 : -1}>
            <IconBack />
          </button>
          <div className={`${styles.searchBox} ${styles.mobile}`}>
            <span className={styles.searchIcon}><IconSearch /></span>
            <input
              ref={mobileInputRef}
              className={styles.searchInput}
              placeholder="Search artists..."
              value={query}
              onChange={e => onQueryChange(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && query.trim()) { setMobileSearchOpen(false); e.target.blur(); } }}
              aria-label="Search artists"
              tabIndex={mobileSearchOpen ? 0 : -1}
            />
            {query && (
              <button className={styles.clearInput} onClick={() => onQueryChange('')} aria-label="Clear search" title="Clear search" tabIndex={mobileSearchOpen ? 0 : -1}>
                <IconClose size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Sub-nav row ── */}
      <div className={styles.dayFilterRow}>
        {activeDay === 'SCHEDULE' && (
          <div className={styles.dayPills}>
            {DAY_FILTERS.map(({ id, label }) => {
              const isActive = activeFilterDays.size === 0 ? id === 'FRIDAY' : activeFilterDays.has(id);
              return (
                <button
                  key={id}
                  className={`${styles.dayPill} ${isActive ? styles.active : ''}`}
                  onClick={() => onFilterDayToggle(id, true)}
                  title={label}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
        {activeDay === 'LIST' && (
          <div className={styles.modePills}>
            {LIST_MODES.map(({ id, label }) => (
              <button
                key={id}
                className={`${styles.modePill} ${listMode === id ? styles.active : ''}`}
                onClick={() => onListModeChange(id)}
                aria-label={label}
                title={label}
              >
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}

        <div className={styles.subNavRight}>
          {activeDay === 'LIST' && (
            <div className={styles.listLayoutToggle}>
              <button
                className={`${styles.listLayoutBtn} ${listLayout === 'grid' ? styles.active : ''}`}
                onClick={() => onListLayoutChange('grid')}
                aria-label="Grid layout"
                title="Grid layout"
              >
                <IconCompact size={14} />
              </button>
              <button
                className={`${styles.listLayoutBtn} ${listLayout === 'list' ? styles.active : ''}`}
                onClick={() => onListLayoutChange('list')}
                aria-label="List layout"
                title="List layout"
              >
                <IconList size={14} />
              </button>
            </div>
          )}
          {activeDay === 'SCHEDULE' && (
            <div className={styles.colSizeToggle}>
              {COL_SIZES.map(({ id, label, text }) => (
                <button
                  key={id}
                  className={`${styles.colSizeBtn} ${colSize === id ? styles.active : ''}`}
                  onClick={() => onColSizeChange(id)}
                  aria-label={label}
                  title={label}
                >
                  {text}
                </button>
              ))}
              <div className={styles.colSizeDropWrap} ref={sizeDropdown.ref}>
                <button
                  className={`${styles.colSizeCycle} ${sizeDropdown.open ? styles.active : ''}`}
                  onClick={() => sizeDropdown.toggle()}
                  aria-label="Column size"
                  aria-expanded={sizeDropdown.open}
                  title="Column size"
                >
                  {COL_SIZES.find(s => s.id === colSize)?.text}
                </button>
                {(sizeDropdown.open || sizeDropdown.closing) && (
                  <div className={`${styles.dropdown} ${sizeDropdown.closing ? styles.dropdownClosing : ''}`}>
                    {COL_SIZES.map(({ id, text, label }) => (
                      <button
                        key={id}
                        className={`${styles.dropdownItem} ${colSize === id ? styles.active : ''}`}
                        onClick={() => { onColSizeChange(id); sizeDropdown.toggle(false); }}
                        title={label}
                      >
                        <span className={styles.sizeLabel}><strong>{text}</strong>{label}</span>
                        <span className={styles.checkmark}>{colSize === id && <IconCheck size={12} />}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={styles.filterDropdownWrap} ref={filterDropdown.ref}>
          <button
            className={`${styles.filterBtn} ${filterDropdown.open ? styles.active : ''}`}
            onClick={() => filterDropdown.toggle()}
            aria-label="Filters"
            aria-expanded={filterDropdown.open}
            title="Filters"
          >
            <IconFilter />
            {filterCount > 0 && (
              <span className={styles.badge}>{filterCount}</span>
            )}
          </button>

          {(filterDropdown.open || filterDropdown.closing) && (
            <div className={`${styles.dropdown} ${filterDropdown.closing ? styles.dropdownClosing : ''}`}>
              <button
                className={`${styles.dropdownItem} ${favOnly ? styles.active : ''}`}
                onClick={onFavToggle}
                title="Favorited"
              >
                <span className={styles.iconLabel}><IconHeart size={11} filled />Favorited</span>
                <span className={styles.checkmark}>{favOnly && <IconCheck size={12} />}</span>
              </button>

              {activeDay === 'LIST' && (
                <>
                  <div className={styles.divider} />
                  {DAY_FILTERS.map(({ id, label }) => {
                    const isActive = activeFilterDays.has(id);
                    return (
                      <button
                        key={id}
                        className={`${styles.dropdownItem} ${isActive ? styles.active : ''}`}
                        onClick={() => onFilterDayToggle(id, false)}
                        title={label}
                      >
                        <span>{label}</span>
                        <span className={styles.checkmark}>{isActive && <IconCheck size={12} />}</span>
                      </button>
                    );
                  })}
                </>
              )}

              <div className={styles.divider} />

              {STAGE_ORDER.map(stage => (
                <button
                  key={stage}
                  className={`${styles.dropdownItem} ${activeStages.has(stage) ? styles.active : ''}`}
                  onClick={() => onStageToggle(stage)}
                  title={stage}
                >
                  <span>{stage}</span>
                  <span className={styles.checkmark}>{activeStages.has(stage) && <IconCheck size={12} />}</span>
                </button>
              ))}

              {hasFilters && (
                <>
                  <div className={styles.divider} />
                  <button className={styles.dropdownItem} onClick={onClearFilters} title="Clear all filters">
                    <span className={styles.clearText}>Clear All</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        </div>
      </div>

      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="pill-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-purple-500)" />
            <stop offset="100%" stopColor="var(--color-orange-400)" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── Active filters summary ── */}
      {hasFilters && (() => {
        const activeDaysList = activeDay === 'LIST'
          ? DAY_FILTERS.filter(d => activeFilterDays.has(d.id))
          : [];
        const activeStagesList = STAGE_ORDER.filter(s => activeStages.has(s));
        return (
          <div className={styles.activeFilters}>
            <span className={styles.activeFiltersLabel}>Filtering by</span>
            <svg className={styles.activeFiltersBorder} aria-hidden="true">
              <rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="8" ry="8"
                fill="none" stroke="var(--border-default)" strokeWidth="1" />
            </svg>
            <div className={styles.activeFiltersBody}>
              <div className={styles.activeFiltersScroll}>
                {hasQuery && (
                  <button className={styles.activeFilterPill} onClick={() => onQueryChange('')} title={`Remove search: ${query.trim()}`}>
                    <span className={styles.pillIcon}><IconSearch size={10} /></span><span>&ldquo;{query.trim()}&rdquo;</span><span className={styles.pillIcon}><IconClose size={12} /></span>
                  </button>
                )}
                {favOnly && (
                  <button className={styles.activeFilterPill} onClick={onFavToggle} title="Remove Favorited filter">
                    <span className={styles.pillIcon}><IconHeart size={10} filled /></span><span>Favorited</span><span className={styles.pillIcon}><IconClose size={12} /></span>
                  </button>
                )}
                {activeDaysList.map(({ id, label }) => (
                  <button key={id} className={styles.activeFilterPill} onClick={() => onFilterDayToggle(id, false)} title={`Remove ${label}`}>
                    <span>{label}</span><span className={styles.pillIcon}><IconClose size={12} /></span>
                  </button>
                ))}
                {activeStagesList.map(stage => (
                  <button key={stage} className={styles.activeFilterPill} onClick={() => onStageToggle(stage)} title={`Remove ${stage}`}>
                    <span>{stage}</span><span className={styles.pillIcon}><IconClose size={12} /></span>
                  </button>
                ))}
              </div>
              <div className={styles.activeFiltersFadeRight} />
              <button className={styles.clearBtn} onClick={onClearFilters} aria-label="Clear all filters" title="Clear all filters">
                <span className={styles.clearBtnText}>Clear</span>
                <span className={styles.clearBtnIcon}><IconClose size={12} /></span>
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
