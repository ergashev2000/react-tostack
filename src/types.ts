import type * as React from 'react';

export type ToastType = 'blank' | 'success' | 'error' | 'warning' | 'info' | 'loading' | 'custom';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type Theme = 'light' | 'dark' | 'system';

export type Renderable = React.ReactNode;

export type ValueFunction<TValue, TArg> = (arg: TArg) => TValue;
export type ValueOrFunction<TValue, TArg> = TValue | ValueFunction<TValue, TArg>;

export interface IconTheme {
  /** Icon background (circle) color. */
  primary: string;
  /** Glyph color drawn on top of `primary`. */
  secondary: string;
}

export interface ToastAction {
  label: string;
  /** Return `false` to keep the toast open after the click. */
  onClick?: (toast: Toast) => void | boolean;
  /** Filled with the toast accent color. */
  primary?: boolean;
}

export interface ToastOptions {
  /** Reuse an id to update an existing toast in place (it morphs). */
  id?: string;
  /** Milliseconds before auto dismiss. `Infinity` keeps it open. */
  duration?: number;
  position?: ToastPosition;
  /** Custom icon. Emoji, any element, or `null` to hide it. */
  icon?: Renderable;
  iconTheme?: IconTheme;
  className?: string;
  style?: React.CSSProperties;
  ariaProps?: {
    role: 'status' | 'alert';
    'aria-live': 'assertive' | 'off' | 'polite';
  };
  /** Secondary text, shown when the toast is expanded (tap it). */
  description?: Renderable;
  /** Small text on the right side of the compact row, e.g. "2:14" or "Now". */
  accessory?: Renderable;
  /** Buttons shown when the toast is expanded. */
  actions?: ToastAction[];
  /** Start expanded. */
  expanded?: boolean;
  /** Animated gradient edge. Default `false`. */
  glow?: boolean;
  /** Show a close (×) button. Default `true`. */
  closeButton?: boolean;
  /** Any CSS color. Overrides the type accent (glow, title, primary button). */
  accent?: string;
  /** Tints the toast surface with the accent color. */
  richColors?: boolean;
  /** Allow swipe to dismiss. Default `false`: the close button closes toasts. */
  dismissible?: boolean;
  onClick?: (toast: Toast) => void;
  onDismiss?: (toast: Toast) => void;
  onAutoClose?: (toast: Toast) => void;
}

export interface Toast extends ToastOptions {
  id: string;
  type: ToastType;
  message: ValueOrFunction<Renderable, Toast>;
  createdAt: number;
  visible: boolean;
  /** Bumped every time the toast content is updated. */
  rev: number;
}

export type DefaultToastOptions = ToastOptions & {
  [key in ToastType]?: ToastOptions;
};

export interface SpringConfig {
  /** Higher is snappier. Default 260. */
  stiffness?: number;
  /** Higher settles with less bounce. Default 26. */
  damping?: number;
}

export interface ToasterProps {
  /** Default `top-center`. */
  position?: ToastPosition;
  /** Default `system`. */
  theme?: Theme;
  /**
   * Dynamic Island mode: one morphing toast attached to the screen edge,
   * with a counter bubble for waiting toasts.
   * `auto` (default) turns it on for `top-center` only.
   */
  island?: boolean | 'auto';
  /** Newest toast at the far end instead of next to the edge. */
  reverseOrder?: boolean;
  /** Space between stacked toasts in px. Default 8. */
  gutter?: number;
  /** Distance from the screen edges in px. Default 16. */
  offset?: number;
  toastOptions?: DefaultToastOptions;
  containerStyle?: React.CSSProperties;
  containerClassName?: string;
  /** Element to render into. Defaults to `document.body` (fixed). */
  container?: HTMLElement | null;
  /** Animated glow edge for every toast. Default `false`. */
  glow?: boolean;
  /** Close (×) button on every toast. Default `true`. */
  closeButton?: boolean;
  richColors?: boolean;
  spring?: SpringConfig;
  /**
   * `glass` (default): translucent, blurs the page behind the toast.
   * `solid`: opaque black (dark) or white (light) surface.
   */
  material?: 'glass' | 'solid';
  /** Narrowest a toast gets, so a stack lines up. Number = px. Default 300. */
  minWidth?: number | string;
  /** Widest a toast gets; expanded toasts use this width. Number = px. Default 380. */
  maxWidth?: number | string;
  /** Toasts shown at once per position: the newest in front, the rest layered behind. Default 3. */
  visibleToasts?: number;
  /** Toasts allowed to wait beyond `visibleToasts`. The oldest extra are dropped (never errors or loading). Default 3. */
  maxQueue?: number;
}
