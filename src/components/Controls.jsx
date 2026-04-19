import { useState, useRef, useCallback, useEffect } from 'react';
import { STAGE_ORDER } from '../data/lineup';
import { useStickyHeight } from '../hooks/useStickyHeight';
import { IconSearch, IconBack, IconFilter, IconCompact, IconList, IconColumns, IconClose, IconHeart } from './Icons';
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
  colSize,
  onColSizeChange,
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const controlsRef  = useStickyHeight();
  const mobileInputRef = useRef(null);

  const tabsScrollRef  = useRef(null);
  const tabsWrapperRef = useRef(null);
  const tabIndicatorRef = useRef(null);
  const tabRefs = useRef({});
  useScrollFades(tabsScrollRef, tabsWrapperRef);

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
    // Re-measure after tabs remount (e.g. closing mobile search)
    const raf = requestAnimationFrame(updateIndicator);
    window.addEventListener('resize', updateIndicator);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [updateIndicator, mobileSearchOpen]);

  const filterDropdown = useDropdown();
  const sizeDropdown = useDropdown();

  const dayFilterCount = activeDay === 'LIST' ? activeFilterDays.size : 0;
  const hasFilters = activeStages.size > 0 || favOnly || dayFilterCount > 0;
  const filterCount = activeStages.size + (favOnly ? 1 : 0) + dayFilterCount;

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
                  ref={el => { tabRefs.current[id] = el; }}
                  className={`${styles.tab} ${activeDay === id ? styles.active : ''}`}
                  onClick={() => handleTabClick(id)}
                >
                  {label}
                </button>
              ))}
              <div className={styles.tabIndicator} ref={tabIndicatorRef} />
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
          </div>
        )}
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
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
        {activeDay === 'LIST' && (
          <div className={styles.modePills}>
            {LIST_MODES.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={`${styles.modePill} ${listMode === id ? styles.active : ''}`}
                onClick={() => onListModeChange(id)}
                aria-label={label}
                title={label}
              >
                <Icon size={14} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}

        <div className={styles.subNavRight}>
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
                  className={styles.colSizeCycle}
                  onClick={() => sizeDropdown.setOpen(v => !v)}
                  aria-label="Column size"
                  aria-expanded={sizeDropdown.open}
                >
                  {COL_SIZES.find(s => s.id === colSize)?.text}
                </button>
                {sizeDropdown.open && (
                  <div className={styles.dropdown}>
                    {COL_SIZES.map(({ id, text, label }) => (
                      <button
                        key={id}
                        className={`${styles.dropdownItem} ${colSize === id ? styles.active : ''}`}
                        onClick={() => { onColSizeChange(id); sizeDropdown.setOpen(false); }}
                      >
                        <span className={styles.sizeLabel}><strong>{text}</strong>{label}</span>
                        <span className={styles.checkmark}>{colSize === id ? '✓' : ''}</span>
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
                <span className={styles.iconLabel}><IconHeart size={11} filled />Favorited</span>
                <span className={styles.checkmark}>{favOnly ? '✓' : ''}</span>
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
                      >
                        <span>{label}</span>
                        <span className={styles.checkmark}>{isActive ? '✓' : ''}</span>
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
                >
                  <span>{stage}</span>
                  <span className={styles.checkmark}>{activeStages.has(stage) ? '✓' : ''}</span>
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
      </div>

      {/* ── Active filters summary ── */}
      {hasFilters && (() => {
        const activeDaysList = activeDay === 'LIST'
          ? DAY_FILTERS.filter(d => activeFilterDays.has(d.id))
          : [];
        const activeStagesList = STAGE_ORDER.filter(s => activeStages.has(s));
        const sections = [
          favOnly ? 'fav' : null,
          activeDaysList.length > 0 ? 'days' : null,
          activeStagesList.length > 0 ? 'stages' : null,
        ].filter(Boolean);
        const needsSeparators = sections.length >= 2;

        return (
          <div className={styles.activeFilters}>
            <span className={styles.activeFiltersLabel}>Filtering by</span>
            <div className={styles.activeFiltersBody}>
              <div className={styles.activeFiltersScroll}>
                {favOnly && (
                  <button className={styles.activeFilterPill} onClick={onFavToggle}>
                    <IconHeart size={10} filled />Favorited<IconClose size={12} />
                  </button>
                )}
                {needsSeparators && favOnly && activeDaysList.length + activeStagesList.length > 0 && (
                  <div className={styles.activeFilterDivider} />
                )}
                {activeDaysList.map(({ id, label }) => (
                  <button key={id} className={styles.activeFilterPill} onClick={() => onFilterDayToggle(id, false)}>
                    {label} <IconClose size={12} />
                  </button>
                ))}
                {needsSeparators && activeDaysList.length > 0 && activeStagesList.length > 0 && (
                  <div className={styles.activeFilterDivider} />
                )}
                {activeStagesList.map(stage => (
                  <button key={stage} className={styles.activeFilterPill} onClick={() => onStageToggle(stage)}>
                    {stage} <IconClose size={12} />
                  </button>
                ))}
              </div>
              <div className={styles.activeFiltersFadeRight} />
              <button className={styles.clearBtn} onClick={onClearFilters}>
                Clear
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
