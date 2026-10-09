// ─── Constants ─────────────────────────────────────────────

export const PROGRAMMING_TIME = 15;
export const LOBBY_TIME = 20;
export const DEFAULT_ROUND_TIME = 45;
export const FRAME_DELAY = 0.75;

export const COLORS = {
    bg: '#1a1a2e',
    grid: '#0f3460',
    wall: '#3a3a5a',
    wallEdge: '#5a5a8a',
    pit: '#1a1a1a',
    pitRim: '#b03030',
    chip: '#ffd700',
    laserTurret: '#ff3333',
    laserHeavy: '#ff1a1a',
    laserWall: '#8a8a8a',
    laserBeam: '#ff3333',
    conveyorBlue: '#3366cc',
    conveyorPurple: '#9933cc',
    repulsor: '#cccc33',
    itemShield: '#66ccff',
    itemRegen: '#33ff66',
    itemBomb: '#ff6633',
    itemXcross: '#ff33ff',
    itemAuto: '#ffcc33',
    text: '#e0e0f0',
    textDim: '#8888aa',
    hpBar: '#333355',
    hpFull: '#33dd66',
    hpMid: '#ffcc33',
    hpLow: '#ff4444',
    timerFill: '#00d4ff'
};

export const TANK_COLORS = [
    '#00d4ff', // cyan
    '#ff5050', // red
    '#50ff50', // green
    '#ffd700', // yellow
    '#cc50ff', // purple
    '#ff8000', // orange
    '#00ffc8', // turquoise
    '#ffb0c8' // pink
];

export const DIR_ARROW = { N: '↑', S: '↓', E: '→', W: '←' };

export const SPRITE_COLORS = ['A', 'B', 'C', 'D']; // blue, red, green, yellow
export const SPRITE_COLOR_MAP = { A: '#00d4ff', B: '#ff5050', C: '#50ff50', D: '#ffd700' };

export const MOVE_DURATION = 400;
export const TURN_DURATION = 300;

export const CONVEYOR_DIRS = {
    N: { dx: 0, dy: -1, angle: -Math.PI / 2 },
    E: { dx: 1, dy: 0, angle: 0 },
    S: { dx: 0, dy: 1, angle: Math.PI / 2 },
    W: { dx: -1, dy: 0, angle: Math.PI }
};

// ─── Board metrics (single source of truth) ─────────────────
// Mirrors game/board.py Board.get_metrics(canvasW, canvasH):
//   cellSize    = floor(min(canvasW/boardW, canvasH/boardH))
//   boardPixelW = boardW * cellSize
//   boardPixelH = boardH * cellSize
//   boardX      = (canvasW - boardPixelW) / 2
//   boardY      = (canvasH - boardPixelH) / 2
// Centralises the calculation previously duplicated in
// renderer/frame.py and renderer.js so arena size changes
// (14x14 -> 16x16) no longer desync by ~2px.
export function getBoardMetrics(boardW, boardH, canvasW, canvasH) {
    const raw = Math.min(canvasW / boardW, canvasH / boardH);
    const cellSize = Math.max(1, Math.floor(raw));
    const boardPixelW = boardW * cellSize;
    const boardPixelH = boardH * cellSize;
    const boardX = (canvasW - boardPixelW) / 2;
    const boardY = (canvasH - boardPixelH) / 2;
    return { cellSize, boardX, boardY, boardPixelW, boardPixelH };
}

// roundRect polyfill for older browsers
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
        const r = typeof radii === 'number' ? radii : Array.isArray(radii) ? radii[0] : 0;
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
    };
}
