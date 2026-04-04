import { STAGES, getArtistsByStage, toTitle } from '../data/lineup';
import { StageColumn } from './StageColumn';
import styles from './DayGrid.module.css';

export function DayGrid({
  day,
  query,
  activeStages,
  favOnly,
  favorites,
  onToggle,
  showDayHeader = false,
}) {
  const byStage = getArtistsByStage(day);

  const columns = STAGES
    .filter(s => activeStages.size === 0 || activeStages.has(s))
    .map(s => {
      let list = byStage[s];
      if (favOnly) list = list.filter(a => favorites.has(a));
      if (query) list = list.filter(a => a.toLowerCase().includes(query));
      return { stage: s, list };
    })
    .filter(c => (query || favOnly) ? c.list.length > 0 : true);

  if (!columns.length) return null;

  return (
    <>
      {showDayHeader && (
        <h2 className={styles.dayHeader}>{toTitle(day)}</h2>
      )}
      <div className={styles.grid}>
        {columns.map(({ stage, list }) => (
          <StageColumn
            key={stage}
            stage={stage}
            artists={list}
            favorites={favorites}
            onToggle={onToggle}
          />
        ))}
      </div>
    </>
  );
}
