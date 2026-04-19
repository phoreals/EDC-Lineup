import { useState, useCallback } from 'react';
import { DAYS, STAGE_ORDER, toTitle } from '../data/lineup';
import { SCHEDULE } from '../data/schedule';
import { IconCopy, IconClose } from './Icons';
import styles from './FavToast.module.scss';

function fmt24to12(time24) {
  const [h, m] = time24.split(':').map(Number);
  const h12 = ((h - 1) % 12) + 1;
  return m === 0 ? `${h12}` : `${h12}:${String(m).padStart(2, '0')}`;
}

function addMin(time24, minutes) {
  const [h, m] = time24.split(':').map(Number);
  const total = h * 60 + m + minutes;
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function buildFavText(favorites, activeFilterDays) {
  const days = activeFilterDays.size > 0
    ? DAYS.filter(d => activeFilterDays.has(d))
    : DAYS;

  const lines = [];
  for (const day of days) {
    const dayData = SCHEDULE[day];
    if (!dayData) continue;

    const dayLines = [];
    for (const stage of STAGE_ORDER) {
      const sets = dayData[stage] || [];
      for (const slot of sets) {
        if (!favorites.has(slot.artist)) continue;
        const end = addMin(slot.start, slot.duration);
        const time = `${fmt24to12(slot.start)}-${fmt24to12(end)}`;
        const shortStage = stage.split(' ')[0];
        dayLines.push(`${slot.artist}, ${time} (${shortStage})`);
      }
    }

    if (dayLines.length > 0) {
      if (lines.length > 0) lines.push('');
      lines.push(toTitle(day));
      lines.push(...dayLines);
    }
  }

  return lines.join('\n');
}

export function FavToast({ visible, favorites, activeFilterDays, onDismiss }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const text = buildFavText(favorites, activeFilterDays);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  }, [favorites, activeFilterDays]);

  return (
    <div className={`${styles.toast} ${visible ? styles.visible : ''}`}>
      <button className={styles.copyBtn} onClick={handleCopy}>
        <IconCopy size={14} />
        {copied ? 'Copied!' : 'Copy to Clipboard'}
      </button>
      <button className={styles.dismissBtn} onClick={onDismiss} aria-label="Dismiss">
        <IconClose size={14} />
      </button>
    </div>
  );
}
