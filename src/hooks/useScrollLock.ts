import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * Locks <body> scroll while an overlay is open (Modal, Drawer), preserving
 * the scrollbar gutter so the page doesn't shift.
 */
export function useScrollLock(locked: boolean): void {
  useIsomorphicLayoutEffect(() => {
    if (!locked || typeof document === 'undefined') return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [locked]);
}
