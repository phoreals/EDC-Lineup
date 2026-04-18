import { DAYS, LINEUP, STAGES } from '../data/lineup';
import { getSetTime } from '../data/schedule';
import styles from './AlphaGrid.module.scss';

function CompactCard({ name, stage, time, isFav, onToggle }) {
  return (
    <div
      className={`${styles.card} ${isFav ? styles.favorited : ''}`}
      onClick={() => onToggle(name)}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToggle(name)}
      aria-pressed={isFav}
      aria-label={`${name}${time ? ` ${time}` : ''}${isFav ? ' — favorited' : ''}`}
    >
      <span className={styles.name}>{name}</span>
      <span className={styles.stage}>{stage}</span>
      {time && <span className={styles.time}>{time}</span>}
      {isFav && <span className={styles.star} aria-hidden="true">♥</span>}
    </div>
  );
}

export function AlphaGrid({ query, activeStages, favOnly, favorites, onToggle, visibleDays }) {
  const seen = new Set();
  const allArtists = [];

  for (const day of (visibleDays || DAYS)) {
    const entries = LINEUP[day];
    for (let i = 0; i < entries.length; i++) {
      const name = entries[i];
      if (!name?.trim() || seen.has(name)) continue;
      seen.add(name);

      const stage = STAGES[i % STAGES.length];
      if (activeStages.size > 0 && !activeStages.has(stage)) continue;
      if (favOnly && !favorites.has(name)) continue;
      if (query && !name.toLowerCase().includes(query)) continue;

      const time = getSetTime(day, stage, name);
      allArtists.push({ name, stage, day, time });
    }
  }

  allArtists.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

  // Group by first letter
  const groups = {};
  for (const artist of allArtists) {
    const first = artist.name[0].toUpperCase();
    const letter = /[A-Z]/.test(first) ? first : '#';
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(artist);
  }

  const letters = Object.keys(groups).sort((a, b) => {
    if (a === '#') return -1;
    if (b === '#') return 1;
    return a.localeCompare(b);
  });

  if (!letters.length) return null;

  return (
    <div className={styles.wrapper}>
      {letters.map(letter => (
        <section key={letter}>
          <div className={styles.letterHeader}>
            <span className={styles.letterName}>{letter}</span>
          </div>
          <div className={styles.grid}>
            {groups[letter].map(({ name, stage, time }) => (
              <CompactCard
                key={name}
                name={name}
                stage={stage}
                time={time}
                isFav={favorites.has(name)}
                onToggle={onToggle}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
