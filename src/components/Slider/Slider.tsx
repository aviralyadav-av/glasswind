import {
  forwardRef,
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
} from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../hooks';

export interface SliderProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'size' | 'value' | 'defaultValue' | 'onChange'
  > {
  /** Lowest selectable value. @default 0 */
  min?: number;
  /** Highest selectable value. @default 100 */
  max?: number;
  /** Granularity the value snaps to. @default 1 */
  step?: number;
  /** Controlled value. Provide together with `onChange`. */
  value?: number;
  /** Initial value when uncontrolled. Falls back to `min`. */
  defaultValue?: number;
  /** Fires with the new numeric value whenever the user drags or keys. */
  onChange?: (value: number) => void;
  /** Render a floating glass bubble with the live value above the thumb. @default false */
  showValue?: boolean;
}

/**
 * Slider — a styled range input on a frosted-glass track.
 * The filled portion is driven by the `--gl-slider-fill` custom property so the
 * gradient track and optional value bubble stay in sync with the thumb.
 * Works controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    min = 0,
    max = 100,
    step = 1,
    value,
    defaultValue,
    onChange,
    showValue = false,
    className,
    style,
    disabled,
    ...rest
  },
  ref,
) {
  const [current, setValue] = useControllableState<number>({
    value,
    defaultValue: defaultValue ?? min,
    onChange,
  });

  const range = max - min;
  const clamped = Math.min(max, Math.max(min, current));
  const fillPct = range > 0 ? ((clamped - min) / range) * 100 : 0;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.valueAsNumber;
    setValue(Number.isNaN(next) ? min : next);
  };

  const wrapperStyle = {
    ...style,
    '--gl-slider-fill': `${fillPct}%`,
  } as CSSProperties;

  return (
    <span
      className={cn(
        'gl-slider',
        showValue && 'gl-slider--show-value',
        disabled && 'gl-slider--disabled',
        className,
      )}
      style={wrapperStyle}
    >
      <input
        ref={ref}
        type="range"
        className="gl-slider__input"
        min={min}
        max={max}
        step={step}
        value={clamped}
        disabled={disabled}
        onChange={handleChange}
        {...rest}
      />
      {showValue ? (
        <span className="gl-slider__value" aria-hidden="true">
          {current}
        </span>
      ) : null}
    </span>
  );
});
