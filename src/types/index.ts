import type { MenuDefinition } from '../components/molecules/MenuBar';

export interface File {
  name: string;
  content: string;
  folder: string;
  date: string;
  rawContent?: string;
}

/** Outcome of one remote write, as reported by the app that owns the destination. */
export interface RemoteSaveResult {
  ok: boolean;
  /**
   * The outcome in the user's language. The editor only displays it, which is
   * why the destination owns every word of it: an editor has no idea what a Drive
   * revision is, so it must not be the one describing it.
   */
  message: string;
}

/**
 * Write path handed to an editor app by the app that owns the destination.
 *
 * `openApp` payloads travel as the `detail` of a `CustomEvent` and reach
 * `customLaunch` by reference — there is no `structuredClone`, no `postMessage`
 * and no JSON round trip anywhere in `src/` — so this function member survives
 * the handoff. That only holds inside one realm: a real cross-document handoff
 * would go through the structured clone of `postMessage` and drop it.
 */
export interface RemoteSaveHandle {
  /** Writes the whole buffer to the destination. Reports failures, never throws. */
  save: (content: string) => Promise<RemoteSaveResult>;
}

/** Extra data passed to `openApp` / `customLaunch` when launching an app. */
export interface AppData {
  /** URL to open (iexplorer). */
  url?: string;
  /** Folder to open (portfolio). */
  folder?: string;
  /** File to display (markdownViewer). */
  file?: File;
  /** Write path back to the destination (notepad saving to Drive). */
  remoteSave?: RemoteSaveHandle;
  /** Dedup key for multi-instance apps. */
  windowKey?: string;
  /** Window title override. */
  title?: string;
}

export interface WindowConfig {
  id: string;
  appId: string;
  title: string;
  icon?: string;
  content: React.ReactNode;
  isMinimized: boolean;
  isMaximized: boolean;
  isActive: boolean;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  currentPosition: { x: number; y: number } | null;
  centered: boolean;
  zIndex: number;
  windowKey?: string;
  animationState?: 'opening' | 'closing' | 'minimizing' | 'restoring' | null;
  menu?: MenuDefinition | null;
}

export interface AppDefinition {
  id: string;
  title: string;
  icon: string;
  component: React.ComponentType<{ file?: File }>;
  defaultSize: { width: number; height: number };
  centered: boolean;
  singleInstance?: boolean;
  /** If set, this function is called instead of creating a React Window (e.g. for os-gui native windows) */
  customLaunch?: (appData?: AppData) => void;
}

/** Webamp player instance type (webamp ships its own type definitions). */
export type WebampPlayer = InstanceType<typeof import('webamp').default>;
