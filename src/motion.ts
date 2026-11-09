/** Damped spring, integrated with small fixed sub-steps for stable, smooth motion. */
export class Spring {
  x: number;
  v = 0;
  t: number;
  constructor(x: number, public k = 260, public c = 26) {
    this.x = this.t = x;
  }
  to(t: number) {
    this.t = t;
  }
  jump(x: number) {
    this.x = this.t = x;
    this.v = 0;
  }
  step(dt: number) {
    const a = -this.k * (this.x - this.t) - this.c * this.v;
    this.v += a * dt;
    this.x += this.v * dt;
  }
  settle(): boolean {
    if (Math.abs(this.x - this.t) < 0.02 && Math.abs(this.v) < 0.05) {
      this.x = this.t;
      this.v = 0;
      return true;
    }
    return false;
  }
}

interface Tickable {
  tick(dt: number): boolean;
}

const running = new Set<Tickable>();
let raf = 0;
let last = 0;

function loop(now: number) {
  raf = 0;
  // Use the real time between frames (sub-stepped below), so a slow or janky page still
  // finishes each animation on time instead of stretching it out.
  const dt = last ? Math.min((now - last) / 1000, 0.25) : 1 / 60;
  last = now;
  running.forEach((t) => {
    if (!t.tick(dt)) running.delete(t);
  });
  if (running.size) raf = requestAnimationFrame(loop);
  else last = 0;
}

export function animate(t: Tickable) {
  running.add(t);
  if (!raf && typeof requestAnimationFrame !== 'undefined') raf = requestAnimationFrame(loop);
}

