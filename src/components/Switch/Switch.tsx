import {
  forwardRef,
  useId,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../hooks';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'onChange' | 'checked' | 'defaultChecked'
  > {
  /** Controlled checked state. Provide together with `onChange`; omit for uncontrolled usage. */
  checked?: boolean;
  /** Initial checked state when the switch is uncontrolled. @default false */
  defaultChecked?: boolean;
  /** Called with the next checked value each time the switch toggles. */
  onChange?: (checked: boolean) => void;
  /** Visible text rendered beside the track and used as the accessible name. */
  label?: ReactNode;
  /** Control the track and thumb dimensions. @default 'md' */
  switchSize?: SwitchSize;
  /** Disable interaction and dim the control. @default false */
  disabled?: boolean;
}

/**
 * Switch — an accessible on/off toggle with a frosted-glass track and a
 * spring-animated thumb. Renders a visually-hidden native checkbox (exposing
 * `role="switch"`) so keyboard, form, and screen-reader behaviour come for
 * free. Works in both controlled and uncontrolled modes.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked = false,
    onChange,
    label,
    switchSize = 'md',
    disabled = false,
    className,
    id,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;

  const [isChecked, setChecked] = useControllableState<boolean>({
    value: checked,
    defaultValue: defaultChecked,
    onChange,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setChecked(event.target.checked);
  };

  return (
    <label
      className={cn(
        'gl-switch',
        `gl-switch--${switchSize}`,
        isChecked && 'gl-switch--checked',
        disabled && 'gl-switch--disabled',
        className,
      )}
      htmlFor={inputId}
    >
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        role="switch"
        className="gl-switch__input gl-sr-only"
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
        {...rest}
      />
      <span className="gl-switch__track" aria-hidden="true">
        <span className="gl-switch__thumb" />
      </span>
      {label != null ? (
        <span className="gl-switch__label">{label}</span>
      ) : null}
    </label>
  );
});
