import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useMemo,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../hooks';

/** Layout direction for the radios inside a {@link RadioGroup}. */
export type RadioGroupOrientation = 'vertical' | 'horizontal';

/** Value shared through {@link RadioGroupContext} to every descendant {@link Radio}. */
export interface RadioGroupContextValue {
  /** The `name` applied to every radio input so the browser treats them as one group. */
  name: string;
  /** The currently selected value, or an empty string when nothing is selected yet. */
  value: string | undefined;
  /** Select the radio identified by `value`. */
  setValue: (value: string) => void;
}

/**
 * Context published by {@link RadioGroup}. Consumed internally by {@link Radio};
 * exported for advanced compositions that need to read or drive the selection.
 */
export const RadioGroupContext = createContext<RadioGroupContextValue | null>(
  null,
);

function useRadioGroupContext(component: string): RadioGroupContextValue {
  const ctx = useContext(RadioGroupContext);
  if (ctx === null) {
    throw new Error(
      `Glasswind: <${component}> must be rendered inside a <RadioGroup>.`,
    );
  }
  return ctx;
}

export interface RadioGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Controlled selected value. Provide together with `onChange`. */
  value?: string;
  /** Initial selected value when the group is uncontrolled. */
  defaultValue?: string;
  /** Fired with the newly selected value whenever the selection changes. */
  onChange?: (value: string) => void;
  /** Shared `name` for every radio input; auto-generated when omitted. */
  name?: string;
  /** Direction the radios are laid out. @default 'vertical' */
  orientation?: RadioGroupOrientation;
  /** The `<Radio>` children that make up the group. */
  children?: ReactNode;
}

/**
 * RadioGroup — owns the selected value and shares it with its {@link Radio}
 * children through context. Works controlled (`value` + `onChange`) or
 * uncontrolled (`defaultValue`). Native radio semantics give arrow-key
 * navigation between options for free.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(
    {
      value,
      defaultValue,
      onChange,
      name,
      orientation = 'vertical',
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const fallbackName = useId();
    const [selected, setSelected] = useControllableState<string>({
      value,
      defaultValue: defaultValue ?? '',
      onChange,
    });

    const ctx = useMemo<RadioGroupContextValue>(
      () => ({
        name: name ?? fallbackName,
        value: selected,
        setValue: setSelected,
      }),
      [name, fallbackName, selected, setSelected],
    );

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-orientation={orientation}
        className={cn(
          'gl-radio-group',
          `gl-radio-group--${orientation}`,
          className,
        )}
        {...rest}
      >
        <RadioGroupContext.Provider value={ctx}>
          {children}
        </RadioGroupContext.Provider>
      </div>
    );
  },
);

export interface RadioProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'type' | 'onChange' | 'checked' | 'defaultChecked' | 'name'
  > {
  /** The value this radio contributes; selected when it equals the group value. */
  value: string;
  /** Content rendered beside the control as the visible, clickable label. */
  label?: ReactNode;
  /** Prevent selection and mute the control. @default false */
  disabled?: boolean;
}

/**
 * Radio — a single frosted-glass option within a {@link RadioGroup}. Reads the
 * shared selection from context and renders a visually hidden native
 * `input[type="radio"]` (keeping full keyboard + form semantics) alongside a
 * glass dot whose inner primary mark scales in when selected.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, label, disabled = false, className, ...rest },
  ref,
) {
  const ctx = useRadioGroupContext('Radio');
  const checked = ctx.value === value;

  return (
    <label
      className={cn(
        'gl-radio',
        checked && 'gl-radio--checked',
        disabled && 'gl-radio--disabled',
        className,
      )}
    >
      <input
        ref={ref}
        type="radio"
        className="gl-sr-only gl-radio__input"
        name={ctx.name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => ctx.setValue(value)}
        {...rest}
      />
      <span className="gl-radio__dot" aria-hidden="true">
        <span className="gl-radio__mark" />
      </span>
      {label != null ? <span className="gl-radio__label">{label}</span> : null}
    </label>
  );
});
