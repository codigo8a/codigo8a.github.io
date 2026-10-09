// ─── Animation Controls ─────────────────────────────────────

import { MOVE_DURATION, TURN_DURATION } from './constants.js';
import { state } from './state.js';
import { SPRITES } from './sprites.js';
import { render, drawLaser, drawBlast, drawLaserHit } from './renderer.js';
import { sound } from './sound.js';
import { addChatMessage } from './chat.js';
import { getRefsObj } from './refs.js';
import { setInputsDisabled } from './ui.js';

// Global dedup for cumulative fx: pit_fall stays in engine.fx / game_state.fx
// forever (cleared only on start_round), so playNextFrame would restart the
// shrink every frame. seenPitKeys ensures each tank/pos animates once per round.
const seenPitKeys = new Set();

// Un paso puede contener varias muertes: cada una tiene su propio slot de
// animación de explosión.
function startMultiDeath(deaths) {
    if (state.deathAnimTimer) {
        clearInterval(state.deathAnimTimer);
        state.deathAnimTimer = null;
    }
    const anims = (deaths || []).slice(0, 8).map((d) => {
        const pos = d.death_state || {};
        return { x: pos.x, y: pos.y, frame: 0, active: true };
    });
    if (!anims.length) return;
    state.deathAnims = anims;
    state.deathAnimActive = true;
    state.deathAnimFrame = 0;
    state.deathAnimTimer = setInterval(() => {
        let anyActive = false;
        for (const a of anims) {
            a.frame++;
            if (a.frame < SPRITES.explosion.length) anyActive = true;
            else a.active = false;
        }
        state.deathAnimFrame = anims[0].frame;
        if (!anyActive) {
            clearInterval(state.deathAnimTimer);
            state.deathAnimTimer = null;
            state.deathAnimActive = false;
            state.deathAnims = [];
        } else {
            render();
        }
    }, 80);
}

// Pit (pozo) shrink — tank falls into the hole scaling 1 -> 0 over ~500ms
function startPitShrink(deaths) {
    if (state.pitAnimTimer) {
        cancelAnimationFrame(state.pitAnimTimer);
        clearInterval(state.pitAnimTimer);
        state.pitAnimTimer = null;
    }
    if (state.pitAnimRaf) {
        cancelAnimationFrame(state.pitAnimRaf);
        state.pitAnimRaf = null;
    }
    const anims = (deaths || [])
        .slice(0, 8)
        .map((d) => {
            const pos = d.death_state || {};
            return {
                x: pos.x ?? d.x,
                y: pos.y ?? d.y,
                num: pos.num ?? d.num,
                direction: pos.direction || 'N',
                tankId: d.tank,
                scale: 1,
                active: true
            };
        })
        .filter((a) => typeof a.x === 'number' && typeof a.y === 'number');
    if (!anims.length) return;
    state.pitAnims = anims;
    state.pitAnimActive = true;
    const start = performance.now();
    const duration = 500;
    function frame(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-in quad for falling feel
        const scale = Math.max(0, 1 - progress * progress * 1.1);
        let anyActive = false;
        for (const a of anims) {
            a.scale = scale;
            a.active = progress < 1 && scale > 0.02;
            if (a.active) anyActive = true;
        }
        render();
        if (!anyActive || progress >= 1) {
            state.pitAnimTimer = null;
            state.pitAnimRaf = null;
            state.pitAnimActive = false;
            state.pitAnims = [];
        } else {
            state.pitAnimRaf = requestAnimationFrame(frame);
            state.pitAnimTimer = state.pitAnimRaf;
        }
    }
    state.pitAnimRaf = requestAnimationFrame(frame);
    state.pitAnimTimer = state.pitAnimRaf;
}

export function startAnimation(totalFrames) {
    state.animating = true;
    state.animationFrames = [];
    state.currentFrame = -1;
    seenPitKeys.clear();
    setInputsDisabled(getRefsObj(), true);
}

