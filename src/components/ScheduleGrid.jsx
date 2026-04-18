import { useMemo, useRef, useEffect, useState } from 'react';
import { STAGE_ORDER } from '../data/lineup';
import { SCHEDULE } from '../data/schedule';
import styles from './ScheduleGrid.module.scss';

// ── Constants ─────────────────────────────────────────────────
const FESTIVAL_START_MIN = 17 * 60 + 30;
const FESTIVAL_END_MIN   = 24 * 60 + 5 * 60 + 30; // 29:30
const TOTAL_MIN          = FESTIVAL_END_MIN - FESTIVAL_START_MIN; // 720 min
const PX_PER_MIN         = 72 / 60;   // 72px per hour
const TOTAL_HEIGHT       = TOTAL_MIN * PX_PER_MIN;
const BOTTOM_PAD         = 64;
const NARROW_BREAKPOINT  = 600;

export const STAGE_COLORS = {
  'Kinetic Field':   { bg: 'var(--stage-kinetic-bg)',   border: 'var(--stage-kinetic-border)',   text: 'var(--stage-kinetic-text)' },
  'Circuit Grounds': { bg: 'var(--stage-circuit-bg)',   border: 'var(--stage-circuit-border)',   text: 'var(--stage-circuit-text)' },
  'Cosmic Meadow':   { bg: 'var(--stage-cosmic-bg)',    border: 'var(--stage-cosmic-border)',    text: 'var(--stage-cosmic-text)' },
  'Neon Garden':     { bg: 'var(--stage-neon-bg)',      border: 'var(--stage-neon-border)',      text: 'var(--stage-neon-text)' },
  'Basspod':         { bg: 'var(--stage-basspod-bg)',   border: 'var(--stage-basspod-border)',   text: 'var(--stage-basspod-text)' },
  'Wasteland':       { bg: 'var(--stage-wasteland-bg)', border: 'var(--stage-wasteland-border)', text: 'var(--stage-wasteland-text)' },
  'Quantum Valley':  { bg: 'var(--stage-quantum-bg)',   border: 'var(--stage-quantum-border)',   text: 'var(--stage-quantum-text)' },
  'Stereobloom':     { bg: 'var(--stage-stereo-bg)',    border: 'var(--stage-stereo-border)',    text: 'var(--stage-stereo-text)' },
  'Bionic Jungle':   { bg: 'var(--stage-bionic-bg)',    border: 'var(--stage-bionic-border)',    text: 'var(--stage-bionic-text)' },
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
          ? `color-mix(in srgb, ${color.border} 40%, var(--color-neutral-950))`
          : color.bg,
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
      <span className={styles.blockName}>{slot.artist}</span>
      <span className={styles.blockTime}>{fmtLabel(startAbsMin)} – {fmtLabel(endAbsMin)}</span>
      {isFav && <span className={styles.blockStar}>♥</span>}
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
                style={{
                  borderBottomColor: color.border,
                  color: color.text,
                  background: `linear-gradient(to bottom, transparent 0%, ${color.bg} 100%)`,
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
        data-narrow={isNarrow ? 'true' : undefined}
        data-scrolled-left={scrolledLeft ? 'true' : undefined}
      >
        {/* Sticky time gutter */}
        <div className={styles.timeGutter} style={{ minHeight: `${TOTAL_HEIGHT + BOTTOM_PAD}px` }}>
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
