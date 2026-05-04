import { useState, useCallback } from 'react';
import { DAYS, STAGE_ORDER, toTitle } from '../data/lineup';
import { SCHEDULE, getSetTime } from '../data/schedule';
import { IconHeart, IconBack, IconCopy, IconCheck } from './Icons';
import { MyScheduleToast } from './MyScheduleToast';
import styles from './MyScheduleGrid.module.scss';

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

function buildCopyText(favorites) {
  const lines = [];
  for (const day of DAYS) {
    const dayData = SCHEDULE[day];
    if (!dayData) continue;
    const dayLines = [];
    for (const stage of STAGE_ORDER) {
      const sets = dayData[stage] || [];
      for (const slot of sets) {
        if (!favorites.has(slot.artist)) continue;
        const end = addMin(slot.start, slot.duration);
        const time = `${fmt24to12(slot.start)}-${fmt24to12(end)}`;
        const displayStage = slot.stage || stage.split(' ')[0];
        dayLines.push({ startMin: parseInt(slot.start.replace(':', ''), 10), text: `${slot.artist}, ${time} (${displayStage})` });
      }
    }
    dayLines.sort((a, b) => a.startMin - b.startMin);
    if (dayLines.length > 0) {
      if (lines.length > 0) lines.push('');
      lines.push(toTitle(day));
      lines.push(...dayLines.map(d => d.text));
    }
  }
  return lines.join('\n');
}

function MyScheduleCard({ artist, stage, time }) {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <span className={styles.name}>{artist}</span>
        <span className={styles.meta}>
          {stage && <span className={styles.stage}>{stage}</span>}
          {stage && time && <span className={styles.dot}>&middot;</span>}
          {time && <span className={styles.time}>{time}</span>}
        </span>
      </div>
    </div>
  );
}

export function MyScheduleGrid({ favorites, onBack }) {
  const [copied, setCopied] = useState(false);
  const [copyDismissed, setCopyDismissed] = useState(false);

  const handleCopy = useCallback(async () => {
    const text = buildCopyText(favorites);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  }, [favorites]);

  const sets = [];

  DAYS.forEach((day, dayIdx) => {
    STAGE_ORDER.forEach(stage => {
      (SCHEDULE[day]?.[stage] || []).forEach(slot => {
        if (!favorites.has(slot.artist)) return;
        const [h, m] = slot.start.split(':').map(Number);
        sets.push({
          day,
          dayIdx,
          artist: slot.artist,
          stage: slot.stage || stage,
          startMin: h * 60 + m,
          time: getSetTime(day, stage, slot.artist),
        });
      });
    });
  });

  sets.sort((a, b) => a.dayIdx - b.dayIdx || a.startMin - b.startMin);

  // Group into day columns
  const dayColumns = DAYS.map(day => ({
    day,
    sets: sets.filter(s => s.day === day),
  })).filter(col => col.sets.length > 0);

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={onBack}>
        <IconBack size={15} />
        Return to Favorited View
      </button>

      {dayColumns.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyHeart}><IconHeart size={32} filled /></span>
          <p>No favorites yet</p>
          <p className={styles.emptyHint}>Tap the heart on any artist to add them here.</p>
        </div>
      ) : (
        <div className={styles.dayGrid}>
          {dayColumns.map(({ day, sets: daySets }) => (
            <div key={day} className={styles.dayCol}>
              <div className={styles.dayHeader}>{toTitle(day)}</div>
              <div className={styles.cardList}>
                {daySets.map(set => (
                  <MyScheduleCard
                    key={set.artist}
                    artist={set.artist}
                    stage={set.stage}
                    time={set.time}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <MyScheduleToast
        visible={sets.length > 0 && !copyDismissed}
        icon={copied ? <IconCheck size={15} /> : <IconCopy size={15} />}
        label={copied ? 'Copied!' : 'Copy to Clipboard'}
        onAction={handleCopy}
        onDismiss={() => setCopyDismissed(true)}
      />
    </div>
  );
}
