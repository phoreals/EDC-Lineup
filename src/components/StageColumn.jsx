import { ArtistCard } from './ArtistCard';
import styles from './StageColumn.module.css';

export function StageColumn({ stage, artists, favorites, onToggle }) {
  if (!artists.length) return null;

  return (
    <div className={styles.column}>
      <div className={styles.header}>{stage}</div>
      <div className={styles.list}>
        {artists.map(name => (
          <ArtistCard
            key={name}
            name={name}
            isFav={favorites.has(name)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
