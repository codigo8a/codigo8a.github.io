// ─── Bots: the decision AI (docs/RULES.md §8 HUECO-7) ─────────────────
//
// Port of the decision half of `game/bots.py`. That file splits in two:
// `BotRunner` is the whole threading half — a `Thread`, a `time.sleep`
// poll loop, session locks and socket emits — and it is DISCARDED whole.
// A browser game loop is single-threaded and the demo has no timers, so
// there is nothing for a runner to do: the caller decides a plan per round
// and the round resolves when the player submits.
//
// What is ported, name for name:
//
//   * `decide_actions` → {@link decideActions},
//   * `_decide_core`   → {@link decideCore},
//   * `_fallback_patrol_actions` → {@link fallbackPatrolActions},
//   * `_frustration_step` → {@link frustrationStep},
//   * `_delta`, `_dir_to`, `_turns_to`, `_clear_line` → {@link delta},
//     {@link dirTo}, {@link turnsTo}, {@link clearLine}.
//
// No DOM, no canvas, no imports from `web/static/`. The only import is the
// two constants it shares with the rest of the simulation.
//
// ## Internal action names, not key letters
//
// The Python works in raw chat commands — `W`, `S`, `A`, `D`, `Q`, `E`. The
// demo has no chat parser: the input is the sidebar buttons, and the
// executor's vocabulary is `sim/actions.js`'s internal names. So the port
// answers `forward`, `back`, `turn_left`, `turn_right`, `laser`, `blast`.
// `getAction` returns null for anything else and the executor would skip it
// in silence, which is why a test asserts the plan never leaves the registry.
//
// ## The randomness is injectable
//
// The AI is probabilistic: `blast_p = 0.55` here, plus `BLAST_LINEUP_P` and
// `CLOSE_IN_P` at 0.6, plus a couple of unnamed draws. Every draw goes
// through an injected `random` (defaulting to `Math.random`), following the
// pattern T2's `Board.pickFreeCell` and T5's `Round` established, so a test
// can pin the whole plan with a seeded source.
//
// ## Excluded, on purpose
//
//   * `is_pit`: pits are DORMIDO — no air map enables them. Without it the
//     pit-push priority (Python's 1a) is unreachable and dropped, and
//     `safe_free` reduces to "in bounds, walkable, empty",
//   * the `has_shield` branch: HUECO-7 notes `_decide_core` reads the flag
//     and nothing in the runtime ever sets it true, so `shield` is never
//     programmed. The bot does not propose it,
//   * `game/robot.py`: a duplicate `Tank` model, not the AI,
//   * `BotRunner`: the entire threading half.
//
// ## H11 — the turbo placeholders
//
// `turbo_placeholder` and `turbo_<dir>_<n>` exist in the Python only to
// satisfy `commands._apply_turbo_direction`, the chat parser's `ZW` rewrite.
// No ported function references them, and this module must not start: they
// are not in `sim/actions.js`'s registry, so emitting one would be a silent
// skipped step. The bot never plays `turbo` at all.

import { DIR_DELTA, MAX_ACTIONS } from './tank.js';

/** @typedef {import('./tank.js').Tank} Tank */

/**
 * The demo's "engine" as the bot reads it: the `Round` instance. The Python
 * passes its `Engine` and reads `board`, `tanks` and `round_num`; the demo
 * `Round` carries the same three.
 *
 * @typedef {object} BotEngine
 * @property {import('./board.js').Board} board
 * @property {Map<string, Tank>} tanks id -> tank, every tank in the match
 * @property {number} roundNum how many rounds have started
 */

/**
 * `DIR_ORDER` in `game/bots.py`: NORTH, EAST, SOUTH, WEST.
 *
 * The turn math depends on this exact order — from N to E is one clockwise
 * step — and it is NOT the demo's `DIRECTIONS` (`N`, `S`, `E`, `W`).
 * @type {ReadonlyArray<string>}
 */
export const DIR_ORDER = Object.freeze(['N', 'E', 'S', 'W']);

