import { useMemo, useRef, useEffect, useState } from 'react';
import { STAGES } from '../data/lineup';
import { SCHEDULE } from '../data/schedule';
import styles from './ScheduleGrid.module.scss';

// ── Constants ─────────────────────────────────────────────────
const FESTIVAL_START_MIN = 17 * 60 + 30;
const FESTIVAL_END_MIN   = 24 * 60 + 5 * 60 + 30; // 29:30
const TOTAL_MIN          = FESTIVAL_END_MIN - FESTIVAL_START_MIN; // 720 min
const PX_PER_MIN         = 72 / 60;   // 72px per hour
const TOTAL_HEIGHT       = TOTAL_MIN * PX_PER_MIN;
const NARROW_BREAKPOINT  = 600;

export const STAGE_COLORS = {
  'Kinetic Field':   { bg: 'rgba(244,114,182,0.15)', border: '#f472b6', text: '#fce7f3' },
  'Circuit Grounds': { bg: 'rgba(34,211,238,0.15)',  border: '#22d3ee', text: '#cffafe' },
  'Cosmic Meadow':   { bg: 'rgba(52,211,153,0.15)',  border: '#34d399', text: '#d1fae5' },
  'Neon Garden':     { bg: 'rgba(251,146,60,0.15)',  border: '#fb923c', text: '#ffedd5' },
  'Basspod':         { bg: 'rgba(168,85,247,0.15)',  border: '#a855f7', text: '#ede9fe' },
  'Wasteland':       { bg: 'rgba(248,113,113,0.15)', border: '#f87171', text: '#fee2e2' },
  'Quantum Valley':  { bg: 'rgba(96,165,250,0.15)',  border: '#60a5fa', text: '#dbeafe' },
  'Stereobloom':     { bg: 'rgba(163,230,53,0.15)',  border: '#a3e635', text: '#ecfccb' },
  'Bionic Jungle':   { bg: 'rgba(129,140,248,0.15)', border: '#818cf8', text: '#e0e7ff' },
};

// ── Helpers ───────────────────────────────────────────────────
function parseTime(str) {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
}

function fmtLabel(absMin) {
  const totalMin = absMin % (24 * 60);
  const h  = Math.floor(totalMin / 60);
  const m  = totalMin % 60;
  const ap = h < 12 ? 'am' : 'pm';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return m === 0
    ? `${h12}${ap}`
    : `${h12}:${m.toString().padStart(2, '0')}${ap}`;
}

const TICKS = Array.from({ length: TOTAL_MIN / 30 + 1 }, (_, i) => {
  const offsetMin = i * 30;
  const absMin    = FESTIVAL_START_MIN + offsetMin;
  const isHour    = absMin % 60 === 0;
  return { offsetMin, absMin, isHour, label: isHour ? fmtLabel(absMin) : null };
});

// ── SetBlock ──────────────────────────────────────────────────
function SetBlock({ slot, stage, isFav, onToggle }) {
  const startAbsMin = parseTime(slot.start);
  const offsetMin   = startAbsMin - FESTIVAL_START_MIN;
  const top         = offsetMin * PX_PER_MIN;
  const height      = slot.duration * PX_PER_MIN;
  const color       = STAGE_COLORS[stage];
  const endAbsMin   = startAbsMin + slot.duration;

  return (
    <div
      className={`${styles.block} ${isFav ? styles.blockFav : ''}`}
      style={{
        top:         `${top}px`,
        height:      `${Math.max(height - 2, 18)}px`,
        background:  isFav
          ? `linear-gradient(160deg, ${color.border}, ${color.border}cc)`
          : color.bg,
        borderColor: isFav ? color.border : `${color.border}88`,
        color:       color.text,
      }}
      onClick={() => onToggle(slot.artist)}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToggle(slot.artist)}
      aria-label={`${slot.artist} — ${fmtLabel(startAbsMin)} to ${fmtLabel(endAbsMin)}`}
    >
      <span className={styles.blockName}>{slot.artist}</span>
      <span className={styles.blockTime}>{fmtLabel(startAbsMin)} – {fmtLabel(endAbsMin)}</span>
      {isFav && <span className={styles.blockStar}>★</span>}
    </div>
  );
}

// ── ScheduleGrid ──────────────────────────────────────────────
export function ScheduleGrid({ activeFilterDays, query, activeStages, favOnly, favorites, onToggle }) {
  const wrapperRef      = useRef(null);
  const bodyRef         = useRef(null);
  const headerScrollRef = useRef(null);
  const [isNarrow, setIsNarrow] = useState(false);
  const [scrolledLeft, setScrolledLeft] = useState(false);

  // Derive the displayed day from the global filter
  const scheduleDay = activeFilterDays && activeFilterDays.size === 1
    ? [...activeFilterDays][0]
    : 'FRIDAY';

  const dayData = SCHEDULE[scheduleDay] || {};

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

  // Sync header scroll to body horizontal scroll + track scrolledLeft
  useEffect(() => {
    const body = bodyRef.current;
    const hdr  = headerScrollRef.current;
    if (!body || !hdr) return;
    const onScroll = () => {
      hdr.scrollLeft = body.scrollLeft;
      setScrolledLeft(body.scrollLeft > 2);
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
    () => STAGES.filter(s => activeStages.size === 0 || activeStages.has(s)),
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

  return (
    <div className={styles.wrapper} ref={wrapperRef}>

      {/* ── Fixed stage header row ── */}
      <div className={styles.headerOuter}>
        <div className={styles.headerGutter} />
        <div className={styles.headerScroll} ref={headerScrollRef}>
          {visibleStages.map(stage => {
            const color = STAGE_COLORS[stage];
            return (
              <div
                key={stage}
                className={styles.stageHeader}
                style={{ borderBottomColor: color.border, color: color.text }}
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
        data-narrow={isNarrow ? 'true' : undefined}
        data-scrolled-left={scrolledLeft ? 'true' : undefined}
      >
        {/* Sticky time gutter */}
        <div className={styles.timeGutter}>
          {TICKS.filter(t => t.isHour).map(t => (
            <div
              key={t.offsetMin}
              className={styles.timeLabel}
              style={{ top: `${t.offsetMin * PX_PER_MIN}px` }}
            >
              {t.label}
            </div>
          ))}
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
          {visibleStages.map(stage => (
            <div key={stage} className={styles.stageCol}>
              {filteredSlots[stage]?.map(slot => (
                <SetBlock
                  key={slot.artist + slot.start}
                  slot={slot}
                  stage={stage}
                  isFav={favorites.has(slot.artist)}
                  onToggle={onToggle}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
