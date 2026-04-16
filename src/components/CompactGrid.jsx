import { STAGES, DAYS, getArtistsByStage, toTitle } from '../data/lineup';
import { getSetTime } from '../data/schedule';
import styles from './CompactGrid.module.scss';

function CompactCard({ name, time, isFav, onToggle }) {
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
      {time && <span className={styles.time}>{time}</span>}
      {isFav && <span className={styles.star} aria-hidden="true">★</span>}
    </div>
  );
}

function CompactStageColumn({ stage, artists, favorites, onToggle }) {
  if (!artists.length) return null;

  return (
    <div className={styles.column}>
      <div className={styles.stageHeader}>
        <span className={styles.stageName}>{stage}</span>
      </div>
      <div className={styles.list}>
        {artists.map(({ name, time }) => (
          <CompactCard
            key={name}
            name={name}
            time={time}
            isFav={favorites.has(name)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}

export function CompactGrid({ query, activeStages, favOnly, favorites, onToggle, visibleDays }) {
  const stageList = activeStages.size > 0
    ? STAGES.filter(s => activeStages.has(s))
    : STAGES;

  return (
    <>
      {(visibleDays || DAYS).map(day => {
        const byStage = getArtistsByStage(day);

        const columns = stageList
          .map(stage => {
            let names = byStage[stage];
            if (favOnly) names = names.filter(a => favorites.has(a));
            if (query)   names = names.filter(a => a.toLowerCase().includes(query));
            const artists = names.map(name => ({ name, time: getSetTime(day, stage, name) }));
            return { stage, artists };
          })
          .filter(({ artists }) => artists.length > 0);

        if (!columns.length) return null;

        return (
          <section key={day}>
            <div className={styles.dayHeader}>{toTitle(day)}</div>
            <div className={styles.grid}>
              {columns.map(({ stage, artists }) => (
                <CompactStageColumn
                  key={stage}
                  stage={stage}
                  artists={artists}
                  favorites={favorites}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
