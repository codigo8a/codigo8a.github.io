// ─── Combat: laser and blast (docs/RULES.md §4, §6) ──────────────────
//
// Port of the two attack paths of `game/combat.py` — `execute_laser` and
// `execute_blast` — plus the geometry they ask `game/robot.py::Tank` for
// and the damage handling they lean on. No DOM, no canvas, no imports
// from `web/static/`.
//
// The rules this file exists to hold (all VIVO in §4):
//   * LASER: leaves straight forward and travels to the EDGE of the board.
//     It breaks on a WALL, and it hits only the FIRST LIVING tank, without
//     passing through it. The cells it crosses are recorded so the
//     trajectory can be drawn,
//   * BLAST: a 3x3 explosion centred on the tank, EXCLUDING its own cell.
//     The 4 orthogonal neighbours take 3 HP, the 4 diagonals take 2 HP,
//     measured by Manhattan distance,
//   * no self-damage: the blast skips the tank's own cell and the laser
//     starts from the next one,
//   * no teams: any other living tank is a valid target,
//   * the COMMAND SHIELD (`shieldedThisStep`) is TOTAL immunity for the
//     step. The laser breaks on it, the blast skips it. It is not damage
//     reduction,
//   * kill attribution (§6.2): a laser death is the shooter's, a blast
//     death the detonator's, and the Python predicate is `result in
//     ("dead", "respawn")` — so a NON-FINAL death credits the attacker too
//     (§6.1).
//
// Deliberately absent, per "Deliberate exclusions: DORMIDO mechanics" in
// odd/tasks/demo-itch-io.md:
//   * map lasers (`laser_walls` / `laser_beam` cells, MAP_LASER_DAMAGE),
//   * pits, and therefore "the shield does not save you from a pit",
//   * the `has_shield` item and its `SHIELD_ABSORB_CAP` absorption, which
//     docs/RULES.md §4.4 marks DESCONECTADO: the only writer of
//     `has_shield` is `pickup_items`, which has no runtime caller,
//   * teams, so `pickup_items` and its five item pickups.
//
// `CellType.WALL` behaviour IS live here: the laser stops at a WALL.
//
// ## Two traps this layer must not re-introduce
//
// H2 — there is no `Tank.kills` and this layer does not create one. T2
// resolved the pusher's identity on the death record; here the attacker is
// known, so the death record carries `killer`/`killerNum` the same way. The
// COUNTER has exactly one owner, the round executor (T4), which must credit
// each attacker exactly once per death record that names a killer.
//
// H3 — `preDeathHp` is the victim's REAL HP here. Only a `fell_off_map`
// record carries MAX_HP, because the Python hardcodes it so the death
// animation fades a full bar. Do not unify them.
//
// ## The laser path shape
//
// `laserPath` is `[[x, y], ...]`, starting on the shooter. That is the shape
// `web/static/js/renderer.js::drawLaser` consumes: it indexes points
// (`path[0][0]`, `path[i][1]`), so a `{x, y}` path would draw at NaN offsets.
// It always holds at least two points, which is what
// `web/static/js/animation.js` requires (`laser_path.length > 1`) before it
// draws anything. Wiring the path to the renderer is T7's job.

import { CellType } from './board.js';
import { DIR_DELTA, DamageResult } from './tank.js';

/** @typedef {import('./tank.js').Tank} Tank */

/**
 * The two combat causes, on top of the two the movement path produces.
 *
 * Type-only reference to the movement typedef: this adds no runtime import
 * edge, so `sim/combat.js` and `sim/movement.js` stay independently
 * loadable under `node --test`.
 * @typedef {import('./movement.js').DeathCause | 'killed_by_laser' | 'killed_by_blast'} CombatDeathCause
 */

/**
 * One death produced by an attack, with its kill attribution (§6).
 *
 * Field-for-field the same record the movement path produces in
 * `sim/movement.js`, so T4 can feed both into one frame; only `cause` and
 * `killer` differ. The two causes are named apart here because
 * `web/static/js/animation.js` branches on `cause` to pick the death
 * animation, and neither of them is an off-map or a pit fall: both play the
 * explosion, which is what the Python gets from its frame entries having no
 * `cause` at all.
 *
 * @typedef {object} CombatDeathRecord
 * @property {string} tank id of the tank that lost the life
 * @property {number} num hull number of that tank
 * @property {CombatDeathCause} cause
 * @property {string} killer id of the attacker: the shooter for a laser, the
 *   detonator for a blast (§6.2)
 * @property {number} killerNum hull number of the attacker
 * @property {number} preDeathHp the victim's REAL HP before the hit (H3)
 * @property {{num: number, x: number, y: number, direction: string}} deathState
 *   where the tank was when it died, for the death animation
 */

/**
 * @typedef {object} LaserResult
 * @property {string[]} events front-facing log lines
 * @property {Array<[number, number]>} laserPath every cell the beam crossed,
 *   shooter first, in the `drawLaser` pair shape
 * @property {CombatDeathRecord[]} deaths every life lost to this shot
 */

