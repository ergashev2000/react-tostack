import * as React from 'react';
import { Motion } from './motion';
import { resolveValue, toast as api } from './store';
import { ErrorIcon, InfoIcon, LoaderIcon, SuccessIcon, WarningIcon } from './icons';
import type { IconTheme, Toast, ToastPosition, ToastType } from './types';

/** A toast with every option filled in from Toaster defaults. */
export interface ResolvedToast extends Toast {
  duration: number;
  glow: boolean;
  closeButton: boolean;
  richColors: boolean;
  dismissible: boolean;
}

const ACCENT: Record<ToastType, string> = {
  blank: 'var(--tostack-lume)',
  custom: 'var(--tostack-lume)',
  success: 'var(--tostack-green)',
  error: 'var(--tostack-red)',
  warning: 'var(--tostack-orange)',
  info: 'var(--tostack-blue)',
  loading: 'var(--tostack-lume)',
};

const ON_LUME = new Set<ToastType>(['blank', 'custom', 'loading']);

const GLOW: Record<ToastType, string[]> = {
  blank: ['var(--tostack-fg2)', 'var(--tostack-hairline)'],
  custom: ['var(--tostack-fg2)', 'var(--tostack-hairline)'],
  success: ['var(--tostack-green)', 'var(--tostack-mint)', 'var(--tostack-teal)', 'var(--tostack-green)'],
  error: ['var(--tostack-red)', 'var(--tostack-pink)', 'var(--tostack-orange)', 'var(--tostack-red)'],
  warning: ['var(--tostack-orange)', 'var(--tostack-yellow)', 'var(--tostack-orange)'],
  info: ['var(--tostack-blue)', 'var(--tostack-teal)', 'var(--tostack-indigo)', 'var(--tostack-blue)'],
  loading: [
    'var(--tostack-green)',
    'var(--tostack-yellow)',
    'var(--tostack-orange)',
    'var(--tostack-red)',
    'var(--tostack-pink)',
    'var(--tostack-blue)',
    'var(--tostack-green)',
  ],
};

const accentOf = (t: ResolvedToast) => t.accent ?? t.iconTheme?.primary ?? ACCENT[t.type];

function Icon({ t }: { t: ResolvedToast }) {
  if (t.icon !== undefined) {
    return t.icon === null || t.icon === false ? null : <div className="tostack-ic">{t.icon}</div>;
  }
  const theme: IconTheme = t.iconTheme ?? { primary: accentOf(t), secondary: '#fff' };
  const map: Partial<Record<ToastType, React.FC<{ theme: IconTheme }>>> = {
    success: SuccessIcon,
    error: ErrorIcon,
    warning: WarningIcon,
    info: InfoIcon,
    loading: LoaderIcon,
  };
  const C = map[t.type];
  return C ? (
    <div className="tostack-ic">
      <C theme={t.type === 'loading' && !t.iconTheme ? { primary: 'var(--tostack-fg)', secondary: '' } : theme} />
    </div>
  ) : null;
}

const hasMore = (t: Toast) => t.description != null || (t.actions?.length ?? 0) > 0;

