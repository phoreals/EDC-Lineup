import styles from './Header.module.scss';

export function Header() {
  return (
    <div className={styles.header}>
      <h1>EDC 2026 Lineup</h1>
      <p className={styles.subtitle}>Filter stages, search artists, and favorite your must-see sets.</p>
    </div>
  );
}
