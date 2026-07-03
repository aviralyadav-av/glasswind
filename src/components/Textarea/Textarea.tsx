import {
  forwardRef,
  useCallback,
  useRef,
  type ChangeEvent,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '../../utils/cn';
import { useIsomorphicLayoutEffect } from '../../hooks';

export type TextareaVariant = 'glass' | 'subtle';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visual surface style. @default 'subtle' */
  variant?: TextareaVariant;
  /** Render the invalid state (danger border + `aria-invalid`). */
  error?: boolean;
  /** Stretch the field to fill the container width. */
  fullWidth?: boolean;
  /** Grow the field height to fit its content as the value changes (SSR-safe). */
  autoResize?: boolean;
}

/**
 * Textarea — a multi-line text field on a frosted-glass surface.
 * The focus ring follows `:focus-within` on the wrapper, an error state is
 * supported, and the field can optionally auto-grow to fit its content. The
 * forwarded ref is merged with an internal ref so auto-resize works even when
 * the consumer also needs a handle on the underlying element.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      variant = 'subtle',
      error = false,
      fullWidth = false,
      autoResize = false,
      className,
      onChange,
      value,
      defaultValue,
      rows,
      disabled,
      ...rest
    },
    ref,
  ) {
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    // Merge the forwarded ref with our internal ref so both the consumer and
    // the auto-resize effect can reach the same DOM node.
    const setRef = useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const resize = useCallback(() => {
      const el = innerRef.current;
      if (!el) return;
      if (!autoResize) {
        // Hand height control back to CSS when auto-resize is disabled.
        el.style.height = '';
        return;
      }
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }, [autoResize]);

    // Runs after paint on the client; degrades to a no-op effect on the server.
    useIsomorphicLayoutEffect(() => {
      resize();
    }, [resize, value, defaultValue, rows]);

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (autoResize) resize();
        onChange?.(event);
      },
      [autoResize, resize, onChange],
    );

    return (
      <div
        className={cn(
          'gl-textarea',
          `gl-textarea--${variant}`,
          fullWidth && 'gl-textarea--full',
          error && 'gl-textarea--error',
          autoResize && 'gl-textarea--auto',
          disabled && 'gl-textarea--disabled',
          className,
        )}
      >
        <textarea
          ref={setRef}
          className="gl-textarea__field"
          value={value}
          defaultValue={defaultValue}
          rows={rows}
          disabled={disabled}
          aria-invalid={error || undefined}
          onChange={handleChange}
          {...rest}
        />
      </div>
    );
  },
);
