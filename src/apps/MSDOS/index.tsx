import React from 'react';
import './index.css';

export const MSDOSApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

export function launchMSDOS(): void {
  const $Window = (window as any).$Window;
  if (!$Window) return;
  const $win = $Window({
    title: 'MS-DOS Prompt',
    icons: {
      16: '/app/icons/msdos-16x16.png',
      32: '/app/icons/msdos-32x32.png',
    },
    minWidth: 400,
    minHeight: 250,
  });
  $win.css({ width: '640px', height: '400px' });
  $win.center();

  const el = document.createElement('div');
  el.style.cssText = 'display:flex;flex-direction:column;height:100%;background:#000;padding:8px;font-family:"Courier New",monospace;font-size:14px;color:#c0c0c0;overflow:auto';
  el.innerHTML = `
    <div style="color:#c0c0c0">Microsoft(R) Windows 98</div>
    <div style="color:#c0c0c0">   (C)Copyright Microsoft Corp 1981-1999.</div>
    <div style="margin-top:8px;color:#c0c0c0">C:\\WINDOWS\\Desktop&gt;<span style="animation:blink 1s step-end infinite">_</span></div>
  `;
  $win.$content.append(el);
}
