import React from 'react';
import './index.css';

export const RecycleBinApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

export function launchRecycleBin(): void {
  const $Window = (window as any).$Window;
  if (!$Window) return;
  const $win = $Window({
    title: 'Recycle Bin',
    icons: {
      16: '/images/icons/recycle-bin-16x16.png',
      32: '/images/icons/recycle-bin-32x32.png',
    },
    minWidth: 400,
    minHeight: 250,
  });
  $win.css({ width: '500px', height: '350px' });
  $win.center();

  const el = document.createElement('div');
  el.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;background:var(--Window);gap:12px;padding:40px';
  el.innerHTML = `
    <div style="font-size:48px">🗑️</div>
    <div style="font-family:'MS Sans Serif';font-size:11px;color:gray;text-align:center">
      Your Recycle Bin is empty.
    </div>
  `;
  $win.$content.append(el);
}
