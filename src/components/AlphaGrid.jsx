import { DAYS, LINEUP, STAGES, STAGE_ORDER } from '../data/lineup';
import { SCHEDULE, getSetTime, getSubStage, makeSetKey } from '../data/schedule';
import { IconHeart } from './Icons';
import { HighlightMatch } from './Highlight';
import styles from './AlphaGrid.module.scss';

function CompactCard({ name, stage, time, setKeys, isFav, onToggle, query }) {
  const handleToggle = () => setKeys.forEach(k => onToggle(k));
  return (
    <div
      className={`${styles.card} ${isFav ? styles.favorited : ''}`}
      onClick={handleToggle}
      title={[name, stage, time, isFav ? 'favorited' : ''].filter(Boolean).join(' — ')}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleToggle()}
      aria-pressed={isFav}
      aria-label={[name, stage, time, isFav ? 'favorited' : ''].filter(Boolean).join(' — ')}
    >
      <div className={styles.info}>
        <span className={styles.name}><HighlightMatch text={name} query={query} /></span>
        <span className={styles.stage}>{stage}</span>
        {time && <span className={styles.time}>{time}</span>}
      </div>
      <span className={styles.heart} aria-hidden="true"><IconHeart size={8} filled={isFav} /></span>
    </div>
  );
}

  // Build a map of artist → all set keys across all days/stages
  function getArtistSetKeys(artistName) {
    const keys = [];
    for (const day of DAYS) {
      for (const stage of STAGE_ORDER) {
        const slots = SCHEDULE[day]?.[stage] || [];
        for (const slot of slots) {
          if (slot.artist === artistName) {
            keys.push(makeSetKey(artistName, day, slot.start));
          }
        }
      }
    }
    return keys;
  }

export function AlphaGrid({ query, activeStages, favOnly, favorites, onToggle, visibleDays, listLayout }) {
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
      if (query && !name.toLowerCase().includes(query)) continue;

      const setKeys = getArtistSetKeys(name);
      const isFav = setKeys.some(k => favorites.has(k));
      if (favOnly && !isFav) continue;

      const time = getSetTime(day, stage, name);
      const displayStage = stage === 'Smaller Stages'
        ? (getSubStage(day, name) || stage)
        : stage;
      allArtists.push({ name, stage: displayStage, day, time, setKeys, isFav });
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
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>{letter}</span>
          </div>
          <div className={`${styles.grid} ${listLayout === 'list' ? styles.singleCol : ''}`}>
            {groups[letter].map(({ name, stage, time, setKeys, isFav }) => (
              <CompactCard
                key={name}
                name={name}
                stage={stage}
                time={time}
                setKeys={setKeys}
                isFav={isFav}
                onToggle={onToggle}
                query={query}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
