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
  /** Outer width in px (jQuery passthrough on the window root). */
  outerWidth(): number;
  /** Outer height in px (jQuery passthrough on the window root). */
  outerHeight(): number;
  /**
   * Raise this window above its siblings in the z-order.
   *
   * Window.js assigns it directly (`$w.bringToFront = () => { ... }`), so it
   * exists at runtime even though it is not part of the base jQuery surface.
   */
  bringToFront(): this;
  /** Set the titlebar text (and the os-gui task, if any) to `text`. */
  title(text: string): OsGuiWindow;
  /** Read the current titlebar text back. */
  title(): string;
  /** Read the current titlebar text back (os-gui alias of `title()`). */
  getTitle(): string;
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
  /**
   * The window's root DOM node, without the `$` prefix that every other
   * jQuery-wrapped member carries.
   *
   * Window.js:129 assigns `$w.element = $w[0]`. There is no `$element`, and
   * declaring one here let `messageBox` read `undefined` and throw a TypeError
   * inside its own promise — which silently killed every confirmation dialog.
   */
  element: HTMLElement;
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
  /**
   * Closes every popup this bar opened (`MenuBar.js` sets `this.closeMenus`).
   *
   * Needed because MenuBar does not close its own popup when a checkbox or
   * radio item is picked — it runs the item's `toggle()` and stops there — so
   * the caller that opened a popup programmatically is the one that has to
   * close it. Optional so a caller never depends on a build that lacks it.
   */
  closeMenus?: () => void;
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