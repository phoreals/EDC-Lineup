import { STAGE_ORDER, DAYS, getArtistsByStage, toTitle } from '../data/lineup';
import { SCHEDULE, getSetTime, getSubStageNames, formatSlotTime, makeSetKey } from '../data/schedule';
import { IconHeart } from './Icons';
import { HighlightMatch } from './Highlight';
import styles from './CompactGrid.module.scss';

function CompactCard({ name, stage, time, substage, setKey, isFav, onToggle, query }) {
  return (
    <div
      className={`${styles.card} ${isFav ? styles.favorited : ''}`}
      onClick={() => onToggle(setKey)}
      title={[name, substage || stage, time, isFav ? 'favorited' : ''].filter(Boolean).join(' — ')}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToggle(setKey)}
      aria-pressed={isFav}
      aria-label={[name, substage || stage, time, isFav ? 'favorited' : ''].filter(Boolean).join(' — ')}
    >
      <div className={styles.info}>
        <span className={styles.name}><HighlightMatch text={name} query={query} /></span>
        {substage && <span className={styles.substage}>{substage}</span>}
        {time && <span className={styles.time}>{time}</span>}
      </div>
      <span className={styles.heart} aria-hidden="true"><IconHeart size={8} filled={isFav} /></span>
    </div>
  );
}

function CompactStageColumn({ stage, artists, favorites, onToggle, query }) {
  if (!artists.length) return null;

  return (
    <div className={styles.column}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>{stage}</span>
      </div>
      <div className={styles.list}>
        {artists.map(({ name, time, substage, setKey }) => (
          <CompactCard
            key={setKey}
            name={name}
            stage={stage}
            time={time}
            substage={substage}
            setKey={setKey}
            isFav={favorites.has(setKey)}
            onToggle={onToggle}
            query={query}
          />
        ))}
      </div>
    </div>
  );
}

export function CompactGrid({ query, activeStages, favOnly, favorites, onToggle, visibleDays, listLayout }) {
  const stageList = activeStages.size > 0
    ? STAGE_ORDER.filter(s => activeStages.has(s))
    : STAGE_ORDER;

  return (
    <>
      {(visibleDays || DAYS).map(day => {
        const byStage = getArtistsByStage(day);

        const columns = stageList
          .flatMap(stage => {
            if (stage !== 'Smaller Stages') {
              const stageSlots = SCHEDULE[day]?.[stage] || [];
              let slots = stageSlots;
              if (favOnly) slots = slots.filter(s => favorites.has(makeSetKey(s.artist, day, s.start)));
              if (query)   slots = slots.filter(s => s.artist.toLowerCase().includes(query));
              const artists = slots.map(slot => {
                const [h, m] = slot.start.split(':').map(Number);
                return { name: slot.artist, time: getSetTime(day, stage, slot.artist), substage: null, startMin: h * 60 + m, setKey: makeSetKey(slot.artist, day, slot.start) };
              });
              artists.sort((a, b) => a.startMin - b.startMin);
              return [{ stage, artists }];
            }
            // Expand Smaller Stages into individual sub-stage columns
            const smallerSlots = SCHEDULE[day]?.['Smaller Stages'] || [];
            return getSubStageNames(day).map(subStage => {
              let slots = smallerSlots.filter(s => s.stage === subStage);
              if (favOnly) slots = slots.filter(s => favorites.has(makeSetKey(s.artist, day, s.start)));
              if (query)   slots = slots.filter(s => s.artist.toLowerCase().includes(query));
              const artists = slots.map(slot => {
                const [h, m] = slot.start.split(':').map(Number);
                return { name: slot.artist, time: formatSlotTime(slot), substage: null, startMin: h * 60 + m, setKey: makeSetKey(slot.artist, day, slot.start) };
              });
              artists.sort((a, b) => a.startMin - b.startMin);
              return { stage: subStage, artists };
            });
          })
          .filter(({ artists }) => artists.length > 0);

        if (!columns.length) return null;

        return (
          <section key={day}>
            <div className={styles.dayHeader}>{toTitle(day)}</div>
            <div className={`${styles.grid} ${listLayout === 'list' ? styles.singleCol : ''}`}>
              {columns.map(({ stage, artists }) => (
                <CompactStageColumn
                  key={stage}
                  stage={stage}
                  artists={artists}
                  favorites={favorites}
                  onToggle={onToggle}
                  query={query}
                />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
