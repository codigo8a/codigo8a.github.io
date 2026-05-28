import { WelcomeApp, launchWelcome } from './WelcomeApp';
import { NotepadApp, launchNotepad } from './NotepadApp';
import { FileExplorerApp, launchFileExplorer } from './FileExplorerApp';
import { FileViewerApp, launchFileViewer } from './FileViewerApp';
import { SearchApp, launchSearch } from './SearchApp';
import { SettingsApp, launchSettings } from './SettingsApp';
import { NetscapeApp, launchNetscape } from './NetscapeApp';
import { PruebaApp, launchPrueba } from './Prueba';
import { AppDefinition } from '../types';

export const APPS: Record<string, AppDefinition> = {
  welcome: {
    id: 'welcome',
    title: 'Welcome',
    icon: '/app/icons/welcome.svg',
    component: WelcomeApp,
    defaultSize: { width: 700, height: 420 },
    centered: true,
    customLaunch: launchWelcome,
  },
  notepad: {
    id: 'notepad',
    title: 'Notepad',
    icon: '/app/icons/notepad.svg',
    component: NotepadApp,
    defaultSize: { width: 450, height: 350 },
    centered: true,
    customLaunch: launchNotepad,
  },
  fileExplorer: {
    id: 'fileExplorer',
    title: 'My Documents',
    icon: '/app/icons/folder.svg',
    component: FileExplorerApp,
    defaultSize: { width: 780, height: 540 },
    centered: true,
    customLaunch: launchFileExplorer,
  },
  fileViewer: {
    id: 'fileViewer',
    title: 'File Viewer',
    icon: '/app/icons/file-viewer.svg',
    component: FileViewerApp,
    defaultSize: { width: 1000, height: 800 },
    centered: true,
    singleInstance: false,
    customLaunch: launchFileViewer,
  },
  search: {
    id: 'search',
    title: 'Find: Files',
    icon: '/app/icons/search.svg',
    component: SearchApp,
    defaultSize: { width: 640, height: 460 },
    centered: true,
    customLaunch: launchSearch,
  },
  settings: {
    id: 'settings',
    title: 'Settings',
    icon: '/app/icons/settings.svg',
    component: SettingsApp,
    defaultSize: { width: 450, height: 480 },
    centered: true,
    customLaunch: launchSettings,
  },
  netscape: {
    id: 'netscape',
    title: 'Netscape Navigator',
    icon: '/app/icons/browser.svg',
    component: NetscapeApp,
    defaultSize: { width: 900, height: 750 },
    centered: true,
    customLaunch: launchNetscape,
  },
  prueba: {
    id: 'prueba',
    title: 'Prueba',
    icon: '/app/icons/prueba.svg',
    component: PruebaApp,
    defaultSize: { width: 600, height: 450 },
    centered: true,
    customLaunch: launchPrueba,
  }
};

export const getAppById = (id: string): AppDefinition | null => {
  return APPS[id] || null;
};

export const getAppList = (): AppDefinition[] => {
  return Object.values(APPS);
};
