import styles from './Header.module.scss';

export function Header() {
  return (
    <div className={styles.header}>
      <h1>EDC Las Vegas 2026</h1>
      <p className={styles.subtitle}>Browse the lineup, build your schedule.</p>
    </div>
  );
}