/**
 * @typedef {object} BlastResult
 * @property {string[]} events front-facing log lines
 * @property {CombatDeathRecord[]} deaths every life lost to this explosion
 */

/** docs/RULES.md §4.1: the laser chip. */
export const LASER_DAMAGE = 1;

/** docs/RULES.md §4.1: blast damage at Manhattan distance 1. */
export const BLAST_ADJACENT_DAMAGE = 3;

/** docs/RULES.md §4.1: blast damage at Manhattan distance 2 (the diagonals). */
export const BLAST_FAR_DAMAGE = 2;

/**
 * Every cell straight ahead of `tank`, up to the edge of the board.
 *
 * Port of `game/robot.py::Tank.get_laser_targets`. The walk starts on the
 * cell AFTER the tank, which is what makes self-damage impossible (§4.3),
 * and it stops at the edge: there is no map laser to stop on, so an unobstructed
 * shot always reaches the last cell in the facing direction.
 *
 * @param {Tank} tank
 * @param {number} boardWidth
 * @param {number} boardHeight
 * @returns {Array<[number, number]>}
 */
export function getLaserTargets(tank, boardWidth, boardHeight) {
    const [dx, dy] = DIR_DELTA[tank.direction];
    const targets = [];
    let cx = tank.x + dx;
    let cy = tank.y + dy;
    while (cx >= 0 && cx < boardWidth && cy >= 0 && cy < boardHeight) {
        targets.push([cx, cy]);
        cx += dx;
        cy += dy;
    }
    return targets;
}

/**
 * The 8 cells of the 3x3 around `tank`, without its own cell.
 *
 * Port of `game/robot.py::Tank.get_blast_targets`, in the same x-major
 * order, because that order is what the event log ends up in. Cells outside
 * the board are produced here and dropped by the board lookup, exactly as
 * `execute_blast` does — a tank at the edge still has a full 8-cell target
 * list, it just reaches fewer of them.
 *
 * @param {Tank} tank
 * @returns {Array<[number, number]>}
 */
export function getBlastTargets(tank) {
    const targets = [];
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue; // no self-damage (§4.3)
            targets.push([tank.x + dx, tank.y + dy]);
        }
    }
    return targets;
}

/**
 * Laser and blast.
 *
 * Port of the combat half of `game/combat.py::CombatResolver`, minus the
 * movement, the pits and the items. Like the Python it holds the board plus
 * the id->Tank registry it needs to resolve an occupied cell back to the
 * tank standing on it.
 */
export class Combat {
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
     * Fires `tank`'s laser straight forward.
     *
     * Port of `CombatResolver.execute_laser`. Three things it gets right that
     * a naive port does not: the beam stops at a WALL, it stops at the first
     * LIVING tank rather than at the first occupied cell, and a shield
     * blocks it entirely instead of reducing the damage.
     *
     * @param {Tank} tank the tank firing
     * @returns {LaserResult}
     */
    executeLaser(tank) {
        /** @type {string[]} */
        const events = [];
        /** @type {CombatDeathRecord[]} */
        const deaths = [];
        // The path starts on the shooter: `drawLaser` draws from that point,
        // and it is why an unobstructed shot is never a zero-length path.
        /** @type {Array<[number, number]>} */
        const laserPath = [[tank.x, tank.y]];

        for (const [tx, ty] of getLaserTargets(tank, this.board.width, this.board.height)) {
            const cell = this.board.getCell(tx, ty);
            if (cell === null) break;

            // A wall stops the beam, and the beam is drawn all the way to it.
            if (cell.type === CellType.WALL) {
                laserPath.push([tx, ty]);
                break;
            }

            if (cell.tankId !== null) {
                const target = this.tanks.get(cell.tankId);
                if (target !== undefined && target.isAlive() && target.id !== tank.id) {
                    laserPath.push([tx, ty]);

                    // Command shield: total immunity, and the beam ends here.
                    if (target.shieldedThisStep) {
                        events.push(`🛡️ R${target.num} (${target.id}) blocks the laser with a shield`);
                        break;
                    }

                    const preDeathHp = target.hp;
                    const result = target.takeDamage(LASER_DAMAGE);
                    tank.damageDealt += LASER_DAMAGE;
                    events.push(
                        `🔫 R${tank.num} (${tank.id}) laser → R${target.num} ` +
                            `(${target.id}) [-${LASER_DAMAGE} HP, ${target.hp} left]`
                    );
                    // §6.1: the predicate is `result in ("dead", "respawn")`, so a
                    // non-final death credits the attacker just like a final one.
                    if (result === DamageResult.DEAD || result === DamageResult.RESPAWN) {
                        deaths.push(this.recordDeath(target, tank, 'killed_by_laser', preDeathHp));
                    }
                    events.push(...this.handleDamageResult(target, result, 'laser'));
                    break;
                }

                // Occupied by something that is not a living target — a corpse
                // still holds its cell until the respawn pass. The beam is
                // drawn over it and keeps going: only a LIVING tank stops it.
                laserPath.push([tx, ty]);
            } else {
                laserPath.push([tx, ty]);
            }
        }

        return { events, laserPath, deaths };
    }

