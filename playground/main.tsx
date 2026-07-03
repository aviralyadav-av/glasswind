import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Accordion,
  AccordionItem,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerFooter,
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownSeparator,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  Progress,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Spinner,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Textarea,
  ToastProvider,
  Tooltip,
  useDisclosure,
  useToast,
} from '../src';
import '../src/styles/index.css';
import './playground.css';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pg-section">
      <h2>{title}</h2>
      <div className="pg-row">{children}</div>
    </section>
  );
}

function Showcase() {
  const modal = useDisclosure();
  const drawer = useDisclosure();
  const { success, error, info, warning } = useToast();
  const [progress, setProgress] = useState(40);

  return (
    <div className="pg-shell">
      <header className="pg-header">
        <h1>🧊 Glasswind</h1>
        <p>Frosted-glass React components — live playground</p>
      </header>

      <Section title="Buttons">
        <Button variant="glass">Glass</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="primary" loading>Loading</Button>
        <Button variant="glass" disabled>Disabled</Button>
      </Section>

      <Section title="Inputs & Form Controls">
        <Input placeholder="Type something…" />
        <Input placeholder="Search" leftIcon={<span>🔍</span>} />
        <Input placeholder="Error state" error defaultValue="oops" />
        <Select
          placeholder="Choose a fruit"
          options={[
            { label: 'Apple', value: 'apple' },
            { label: 'Banana', value: 'banana' },
            { label: 'Cherry', value: 'cherry' },
          ]}
        />
      </Section>

      <Section title="Textarea">
        <Textarea placeholder="Write a message…" rows={3} fullWidth />
      </Section>

      <Section title="Toggles">
        <Checkbox label="Accept terms" defaultChecked />
        <Checkbox label="Indeterminate" indeterminate />
        <Switch label="Notifications" defaultChecked />
        <Switch label="Disabled" disabled />
        <RadioGroup defaultValue="b" orientation="horizontal">
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" />
          <Radio value="c" label="Option C" />
        </RadioGroup>
      </Section>

      <Section title="Slider">
        <div style={{ width: 260 }}>
          <Slider defaultValue={50} showValue />
        </div>
      </Section>

      <Section title="Badges & Avatars">
        <Badge variant="primary">Primary</Badge>
        <Badge variant="success" dot>Online</Badge>
        <Badge variant="danger">Error</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="info">Info</Badge>
        <Avatar name="Ada Lovelace" status="online" />
        <Avatar name="John Doe" shape="square" status="busy" />
        <Avatar src="https://invalid.example/x.png" name="Fallback User" />
      </Section>

      <Section title="Progress & Spinner">
        <div style={{ width: 260, display: 'grid', gap: 12 }}>
          <Progress value={progress} showLabel />
          <Progress value={80} color="success" />
          <Progress indeterminate />
          <div className="pg-row">
            <Button size="sm" onClick={() => setProgress((p) => Math.max(0, p - 10))}>–10</Button>
            <Button size="sm" onClick={() => setProgress((p) => Math.min(100, p + 10))}>+10</Button>
          </div>
        </div>
        <Spinner size="lg" />
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="one">
          <TabList>
            <Tab value="one">Overview</Tab>
            <Tab value="two">Details</Tab>
            <Tab value="three">Settings</Tab>
          </TabList>
          <TabPanel value="one">The overview panel — frosted and smooth.</TabPanel>
          <TabPanel value="two">Details go here.</TabPanel>
          <TabPanel value="three">Settings live here.</TabPanel>
        </Tabs>
      </Section>

      <Section title="Accordion">
        <div style={{ width: '100%', maxWidth: 520 }}>
          <Accordion type="single" defaultValue="a1">
            <AccordionItem value="a1" title="What is Glasswind?">
              A glassmorphism React component library with smooth GPU animations.
            </AccordionItem>
            <AccordionItem value="a2" title="Does it need Tailwind?">
              No — it ships plain bundled CSS. Just import once and go.
            </AccordionItem>
            <AccordionItem value="a3" title="Is it accessible?">
              Yes — ARIA roles, keyboard nav, and reduced-motion support.
            </AccordionItem>
          </Accordion>
        </div>
      </Section>

      <Section title="Card">
        <Card hoverable style={{ maxWidth: 320 }}>
          <CardHeader><strong>Pro Plan</strong></CardHeader>
          <CardBody>Everything in Free, plus glass superpowers. ✨</CardBody>
          <CardFooter><Button variant="primary" size="sm">Upgrade</Button></CardFooter>
        </Card>
      </Section>

      <Section title="Overlays">
        <Button variant="primary" onClick={modal.open}>Open Modal</Button>
        <Button variant="glass" onClick={drawer.open}>Open Drawer</Button>
        <Dropdown>
          <DropdownTrigger>Menu ▾</DropdownTrigger>
          <DropdownMenu>
            <DropdownLabel>Account</DropdownLabel>
            <DropdownItem leftIcon={<span>👤</span>} onSelect={() => info('Profile clicked')}>Profile</DropdownItem>
            <DropdownItem leftIcon={<span>⚙️</span>} onSelect={() => info('Settings clicked')}>Settings</DropdownItem>
            <DropdownSeparator />
            <DropdownItem leftIcon={<span>🚪</span>} onSelect={() => warning('Logged out')}>Log out</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Tooltip content="I'm a frosted tooltip!">
          <Button variant="secondary">Hover me</Button>
        </Tooltip>
      </Section>

      <Section title="Toasts">
        <Button variant="primary" onClick={() => success('Saved successfully!')}>Success</Button>
        <Button variant="danger" onClick={() => error('Something went wrong')}>Error</Button>
        <Button variant="glass" onClick={() => info('Heads up — new update')}>Info</Button>
        <Button variant="secondary" onClick={() => warning('Careful with that')}>Warning</Button>
      </Section>

      <Modal isOpen={modal.isOpen} onClose={modal.close} title="Welcome to Glasswind">
        <ModalBody>
          This is a fully accessible glass modal — Esc to close, backdrop click,
          scroll lock, and a smooth scale-in animation.
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={modal.close}>Cancel</Button>
          <Button variant="primary" onClick={modal.close}>Got it</Button>
        </ModalFooter>
      </Modal>

      <Drawer isOpen={drawer.isOpen} onClose={drawer.close} side="right" title="Settings">
        <DrawerBody>
          <div style={{ display: 'grid', gap: 16 }}>
            <Switch label="Dark mode" />
            <Switch label="Email alerts" defaultChecked />
            <Input placeholder="Display name" fullWidth />
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="primary" fullWidth onClick={drawer.close}>Save</Button>
        </DrawerFooter>
      </Drawer>
    </div>
  );
}

function App() {
  const [dark, setDark] = useState(true);

  // Toggle theme on <html> so portalled overlays (Modal/Drawer/Toast) inherit it too.
  useEffect(() => {
    document.documentElement.classList.toggle('gl-dark', dark);
  }, [dark]);

  return (
    <ToastProvider position="bottom-right">
      <div className="pg-toggle-theme">
        <Button variant="glass" size="sm" onClick={() => setDark((d) => !d)}>
          {dark ? '☀️ Light' : '🌙 Dark'}
        </Button>
      </div>
      <Showcase />
    </ToastProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
