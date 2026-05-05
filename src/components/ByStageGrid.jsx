import { STAGE_ORDER, DAYS, getArtistsByStage, toTitle } from '../data/lineup';
import { SCHEDULE, getSetTime, getSubStageNames, formatSlotTime, makeSetKey } from '../data/schedule';
import { IconHeart } from './Icons';
import { HighlightMatch } from './Highlight';
import styles from './ByStageGrid.module.scss';

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
            const stageSlots = SCHEDULE[day]?.[stage] || [];
            let slots = stageSlots;
            if (favOnly) slots = slots.filter(s => favorites.has(makeSetKey(s.artist, day, s.start)));
            if (query)   slots = slots.filter(s => s.artist.toLowerCase().includes(query));
            const artists = slots.map(slot => {
              const [h, m] = slot.start.split(':').map(Number);
              return { name: slot.artist, time: getSetTime(day, stage, slot.artist), substage: null, startMin: h * 60 + m, setKey: makeSetKey(slot.artist, day, slot.start) };
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
            if (favOnly) slots = slots.filter(s => favorites.has(makeSetKey(s.artist, day, s.start)));
            if (query)   slots = slots.filter(s => s.artist.toLowerCase().includes(query));
            const artists = slots.map(slot => {
              const [h, m] = slot.start.split(':').map(Number);
              return { name: slot.artist, time: formatSlotTime(slot), substage: null, startMin: h * 60 + m, setKey: makeSetKey(slot.artist, day, slot.start) };
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
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
