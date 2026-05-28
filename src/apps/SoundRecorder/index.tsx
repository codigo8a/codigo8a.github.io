import React from 'react';
import './index.css';

export const SoundRecorderApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

export function launchSoundRecorder(): void {
  const $Window = (window as any).$Window;
  if (!$Window) return;
  const $win = $Window({
    title: 'Sound Recorder',
    icons: {
      16: '/app/icons/speaker-16x16.png',
      32: '/app/icons/speaker-32x32.png',
    },
    minWidth: 270,
    minHeight: 130,
    resizable: false,
  });
  $win.css({ width: '270px', height: '130px' });
  $win.center();

  const el = document.createElement('div');
  el.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;background:var(--ButtonFace);gap:12px;padding:20px';
  el.innerHTML = `
    <div style="font-size:32px">🔊</div>
    <div style="font-family:'MS Sans Serif';font-size:11px;color:var(--WindowText)">
      Sound Recorder<br>
      <span style="color:gray">Not available in browser</span>
    </div>
  `;
  $win.$content.append(el);
}
