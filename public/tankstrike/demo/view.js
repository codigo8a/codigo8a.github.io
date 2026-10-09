// ─── Simulation → view projection (T7a) ──────────────────────────────
//
// A PURE projection from the simulation's own state to the exact shapes the
// reused client modules read. No DOM, no canvas, no browser APIs, no timers
// and nothing imported from `web/static/`: the only import edge is into
// `./sim/`, so the whole module stays loadable under `node --test` the same
// way the simulation does.
//
// Why a separate module. The simulation works in camelCase, on `Map`s and on
// `Tank` objects; the renderer, `state.js`, `components.js`, `ui.js` and
// `animation.js` read a flat, snake_case, plain-object view. The projection
// is the single translation point. Every field name below was DERIVED from
// the consumers, not guessed: `test/view.test.js` reads their sources and
// asserts the projected objects carry every field they actually touch, so a
// consumer that starts reading a new field fails the suite instead of failing
// silently at draw time.
//
// Scope (T7a): the board serializer (H6), the tanks, the laser path and the
// death records. Building animation frames from the round's step beats — the
// Python frame/fx protocol T4 deliberately did not port (H12) — is T7b, as is
// wiring any of this into `main.js`.
//
// Out of scope by design, projected as EMPTY collections rather than
// invented data: the scoreboard and the waiting room (no persistence and no
// lobby in the demo) and the DORMIDO terrain collections (rotors, conveyors,
// repulsors, lasers) that `arena` never enables (R4).

import { CellType } from './sim/board.js';

/** @typedef {import('./sim/board.js').Board} Board */
/** @typedef {import('./sim/tank.js').Tank} Tank */
/** @typedef {import('./sim/movement.js').DeathRecord} MovementDeath */
/** @typedef {import('./sim/combat.js').CombatDeathRecord} CombatDeath */

/**
 * The two death causes the movement path produces. The animation layer
 * classifies both as an off-map fall (no explosion, `pit_fall` sound).
 * @type {ReadonlyArray<string>}
 */
export const OFF_MAP_CAUSES = Object.freeze(['pushed_off_map', 'fell_off_map']);

/**
 * The unit of the board view `renderer.js` iterates: one NON-EMPTY cell, in
 * the same `{x, y, t}` shape `game/engine.py::_board_cells` emits. `t` is the
 * cell type string, kept identical to Python so the renderer's string
 * matching (`c.t === 'pit'`, ...) keeps working by construction (R4).
 *
 * @typedef {object} BoardCellView
 * @property {number} x
 * @property {number} y
 * @property {string} t cell type, e.g. `CellType.WALL` = `'wall'`
 */

/**
 * The board slice of `state.gameState`. Every key is read by
 * `renderer.js::drawBoard`; the DORMIDO collections exist so the renderer's
 * `|| []` fallbacks never run on `undefined`.
 *
 * @typedef {object} BoardView
 * @property {number} width
 * @property {number} height
 * @property {BoardCellView[]} cells every non-empty cell
 * @property {Array} rotors
 * @property {Array} conveyors
 * @property {Array} repulsors
 * @property {Array} lasers
 * @property {Array} laser_walls
 * @property {Array} laser_beams
 */

/**
 * An entry of `state.gameState.tanks`, keyed by the tank id.
 *
 * Every field is read by at least one consumer:
 *   * `renderer.js` — `drawTank` reads `x`, `y`, `num`, `direction`, `hp`,
 *     `alive`, `shielded_this_step`; `drawBoard` reads `phase`, `x`, `y`,
 *     `hp`, `direction`; `updateUI` reads `id`, `direction`, `num`, `x`, `y`,
 *     `hp`, `lives`, `kills`,
 *   * `components.js::renderPlayersList` reads `num`, `phase`, `alive`, `id`,
 *     `kills`, `lives`, `hp`,
 *   * `ui.js` reads `phase`, `lives`, `alive`.
 *
 * @typedef {object} TankView
 * @property {string} id
 * @property {number} num
 * @property {number} x
 * @property {number} y
 * @property {string} direction
 * @property {number} hp
 * @property {number} lives
 * @property {boolean} alive
 * @property {number} kills
 * @property {'alive' | 'dead' | 'eliminated'} phase
 * @property {boolean} shielded_this_step
 */

