import { STAGES, DAYS, getArtistsByStage, toTitle } from '../data/lineup';
import { getSetTime } from '../data/schedule';
import styles from './ByStageGrid.module.scss';

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

function StageColumn({ stage, segments, favorites, onToggle }) {
  return (
    <div className={styles.column}>
      <div className={styles.stageHeader}>
        <span className={styles.stageName}>{stage}</span>
      </div>
      {segments.map(({ day, artists }) => (
        <div key={day} className={styles.daySection}>
          <div className={styles.dayLabel}>{toTitle(day)}</div>
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
      ))}
    </div>
  );
}

export function ByStageGrid({ query, activeStages, favOnly, favorites, onToggle, visibleDays }) {
  const stageList = activeStages.size > 0
    ? STAGES.filter(s => activeStages.has(s))
    : STAGES;

  const columns = stageList
    .map(stage => {
      const segments = (visibleDays || DAYS)
        .map(day => {
          let names = getArtistsByStage(day)[stage];
          if (favOnly) names = names.filter(a => favorites.has(a));
          if (query)   names = names.filter(a => a.toLowerCase().includes(query));
          const artists = names.map(name => ({ name, time: getSetTime(day, stage, name) }));
          return { day, artists };
        })
        .filter(s => s.artists.length > 0);

      return { stage, segments };
    })
    .filter(({ segments }) => segments.length > 0);

  if (!columns.length) return null;

  return (
    <div className={styles.grid}>
      {columns.map(({ stage, segments }) => (
        <StageColumn
          key={stage}
          stage={stage}
          segments={segments}
          favorites={favorites}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
