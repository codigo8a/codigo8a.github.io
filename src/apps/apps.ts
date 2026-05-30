import { WelcomeApp, launchWelcome } from './WelcomeApp';
import { NotepadApp, launchNotepad } from './NotepadApp';
import { FileExplorerApp, launchFileExplorer } from './FileExplorerApp';
import { MarkdownViewerApp, launchFileViewer } from './MarkdownViewerApp';
import { SearchApp, launchSearch } from './SearchApp';
import { SettingsApp, launchSettings } from './SettingsApp';
import { IExplorerApp, launchIExplorer } from './IExplorerApp';
import { PortfolioApp, launchPortfolio } from './Prueba';
import { AppDefinition } from '../types';
import { SoundRecorderApp, launchSoundRecorder } from './SoundRecorder';
import { MSDOSApp, launchMSDOS } from './MSDOS';
import { RecycleBinApp, launchRecycleBin } from './RecycleBin';
import { NetworkApp, launchNetwork } from './Network';
import { MyComputerApp, launchMyComputer } from './MyComputer';

export const APPS: Record<string, AppDefinition> = {
  welcome: {
    id: 'welcome',
    title: 'Welcome',
    icon: '/images/icons/welcome.svg',
    component: WelcomeApp,
    defaultSize: { width: 700, height: 420 },
    centered: true,
    customLaunch: launchWelcome,
  },
  notepad: {
    id: 'notepad',
    title: 'Notepad',
    icon: '/images/icons/notepad-32x32.png',
    component: NotepadApp,
    defaultSize: { width: 450, height: 350 },
    centered: true,
    customLaunch: launchNotepad,
  },
  fileExplorer: {
    id: 'fileExplorer',
    title: 'My Documents',
    icon: '/images/icons/my-documents-folder-32x32.png',
    component: FileExplorerApp,
    defaultSize: { width: 780, height: 540 },
    centered: true,
    customLaunch: launchFileExplorer,
  },
  markdownViewer: {
    id: 'markdownViewer',
    title: 'Markdown Viewer',
    icon: '/images/icons/file-viewer.svg',
    component: MarkdownViewerApp,
    defaultSize: { width: 1000, height: 800 },
    centered: true,
    singleInstance: false,
    customLaunch: launchFileViewer,
  },
  search: {
    id: 'search',
    title: 'Search: Files',
    icon: '/images/icons/search.svg',
    component: SearchApp,
    defaultSize: { width: 640, height: 460 },
    centered: true,
    customLaunch: launchSearch,
  },
  settings: {
    id: 'settings',
    title: 'Settings',
    icon: '/images/icons/settings.svg',
    component: SettingsApp,
    defaultSize: { width: 450, height: 480 },
    centered: true,
    customLaunch: launchSettings,
  },
  iexplorer: {
    id: 'iexplorer',
    title: 'Internet Explorer',
    icon: '/images/icons/iexplorer-32x32.png',
    component: IExplorerApp,
    defaultSize: { width: 900, height: 650 },
    centered: true,
    customLaunch: launchIExplorer,
  },
  myComputer: {
    id: 'myComputer',
    title: 'My Computer',
    icon: '/images/icons/my-computer-32x32.png',
    component: MyComputerApp,
    defaultSize: { width: 780, height: 540 },
    centered: true,
    customLaunch: launchMyComputer,
  },
  network: {
    id: 'network',
    title: 'Network Neighborhood',
    icon: '/images/icons/network-32x32.png',
    component: NetworkApp,
    defaultSize: { width: 500, height: 350 },
    centered: true,
    customLaunch: launchNetwork,
  },
  recycleBin: {
    id: 'recycleBin',
    title: 'Recycle Bin',
    icon: '/images/icons/recycle-bin-32x32.png',
    component: RecycleBinApp,
    defaultSize: { width: 500, height: 350 },
    centered: true,
    customLaunch: launchRecycleBin,
  },
  soundRecorder: {
    id: 'soundRecorder',
    title: 'Sound Recorder',
    icon: '/images/icons/speaker-32x32.png',
    component: SoundRecorderApp,
    defaultSize: { width: 270, height: 130 },
    centered: true,
    customLaunch: launchSoundRecorder,
  },
  msdos: {
    id: 'msdos',
    title: 'MS-DOS Prompt',
    icon: '/images/icons/msdos-32x32.png',
    component: MSDOSApp,
    defaultSize: { width: 640, height: 400 },
    centered: true,
    customLaunch: launchMSDOS,
  },
  portfolio: {
    id: 'portfolio',
    title: 'Portfolio',
    icon: '/images/icons/folder-32x32.png',
    component: PortfolioApp,
    defaultSize: { width: 600, height: 450 },
    centered: true,
    customLaunch: launchPortfolio,
  },
};

export const getAppById = (id: string): AppDefinition | null => {
  return APPS[id] || null;
};

export const getAppList = (): AppDefinition[] => {
  return Object.values(APPS);
};