    /**
     * Detonates `tank`'s blast: the 3x3 around it, its own cell excluded.
     *
     * Port of `CombatResolver.execute_blast`. Unlike the laser this never
     * breaks — every neighbour in range is resolved — and a shielded one is
     * skipped rather than ending the explosion.
     *
     * @param {Tank} tank the tank detonating
     * @returns {BlastResult}
     */
    executeBlast(tank) {
        /** @type {string[]} */
        const events = [];
        /** @type {CombatDeathRecord[]} */
        const deaths = [];

        for (const [tx, ty] of getBlastTargets(tank)) {
            const cell = this.board.getCell(tx, ty);
            // Off-board cells of the 3x3 read as no cell and are skipped.
            if (cell === null || cell.tankId === null) continue;

            const target = this.tanks.get(cell.tankId);
            // No teams: the only exclusion is the detonator itself (§4.3).
            if (target === undefined || !target.isAlive() || target.id === tank.id) continue;

            // Command shield: total immunity for that tank. The rest of the 3x3
            // still goes off, which is why this skips instead of breaking.
            if (target.shieldedThisStep) {
                events.push(`🛡️ R${target.num} (${target.id}) blocks the blast with a shield`);
                continue;
            }

            const preDeathHp = target.hp;
            const distance = Math.abs(tx - tank.x) + Math.abs(ty - tank.y);
            const damage = distance === 1 ? BLAST_ADJACENT_DAMAGE : BLAST_FAR_DAMAGE;
            const result = target.takeDamage(damage);
            tank.damageDealt += damage;
            events.push(
                `💥 R${tank.num} (${tank.id}) blast → R${target.num} ` +
                    `(${target.id}) [-${damage} HP, ${target.hp} left]`
            );
            if (result === DamageResult.DEAD || result === DamageResult.RESPAWN) {
                deaths.push(this.recordDeath(target, tank, 'killed_by_blast', preDeathHp));
            }
            events.push(...this.handleDamageResult(target, result, 'blast'));
        }

        return { events, deaths };
    }

    /**
     * Builds the death record for an attack death, attribution included.
     *
     * Separate from {@link Combat#handleDamageResult} because the two answer
     * different questions: this one records WHO killed the tank for T4 and the
     * scoreboard, that one reacts to the life being lost.
     *
     * @param {Tank} victim the tank that lost the life
     * @param {Tank} attacker the shooter, or the detonator
     * @param {'killed_by_laser' | 'killed_by_blast'} cause
     * @param {number} preDeathHp the victim's HP before the hit (H3)
     * @returns {CombatDeathRecord}
     */
    recordDeath(victim, attacker, cause, preDeathHp) {
        return {
            tank: victim.id,
            num: victim.num,
            cause,
            killer: attacker.id,
            killerNum: attacker.num,
            preDeathHp,
            // The attack never moved the victim, so its own cell is where it
            // died; x/y can be off-board only for a fall, which never comes
            // through here.
            deathState: { num: victim.num, x: victim.x, y: victim.y, direction: victim.direction }
        };
    }

    /**
     * Reacts to what `takeDamage` reported.
     *
     * Port of `CombatResolver.handle_damage_result` and `handle_death`.
     * Both outcomes clear the victim's cell, because a tank that lost a life
     * this round leaves the board until the respawn pass, even when it is
     * coming back.
     *
     * @param {Tank} tank the tank that was damaged
     * @param {import('./tank.js').DamageResultValue} result what takeDamage reported
     * @param {string} source 'laser' or 'blast', for the log line
     * @returns {string[]}
     */
    handleDamageResult(tank, result, source) {
        if (result === DamageResult.DEAD) {
            tank.deadThisRound = true;
            return this.handleDeath(tank);
        }
        if (result === DamageResult.RESPAWN) {
            this.board.removeTank(tank.x, tank.y);
            // Died this round: its remaining programmed actions do NOT run. It
            // is back at the start of the next round.
            tank.deadThisRound = true;
            // The wording is the Python's, including "eliminated" on a death
            // that is not one: the HUD line has to match the live game.
            return [`💀 R${tank.num} (${tank.id}) was eliminated by ${source}! (${tank.lives} lives left)`];
        }
        return [];
    }

    /**
     * The last life of a tank.
     *
     * Port of `CombatResolver.handle_death`. The Python also appends to
     * `engine.eliminated` here; that roster is T5's and it reads the death
     * records this layer returns, so there is nothing to append to yet.
     *
     * @param {Tank} tank
     * @returns {string[]}
     */
    handleDeath(tank) {
        this.board.removeTank(tank.x, tank.y);
        return [`☠️ R${tank.num} (${tank.id}) was eliminated!`];
    }
}