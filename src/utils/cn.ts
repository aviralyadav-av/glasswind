/**
 * cn — tiny classnames joiner.
 * Filters out falsey values and flattens arrays so components can write:
 *   cn('gl-btn', `gl-btn--${variant}`, disabled && 'gl-btn--disabled', className)
 * No external dependency (keeps the bundle small).
 */
export type ClassValue =
  | string
  | number
  | null
  | boolean
  | undefined
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else if (typeof input === 'string' || typeof input === 'number') {
      out.push(String(input));
    }
  }
  return out.join(' ');
}
