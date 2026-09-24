import type { MenuDefinition } from '../components/molecules/MenuBar';

export interface File {
  name: string;
  content: string;
  folder: string;
  date: string;
  rawContent?: string;
}

/** Extra data passed to `openApp` / `customLaunch` when launching an app. */
export interface AppData {
  /** URL to open (iexplorer). */
  url?: string;
  /** Folder to open (portfolio). */
  folder?: string;
  /** File to display (markdownViewer). */
  file?: File;
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