/** `_STALK_CAP`: the most extra chase steps frustration can accumulate. */
export const STALK_CAP = 4;

/** `BLAST_LINEUP_P`: chance of aligning a blast with the advance route. */
export const BLAST_LINEUP_P = 0.6;

/** `CLOSE_IN_P`: chance of forcing a one-tile advance after a quiet round. */
export const CLOSE_IN_P = 0.6;

/** `decide_actions`'s `blast_p` default: the random blast spark. */
export const BLAST_P = 0.55;

// The internal action names, so the ported control flow reads like the
// Python's `"W"`/`"Q"` while the values stay in the executor's vocabulary.
const FORWARD = 'forward';
const TURN_LEFT = 'turn_left';
const TURN_RIGHT = 'turn_right';
const LASER = 'laser';
const BLAST = 'blast';

/**
 * The frustration memory of `_FRUSTRATION`, keyed by engine.
 *
 * The Python keeps a single module-global dict keyed by `tank.id`, so its
 * memory leaks across matches — a `reset_match` does not clear it. The demo
 * keys a per-engine map instead, so a new match starts with no memory and a
 * test can run two independent rounds without one steering the other. The
 * shape of each entry is the Python's, field for field.
 *
 * @type {WeakMap<BotEngine, Map<string, {foe: string, dealt: number, x: number, y: number, rounds: number}>>}
 */
const FRUSTRATION = new WeakMap();

/**
 * The nearest enemy by Manhattan distance, ties going to the first in
 * roster order — the same `min(..., key=...)` the Python uses.
 *
 * @param {Tank[]} enemies
 * @param {Tank} tank
 * @returns {Tank}
 */
function nearest(enemies, tank) {
    let best = enemies[0];
    let bestDist = Math.abs(best.x - tank.x) + Math.abs(best.y - tank.y);
    for (const enemy of enemies) {
        const dist = Math.abs(enemy.x - tank.x) + Math.abs(enemy.y - tank.y);
        if (dist < bestDist) {
            best = enemy;
            bestDist = dist;
        }
    }
    return best;
}

/**
 * One tile of travel per facing. Port of `_delta`, which reads `DIR_DELTA`.
 * @param {string} direction one of {@link DIR_ORDER}
 * @returns {readonly [number, number]}
 */
export function delta(direction) {
    return DIR_DELTA[direction];
}

/**
 * The compass direction that points from one cell to another, in the
 * Python's priority order: x first, then y. Port of `_dir_to`.
 * @param {number} x
 * @param {number} y
 * @param {number} tx
 * @param {number} ty
 * @returns {string}
 */
export function dirTo(x, y, tx, ty) {
    if (tx > x) return 'E';
    if (tx < x) return 'W';
    if (ty > y) return 'S';
    return 'N';
}

/**
 * The quarter turns that take `cur` to `want`. Port of `_turns_to`.
 *
 * A half turn is a coin flip between two rights and two lefts, which is the
 * one place the Python's own draw lives inside a geometry helper.
 *
 * @param {string} cur
 * @param {string} want
 * @param {() => number} [random]
 * @returns {string[]} internal turn names, empty when already facing `want`
 */
export function turnsTo(cur, want, random = Math.random) {
    const ci = DIR_ORDER.indexOf(cur);
    const wi = DIR_ORDER.indexOf(want);
    const diff = (wi - ci + 4) % 4;
    if (diff === 1) return [TURN_RIGHT];
    if (diff === 3) return [TURN_LEFT];
    if (diff === 2) return random() < 0.5 ? [TURN_RIGHT, TURN_RIGHT] : [TURN_LEFT, TURN_LEFT];
    return [];
}

/**
 * Whether no WALL and no tank stands strictly between two cells. Port of
 * `_clear_line`. A non-axis pair is never clear.
 * @param {import('./board.js').Board} board
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {boolean}
 */
