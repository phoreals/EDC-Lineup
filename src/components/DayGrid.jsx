import { STAGES, getArtistsByStage, toTitle } from '../data/lineup';
import { getSetTime } from '../data/schedule';
import { StageColumn } from './StageColumn';
import styles from './DayGrid.module.scss';

export function DayGrid({ day, query, activeStages, favOnly, favorites, onToggle, showDayHeader }) {
  const byStage = getArtistsByStage(day);

  const columns = STAGES
    .filter(stage => activeStages.size === 0 || activeStages.has(stage))
    .map(stage => {
      let names = byStage[stage];
      if (favOnly) names = names.filter(a => favorites.has(a));
      if (query)   names = names.filter(a => a.toLowerCase().includes(query));
      const artists = names.map(name => ({ name, time: getSetTime(day, stage, name) }));
      return { stage, artists };
    })
    .filter(({ artists }) => (query || favOnly) ? artists.length > 0 : true);

  if (!columns.length) return null;

  return (
    <>
      {showDayHeader && <div className={styles.dayHeader}>{toTitle(day)}</div>}
      <div className={styles.grid}>
        {columns.map(({ stage, artists }) => (
          <StageColumn key={stage} stage={stage} artists={artists} favorites={favorites} onToggle={onToggle} />
        ))}
      </div>
    </>
  );
}
