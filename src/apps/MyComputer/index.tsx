import React from 'react';
import './index.css';

export const MyComputerApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

export function launchMyComputer(): void {
  // Open FileExplorer at root level
  window.dispatchEvent(
    new CustomEvent('desktop-open-app', { detail: { appId: 'fileExplorer' } }),
  );
}
