# Glasswind — Design System

Everything in Glasswind is built on a single layer of **CSS custom properties (design tokens)**. Components never hard-code colors, blur, radius, or timing — they read from tokens. This means you can re-theme the entire library by overriding a handful of variables.

## The glass recipe

The frosted-glass look comes from four CSS properties working together:

```css
.gl-glass {
  background: var(--gl-bg);                                  /* translucent fill */
  backdrop-filter: blur(var(--gl-blur)) saturate(var(--gl-saturate)); /* the frost */
  border: 1px solid var(--gl-border);                        /* crisp edge */
  box-shadow: var(--gl-shadow), var(--gl-inner-glow);        /* depth + top sheen */
}
```

- **`backdrop-filter: blur()`** blurs whatever is *behind* the element — this is what creates the glass. It needs a colorful/busy background to look good.
- **`saturate()`** boosts the colors bleeding through, making the glass feel alive.
- A subtle **1px highlight border** + inner top glow simulate light catching the glass edge.

> ℹ️ `backdrop-filter` is supported in all modern browsers. Glasswind ships a `@supports` fallback (a more opaque solid fill) for the rare browser without it, so text stays readable.

## Token reference

All tokens live in [`src/styles/tokens.css`](../src/styles/tokens.css). Override on `:root` or any wrapper element.

### Glass surface
| Token | Default | Purpose |
|-------|---------|---------|
| `--gl-blur` | `16px` | Backdrop blur radius |
| `--gl-saturate` | `180%` | Color pop behind glass |
| `--gl-bg` | `rgba(255,255,255,.14)` | Base surface fill |
| `--gl-bg-hover` / `--gl-bg-active` | — | Interactive states |
| `--gl-bg-subtle` | `rgba(255,255,255,.08)` | Inputs / low-emphasis |
| `--gl-border` / `--gl-border-strong` | — | Edges |
| `--gl-highlight` | `rgba(255,255,255,.55)` | Top-edge sheen |
| `--gl-shadow` / `--gl-shadow-lg` | — | Drop shadows |

### Accent colors
`--gl-primary`, `--gl-success`, `--gl-danger`, `--gl-warning`, `--gl-info` (each with a matching `-soft` translucent variant).

### Text
`--gl-text`, `--gl-text-muted`, `--gl-text-faint`.

### Radius
`--gl-radius-sm` (8px) · `--gl-radius` (14px) · `--gl-radius-lg` (20px) · `--gl-radius-xl` (28px) · `--gl-radius-full`.

### Typography
`--gl-font`, `--gl-fs-xs … --gl-fs-xl`, `--gl-fw`, `--gl-fw-bold`, `--gl-lh`.

### Spacing
`--gl-space-1 … --gl-space-8` (4px → 32px scale).

### Control sizing
`--gl-control-h-sm` (32px) · `--gl-control-h-md` (40px) · `--gl-control-h-lg` (48px).

### Motion
| Token | Default | Purpose |
|-------|---------|---------|
| `--gl-ease` | `cubic-bezier(.22,1,.36,1)` | Smooth ease-out |
| `--gl-ease-spring` | `cubic-bezier(.34,1.56,.64,1)` | Gentle overshoot |
| `--gl-dur-fast` / `--gl-dur` / `--gl-dur-slow` | 140 / 220 / 340ms | Timings |

### Layering (z-index)
`--gl-z-dropdown` (900) · `--gl-z-drawer` (1000) · `--gl-z-modal` (1010) · `--gl-z-toast` (1100) · `--gl-z-tooltip` (1200).

## Dark mode

Add `data-theme="dark"` or the `.gl-dark` class to any ancestor. The dark token block in `tokens.css` swaps surface fills, borders, shadows, and text colors. You can also use `.gl-auto` to follow the OS `prefers-color-scheme` automatically.

## Naming convention (BEM + `gl-` prefix)

Every class is namespaced to avoid collisions with your app's CSS:

- **Block:** `gl-btn`, `gl-card`, `gl-modal`
- **Element:** `gl-modal__header`, `gl-card__footer`
- **Modifier:** `gl-btn--primary`, `gl-btn--lg`, `gl-switch--checked`

## Animation philosophy — no lag

Glasswind only ever animates **`transform`** and **`opacity`**. These are composited by the GPU and never trigger layout or paint, so animations stay at 60fps even on modest devices. We never animate `width`, `height`, `top`, `left`, `box-shadow` size, or `filter` in ways that would force reflow. All motion respects `prefers-reduced-motion`.