export function stopAnimating(t: Tickable) {
  running.delete(t);
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Shoulder size for edge-attached toasts (the concave curve that meets the screen edge). */
export const SHOULDER = 14;
const COLLAPSED_W = 84;

export interface MotionEls {
  root?: HTMLDivElement | null;
  svg?: SVGSVGElement | null;
  fill?: SVGPathElement | null;
  line?: SVGPathElement | null;
  glow?: SVGPathElement | null;
  spec?: SVGPathElement | null;
  mat?: HTMLDivElement | null;
  clip?: HTMLDivElement | null;
}

/**
 * Drives one toast surface. Springs run outside React and write straight to the DOM,
 * so animation never causes re-renders.
 */
export class Motion {
  w: Spring;
  h: Spring;
  r: Spring;
  y = new Spring(0, 300, 32);
  p = new Spring(0, 260, 26);
  dx = new Spring(0, 420, 36);
  dy = new Spring(0, 420, 36);
  /** Content visibility: 0 while tucked behind the front toast. */
  cv = new Spring(1, 300, 30);
  /** Horizontal shift that keeps a narrower layer centred under the front toast. */
  ox = new Spring(0, 300, 32);
  els: MotionEls = {};

  island = false;
  attached = false;
  bottom = false;
  center = true;
  reduced = false;

  entered = false;
  exiting = false;
  onExited?: () => void;
  onSize?: () => void;

  constructor(stiffness = 260, damping = 26) {
    this.w = new Spring(0, stiffness, damping);
    this.h = new Spring(0, stiffness, damping);
    this.r = new Spring(24, stiffness, damping);
  }

  private springs() {
    return [this.w, this.h, this.r, this.y, this.p, this.dx, this.dy, this.cv, this.ox];
  }

  private last: [number, number, number] = [0, 0, 24];
  private locked: [number, number, number] | null = null;

  /** Size the content asks for, even while the surface is locked to a layer size. */
  get naturalW() {
    return this.entered ? this.last[0] : 0;
  }
  get naturalH() {
    return this.entered ? this.last[1] : 0;
  }

  size(W: number, H: number, R: number) {
    this.last = [W, H, R];
    const [tw, th, tr] = this.locked ?? this.last;
    if (!this.entered) {
      this.entered = true;
      if (this.island) {
        this.w.jump(Math.min(tw, COLLAPSED_W));
        this.h.jump(0);
        this.p.jump(1);
      } else {
        this.w.jump(tw);
        this.h.jump(th);
        this.p.jump(0);
      }
      this.r.jump(tr);
    }
    this.w.to(tw);
    this.h.to(th);
    this.r.to(tr);
    if (!this.exiting) this.p.to(1);
    if (this.reduced) this.springs().forEach((s) => s.jump(s.t));
    this.onSize?.();
    this.kick();
  }

  setY(y: number) {
    if (!this.entered || (this.y.x === 0 && this.p.x === 0)) this.y.jump(y);
    else this.y.to(y);
    this.kick();
  }

  /** Tuck this toast behind the front one at the given size; its content fades out. */
  lock(W: number, H: number, R: number) {
    this.locked = [W, H, R];
    this.cv.to(0);
    if (this.entered) {
      this.w.to(W);
      this.h.to(H);
      this.r.to(R);
    } else this.cv.jump(0);
    this.kick();
  }

  unlock() {
    if (!this.locked) return;
    this.locked = null;
    this.cv.to(1);
    if (this.entered) {
      this.w.to(this.last[0]);
      this.h.to(this.last[1]);
      this.r.to(this.last[2]);
    }
    this.kick();
  }

  setOx(x: number) {
    this.ox.to(x);
    this.kick();
  }

  setZ(z: number) {
    if (this.els.root) this.els.root.style.zIndex = String(z);
  }

  drag(dx: number, dy: number) {
    this.dx.jump(dx);
    this.dy.jump(dy);
    this.kick();
  }

  release() {
    this.dx.to(0);
    this.dy.to(0);
    this.kick();
  }

  fling(dx: number, dy: number) {
    this.dx.to(dx);
    this.dy.to(dy);
    this.kick();
  }

  exit(cb: () => void) {
    this.onExited = cb;
    if (this.exiting) return;
    this.exiting = true;
    if (this.island) {
      this.w.to(Math.min(this.w.t, COLLAPSED_W));
      this.h.to(0);
    }
    this.p.to(0);
    if (this.reduced) this.springs().forEach((s) => s.jump(s.t));
    this.kick();
  }

  /** A new toast arrived while the island was collapsing: grow back. */
  revive() {
    if (!this.exiting) return;
    this.exiting = false;
    this.onExited = undefined;
    this.size(...this.last);
  }

  kick() {
    animate(this);
  }

  tick(dt: number): boolean {
    const n = Math.max(1, Math.round(dt * 240));
    const h = dt / n;
    const all = this.springs();
    for (let i = 0; i < n; i++) for (const s of all) s.step(h);
    let idle = true;
    for (const s of all) if (!s.settle()) idle = false;
    this.render();
    if (this.exiting) {
      const done = this.island ? this.h.x < 0.6 : this.p.x < 0.02;
      if (done) {
        const cb = this.onExited;
        this.onExited = undefined;
        cb?.();
        return false;
      }
    }
    return !idle;
  }

  render() {
    const { root, svg, fill, line, glow, spec, mat, clip } = this.els;
    if (!root || !svg || !fill || !line || !clip) return;
    const S = this.attached ? SHOULDER : 0;
    const W = Math.max(0, this.w.x);
    const H = Math.max(0, this.h.x);
    const s = this.attached ? Math.min(S, H * 0.6) : 0;
    const R = this.attached
      ? clamp(this.r.x, 0, Math.min(Math.max(0, H - s), W / 2))
      : clamp(this.r.x, 0, Math.min(H / 2, W / 2));
    const FW = W + 2 * S;

    let stroke: string;
    let area: string;
    if (this.attached) {
      const x0 = S - s;
      stroke =
        `M${x0} 0A${s} ${s} 0 0 1 ${S} ${s}V${H - R}A${R} ${R} 0 0 0 ${S + R} ${H}` +
        `H${S + W - R}A${R} ${R} 0 0 0 ${S + W} ${H - R}V${s}A${s} ${s} 0 0 1 ${S + W + s} 0`;
      area = stroke + 'Z';
    } else {
      area =
        `M${R} 0H${W - R}A${R} ${R} 0 0 1 ${W} ${R}V${H - R}A${R} ${R} 0 0 1 ${W - R} ${H}` +
        `H${R}A${R} ${R} 0 0 1 0 ${H - R}V${R}A${R} ${R} 0 0 1 ${R} 0Z`;
      stroke = area;
    }

    root.style.width = `${FW}px`;
    root.style.height = `${H}px`;
    svg.setAttribute('width', String(FW));
    svg.setAttribute('height', String(Math.max(H, 0.01)));
    svg.setAttribute('viewBox', `0 0 ${FW} ${Math.max(H, 0.01)}`);
    fill.setAttribute('d', area);
    line.setAttribute('d', stroke);
    glow?.setAttribute('d', stroke);
    spec?.setAttribute('d', stroke);
    if (mat) {
      mat.style.width = `${FW}px`;
      mat.style.height = `${H}px`;
      mat.style.clipPath = `path('${area}')`;
    }

    clip.style.left = `${S}px`;
    clip.style.width = `${W}px`;
    clip.style.height = `${H}px`;
    clip.style.borderRadius = this.attached
      ? this.bottom
        ? `${R}px ${R}px 0 0`
        : `0 0 ${R}px ${R}px`
      : `${R}px`;

    const p = clamp(this.p.x, 0, 1.2);
    const dir = this.bottom ? -1 : 1;
    const ty = dir * this.y.x + this.dy.x + (this.island ? 0 : (1 - p) * -16 * dir);
    const sc = this.island ? 1 : 0.9 + 0.1 * p;
    root.style.transform =
      `${this.center ? 'translateX(-50%) ' : ''}translate3d(${this.dx.x + this.ox.x}px, ${ty}px, 0) scale(${sc})`;
    // Opacity goes on the layers, never on the root: a translucent root would cut the glass
    // off from the page behind it (backdrop-filter only sees inside its nearest backdrop root).
    root.style.opacity = '1';
    const op = String(this.island ? clamp(H / 6, 0, 1) : clamp(p, 0, 1));
    svg.style.opacity = op;
    clip.style.opacity = String(Number(op) * clamp(this.cv.x, 0, 1));
    if (mat) mat.style.opacity = op;

  }
}
