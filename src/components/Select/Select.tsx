import {
  forwardRef,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';
import { cn } from '../../utils/cn';

/** A single choice rendered as an `<option>` inside the Select. */
export interface SelectOption {
  /** Human-readable text shown for this option. */
  label: string;
  /** Value reported/submitted when this option is chosen. */
  value: string | number;
  /** Prevent this option from being selectable. @default false */
  disabled?: boolean;
}

/** Control height, padding and font scale of the Select. */
export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Options to render as `<option>`s. Omit to supply your own `children` instead. */
  options?: SelectOption[];
  /** Non-selectable prompt shown before a value is chosen. */
  placeholder?: string;
  /** Control height/padding/font scale. @default 'md' */
  selectSize?: SelectSize;
  /** Render the invalid/danger styling and set `aria-invalid`. @default false */
  error?: boolean;
  /** Stretch the control to fill its container width. @default false */
  fullWidth?: boolean;
  /** Custom `<option>` markup. Ignored when `options` is provided. */
  children?: ReactNode;
}

/**
 * Select — a styled, fully accessible wrapper around the native `<select>`.
 *
 * Keeps the reliability and built-in keyboard/screen-reader support of the
 * platform control while hiding the native arrow and presenting a frosted-glass
 * surface with a custom chevron, focus-within ring and error state.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    options,
    placeholder,
    selectSize = 'md',
    error = false,
    fullWidth = false,
    className,
    children,
    disabled,
    value,
    defaultValue,
    'aria-invalid': ariaInvalid,
    ...rest
  },
  ref,
) {
  const isControlled = value !== undefined;
  // When left uncontrolled with a placeholder, default the selection to the
  // empty placeholder option so the prompt shows until the user picks a value.
  const resolvedDefaultValue =
    !isControlled && defaultValue === undefined && placeholder != null
      ? ''
      : defaultValue;

  const selectionProps = isControlled
    ? { value }
    : { defaultValue: resolvedDefaultValue };

  return (
    <span
      className={cn(
        'gl-select',
        `gl-select--${selectSize}`,
        error && 'gl-select--error',
        fullWidth && 'gl-select--block',
        disabled && 'gl-select--disabled',
        className,
      )}
    >
      <select
        ref={ref}
        className="gl-select__field"
        disabled={disabled}
        aria-invalid={ariaInvalid ?? (error || undefined)}
        {...selectionProps}
        {...rest}
      >
        {placeholder != null ? (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        ) : null}
        {options
          ? options.map((opt) => (
              <option
                key={String(opt.value)}
                value={opt.value}
                disabled={opt.disabled}
              >
                {opt.label}
              </option>
            ))
          : children}
      </select>
      <span className="gl-select__chevron" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="1em"
          height="1em"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </span>
  );
});
