import { useState, useEffect, useRef } from 'react';
import { IconClose } from './Icons';
import styles from './MyScheduleToast.module.scss';

export function MyScheduleToast({ visible, label, icon, onAction, onDismiss }) {
  const [mounted, setMounted] = useState(visible);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (visible) {
      clearTimeout(timerRef.current);
      setLeaving(false);
      setMounted(true);
    } else if (mounted) {
      setLeaving(true);
      timerRef.current = setTimeout(() => {
        setMounted(false);
        setLeaving(false);
      }, 320);
    }
    return () => clearTimeout(timerRef.current);
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return null;

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.banner} ${leaving ? styles.bannerExit : ''}`}
        onClick={onAction}
        role="button"
        tabIndex={0}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onAction()}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.label}>{label}</span>
        <button
          className={styles.dismiss}
          onClick={e => { e.stopPropagation(); onDismiss(); }}
          aria-label="Dismiss"
          title="Dismiss"
        >
          <IconClose size={12} />
        </button>
      </div>
    </div>
  );
}
