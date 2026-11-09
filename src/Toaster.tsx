import * as React from 'react';
import { useRef, useEffect, useState, useCallback, useLayoutEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import css from './styles.css?inline';
import { store, toast as api } from './store';
import type { Motion } from './motion';
import { ToastView, type ResolvedToast } from './ToastView';
import type { Theme, Toast, ToastPosition, ToastType, ToasterProps } from './types';

const DURATION: Record<ToastType, number> = {
  blank: 4000,
  success: 2500,
  error: 4000,
  warning: 4000,
  info: 3500,
  loading: Infinity,
  custom: 4000,
};

const TYPES: ToastType[] = ['blank', 'success', 'error', 'warning', 'info', 'loading', 'custom'];

const POSITIONS: ToastPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

/** Subscribe to the toast list. Use it to build your own toast UI. */
export function useToasts(): Toast[] {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

// Layout effects warn during server rendering; the server has no layout to measure anyway.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function useCss() {
  useIsoLayoutEffect(() => {
    if (document.getElementById('tostack-css')) return;
    const el = document.createElement('style');
    el.id = 'tostack-css';
    el.textContent = css;
    document.head.appendChild(el);
  }, []);
}

function useTheme(theme: Theme): 'light' | 'dark' {
  const [system, setSystem] = useState<'light' | 'dark'>('dark');
  useEffect(() => {
    if (theme !== 'system' || typeof matchMedia === 'undefined') return;
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const update = () => setSystem(mq.matches ? 'dark' : 'light');
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [theme]);
  return theme === 'system' ? system : theme;
}

function useHidden() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const update = () => setHidden(document.visibilityState === 'hidden');
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return hidden;
}

const defined = <T extends object>(o: T): Partial<T> => {
  const out: Partial<T> = {};
  for (const k in o) if (o[k] !== undefined) out[k] = o[k];
  return out;
};

function resolve(t: Toast, p: ToasterProps): ResolvedToast {
  const all = { ...(p.toastOptions ?? {}) } as Record<string, unknown>;
  TYPES.forEach((k) => delete all[k]);
  const typed = p.toastOptions?.[t.type] ?? {};
  const m = { ...all, ...typed, ...defined(t) } as Toast;
  return {
    ...m,
    position: m.position ?? p.position ?? 'top-center',
    duration: m.duration ?? DURATION[t.type],
    glow: m.glow ?? p.glow ?? false,
    closeButton: m.closeButton ?? p.closeButton ?? true,
    richColors: m.richColors ?? p.richColors ?? false,
    dismissible: m.dismissible ?? false,
  };
}

interface LaneProps {
  toasts: ResolvedToast[];
  position: ToastPosition;
  island: boolean;
  hold: (key: string, on: boolean) => void;
  gutter: number;
  reverseOrder: boolean;
  stiffness: number;
  damping: number;
  material: 'glass' | 'solid';
  visibleToasts: number;
  maxQueue: number;
}

const ISLAND = '__island';
const LAYER_H = 36;

/**
 * One position on screen. Shows up to `visibleToasts`: the newest in front, the rest tucked
 * behind it as thin layers. Hover (or a tap on touch) fans them out into a list. Toasts beyond
 * that wait in a queue and come forward one by one.
 */
function Lane(props: LaneProps) {
  const { toasts, position, island, hold, gutter, reverseOrder, stiffness, damping, material } = props;
  const max = Math.max(1, props.visibleToasts);

  const live = toasts.filter((t) => t.visible);
  const shown = live.slice(0, max);
  const waiting = live.slice(max);

  // Queue limit: drop the oldest waiting toasts, but never errors or loading ones.
  useEffect(() => {
    let extra = waiting.length - Math.max(0, props.maxQueue);
    for (let i = waiting.length - 1; i >= 0 && extra > 0; i--) {
      const t = waiting[i];
      if (t.type === 'error' || t.type === 'loading') continue;
      api.remove(t.id);
      extra--;
    }
  });

  // Fan out on hover; a short delay on leave so crossing the gutter does not collapse it.
  const [open, setOpen] = useState(false);
  const hovers = useRef(new Set<string>());
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>();
  const laneHold = useCallback(
    (key: string, on: boolean) => {
      hold(key, on);
      if (!key.startsWith('hover:')) return;
      if (on) hovers.current.add(key);
      else hovers.current.delete(key);
      clearTimeout(leaveTimer.current);
      if (hovers.current.size) setOpen(true);
      else leaveTimer.current = setTimeout(() => setOpen(false), 180);
    },
    [hold],
  );
  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const layered = shown.length > 1;
  const expanded = open && layered;
  useEffect(() => {
    hold('open:' + position, expanded);
    return () => hold('open:' + position, false);
  }, [expanded]);

  // Touch: a tap opens the stack, a tap anywhere else closes it.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      if (!(e.target as Element | null)?.closest?.('.tostack-t')) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown, true);
    return () => document.removeEventListener('pointerdown', onDown, true);
  }, [open]);
  const openRef = useRef(open);
  openRef.current = open;
  const layeredRef = useRef(layered);
  layeredRef.current = layered;
  const onTapStack = useCallback(() => {
    if (!layeredRef.current || openRef.current) return false;
    setOpen(true);
    return true;
  }, []);

  // Island: the front toast is the attached island; it keeps showing while it collapses.
  const front = island ? shown[0] : undefined;
  const lastFront = useRef<ResolvedToast | null>(null);
  if (front) lastFront.current = front;
  const islandToast = island ? front ?? lastFront.current : null;
  const [gen, setGen] = useState(0);

  // Everything else is a layer: shown toasts, plus dismissed ones animating out.
  const shownIds = new Set(shown.map((t) => t.id));
  const layers = toasts.filter((t) =>
    t.visible ? shownIds.has(t.id) && t.id !== front?.id : t.id !== islandToast?.id,
  );

  const motions = useRef(new Map<string, Motion>());
  const layersRef = useRef(layers);
  layersRef.current = layers;
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;
  const align = position.endsWith('left') ? 1 : position.endsWith('right') ? -1 : 0;

  const relayout = useCallback(() => {
    const exp = expandedRef.current;
    const list = layersRef.current.filter((t) => t.visible);
    const ordered = exp && reverseOrder ? [...list].reverse() : list;

    if (island) {
      const im = motions.current.get(ISLAND);
      im?.setZ(100);
      const iw = im?.naturalW ?? 0;
      const ih = im ? im.h.t : 0;
      let y = ih + gutter;
      ordered.forEach((t, i) => {
        const m = motions.current.get(t.id);
        if (!m) return;
        if (exp) {
          m.unlock();
          m.setY(y);
          m.setZ(90 - i);
          y += m.naturalH + gutter;
        } else {
          const d = i + 1;
          if (iw > 0) m.lock(Math.max(60, iw * (1 - 0.1 * d)), LAYER_H, LAYER_H / 2);
          m.setY(Math.max(0, ih - LAYER_H + 9 * d));
          m.setZ(90 - d);
        }
      });
      return;
    }

    const head = motions.current.get(list[0]?.id ?? '');
    const fw = head?.naturalW ?? 0;
    const fh = head?.naturalH ?? 0;
    let y = 0;
    ordered.forEach((t, i) => {
      const m = motions.current.get(t.id);
      if (!m) return;
      if (exp || i === 0) {
        m.unlock();
        m.setOx(0);
        m.setY(y);
        m.setZ(100 - i);
        y += m.naturalH + gutter;
      } else {
        if (fw > 0) {
          const w = fw * (1 - 0.06 * i);
          m.lock(w, fh, 26);
          m.setOx((align * (fw - w)) / 2);
        }
        m.setY(12 * i);
        m.setZ(100 - i);
      }
    });
  }, [gutter, reverseOrder, island, align]);

  const register = useCallback(
    (id: string, m: Motion | null) => {
      if (m) {
        motions.current.set(id, m);
        m.onSize = relayout;
      } else motions.current.delete(id);
      relayout();
    },
    [relayout],
  );
  const registerIsland = useCallback((_: string, m: Motion | null) => register(ISLAND, m), [register]);

  useLayoutEffect(relayout);

  return (
    <>
      {island && islandToast && (
        <ToastView
          key={'island' + gen}
          toast={islandToast}
          position={position}
          island
          material={material}
          exiting={!front}
          onExited={() => {
            api.remove(islandToast.id);
            lastFront.current = null;
            setGen((g) => g + 1);
          }}
          register={registerIsland}
          hold={laneHold}
          onTapStack={onTapStack}
          stiffness={stiffness}
          damping={damping}
        />
      )}
      {layers.map((t) => (
        <ToastView
          key={t.id}
          toast={t}
          position={position}
          island={false}
          material={material}
          exiting={!t.visible}
          onExited={() => api.remove(t.id)}
          register={register}
          hold={laneHold}
          onTapStack={onTapStack}
          stiffness={stiffness}
          damping={damping}
        />
      ))}
    </>
  );
}

