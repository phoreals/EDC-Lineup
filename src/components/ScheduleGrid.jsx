import { useMemo, useRef, useEffect, useState } from 'react';
import { STAGE_ORDER } from '../data/lineup';
import { SCHEDULE } from '../data/schedule';
import { IconHeart } from './Icons';
import { HighlightMatch } from './Highlight';
import { STAGE_COLORS } from '../data/stageColors';
import styles from './ScheduleGrid.module.scss';

// ── Constants ─────────────────────────────────────────────────
const FESTIVAL_START_MIN = 17 * 60;       // 5:00pm
const FESTIVAL_END_MIN   = 24 * 60 + 6 * 60; // 6:00am
const TOTAL_MIN          = FESTIVAL_END_MIN - FESTIVAL_START_MIN; // 720 min
const PX_PER_MIN         = 72 / 60;   // 72px per hour
const TOTAL_HEIGHT       = TOTAL_MIN * PX_PER_MIN;
const BOTTOM_PAD         = 36;
const NARROW_BREAKPOINT  = 600;


// ── Helpers ───────────────────────────────────────────────────
function parseTime(str) {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
}

function fmtLabel(absMin, omitSuffix = false) {
  const totalMin = absMin % (24 * 60);
  const h  = Math.floor(totalMin / 60);
  const m  = totalMin % 60;
  const ap = h < 12 ? 'am' : 'pm';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const suffix = omitSuffix ? '' : ap;
  return m === 0
    ? `${h12}${suffix}`
    : `${h12}:${m.toString().padStart(2, '0')}${suffix}`;
}

function getPeriod(absMin) {
  const h = Math.floor((absMin % (24 * 60)) / 60);
  return h < 12 ? 'am' : 'pm';
}

const TICKS = Array.from({ length: TOTAL_MIN / 30 + 1 }, (_, i) => {
  const offsetMin = i * 30;
  const absMin    = FESTIVAL_START_MIN + offsetMin;
  const isHour    = absMin % 60 === 0;
  return { offsetMin, absMin, isHour, label: isHour ? fmtLabel(absMin) : null };
});

// ── SetBlock ──────────────────────────────────────────────────
function SetBlock({ slot, stage, isFav, onToggle, compact, query }) {
  const startAbsMin = parseTime(slot.start);
  const offsetMin   = startAbsMin - FESTIVAL_START_MIN;
  const top         = offsetMin * PX_PER_MIN;
  const height      = slot.duration * PX_PER_MIN;
  const color       = STAGE_COLORS[stage];
  const endAbsMin   = startAbsMin + slot.duration;
  const samePeriod  = getPeriod(startAbsMin) === getPeriod(endAbsMin);
  const omitStart   = compact && samePeriod;

  return (
    <div
      className={`${styles.block} ${isFav ? styles.blockFav : ''}`}
      title={`${slot.artist} — ${fmtLabel(startAbsMin)} to ${fmtLabel(endAbsMin)}`}
      style={{
        top:         `${top}px`,
        height:      `${Math.max(height - 2, 18)}px`,
        background:  isFav
          ? `radial-gradient(ellipse at 30% 50%, color-mix(in srgb, ${color.border} 40%, var(--color-neutral-950)), color-mix(in srgb, ${color.border} 18%, var(--color-neutral-950)))`
          : `color-mix(in srgb, ${color.bg} 72%, transparent)`,
        borderColor: isFav
          ? color.border
          : `color-mix(in srgb, ${color.border} 53%, transparent)`,
        color:       color.text,
      }}
      onClick={() => onToggle(slot.artist)}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToggle(slot.artist)}
      aria-label={`${slot.artist} — ${fmtLabel(startAbsMin)} to ${fmtLabel(endAbsMin)}`}
    >
      <span className={styles.blockName}><HighlightMatch text={slot.artist} query={query} /></span>
      <span className={styles.blockTime}><span className={styles.noWrap}>{fmtLabel(startAbsMin, omitStart)}&thinsp;–</span>&thinsp;{fmtLabel(endAbsMin)}</span>
      {isFav && <span className={styles.blockStar}><IconHeart size={8} filled /></span>}
    </div>
  );
}

