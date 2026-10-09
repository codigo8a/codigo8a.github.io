// ─── Shared layout bootstrap (`/`) ──────────────────────────
// Single canvas-fitting implementation for the fused page:
// fitCanvas() sizes the board to #game-area with DPR support.
// Player-only behavior (claim + initUI + auto-send) stays in
// socket.js/ui.js, imported by init.js; the spectator state is the
// page default until the tanque is claimed.

import { COLORS } from './constants.js';
import { state } from './state.js';
import { render } from './renderer.js';
import { getRefsObj } from './refs.js';

export function fitCanvas() {
    const refs = getRefsObj();
    const area = document.getElementById('game-area');
    if (!area) return;
    // No margins: the board uses all available area — canvas aspect
    // matches board aspect (9/7 for Robostrike, 1/1 for Basic) so there
    // is no vertical letterboxing (boardY ~ 0).
    const availW = area.clientWidth;
    const availH = area.clientHeight;
    const isPortraitMobile = window.matchMedia('(max-width: 720px), (orientation: portrait)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const bw = state.gameState?.board?.width;
    const bh = state.gameState?.board?.height;
    let cssW, cssH;
    if (bw && bh) {
        if (isPortraitMobile) {
            // portrait/mobile: width-constrained, height derived from aspect
            const cellSize = Math.max(1, Math.floor((availW || 160) / bw) || 1);
            cssW = bw * cellSize;
            cssH = bh * cellSize;
            // never below 160 on the short side
            if (Math.min(cssW, cssH) < 160) {
                const scale = 160 / Math.min(cssW, cssH);
                cssW = Math.round(cssW * scale);
                cssH = Math.round(cssH * scale);
            }
        } else {
            // desktop: fit inside avail rect while preserving aspect
            const raw = Math.min((availW || 160) / bw, (availH || 160) / bh);
            const cellSize = Math.max(1, Math.floor(raw) || 1);
            cssW = bw * cellSize;
            cssH = bh * cellSize;
            if (Math.min(cssW, cssH) < 160) {
                const scale = 160 / Math.min(cssW, cssH);
                cssW = Math.round(cssW * scale);
                cssH = Math.round(cssH * scale);
            }
        }
        refs.canvas.style.aspectRatio = `${bw} / ${bh}`;
    } else {
        // no board yet (connecting screen) — keep square fallback
        const size = isPortraitMobile
            ? Math.max(160, availW || 160)
            : Math.max(160, Math.min(availW || 160, availH || 160));
        cssW = size;
        cssH = size;
        refs.canvas.style.aspectRatio = '1 / 1';
    }
    refs.canvas.style.width = cssW + 'px';
    refs.canvas.style.height = cssH + 'px';
    refs.canvas.width = Math.round(cssW * dpr);
    refs.canvas.height = Math.round(cssH * dpr);
    // The renderer derives cellSize/boardX/Y from canvas.width/Height,
    // so sprites stay sharp on retina displays
    if (state.gameState) {
        render();
    } else {
        drawConnecting();
    }
}

export function drawConnecting() {
    const refs = getRefsObj();
    refs.ctx.fillStyle = COLORS.bg;
    refs.ctx.fillRect(0, 0, refs.canvas.width, refs.canvas.height);
    refs.ctx.fillStyle = COLORS.text;
    refs.ctx.font = `${Math.round(refs.canvas.width / 24)}px sans-serif`;
    refs.ctx.textAlign = 'center';
    refs.ctx.fillText('Conectando...', refs.canvas.width / 2, refs.canvas.height / 2);
}

export function setupCanvas() {
    fitCanvas();
    window.addEventListener('resize', fitCanvas);
    window.addEventListener('orientationchange', () => setTimeout(fitCanvas, 250));
}
