import { STAGES, getArtistsByStage, toTitle } from '../data/lineup';
import { StageColumn } from './StageColumn';
import styles from './DayGrid.module.scss';

export function DayGrid({ day, query, activeStages, favOnly, favorites, onToggle, showDayHeader }) {
  const byStage = getArtistsByStage(day);

  const columns = STAGES
    .filter(stage => activeStages.size === 0 || activeStages.has(stage))
    .map(stage => {
      let artists = byStage[stage];
      if (favOnly) artists = artists.filter(a => favorites.has(a));
      if (query)   artists = artists.filter(a => a.toLowerCase().includes(query));
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