function Content({ t, expanded }: { t: ResolvedToast; expanded: boolean }) {
  const message = resolveValue(t.message, t);
  if (t.type === 'custom') return <>{message}</>;
  return (
    <>
      <div className="tostack-row">
        <Icon t={t} />
        <div className="tostack-title">{message}</div>
        {t.accessory != null && <div className="tostack-acc">{t.accessory}</div>}
        {t.closeButton && (
          <button
            type="button"
            className="tostack-close"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              api.dismiss(t.id);
            }}
          >
            <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      {expanded && hasMore(t) && (
        <div className="tostack-x">
          {t.description != null && <div className="tostack-desc">{t.description}</div>}
          {t.actions && t.actions.length > 0 && (
            <div className="tostack-actions">
              {t.actions.map((a, i) => (
                <button
                  key={i}
                  type="button"
                  className={'tostack-btn' + (a.primary ? ' is-primary' : '')}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (a.onClick?.(t) !== false) api.dismiss(t.id);
                  }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

interface Layer {
  key: string;
  t: ResolvedToast;
  expanded: boolean;
  out?: boolean;
}

export interface ToastViewProps {
  toast: ResolvedToast;
  position: ToastPosition;
  island: boolean;
  material: 'glass' | 'solid';
  exiting: boolean;
  onExited: () => void;
  register?: (id: string, m: Motion | null) => void;
  hold: (key: string, on: boolean) => void;
  /** Tap on a collapsed stack: return true when the lane handled it (opened the stack). */
  onTapStack?: () => boolean;
  stiffness: number;
  damping: number;
}

const rubber = (d: number, limit = 60) => Math.sign(d) * limit * (1 - 1 / (Math.abs(d) / limit + 1));

export function ToastView(props: ToastViewProps) {
  const { toast: t, position, island, material, exiting, onExited, register, hold, onTapStack } = props;
  const bottom = position.startsWith('bottom');
  const center = position.endsWith('center');

  const motion = React.useMemo(() => new Motion(props.stiffness, props.damping), []);
  motion.island = island;
  motion.attached = island;
  motion.bottom = bottom;
  motion.center = center;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const fillRef = React.useRef<SVGPathElement>(null);
  const lineRef = React.useRef<SVGPathElement>(null);
  const glowRef = React.useRef<SVGPathElement>(null);
  const specRef = React.useRef<SVGPathElement>(null);
  const matRef = React.useRef<HTMLDivElement>(null);
  const clipRef = React.useRef<HTMLDivElement>(null);
  const layerEls = React.useRef(new Map<string, HTMLDivElement>());

  const gid = 'tostack-g' + React.useId().replace(/[^a-zA-Z0-9]/g, '');

  const [exp, setExp] = React.useState<{ id: string; on: boolean } | null>(null);
  const expanded = exp && exp.id === t.id ? exp.on : !!t.expanded;
  const contentKey = `${t.id}:${t.rev}:${expanded ? 1 : 0}`;

  const [layers, setLayers] = React.useState<Layer[]>(() => [{ key: contentKey, t, expanded }]);

  // New content: keep the old layer to blur it out while the new one blurs in.
  React.useLayoutEffect(() => {
    setLayers((ls) =>
      ls[ls.length - 1].key === contentKey
        ? ls
        : [...ls.map((l) => ({ ...l, out: true })), { key: contentKey, t, expanded }],
    );
  }, [contentKey]);

  React.useEffect(() => {
    if (!layers.some((l) => l.out)) return;
    const id = setTimeout(() => setLayers((ls) => ls.filter((l) => !l.out)), 320);
    return () => clearTimeout(id);
  }, [layers]);

  React.useLayoutEffect(() => {
    motion.els = {
      root: rootRef.current,
      svg: svgRef.current,
      fill: fillRef.current,
      line: lineRef.current,
      glow: glowRef.current,
      spec: specRef.current,
      mat: matRef.current,
      clip: clipRef.current,
    };
    motion.reduced =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    register?.(t.id, motion);
    return () => register?.(t.id, null);
  }, [t.id]);

  // Measure the newest layer and spring the surface to fit it.
  const newest = layers[layers.length - 1];
  React.useLayoutEffect(() => {
    const el = layerEls.current.get(newest.key);
    if (!el) return;
    const measure = () => {
      const W = el.offsetWidth;
      const H = el.offsetHeight;
      const R = island ? (newest.expanded ? 32 : 22) : 26;
      motion.size(W, H, R);
    };
    measure();
    if (el.classList.contains('is-in')) {
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('is-in')));
    }
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [newest.key, island]);


  React.useEffect(() => {
    if (exiting) motion.exit(onExited);
    else motion.revive();
  }, [exiting]);

  // Expanded toasts hold the timers until collapsed.
  React.useEffect(() => {
    hold('x:' + t.id, expanded);
    return () => hold('x:' + t.id, false);
  }, [expanded, t.id]);

  // Hover is tracked per view, not per toast: the island view swaps toasts while the pointer
  // stays put, and a toast can vanish under the pointer without a pointerleave.
  const hoverKey = 'hover:' + gid;
  const hovered = React.useRef(false);
  const setHover = (on: boolean) => {
    if (hovered.current === on) return;
    hovered.current = on;
    hold(hoverKey, on);
  };

  // Pointer: tap to expand, swipe toward the edge (or sideways) to dismiss.
  const drag = React.useRef<{ x: number; y: number; t: number; moved: boolean; id: number } | null>(null);

  // Never leave a hover or drag hold behind, or timers would stay paused and the stack open.
  React.useEffect(
    () => () => {
      if (hovered.current) hold(hoverKey, false);
      if (drag.current?.moved) hold('drag', false);
    },
    [],
  );

  // A new toast in the island starts centred, even if the last one was flung away.
  React.useEffect(() => {
    if (island) motion.release();
  }, [t.id]);
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    drag.current = { x: e.clientX, y: e.clientY, t: performance.now(), moved: false, id: e.pointerId };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d && e.pointerType === 'mouse') setHover(true);
    if (!d || d.id !== e.pointerId) return;
    let dx = e.clientX - d.x;
    let dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 6) return;
    if (!d.moved) {
      d.moved = true;
      hold('drag', true);
    }
    const toEdge = bottom ? 1 : -1;
    const canSwipe = t.dismissible;
    dy = canSwipe && Math.sign(dy) === toEdge ? dy : rubber(dy, island ? 30 : 24);
    dx = canSwipe && !island ? dx : rubber(dx, 24);
    motion.drag(dx, dy);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved) {
      if (onTapStack?.()) return;
      if (hasMore(t)) setExp({ id: t.id, on: !expanded });
      t.onClick?.(t);
      return;
    }
    hold('drag', false);
    const dt = Math.max(1, performance.now() - d.t);
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    const toEdge = bottom ? 1 : -1;
    const fast = Math.abs(dy) / dt > 0.5;
    if (t.dismissible && Math.sign(dy) === toEdge && (Math.abs(dy) > 36 || fast)) {
      motion.fling(0, toEdge * 80);
      setHover(false);
      api.dismiss(t.id);
    } else if (t.dismissible && !island && Math.abs(dx) > 90) {
      motion.fling(Math.sign(dx) * 260, 0);
      setHover(false);
      api.dismiss(t.id);
    } else if (island && hasMore(t) && Math.sign(dy) === -toEdge && Math.abs(dy) > 18) {
      setExp({ id: t.id, on: true });
      motion.release();
    } else {
      motion.release();
    }
  };

  const accent = accentOf(t);
  const glowStops = t.accent ? [t.accent, 'var(--tostack-fg2)', t.accent] : GLOW[t.type];
  const { background, ...restStyle } = t.style ?? {};
  const style = {
    ...restStyle,
    '--tostack-accent': accent,
    ...(ON_LUME.has(t.type) && !t.accent && !t.iconTheme ? { '--tostack-on-accent': 'var(--tostack-on-lume)' } : null),
    ...(background
      ? { '--tostack-fill': background }
      : t.richColors && t.type !== 'blank' && t.type !== 'custom'
        ? { '--tostack-fill': `color-mix(in srgb, ${accent} 16%, var(--tostack-bg))` }
        : null),
  } as React.CSSProperties;

  const aria = t.ariaProps ?? {
    role: t.type === 'error' ? 'alert' : 'status',
    'aria-live': t.type === 'error' ? 'assertive' : 'polite',
  };

  return (
    <div
      ref={rootRef}
      className={
        'tostack-t' +
        (island ? ' is-attached' : '') +
        (island && bottom ? ' is-flip' : '') +
        (t.richColors ? ' tostack-rich' : '') +
        (t.className ? ' ' + t.className : '')
      }
      data-pos={position}
      data-type={t.type}
      data-glow={t.glow ? 'on' : 'off'}
      data-material={material}
      style={{ ...style, transformOrigin: bottom ? '50% 100%' : '50% 0%', opacity: 0 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(false)}
    >
      <div ref={matRef} className="tostack-mat" aria-hidden="true" />
      <svg ref={svgRef} className="tostack-svg" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
            {glowStops.map((c, i) => (
              <stop key={i} offset={i / (glowStops.length - 1)} style={{ stopColor: c }} />
            ))}
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="0 .5 .5"
              to="360 .5 .5"
              dur={t.type === 'loading' ? '2.4s' : '7s'}
              repeatCount="indefinite"
            />
          </linearGradient>
          <linearGradient id={gid + 's'} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--tostack-spec)' }} />
            <stop offset="0.45" style={{ stopColor: 'var(--tostack-spec)', stopOpacity: 0 }} />
            <stop offset="1" style={{ stopColor: 'var(--tostack-spec)', stopOpacity: 0.35 }} />
          </linearGradient>
          <filter id={gid + 'b'} x="-20%" y="-60%" width="140%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        <path ref={fillRef} className="tostack-fill" />
        <path ref={specRef} className="tostack-spec" stroke={`url(#${gid}s)`} />
        <path ref={glowRef} className="tostack-glow" stroke={`url(#${gid})`} filter={`url(#${gid}b)`} />
        <path ref={lineRef} className="tostack-line" stroke={`url(#${gid})`} />
      </svg>
      <div ref={clipRef} className="tostack-clip" {...aria}>
        {layers.map((l, i) => (
          <div
            key={l.key}
            ref={(el) => {
              if (el) layerEls.current.set(l.key, el);
              else layerEls.current.delete(l.key);
            }}
            className={
              'tostack-c' +
              (l.expanded ? ' is-x' : '') +
              (l.out ? ' is-out' : i > 0 || island ? ' is-in' : '')
            }
            aria-hidden={l.out || undefined}
          >
            <Content t={l.t} expanded={l.expanded} />
          </div>
        ))}
      </div>
    </div>
  );
}
