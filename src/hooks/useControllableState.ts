import { useCallback, useRef, useState } from 'react';

/**
 * Supports both controlled and uncontrolled usage of a value.
 * If `value` is provided, the component is controlled; otherwise it manages
 * its own state seeded by `defaultValue`. Used by Tabs, Accordion, Switch…
 */
export function useControllableState<T>(params: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}): [T, (next: T) => void] {
  const { value, defaultValue, onChange } = params;
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<T>(defaultValue);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const current = isControlled ? (value as T) : internal;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChangeRef.current?.(next);
    },
    [isControlled],
  );

  return [current, setValue];
}
