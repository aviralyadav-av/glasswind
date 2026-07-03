import { useCallback, useState } from 'react';

export interface UseDisclosureReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setOpen: (value: boolean) => void;
}

/**
 * Controlled/uncontrolled open state for overlays (Modal, Drawer, Dropdown…).
 */
export function useDisclosure(defaultOpen = false): UseDisclosureReturn {
  const [isOpen, setOpen] = useState(defaultOpen);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  return { isOpen, open, close, toggle, setOpen };
}
