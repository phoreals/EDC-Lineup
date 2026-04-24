import { STAGE_ORDER, DAYS, getArtistsByStage, toTitle } from '../data/lineup';
import { getSetTime } from '../data/schedule';
import { IconHeart } from './Icons';
import { HighlightMatch } from './Highlight';
import styles from './ByStageGrid.module.scss';

function CompactCard({ name, stage, time, isFav, onToggle, query }) {
  return (
    <div
      className={`${styles.card} ${isFav ? styles.favorited : ''}`}
      onClick={() => onToggle(name)}
      title={time ? `${name} — ${time}` : name}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToggle(name)}
      aria-pressed={isFav}
      aria-label={[name, stage, time, isFav ? 'favorited' : ''].filter(Boolean).join(' — ')}
    >
      <div className={styles.info}>
        <span className={styles.name}><HighlightMatch text={name} query={query} /></span>
        {time && <span className={styles.time}>{time}</span>}
      </div>
      <span className={styles.heart} aria-hidden="true"><IconHeart size={8} filled={isFav} /></span>
    </div>
  );
}

export function ByStageGrid({ query, activeStages, favOnly, favorites, onToggle, visibleDays, listLayout }) {
  const stageList = activeStages.size > 0
    ? STAGE_ORDER.filter(s => activeStages.has(s))
    : STAGE_ORDER;

  const stages = stageList
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

  if (!stages.length) return null;

  return (
    <div className={`${styles.wrapper} ${listLayout === 'list' ? styles.singleColWrapper : ''}`}>
      {stages.map(({ stage, segments }) => (
        <section key={stage}>
          <div className={styles.stageHeader}>
            <span className={styles.stageName}>{stage}</span>
          </div>
          <div className={`${styles.dayColumns} ${listLayout === 'list' ? styles.singleCol : ''}`}>
            {segments.map(({ day, artists }) => (
              <div key={day} className={styles.dayColumn}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionTitle}>{toTitle(day)}</span>
                </div>
                <div className={styles.list}>
                  {artists.map(({ name, time }) => (
                    <CompactCard
                      key={name}
                      name={name}
                      stage={stage}
                      time={time}
                      isFav={favorites.has(name)}
                      onToggle={onToggle}
                      query={query}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