export function Toaster(props: ToasterProps) {
  const {
    position = 'top-center',
    theme = 'system',
    island = 'auto',
    reverseOrder = false,
    gutter = 8,
    offset = 16,
    containerStyle,
    containerClassName,
    container,
    spring,
    material = 'glass',
    visibleToasts = 3,
    maxQueue = 3,
    minWidth = 300,
    maxWidth = 380,
  } = props;
  const px = (v: number | string) => (typeof v === 'number' ? `${v}px` : v);
  const sizeVars = {
    '--tostack-minw': `min(${px(minWidth)}, calc(100cqw - 24px))`,
    '--tostack-maxw': `min(${px(maxWidth)}, calc(100cqw - 24px))`,
  } as React.CSSProperties;

  const toasts = useToasts();
  const mode = useTheme(theme);
  const hidden = useHidden();
  useCss();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const holds = useRef(new Set<string>());
  const [held, setHeld] = useState(0);
  const hold = useCallback((key: string, on: boolean) => {
    const s = holds.current;
    if (on === s.has(key)) return;
    if (on) s.add(key);
    else s.delete(key);
    setHeld(s.size);
  }, []);

  const resolved = toasts.map((t) => resolve(t, props));
  const isIsland = (pos: ToastPosition) =>
    pos.endsWith('center') && (island === true || (island === 'auto' && pos === 'top-center'));

  const lanes = new Map<ToastPosition, ResolvedToast[]>();
  for (const t of resolved) {
    const pos = t.position as ToastPosition;
    if (!lanes.has(pos)) lanes.set(pos, []);
    lanes.get(pos)!.push(t);
  }
  // Only the front toast of each position counts down, so a stack plays out one by one.
  const fronts = new Set<string>();
  lanes.forEach((list) => {
    const first = list.find((t) => t.visible);
    if (first) fronts.add(first.id);
  });

  // Timers: pause while hovered, dragged, expanded or the tab is hidden.
  const timers = useRef(
    new Map<string, { rev: number; left: number; start: number | null; h?: ReturnType<typeof setTimeout> }>(),
  );
  useEffect(() => {
    const now = Date.now();
    const paused = held > 0 || hidden;
    const seen = new Set<string>();
    for (const t of resolved) {
      if (!t.visible || !Number.isFinite(t.duration)) continue;
      seen.add(t.id);
      let r = timers.current.get(t.id);
      if (!r || r.rev !== t.rev) {
        if (r?.h) clearTimeout(r.h);
        r = { rev: t.rev, left: t.duration, start: null };
        timers.current.set(t.id, r);
      }
      const run = !paused && fronts.has(t.id);
      if (run && r.start === null) {
        r.start = now;
        r.h = setTimeout(() => {
          timers.current.delete(t.id);
          t.onAutoClose?.(t);
          api.dismiss(t.id);
        }, Math.max(0, r.left));
      } else if (!run && r.start !== null) {
        clearTimeout(r.h);
        r.left -= now - r.start;
        r.start = null;
      }
    }
    timers.current.forEach((r, id) => {
      if (seen.has(id)) return;
      if (r.h) clearTimeout(r.h);
      timers.current.delete(id);
    });
  });

  useEffect(
    () => () => {
      timers.current.forEach((r) => r.h && clearTimeout(r.h));
      timers.current.clear();
    },
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const top = store.get().find((t) => t.visible);
      if (top) api.dismiss(top.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!mounted) return null;
  const target = container ?? document.body;
  const stiffness = spring?.stiffness ?? 260;
  const damping = spring?.damping ?? 26;

  return createPortal(
    <div
      className={'tostack-root' + (container ? ' tostack-contained' : '') + (containerClassName ? ' ' + containerClassName : '')}
      data-theme={mode}
      style={{ ...sizeVars, ...containerStyle }}
      role="region"
      aria-label="Notifications"
    >
      {POSITIONS.filter((p) => lanes.has(p)).map((pos) => {
        const isl = isIsland(pos);
        const top = pos.startsWith('top');
        const laneStyle: React.CSSProperties = {
          position: 'absolute',
          left: isl ? 0 : offset,
          right: isl ? 0 : offset,
          top: top ? (isl ? 0 : offset) : undefined,
          bottom: top ? undefined : isl ? 0 : offset,
          height: 0,
          pointerEvents: 'none',
        };
        return (
          <div key={pos} className="tostack-lane" style={laneStyle}>
            <Lane
              toasts={lanes.get(pos)!}
              position={pos}
              island={isl}
              visibleToasts={visibleToasts}
              maxQueue={maxQueue}
              hold={hold}
              gutter={gutter}
              reverseOrder={reverseOrder}
              stiffness={stiffness}
              damping={damping}
              material={material}
            />
          </div>
        );
      })}
    </div>,
    target,
  );
}
