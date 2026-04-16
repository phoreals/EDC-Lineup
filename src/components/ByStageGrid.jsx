import { STAGES, DAYS, getArtistsByStage, toTitle } from '../data/lineup';
import { getSetTime } from '../data/schedule';
import { ArtistCard } from './ArtistCard';
import styles from './ByStageGrid.module.scss';

export function ByStageGrid({ query, activeStages, favOnly, favorites, onToggle }) {
  const stageList = activeStages.size > 0
    ? STAGES.filter(s => activeStages.has(s))
    : STAGES;

  return (
    <div className={styles.grid}>
      {stageList.map(stage => {
        const segments = DAYS
          .map(day => {
            let names = getArtistsByStage(day)[stage];
            if (favOnly) names = names.filter(a => favorites.has(a));
            if (query)   names = names.filter(a => a.toLowerCase().includes(query));
            return { day, artists: names.map(name => ({ name, time: getSetTime(day, stage, name) })) };
          })
          .filter(s => s.artists.length > 0);

        if (!segments.length && (query || favOnly)) return null;

        return (
          <div key={stage} className={styles.column}>
            <div className={styles.columnHeader}>{stage}</div>
            <div className={styles.list}>
              {segments.length === 0
                ? <p style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '14px' }}>No artists</p>
                : segments.map(({ day, artists }, i) => (
                    <div key={day} className={styles.daySection}>
                      {i > 0 && <hr className={styles.dayRule} />}
                      <div className={styles.dayLabel}>{toTitle(day)}</div>
                      {artists.map(({ name, time }) => (
                        <ArtistCard key={name} name={name} time={time} isFav={favorites.has(name)} onToggle={onToggle} />
                      ))}
                    </div>
                  ))
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}
