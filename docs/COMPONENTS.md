# Glasswind — Component Catalog

Every component is imported from the package root and styled by the single stylesheet:

```tsx
import { Button, Modal /* … */ } from 'glasswind';
import 'glasswind/styles.css'; // once, at your app root
```

> **Next.js:** interactive components (Modal, Drawer, Dropdown, Tooltip, Toast) are client components — use them in a file with `'use client'` at the top. They're SSR-safe (no hydration errors).

**Contents:** [Button](#button) · [Input](#input) · [Textarea](#textarea) · [Select](#select) · [Checkbox](#checkbox) · [Radio](#radio) · [Switch](#switch) · [Slider](#slider) · [Card](#card) · [Badge](#badge) · [Avatar](#avatar) · [Accordion](#accordion) · [Tabs](#tabs) · [Progress](#progress) · [Spinner](#spinner) · [Modal](#modal) · [Drawer](#drawer) · [Dropdown](#dropdown) · [Tooltip](#tooltip) · [Toast](#toast) · [Hooks](#hooks)

---

## Button

```tsx
<Button variant="primary" size="md" onClick={...}>Save</Button>
<Button variant="glass" leftIcon={<Icon/>} loading>Loading</Button>
```

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'glass' \| 'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'glass'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `loading` | `boolean` | `false` |
| `leftIcon` / `rightIcon` | `ReactNode` | — |
| `fullWidth` | `boolean` | `false` |

Plus all native `<button>` attributes.

## Input

```tsx
<Input placeholder="Search" leftIcon={<span>🔍</span>} />
<Input error defaultValue="invalid" />
```

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'glass' \| 'subtle'` | `'subtle'` |
| `inputSize` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `error` | `boolean` | — |
| `leftIcon` / `rightIcon` | `ReactNode` | — |
| `fullWidth` | `boolean` | — |

Plus all native `<input>` attributes (except `size`).

## Textarea

```tsx
<Textarea placeholder="Message…" rows={4} autoResize fullWidth />
```

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'glass' \| 'subtle'` | `'subtle'` |
| `error` | `boolean` | — |
| `fullWidth` | `boolean` | — |
| `autoResize` | `boolean` | — |

## Select

```tsx
<Select
  placeholder="Choose…"
  options={[{ label: 'Apple', value: 'apple' }, { label: 'Banana', value: 'banana' }]}
/>
```

| Prop | Type | Default |
|------|------|---------|
| `options` | `{ label: string; value: string \| number; disabled?: boolean }[]` | — |
| `placeholder` | `string` | — |
| `selectSize` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `error` | `boolean` | `false` |
| `fullWidth` | `boolean` | `false` |

You can pass your own `<option>` children instead of `options`.

## Checkbox

```tsx
<Checkbox label="Accept terms" defaultChecked />
<Checkbox label="Select all" indeterminate />
```

| Prop | Type | Default |
|------|------|---------|
| `label` | `ReactNode` | — |
| `indeterminate` | `boolean` | — |
| `error` | `boolean` | — |
| `boxSize` | `'sm' \| 'md' \| 'lg'` | `'md'` |

## Radio

```tsx
<RadioGroup defaultValue="b" onChange={setVal} orientation="horizontal">
  <Radio value="a" label="Option A" />
  <Radio value="b" label="Option B" />
</RadioGroup>
```

**RadioGroup:** `value`, `defaultValue`, `onChange(value)`, `name`, `orientation` (`'vertical'|'horizontal'`).
**Radio:** `value` (required), `label`, `disabled`.

## Switch

```tsx
<Switch label="Notifications" defaultChecked onChange={(on) => ...} />
```

| Prop | Type | Default |
|------|------|---------|
| `checked` / `defaultChecked` | `boolean` | — |
| `onChange` | `(checked: boolean) => void` | — |
| `label` | `ReactNode` | — |
| `switchSize` | `'sm' \| 'md' \| 'lg'` | `'md'` |

## Slider

```tsx
<Slider min={0} max={100} defaultValue={50} showValue onChange={setV} />
```

| Prop | Type | Default |
|------|------|---------|
| `min` / `max` / `step` | `number` | `0` / `100` / `1` |
| `value` / `defaultValue` | `number` | — |
| `onChange` | `(value: number) => void` | — |
| `showValue` | `boolean` | `false` |

## Card

```tsx
<Card hoverable>
  <CardHeader>Title</CardHeader>
  <CardBody>Content…</CardBody>
  <CardFooter><Button>Action</Button></CardFooter>
</Card>
```

**Card:** `variant` (`'glass'|'solid'`), `padding` (`'none'|'sm'|'md'|'lg'`), `hoverable`.
Sub-components: `CardHeader`, `CardBody`, `CardFooter`.

## Badge

```tsx
<Badge variant="success" dot>Online</Badge>
```

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'glass' \| 'primary' \| 'success' \| 'danger' \| 'warning' \| 'info'` | `'glass'` |
| `size` | `'sm' \| 'md'` | `'md'` |
| `dot` | `boolean` | `false` |
| `pill` | `boolean` | `true` |

## Avatar

```tsx
<Avatar src="/me.jpg" name="Shweta Gupta" status="online" />
<Avatar name="John Doe" shape="square" /> {/* initials fallback */}
```

| Prop | Type | Default |
|------|------|---------|
| `src` / `alt` / `name` | `string` | — |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `shape` | `'circle' \| 'square'` | `'circle'` |
| `status` | `'online' \| 'offline' \| 'busy' \| 'away'` | — |

Falls back to initials (from `name`) if the image fails to load.

## Accordion

```tsx
<Accordion type="single" defaultValue="a1" collapsible>
  <AccordionItem value="a1" title="Question 1">Answer…</AccordionItem>
  <AccordionItem value="a2" title="Question 2">Answer…</AccordionItem>
</Accordion>
```

**Accordion:** `type` (`'single'|'multiple'`), `value`/`defaultValue` (string or string[]), `onChange`, `collapsible`.
**AccordionItem:** `value` (required), `title` (required), `disabled`.
Panels open with a pure-CSS `grid-template-rows` animation (no JS height measuring).

## Tabs

```tsx
<Tabs defaultValue="one">
  <TabList>
    <Tab value="one">Overview</Tab>
    <Tab value="two">Details</Tab>
  </TabList>
  <TabPanel value="one">…</TabPanel>
  <TabPanel value="two">…</TabPanel>
</Tabs>
```

**Tabs:** `value`/`defaultValue`, `onChange`. **Tab / TabPanel:** `value` (required). Arrow-key roving focus in the `TabList`.

## Progress

```tsx
<Progress value={70} showLabel />
<Progress indeterminate color="success" />
```

| Prop | Type | Default |
|------|------|---------|
| `value` / `max` | `number` | `0` / `100` |
| `indeterminate` | `boolean` | `false` |
| `barSize` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `color` | `'primary' \| 'success' \| 'danger' \| 'warning' \| 'info'` | `'primary'` |
| `showLabel` | `boolean` | `false` |

Determinate fill uses a GPU `scaleX` transform — smooth, no layout thrash.

## Spinner

```tsx
<Spinner size="lg" label="Loading users" />
```

`size` (`'sm'|'md'|'lg'|'xl'`), `label` (a11y text), `thickness` (px). Inherits `currentColor`.

## Modal

```tsx
const modal = useDisclosure();
<Button onClick={modal.open}>Open</Button>
<Modal isOpen={modal.isOpen} onClose={modal.close} title="Hello">
  <ModalBody>Body content…</ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={modal.close}>Cancel</Button>
    <Button variant="primary" onClick={modal.close}>OK</Button>
  </ModalFooter>
</Modal>
```

| Prop | Type | Default |
|------|------|---------|
| `isOpen` | `boolean` | — |
| `onClose` | `() => void` | — |
| `title` | `ReactNode` | — |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `closeOnBackdrop` / `closeOnEsc` / `showClose` | `boolean` | `true` |

Portalled, scroll-locked, focus-managed, Esc/backdrop close. Sections: `ModalHeader`, `ModalBody`, `ModalFooter`.

## Drawer

```tsx
<Drawer isOpen={open} onClose={close} side="right" title="Settings">
  <DrawerBody>…</DrawerBody>
  <DrawerFooter><Button fullWidth>Save</Button></DrawerFooter>
</Drawer>
```

Same overlay behavior as Modal, but slides from an edge. Extra props: `side` (`'left'|'right'|'top'|'bottom'`, default `'right'`), `size` (width/height, default `'340px'`). Sections: `DrawerHeader`, `DrawerBody`, `DrawerFooter`.

## Dropdown

```tsx
<Dropdown placement="bottom-start">
  <DropdownTrigger>Menu ▾</DropdownTrigger>
  <DropdownMenu>
    <DropdownLabel>Account</DropdownLabel>
    <DropdownItem onSelect={...} leftIcon={<Icon/>}>Profile</DropdownItem>
    <DropdownSeparator />
    <DropdownItem onSelect={...}>Log out</DropdownItem>
  </DropdownMenu>
</Dropdown>
```

**Dropdown:** `open`/`defaultOpen`, `onOpenChange`, `placement` (`'bottom-start'|'bottom-end'|'top-start'|'top-end'`).
Closes on outside click + Esc; arrow-key navigation across items. Parts: `DropdownTrigger`, `DropdownMenu`, `DropdownItem` (`onSelect`, `disabled`, `leftIcon`), `DropdownSeparator`, `DropdownLabel`.

## Tooltip

```tsx
<Tooltip content="Frosted tooltip!" placement="top">
  <Button>Hover me</Button>
</Tooltip>
```

`content` (required), `placement` (`'top'|'bottom'|'left'|'right'`), `delay` (ms, default `200`), `disabled`. Opens on hover **and** keyboard focus.

## Toast

Wrap your app once in `ToastProvider`, then call `useToast()` anywhere inside it:

```tsx
// app root
<ToastProvider position="bottom-right">
  <App />
</ToastProvider>

// anywhere inside
function Save() {
  const { success, error, info, warning, toast, dismiss } = useToast();
  return <Button onClick={() => success('Saved!')}>Save</Button>;
}
```

**ToastProvider:** `position` (`'top-right'|'top-left'|'bottom-right'|'bottom-left'`, default `'bottom-right'`).
**useToast() returns:** `toast(options) → id`, `dismiss(id)`, and shortcuts `success` / `error` / `info` / `warning` `(title, options?)`.
**ToastOptions:** `title`, `description`, `variant`, `duration` (ms; `0`/`Infinity` = sticky).

---

## Hooks

Also exported for building your own components:

| Hook | Purpose |
|------|---------|
| `useDisclosure(defaultOpen?)` | `{ isOpen, open, close, toggle, setOpen }` for overlays |
| `useClickOutside(ref, handler, enabled?)` | Fire when clicking outside an element |
| `useScrollLock(locked)` | Lock body scroll (no layout shift) |
| `useControllableState({ value, defaultValue, onChange })` | Controlled/uncontrolled value |
| `useIsomorphicLayoutEffect` | SSR-safe `useLayoutEffect` |
| `cn(...classes)` | Tiny classnames joiner |
| `Portal` | SSR-safe render into `document.body` |
