import {
  forwardRef,
  useCallback,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';
import { useIsomorphicLayoutEffect } from '../../hooks';

/** Box dimension preset for the checkbox control. */
export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Text/label rendered next to the box. Omit for a standalone control (pass `aria-label`). */
  label?: ReactNode;
  /** Show the tri-state "mixed" dash. Drives the native `indeterminate` DOM property. */
  indeterminate?: boolean;
  /** Paint the control in the danger color to signal a validation error. */
  error?: boolean;
  /** Size of the check box. @default 'md' */
  boxSize?: CheckboxSize;
}

/**
 * Checkbox — a custom-styled, fully accessible checkbox.
 * Wraps a visually hidden native `input[type=checkbox]` so keyboard,
 * form submission, and screen-reader semantics are preserved while a
 * frosted-glass box renders the check/indeterminate state.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      indeterminate = false,
      error = false,
      boxSize = 'md',
      className,
      disabled,
      ...rest
    },
    ref,
  ) {
    const innerRef = useRef<HTMLInputElement | null>(null);

    // Merge the forwarded ref with our internal ref so we can drive the
    // native `indeterminate` property (which has no HTML attribute).
    const setRef = useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    useIsomorphicLayoutEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <label
        className={cn(
          'gl-checkbox',
          `gl-checkbox--${boxSize}`,
          error && 'gl-checkbox--error',
          disabled && 'gl-checkbox--disabled',
          className,
        )}
      >
        <input
          ref={setRef}
          type="checkbox"
          className="gl-sr-only gl-checkbox__input"
          disabled={disabled}
          aria-invalid={error || undefined}
          {...rest}
        />
        <span className="gl-checkbox__box" aria-hidden="true">
          <svg
            className="gl-checkbox__check"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.5 8.5L6.5 11.5L12.5 4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="gl-checkbox__dash" />
        </span>
        {label != null ? (
          <span className="gl-checkbox__label">{label}</span>
        ) : null}
      </label>
    );
  },
);