// ── ScheduleGrid ──────────────────────────────────────────────
export function ScheduleGrid({ activeFilterDays, query, activeStages, favOnly, favorites, onToggle, colSize = 'md' }) {
  const wrapperRef      = useRef(null);
  const bodyRef         = useRef(null);
  const headerRef       = useRef(null);
  const headerScrollRef = useRef(null);
  const [isNarrow, setIsNarrow] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Derive the displayed day from the global filter
  const scheduleDay = activeFilterDays && activeFilterDays.size === 1
    ? [...activeFilterDays][0]
    : 'FRIDAY';

  const dayData = useMemo(() => SCHEDULE[scheduleDay] || {}, [scheduleDay]);

  // ResizeObserver on wrapper → toggle narrow mode
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setIsNarrow(entry.contentRect.width <= NARROW_BREAKPOINT);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);


  // Measure header height for body padding
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setHeaderHeight(entry.borderBoxSize?.[0]?.blockSize ?? entry.target.offsetHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Sync header scroll to body horizontal scroll
  useEffect(() => {
    const body = bodyRef.current;
    const hdr  = headerScrollRef.current;
    if (!body || !hdr) return;
    const onScroll = () => {
      hdr.scrollLeft = body.scrollLeft;
    };
    body.addEventListener('scroll', onScroll, { passive: true });
    return () => body.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll to ~7:30pm on mount / day change
  useEffect(() => {
    if (bodyRef.current) {
      const offset = (19 * 60 + 30 - FESTIVAL_START_MIN) * PX_PER_MIN - 24;
      bodyRef.current.scrollTop  = Math.max(0, offset);
      bodyRef.current.scrollLeft = 0;
    }
  }, [scheduleDay]);

  const visibleStages = useMemo(
    () => STAGE_ORDER.filter(s => activeStages.size === 0 || activeStages.has(s)),
    [activeStages]
  );

  const filteredSlots = useMemo(() => {
    const result = {};
    visibleStages.forEach(stage => {
      result[stage] = (dayData[stage] || []).filter(slot => {
        if (favOnly && !favorites.has(slot.artist)) return false;
        if (query  && !slot.artist.toLowerCase().includes(query)) return false;
        return true;
      });
    });
    return result;
  }, [dayData, visibleStages, favOnly, favorites, query]);

  // When filtering, hide stages with no matching slots
  const displayStages = (favOnly || query)
    ? visibleStages.filter(s => (filteredSlots[s] || []).length > 0)
    : visibleStages;

  return (
    <div className={styles.wrapper} ref={wrapperRef} data-col-size={colSize}>

      {/* ── Fixed stage header row ── */}
      <div className={styles.headerOuter} ref={headerRef}>
        <div className={styles.headerGutter} />
        <div className={styles.headerScroll} ref={headerScrollRef}>
          {displayStages.map(stage => {
            const color = STAGE_COLORS[stage];
            return (
              <div
                key={stage}
                className={styles.stageHeader}
                style={{
                  borderBottomColor: color.border,
                  color: color.text,
                  background: `radial-gradient(ellipse at 50% 100%, color-mix(in srgb, ${color.border} 25%, var(--color-neutral-950)), transparent)`,
                }}
              >
                {stage}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Scrollable body ── */}
      {/* data-narrow lets SCSS target this element for compact sizing,
          since container queries don't reliably pierce overflow:auto roots */}
      <div
        className={styles.body}
        ref={bodyRef}
        style={{ paddingTop: `${headerHeight}px` }}
        data-narrow={isNarrow ? 'true' : undefined}
      >
        {/* Sticky time gutter */}
        <div className={styles.timeGutter} style={{ minHeight: `${TOTAL_HEIGHT + BOTTOM_PAD}px` }}>
          {TICKS.filter(t => t.isHour).map(t => {
            const top = t.offsetMin === 0 ? 8 : t.offsetMin * PX_PER_MIN;
            return (
              <div
                key={t.offsetMin}
                className={styles.timeLabel}
                style={{ top: `${top}px` }}
              >
                {t.label}
              </div>
            );
          })}
        </div>

        {/* Positioned stage grid */}
        <div className={styles.grid} style={{ height: `${TOTAL_HEIGHT}px` }}>
          {TICKS.map(t => (
            <div
              key={t.offsetMin}
              className={t.isHour ? styles.hourLine : styles.halfLine}
              style={{ top: `${t.offsetMin * PX_PER_MIN}px` }}
            />
          ))}
          {displayStages.map(stage => (
            <div key={stage} className={styles.stageCol}>
              {filteredSlots[stage]?.map(slot => (
                <SetBlock
                  key={slot.artist + slot.start}
                  slot={slot}
                  stage={stage}
                  isFav={favorites.has(slot.artist)}
                  onToggle={onToggle}
                  compact={isNarrow}
                  query={query}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
