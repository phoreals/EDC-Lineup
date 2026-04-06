import { useEffect, useRef } from 'react';

/**
 * Attaches a ResizeObserver to the returned ref and writes the
 * element's height to --sticky-top on :root, keeping sticky
 * stage headers correctly offset below the controls bar.
 */
export function useStickyHeight() {
  const ref = useRef(null);

  useEffect(() => {
    const update = () => {
      if (ref.current) {
        document.documentElement.style.setProperty(
          '--sticky-top',
          `${ref.current.offsetHeight}px`
        );
      }
    };

    update();
    const ro = new ResizeObserver(update);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return ref;
}
