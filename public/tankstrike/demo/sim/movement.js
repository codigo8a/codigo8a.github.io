// ─── Movement and push (docs/RULES.md §5, §6.2) ──────────────────────
//
// Port of the movement path of `game/combat.py`: `execute_movement` and
// `chain_push`. No DOM, no canvas, no imports from `web/static/`.
//
// The rules this file exists to hold (all VIVO in §5):
//   * pushing is NOT an action. It is the effect of moving onto an
//     occupied cell, so it lives in the movement path and nowhere else,
//   * the rival moves EXACTLY one tile, along the pusher's vector,
//   * there is no chain push: a third tank on the destination cancels the
//     push and stops the pusher,
//   * against a WALL the push does not happen: the rival stays and the
//     pusher stops,
//   * a successful push lets the pusher advance into the freed cell,
//   * the pusher takes no damage at all,
//   * the pushed tank loses one WHOLE life, never HP: `loseLife()`,
//   * pushed off the map costs one life and the kill is the pusher's,
//   * a push TOWARD the edge does not kill — the destination is still
//     inside. Only a tank already at the edge and pushed OUTWARD dies,
//   * falling off on your own costs one life and credits nobody
//     (`killer: null`, docs/RULES.md §6.2).
//
// Deliberately absent, per "Deliberate exclusions: DORMIDO mechanics" in
// odd/tasks/demo-itch-io.md: `check_pit` after a step or after a push,
// conveyor drags, rotors, map lasers, laser and blast. No map on air
// enables them. WALL checks ARE kept — they are what implements "no push
// against a wall" above.

import { CellType } from './board.js';
import { DIR_DELTA, DIR_LEFT, DIR_RIGHT, MAX_HP } from './tank.js';

/** @typedef {import('./board.js').Cell} Cell */

/** @typedef {import('./tank.js').Tank} Tank */

/**
 * Why a tank lost a life here. Only the two causes the movement path can
 * produce; `docs/RULES.md` §6.2 lists the others with their attribution.
 * @typedef {'pushed_off_map' | 'fell_off_map'} DeathCause
 */

/**
 * One death produced by a movement, with its kill attribution (§6).
 *
 * @typedef {object} DeathRecord
 * @property {string} tank id of the tank that lost the life
 * @property {number} num hull number of that tank
 * @property {DeathCause} cause
 * @property {string|null} killer id of whoever is responsible, or null when
 *   the tank did this to itself (§6.2)
 * @property {number|null} killerNum hull number of the killer, or null
 * @property {number} preDeathHp HP to show on the death animation
 * @property {{num: number, x: number, y: number, direction: string}} deathState
 *   where the tank was when it died, for the death animation
 */

/**
 * @typedef {object} MovementResult
 * @property {string[]} events front-facing log lines
 * @property {Cell[]} pushSteps tiles a pushed tank ended on, for the push animation
 * @property {DeathRecord[]} deaths every life lost by this movement
 * @property {number} moved tiles the acting tank actually advanced
 */

/** Facing glyph for the move log line. */
const DIR_SYMBOL = { N: '↑', S: '↓', E: '→', W: '←' };

/**
 * The movement path of `game/combat.py::CombatResolver`, without the laser
 * and blast (T3) or the conveyor drag (excluded).
 *
 * Holds the board plus the id->Tank registry it needs to resolve an
 * occupied cell back to the tank standing on it. `map` rather than a plain
 * object: the registry is keyed by arbitrary display names.
 */
export class Movement {
    /**
     * @param {object} context
     * @param {import('./board.js').Board} context.board
     * @param {Map<string, Tank>} context.tanks id -> tank, all tanks in the match
     */
    constructor({ board, tanks }) {
        /** @type {import('./board.js').Board} */
        this.board = board;
        /** @type {Map<string, Tank>} */
        this.tanks = tanks;
    }

    /**
     * Displaces `tank` exactly one tile along (dx, dy).
     *
     * Port of `CombatResolver.chain_push`, despite the name there being a
     * misnomer: there is no chain, and the code says so in a comment. This
     * level cannot name a killer — it is handed a victim and a vector and
     * nothing else — so any death it reports leaves `killer` null for the
     * caller, which does know who pushed, to fill in.
     *
     * @param {Tank} tank the tank being pushed
     * @param {number} dx
     * @param {number} dy
     * @returns {{events: string[], pushSteps: Cell[], deaths: DeathRecord[]}}
     */
    chainPush(tank, dx, dy) {
        /** @type {string[]} */
        const events = [];
        /** @type {Cell[]} */
        const pushSteps = [];
        /** @type {DeathRecord[]} */
        const deaths = [];

        const nx = tank.x + dx;
        const ny = tank.y + dy;

        // Snapshot before anything moves: the death animation plays on the
        // last tile that was still inside the board.
        const was = { num: tank.num, x: tank.x, y: tank.y, direction: tank.direction };
        const preDeathHp = tank.hp;

        // Off the board = pushed off the map. Exactly one life, and it kills.
        if (!this.board.inBounds(nx, ny)) {
            this.board.removeTank(tank.x, tank.y);
            tank.x = nx;
            tank.y = ny;
            const died = tank.loseLife();
            tank.deadThisRound = true; // pushed off: it stops acting this round

            events.push(`💀 R${tank.num} (${tank.id}) was pushed off the map!`);
            if (died) {
                events.push(`☠️ R${tank.num} (${tank.id}) was eliminated!`);
            } else {
                events.push(`💀 R${tank.num} (${tank.id}) loses 1 life (${tank.lives} left)`);
            }

            pushSteps.push({ x: nx, y: ny });
            deaths.push({
                tank: tank.id,
                num: tank.num,
                cause: 'pushed_off_map',
                // Whoever pushed is unknown here; executeMovement stamps it.
                killer: null,
                killerNum: null,
                preDeathHp,
                deathState: was
            });
            return { events, pushSteps, deaths };
        }

        const cell = this.board.getCell(nx, ny);
        if (cell === null) return { events, pushSteps, deaths };

        // Against a wall the push does not happen: the rival does not move.
        if (cell.type === CellType.WALL) return { events, pushSteps, deaths };

        // No chain push: a third tank on the destination cancels it.
        if (cell.tankId !== null) return { events, pushSteps, deaths };

        if (this.board.moveTank(tank.x, tank.y, nx, ny)) {
            tank.x = nx;
            tank.y = ny;
            pushSteps.push({ x: nx, y: ny });
            events.push(`↗️ R${tank.num} (${tank.id}) was pushed 1 tile`);
        }

        return { events, pushSteps, deaths };
    }

