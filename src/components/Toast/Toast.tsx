import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';
import { Portal } from '../Portal';

/** Accent style of a toast. */
export type ToastVariant = 'glass' | 'success' | 'danger' | 'warning' | 'info';

/** Corner the toast stack anchors to. */
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

/** Configuration passed to `toast(options)`. */
export interface ToastOptions {
  /** Bold headline line. */
  title?: ReactNode;
  /** Secondary muted line under the title. */
  description?: ReactNode;
  /** Accent color. @default 'glass' */
  variant?: ToastVariant;
  /** Auto-dismiss delay in ms; pass `0` (or `Infinity`) to keep it sticky. @default 4000 */
  duration?: number;
}

/** Options accepted by the `success` / `error` / `info` / `warning` shortcuts (title + variant are fixed by the shortcut). */
export type ToastShortcutOptions = Omit<ToastOptions, 'title' | 'variant'>;

/** Value returned by {@link useToast}. */
export interface ToastContextValue {
  /** Push a toast and get back its id for manual dismissal. */
  toast: (options: ToastOptions) => string;
  /** Remove a toast by id. */
  dismiss: (id: string) => void;
  /** Shortcut for a success (green) toast. */
  success: (title: ReactNode, options?: ToastShortcutOptions) => string;
  /** Shortcut for an error (danger/red) toast. */
  error: (title: ReactNode, options?: ToastShortcutOptions) => string;
  /** Shortcut for an info (blue) toast. */
  info: (title: ReactNode, options?: ToastShortcutOptions) => string;
  /** Shortcut for a warning (amber) toast. */
  warning: (title: ReactNode, options?: ToastShortcutOptions) => string;
}

/** Props for {@link ToastProvider}. */
export interface ToastProviderProps {
  /** App subtree that can trigger toasts via {@link useToast}. */
  children: ReactNode;
  /** Corner the toast stack anchors to. @default 'bottom-right' */
  position?: ToastPosition;
}

/** Default auto-dismiss delay in milliseconds. */
const DEFAULT_DURATION = 4000;

/** Internal, fully-resolved toast record kept in provider state. */
interface ToastRecord {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  variant: ToastVariant;
  duration: number;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastItemProps {
  toast: ToastRecord;
  onDismiss: (id: string) => void;
}

/**
 * A single rendered toast. Owns its own auto-dismiss timer, which pauses while
 * the pointer hovers or keyboard focus is inside so users get time to read/act,
 * and is always cleared on unmount.
 */
function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { id, title, description, variant, duration } = toast;
  const autoDismiss = duration > 0 && Number.isFinite(duration);

  const timerRef = useRef<number | null>(null);
  const remainingRef = useRef(duration);
  const startedRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resumeTimer = useCallback(() => {
    if (!autoDismiss || timerRef.current !== null) return;
    startedRef.current = performance.now();
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      onDismiss(id);
    }, remainingRef.current);
  }, [autoDismiss, id, onDismiss]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current === null) return;
    clearTimer();
    remainingRef.current = Math.max(
      0,
      remainingRef.current - (performance.now() - startedRef.current),
    );
  }, [clearTimer]);

  useEffect(() => {
    remainingRef.current = duration;
    resumeTimer();
    return clearTimer;
  }, [duration, resumeTimer, clearTimer]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onDismiss(id);
    }
  };

  return (
    <div
      className={cn('gl-toast', `gl-toast--${variant}`)}
      role="status"
      aria-atomic="true"
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      onFocus={pauseTimer}
      onBlur={resumeTimer}
      onKeyDown={handleKeyDown}
    >
      <span className="gl-toast__accent" aria-hidden="true" />
      <div className="gl-toast__body">
        {title != null ? <div className="gl-toast__title">{title}</div> : null}
        {description != null ? (
          <div className="gl-toast__description">{description}</div>
        ) : null}
      </div>
      <button
        type="button"
        className="gl-toast__close gl-focusable"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(id)}
      >
        <svg
          className="gl-toast__close-icon"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

/**
 * ToastProvider — holds the live toast queue and renders the fixed viewport.
 * Wrap your app (or any subtree) in it, then call {@link useToast} to push
 * notifications. The viewport is portalled to `document.body` so toasts float
 * above every other layer regardless of where the trigger lives.
 */
export function ToastProvider({
  children,
  position = 'bottom-right',
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const baseId = useId();
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = `${baseId}${counterRef.current++}`;
      setToasts((prev) => [
        ...prev,
        {
          id,
          title: options.title,
          description: options.description,
          variant: options.variant ?? 'glass',
          duration: options.duration ?? DEFAULT_DURATION,
        },
      ]);
      return id;
    },
    [baseId],
  );

  const success = useCallback(
    (title: ReactNode, options?: ToastShortcutOptions) =>
      toast({ ...options, title, variant: 'success' }),
    [toast],
  );
  const error = useCallback(
    (title: ReactNode, options?: ToastShortcutOptions) =>
      toast({ ...options, title, variant: 'danger' }),
    [toast],
  );
  const info = useCallback(
    (title: ReactNode, options?: ToastShortcutOptions) =>
      toast({ ...options, title, variant: 'info' }),
    [toast],
  );
  const warning = useCallback(
    (title: ReactNode, options?: ToastShortcutOptions) =>
      toast({ ...options, title, variant: 'warning' }),
    [toast],
  );

  const value = useMemo<ToastContextValue>(
    () => ({ toast, dismiss, success, error, info, warning }),
    [toast, dismiss, success, error, info, warning],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Portal>
        <div
          className={cn('gl-toast-viewport', `gl-toast-viewport--${position}`)}
          role="region"
          aria-label="Notifications"
        >
          {toasts.map((item) => (
            <ToastItem key={item.id} toast={item} onDismiss={dismiss} />
          ))}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
}

/**
 * useToast — access the toast API from anywhere inside a {@link ToastProvider}.
 * Throws a descriptive error when called outside a provider.
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (ctx === null) {
    throw new Error(
      'useToast must be used within a <ToastProvider>. Wrap your app (or the subtree that shows toasts) in <ToastProvider>.',
    );
  }
  return ctx;
}