export function finishAnimation() {
    const refs = getRefsObj();
    state.animating = false;
    state.animationFrames = [];
    state.currentFrame = -1;
    if (state.animationTimer) {
        clearTimeout(state.animationTimer);
        state.animationTimer = null;
    }
    // Clean up any running death / pit animations
    if (state.deathAnimTimer) {
        clearInterval(state.deathAnimTimer);
        state.deathAnimTimer = null;
    }
    state.deathAnimActive = false;
    state.deathAnimFrame = 0;
    state.deathAnims = [];
    if (state.pitAnimTimer) {
        cancelAnimationFrame(state.pitAnimTimer);
        clearInterval(state.pitAnimTimer);
        state.pitAnimTimer = null;
    }
    if (state.pitAnimRaf) {
        cancelAnimationFrame(state.pitAnimRaf);
        state.pitAnimRaf = null;
    }
    state.pitAnimActive = false;
    state.pitAnims = [];
    seenPitKeys.clear();
    // Clear movement transitions, rotations, and effects
    state.tankTransitions = {};
    state.tankRotations = {};
    state.currentFrameEffects = null;
    state.persistentLasers = [];
    state.blastPositions = [];
    state.laserFadeStart = 0;
    state.laserHits = [];
    stopTransitionLoop();
    // No habilitar el teclado aqui: queda bloqueado hasta que el servidor
    // ponga state=programming (round_started / game_state). Asi no hay
    // micro-parpadeo entre los 6 steps: solo se habilita en programming real.
    // refreshInputsEnabled() del socket lo habilitara cuando toque.
    setInputsDisabled(refs, true);
}

