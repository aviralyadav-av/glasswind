import { useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';

export interface PortalProps {
  children: ReactNode;
  /** Where to mount. Defaults to document.body. */
  container?: HTMLElement | null;
}

/**
 * Renders children into document.body (or a custom container) via a React
 * portal. SSR-safe: renders nothing until mounted on the client, so it never
 * touches `document` during server rendering (Next.js friendly).
 */
export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;
  return createPortal(children, container ?? document.body);
}
