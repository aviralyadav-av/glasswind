import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export type BadgeVariant =
  | 'glass'
  | 'primary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual style. @default 'glass' */
  variant?: BadgeVariant;
  /** Text/padding scale. @default 'md' */
  size?: BadgeSize;
  /** Render a small leading colored dot before the label. @default false */
  dot?: boolean;
  /** Fully-rounded (radius-full) shape. @default true */
  pill?: boolean;
}

/**
 * Badge — a compact inline label for status, counts, or metadata.
 * Colored variants use the soft token backgrounds with the solid accent as
 * text; the default `glass` variant uses the frosted-glass surface.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    variant = 'glass',
    size = 'md',
    dot = false,
    pill = true,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        'gl-badge',
        `gl-badge--${variant}`,
        `gl-badge--${size}`,
        pill && 'gl-badge--pill',
        className,
      )}
      {...rest}
    >
      {dot ? <span className="gl-badge__dot" aria-hidden="true" /> : null}
      {children != null ? (
        <span className="gl-badge__label">{children}</span>
      ) : null}
    </span>
  );
});
