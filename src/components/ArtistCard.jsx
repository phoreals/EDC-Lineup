import styles from './ArtistCard.module.scss';

export function ArtistCard({ name, isFav, onToggle }) {
  return (
    <div
      className={`${styles.card} ${isFav ? styles.favorited : ''}`}
      onClick={() => onToggle(name)}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToggle(name)}
      aria-pressed={isFav}
      aria-label={`${name}${isFav ? ' — favorited' : ''}`}
    >
      <span className={styles.name}>{name}</span>
      <span className={styles.star} aria-hidden="true">{isFav ? '★' : '☆'}</span>
    </div>
  );
}
