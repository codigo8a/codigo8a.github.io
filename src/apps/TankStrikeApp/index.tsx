import React from 'react';
import { registerOsWindow } from '../../utils/osWindowRegistry';
import { applyCascadeAndFit } from '../../utils/cascadePosition';

export const TankStrikeApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

export function launchTankStrike(): void {
  const $Window = window.$Window;
  if (!$Window) {
    console.error('os-gui not loaded.');
    return;
  }

  const $win = $Window({
    title: 'TankStrike',
    icons: { 16: '/images/icons/tankstrike-32x32.svg', 32: '/images/icons/tankstrike-32x32.svg' },
    minWidth: 860,
    minHeight: 650,
  });
  $win.css({ width: '880px', height: '685px' });
  $win.center();
  applyCascadeAndFit($win, 880, 685);
  registerOsWindow($win, 'tankstrike', 'TankStrike', '/images/icons/tankstrike-32x32.png');

  // Iframe directly in window content (no wrapper) so os-gui focus tracking detects it
  const iframe = document.createElement('iframe');
  iframe.src = '/tankstrike/index.html';
  iframe.style.cssText = 'width:100%;height:100%;border:none;background:#000;display:block;';
  iframe.title = 'TankStrike';
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');

  // Ensure window stays focused when interacting with iframe
  iframe.addEventListener('pointerdown', () => {
    $win.bringToFront();
    $win.focus();
  });

  $win.$content.append(iframe);
}