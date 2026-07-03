import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useReducer,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type MutableRefObject,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';
import { useControllableState, useIsomorphicLayoutEffect } from '../../hooks';

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface TabsContextValue {
  /** Stable prefix (from useId) that namespaces every tab/panel id. */
  baseId: string;
  /** Currently selected tab value, or undefined when nothing is selected. */
  activeValue: string | undefined;
  /** Select a tab by value (no-op when it is already active). */
  setActiveValue: (value: string) => void;
  /** The single tab that participates in the page tab order (roving focus). */
  focusableValue: string | undefined;
  /** Record a tab's value in DOM order (called on mount). */
  registerTab: (value: string) => void;
  /** Drop a tab's value from the registry (called on unmount). */
  unregisterTab: (value: string) => void;
  /** Keep a registered tab's disabled state in sync. */
  setTabDisabled: (value: string, disabled: boolean) => void;
  /** Deterministic id for a tab element. */
  getTabId: (value: string) => string;
  /** Deterministic id for a panel element. */
  getPanelId: (value: string) => string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside <Tabs>.`);
  }
  return ctx;
}

const idSafe = (value: string): string => value.replace(/\s+/g, '-');

/* ------------------------------------------------------------------ */
/*  Tabs (root / context provider)                                     */
/* ------------------------------------------------------------------ */

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Controlled active tab value. Provide together with `onChange`. */
  value?: string;
  /** Initial active tab value when uncontrolled. */
  defaultValue?: string;
  /** Fired with the newly selected tab value whenever the selection changes. */
  onChange?: (value: string) => void;
  /** `TabList` and `TabPanel` descendants. */
  children?: ReactNode;
}

/**
 * Tabs — accessible, compound tab set built on React context.
 * Wrap a `TabList` (with `Tab` children) and matching `TabPanel`s.
 * Works controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { value, defaultValue, onChange, className, children, ...rest },
  ref,
) {
  const baseId = useId();

  const [activeValue, setControllableValue] = useControllableState<
    string | undefined
  >({
    value,
    defaultValue,
    onChange: onChange
      ? (next) => {
          if (next !== undefined) onChange(next);
        }
      : undefined,
  });

  // Ordered registry of tab values + their disabled state. Kept in refs so
  // registration never re-triggers the effects that own it; `bump` forces a
  // render when the derived focusable tab could have changed.
  const orderRef = useRef<string[]>([]);
  const disabledRef = useRef<Map<string, boolean>>(new Map());
  const [, bump] = useReducer((n: number) => n + 1, 0);

  const registerTab = useCallback((v: string) => {
    if (orderRef.current.includes(v)) return;
    orderRef.current = [...orderRef.current, v];
    if (!disabledRef.current.has(v)) disabledRef.current.set(v, false);
    bump();
  }, []);

  const unregisterTab = useCallback((v: string) => {
    if (!orderRef.current.includes(v)) return;
    orderRef.current = orderRef.current.filter((x) => x !== v);
    disabledRef.current.delete(v);
    bump();
  }, []);

  const setTabDisabled = useCallback((v: string, disabled: boolean) => {
    if (disabledRef.current.get(v) === disabled) return;
    disabledRef.current.set(v, disabled);
    bump();
  }, []);

  const activeValueRef = useRef(activeValue);
  activeValueRef.current = activeValue;
  const setActiveValue = useCallback(
    (v: string) => {
      if (activeValueRef.current === v) return;
      setControllableValue(v);
    },
    [setControllableValue],
  );

  const getTabId = useCallback(
    (v: string) => `${baseId}-tab-${idSafe(v)}`,
    [baseId],
  );
  const getPanelId = useCallback(
    (v: string) => `${baseId}-panel-${idSafe(v)}`,
    [baseId],
  );

  // Exactly one tab is a tab-stop: the active one when it is enabled,
  // otherwise the first enabled tab in DOM order.
  const order = orderRef.current;
  const disabledMap = disabledRef.current;
  const activeIsFocusable =
    activeValue !== undefined &&
    order.includes(activeValue) &&
    !disabledMap.get(activeValue);
  const focusableValue = activeIsFocusable
    ? activeValue
    : order.find((v) => !disabledMap.get(v));

  const ctx = useMemo<TabsContextValue>(
    () => ({
      baseId,
      activeValue,
      setActiveValue,
      focusableValue,
      registerTab,
      unregisterTab,
      setTabDisabled,
      getTabId,
      getPanelId,
    }),
    [
      baseId,
      activeValue,
      setActiveValue,
      focusableValue,
      registerTab,
      unregisterTab,
      setTabDisabled,
      getTabId,
      getPanelId,
    ],
  );

  return (
    <TabsContext.Provider value={ctx}>
      <div ref={ref} className={cn('gl-tabs', className)} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});

/* ------------------------------------------------------------------ */
/*  TabList                                                            */
/* ------------------------------------------------------------------ */

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  /** `Tab` children rendered inside the glass pill. */
  children?: ReactNode;
}

/**
 * TabList — the `role="tablist"` container.
 * Renders a frosted glass pill and provides Arrow Left/Right (plus Home/End)
 * roving focus between the enabled tabs, activating each as focus lands on it.
 */
export const TabList = forwardRef<HTMLDivElement, TabListProps>(function TabList(
  { className, children, onKeyDown, ...rest },
  ref,
) {
  const { setActiveValue } = useTabsContext('TabList');
  const listRef = useRef<HTMLDivElement | null>(null);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const nav = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!nav.includes(event.key)) return;

    const list = listRef.current;
    if (!list) return;

    const tabs = Array.from(
      list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'),
    );
    if (tabs.length === 0) return;

    const currentIndex = tabs.findIndex((t) => t === document.activeElement);
    let nextIndex: number;
    switch (event.key) {
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      case 'ArrowRight':
        nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % tabs.length;
        break;
      default:
        nextIndex =
          currentIndex < 0
            ? tabs.length - 1
            : (currentIndex - 1 + tabs.length) % tabs.length;
    }

    const next = tabs[nextIndex];
    event.preventDefault();
    next.focus();
    const nextValue = next.getAttribute('data-value');
    if (nextValue !== null) setActiveValue(nextValue);
  };

  return (
    <div
      ref={setRefs}
      role="tablist"
      aria-orientation="horizontal"
      className={cn('gl-tabs__list', className)}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Tab                                                                */
/* ------------------------------------------------------------------ */

export interface TabProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** Unique value that links this tab to its `TabPanel`. */
  value: string;
  /** Disable selection and remove the tab from keyboard navigation. */
  disabled?: boolean;
  /** Label content for the tab. */
  children?: ReactNode;
}

/**
 * Tab — a single selectable `role="tab"` control.
 * Reflects selection via `aria-selected`, owns roving `tabIndex`, and points
 * at its panel through `aria-controls`. Renders as a native button so
 * Enter/Space activation and disabled handling come for free.
 */
export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { value, disabled = false, className, children, onClick, type = 'button', ...rest },
  ref,
) {
  const ctx = useTabsContext('Tab');
  const { registerTab, unregisterTab, setTabDisabled, setActiveValue } = ctx;
  const selected = ctx.activeValue === value;
  const focusable = ctx.focusableValue === value;

  useIsomorphicLayoutEffect(() => {
    registerTab(value);
    return () => unregisterTab(value);
  }, [registerTab, unregisterTab, value]);

  useIsomorphicLayoutEffect(() => {
    setTabDisabled(value, disabled);
  }, [setTabDisabled, value, disabled]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    setActiveValue(value);
  };

  return (
    <button
      ref={ref}
      type={type}
      role="tab"
      id={ctx.getTabId(value)}
      data-value={value}
      aria-selected={selected}
      aria-controls={ctx.getPanelId(value)}
      tabIndex={focusable ? 0 : -1}
      disabled={disabled}
      className={cn(
        'gl-tabs__tab',
        selected && 'gl-tabs__tab--active',
        'gl-focusable',
        className,
      )}
      onClick={handleClick}
      {...rest}
    >
      <span className="gl-tabs__tab-label">{children}</span>
    </button>
  );
});

/* ------------------------------------------------------------------ */
/*  TabPanel                                                           */
/* ------------------------------------------------------------------ */

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Value that links this panel to its `Tab`. */
  value: string;
  /** Panel content, shown only while this tab is active. */
  children?: ReactNode;
}

/**
 * TabPanel — the `role="tabpanel"` region for a tab's content.
 * Labelled by its tab, hidden unless active, and animated in on reveal.
 */
export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(
  { value, className, children, ...rest },
  ref,
) {
  const ctx = useTabsContext('TabPanel');
  const selected = ctx.activeValue === value;

  return (
    <div
      ref={ref}
      role="tabpanel"
      id={ctx.getPanelId(value)}
      aria-labelledby={ctx.getTabId(value)}
      hidden={!selected}
      tabIndex={0}
      className={cn('gl-tabs__panel', className)}
      {...rest}
    >
      {children}
    </div>
  );
});
