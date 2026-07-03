import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type ForwardedRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';
import { Portal } from '../Portal';
import { useScrollLock } from '../../hooks';

/** Edge the drawer panel is pinned to. */
export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Whether the drawer is currently open (visible). */
  isOpen: boolean;
  /** Called when a close is requested — Esc key, backdrop click, or close button. */
  onClose: () => void;
  /** Panel content. Compose with `DrawerHeader` / `DrawerBody` / `DrawerFooter`. */
  children: ReactNode;
  /** Screen edge the panel slides in from. @default 'right' */
  side?: DrawerSide;
  /** Panel width (left/right) or height (top/bottom). Numbers are treated as px. @default '340px' */
  size?: string | number;
  /** Optional heading rendered in a built-in header row alongside the close button. */
  title?: ReactNode;
  /** Close the drawer when the backdrop is clicked. @default true */
  closeOnBackdrop?: boolean;
  /** Close the drawer when the Escape key is pressed. @default true */
  closeOnEsc?: boolean;
  /** Render the built-in close button in the header. @default true */
  showClose?: boolean;
}

/** Assign a node to a forwarded ref, whether it is a callback or an object ref. */
function assignRef<T>(ref: ForwardedRef<T>, node: T | null): void {
  if (typeof ref === 'function') {
    ref(node);
  } else if (ref) {
    ref.current = node;
  }
}

/**
 * Drawer — a frosted-glass edge sheet.
 * Renders through a `Portal`, pins a glass panel to the chosen screen edge,
 * and slides it in with the matching GPU keyframe. Locks body scroll, closes
 * on Esc / backdrop click, traps initial focus on the panel, and exposes
 * `role="dialog"` with `aria-modal`. The forwarded ref points at the panel.
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  {
    isOpen,
    onClose,
    children,
    side = 'right',
    size = '340px',
    title,
    closeOnBackdrop = true,
    closeOnEsc = true,
    showClose = true,
    className,
    style,
    ...rest
  },
  ref,
) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const reactId = useId();
  const titleId = `${reactId}-title`;

  useScrollLock(isOpen);

  const setPanelRef = useCallback(
    (node: HTMLDivElement | null) => {
      panelRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  // Close on Escape.
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  // Move focus onto the panel when it opens, then restore it on close/unmount.
  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => {
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isHorizontal = side === 'left' || side === 'right';
  const sizeValue = typeof size === 'number' ? `${size}px` : size;
  const panelStyle: CSSProperties = {
    ...style,
    ...(isHorizontal ? { width: sizeValue } : { height: sizeValue }),
  };

  const hasHeader = title != null || showClose;

  return (
    <Portal>
      <div className="gl-drawer">
        <div
          className="gl-drawer__backdrop"
          aria-hidden="true"
          onClick={closeOnBackdrop ? onClose : undefined}
        />
        <div
          ref={setPanelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title != null ? titleId : undefined}
          tabIndex={-1}
          style={panelStyle}
          className={cn(
            'gl-drawer__panel',
            `gl-drawer__panel--${side}`,
            'gl-focusable',
            className,
          )}
          {...rest}
        >
          {hasHeader ? (
            <div className="gl-drawer__header">
              {title != null ? (
                <h2 id={titleId} className="gl-drawer__title">
                  {title}
                </h2>
              ) : null}
              {showClose ? (
                <button
                  type="button"
                  className="gl-drawer__close gl-focusable"
                  aria-label="Close"
                  onClick={onClose}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              ) : null}
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </Portal>
  );
});

/** Props shared by the Drawer section wrappers (`DrawerHeader`/`DrawerBody`/`DrawerFooter`). */
export type DrawerSectionProps = HTMLAttributes<HTMLDivElement>;

/**
 * DrawerHeader — pinned top section of a `Drawer`, separated by a bottom border.
 * Use instead of the built-in `title` header when you need custom header markup.
 */
export const DrawerHeader = forwardRef<HTMLDivElement, DrawerSectionProps>(
  function DrawerHeader({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn('gl-drawer__header', className)} {...rest}>
        {children}
      </div>
    );
  },
);

/**
 * DrawerBody — the scrollable main content region of a `Drawer`.
 * Grows to fill remaining space and scrolls its own overflow.
 */
export const DrawerBody = forwardRef<HTMLDivElement, DrawerSectionProps>(
  function DrawerBody({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn('gl-drawer__body', className)} {...rest}>
        {children}
      </div>
    );
  },
);

/**
 * DrawerFooter — pinned bottom section of a `Drawer`, separated by a top border.
 */
export const DrawerFooter = forwardRef<HTMLDivElement, DrawerSectionProps>(
  function DrawerFooter({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn('gl-drawer__footer', className)} {...rest}>
        {children}
      </div>
    );
  },
);
