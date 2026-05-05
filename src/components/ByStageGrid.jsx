import { STAGE_ORDER, DAYS, getArtistsByStage, toTitle } from '../data/lineup';
import { SCHEDULE, getSetTime, getSubStageNames } from '../data/schedule';
import { IconHeart } from './Icons';
import { HighlightMatch } from './Highlight';
import styles from './ByStageGrid.module.scss';

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

export function ByStageGrid({ query, activeStages, favOnly, favorites, onToggle, visibleDays, listLayout }) {
  const stageList = activeStages.size > 0
    ? STAGE_ORDER.filter(s => activeStages.has(s))
    : STAGE_ORDER;

  // Collect all unique sub-stage names across visible days (stable order)
  const allSubStageNames = [];
  const _subStageSeen = new Set();
  for (const day of (visibleDays || DAYS)) {
    for (const name of getSubStageNames(day)) {
      if (!_subStageSeen.has(name)) { _subStageSeen.add(name); allSubStageNames.push(name); }
    }
  }

  const stages = stageList
    .flatMap(stage => {
      if (stage !== 'Smaller Stages') {
        const segments = (visibleDays || DAYS)
          .map(day => {
            let names = getArtistsByStage(day)[stage];
            if (favOnly) names = names.filter(a => favorites.has(a));
            if (query)   names = names.filter(a => a.toLowerCase().includes(query));
            const stageSlots = SCHEDULE[day]?.[stage] || [];
            const artists = names.map(name => {
              const slot = stageSlots.find(s => s.artist === name);
              const [h, m] = (slot?.start || '0:0').split(':').map(Number);
              return { name, time: getSetTime(day, stage, name), substage: null, startMin: h * 60 + m };
            });
            artists.sort((a, b) => a.startMin - b.startMin);
            return { day, artists };
          })
          .filter(s => s.artists.length > 0);
        return [{ stage, segments }];
      }
      // Expand Smaller Stages into individual sub-stage sections
      return allSubStageNames.map(subStage => {
        const segments = (visibleDays || DAYS)
          .map(day => {
            const smallerSlots = SCHEDULE[day]?.['Smaller Stages'] || [];
            let slots = smallerSlots.filter(s => s.stage === subStage);
            if (favOnly) slots = slots.filter(s => favorites.has(s.artist));
            if (query)   slots = slots.filter(s => s.artist.toLowerCase().includes(query));
            const artists = slots.map(slot => {
              const [h, m] = slot.start.split(':').map(Number);
              return { name: slot.artist, time: getSetTime(day, 'Smaller Stages', slot.artist), substage: null, startMin: h * 60 + m };
            });
            artists.sort((a, b) => a.startMin - b.startMin);
            return { day, artists };
          })
          .filter(s => s.artists.length > 0);
        return { stage: subStage, segments };
      });
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
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