    /**
     * Walks `tank` up to `steps` tiles along its movement vector, pushing
     * whatever it walks into.
     *
     * Port of `CombatResolver.execute_movement`. Turn actions are NOT part
     * of it: in `game/actions.py` a turn calls `face_left()` /
     * `face_right()` and moves nothing. The movement actions it does serve
     * are 'forward', 'back', 'left', 'right' and 'turbo'; the first four are
     * the `base` of a `turbo_<base>_<n>` action, and 'turbo' is the legacy
     * stacking path.
     *
     * @param {Tank} tank the acting tank
     * @param {'forward' | 'back' | 'left' | 'right' | 'turbo'} action
     * @param {number|null} [stepsOverride=null] explicit tile count; the
     *   actions layer passes it for a turbo it already resolved (T4)
     * @returns {MovementResult}
     */
    executeMovement(tank, action, stepsOverride = null) {
        /** @type {string[]} */
        const events = [];
        /** @type {Cell[]} */
        const pushSteps = [];
        /** @type {DeathRecord[]} */
        const deaths = [];

        let steps = stepsOverride;
        if (steps === null) {
            steps = 1;
            if (action === 'turbo') {
                if (tank.turboStack > 0) {
                    steps = tank.turboStack + 1; // one move tile plus the stack
                    tank.turboStack = 0; // spent by this move
                } else {
                    steps = 2;
                }
            }
        }

        const [dx, dy] = DIR_DELTA[tank.direction];
        // The canonical direction block of `execute_movement`, ported whole:
        // 'forward' keeps the facing, 'back' reverses it, and 'left'/'right'
        // move PERPENDICULAR to it WITHOUT turning. The perpendicular sides
        // come from the same quarter-turn tables a real turn uses.
        let vx = dx;
        let vy = dy;
        if (action === 'back') {
            vx = -dx;
            vy = -dy;
        } else if (action === 'left') {
            [vx, vy] = DIR_DELTA[DIR_LEFT[tank.direction]];
        } else if (action === 'right') {
            [vx, vy] = DIR_DELTA[DIR_RIGHT[tank.direction]];
        }

        let moved = 0;
        for (let step = 0; step < steps; step++) {
            const nx = tank.x + vx;
            const ny = tank.y + vy;

            // Off the map = falling (exactly one life, and no killer).
            if (!this.board.inBounds(nx, ny)) {
                this.board.removeTank(tank.x, tank.y);
                tank.x = nx;
                tank.y = ny;
                const died = tank.loseLife();
                tank.deadThisRound = true; // it fell: it stops acting this round

                events.push(`🕳️ R${tank.num} (${tank.id}) fell off the edge!`);
                if (died) {
                    events.push(`☠️ R${tank.num} (${tank.id}) was eliminated!`);
                } else {
                    events.push(`💀 R${tank.num} (${tank.id}) loses 1 life (${tank.lives} left)`);
                }

                // A fall ignores HP and shows a full bar fading out, which is
                // what game/round_executor.py passes for a self-fall.
                deaths.push({
                    tank: tank.id,
                    num: tank.num,
                    cause: 'fell_off_map',
                    killer: null,
                    killerNum: null,
                    preDeathHp: MAX_HP,
                    deathState: { num: tank.num, x: nx, y: ny, direction: tank.direction }
                });
                return { events, pushSteps, deaths, moved };
            }

            const cell = this.board.getCell(nx, ny);
            if (cell === null) break;

            // A wall stops the tank where it stands.
            if (cell.type === CellType.WALL) break;

            // An occupied cell pushes, and pushing is not an action.
            if (cell.tankId !== null) {
                const pushed = this.tanks.get(cell.tankId);
                if (pushed === undefined || !pushed.isAlive()) break;

                const push = this.chainPush(pushed, vx, vy);
                events.push(...push.events);
                pushSteps.push(...push.pushSteps);
                // Here the pusher IS known, so the attribution of §6.2 is
                // settled: pushing a rival off the map credits the kill to
                // the tank that was walking.
                for (const death of push.deaths) {
                    death.killer = tank.id;
                    death.killerNum = tank.num;
                }
                deaths.push(...push.deaths);

                // The rival is still standing where we were aiming: the push
                // did not happen (wall, or a third tank), so we stop too.
                if (pushed.x === nx && pushed.y === ny) break;
            }

            if (this.board.moveTank(tank.x, tank.y, nx, ny)) {
                tank.x = nx;
                tank.y = ny;
                moved += 1;
            } else {
                break;
            }
        }

        if (moved > 0) {
            const symbol = DIR_SYMBOL[tank.direction] ?? '?';
            events.push(
                `🏃 R${tank.num} (${tank.id}) moves ${symbol} (${moved} tile${moved > 1 ? 's' : ''})`
            );
        }

        return { events, pushSteps, deaths, moved };
    }
}