import {
  forwardRef,
  useEffect,
  useState,
  type HTMLAttributes,
  type ReactElement,
} from 'react';
import { cn } from '../../utils/cn';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Image URL. When it fails to load, the component falls back to initials. */
  src?: string;
  /** Alternative text for the image / accessible label for the fallback. */
  alt?: string;
  /** Full name used to derive initials when no image is available. */
  name?: string;
  /** Diameter preset. @default 'md' */
  size?: AvatarSize;
  /** Outline shape. @default 'circle' */
  shape?: AvatarShape;
  /** Presence indicator rendered as a dot at the bottom-right. */
  status?: AvatarStatus;
}

/** Human-readable labels for each presence status (used by screen readers). */
const STATUS_LABELS: Record<AvatarStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  busy: 'Busy',
  away: 'Away',
};

/**
 * Derive up to two uppercase initials from a name.
 * "Ada Lovelace" -> "AL", "cher" -> "C", "  " -> "".
 */
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
}

/** Generic user glyph shown when there is neither an image nor a name. */
function FallbackIcon(): ReactElement {
  return (
    <svg
      className="gl-avatar__icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 1.75c-3.6 0-6.5 2-6.5 4.5 0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25 0-2.5-2.9-4.5-6.5-4.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Avatar — a frosted-glass user thumbnail.
 * Shows a photo when `src` loads, gracefully falls back to initials (from
 * `name`) or a generic glyph, and can display a colored presence dot.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    src,
    alt,
    name,
    size = 'md',
    shape = 'circle',
    status,
    className,
    children,
    ...rest
  },
  ref,
) {
  const [imgFailed, setImgFailed] = useState(false);

  // Retry loading whenever the source changes.
  useEffect(() => {
    setImgFailed(false);
  }, [src]);

  const showImage = Boolean(src) && !imgFailed;
  const initials = name ? getInitials(name) : '';
  const a11yLabel = alt ?? name;

  return (
    <span
      ref={ref}
      className={cn(
        'gl-avatar',
        `gl-avatar--${size}`,
        `gl-avatar--${shape}`,
        'gl-focusable',
        className,
      )}
      {...(showImage ? {} : { role: 'img', 'aria-label': a11yLabel || 'Avatar' })}
      {...rest}
    >
      {showImage ? (
        <img
          className="gl-avatar__img"
          src={src}
          alt={alt ?? name ?? ''}
          draggable={false}
          onError={() => setImgFailed(true)}
        />
      ) : initials ? (
        <span className="gl-avatar__initials" aria-hidden="true">
          {initials}
        </span>
      ) : (
        <FallbackIcon />
      )}

      {children}

      {status ? (
        <span
          className={cn('gl-avatar__status', `gl-avatar__status--${status}`)}
          role="img"
          aria-label={STATUS_LABELS[status]}
        />
      ) : null}
    </span>
  );
});
