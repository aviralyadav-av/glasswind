import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type ButtonVariant =
  | 'glass'
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default 'glass' */
  variant?: ButtonVariant;
  /** Control height/padding. @default 'md' */
  size?: ButtonSize;
  /** Show a spinner and disable interaction. */
  loading?: boolean;
  /** Icon rendered before the label. */
  leftIcon?: ReactNode;
  /** Icon rendered after the label. */
  rightIcon?: ReactNode;
  /** Stretch to fill the container width. */
  fullWidth?: boolean;
}

/**
 * Button — the primary action element.
 * Frosted-glass surface with a GPU-accelerated hover lift and press feedback.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'glass',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    children,
    disabled,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'gl-btn',
        `gl-btn--${variant}`,
        `gl-btn--${size}`,
        fullWidth && 'gl-btn--block',
        loading && 'gl-btn--loading',
        'gl-focusable',
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="gl-btn__spinner" aria-hidden="true" />}
      {!loading && leftIcon ? (
        <span className="gl-btn__icon" aria-hidden="true">
          {leftIcon}
        </span>
      ) : null}
      {children != null ? <span className="gl-btn__label">{children}</span> : null}
      {!loading && rightIcon ? (
        <span className="gl-btn__icon" aria-hidden="true">
          {rightIcon}
        </span>
      ) : null}
    </button>
  );
});