/**
 * One death record, in the `death_state` / `pre_death_hp` shape
 * `animation.js` and `renderer.js` read. The simulation names the same facts
 * `deathState` / `preDeathHp`; only the spelling changes here.
 *
 * @typedef {object} DeathView
 * @property {string} tank id of the tank that lost the life
 * @property {number} num hull number
 * @property {string} cause one of the four sim causes
 * @property {string|null} killer
 * @property {number|null} killerNum
 * @property {number} pre_death_hp HP the renderer shows on the death frame
 * @property {{num: number, x: number, y: number, direction: string}} death_state
 *   where the tank was when it died
 */

/**
 * A tank's in-match phase, port of `game/engine.py::tank_phase`.
 *
 * The three states are exclusive and checked in this order:
 *   * `eliminated` — no lives left, or already out of the match,
 *   * `dead` — has lives but its cell does not name it: it died this round
 *     and waits for the respawn pass,
 *   * `alive` — on the board.
 *
 * Board presence is `cell.tankId === tank.id` and NOT `board.hasTank(x, y)`:
 * a rival that walked onto the cell of death must not make the ghost read as
 * alive (`Engine.start_round` documents this).
 *
 * @param {Tank} tank
 * @param {Board} board
 * @returns {'alive' | 'dead' | 'eliminated'}
 */
export function tankPhase(tank, board) {
    if (tank.lives <= 0 || !tank.alive) return 'eliminated';
    const cell = board.getCell(tank.x, tank.y);
    if (cell === null || cell.tankId !== tank.id) return 'dead';
    return 'alive';
}

/**
 * Projects one `Tank` into the `TankView` the client modules read.
 *
 * `phase` is derived and `shielded_this_step` is renamed: the simulation
 * spells it `shieldedThisStep`. `hp` is copied as-is, including the negative
 * value a lethal blast can leave behind (H8) — sanitising it is the demo's
 * HUD layer (T7b), not the projection.
 *
 * @param {Tank} tank
 * @param {Board} board the board that decides `alive` vs `dead`
 * @returns {TankView}
 */
export function projectTank(tank, board) {
    return {
        id: tank.id,
        num: tank.num,
        x: tank.x,
        y: tank.y,
        direction: tank.direction,
        hp: tank.hp,
        lives: tank.lives,
        alive: tank.alive,
        kills: tank.kills,
        phase: tankPhase(tank, board),
        shielded_this_step: tank.shieldedThisStep
    };
}

/**
 * Projects the id→`Tank` registry into the id-keyed object
 * `state.gameState.tanks` is.
 *
 * The key is the registry key, which is how `renderer.js` addresses a tank
 * (`gs.tanks[state.myName]`) and how `ui.js` finds the player's own tank. It
 * is the tank's `id` in the demo's roster.
 *
 * @param {Map<string, Tank>|Record<string, Tank>} tanks
 * @param {Board} board
 * @returns {Record<string, TankView>}
 */
export function projectTanks(tanks, board) {
    /** @type {Record<string, TankView>} */
    const out = {};
    for (const [id, tank] of entriesOf(tanks)) out[id] = projectTank(tank, board);
    return out;
}

/**
 * Serializes the board into the `BoardView` `renderer.js::drawBoard` reads.
 *
 * Port of `game/engine.py::_board_cells`: every NON-empty cell, in the
 * board's own iteration order, as `{x, y, t}`. An arena with no terrain
 * serializes to `[]`, which is what T1 emitted; once a `WALL` exists it has
 * to appear here or the renderer never sees it (H6).
 *
 * The DORMIDO collections are empty arrays, not omitted keys: the renderer
 * reads them directly (`board.lasers`, `board.rotors`, `board.repulsors`,
 * `board.conveyors`, `board.laser_walls`) and the explicit empty array keeps
 * the shape stable for the `|| []` fallbacks.
 *
 * @param {Board} board
 * @returns {BoardView}
 */
