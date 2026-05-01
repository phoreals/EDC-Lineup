import { STAGE_ORDER, DAYS, getArtistsByStage, toTitle } from '../data/lineup';
import { SCHEDULE, getSetTime, getSubStage } from '../data/schedule';
import { IconHeart } from './Icons';
import { HighlightMatch } from './Highlight';
import styles from './CompactGrid.module.scss';

function CompactCard({ name, stage, time, substage, isFav, onToggle, query }) {
  return (
    <div
      className={`${styles.card} ${isFav ? styles.favorited : ''}`}
      onClick={() => onToggle(name)}
      title={[name, substage || stage, time, isFav ? 'favorited' : ''].filter(Boolean).join(' — ')}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToggle(name)}
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
        {artists.map(({ name, time, substage }) => (
          <CompactCard
            key={name}
            name={name}
            stage={stage}
            time={time}
            substage={substage}
            isFav={favorites.has(name)}
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
          .map(stage => {
            let names = byStage[stage];
            if (favOnly) names = names.filter(a => favorites.has(a));
            if (query)   names = names.filter(a => a.toLowerCase().includes(query));
            const stageSlots = SCHEDULE[day]?.[stage] || [];
            const artists = names.map(name => {
              const slot = stageSlots.find(s => s.artist === name);
              const [h, m] = (slot?.start || '0:0').split(':').map(Number);
              return {
                name,
                time: getSetTime(day, stage, name),
                substage: stage === 'Smaller Stages' ? getSubStage(day, name) : null,
                startMin: h * 60 + m,
              };
            });
            artists.sort((a, b) => a.startMin - b.startMin);
            return { stage, artists };
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