export function clearLine(board, x1, y1, x2, y2) {
    if (x1 === x2) {
        const lo = Math.min(y1, y2);
        const hi = Math.max(y1, y2);
        for (let y = lo + 1; y < hi; y++) {
            if (!board.isWalkable(x1, y) || board.hasTank(x1, y)) return false;
        }
        return true;
    }
    if (y1 === y2) {
        const lo = Math.min(x1, x2);
        const hi = Math.max(x1, x2);
        for (let x = lo + 1; x < hi; x++) {
            if (!board.isWalkable(x, y1) || board.hasTank(x, y1)) return false;
        }
        return true;
    }
    return false;
}

/**
 * Updates the chase memory and returns the extra urgency steps (0..cap).
 * Port of `_frustration_step`.
 *
 * The memory is read and written under `engine`'s key. `dealt` is the summed
 * HP of every other tank, exactly as the Python sums it: a round that lowered
 * it means the strategy landed and resets the counter, any other round raises
 * it. `x`/`y` are stored and never read — the Python keeps them too.
 *
 * @param {Tank} tank
 * @param {Tank} target
 * @param {BotEngine} engine
 * @returns {number}
 */
export function frustrationStep(tank, target, engine) {
    let memory = FRUSTRATION.get(engine);
    if (memory === undefined) {
        memory = new Map();
        FRUSTRATION.set(engine, memory);
    }
    const st = memory.get(tank.id);
    const sameFoe = st !== undefined && st.foe === target.id;
    let rounds = sameFoe ? st.rounds : 0;
    let dealt;
    try {
        dealt = 0;
        for (const other of engine.tanks.values()) {
            if (other.id !== tank.id) dealt += other.hp;
        }
    } catch {
        dealt = 0;
    }
    if (sameFoe) {
        if (dealt < st.dealt) {
            rounds = 0; // it drew blood: the strategy is working
        } else {
            // A round without contact raises the frustration, whether the
            // bot stood still firing at nothing or kept missing.
            rounds += 1;
        }
    }
    memory.set(tank.id, { foe: target.id, dealt, x: tank.x, y: tank.y, rounds });
    return Math.min(rounds, STALK_CAP);
}

/**
 * A minimal, never-empty patrol plan for a bot with no decision.
 *
 * Port of `_fallback_patrol_actions`. It guarantees valid, non-empty raw
 * actions so a bot never reaches the round with `actions == []`. It turns
 * toward the centre, steps forward if the tile is free, and fills the rest
 * with lasers. The Python's `is_pit` check is dropped with the rest of the
 * DORMIDO pits.
 *
 * Like the Python, the whole body is guarded: any failure returns
 * `max_actions` lasers, which is HUECO-7's "plan de puros Q". Nothing is
 * logged or thrown — the silence is part of the port.
 *
 * @param {Tank} tank
 * @param {BotEngine} engine
 * @param {number} [maxActions=MAX_ACTIONS]
 * @param {() => number} [random=Math.random]
 * @returns {string[]}
 */
export function fallbackPatrolActions(tank, engine, maxActions = MAX_ACTIONS, random = Math.random) {
    try {
        const board = engine.board;
        const cx = Math.floor(board.width / 2);
        const cy = Math.floor(board.height / 2);
        /** @type {string[]} */
        const actions = [];
        let facing;
        if (tank.x !== cx || tank.y !== cy) {
            const want = dirTo(tank.x, tank.y, cx, cy);
            actions.push(...turnsTo(tank.direction, want, random));
            facing = actions.length > 0 ? want : tank.direction;
        } else {
            facing = tank.direction;
        }
        const [dx, dy] = DIR_DELTA[facing];
        const nx = tank.x + dx;
        const ny = tank.y + dy;
        // BOT-001's pit half is DORMIDO; `isWalkable` already refuses a tank.
        const canStep = board.inBounds(nx, ny) && board.isWalkable(nx, ny) && !board.hasTank(nx, ny);
        if (actions.length < maxActions && canStep) actions.push(FORWARD);
        while (actions.length < maxActions) actions.push(LASER);
        return actions.slice(0, maxActions);
    } catch {
        return Array.from({ length: maxActions }, () => LASER);
    }
}

