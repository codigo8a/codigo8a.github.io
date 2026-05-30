import React from 'react';
import './index.css';
import { getCascadeOffset } from '../../utils/cascadePosition';

export const SoundRecorderApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

export function launchSoundRecorder(): void {
  const $Window = (window as any).$Window;
  if (!$Window) return;
  const $win = $Window({
    title: 'Sound Recorder',
    icons: {
      16: '/images/icons/speaker-16x16.png',
      32: '/images/icons/speaker-32x32.png',
    },
    minWidth: 270,
    minHeight: 130,
    resizable: false,
  });
  $win.css({ width: '270px', height: '130px' });
  $win.center();
  const cascadeOffset = getCascadeOffset();
  $win.css({ left: parseInt($win.css('left')) + cascadeOffset, top: parseInt($win.css('top')) + cascadeOffset });

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
