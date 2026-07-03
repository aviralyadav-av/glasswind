<div align="center">

# 🧊 Glasswind

**A glassmorphism React component library.**
Beautiful frosted-glass UI components with smooth, GPU-accelerated animations — for React & Next.js.

```bash
npm install glasswind
```

</div>

---

## ✨ Why Glasswind?

- 🧊 **Signature glass look** — every component has the frosted / blurred "liquid glass" aesthetic (like iOS), out of the box.
- ⚡ **Buttery animations, zero lag** — only `transform` & `opacity` are animated, so everything runs on the GPU compositor. No layout thrash, no jank, no heavy runtime.
- 🎨 **Themeable with CSS variables** — change blur, tint, radius, colors, and dark mode by overriding a few CSS custom properties. No Tailwind required.
- 📦 **Just install & import** — plain bundled CSS. Works with Create React App, Vite, Next.js (App & Pages router), Remix, etc.
- 🔠 **Fully typed** — written in TypeScript, ships `.d.ts` types for perfect autocomplete.
- ♿ **Accessible** — keyboard navigation, ARIA attributes, focus rings, and `prefers-reduced-motion` support.
- 🪶 **Lightweight** — tree-shakeable ESM + CJS builds, no framework lock-in beyond React.

## 🚀 Quick start

Install the package:

```bash
npm install glasswind
# or: pnpm add glasswind / yarn add glasswind
```

Import the stylesheet **once** at your app's root, then use components anywhere:

```tsx
// App entry (e.g. main.tsx, _app.tsx, or app/layout.tsx)
import 'glasswind/styles.css';
```

```tsx
import { Button, Card, Modal } from 'glasswind';

export default function Example() {
  return (
    <Card>
      <h3>Welcome to Glasswind</h3>
      <Button variant="primary">Get started</Button>
    </Card>
  );
}
```

### Next.js (App Router)

Add the stylesheet in your root layout:

```tsx
// app/layout.tsx
import 'glasswind/styles.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

> Interactive components (Modal, Drawer, Dropdown, Toast…) are client components — use them inside a file marked `'use client'`. They're built SSR-safe, so no hydration errors.

## 🎨 Theming

Glasswind is driven entirely by CSS variables. Override any of them on `:root` (or any wrapper) to re-skin the whole library:

```css
:root {
  --gl-blur: 20px;          /* stronger frost */
  --gl-primary: #ff6b6b;    /* brand accent */
  --gl-radius: 20px;        /* rounder corners */
  --gl-bg: rgba(255, 255, 255, 0.2);
}
```

**Dark mode** — add `data-theme="dark"` (or the class `gl-dark`) to `<html>` or any container:

```tsx
<html data-theme="dark">
```

Every theme token is a CSS variable prefixed `--gl-` — override any of them to restyle the whole library.

## 🧩 Components

Buttons · Inputs · Textarea · Select · Checkbox · Radio · Switch · Slider ·
Card · Badge · Avatar · Accordion · Tabs · Progress · Spinner ·
Modal · Drawer · Dropdown · Tooltip · Toast — and growing.

Every component is written in TypeScript and ships full type definitions, so your editor's autocomplete surfaces all props, variants, and sizes as you type.

## 🛠️ Local development

```bash
npm install        # install dev deps
npm run dev        # open the live playground (Vite)
npm run build      # build the library into dist/
npm run typecheck  # type-check without emitting
```

The **playground** (`playground/`) renders every component over an animated gradient so you can see the glass effect while you build.

## 📄 License

[MIT](LICENSE) — free for personal and commercial use.
