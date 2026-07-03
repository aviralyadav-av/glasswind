import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type InputVariant = 'glass' | 'subtle';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visual surface treatment. @default 'subtle' */
  variant?: InputVariant;
  /** Control height/padding preset. @default 'md' */
  inputSize?: InputSize;
  /** Render the invalid state (danger border + `aria-invalid`). */
  error?: boolean;
  /** Adornment rendered before the field (e.g. a search icon). */
  leftIcon?: ReactNode;
  /** Adornment rendered after the field (e.g. a clear button). */
  rightIcon?: ReactNode;
  /** Stretch the field to fill the container width. */
  fullWidth?: boolean;
}

/**
 * Input — a single-line text field on a frosted-glass surface.
 * The wrapper lifts its focus ring via `:focus-within` so clicking either the
 * field or its icons keeps the whole control highlighted.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    variant = 'subtle',
    inputSize = 'md',
    error = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    disabled,
    'aria-invalid': ariaInvalid,
    ...rest
  },
  ref,
) {
  return (
    <span
      className={cn(
        'gl-input',
        `gl-input--${variant}`,
        `gl-input--${inputSize}`,
        error && 'gl-input--error',
        fullWidth && 'gl-input--block',
        disabled && 'gl-input--disabled',
        className,
      )}
    >
      {leftIcon != null ? (
        <span className="gl-input__icon gl-input__icon--left" aria-hidden="true">
          {leftIcon}
        </span>
      ) : null}
      <input
        ref={ref}
        className="gl-input__field"
        disabled={disabled}
        aria-invalid={ariaInvalid ?? (error || undefined)}
        {...rest}
      />
      {rightIcon != null ? (
        <span
          className="gl-input__icon gl-input__icon--right"
          aria-hidden="true"
        >
          {rightIcon}
        </span>
      ) : null}
    </span>
  );
});
