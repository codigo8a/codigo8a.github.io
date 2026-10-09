// ─── Rendering ─────────────────────────────────────────────

import { COLORS, DIR_ARROW, SPRITE_COLORS, PROGRAMMING_TIME, getBoardMetrics, CONVEYOR_DIRS } from './constants.js';
import { state } from './state.js';
import { SPRITES } from './sprites.js';
import { getRefsObj } from './refs.js';
import {
    renderPlayersList,
    renderLobbyList,
    renderScoreboardList,
    tankColor,
    setTopTimer,
    stopTopTimerFluid
} from './components.js';
import { scoreboard, setScoreboard } from './scoreboard.js';

export function render() {
    if (!state.gameState) return;

    // Update UI
    updateUI();

    // Draw board
    drawBoard();
}

export function updateUI() {
    const refs = getRefsObj();
    // a11y: ensure live regions for screen readers (templates already have
    // aria-live="polite"; this is a JS fallback for cached pages)
    if (refs.playersList && !refs.playersList.hasAttribute('aria-live'))
        refs.playersList.setAttribute('aria-live', 'polite');
    if (refs.scoreList && !refs.scoreList.hasAttribute('aria-live')) refs.scoreList.setAttribute('aria-live', 'polite');
    const gs = state.gameState;
    const gsState = gs.state;
    const round = gs.round;
    const remaining = gs.remaining_time;
    const alive = gs.alive_count;
    const total = gs.total_count;

    // Round label
    if (gsState === 'game_over') {
        refs.roundLabel.textContent = 'NEXT MATCH';
    } else {
        refs.roundLabel.textContent = `ROUND ${round}`;
    }

    // Timer superior
    if (gsState === 'programming' && remaining > 0) {
        setTopTimer(refs, remaining, PROGRAMMING_TIME);
    } else if (gsState === 'game_over') {
        // El lobby cuenta regresivo en header; no frenar aquí.
    } else {
        stopTopTimerFluid();
        setTopTimer(refs, 0, PROGRAMMING_TIME);
    }

    // Status: los rótulos de fase, el cartel amarillo de comandos y el panel
    // celeste del lobby fueron eliminados del DOM — la barra superior y
    // el cronómetro comunican el estado.

    // Player count
    refs.playerCount.textContent = total;

    // Players list — roster FIJO de la partida (no crece ni decrece).
    renderPlayersList(refs.playersList, gs);

    // Lobby — tanques esperando al final de la partida (fuera del roster).
    // El panel entero se muestra SÓLO si hay alguien esperando: con la sala vacía
    // no aparece, porque un panel con título y nada adentro no dice nada.
    const enEspera = (gs.waiting_room || []).length;
    renderLobbyList(refs.lobbyList, gs);
    if (refs.lobbyCount) refs.lobbyCount.textContent = enEspera;
    if (refs.lobbyPanel) refs.lobbyPanel.classList.toggle('hidden', enEspera === 0);

    // Tabla de posiciones del servidor (snapshot en game_state + evento)
    if (gs.scoreboard) setScoreboard(gs.scoreboard);
    renderScoreboardList(refs.scoreList, scoreboard.top(10));

    // My tank header — shows real name or fallback
    if (refs.myTankName) {
        // Don't overwrite while editing (input visible)
        const editing = refs.editNameInput && !refs.editNameInput.classList.contains('hidden');
        if (!editing) {
            if (state.myName) {
                // Prefer tank id for authoritative display (keeps color num stable via state.myNum)
                const t = gs.tanks[state.myName];
                refs.myTankName.textContent = t ? t.id : state.myName;
            } else {
                refs.myTankName.textContent = '🪖 Your Tank';
            }
        }
    }

    // My info
    if (state.myName && gs.tanks[state.myName]) {
        const me = gs.tanks[state.myName];
        const dir = DIR_ARROW[me.direction] || '?';
        refs.playerInfo.textContent = '';
        const infoRow = (text, bold = false) => {
            const div = document.createElement('div');
            if (bold) {
                const b = document.createElement('b');
                b.textContent = text;
                div.appendChild(b);
            } else {
                div.textContent = text;
            }
            refs.playerInfo.appendChild(div);
        };
        infoRow(`Tank #${me.num}`, true);
        infoRow(`Pos: (${me.x}, ${me.y}) ${dir}`);
        infoRow(`HP: ${me.hp}/5 | ❤️ ${me.lives}`);
        infoRow(`Kills: ${me.kills}`);
    }
}

