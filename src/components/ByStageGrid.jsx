import { STAGES, DAYS, getArtistsByStage, toTitle } from '../data/lineup';
import { ArtistCard } from './ArtistCard';
import styles from './ByStageGrid.module.css';

export function ByStageGrid({ query, activeStages, favOnly, favorites, onToggle }) {
  const stageList =
    activeStages.size > 0 ? STAGES.filter(s => activeStages.has(s)) : STAGES;

  return (
    <div className={styles.grid}>
      {stageList.map(stage => {
        const segments = DAYS.map(day => {
          let list = getArtistsByStage(day)[stage];
          if (favOnly) list = list.filter(a => favorites.has(a));
          if (query) list = list.filter(a => a.toLowerCase().includes(query));
          return { day, list };
        }).filter(s => s.list.length > 0);

        if (!segments.length && (query || favOnly)) return null;

        return (
          <div key={stage} className={styles.column}>
            <div className={styles.header}>{stage}</div>
            <div className={styles.list}>
              {segments.length === 0 ? (
                <p className={styles.empty}>No artists</p>
              ) : (
                segments.map((seg, i) => (
                  <div key={seg.day}>
                    {i > 0 && <hr className={styles.rule} />}
                    <div className={styles.dayLabel}>{toTitle(seg.day)}</div>
                    {seg.list.map(name => (
                      <ArtistCard
                        key={name}
                        name={name}
                        isFav={favorites.has(name)}
                        onToggle={onToggle}
                      />
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
