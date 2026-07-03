import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export type CardVariant = 'glass' | 'solid';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Surface style: frosted `glass` or an opaque `solid` panel. @default 'glass' */
  variant?: CardVariant;
  /** Inner spacing applied to the card and its sections. @default 'md' */
  padding?: CardPadding;
  /** Lift the card on hover with a translateY + stronger shadow. @default false */
  hoverable?: boolean;
}

/**
 * Card — a frosted-glass surface container.
 * Compose with `CardHeader`, `CardBody`, and `CardFooter` for structured
 * content. Features a radius-lg glass surface and a top-edge sheen.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = 'glass',
    padding = 'md',
    hoverable = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'gl-card',
        `gl-card--${variant}`,
        `gl-card--pad-${padding}`,
        hoverable && 'gl-card--hoverable',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

/** Props shared by the Card section wrappers (`CardHeader`/`CardBody`/`CardFooter`). */
export type CardSectionProps = HTMLAttributes<HTMLDivElement>;

/**
 * CardHeader — top section of a `Card`, separated by a subtle bottom border.
 */
export const CardHeader = forwardRef<HTMLDivElement, CardSectionProps>(
  function CardHeader({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn('gl-card__header', className)} {...rest}>
        {children}
      </div>
    );
  },
);

/**
 * CardBody — main content region of a `Card`.
 */
export const CardBody = forwardRef<HTMLDivElement, CardSectionProps>(
  function CardBody({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn('gl-card__body', className)} {...rest}>
        {children}
      </div>
    );
  },
);

/**
 * CardFooter — bottom section of a `Card`, separated by a subtle top border.
 */
export const CardFooter = forwardRef<HTMLDivElement, CardSectionProps>(
  function CardFooter({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn('gl-card__footer', className)} {...rest}>
        {children}
      </div>
    );
  },
);
