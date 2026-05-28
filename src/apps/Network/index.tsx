import React from 'react';
import './index.css';

export const NetworkApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

export function launchNetwork(): void {
  const $Window = (window as any).$Window;
  if (!$Window) return;
  const $win = $Window({
    title: 'Network Neighborhood',
    icons: {
      16: '/app/icons/network-16x16.png',
      32: '/app/icons/network-32x32.png',
    },
    minWidth: 400,
    minHeight: 250,
  });
  $win.css({ width: '500px', height: '350px' });
  $win.center();

  const el = document.createElement('div');
  el.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;background:var(--Window);gap:12px;padding:40px';
  el.innerHTML = `
    <div style="font-size:48px">🌐</div>
    <div style="font-family:'MS Sans Serif';font-size:11px;color:gray;text-align:center">
      Network Neighborhood<br>
      <span style="font-size:10px">No network devices found.</span>
    </div>
  `;
  $win.$content.append(el);
}