export function playNextFrame() {
    if (state.currentFrame >= state.animationFrames.length - 1) {
        finishAnimation();
        return;
    }

    state.currentFrame++;
    const frame = state.animationFrames[state.currentFrame];
    console.log(`[FRAME ${state.currentFrame}/${state.animationFrames.length}] desc=${frame.description}`);

    // Save previous positions before updating gameState (deep clone via
    // structuredClone — JSON round-trip would throw on invalid input)
    const prevTanks = state.gameState ? structuredClone(state.gameState.tanks || {}) : {};

    // Normalize frame data: new consolidated format (data.actions[]/data.deaths[])
    // or legacy single-action format for backward compatibility.
    const d = frame.data || {};
    const actionList = d.actions || (d.action ? [d] : []);
    const deathList = d.deaths || (d.action === 'death' ? [d] : []);

    // Tanks that died THIS step: skip their movement/rotation animation
    // (explosion replaces them) and show HP pre-death on the same frame.
    const deadThisStep = new Set(deathList.map((x) => x.tank));
    state.currentDeaths = deathList;

    // Update board to this frame's game state
    state.gameState = frame.game_state;

    // Start ALL movement/rotation transitions together (simultaneous!)
    if (state.gameState && state.gameState.tanks) {
        for (const [tid, tank] of Object.entries(state.gameState.tanks)) {
            const prev = prevTanks[tid];
            if (!prev) continue;

            // detectó si este tanque actuó con movimiento en este paso
            const isDead = deadThisStep.has(tid);

            // Clear stale transition for respawning tank (dead -> alive): prevents
            // 1-frame flicker at death position before sliding to spawn
            if (tank.phase === 'alive' && prev.phase === 'dead') {
                delete state.tankTransitions[tid];
            }

            // Animar cualquier cambio de posición (movimiento propio, empujón),
            // solo si ambas fases son alive — respawn no debe deslizar desde muerte.
            if (
                !isDead &&
                prev.phase === 'alive' &&
                tank.phase === 'alive' &&
                (prev.x !== tank.x || prev.y !== tank.y)
            ) {
                const existing = state.tankTransitions[tid];
                let fromX, fromY;
                if (existing) {
                    const elapsed = performance.now() - existing.startTime;
                    const progress = Math.min(elapsed / existing.duration, 1);
                    const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
                    fromX = existing.fromX + (existing.toX - existing.fromX) * eased;
                    fromY = existing.fromY + (existing.toY - existing.fromY) * eased;
                } else {
                    fromX = prev.x;
                    fromY = prev.y;
                }
                state.tankTransitions[tid] = {
                    fromX: fromX,
                    fromY: fromY,
                    toX: tank.x,
                    toY: tank.y,
                    startTime: performance.now(),
                    duration: MOVE_DURATION
                };
            }

            // Direction changes → rotation animation
            if (!isDead && prev.direction !== tank.direction) {
                const dirAngles = { N: 0, E: Math.PI / 2, S: Math.PI, W: -Math.PI / 2 };
                const fromAngle = dirAngles[prev.direction] || 0;
                const toAngle = dirAngles[tank.direction] || 0;
                let diff = toAngle - fromAngle;
                if (diff > Math.PI) diff -= 2 * Math.PI;
                if (diff < -Math.PI) diff += 2 * Math.PI;
                state.tankRotations[tid] = {
                    fromAngle: fromAngle,
                    toAngle: fromAngle + diff,
                    startTime: performance.now(),
                    duration: TURN_DURATION
                };
            }
        }
    }

    render();

    // Start transition render loop if there are active transitions or rotations
    if (Object.keys(state.tankTransitions).length > 0 || Object.keys(state.tankRotations).length > 0) {
        restartTransitionLoop();
    }

    // Collect ALL effects of this step (each laser, each blast) — simultaneous
    state.currentFrameEffects = null;
    state.laserHits = state.laserHits || [];
    const lasers = [];
    const blasts = [];
    const sounds = new Set();
    for (const a of actionList) {
        if (a.laser_path && a.laser_path.length > 1) lasers.push(a.laser_path);
        if (a.action === 'blast' && a.blast_pos) blasts.push(a.blast_pos);
        if (a.action === 'death') continue;
        sounds.add(a.action);
    }
    state.persistentLasers = lasers;
    state.blastPositions = blasts;
    state.laserFadeStart = lasers.length ? performance.now() : 0;
    if (lasers.length || blasts.length) {
        state.currentFrameEffects = { lasers, blasts };
    }
    // Impactos de láser sobre tanques (Flash_A_04 en el centro de la víctima)
    state.laserHits = [];
    if (lasers.length) {
        for (const p of lasers) {
            if (drawLaser(p)) {
                const h = { x: p[p.length - 1][0], y: p[p.length - 1][1], t0: performance.now() };
                state.laserHits.push(h);
                drawLaserHit(h.x, h.y, 0.05);
            }
        }
    }
    if (blasts.length) {
        for (const p of blasts) drawBlast(p.x, p.y);
    }

    // Cascada de desvanecimiento: aunque no haya transiciones de tanques, el
    // láser necesita rAF para atenuarse tile a tile durante el paso.
    if (lasers.length && !Object.keys(state.tankTransitions).length && !Object.keys(state.tankRotations).length) {
        restartTransitionLoop();
    }

    // Death animations — split pit shrink vs explosion vs off-map (pit sound, no visual)
    if (deathList.length > 0) {
        const isOffMapDeath = (d) => d.cause === 'pushed_off_map' || d.cause === 'fell_off_map';
        const isPitDeath = (d) =>
            !isOffMapDeath(d) &&
            (d.cause === 'fell_into_pit' ||
                d.cause === 'pit_fall' ||
                (d.events || []).some((e) => typeof e === 'string' && e.includes('fell into a pit')) ||
                (d.events || []).some((e) => typeof e === 'string' && e.toLowerCase().includes('pit_fall')));
        const pitDeaths = deathList.filter(isPitDeath);
        const offMapDeaths = deathList.filter(isOffMapDeath);
        const explosionDeaths = deathList.filter((d) => !isPitDeath(d) && !isOffMapDeath(d));
        if (explosionDeaths.length) {
            startMultiDeath(explosionDeaths);
            sounds.add('death');
        }
        if (offMapDeaths.length) {
            sounds.add('pit_fall');
        }
        if (pitDeaths.length) {
            const filtered = pitDeaths.filter((d) => {
                const key = d.tank ? `tank:${d.tank}` : `pos:${d.death_state?.x ?? d.x},${d.death_state?.y ?? d.y}`;
                if (seenPitKeys.has(key)) return false;
                if (
                    state.pitAnims.some(
                        (a) =>
                            a.tankId === d.tank ||
                            (a.x === (d.death_state?.x ?? d.x) && a.y === (d.death_state?.y ?? d.y))
                    )
                )
                    return false;
                return true;
            });
            if (filtered.length) {
                for (const d of filtered) {
                    const key = d.tank ? `tank:${d.tank}` : `pos:${d.death_state?.x ?? d.x},${d.death_state?.y ?? d.y}`;
                    seenPitKeys.add(key);
                }
                startPitShrink(filtered);
                sounds.add('pit_fall');
            }
        }
        // Also handle fx-driven pit_fall without deaths entry (e.g. conveyor)
        if (!pitDeaths.length) {
            const fx = (frame.game_state && frame.game_state.fx) || state.gameState?.fx || [];
            const pitFx = fx.filter((e) => e && e.kind === 'pit_fall');
            if (pitFx.length) {
                const synthetic = pitFx.map((e) => ({
                    tank: e.tank_id,
                    num: e.num,
                    death_state: { x: e.x, y: e.y, num: e.num, direction: e.direction || 'N' },
                    cause: 'fell_into_pit'
                }));
                const notDup = synthetic.filter((s) => {
                    const key = s.tank ? `tank:${s.tank}` : `pos:${s.death_state.x},${s.death_state.y}`;
                    if (seenPitKeys.has(key)) return false;
                    if (state.pitAnims.some((a) => a.x === s.death_state.x && a.y === s.death_state.y)) return false;
                    return true;
                });
                if (notDup.length) {
                    for (const s of notDup)
                        seenPitKeys.add(s.tank ? `tank:${s.tank}` : `pos:${s.death_state.x},${s.death_state.y}`);
                    startPitShrink(notDup);
                    sounds.add('pit_fall');
                }
            }
        }
    } else {
        // No deaths entry but pit_fall fx present (conveyor/repulsor pit)
        const fx = (frame.game_state && frame.game_state.fx) || [];
        const pitFx = fx.filter((e) => e && e.kind === 'pit_fall');
        if (pitFx.length) {
            const synthetic = pitFx.map((e) => ({
                tank: e.tank_id,
                num: e.num,
                death_state: { x: e.x, y: e.y, num: e.num, direction: e.direction || 'N' },
                cause: 'fell_into_pit'
            }));
            const notDup = synthetic.filter((s) => {
                const key = s.tank ? `tank:${s.tank}` : `pos:${s.death_state.x},${s.death_state.y}`;
                if (seenPitKeys.has(key)) return false;
                if (state.pitAnims.some((a) => a.x === s.death_state.x && a.y === s.death_state.y)) return false;
                return true;
            });
            if (notDup.length) {
                for (const s of notDup)
                    seenPitKeys.add(s.tank ? `tank:${s.tank}` : `pos:${s.death_state.x},${s.death_state.y}`);
                startPitShrink(notDup);
                sounds.add('pit_fall');
            }
        }
    }

    // Play sounds (each action type once per step)
    for (const act of sounds) {
        if (act === 'laser') sound.play('laser');
        else if (act === 'blast') sound.play('blast');
        else if (act === 'forward' || act === 'back' || act === 'turbo') sound.play('move');
        else if (act === 'turn_left' || act === 'turn_right') sound.play('turn');
        else if (act === 'shield') sound.play('shield');
        else if (act === 'death') sound.play('death');
        else if (act === 'pit_fall' || act === 'pit') sound.play('pit_fall');
    }

    // El letrero de status fue eliminado; la narración del paso vive en console.log.

    // Show events in chat (from all actions + deaths of this step)
    for (const a of actionList) {
        for (const evt of a.events || []) addChatMessage('Sistema', evt);
    }
    for (const dd of deathList) {
        for (const evt of dd.events || []) addChatMessage('Sistema', evt);
    }
    if (d.hits) {
        for (const h of d.hits) {
            for (const evt of h.events || []) addChatMessage('Sistema', evt);
        }
    }
    for (const evt of d.events || []) addChatMessage('Sistema', evt);

    // Schedule next frame
    state.animationTimer = setTimeout(() => {
        state.animationTimer = null;
        playNextFrame();
    }, state.animationSpeed);
}