export function serializeBoard(board) {
    /** @type {BoardCellView[]} */
    const cells = [];
    for (const [key, cell] of board.cells) {
        if (cell.type === CellType.EMPTY) continue;
        const [x, y] = key.split(',').map(Number);
        cells.push({ x, y, t: cell.type });
    }
    return {
        width: board.width,
        height: board.height,
        cells,
        rotors: [],
        conveyors: [],
        repulsors: [],
        lasers: [],
        laser_walls: [],
        laser_beams: []
    };
}

/**
 * Builds the `state.gameState` the reused modules read.
 *
 * `state`/`round` are passed in because the demo has no game state machine:
 * T7b decides when the match is programming versus over. `remaining_time` is
 * always 0 — the demo has no timers and the top bar is hidden. The scoreboard
 * and the waiting room are empty (out of scope). `fx`, the animation effect
 * list, is empty too: the demo has no stream protocol.
 *
 * @param {object} context
 * @param {Board} context.board
 * @param {Map<string, Tank>|Record<string, Tank>} context.tanks
 * @param {number} [context.round=1]
 * @param {string} [context.state='programming']
 * @param {string} [context.mapName='Local Demo']
 * @returns {object}
 */
export function projectGameState({ board, tanks, round = 1, state = 'programming', mapName = 'Local Demo' }) {
    const projected = projectTanks(tanks, board);
    const list = Object.values(projected);
    return {
        state,
        round,
        remaining_time: 0,
        total_time: 0,
        map_name: mapName,
        board: serializeBoard(board),
        tanks: projected,
        // Python's `alive_count` is `len(_visible_tanks())`, i.e. tanks on the
        // board — the same predicate as `phase === 'alive'`. `total_count` is
        // the fixed roster size.
        alive_count: list.filter((t) => t.phase === 'alive').length,
        total_count: list.length,
        waiting_room: [],
        scoreboard: [],
        fx: []
    };
}

/**
 * The laser path of a step action, in the `Array<[number, number]>` shape
 * `renderer.js::drawLaser` indexes (`path[0][0]`, `path[path.length - 1][1]`)
 * and `animation.js` requires (`laser_path.length > 1`). The first pair is the
 * shooter. Returns `null` for an action that did not fire a laser.
 *
 * T3 pinned the pair shape against the renderer; this function is the seam
 * T7b reads so the spelling never has to be rediscovered at draw time.
 *
 * @param {{laserPath?: Array<[number, number]>}|null|undefined} actionEntry a sim `StepActionEntry`
 * @returns {Array<[number, number]>|null}
 */
export function projectLaserPath(actionEntry) {
    if (!actionEntry || !Array.isArray(actionEntry.laserPath)) return null;
    return actionEntry.laserPath;
}

/**
 * Projects one sim death record into the shape `animation.js` and
 * `renderer.js` read.
 *
 * Renames only: `deathState` → `death_state`, `preDeathHp` → `pre_death_hp`.
 * `cause` is passed through verbatim — `animation.js` classifies the two
 * off-map causes as a fall and every other cause as an explosion, which is
 * exactly what the demo's `killed_by_laser` / `killed_by_blast` need (H7).
 * `events` is NOT copied: the sim death record has no events list, and
 * `animation.js` reads it as `d.events || []` for the pit classifier, which
 * the demo never reaches.
 *
 * @param {MovementDeath|CombatDeath} death
 * @returns {DeathView}
 */
export function projectDeathRecord(death) {
    return {
        tank: death.tank,
        num: death.num,
        cause: death.cause,
        killer: death.killer,
        killerNum: death.killerNum,
        pre_death_hp: death.preDeathHp,
        death_state: death.deathState
    };
}

/**
 * Projects a step's death list.
 * @param {Array<MovementDeath|CombatDeath>} deaths
 * @returns {DeathView[]}
 */
export function projectDeathRecords(deaths) {
    return (deaths || []).map(projectDeathRecord);
}

// ─── Step beat → animation frame (T7b) ────────────────────────────────

