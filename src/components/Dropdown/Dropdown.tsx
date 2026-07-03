import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useId,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MutableRefObject,
  type ReactNode,
  type Ref,
} from 'react';
import { cn } from '../../utils/cn';
import { useClickOutside, useControllableState } from '../../hooks';

/** Corner of the trigger the menu anchors to. */
export type DropdownPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end';

interface DropdownContextValue {
  /** Whether the menu is currently open. */
  open: boolean;
  /** Imperatively set the open state (respects controlled usage). */
  setOpen: (open: boolean) => void;
  /** Anchor corner for the menu. */
  placement: DropdownPlacement;
  /** id of the trigger button (menu is labelled by it). */
  triggerId: string;
  /** id of the menu element (trigger controls it). */
  menuId: string;
  /** Ref to the trigger button, used to restore focus on close. */
  triggerRef: MutableRefObject<HTMLButtonElement | null>;
  /** Ref to the menu element, used for focus/keyboard management. */
  menuRef: MutableRefObject<HTMLDivElement | null>;
  /** Close the menu and return focus to the trigger (used on item select). */
  closeAndFocusTrigger: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext(part: string): DropdownContextValue {
  const ctx = useContext(DropdownContext);
  if (!ctx) {
    throw new Error(`${part} must be rendered inside a <Dropdown>.`);
  }
  return ctx;
}

const ITEM_SELECTOR =
  '[role="menuitem"]:not([disabled]):not([aria-disabled="true"])';

/** Collect the currently focusable menu items in DOM order. */
function getMenuItems(menu: HTMLDivElement | null): HTMLElement[] {
  if (!menu) return [];
  return Array.from(menu.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
}

/** Assign a value to either a callback ref or an object ref. */
function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    (ref as MutableRefObject<T | null>).current = value;
  }
}

export interface DropdownProps {
  /** Controlled open state. Provide together with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called whenever the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Corner of the trigger the menu anchors to. @default 'bottom-start' */
  placement?: DropdownPlacement;
  /** Trigger and menu parts (`DropdownTrigger`, `DropdownMenu`, …). */
  children: ReactNode;
}

/**
 * Dropdown — a compound menu-button.
 * Provides open state, placement, and focus management via context to its
 * `DropdownTrigger` and `DropdownMenu` parts. Closes on outside click and Esc,
 * with roving arrow-key navigation across items.
 */
export function Dropdown({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom-start',
  children,
}: DropdownProps) {
  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const rootRef = useRef<HTMLSpanElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const reactId = useId();
  const triggerId = `${reactId}-trigger`;
  const menuId = `${reactId}-menu`;

  const close = useCallback(() => setOpen(false), [setOpen]);

  const closeAndFocusTrigger = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, [setOpen]);

  // Close when a pointer interaction lands outside the root (only while open).
  useClickOutside(rootRef, close, open);

  // Close on Escape and restore focus to the trigger.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen]);

  const value: DropdownContextValue = {
    open,
    setOpen,
    placement,
    triggerId,
    menuId,
    triggerRef,
    menuRef,
    closeAndFocusTrigger,
  };

  return (
    <DropdownContext.Provider value={value}>
      <span ref={rootRef} className="gl-dropdown">
        {children}
      </span>
    </DropdownContext.Provider>
  );
}

export interface DropdownTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Trigger content (text and/or icons). */
  children?: ReactNode;
}

/**
 * DropdownTrigger — the button that toggles the menu.
 * Wires up `aria-haspopup`, `aria-expanded`, and `aria-controls`, and opens the
 * menu on ArrowUp/ArrowDown.
 */
export const DropdownTrigger = forwardRef<
  HTMLButtonElement,
  DropdownTriggerProps
>(function DropdownTrigger(
  { className, children, onClick, onKeyDown, type = 'button', ...rest },
  ref,
) {
  const ctx = useDropdownContext('DropdownTrigger');

  const setRef = useCallback(
    (node: HTMLButtonElement | null) => {
      ctx.triggerRef.current = node;
      assignRef(ref, node);
    },
    [ctx.triggerRef, ref],
  );

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      ctx.setOpen(!ctx.open);
      onClick?.(event);
    },
    [ctx, onClick],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (!ctx.open) {
          ctx.setOpen(true);
        } else {
          getMenuItems(ctx.menuRef.current)[0]?.focus();
        }
      }
      onKeyDown?.(event);
    },
    [ctx, onKeyDown],
  );

  return (
    <button
      ref={setRef}
      type={type}
      id={ctx.triggerId}
      className={cn('gl-dropdown__trigger', 'gl-focusable', className)}
      aria-haspopup="menu"
      aria-expanded={ctx.open}
      aria-controls={ctx.open ? ctx.menuId : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </button>
  );
});

