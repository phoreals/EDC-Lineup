import { STAGE_ORDER, DAYS, getArtistsByStage, toTitle } from '../data/lineup';
import { getSetTime } from '../data/schedule';
import { IconHeart } from './Icons';
import { HighlightMatch } from './Highlight';
import styles from './CompactGrid.module.scss';

function CompactCard({ name, time, isFav, onToggle, query }) {
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
      <div className={styles.info}>
        <span className={styles.name}><HighlightMatch text={name} query={query} /></span>
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
        {artists.map(({ name, time }) => (
          <CompactCard
            key={name}
            name={name}
            time={time}
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
            const artists = names.map(name => ({ name, time: getSetTime(day, stage, name) }));
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
