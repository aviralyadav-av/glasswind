import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Diameter preset controlling width/height. @default 'md' */
  size?: SpinnerSize;
  /** Accessible, visually-hidden status text announced to screen readers. @default 'Loading' */
  label?: string;
  /** Ring border width in pixels. Falls back to a size-derived default when omitted. */
  thickness?: number;
}

/**
 * Spinner — a compact loading indicator.
 * Renders a frosted-friendly circular ring that rotates via the shared
 * `gl-spin` keyframe. Color follows `currentColor`, so it inherits the
 * surrounding text color. Exposes `role="status"` with a visually-hidden
 * label so assistive tech announces the loading state.
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', label = 'Loading', thickness, className, style, ...rest },
  ref,
) {
  const styleWithThickness =
    thickness != null
      ? ({ ...style, '--gl-spinner-bw': `${thickness}px` } as CSSProperties)
      : style;

  return (
    <span
      ref={ref}
      role="status"
      aria-live="polite"
      className={cn('gl-spinner', `gl-spinner--${size}`, className)}
      style={styleWithThickness}
      {...rest}
    >
      <span className="gl-spinner__ring" aria-hidden="true" />
      <span className="gl-sr-only">{label}</span>
    </span>
  );
});
