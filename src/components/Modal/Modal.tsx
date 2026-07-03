import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
} from 'react';
import type {
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  MutableRefObject,
  ReactNode,
} from 'react';
import { cn } from '../../utils/cn';
import { Portal } from '../Portal';
import { useScrollLock } from '../../hooks';

/** Preset widths for the modal panel. */
export type ModalSize = 'sm' | 'md' | 'lg' | 'full';

export interface ModalProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Whether the modal is currently visible. */
  isOpen: boolean;
  /** Called when the modal requests to close (Esc, backdrop, close button). */
  onClose: () => void;
  /** Panel contents — typically ModalBody / ModalFooter sections. */
  children: ReactNode;
  /** Optional heading rendered in the panel header; also labels the dialog. */
  title?: ReactNode;
  /** Preset panel width. @default 'md' */
  size?: ModalSize;
  /** Close when the backdrop (area outside the panel) is clicked. @default true */
  closeOnBackdrop?: boolean;
  /** Close when the Escape key is pressed. @default true */
  closeOnEsc?: boolean;
  /** Render the header close button. @default true */
  showClose?: boolean;
}

/**
 * Modal — an accessible, glassmorphic dialog rendered in a Portal.
 *
 * Traps the page behind a frosted backdrop, locks body scroll while open,
 * closes on Escape / backdrop click, and moves focus to the panel on open
 * (restoring it to the previously-focused element on close).
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    isOpen,
    onClose,
    children,
    title,
    size = 'md',
    closeOnBackdrop = true,
    closeOnEsc = true,
    showClose = true,
    className,
    ...rest
  },
  ref,
) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Merge the forwarded ref with our internal panel ref.
  const setPanelRef = useCallback(
    (node: HTMLDivElement | null) => {
      panelRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [ref],
  );

  // Prevent the page behind the modal from scrolling while it is open.
  useScrollLock(isOpen);

  // Close on Escape — listener only attached while open.
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  // Move focus into the panel on open; restore it to the opener on close.
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused =
      typeof document !== 'undefined'
        ? (document.activeElement as HTMLElement | null)
        : null;
    panelRef.current?.focus();
    return () => {
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose();
    }
  };

  const hasHeader = title != null || showClose;

  return (
    <Portal>
      <div className="gl-modal__backdrop" onClick={handleBackdropClick}>
        <div
          ref={setPanelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title != null ? titleId : undefined}
          tabIndex={-1}
          className={cn(
            'gl-modal__panel',
            `gl-modal__panel--${size}`,
            'gl-focusable',
            className,
          )}
          {...rest}
        >
          {hasHeader ? (
            <header className="gl-modal__header">
              {title != null ? (
                <h2 id={titleId} className="gl-modal__title">
                  {title}
                </h2>
              ) : null}
              {showClose ? (
                <button
                  type="button"
                  className="gl-modal__close gl-focusable"
                  aria-label="Close"
                  onClick={onClose}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="1em"
                    height="1em"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              ) : null}
            </header>
          ) : null}
          {children}
        </div>
      </div>
    </Portal>
  );
});

/** Props for {@link ModalHeader}. Accepts all native `<div>` attributes. */
export type ModalHeaderProps = HTMLAttributes<HTMLDivElement>;

/** Optional custom header section for use inside a Modal panel. */
export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  function ModalHeader({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn('gl-modal__header', className)} {...rest}>
        {children}
      </div>
    );
  },
);

/** Props for {@link ModalBody}. Accepts all native `<div>` attributes. */
export type ModalBodyProps = HTMLAttributes<HTMLDivElement>;

/** Scrollable main content section for use inside a Modal panel. */
export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  function ModalBody({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn('gl-modal__body', className)} {...rest}>
        {children}
      </div>
    );
  },
);

/** Props for {@link ModalFooter}. Accepts all native `<div>` attributes. */
export type ModalFooterProps = HTMLAttributes<HTMLDivElement>;

/** Footer section (typically actions) for use inside a Modal panel. */
export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  function ModalFooter({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn('gl-modal__footer', className)} {...rest}>
        {children}
      </div>
    );
  },
);
