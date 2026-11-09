import type {
  Renderable,
  Toast,
  ToastOptions,
  ToastType,
  ValueOrFunction,
} from './types';

type Listener = () => void;
type Message = ValueOrFunction<Renderable, Toast>;

let toasts: Toast[] = [];
const listeners = new Set<Listener>();
let seq = 0;

const emit = () => {
  toasts = [...toasts];
  listeners.forEach((l) => l());
};

export const store = {
  get: (): Toast[] => toasts,
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

function upsert(type: ToastType, message: Message, opts: ToastOptions = {}): string {
  const id = opts.id ?? `tostack-${++seq}`;
  const i = toasts.findIndex((t) => t.id === id);
  if (i >= 0) {
    const prev = toasts[i];
    // Updates don't inherit options (a loading toast's Infinity duration must not stick).
    toasts[i] = {
      ...opts,
      position: opts.position ?? prev.position,
      id,
      type,
      message,
      createdAt: prev.createdAt,
      visible: true,
      rev: prev.rev + 1,
    };
  } else {
    toasts.unshift({ ...opts, id, type, message, createdAt: Date.now(), visible: true, rev: 0 });
  }
  emit();
  return id;
}

function dismiss(id?: string): void {
  let changed = false;
  toasts = toasts.map((t) => {
    if ((id === undefined || t.id === id) && t.visible) {
      changed = true;
      t.onDismiss?.(t);
      return { ...t, visible: false };
    }
    return t;
  });
  if (changed) emit();
}

function remove(id?: string): void {
  toasts = id === undefined ? [] : toasts.filter((t) => t.id !== id);
  emit();
}

export type PromiseMessages<T> = {
  loading: Renderable;
  success: ValueOrFunction<Renderable, T>;
  error: ValueOrFunction<Renderable, any>;
};

type ToastFn = (message: Message, options?: ToastOptions) => string;

export interface ToastHandler extends ToastFn {
  success: ToastFn;
  error: ToastFn;
  warning: ToastFn;
  info: ToastFn;
  loading: ToastFn;
  custom: ToastFn;
  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    messages: PromiseMessages<T>,
    options?: ToastOptions & { success?: ToastOptions; error?: ToastOptions; loading?: ToastOptions },
  ) => Promise<T>;
  /** Animate a toast (or all toasts) out. */
  dismiss: (id?: string) => void;
  /** Remove instantly, without animation. */
  remove: (id?: string) => void;
}

const make =
  (type: ToastType): ToastFn =>
  (message, options) =>
    upsert(type, message, options);

const resolveValue = <T, A>(v: ValueOrFunction<T, A>, arg: A): T =>
  typeof v === 'function' ? (v as (a: A) => T)(arg) : v;

export const toast: ToastHandler = Object.assign(make('blank'), {
  success: make('success'),
  error: make('error'),
  warning: make('warning'),
  info: make('info'),
  loading: make('loading'),
  custom: make('custom'),
  dismiss,
  remove,
  promise<T>(
    promise: Promise<T> | (() => Promise<T>),
    msgs: PromiseMessages<T>,
    opts: ToastOptions & { success?: ToastOptions; error?: ToastOptions; loading?: ToastOptions } = {},
  ): Promise<T> {
    const { success, error, loading, ...base } = opts;
    const id = upsert('loading', msgs.loading, { ...base, ...loading });
    const p = typeof promise === 'function' ? promise() : promise;
    p.then(
      (value) => {
        upsert('success', resolveValue(msgs.success, value), { ...base, ...success, id });
      },
      (err) => {
        upsert('error', resolveValue(msgs.error, err), { ...base, ...error, id });
      },
    );
    return p;
  },
});

export { resolveValue };