/**
 * One action row of a frame, in the shape `animation.js::playNextFrame`
 * reads. The sim spells the payload camelCase; the reused playback wants
 * `laser_path` / `blast_pos`, so the rename happens here.
 *
 * `events` is deliberately NOT copied: `animation.js` logs `frame.data.events`
 * once, and re-carrying them per action would log every line twice. All of a
 * step's lines already travel in the frame's `data.events`.
 *
 * @typedef {object} FrameActionView
 * @property {string} tank acting tank's id
 * @property {number} num hull number
 * @property {string} action internal action name
 * @property {Array<[number, number]>} [laser_path] the beam, shooter first
 * @property {{x: number, y: number}} [blast_pos] where the blast detonated
 * @property {string} [direction] the facing after a turn
 */

/**
 * Projects one `StepActionEntry` into the `FrameActionView` the playback
 * reads.
 *
 * `blast_pos` is taken from the tank's position in the frame's game state.
 * The sim's action entry does not carry a blast position, and unlike a turn
 * or a move a blast does not relocate its own detonator, so the post-step
 * position is the detonation cell except in the rare case where another tank
 * pushed the detonator in the same simultaneous step.
 *
 * @param {import('./sim/round.js').StepActionEntry} entry
 * @param {{x: number, y: number}|null} [tank] the acting tank in this frame
 * @returns {FrameActionView}
 */
export function projectActionEntry(entry, tank = null) {
    /** @type {FrameActionView} */
    const out = { tank: entry.tank, num: entry.num, action: entry.action };

    const laserPath = projectLaserPath(entry);
    if (laserPath !== null) out.laser_path = laserPath;

    if (entry.action === 'blast' && entry.fired === true && tank) {
        out.blast_pos = { x: tank.x, y: tank.y };
    }
    if (entry.direction !== undefined) out.direction = entry.direction;
    return out;
}

/**
 * The frame object `animation.js::playNextFrame` consumes: a projected game
 * state plus the step's actions and deaths.
 *
 * @param {object} context
 * @param {import('./sim/round.js').StepBeat} context.beat
 * @param {object} context.gameState the projected state AFTER the step
 * @param {number} [context.index=0] 0-based step index
 * @param {number} [context.total=1] frames in the round
 * @returns {object}
 */
export function projectFrame({ beat, gameState, index = 0, total = 1 }) {
    const tanks = gameState.tanks || {};
    return {
        index,
        total,
        description: beat.description,
        step: beat.step,
        game_state: gameState,
        data: {
            actions: (beat.actions || []).map((entry) => projectActionEntry(entry, tanks[entry.tank])),
            deaths: projectDeathRecords(beat.deaths),
            events: polishEvents(beat.events)
        }
    };
}

// ─── HUD polish (H8) ──────────────────────────────────────────────────

/**
 * Rewrites the two strings the sim faithfully ports but a player reads as
 * defects. The sim is not touched: this is the demo's display layer.
 *
 *   1. `handle_damage_result` prints "was eliminated by laser!" for a death
 *      that is NOT an elimination (the tank has lives left). Only that line
 *      is rewritten; the genuine `☠️ ... was eliminated!` is left alone.
 *   2. A lethal blast overshoots (the sim subtracts, then tests death), so
 *      the "N left" HP can be negative. It is clamped at 0.
 *
 * @param {string} line
 * @returns {string}
 */
export function polishEvent(line) {
    if (typeof line !== 'string') return line;
    let out = line.replace(
        /^💀 (R\d+ \([^)]+\)) was eliminated by (laser|blast)! \((\d+) lives? left\)$/,
        (_, who, source, lives) =>
            `💀 ${who} lost a life to ${source}! (${lives} ${lives === '1' ? 'life' : 'lives'} left)`
    );
    out = out.replace(
        /\[-(\d+) HP, (-\d+) left\]/,
        (_, damage, left) => `[-${damage} HP, ${Math.max(0, Number(left))} left]`
    );
    return out;
}

/**
 * @param {string[]} events
 * @returns {string[]}
 */
export function polishEvents(events) {
    return (events || []).map(polishEvent);
}

/**
 * Normalizes the two registries the sim uses — a `Map` — and a plain object,
 * so a caller passing either gets the same projection.
 * @param {Map<string, Tank>|Record<string, Tank>} tanks
 * @returns {Array<[string, Tank]>}
 */
function entriesOf(tanks) {
    return tanks instanceof Map ? [...tanks.entries()] : Object.entries(tanks);
}
