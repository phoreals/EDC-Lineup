import { IconClose } from './Icons';
import styles from './MyScheduleToast.module.scss';

export function MyScheduleToast({ visible, onSwitch, onDismiss }) {
  if (!visible) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.banner}>
        <button className={styles.action} onClick={onSwitch}>
          Try My Schedule
        </button>
        <button className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss" title="Dismiss">
          <IconClose size={12} />
        </button>
      </div>
    </div>
  );
}
