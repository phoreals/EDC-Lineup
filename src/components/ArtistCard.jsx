import { IconHeart } from './Icons';
import styles from './ArtistCard.module.scss';

export function ArtistCard({ name, time, isFav, onToggle }) {
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
        <span className={styles.name}>{name}</span>
        {time && <span className={styles.time}>{time}</span>}
      </div>
      <span className={styles.star} aria-hidden="true"><IconHeart size={8} filled={isFav} /></span>
    </div>
  );
}