export function drawBoard() {
    const refs = getRefsObj();
    const gs = state.gameState;
    const tanks = gs.tanks || {};
    const board = gs.board;
    const bw = board.width;
    const bh = board.height;
    // Cantidad de jugadores de la partida (roster fijo) — reparte los cascos
    const tankCount = Math.max(1, Object.keys(tanks).length);

    // Single source of truth — see constants.js getBoardMetrics
    // (mirrors game/board.py Board.get_metrics). Keeps Python/PIL
    // and JS canvas in sync when arena size changes.
    const _m = getBoardMetrics(bw, bh, refs.canvas.width, refs.canvas.height);
    state.cellSize = _m.cellSize;
    state.boardX = _m.boardX;
    state.boardY = _m.boardY;

    // Clear
    refs.ctx.fillStyle = COLORS.bg;
    refs.ctx.fillRect(0, 0, refs.canvas.width, refs.canvas.height);

    // Draw grid
    refs.ctx.strokeStyle = COLORS.grid;
    refs.ctx.lineWidth = 1;
    for (let x = 0; x <= bw; x++) {
        refs.ctx.beginPath();
        refs.ctx.moveTo(state.boardX + x * state.cellSize, state.boardY);
        refs.ctx.lineTo(state.boardX + x * state.cellSize, state.boardY + bh * state.cellSize);
        refs.ctx.stroke();
    }
    for (let y = 0; y <= bh; y++) {
        refs.ctx.beginPath();
        refs.ctx.moveTo(state.boardX, state.boardY + y * state.cellSize);
        refs.ctx.lineTo(state.boardX + bw * state.cellSize, state.boardY + y * state.cellSize);
        refs.ctx.stroke();
    }

    // Border outline
    refs.ctx.strokeStyle = '#00d4ff';
    refs.ctx.lineWidth = 2;
    refs.ctx.strokeRect(state.boardX, state.boardY, bw * state.cellSize, bh * state.cellSize);

    // ── Cell backgrounds: pit (black+red rim) + laser turrets (heavy distinct) ──
    {
        const lasers = board.lasers || [];
        const heavySet = new Set(lasers.filter((l) => (l.dmg || 1) > 1).map((l) => `${l.x},${l.y}`));
        for (const c of board.cells || []) {
            if (!c || typeof c.x !== 'number') continue;
            const px = state.boardX + c.x * state.cellSize;
            const py = state.boardY + c.y * state.cellSize;
            const cs = state.cellSize;
            if (c.t === 'pit') {
                // Square 3D shaft — matches hueco.png (gray walls + dark bottom)
                // Palette sync with PIL: top #3a3a3a, left #6a6a6a, right #8a8a8a, bottom #b0b0b0, inner #0a0a0a
                const inset = Math.max(2, cs * 0.3);
                const ix0 = px + inset,
                    iy0 = py + inset;
                const ix1 = px + cs - inset,
                    iy1 = py + cs - inset;
                // top wall (darker, narrower)
                refs.ctx.fillStyle = '#3a3a3a';
                refs.ctx.beginPath();
                refs.ctx.moveTo(px, py);
                refs.ctx.lineTo(px + cs, py);
                refs.ctx.lineTo(ix1, iy0);
                refs.ctx.lineTo(ix0, iy0);
                refs.ctx.closePath();
                refs.ctx.fill();
                // bottom wall (lighter, more visible)
                refs.ctx.fillStyle = '#b0b0b0';
                refs.ctx.beginPath();
                refs.ctx.moveTo(px, py + cs);
                refs.ctx.lineTo(px + cs, py + cs);
                refs.ctx.lineTo(ix1, iy1);
                refs.ctx.lineTo(ix0, iy1);
                refs.ctx.closePath();
                refs.ctx.fill();
                // left wall
                refs.ctx.fillStyle = '#6a6a6a';
                refs.ctx.beginPath();
                refs.ctx.moveTo(px, py);
                refs.ctx.lineTo(ix0, iy0);
                refs.ctx.lineTo(ix0, iy1);
                refs.ctx.lineTo(px, py + cs);
                refs.ctx.closePath();
                refs.ctx.fill();
                // right wall
                refs.ctx.fillStyle = '#8a8a8a';
                refs.ctx.beginPath();
                refs.ctx.moveTo(px + cs, py);
                refs.ctx.lineTo(px + cs, py + cs);
                refs.ctx.lineTo(ix1, iy1);
                refs.ctx.lineTo(ix1, iy0);
                refs.ctx.closePath();
                refs.ctx.fill();
                // inner dark bottom (~40% cell)
                refs.ctx.fillStyle = '#0a0a0a';
                refs.ctx.fillRect(ix0, iy0, ix1 - ix0, iy1 - iy0);
            } else if (c.t === 'laser_turret') {
                const heavy = heavySet.has(`${c.x},${c.y}`);
                const cx = px + cs / 2,
                    cy = py + cs / 2;
                const r = cs * 0.28;
                refs.ctx.fillStyle = heavy ? COLORS.laserHeavy : COLORS.laserTurret;
                refs.ctx.beginPath();
                refs.ctx.arc(cx, cy, r, 0, Math.PI * 2);
                refs.ctx.fill();
                if (heavy) {
                    refs.ctx.strokeStyle = '#ffaaaa';
                    refs.ctx.lineWidth = 2.5;
                    refs.ctx.stroke();
                    refs.ctx.fillStyle = '#ffd0a0';
                    refs.ctx.beginPath();
                    refs.ctx.arc(cx, cy, r * 0.4, 0, Math.PI * 2);
                    refs.ctx.fill();
                } else {
                    refs.ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                    refs.ctx.lineWidth = 1.2;
                    refs.ctx.stroke();
                }
            } else if (c.t === 'laser_wall') {
                // Handle multiple walls at same cell (e.g., 0,0 with E and S) — drawSize cs+1 tapa 1px grid
                const wallsHere = (board.laser_walls || []).filter((w) => w.x === c.x && w.y === c.y);
                const wallDirs = wallsHere.length ? wallsHere.map((w) => w.dir) : ['E'];
                for (const wdir of wallDirs) {
                    // Directional wall: dedicado top/bottom/left/right sin rotar (evita inversión)
                    const dirMap = {
                        N: SPRITES.laserWallTop,
                        S: SPRITES.laserWallBottom,
                        E: SPRITES.laserWallRight,
                        W: SPRITES.laserWallLeft
                    };
                    const picked = dirMap[wdir] || SPRITES.laserWall;
                    const fallback = SPRITES.laserWall;
                    let wallImg = picked;
                    const hasPicked = wallImg && wallImg.complete && wallImg.naturalWidth > 0;
                    const hasFallback = fallback && fallback.complete && fallback.naturalWidth > 0;
                    if (!hasPicked && hasFallback) wallImg = fallback;
                    if (wallImg && wallImg.complete && wallImg.naturalWidth > 0) {
                        const drawSize = cs + 1;
                        if (wdir === 'E' && c.x === 0 && c.y === 0) {
                            refs.ctx.save();
                            refs.ctx.translate(px + cs / 2, py + cs / 2);
                            refs.ctx.scale(-1, 1);
                            refs.ctx.drawImage(wallImg, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
                            refs.ctx.restore();
                        } else {
                            refs.ctx.drawImage(wallImg, px - 0.5, py - 0.5, drawSize, drawSize);
                        }
                    } else {
                        refs.ctx.fillStyle = '#6a6a6a';
                        refs.ctx.fillRect(px - 0.5, py - 0.5, cs + 1, cs + 1);
                    }
                }
            } else if (c.t === 'laser_beam') {
                const beamImg = SPRITES.beam || SPRITES.laserWall;
                const img = beamImg || SPRITES.laserWall;
                const useImg = img && img.complete && img.naturalWidth > 0 ? img : null;
                if (useImg) {
                    const drawSize = cs + 1;
                    refs.ctx.drawImage(useImg, px - 0.5, py - 0.5, drawSize, drawSize);
                } else {
                    refs.ctx.fillStyle = 'rgba(15, 15, 25, 0.8)';
                    refs.ctx.fillRect(px - 0.5, py - 0.5, cs + 1, cs + 1);
                    refs.ctx.fillStyle = '#ff3333';
                    refs.ctx.fillRect(px, py + cs * 0.35, cs, 4);
                    refs.ctx.fillRect(px, py + cs * 0.65, cs, 4);
                }
            }
        }
    }

    // ── Rotor overlays (RoboStrike 9x7 — 4 rotors R/L) ──
    // Mirrors renderer/sprites.py draw_cell_bg rotor: gray circle + inner ring
    // + 4 white arrows (R=clockwise, L=counter-clockwise). Falls back to
    // board.cells scan when board.rotors is missing (compat).
    {
        const _rotorList =
            board.rotors && board.rotors.length
                ? board.rotors
                : (() => {
                      const out = [];
                      for (const c of board.cells || []) {
                          if (c && c.t === 'rotor' && typeof c.x === 'number') out.push({ x: c.x, y: c.y, dir: 'R' });
                      }
                      return out;
                  })();
        for (const rt of _rotorList) {
            const cs = state.cellSize;
            const ccx = state.boardX + rt.x * cs + cs / 2;
            const ccy = state.boardY + rt.y * cs + cs / 2;
            const r = cs * 0.33;
            const r2 = r * 0.65;
            // outer gray circle — PIL (80,80,85) => #505055
            refs.ctx.fillStyle = '#505055';
            refs.ctx.beginPath();
            refs.ctx.arc(ccx, ccy, r, 0, Math.PI * 2);
            refs.ctx.fill();
            refs.ctx.strokeStyle = '#a0a0a5';
            refs.ctx.lineWidth = Math.max(1.5, cs * 0.02);
            refs.ctx.stroke();
            // inner ring — PIL inner #0a0a0a
            refs.ctx.strokeStyle = '#0a0a0a';
            refs.ctx.lineWidth = 1;
            refs.ctx.beginPath();
            refs.ctx.arc(ccx, ccy, r2, 0, Math.PI * 2);
            refs.ctx.stroke();
            // subtle light highlight on inner rim (matches PIL 200,200,205) for visibility at ~100px
            refs.ctx.strokeStyle = 'rgba(200,200,205,0.35)';
            refs.ctx.lineWidth = 1;
            refs.ctx.beginPath();
            refs.ctx.arc(ccx, ccy, r2, 0, Math.PI * 2);
            refs.ctx.stroke();
            // 4 white arrows at N/E/S/W
            const isCW = (rt.dir || 'R').toUpperCase() !== 'L';
            const headLen = Math.max(3, cs * 0.075);
            for (const angDeg of [0, 90, 180, 270]) {
                const rad = (angDeg * Math.PI) / 180;
                const ax = ccx + r * 0.78 * Math.cos(rad);
                const ay = ccy + r * 0.78 * Math.sin(rad);
                const tRad = rad + (isCW ? Math.PI / 2 : -Math.PI / 2);
                const p1x = ax + headLen * Math.cos(tRad);
                const p1y = ay + headLen * Math.sin(tRad);
                const p2x = ax + headLen * 0.6 * Math.cos(tRad + 2.356);
                const p2y = ay + headLen * 0.6 * Math.sin(tRad + 2.356);
                const p3x = ax + headLen * 0.6 * Math.cos(tRad - 2.356);
                const p3y = ay + headLen * 0.6 * Math.sin(tRad - 2.356);
                refs.ctx.fillStyle = '#ffffff';
                refs.ctx.beginPath();
                refs.ctx.moveTo(p1x, p1y);
                refs.ctx.lineTo(p2x, p2y);
                refs.ctx.lineTo(p3x, p3y);
                refs.ctx.closePath();
                refs.ctx.fill();
            }
        }
    }

    // ── Conveyor & repulsor overlays (RN-01) ──
    // Apply shake jitter for repulsor FX before drawing board contents
    const hasShake = Array.isArray(gs.fx) && gs.fx.some((e) => e && e.kind === 'repulsor' && e.shake);
    let shakeX = 0,
        shakeY = 0;
    if (hasShake) {
        const t = Date.now() % 200;
        shakeX = t < 100 ? 2 : -2;
        shakeY = t % 80 < 40 ? 1 : -1;
        refs.ctx.save();
        refs.ctx.translate(shakeX, shakeY);
    }
    // Build lookups: conveyors [{x,y,dir}], repulsors [{x,y,cooldown}], cells [{x,y,t}]
    const conveyors = board.conveyors || [];
    const repulsors = board.repulsors || [];
    const cellMap = new Map();
    for (const c of board.cells || []) {
        if (c && typeof c.x === 'number') cellMap.set(`${c.x},${c.y}`, c.t);
    }
    // Fallback conveyor dir from cell type if conveyors not present
    const convList = conveyors.length
        ? conveyors
        : (() => {
              const out = [];
              for (const [k, t] of cellMap.entries()) {
                  if (t === 'conveyor_blue' || t === 'conveyor_purple') {
                      const [x, y] = k.split(',').map(Number);
                      out.push({ x, y, dir: 'E' });
                  }
              }
              return out;
          })();
    // ── Carretera procedural — reemplaza route.png / route-curva.png ──
    // Asfalto oscuro + bordes amarillos + flechas blancas, sin PNGs.
    // Mantiene detección convList/convMap/isCurve tal cual.
    const ROAD_ASPHALT = '#2b2b3a';
    const ROAD_BORDER = '#e0e0e0';
    const ROAD_ARROW = '#ffffff';
    const convMap = new Map(convList.map((c) => [`${c.x},${c.y}`, (c.dir || 'E').toUpperCase()]));
    for (const conv of convList) {
        const cx = conv.x,
            cy = conv.y;
        const dir = (conv.dir || 'E').toUpperCase();
        const info = CONVEYOR_DIRS[dir] || CONVEYOR_DIRS.E;
        const px = state.boardX + cx * state.cellSize;
        const py = state.boardY + cy * state.cellSize;
        const ccx = px + state.cellSize / 2;
        const ccy = py + state.cellSize / 2;
        // Detect predecessor that points into this cell
        let prevDir = null;
        for (const [dKey, dInfo] of Object.entries(CONVEYOR_DIRS)) {
            const prevX = cx - dInfo.dx;
            const prevY = cy - dInfo.dy;
            const pd = convMap.get(`${prevX},${prevY}`);
            if (pd === dKey) {
                prevDir = pd;
                break;
            }
        }
        let isCurve = prevDir !== null && prevDir !== dir;
        // Override for outer border: isolated edge cells never find a predecessor
        // so isCurve stays false. Force correct rendering without touching the map.
        const posKey = `${cx},${cy}`;
        if (['1,2', '1,4', '3,4', '5,2', '5,4', '7,2', '7,4'].includes(posKey)) isCurve = true;
        if (
            posKey === '1,3' ||
            posKey === '7,3' ||
            posKey === '2,2' ||
            posKey === '2,4' ||
            posKey === '6,2' ||
            posKey === '6,4'
        )
            isCurve = false;
        // When isCurve is forced, prevDir is null — assign a fictitious predecessor
        // so curve orientation renders correctly.
        if (isCurve && !prevDir) {
            if (posKey === '1,2') prevDir = 'S';
            else if (posKey === '1,4') prevDir = 'W';
            else if (posKey === '3,4') prevDir = 'N';
            else if (posKey === '5,2') prevDir = 'N';
            else if (posKey === '5,4') prevDir = 'W';
            else if (posKey === '7,2') prevDir = 'E';
            else if (posKey === '7,4') prevDir = 'S';
        }
        const drawSize = state.cellSize + 1;
        const half = drawSize / 2;
        const borderW = Math.max(3, Math.round(drawSize * 0.045));
        if (isCurve) {
            // ── Curva 90°: arco grueso del mismo ancho que la recta — empalme perfecto ──
            const halfLocal = half;
            const roadW = drawSize; // mismo que recta — cubre toda la celda sin huecos
            const borderW = 5;
            // entryVec como lado (W para entrar por oeste); flujo es CONVEYOR_DIRS[prevDir] (E), lado = -flujo
            const _flowEntry = CONVEYOR_DIRS[prevDir];
            const entryVec = { dx: -_flowEntry.dx, dy: -_flowEntry.dy };
            const exitVec = info;
            // Centro = esquina exterior: suma de los vectores de entrada y salida escalados a half
            const cx2 = (entryVec.dx + exitVec.dx) * halfLocal;
            const cy2 = (entryVec.dy + exitVec.dy) * halfLocal;
            const r = halfLocal;
            // Ángulos desde el centro hacia los puntos medios de los bordes de entrada/salida
            const ex = entryVec.dx * halfLocal;
            const ey = entryVec.dy * halfLocal;
            const xx = exitVec.dx * halfLocal;
            const xy = exitVec.dy * halfLocal;
            const a0 = Math.atan2(ey - cy2, ex - cx2);
            const a1 = Math.atan2(xy - cy2, xx - cx2);
            const isClockwise =
                (prevDir === 'N' && dir === 'E') ||
                (prevDir === 'E' && dir === 'S') ||
                (prevDir === 'S' && dir === 'W') ||
                (prevDir === 'W' && dir === 'N');
            const anticlockwise = !isClockwise;
            // sweep corto de 90° para posicionar flechas
            let sweep = a1 - a0;
            while (sweep <= -Math.PI) sweep += Math.PI * 2;
            while (sweep > Math.PI) sweep -= Math.PI * 2;
            if (Math.abs(sweep) > Math.PI * 0.6) sweep = sweep > 0 ? sweep - Math.PI * 2 : sweep + Math.PI * 2;
            refs.ctx.save();
            refs.ctx.translate(ccx, ccy);
            refs.ctx.strokeStyle = ROAD_ASPHALT;
            refs.ctx.lineWidth = roadW;
            refs.ctx.lineCap = 'butt';
            refs.ctx.beginPath();
            refs.ctx.arc(cx2, cy2, r, a0, a1, anticlockwise);
            refs.ctx.stroke();
            // Bordes exterior e interior — continúan perfecto con rectas (3px, offset borderW/2)
            refs.ctx.strokeStyle = ROAD_BORDER;
            refs.ctx.lineWidth = borderW;
            refs.ctx.lineCap = 'butt';
            refs.ctx.beginPath();
            refs.ctx.arc(cx2, cy2, r + roadW / 2 - borderW / 2, a0, a1, anticlockwise);
            refs.ctx.stroke();
            refs.ctx.beginPath();
            refs.ctx.arc(cx2, cy2, r - roadW / 2 + borderW / 2, a0, a1, anticlockwise);
            refs.ctx.stroke();
            // Línea central intermitente curva (mitad del carril, radio r)
            refs.ctx.save();
            refs.ctx.strokeStyle = '#ffffff';
            refs.ctx.lineWidth = 2;
            refs.ctx.setLineDash([8, 8]);
            refs.ctx.beginPath();
            refs.ctx.arc(cx2, cy2, r, a0, a1, anticlockwise);
            refs.ctx.stroke();
            refs.ctx.restore();
            // Flechas curvas: dos chevrones siguiendo el arco a t=0.35 y 0.65
            for (const t of [0.35, 0.65]) {
                const ang = a0 + sweep * t;
                const ax = cx2 + r * Math.cos(ang);
                const ay = cy2 + r * Math.sin(ang);
                const tang = ang + (isClockwise ? Math.PI / 2 : -Math.PI / 2);
                refs.ctx.save();
                refs.ctx.translate(ax, ay);
                refs.ctx.rotate(tang);
                refs.ctx.fillStyle = ROAD_ARROW;
                const s = drawSize * 0.09;
                refs.ctx.beginPath();
                refs.ctx.moveTo(-s * 0.6, -s * 0.5);
                refs.ctx.lineTo(s * 0.6, 0);
                refs.ctx.lineTo(-s * 0.6, s * 0.5);
                refs.ctx.closePath();
                refs.ctx.fill();
                refs.ctx.shadowColor = 'rgba(0,0,0,0.4)';
                refs.ctx.shadowBlur = 0;
                refs.ctx.restore();
            }
            refs.ctx.restore();
        } else {
            // ── Recta: asfalto + bordes laterales + línea central + señalización ──
            refs.ctx.save();
            refs.ctx.translate(ccx, ccy);
            refs.ctx.rotate(info.angle);
            // Asfalto
            refs.ctx.fillStyle = ROAD_ASPHALT;
            refs.ctx.fillRect(-half, -half, drawSize, drawSize);
            // Bordes laterales (top/bottom en coords locales rotadas)
            refs.ctx.fillStyle = ROAD_BORDER;
            refs.ctx.fillRect(-half, -half, drawSize, borderW);
            refs.ctx.fillRect(-half, half - borderW, drawSize, borderW);
            // Línea central intermitente (coords locales y=0)
            refs.ctx.save();
            refs.ctx.strokeStyle = '#ffffff';
            refs.ctx.lineWidth = 2;
            refs.ctx.setLineDash([10, 8]);
            refs.ctx.beginPath();
            refs.ctx.moveTo(-half, 0);
            refs.ctx.lineTo(half, 0);
            refs.ctx.stroke();
            refs.ctx.restore();
            // Flecha pequeña de señalización en el centro del carril
            refs.ctx.fillStyle = '#ffffff';
            refs.ctx.beginPath();
            refs.ctx.moveTo(0, -4);
            refs.ctx.lineTo(6, 0);
            refs.ctx.lineTo(0, 4);
            refs.ctx.closePath();
            refs.ctx.fill();
            refs.ctx.restore();
        }
    }
    // Repulsor pulse: Flash_A_02 (dim) vs Flash_A_04 (bright)
    const repList = repulsors.length
        ? repulsors
        : (() => {
              const out = [];
              for (const [k, t] of cellMap.entries()) {
                  if (t === 'repulsor') {
                      const [x, y] = k.split(',').map(Number);
                      out.push({ x, y, cooldown: 0 });
                  }
              }
              return out;
          })();
    for (const rep of repList) {
        const rx = rep.x,
            ry = rep.y;
        const cd = rep.cooldown || 0;
        const ccx = state.boardX + rx * state.cellSize + state.cellSize / 2;
        const ccy = state.boardY + ry * state.cellSize + state.cellSize / 2;
        const bright = cd === 0;
        const flashIdx = bright ? 3 : 1; // 0-based: 3=Flash_A_04, 1=Flash_A_02
        const flashImg =
            SPRITES.flash &&
            SPRITES.flash[flashIdx] &&
            SPRITES.flash[flashIdx].complete &&
            SPRITES.flash[flashIdx].naturalWidth > 0
                ? SPRITES.flash[flashIdx]
                : null;
        if (flashImg) {
            refs.ctx.save();
            refs.ctx.globalAlpha = bright ? 0.95 : 0.35;
            refs.ctx.globalCompositeOperation = bright ? 'lighter' : 'source-over';
            const r = state.cellSize * (bright ? 0.9 : 0.6);
            try {
                refs.ctx.drawImage(flashImg, 30, 33, 68, 68, ccx - r, ccy - r, r * 2, r * 2);
            } catch (_) {
                refs.ctx.beginPath();
                refs.ctx.arc(ccx, ccy, r / 2, 0, Math.PI * 2);
                refs.ctx.strokeStyle = bright ? 'rgba(200,200,50,0.9)' : 'rgba(120,120,40,0.4)';
                refs.ctx.lineWidth = 2;
                refs.ctx.stroke();
            }
            refs.ctx.restore();
        } else {
            const r = state.cellSize / 3;
            refs.ctx.save();
            refs.ctx.globalAlpha = bright ? 0.9 : 0.35;
            refs.ctx.strokeStyle = bright ? '#cccc33' : '#888830';
            refs.ctx.lineWidth = bright ? 3 : 1.5;
            refs.ctx.beginPath();
            refs.ctx.arc(ccx, ccy, r, 0, Math.PI * 2);
            refs.ctx.stroke();
            refs.ctx.fillStyle = bright ? '#cccc33' : '#66662a';
            refs.ctx.beginPath();
            refs.ctx.arc(ccx, ccy, 3, 0, Math.PI * 2);
            refs.ctx.fill();
            refs.ctx.restore();
        }
        // extra alpha ring for cooldown dim
        if (!bright) {
            refs.ctx.save();
            refs.ctx.strokeStyle = 'rgba(100,100,40,0.5)';
            refs.ctx.lineWidth = 1;
            refs.ctx.setLineDash([3, 3]);
            refs.ctx.beginPath();
            refs.ctx.arc(ccx, ccy, state.cellSize / 2 - 2, 0, Math.PI * 2);
            refs.ctx.stroke();
            refs.ctx.restore();
        }
    }

    // Draw active pit shrink overlay(s) — falling into pit (pozo)
    if (state.pitAnims && state.pitAnims.length) {
        for (const a of state.pitAnims) {
            if (!a.active) continue;
            const fake = { num: a.num, direction: a.direction || 'N', alive: true, shielded_this_step: false };
            drawTank(fake, 5, true, a.x, a.y, a.direction || 'N', a.tankId || 'pit', tankCount, a.scale);
            // dust ring
            if (a.scale > 0.3) {
                const pcx = state.boardX + a.x * state.cellSize + state.cellSize / 2;
                const pcy = state.boardY + a.y * state.cellSize + state.cellSize / 2;
                const rr = state.cellSize * 0.5 * (1.2 - a.scale);
                refs.ctx.save();
                refs.ctx.strokeStyle = 'rgba(120,120,120,0.6)';
                refs.ctx.lineWidth = 1;
                refs.ctx.beginPath();
                refs.ctx.arc(pcx, pcy, rr, 0, Math.PI * 2);
                refs.ctx.stroke();
                refs.ctx.restore();
            }
        }
    }

    // Draw tanks with smooth movement — solo los vivos en el tablero;
    // 'dead'/'eliminated' siguen en el roster pero no se dibujan
    for (const [rid, tank] of Object.entries(tanks)) {
        if (tank.phase && tank.phase !== 'alive') continue;
        let drawX = tank.x;
        let drawY = tank.y;

        // Check for active transition
        const transition = state.tankTransitions[rid];
        if (transition) {
            const elapsed = performance.now() - transition.startTime;
            const progress = Math.min(elapsed / transition.duration, 1);
            // Ease-out expo
            const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
            drawX = transition.fromX + (transition.toX - transition.fromX) * eased;
            drawY = transition.fromY + (transition.toY - transition.fromY) * eased;
        }

        // If this tank died this step, show pre_death hp and skip HP bar
        let displayHp = tank.hp;
        let skipBar = false;
        const deathEntry = (state.currentDeaths || []).find((x) => x.tank === rid && x.pre_death_hp !== undefined);
        if (deathEntry) {
            displayHp = deathEntry.pre_death_hp;
            skipBar = true;
        }

        // Rotation interpolation
        let visualDir = tank.direction;
        const rot = state.tankRotations[rid];
        if (rot) {
            const elapsed = performance.now() - rot.startTime;
            const progress = Math.min(elapsed / rot.duration, 1);
            const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
            const currentAngle = rot.fromAngle + (rot.toAngle - rot.fromAngle) * eased;
            // Convert angle back to direction for rendering
            const angleToDir = (a) => {
                const norm = ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
                if (norm < Math.PI / 4 || norm > (7 * Math.PI) / 4) return 'N';
                if (norm < (3 * Math.PI) / 4) return 'E';
                if (norm < (5 * Math.PI) / 4) return 'S';
                return 'W';
            };
            visualDir = angleToDir(currentAngle);
        }

        drawTank(tank, displayHp, skipBar, drawX, drawY, visualDir, rid, tankCount);
    }

    // Draw active death animation overlay(s) — one per tank killed this step
    if (state.deathAnims && state.deathAnims.length) {
        for (const a of state.deathAnims) {
            if (a.active) drawDeath(a.x, a.y, a.frame);
        }
    } else if (state.deathAnimActive) {
        drawDeath(state.deathAnimX, state.deathAnimY, state.deathAnimFrame);
    }
    if (hasShake) {
        refs.ctx.restore();
        // schedule shake end after 100ms (restore already done, just keep flag)
        setTimeout(() => {}, 100);
    }
}

export function drawTank(tank, displayHp, skipHpBar, overrideX, overrideY, visualDir, rid, tankCount, scale = 1) {
    const refs = getRefsObj();
    const rx = overrideX !== undefined ? overrideX : tank.x;
    const ry = overrideY !== undefined ? overrideY : tank.y;
    const num = tank.num;
    const dir = visualDir || tank.direction;
    const hp = displayHp !== undefined ? displayHp : tank.hp;
    const alive = tank.alive;
    const sc = typeof scale === 'number' && scale > 0 ? scale : 1;

    const px = state.boardX + rx * state.cellSize;
    const py = state.boardY + ry * state.cellSize;
    const cx = px + state.cellSize / 2;
    const cy = py + state.cellSize / 2;

    if (!alive) {
        // Dead tank — X mark (fallback when sprite not loaded)
        refs.ctx.strokeStyle = '#555';
        refs.ctx.lineWidth = 3;
        refs.ctx.beginPath();
        refs.ctx.moveTo(px + 4, py + 4);
        refs.ctx.lineTo(px + state.cellSize - 4, py + state.cellSize - 4);
        refs.ctx.moveTo(px + state.cellSize - 4, py + 4);
        refs.ctx.lineTo(px + 4, py + state.cellSize - 4);
        refs.ctx.stroke();
        return;
    }

    // Choose sprite based on player number
    const colorIdx = (num - 1) % 4;
    const spriteColor = SPRITE_COLORS[colorIdx];
    // Cascos DISTRIBUIDOS según la cantidad de jugadores: con step =
    // floor(8/total) se reparten los 8 cascos sin que se repita silueta.
    const TOTAL_HULLS = 8;
    const total = tankCount || 4;
    const hullStep = total >= TOTAL_HULLS ? 1 : Math.max(1, Math.floor(TOTAL_HULLS / total));
    const hullIdx = ((num - 1) * hullStep) % TOTAL_HULLS;

    // Rotation: sprites face North (up), rotate for other directions
    const rotations = { N: 0, E: Math.PI / 2, S: Math.PI, W: -Math.PI / 2 };
    const angle = rotations[dir] || 0;
    const size = state.cellSize * 0.9; // lado del sprite del casco

    refs.ctx.save();
    refs.ctx.translate(cx, cy);
    if (sc !== 1) refs.ctx.scale(sc, sc);
    refs.ctx.rotate(angle);

    // Draw hull sprite
    if (state.spritesLoaded && SPRITES.hulls[spriteColor] && SPRITES.hulls[spriteColor][hullIdx]) {
        const img = SPRITES.hulls[spriteColor][hullIdx];
        if (img.complete && img.naturalWidth > 0) {
            refs.ctx.drawImage(img, -size / 2, -size / 2, size, size);
        } else {
            const r = state.cellSize / 2.5;
            refs.ctx.fillStyle = tankColor(num);
            refs.ctx.beginPath();
            refs.ctx.roundRect(-r, -r, r * 2, r * 2, 4);
            refs.ctx.fill();
            refs.ctx.strokeStyle = '#fff';
            refs.ctx.lineWidth = 1.5;
            refs.ctx.stroke();
        }
    } else {
        const r = state.cellSize / 2.5;
        refs.ctx.fillStyle = tankColor(num);
        refs.ctx.beginPath();
        refs.ctx.roundRect(-r, -r, r * 2, r * 2, 4);
        refs.ctx.fill();
        refs.ctx.strokeStyle = '#fff';
        refs.ctx.lineWidth = 1.5;
        refs.ctx.stroke();
    }

    // Draw gun/cannon sprite on top of hull
    if (state.spritesLoaded && SPRITES.guns[spriteColor] && SPRITES.guns[spriteColor][hullIdx]) {
        const gunImg = SPRITES.guns[spriteColor][hullIdx];
        if (gunImg.complete && gunImg.naturalWidth > 0) {
            const gunSize = state.cellSize * 0.85;
            refs.ctx.drawImage(gunImg, -gunSize / 2, -gunSize / 2, gunSize, gunSize);
        }
    }

    // ── Orugas animadas ENCIMA del casco: el arte trae orugas estáticas; la
    // imagen Track_N es la columna completa de eslabones y sus frames A/B
    // SON la animación de rodillo — se alternan sólo mientras el tanque se
    // mueve (crop 3..39 de los 42px de ancho). ──
    {
        const tset = SPRITES.tracks[(hullIdx % 4) + 1];
        if (state.spritesLoaded && tset && tset[0].complete && tset[0].naturalWidth > 0) {
            const moving = !!(rid && state.tankTransitions[rid]);
            const fr = moving ? tset[Math.floor(performance.now() / 130) % 2] : tset[0];
            const tw = size * 0.15;
            for (const side of [-1, 1]) {
                // Borde del casco = 0.324·size (bbox real). Centrar la oruga
                // en ese borde: sobresale la mitad de su ancho, el resto va
                // metida sobre el casco.
                const tx = side * (size * 0.324) - tw / 2;
                refs.ctx.drawImage(fr, 3, 0, 36, fr.naturalHeight, tx, -size / 2, tw, size);
            }
        }
    }

    // HP bar — inside rotated context so it stays behind the tank
    if (!skipHpBar) {
        const barW = state.cellSize - 4;
        const barH = 3;
        const barX = -barW / 2;
        const barY = state.cellSize / 2 - 6; // always at the "bottom" of the rotated context
        refs.ctx.fillStyle = '#333';
        refs.ctx.fillRect(barX, barY, barW, barH);
        const hpRatio = hp / 5;
        refs.ctx.fillStyle = hpRatio > 0.6 ? '#33dd66' : hpRatio > 0.3 ? '#ffcc33' : '#ff4444';
        refs.ctx.fillRect(barX, barY, barW * hpRatio, barH);
    }

    refs.ctx.restore();

    // Shield glow (drawn after rotation, always upright)
    if (tank.shielded_this_step) {
        refs.ctx.fillStyle = 'rgba(0, 200, 255, 0.3)';
        refs.ctx.beginPath();
        refs.ctx.arc(cx, cy, state.cellSize / 2 + 4, 0, Math.PI * 2);
        refs.ctx.fill();
        refs.ctx.strokeStyle = 'rgba(0, 200, 255, 0.7)';
        refs.ctx.lineWidth = 2;
        refs.ctx.stroke();
    }

    // Number label (always upright)
    refs.ctx.fillStyle = '#fff';
    refs.ctx.font = `bold ${Math.max(8, state.cellSize / 4)}px sans-serif`;
    refs.ctx.textAlign = 'center';
    refs.ctx.textBaseline = 'middle';
    refs.ctx.shadowColor = '#000';
    refs.ctx.shadowBlur = 3;
    refs.ctx.fillText(num.toString(), cx, cy);
    refs.ctx.shadowBlur = 0;
}

export function drawLaser(path, fade = 0) {
    const refs = getRefsObj();
    if (path.length < 2) return false;

    const cs = state.cellSize;
    const px0 = state.boardX + path[0][0] * cs + cs / 2;
    const py0 = state.boardY + path[0][1] * cs + cs / 2;
    const px1 = state.boardX + path[path.length - 1][0] * cs + cs / 2;
    const py1 = state.boardY + path[path.length - 1][1] * cs + cs / 2;
    const len = Math.hypot(px1 - px0, py1 - py0);

    // ── Sprite: barra vertical repetida a lo largo del rayo (Laser.png).
    // Se tesela del centro del tirador al BORDE de la casilla objetivo,
    // para no pintar el haz encima del tanque impactado. ──
    const img = SPRITES.laser;
    if (img && img.complete && img.naturalWidth > 0) {
        refs.ctx.save();
        refs.ctx.translate(px0, py0);
        // teselos a lo largo del eje local +y; girar +y hacia la dirección del rayo
        const ux = (px1 - px0) / (len || 1),
            uy = (py1 - py0) / (len || 1);
        refs.ctx.rotate(Math.atan2(-ux, uy));
        refs.ctx.globalCompositeOperation = 'lighter';
        const tileH = cs * 1.0;
        const tileW = cs * 0.46;
        // Cuando COLISIONA con un tanque el haz llega hasta el CENTRO de su
        // casilla (le "pega en la mitad") y allí explota el efecto de impacto,
        // que tapa el extremo del haz — ya no se ve como "traspasar".
        // Si no colisiona y la última casilla es el borde del mapa, el haz
        // llega hasta la LINEA del borde (sin cuadro de margen).
        const lastCell = path[path.length - 1];
        let blockedHere = false;
        for (const t of Object.values(state.gameState?.tanks || {})) {
            if (t.x === lastCell[0] && t.y === lastCell[1] && (!t.phase || t.phase === 'alive')) blockedHere = true;
        }
        const bw = state.gameState?.board?.width ?? 0,
            bh = state.gameState?.board?.height ?? 0;
        const atEdge = lastCell[0] === 0 || lastCell[1] === 0 || lastCell[0] === bw - 1 || lastCell[1] === bh - 1;
        const effLen = atEdge && !blockedHere ? len + cs * 0.5 : len;
        // Cascada: al recibir `fade` (0→1), los tiles se atenúan DESDE el
        // tirador hacia el punto de impacto. tile i aparece con alpha
        // 1-fade*y i/(n-1); el último tile es el que muere al final.
        const tiles = Math.max(1, Math.ceil(effLen / tileH));
        const fadeAmt = typeof fade === 'number' && fade > 0 ? Math.min(1, fade) : 0;
        for (let i = 0; i < tiles; i++) {
            const d = i * tileH;
            const h = Math.min(tileH, effLen - d);
            if (h <= 0) break;
            // escalón de desvanecimiento por posición en la cascada
            const step = tiles > 1 ? i / (tiles - 1) : 0;
            // cada tile empieza a morir cuando fade cruza su umbral relativo
            const local = Math.max(0, Math.min(1, (fadeAmt - step * 0.55) / 0.45));
            const a = 1 - local;
            if (a <= 0.02) continue;
            refs.ctx.globalAlpha = a;
            refs.ctx.drawImage(img, -tileW / 2, d, tileW, h);
        }
        refs.ctx.globalAlpha = 1;
        refs.ctx.restore();
        // colisionó contra un tanque vivo → el llamador dibuja el impacto
        return blockedHere;
    }

    // Glow effect (fallback sin sprite)
    refs.ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
    refs.ctx.lineWidth = state.cellSize / 2;
    refs.ctx.lineCap = 'round';
    refs.ctx.beginPath();
    refs.ctx.moveTo(px0, py0);
    for (let i = 1; i < path.length; i++) {
        refs.ctx.lineTo(
            state.boardX + path[i][0] * state.cellSize + state.cellSize / 2,
            state.boardY + path[i][1] * state.cellSize + state.cellSize / 2
        );
    }
    refs.ctx.stroke();

    // Core line
    refs.ctx.strokeStyle = '#ff0000';
    refs.ctx.lineWidth = 3;
    refs.ctx.beginPath();
    refs.ctx.moveTo(px0, py0);
    for (let i = 1; i < path.length; i++) {
        refs.ctx.lineTo(
            state.boardX + path[i][0] * state.cellSize + state.cellSize / 2,
            state.boardY + path[i][1] * state.cellSize + state.cellSize / 2
        );
    }
    refs.ctx.stroke();
}

// ─── Efecto de impacto de láser ───────────────────────────────
// Bola de fuego compacta (Flash_A_04) estallando en el centro de la
// casilla del tanque impactado, creciendo y desvaneciéndose durante el
// paso. scale: 0→1 progreso del paso.
export function drawLaserHit(x, y, scale = 1) {
    const refs = getRefsObj();
    const cs = state.cellSize;
    const cx = state.boardX + x * cs + cs / 2;
    const cy = state.boardY + y * cs + cs / 2;
    const img = SPRITES.flash && SPRITES.flash.length >= 4 ? SPRITES.flash[3] : null;
    refs.ctx.save();
    refs.ctx.globalCompositeOperation = 'lighter';
    if (img && img.complete && img.naturalWidth > 0) {
        // bbox del arte: 43..85 × 46..82 de 128 — recortar y centrar
        const r = cs * (0.5 + 0.22 * scale); // crece al estallar
        const a = Math.max(0, 1 - scale * scale * 0.8); // se apaga rápido
        refs.ctx.globalAlpha = a;
        refs.ctx.drawImage(img, 30, 33, 68, 68, cx - r, cy - r, r * 2, r * 2);
        // destello blanco inicial
        const g = refs.ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.9);
        g.addColorStop(0, `rgba(255,250,220,${0.75 * (1 - scale)})`);
        g.addColorStop(1, 'rgba(255,150,50,0)');
        refs.ctx.fillStyle = g;
        refs.ctx.beginPath();
        refs.ctx.arc(cx, cy, r * 0.9, 0, Math.PI * 2);
        refs.ctx.fill();
    } else {
        const r = cs * 0.35 * (0.7 + 0.5 * scale);
        const g = refs.ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(255,240,180,${0.9 * (1 - scale * 0.8)})`);
        g.addColorStop(0.5, `rgba(255,120,20,${0.6 * (1 - scale * 0.8)})`);
        g.addColorStop(1, 'rgba(255,60,0,0)');
        refs.ctx.fillStyle = g;
        refs.ctx.beginPath();
        refs.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        refs.ctx.fill();
    }
    refs.ctx.restore();
}

export function drawBlast(tankX, tankY) {
    const refs = getRefsObj();
    const cs = state.cellSize;
    const cx = state.boardX + tankX * cs + cs / 2;
    const cy = state.boardY + tankY * cs + cs / 2;

    // ── Flash_A: estela de púas irradiando — se repite al frente, lados y
    // atrás del tanque (rotada 4×) para dar sensación de expansión. El tile
    // 128x128 tiene la punta al tope: se recorta a 64x64 (punta+rayo) y se
    // apoya con la base en el centro del tanque, apuntando hacia afuera. ──
    const flash = SPRITES.flash;
    const fimg =
        flash && flash.length >= 2 && flash[1] && flash[1].complete && flash[1].naturalWidth > 0 ? flash[1] : null;
    if (fimg) {
        refs.ctx.save();
        refs.ctx.globalCompositeOperation = 'lighter';
        const half = cs * 1.45; // alcance de la púa
        const srcW = 56,
            srcH = 96; // recorte: puntero central
        const sx = (fimg.naturalWidth - srcW) / 2,
            sy = fimg.naturalHeight - srcH;
        for (let i = 0; i < 4; i++) {
            refs.ctx.save();
            refs.ctx.translate(cx, cy);
            refs.ctx.rotate((i * Math.PI) / 2);
            refs.ctx.drawImage(fimg, sx, sy, srcW, srcH, -half * 0.28, -half, half * 0.56, half);
            refs.ctx.restore();
        }
        // núcleo brillante
        const g = refs.ctx.createRadialGradient(cx, cy, 0, cx, cy, cs * 0.8);
        g.addColorStop(0, 'rgba(255, 240, 180, 0.95)');
        g.addColorStop(0.45, 'rgba(255, 140, 30, 0.55)');
        g.addColorStop(1, 'rgba(255, 60, 0, 0)');
        refs.ctx.fillStyle = g;
        refs.ctx.beginPath();
        refs.ctx.arc(cx, cy, cs * 0.8, 0, Math.PI * 2);
        refs.ctx.fill();
        refs.ctx.restore();
        return;
    }

    if (state.spritesLoaded && SPRITES.explosion.length > 0) {
        // Use first explosion frame for blast
        const img = SPRITES.explosion[0];
        if (img && img.complete && img.naturalWidth > 0) {
            const size = state.cellSize * 2.5;
            refs.ctx.drawImage(img, cx - size / 2, cy - size / 2, size, size);
            return;
        }
    }

    // Fallback: drawn explosion
    const r = state.cellSize * 1.5;
    const gradient = refs.ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    gradient.addColorStop(0, 'rgba(255, 100, 0, 0.8)');
    gradient.addColorStop(0.3, 'rgba(255, 50, 0, 0.6)');
    gradient.addColorStop(0.6, 'rgba(200, 0, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(100, 0, 0, 0)');
    refs.ctx.fillStyle = gradient;
    refs.ctx.beginPath();
    refs.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    refs.ctx.fill();

    // Inner bright core
    refs.ctx.fillStyle = 'rgba(255, 200, 50, 0.9)';
    refs.ctx.beginPath();
    refs.ctx.arc(cx, cy, state.cellSize / 4, 0, Math.PI * 2);
    refs.ctx.fill();

    // Sparks radiating outward
    refs.ctx.strokeStyle = 'rgba(255, 150, 0, 0.7)';
    refs.ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const sparkLen = state.cellSize * (0.5 + Math.random() * 0.5);
        refs.ctx.beginPath();
        refs.ctx.moveTo(cx, cy);
        refs.ctx.lineTo(cx + Math.cos(angle) * sparkLen, cy + Math.sin(angle) * sparkLen);
        refs.ctx.stroke();
    }
}

export function drawDeath(tankX, tankY, frameNum) {
    const refs = getRefsObj();
    const cx = state.boardX + tankX * state.cellSize + state.cellSize / 2;
    const cy = state.boardY + tankY * state.cellSize + state.cellSize / 2;

    if (state.spritesLoaded && SPRITES.explosion.length > 0) {
        // Draw current explosion frame from animated sequence
        const fn = frameNum !== undefined ? frameNum : state.deathAnimFrame;
        const frameIdx = Math.min(fn, SPRITES.explosion.length - 1);
        const img = SPRITES.explosion[frameIdx];
        if (img && img.complete && img.naturalWidth > 0) {
            const size = state.cellSize * 2;
            refs.ctx.drawImage(img, cx - size / 2, cy - size / 2, size, size);
            return;
        }
    }

    // Fallback: drawn explosion with skull
    const r = state.cellSize * 1.2;
    const gradient = refs.ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    gradient.addColorStop(0, 'rgba(255, 50, 0, 0.9)');
    gradient.addColorStop(0.2, 'rgba(200, 30, 0, 0.7)');
    gradient.addColorStop(0.5, 'rgba(100, 50, 50, 0.4)');
    gradient.addColorStop(1, 'rgba(50, 50, 50, 0)');
    refs.ctx.fillStyle = gradient;
    refs.ctx.beginPath();
    refs.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    refs.ctx.fill();

    // Skull emoji
    refs.ctx.font = `${state.cellSize * 0.8}px sans-serif`;
    refs.ctx.textAlign = 'center';
    refs.ctx.textBaseline = 'middle';
    refs.ctx.fillText('💀', cx, cy);

    // Flying debris particles
    refs.ctx.fillStyle = 'rgba(255, 100, 0, 0.8)';
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.5;
        const dist = state.cellSize * (0.6 + Math.random() * 0.6);
        const dpx = cx + Math.cos(angle) * dist;
        const dpy = cy + Math.sin(angle) * dist;
        const size = 2 + Math.random() * 3;
        refs.ctx.fillRect(dpx - size / 2, dpy - size / 2, size, size);
    }
}