/**
 * The AI itself: a raw action sequence for one tank. Port of `_decide_core`.
 *
 * Priority order, as the Python's docstring lists it (minus the pit push):
 *
 *   1. push an adjacent enemy off the EDGE, when the push really removes it,
 *   2. point-blank blast (when charged) or laser,
 *   3. a clear firing line: laser burst, then close the distance,
 *   4. chase the nearest enemy, predicting its front, escalating through
 *      frustration, and lining a blast up with the advance route.
 *
 * Returns `[]` when there is no living enemy — the caller is the one that
 * falls back, exactly as `BotRunner` did.
 *
 * @param {Tank} tank
 * @param {BotEngine} engine
 * @param {number} [maxActions=MAX_ACTIONS]
 * @param {() => number} [random=Math.random]
 * @returns {string[]}
 */
export function decideCore(tank, engine, maxActions = MAX_ACTIONS, random = Math.random) {
    const board = engine.board;
    const enemies = [...engine.tanks.values()].filter(
        (other) => other.id !== tank.id && other.isAlive()
    );
    if (enemies.length === 0) return [];

    /**
     * In bounds, not a wall, and empty. The Python's `free`.
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    function free(x, y) {
        if (!board.inBounds(x, y)) return false;
        if (!board.isWalkable(x, y)) return false;
        return !board.hasTank(x, y);
    }

    /**
     * `free` plus the pit check (BOT-001/BOT-004). The pit half is DORMIDO
     * and dropped, so this is `free` under a name that documents the intent.
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    function safeFree(x, y) {
        return free(x, y);
    }

    /** @param {number} x @param {number} y @returns {boolean} */
    function isEdgePos(x, y) {
        return x === 0 || y === 0 || x === board.width - 1 || y === board.height - 1;
    }

    /** @param {Tank} t @returns {boolean} */
    function atEdge(t) {
        return t.x === 0 || t.y === 0 || t.x === board.width - 1 || t.y === board.height - 1;
    }

    /** @type {string[]} */
    const actions = [];

    // The Python opens with a `shield` when `hp <= 3 and has_shield`. That
    // branch is unreachable (HUECO-7: nothing sets `has_shield`), so it is
    // not ported and the bot never proposes `shield`.

    // ── 0. LAST BREATH (1 HP): a lethal blast before dying ──
    if (tank.hp === 1 && tank.blastCharges > 0 && !tank.deadThisRound) {
        const inBlast = enemies.filter(
            (enemy) => Math.max(Math.abs(enemy.x - tank.x), Math.abs(enemy.y - tank.y)) <= 1
        );
        if (inBlast.length > 0) {
            actions.push(BLAST);
            while (actions.length < maxActions) actions.push(LASER);
            return actions.slice(0, maxActions);
        }
        const target = nearest(enemies, tank);
        const dx = target.x - tank.x;
        const dy = target.y - tank.y;
        if (Math.abs(dx) + Math.abs(dy) <= 4) {
            const want = dirTo(tank.x, tank.y, target.x, target.y);
            const turns = turnsTo(tank.direction, want, random);
            if (actions.length + turns.length + 2 <= maxActions) {
                const nx = tank.x + delta(want)[0];
                const ny = tank.y + delta(want)[1];
                if (safeFree(nx, ny)) {
                    actions.push(...turns);
                    actions.push(FORWARD);
                    actions.push(BLAST);
                    while (actions.length < maxActions) actions.push(LASER);
                    return actions.slice(0, maxActions);
                }
            }
        }
    }

    // Python's priority 1a (push an adjacent enemy into a pit) is DORMIDO
    // and dropped: the demo board has no pits.

    // Adjacent enemies, by Manhattan distance 1. The Python computes this
    // once and reuses it for 1b and 2.
    const adj = enemies.filter(
        (enemy) => Math.abs(enemy.x - tank.x) + Math.abs(enemy.y - tank.y) === 1
    );

    // ── 1b. PUSH OFF THE EDGE: only when the push really removes it ──
    /**
     * @param {Tank} t
     * @returns {boolean} whether pushing `t` away from the bot exits the map
     */
    function pushRemoves(t) {
        const [dx, dy] = delta(dirTo(tank.x, tank.y, t.x, t.y));
        return !board.inBounds(t.x + dx, t.y + dy);
    }
    const pushTargets = adj.filter(pushRemoves);
    if (pushTargets.length > 0) {
        const victim = pushTargets[0];
        const needDir = dirTo(tank.x, tank.y, victim.x, victim.y);
        actions.push(...turnsTo(tank.direction, needDir, random));
        const pushes = Math.min(4, maxActions - actions.length);
        for (let i = 0; i < pushes; i++) actions.push(FORWARD);
        return actions.slice(0, maxActions);
    }

    // ── 2. Point blank, no edge: blast or laser ──
    if (adj.length > 0) {
        const victim = adj[0];
        const needDir = dirTo(tank.x, tank.y, victim.x, victim.y);
        const turns = turnsTo(tank.direction, needDir, random);
        // The 0.6 here is a bare literal in the Python, unlike the two named
        // 0.6 constants, so it is kept bare on purpose.
        if (tank.blastCharges > 0 && random() < 0.6) {
            actions.push(...turns);
            if (actions.length < maxActions) actions.push(BLAST);
            const shots = Math.min(2, maxActions - actions.length);
            for (let i = 0; i < shots; i++) actions.push(LASER);
            return actions.slice(0, maxActions);
        }
        actions.push(...turns);
        const shots = Math.min(3, maxActions - actions.length);
        for (let i = 0; i < shots; i++) actions.push(LASER);
        return actions.slice(0, maxActions);
    }

    // Nearest enemy, by Manhattan distance.
    const target = nearest(enemies, tank);
    const dist = Math.abs(target.x - tank.x) + Math.abs(target.y - tank.y);
    let dx = target.x - tank.x;
    let dy = target.y - tank.y;

    // ── 3. Clear line: a laser burst combined with a push ──
    const aligned = dx === 0 || dy === 0;
    if (aligned && dist >= 2 && clearLine(board, tank.x, tank.y, target.x, target.y)) {
        const needDir = dirTo(tank.x, tank.y, target.x, target.y);
        actions.push(...turnsTo(tank.direction, needDir, random));
        const shots = Math.min(3, maxActions - actions.length);
        for (let i = 0; i < shots; i++) actions.push(LASER);
        // Master rule: ALWAYS close the distance; the clash is settled by
        // laser/blast/chain_push.
        const chase = Math.min(maxActions - actions.length, 3);
        for (let i = 0; i < chase; i++) actions.push(FORWARD);
        return actions.slice(0, maxActions);
    }

    // ── 4. INTERCEPTION ──
    // Predict the rival's FUTURE cell (one step past its front) instead of
    // its current one: two bots chasing current cells swap places forever
    // without ever touching.
    const [fdx, fdy] = delta(target.direction);
    let tx = target.x;
    let ty = target.y;
    if (safeFree(target.x + fdx, target.y + fdy) && !atEdge(target)) {
        tx = target.x + fdx;
        ty = target.y + fdy;
    }

    // Frustration escalation (updates the memory; 0..cap urgent steps).
    const extra = frustrationStep(tank, target, engine);

    // ── STAGGERED ROUTE (closes BOTH axes) ──
    let tx2 = tx;
    let ty2 = ty;

    // FORCED CLOSE: after 1-2 rounds without contact, a chance of ignoring
    // the orbit and walking straight at the rival; moving onto its cell fires
    // chain_push. With 2+ quiet rounds it is mandatory.
    let forceClose;
    if (extra >= 2) {
        forceClose = true;
    } else {
        forceClose = extra >= 1 && random() < CLOSE_IN_P;
    }
    const adjStop = forceClose ? 0 : 1;
    if (forceClose) {
        tx = target.x;
        ty = target.y;
        tx2 = target.x;
        ty2 = target.y;
    }

    /** @type {string[]} advance directions (a stair per axis) */
    const path = [];
    let cx = tank.x;
    let cy = tank.y;
    let guard = 0;
    // MIRROR-BREAKER: alternate the priority axis per round + id, so a
    // synchronized orbit cannot hold for more than one round.
    const idSum = [...String(tank.id)].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const majorFirst = (idSum + engine.roundNum) % 2 === 0;

    while (guard < 6 && !(Math.abs(cx - tx2) <= adjStop && Math.abs(cy - ty2) <= adjStop)) {
        guard += 1;
        let ddx = tx2 - cx;
        let ddy = ty2 - cy;
        const takeX = majorFirst ? Math.abs(ddx) >= Math.abs(ddy) : Math.abs(ddx) <= Math.abs(ddy);
        let nd;
        if (ddy === 0 || (ddx !== 0 && takeX)) {
            nd = ddx > 0 ? 'E' : 'W';
        } else if (ddy !== 0) {
            nd = ddy > 0 ? 'S' : 'N';
        } else {
            break;
        }
        let nx = cx + delta(nd)[0];
        let ny = cy + delta(nd)[1];
        // NEVER walk onto the rival's current cell unless closing in: it
        // moves the same turn and produces the perpetual swap.
        if (nx === target.x && ny === target.y && !forceClose) {
            ddx = tx2 - cx;
            ddy = ty2 - cy;
            let alt = null;
            if ((nd === 'N' || nd === 'S') && ddx !== 0) {
                alt = ddx > 0 ? 'E' : 'W';
            } else if (ddy !== 0) {
                alt = ddy > 0 ? 'S' : 'N';
            }
            if (alt === null) break;
            nd = alt;
            nx = cx + delta(nd)[0];
            ny = cy + delta(nd)[1];
        }
        if (forceClose && nx === target.x && ny === target.y) {
            // A charge step: the rival is there and the engine turns the
            // collision into a chain_push.
            path.push(nd);
            cx = nx;
            cy = ny;
            break;
        }
        if (!safeFree(nx, ny)) break;
        // BOT-004: avoid advancing to the edge (it leaves you open to being
        // pushed off) unless the forced close wants exactly that.
        if (isEdgePos(nx, ny) && !forceClose) {
            const ddx2 = tx2 - cx;
            const ddy2 = ty2 - cy;
            let alt2 = null;
            if ((nd === 'N' || nd === 'S') && ddx2 !== 0) {
                alt2 = ddx2 > 0 ? 'E' : 'W';
            } else if ((nd === 'E' || nd === 'W') && ddy2 !== 0) {
                alt2 = ddy2 > 0 ? 'S' : 'N';
            }
            if (alt2 !== null) {
                const ax = cx + delta(alt2)[0];
                const ay = cy + delta(alt2)[1];
                if (safeFree(ax, ay) && !isEdgePos(ax, ay)) {
                    nd = alt2;
                    nx = ax;
                    ny = ay;
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        path.push(nd);
        cx = nx;
        cy = ny;
    }

    // Build the plan: the turns plus one forward per route step.
    let cur = tank.direction;
    let room = maxActions - actions.length;
    for (const nd of path) {
        const turn = turnsTo(cur, nd, random);
        if (turn.length + 1 > room) break;
        actions.push(...turn);
        actions.push(FORWARD);
        room -= turn.length + 1;
        cur = nd;
    }
    if (path.length === 0) {
        const adjacent = Math.abs(tx2 - tank.x) <= 1 && Math.abs(ty2 - tank.y) <= 1;
        if (adjacent) {
            const toward = dirTo(tank.x, tank.y, tx2, ty2);
            const nx = tank.x + delta(toward)[0];
            const ny = tank.y + delta(toward)[1];
            const foeHere = nx === target.x && ny === target.y;
            // ADJACENT without progress: force a close (probability
            // CLOSE_IN_P), mandatory after 2+ quiet rounds. Melee enables the
            // lethal push and guarantees the crossing blast reaches.
            const closeIn = extra >= 2 || ((extra >= 1 || foeHere) && random() < CLOSE_IN_P);
            if (closeIn && (foeHere || safeFree(nx, ny))) {
                actions.push(...turnsTo(cur, toward, random));
                if (actions.length < maxActions - 1) {
                    actions.push(FORWARD);
                    if (tank.blastCharges > 0 && random() < BLAST_LINEUP_P && actions.length < maxActions) {
                        actions.push(BLAST);
                    }
                }
            } else {
                // No close: face it and fill with lasers.
                actions.push(...turnsTo(cur, toward, random));
            }
        } else {
            // No route possible: turn to look around and step forward.
            actions.push(...turnsTo(cur, DIR_ORDER[(DIR_ORDER.indexOf(cur) + 1) % 4], random));
            if (room > 0) actions.push(FORWARD);
        }
    }

    // ── CROSS-LINE BLAST over the staggered route ──
    // Walk the simulated route: the first time it enters the enemy's 3x3
    // range, insert the blast right after that step's forward.
    if (tank.blastCharges > 0 && !tank.deadThisRound && random() < BLAST_LINEUP_P && path.length > 0) {
        let px = tank.x;
        let py = tank.y;
        const wIndices = [];
        actions.forEach((action, index) => {
            if (action === FORWARD) wIndices.push(index);
        });
        for (let k = 0; k < path.length; k++) {
            const nd = path[k];
            px += delta(nd)[0];
            py += delta(nd)[1];
            if (Math.abs(px - target.x) <= 1 && Math.abs(py - target.y) <= 1) {
                if (!(px === 0 || py === 0 || px === board.width - 1 || py === board.height - 1)) {
                    if (k < wIndices.length) actions.splice(wIndices[k] + 1, 0, BLAST);
                }
                break;
            }
        }
    }

    // Fill the turn with lasers toward wherever the route leaves us facing.
    while (actions.length < maxActions) actions.push(LASER);
    return actions.slice(0, maxActions);
}

/**
 * A bot's plan for one round. Port of `decide_actions`, with `BotRunner`'s
 * fallback folded in.
 *
 * The Python splits the responsibilities: `decide_actions` computes the plan
 * and adds a random blast spark; `BotRunner._step` calls
 * `_fallback_patrol_actions` when the plan came back empty. The demo has no
 * runner, so this entry point owns both — a plan is ALWAYS returned, and it
 * is never empty. That is what lets two bots always submit and the round
 * resolve the moment the player does ("No timers").
 *
 * On any exception — from the decision, which is what HUECO-7's silent
 * fallback covers — it returns the patrol plan without throwing or logging.
 *
 * @param {Tank} tank
 * @param {BotEngine} engine
 * @param {object} [options]
 * @param {number} [options.maxActions=MAX_ACTIONS]
 * @param {number} [options.blastP=BLAST_P]
 * @param {() => number} [options.random=Math.random]
 * @returns {string[]}
 */
export function decideActions(
    tank,
    engine,
    { maxActions = MAX_ACTIONS, blastP = BLAST_P, random = Math.random } = {}
) {
    let actions;
    try {
        actions = decideCore(tank, engine, maxActions, random);
    } catch {
        return fallbackPatrolActions(tank, engine, maxActions, random);
    }
    if (actions.length === 0) {
        // No living enemy (or no decision): patrol instead of stalling.
        return fallbackPatrolActions(tank, engine, maxActions, random);
    }

    // A random blast spark: sometimes the bot spends a charge at an
    // unexpected moment. Never when the plan already uses one, never with no
    // charge, and never from the edge, where a 3x3 blast could shove it off.
    try {
        const board = engine.board;
        const onEdge =
            tank.x === 0 ||
            tank.y === 0 ||
            tank.x === board.width - 1 ||
            tank.y === board.height - 1;
        if (
            !actions.includes(BLAST) &&
            tank.blastCharges > 0 &&
            !onEdge &&
            !tank.deadThisRound &&
            random() < blastP
        ) {
            // `random.randint(0, len(actions))` is inclusive of both ends.
            const pos = Math.floor(random() * (actions.length + 1));
            actions.splice(pos, 0, BLAST);
        }
    } catch {
        // HUECO-7: silent. The plan stands as decided.
    }
    return actions.slice(0, maxActions);
}
