import { forwardRef, type HTMLAttributes, type CSSProperties } from 'react';
import { cn } from '../../utils/cn';

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressColor =
  | 'primary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Current progress, clamped to the range 0..max. Ignored when `indeterminate`. @default 0 */
  value?: number;
  /** Upper bound of the progress range. @default 100 */
  max?: number;
  /** Loop an animated partial bar for work of unknown duration. @default false */
  indeterminate?: boolean;
  /** Thickness of the track/fill. @default 'md' */
  barSize?: ProgressSize;
  /** Fill accent color. @default 'primary' */
  color?: ProgressColor;
  /** Render a live percentage label beside the track (determinate only). @default false */
  showLabel?: boolean;
}

/**
 * Progress — a linear glass progress bar.
 *
 * Determinate mode reveals the fill with a GPU-friendly `scaleX` transform driven
 * by an inline `--gl-progress-value` custom property (value / max), so updates
 * animate smoothly without touching layout. Indeterminate mode loops a partial bar
 * for work of unknown length. Exposes the `progressbar` role with matching
 * `aria-value*` attributes (`aria-valuenow` is omitted while indeterminate).
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    value = 0,
    max = 100,
    indeterminate = false,
    barSize = 'md',
    color = 'primary',
    showLabel = false,
    className,
    ...rest
  },
  ref,
) {
  const safeMax = max > 0 ? max : 100;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const ratio = clamped / safeMax;
  const percent = Math.round(ratio * 100);

  const barStyle = indeterminate
    ? undefined
    : ({ '--gl-progress-value': ratio } as CSSProperties);

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={indeterminate ? undefined : clamped}
      aria-valuetext={indeterminate ? undefined : `${percent}%`}
      className={cn(
        'gl-progress',
        `gl-progress--${barSize}`,
        `gl-progress--${color}`,
        className,
      )}
      {...rest}
    >
      <div className="gl-progress__track">
        <div
          className={cn(
            'gl-progress__bar',
            indeterminate && 'gl-progress__bar--indeterminate',
          )}
          style={barStyle}
        />
      </div>
      {showLabel && !indeterminate ? (
        <span className="gl-progress__label">{percent}%</span>
      ) : null}
    </div>
  );
});
