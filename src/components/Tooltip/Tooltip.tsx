import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'content'> {
  /** Floating content shown when the trigger is hovered or focused. */
  content: ReactNode;
  /** The trigger element the tooltip describes. */
  children: ReactNode;
  /** Side of the trigger the tooltip is anchored to. @default 'top' */
  placement?: TooltipPlacement;
  /** Delay in milliseconds before the tooltip appears. @default 200 */
  delay?: number;
  /** When true the tooltip never opens. @default false */
  disabled?: boolean;
}

/**
 * Tooltip — a small frosted-glass label that reveals descriptive text when the
 * trigger is hovered or keyboard-focused. It opens after a configurable delay,
 * closes instantly on leave/blur, and is fully SSR-safe (timeouts run only in
 * event handlers and effects).
 */
export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(
  {
    content,
    children,
    placement = 'top',
    delay = 200,
    disabled = false,
    className,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const show = useCallback(() => {
    if (disabled) return;
    clearTimer();
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setVisible(true);
    }, delay);
  }, [disabled, delay, clearTimer]);

  const hide = useCallback(() => {
    clearTimer();
    setVisible(false);
  }, [clearTimer]);

  // Never keep an open tooltip once it becomes disabled.
  useEffect(() => {
    if (disabled) {
      clearTimer();
      setVisible(false);
    }
  }, [disabled, clearTimer]);

  // Cancel any pending open timeout on unmount.
  useEffect(() => clearTimer, [clearTimer]);

  const handleMouseEnter = (event: MouseEvent<HTMLSpanElement>) => {
    show();
    onMouseEnter?.(event);
  };
  const handleMouseLeave = (event: MouseEvent<HTMLSpanElement>) => {
    hide();
    onMouseLeave?.(event);
  };
  const handleFocus = (event: FocusEvent<HTMLSpanElement>) => {
    show();
    onFocus?.(event);
  };
  const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
    hide();
    onBlur?.(event);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    // Per WAI-ARIA, a tooltip is dismissible with Escape while focus stays on
    // the trigger. Cancel any pending open timeout as well.
    if (event.key === 'Escape') {
      hide();
    }
    onKeyDown?.(event);
  };

  const open = visible && !disabled;

  return (
    <span
      ref={ref}
      className={cn('gl-tooltip-wrap', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      aria-describedby={open ? tooltipId : undefined}
      {...rest}
    >
      {children}
      {open ? (
        <span
          id={tooltipId}
          role="tooltip"
          className={cn('gl-tooltip', `gl-tooltip--${placement}`)}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
});
