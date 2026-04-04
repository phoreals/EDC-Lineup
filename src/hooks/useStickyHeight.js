import { useEffect, useRef } from 'react';

/**
 * Measures the height of the referenced element and writes it
 * to --sticky-top on :root so sticky stage headers offset correctly.
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
