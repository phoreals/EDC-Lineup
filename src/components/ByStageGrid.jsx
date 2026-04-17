import { STAGES, DAYS, getArtistsByStage, toTitle } from '../data/lineup';
import { getSetTime } from '../data/schedule';
import { ArtistCard } from './ArtistCard';
import styles from './ByStageGrid.module.scss';

export function ByStageGrid({ query, activeStages, favOnly, favorites, onToggle, visibleDays }) {
  const stageList = activeStages.size > 0
    ? STAGES.filter(s => activeStages.has(s))
    : STAGES;

  return (
    <div className={styles.wrapper}>
      {stageList.map(stage => {
        const segments = (visibleDays || DAYS)
          .map(day => {
            let names = getArtistsByStage(day)[stage];
            if (favOnly) names = names.filter(a => favorites.has(a));
            if (query)   names = names.filter(a => a.toLowerCase().includes(query));
            return { day, artists: names.map(name => ({ name, time: getSetTime(day, stage, name) })) };
          })
          .filter(s => s.artists.length > 0);

        if (!segments.length && (query || favOnly)) return null;

        return (
          <section key={stage} className={styles.stage}>
            <div className={styles.stageHeader}>{stage}</div>
            <div className={styles.dayColumns}>
              {segments.length === 0
                ? <p style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '14px' }}>No artists</p>
                : segments.map(({ day, artists }) => (
                    <div key={day} className={styles.dayColumn}>
                      <div className={styles.dayLabel}>{toTitle(day)}</div>
                      <div className={styles.list}>
                        {artists.map(({ name, time }) => (
                          <ArtistCard key={name} name={name} time={time} isFav={favorites.has(name)} onToggle={onToggle} />
                        ))}
                      </div>
                    </div>
                  ))
              }
            </div>
          </section>
        );
      })}
    </div>
  );
}
