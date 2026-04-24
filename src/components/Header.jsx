import styles from './Header.module.scss';

export function Header({ tagline = 'Browse the lineup, build your schedule.' }) {
  return (
    <div className={styles.header}>
      <h1>EDC Las Vegas 2026</h1>
      <p className={styles.subtitle}>{tagline}</p>
    </div>
  );
}
