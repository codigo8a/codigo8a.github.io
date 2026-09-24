/**
 * Type declarations for the vendored os-gui library (public/os-gui).
 *
 * os-gui is a plain-JS library (Window.js / MenuBar.js) loaded via <script>
 * tags in index.html. Its classes are exposed on `window` and its elements
 * are wrapped in jQuery objects. These interfaces cover only the surface
 * actually used by src/, so they are intentionally minimal.
 */

/** Minimal jQuery surface used by os-gui elements ($win, $content, ...). */
export interface OsGuiJQuery {
  append(...children: (Node | string)[]): this;
  after(element: HTMLElement): this;
  addClass(className: string): this;
  removeClass(className: string): this;
  show(): this;
  hide(): this;
  focus(): this;
  blur(): this;
  is(selector: string): boolean;
  off(eventName: string, handler: (...args: unknown[]) => void): this;
  [index: number]: HTMLElement;
}

/** Options accepted by the os-gui `$Window` constructor. */
export interface OsGuiWindowOptions {
  title: string;
  icons?: { 16?: string; 32?: string; any?: string };
  minWidth?: number;
  minHeight?: number;
  resizable?: boolean;
  minimizeButton?: boolean;
  maximizeButton?: boolean;
}

/** An os-gui window instance (a jQuery-like object with window helpers). */
export interface OsGuiWindow {
  css(property: string): string;
  css(properties: Record<string, string | number>): this;
  center(): void;
  onClosed(callback: () => void): void;
  close(): void;
  show(): this;
  hide(): this;
  focus(): this;
  blur(): this;
  is(selector: string): boolean;
  removeClass(className: string): this;
  addClass(className: string): this;
  closed: boolean;
  minimize: () => void;
  $content: OsGuiJQuery;
  $titlebar: OsGuiJQuery;
  $minimize: OsGuiJQuery | null;
  $element: OsGuiJQuery;
}

/** A menu item as consumed by `new MenuBar(...)`. */
export interface OsGuiMenuItem {
  label?: string;
  shortcutLabel?: string;
  enabled?: boolean;
  checked?: boolean;
  type?: 'checkbox' | 'radio';
  action?: () => void;
  submenu?: OsGuiMenuItem[];
  checkbox?: { check?: () => boolean; toggle?: () => void };
  separator?: boolean;
}

/** Menu definition object passed to `new MenuBar(...)`: title → items. */
export interface OsGuiMenuDefinition {
  [menuTitle: string]: OsGuiMenuItem[];
}

/** An os-gui menu bar instance (os-gui exposes only its DOM element). */
export interface OsGuiMenuBar {
  element: HTMLElement;
}

declare global {
  interface Window {
    /** os-gui Window constructor (Window.js). */
    $Window: (options: OsGuiWindowOptions) => OsGuiWindow;
    /** os-gui MenuBar constructor (MenuBar.js). */
    MenuBar: new (menus: OsGuiMenuDefinition) => OsGuiMenuBar;
  }

  /** Global jQuery `$` (loaded via <script> before os-gui in index.html). */
  var $: (win: Window) => OsGuiJQuery;
}