// ─── Transition Render Loop ──────────────────────────────────
// Throttling via requestAnimationFrame — browser paces to ~60fps; no fixed
// interval or busy loop. transitionLoop re-queues itself via rAF and yields
// to the browser between frames (keeps 16.7ms budget).

export function startTransitionLoop() {
    if (state.transitionRafId) return; // already running
    state.transitionRafId = requestAnimationFrame(transitionLoop);
}

export function restartTransitionLoop() {
    // Force restart the loop (used when new transitions arrive)
    if (state.transitionRafId) {
        cancelAnimationFrame(state.transitionRafId);
    }
    state.transitionRafId = requestAnimationFrame(transitionLoop);
}

export function stopTransitionLoop() {
    if (state.transitionRafId) {
        cancelAnimationFrame(state.transitionRafId);
        state.transitionRafId = null;
    }
}

function transitionLoop() {
    // Check if any transitions or rotations are still active
    let hasActive = false;
    for (const tid in state.tankTransitions) {
        const t = state.tankTransitions[tid];
        const elapsed = performance.now() - t.startTime;
        if (elapsed < t.duration) {
            hasActive = true;
        } else {
            delete state.tankTransitions[tid];
        }
    }
    for (const tid in state.tankRotations) {
        const r = state.tankRotations[tid];
        const elapsed = performance.now() - r.startTime;
        if (elapsed < r.duration) {
            hasActive = true;
        } else {
            delete state.tankRotations[tid];
        }
    }
    // Cascada del láser: hold 250ms visible + fade 450ms (dentro del paso de 750ms)
    const LASER_HOLD_MS = 250,
        LASER_FADE_MS = 450,
        HIT_MS = 400;
    let laserFade = 0;
    if (state.laserFadeStart && (state.persistentLasers || []).length) {
        const el = performance.now() - state.laserFadeStart;
        laserFade = Math.min(1, Math.max(0, (el - LASER_HOLD_MS) / LASER_FADE_MS));
        if (el < LASER_HOLD_MS + LASER_FADE_MS) hasActive = true;
        else state.laserFadeStart = 0;
    }
    // Impactos de láser: estallido con Flash_A_04 durante ~400ms
    const hits = state.laserHits || [];
    if (hits.length) {
        const now = performance.now();
        state.laserHits = hits.filter((h) => now - h.t0 < HIT_MS);
        if (state.laserHits.length) hasActive = true;
    }

    if (hasActive) {
        render();
        // Redraw persistent effects (all lasers, blasts) on top of rendered board
        if (state.currentFrameEffects) {
            for (const p of state.currentFrameEffects.lasers || []) {
                drawLaser(p, laserFade);
            }
            for (const b of state.currentFrameEffects.blasts || []) {
                drawBlast(b.x, b.y);
            }
        } else if (state.persistentLasers && state.persistentLasers.length) {
            for (const p of state.persistentLasers) drawLaser(p, laserFade);
        }
        for (const h of state.laserHits || []) {
            drawLaserHit(h.x, h.y, Math.min(1, (performance.now() - h.t0) / HIT_MS));
        }
        state.transitionRafId = requestAnimationFrame(transitionLoop);
    } else {
        state.transitionRafId = null;
        state.currentFrameEffects = null;
        state.persistentLasers = [];
        state.blastPositions = [];
        state.laserHits = [];
    }
}
