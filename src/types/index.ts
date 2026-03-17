export interface File {
  name: string;
  content: string;
  folder: string;
  date: string;
  rawContent?: string;
}

export interface WindowConfig {
  appId: string;
  id: string;
  title: string;
  isMinimized: boolean;
  isActive: boolean;
  isMaximized: boolean;
  currentPosition: { x: number; y: number } | null;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  centered: boolean;
  zIndex: number;
  content: React.ReactNode;
  windowKey?: string;
}

export interface AppDefinition {
  id: string;
  title: string;
  icon: string;
  component: React.ComponentType<any>;
  defaultSize: { width: number; height: number };
  centered: boolean;
  singleInstance?: boolean;
}
