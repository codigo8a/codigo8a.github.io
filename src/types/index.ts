export interface File {
  name: string;
  content: string;
  folder: string;
  date: string;
  rawContent?: string;
}

export interface WindowConfig {
  id: string;
  appId: string;
  title: string;
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
