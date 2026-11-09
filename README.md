# react-tostack

Toasts made of light and glass. A Dynamic Island that morphs between messages on spring physics, closes with one tap, and expands for details.

<p align="center">
  <img src="https://raw.githubusercontent.com/ergashev2000/react-tostack/main/media/demo.gif" alt="An island grows from the top edge, morphs from Deploying to Deployed, stacks three toasts, fans them out on hover, and opens a message with a Reply button" width="960" />
</p>

<p align="center"><a href="https://react-tostack.islomjon.uz"><b>Live demo</b></a> &nbsp;·&nbsp; <a href="https://github.com/ergashev2000/react-tostack/raw/main/media/demo.mp4">Watch in HD</a></p>

Styled with **Lume**, a light-first design language: frosted glass that blurs the page behind it, a specular edge on top, one warm lamp accent, and motion on springs.

- Dynamic Island mode: one toast attached to the screen edge, morphing in place
- Stacked mode for any of the 6 positions
- Spring physics running outside React (no re-renders while animating)
- Close button by default, optional swipe to dismiss, tap to expand, hover to pause, `Esc` to close
- Lume glass material (or `material="solid"`), light, dark and system themes, animated glow edge and rich colors
- `react-hot-toast` compatible API
- Written in TypeScript, works the same from JavaScript (ESM + CommonJS)
- No dependencies besides React 18+

## Install

```bash
npm i react-tostack
```

## Usage

```tsx
import { Toaster, toast } from 'react-tostack';

export default function App() {
  return (
    <>
      <Toaster />
      <button onClick={() => toast.success('Saved to Photos')}>Save</button>
    </>
  );
}
```

Styles are injected automatically. Put `<Toaster />` once, near the root.

## API

```ts
toast('Silent mode on', { icon: '🔕' });
toast.success('Saved');
toast.error('Upload failed');
toast.warning('Battery at 10%', { accessory: '10%' });
toast.info('Focus is on');
toast.loading('Syncing…');
toast.custom(<NowPlaying />);

// Update in place: the toast morphs to the new content
const id = toast.loading('Uploading…');
toast.success('Uploaded', { id });

// Promise
toast.promise(save(), {
  loading: 'Saving…',
  success: (data) => `Saved ${data.name}`,
  error: 'Could not save',
});

toast.dismiss(id); // animate out (no id: all)
toast.remove(id);  // remove instantly
```

### Expandable toasts

Tap a toast that has a `description` or `actions` to expand it. In island mode you can also pull it down.

```ts
toast('New message', {
  icon: '✉️',
  accessory: 'now',
  description: 'Are we still on for 7?',
  actions: [
    { label: 'Reply', primary: true, onClick: (t) => openChat() },
    { label: 'Later' },
  ],
});
```

An action closes the toast unless its `onClick` returns `false`.

### Toast options

| Option | Type | Default |
| --- | --- | --- |
| `id` | `string` | auto |
| `duration` | `number` (ms) | success 2500, loading `Infinity`, others 4000 |
| `position` | `ToastPosition` | from `<Toaster>` |
| `icon` | `ReactNode` (`null` hides it) | by type |
| `iconTheme` | `{ primary, secondary }` | by type |
| `description` | `ReactNode` | — |
| `accessory` | `ReactNode` | — |
| `actions` | `ToastAction[]` | — |
| `expanded` | `boolean` | `false` |
| `accent` | CSS color | by type |
| `glow` | `boolean` | `false` |
| `closeButton` | `boolean` | `true` |
| `richColors` | `boolean` | `false` |
| `dismissible` | `boolean` (swipe to close) | `false` |
| `className`, `style` | | — |
| `ariaProps` | `{ role, 'aria-live' }` | `status` / `alert` for errors |
| `onClick`, `onDismiss`, `onAutoClose` | `(toast) => void` | — |

`style.background` sets the toast surface color.

### `<Toaster />` props

| Prop | Type | Default |
| --- | --- | --- |
| `position` | `top-left` `top-center` `top-right` `bottom-left` `bottom-center` `bottom-right` | `top-center` |
| `theme` | `light` `dark` `system` | `system` |
| `island` | `boolean \| 'auto'` | `auto` (on for `top-center`) |
| `reverseOrder` | `boolean` | `false` |
| `gutter` | `number` | `8` |
| `offset` | `number` | `16` |
| `toastOptions` | default options, plus per type: `{ success: {…}, error: {…} }` | — |
| `glow` | `boolean` | `false` |
| `closeButton` | `boolean` | `true` |
| `richColors` | `boolean` | `false` |
| `material` | `glass` `solid` | `glass` |
| `minWidth` | `number \| string` | `300` |
| `maxWidth` | `number \| string` | `380` |
| `visibleToasts` | `number` | `3` |
| `maxQueue` | `number` | `3` |
| `spring` | `{ stiffness, damping }` | `{ 260, 26 }` |
| `container` | `HTMLElement` | `document.body` |
| `containerStyle`, `containerClassName` | | — |

Island mode works with `top-center` and `bottom-center`.

### Stacking

Each position shows up to `visibleToasts` (3) at once: the newest in front, the others tucked behind it as thin layers. Hover the stack (or tap it on touch) to fan it out into a list. Only the front toast counts down, so a stack plays out one by one; toasts beyond the visible ones wait in a queue. When more than `maxQueue` (3) are waiting, the oldest are dropped, except errors and loading toasts.

### Theming

Every color is a CSS variable on `.tostack-root`, so you can override them:

```css
.tostack-root[data-theme='dark'] {
  --tostack-bg: rgba(0, 0, 0, 0.6);
  --tostack-lume: #ffb547;
  --tostack-green: #30d158;
}
```

Available: `--tostack-bg` (glass tint), `--tostack-solid` (solid surface), `--tostack-blur`, `--tostack-fg`, `--tostack-fg2`, `--tostack-spec` (top edge light), `--tostack-hairline`, `--tostack-btn`, `--tostack-drop`, `--tostack-lume` and `--tostack-on-lume` (accent), and the colors `green`, `mint`, `teal`, `blue`, `indigo`, `pink`, `red`, `orange`, `yellow`.

Glass needs something behind it to bend. Over video or busy images, `material="solid"` keeps text readable.

### Headless

`useToasts()` returns the live toast list if you want to render your own UI.

## Demo

```bash
npm install
npm run build
npx serve demo
```

## Testing

`demo/audit.js` is a browser test suite (37 checks: rendering, roles, timers, update by id, stacking and queue limits, Escape, close button, actions, promises, hover, every position, widths, theme). Serve the demo, open it, then run in the console:

```js
const s = document.createElement('script'); s.src = './audit.js'; document.body.append(s);
// when loaded
await runAudit(); // { passed, failed, results }
```

Keep the page visible while it runs: hidden tabs slow animation frames down.

## License

MIT