export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  /** Menu contents (`DropdownItem`, `DropdownSeparator`, `DropdownLabel`). */
  children?: ReactNode;
}

/**
 * DropdownMenu — the popover surface holding the items.
 * Renders only while open, positioned per `placement`, with arrow/Home/End
 * roving focus. Auto-focuses the first item when it opens.
 */
export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  function DropdownMenu({ className, children, onKeyDown, ...rest }, ref) {
    const ctx = useDropdownContext('DropdownMenu');
    const { open, menuRef } = ctx;

    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        menuRef.current = node;
        assignRef(ref, node);
      },
      [menuRef, ref],
    );

    // Move focus to the first item when the menu opens.
    useEffect(() => {
      if (!open) return;
      getMenuItems(menuRef.current)[0]?.focus();
    }, [open, menuRef]);

    const handleKeyDown = useCallback(
      (event: ReactKeyboardEvent<HTMLDivElement>) => {
        const items = getMenuItems(menuRef.current);
        if (items.length > 0) {
          const active = document.activeElement as HTMLElement | null;
          const currentIndex = active ? items.indexOf(active) : -1;
          switch (event.key) {
            case 'ArrowDown': {
              event.preventDefault();
              const next = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
              items[next]?.focus();
              break;
            }
            case 'ArrowUp': {
              event.preventDefault();
              const prev =
                currentIndex < 0
                  ? items.length - 1
                  : (currentIndex - 1 + items.length) % items.length;
              items[prev]?.focus();
              break;
            }
            case 'Home': {
              event.preventDefault();
              items[0]?.focus();
              break;
            }
            case 'End': {
              event.preventDefault();
              items[items.length - 1]?.focus();
              break;
            }
            default:
              break;
          }
        }
        onKeyDown?.(event);
      },
      [menuRef, onKeyDown],
    );

    if (!open) return null;

    return (
      <div
        ref={setRef}
        id={ctx.menuId}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby={ctx.triggerId}
        tabIndex={-1}
        className={cn(
          'gl-dropdown__menu',
          `gl-dropdown__menu--${ctx.placement}`,
          className,
        )}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export interface DropdownItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  /** Called when the item is chosen (click or Enter/Space). */
  onSelect?: () => void;
  /** Disable interaction and skip the item during keyboard navigation. */
  disabled?: boolean;
  /** Icon rendered before the item label. */
  leftIcon?: ReactNode;
  /** Item label / content. */
  children?: ReactNode;
}

/**
 * DropdownItem — a selectable menu row.
 * Activates on click or Enter/Space (native button), then closes the menu and
 * returns focus to the trigger.
 */
export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  function DropdownItem(
    { className, children, onSelect, disabled = false, leftIcon, onClick, type = 'button', ...rest },
    ref,
  ) {
    const ctx = useDropdownContext('DropdownItem');

    const handleClick = useCallback(
      (event: ReactMouseEvent<HTMLButtonElement>) => {
        if (disabled) return;
        onClick?.(event);
        onSelect?.();
        ctx.closeAndFocusTrigger();
      },
      [ctx, disabled, onClick, onSelect],
    );

    return (
      <button
        ref={ref}
        type={type}
        role="menuitem"
        tabIndex={-1}
        disabled={disabled}
        className={cn('gl-dropdown__item', 'gl-focusable', className)}
        onClick={handleClick}
        {...rest}
      >
        {leftIcon != null ? (
          <span className="gl-dropdown__item-icon" aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}
        <span className="gl-dropdown__item-label">{children}</span>
      </button>
    );
  },
);

/** Props for the menu separator (a horizontal divider). */
export type DropdownSeparatorProps = HTMLAttributes<HTMLDivElement>;

/**
 * DropdownSeparator — a non-interactive horizontal divider between groups.
 */
export const DropdownSeparator = forwardRef<
  HTMLDivElement,
  DropdownSeparatorProps
>(function DropdownSeparator({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation="horizontal"
      className={cn('gl-dropdown__separator', className)}
      {...rest}
    />
  );
});

/** Props for a non-interactive group label inside the menu. */
export type DropdownLabelProps = HTMLAttributes<HTMLDivElement>;

/**
 * DropdownLabel — a small, muted heading that titles a group of items.
 */
export const DropdownLabel = forwardRef<HTMLDivElement, DropdownLabelProps>(
  function DropdownLabel({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="presentation"
        className={cn('gl-dropdown__label', className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
