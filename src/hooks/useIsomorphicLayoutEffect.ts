import { useEffect, useLayoutEffect } from 'react';

/**
 * useLayoutEffect that silently degrades to useEffect on the server,
 * avoiding React's "useLayoutEffect does nothing on the server" warning.
 * Essential for SSR frameworks like Next.js.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
