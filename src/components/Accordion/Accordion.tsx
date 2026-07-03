import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../hooks';

/** Whether one item can be open at a time (`single`) or many (`multiple`). */
export type AccordionType = 'single' | 'multiple';

/** Open-item value(s): a single item value, or a list of them for `multiple`. */
export type AccordionValue = string | string[];

/* ---- Internal context shared with every <AccordionItem> ---- */
interface AccordionContextValue {
  /** Selection mode of the parent accordion. */
  type: AccordionType;
  /** Returns whether the item with the given value is currently expanded. */
  isOpen: (itemValue: string) => boolean;
  /** Expands or collapses the item with the given value. */
  toggle: (itemValue: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext(): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (ctx === null) {
    throw new Error(
      'Glasswind: <AccordionItem> must be rendered inside an <Accordion>.',
    );
  }
  return ctx;
}

/** Normalize the controllable value into a flat list of open item values. */
function toOpenList(value: AccordionValue): string[] {
  if (Array.isArray(value)) return value;
  return value === '' ? [] : [value];
}

const NAV_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End'];

export interface AccordionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Whether only one item may be open (`single`) or several (`multiple`). @default 'single' */
  type?: AccordionType;
  /** Controlled open value(s). A string for `single`, an array for `multiple`. */
  value?: AccordionValue;
  /** Initial open value(s) when uncontrolled. */
  defaultValue?: AccordionValue;
  /** Fires with the next open value(s) whenever the open set changes. */
  onChange?: (value: AccordionValue) => void;
  /** In `single` mode, allow closing the open item by clicking it again. @default true */
  collapsible?: boolean;
  /** One or more `<AccordionItem>` children. */
  children?: ReactNode;
}

/**
 * Accordion — a stack of collapsible frosted-glass panels.
 *
 * Manages the open item(s) through context and `useControllableState`, so it
 * works controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).
 * Panels expand with a pure-CSS `grid-template-rows` animation — no height
 * measuring — and headers support Arrow/Home/End roving focus.
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion(
    {
      type = 'single',
      value: valueProp,
      defaultValue,
      onChange,
      collapsible = true,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const [value, setValue] = useControllableState<AccordionValue>({
      value: valueProp,
      defaultValue: defaultValue ?? (type === 'multiple' ? [] : ''),
      onChange,
    });

    const toggle = useCallback(
      (itemValue: string) => {
        if (type === 'multiple') {
          const open = toOpenList(value);
          const next = open.includes(itemValue)
            ? open.filter((v) => v !== itemValue)
            : [...open, itemValue];
          setValue(next);
          return;
        }
        const current = toOpenList(value)[0] ?? '';
        if (current === itemValue) {
          if (collapsible) setValue('');
        } else {
          setValue(itemValue);
        }
      },
      [type, collapsible, value, setValue],
    );

    const ctx = useMemo<AccordionContextValue>(
      () => ({
        type,
        isOpen: (itemValue: string) => toOpenList(value).includes(itemValue),
        toggle,
      }),
      [type, value, toggle],
    );

    return (
      <div
        ref={ref}
        data-gl-accordion=""
        className={cn('gl-accordion', className)}
        {...rest}
      >
        <AccordionContext.Provider value={ctx}>
          {children}
        </AccordionContext.Provider>
      </div>
    );
  },
);

export interface AccordionItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Unique value identifying this item within its accordion. */
  value: string;
  /** Header content rendered inside the trigger button. */
  title: ReactNode;
  /** Disable the header so the item cannot be toggled. @default false */
  disabled?: boolean;
  /** Panel content revealed when the item is expanded. */
  children?: ReactNode;
}

/**
 * AccordionItem — a single header + collapsible panel pair.
 *
 * Reads its open state from the parent `<Accordion>` context. The header is a
 * `<button>` with `aria-expanded`/`aria-controls`; the panel is a region
 * labelled by that header and animated via `grid-template-rows`.
 */
export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem(
    { value, title, disabled = false, className, children, ...rest },
    ref,
  ) {
    const { isOpen, toggle } = useAccordionContext();
    const open = isOpen(value);

    const baseId = useId();
    const triggerId = `${baseId}-trigger`;
    const panelId = `${baseId}-panel`;

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLButtonElement>) => {
        if (!NAV_KEYS.includes(event.key)) return;
        const trigger = event.currentTarget;
        const root = trigger.closest<HTMLElement>('[data-gl-accordion]');
        if (root === null) return;

        const triggers = Array.from(
          root.querySelectorAll<HTMLButtonElement>(
            '.gl-accordion__trigger:not([disabled])',
          ),
        ).filter((el) => el.closest('[data-gl-accordion]') === root);
        if (triggers.length === 0) return;

        const currentIndex = triggers.indexOf(trigger);
        let nextIndex = currentIndex;
        switch (event.key) {
          case 'ArrowDown':
            nextIndex = (currentIndex + 1) % triggers.length;
            break;
          case 'ArrowUp':
            nextIndex =
              (currentIndex - 1 + triggers.length) % triggers.length;
            break;
          case 'Home':
            nextIndex = 0;
            break;
          case 'End':
            nextIndex = triggers.length - 1;
            break;
          default:
            return;
        }
        event.preventDefault();
        triggers[nextIndex]?.focus();
      },
      [],
    );

    return (
      <div
        ref={ref}
        data-state={open ? 'open' : 'closed'}
        className={cn(
          'gl-accordion__item',
          disabled && 'gl-accordion__item--disabled',
          className,
        )}
        {...rest}
      >
        <h3 className="gl-accordion__header">
          <button
            type="button"
            id={triggerId}
            className="gl-accordion__trigger"
            aria-expanded={open}
            aria-controls={panelId}
            disabled={disabled}
            onClick={() => toggle(value)}
            onKeyDown={handleKeyDown}
          >
            <span className="gl-accordion__title">{title}</span>
            <span className="gl-accordion__chevron" aria-hidden="true">
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
          </button>
        </h3>
        <div className="gl-accordion__panel" data-state={open ? 'open' : 'closed'}>
          <div
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            className="gl-accordion__content"
          >
            <div className="gl-accordion__body">{children}</div>
          </div>
        </div>
      </div>
    );
  },
);
