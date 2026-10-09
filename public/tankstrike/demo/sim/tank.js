// ─── Tank state: position, facing, HP, lives, turbo ───────────────────
//
// Port of the tank fields the movement path reads, from `game/robot.py`.
// No imports: this module is pure state, which is what keeps it loadable
// under `node --test` with no DOM.
//
// T2 added the fields the movement path reads; T3 added the damage path;
// T4 added the round state the actions and the step executor need: the
// action buffer, `blastCharges`, `kills`, the turns and `resetRound`.
// Not here yet, and owned by later tasks:
//   * `heal` and the four consumable items plus `_reset_items`,
//   * the `eliminated` roster and the victory check (T5).
//
// `Tank.kills` is created here and written in exactly ONE place in the whole
// demo: `sim/round.js::Round#creditKill`. Python splits the credit across
// `CombatResolver` (laser and blast) and `round_executor.py` (push); the
// demo's resolvers know the attacker too — they stamp `killer` on the death
// record — so they deliberately leave the counter alone, and the step
// executor credits every death record that names a killer, once (H2).
//
// One detail is deliberately left out of BOTH damage paths: Python's
// `Tank.lose_life` and `Tank.take_damage` also call `_reset_items()`,
// which clears the consumable items. The demo never grants one
// (`docs/RULES.md` §1 marks `ITEM_*` DESCONECTADO:
// `combat.pickup_items` has no runtime caller), so there is nothing to
// reset. T4/T5 must re-add the reset if the demo ever grants items.

/** The four facings, as `game/board.py::Direction` spells them. */
export const Direction = Object.freeze({
    NORTH: 'N',
    SOUTH: 'S',
    EAST: 'E',
    WEST: 'W'
});

/** Facing values in `Direction` declaration order, the order a draw sees. */
export const DIRECTIONS = Object.freeze(['N', 'S', 'E', 'W']);

/** docs/RULES.md §7.1: 5 HP. */
export const MAX_HP = 5;

/** docs/RULES.md §7.1: 3 lives. */
export const MAX_LIVES = 3;

/**
 * docs/RULES.md §3.2: at most 6 programmed actions per round.
 *
 * Python spells it `MAX_ACTIONS` in `game/config.py` and enforces it in
 * `Tank.set_actions`, so the trim lives on this class too.
 */
export const MAX_ACTIONS = 6;

/**
 * docs/RULES.md §3.2: `E` has 2 charges per round, recharged at the start of
 * each round. Python spells it `BLAST_CHARGES_PER_ROUND`.
 */
export const BLAST_CHARGES_PER_ROUND = 2;

/**
 * One tile of travel per facing, as `[dx, dy]`. North is -y, matching
 * `DIR_DELTA` in `game/board.py`.
 * @type {Readonly<Record<string, readonly [number, number]>>}
 */
export const DIR_DELTA = Object.freeze({
    N: Object.freeze([0, -1]),
    S: Object.freeze([0, 1]),
    E: Object.freeze([1, 0]),
    W: Object.freeze([-1, 0])
});

/** A quarter turn counter-clockwise. @type {Readonly<Record<string, string>>} */
export const DIR_LEFT = Object.freeze({ N: 'W', W: 'S', S: 'E', E: 'N' });

/** A quarter turn clockwise. @type {Readonly<Record<string, string>>} */
export const DIR_RIGHT = Object.freeze({ N: 'E', E: 'S', S: 'W', W: 'N' });

/**
 * What `Tank.take_damage` reports back, ported from the docstring of
 * `game/robot.py::Tank.take_damage` ("Retorna: 'dead', 'respawn', o 'hit'").
 *
 * The combat path branches on these, and `docs/RULES.md` §6.1 fixes the
 * predicate that decides whether a hit is a kill:
 * `result in ("dead", "respawn")`.
 *
 * @typedef {'hit' | 'respawn' | 'dead'} DamageResultValue
 */
export const DamageResult = Object.freeze({
    /** Survived: HP may still be above zero. */
    HIT: 'hit',
    /** Lost a life with lives to spare: it respawns at full HP next round. */
    RESPAWN: 'respawn',
    /** Lost its last life, or was already out: permanently eliminated. */
    DEAD: 'dead'
});

/**
 * Draws a facing at random, the second half of the respawn draw
 * (docs/RULES.md §7.2).
 * @param {() => number} [random] draw in [0, 1); injectable for tests
 * @returns {string} one of {@link DIRECTIONS}
 */
export function pickRandomDirection(random = Math.random) {
    return DIRECTIONS[Math.floor(random() * DIRECTIONS.length)];
}

/**
 * A tank. Plain mutable state plus the methods the movement and combat
 * paths call.
 *
 * Port of `game/robot.py::Tank` minus everything the demo does not need.
 */
export class Tank {
    /**
     * @param {string} id unique identity (the display name in the demo)
     * @param {number} num hull number, 1-based; drives the sprite colour
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @param {string} [direction=Direction.NORTH]
     */
    constructor(id, num, x = 0, y = 0, direction = Direction.NORTH) {
        /** @type {string} */
        this.id = id;
        /** @type {number} */
        this.num = num;
        /** @type {number} may sit outside the board while the tank is falling */
        this.x = x;
        /** @type {number} */
        this.y = y;
        /** @type {string} */
        this.direction = direction;

        /** @type {number} */
        this.hp = MAX_HP;
        /** @type {number} */
        this.lives = MAX_LIVES;

        /** @type {number} turbo charges banked; the next forward/back spends them */
        this.turboStack = 0;

        /**
         * `E` charges left this round. 2 at the start of every round
         * (§3.2), spent one per blast that actually detonates.
         * @type {number}
         */
        this.blastCharges = BLAST_CHARGES_PER_ROUND;

        /**
         * Programmed actions for the round, in written order: action N runs
         * on step N. Trimmed to {@link MAX_ACTIONS} by
         * {@link Tank#setActions}.
         * @type {string[]}
         */
        this.actions = [];

        /** @type {boolean} out of the match for good once `lives` hits 0 */
        this.alive = true;
        /** @type {boolean} died this round, so it stops acting until respawn */
        this.deadThisRound = false;

        /**
         * Command shield: TOTAL immunity for the current step
         * (docs/RULES.md §4.4). The laser breaks on it and the blast skips
         * it — it is not damage reduction. T4's SHIELD phase sets it and its
         * CLEAR SHIELD phase unsets it; nothing here holds it.
         * @type {boolean}
         */
        this.shieldedThisStep = false;

        /**
         * Damage statistics. The demo HUD reads neither, but the Python keeps
         * both and the port would be lying if it quietly dropped them.
         * @type {number}
         */
        this.damageDealt = 0;
        /** @type {number} */
        this.damageReceived = 0;

        /**
         * Lives taken from other tanks. §6.1: every life a tank loses
         * credits whoever is responsible — a non-final death too, because the
         * predicate is `result in ("dead", "respawn")`.
         *
         * Written ONLY by `sim/round.js`, which sees every death record and
         * credits the ones carrying a `killer` (H2). Nothing in
         * `sim/combat.js` or `sim/movement.js` touches it.
         * @type {number}
         */
        this.kills = 0;
    }

    /**
     * docs/RULES.md §7.1: alive means all three of these.
     * @returns {boolean}
     */
    isAlive() {
        return this.alive && this.lives > 0 && this.hp > 0;
    }

    /**
     * Costs exactly ONE whole life — this is what a fall and a push call,
     * never a damage path (docs/RULES.md §5.1).
     * @returns {boolean} true when this was the last life, i.e. the tank is
     *   permanently out of the match.
     */
    loseLife() {
        this.lives -= 1;
        if (this.lives > 0) {
            // §7.1: losing a non-final life refills HP.
            this.hp = MAX_HP;
            return false;
        }
        this.alive = false;
        return true;
    }

    /**
     * Applies `amount` HP of damage, which is how a laser or a blast hurts.
     *
     * Port of `game/robot.py::Tank.take_damage`. The report is the whole
     * point of the method: `docs/RULES.md` §6.1 makes the caller branch on
     * `dead` / `respawn` to decide whether the attacker is credited with a
     * kill, so both non-final and final deaths have to be distinguishable.
     *
     * Deliberately absent, per docs/RULES.md §4.4: the `has_shield` branch
     * that absorbs `min(amount, SHIELD_ABSORB_CAP)` and consumes itself. It
     * is DESCONECTADO — nothing in runtime ever sets `has_shield`, because
     * `pickup_items` has no caller and no air map declares items. This is the
     * COMMAND shield that lives in `sim/combat.js`, and it is checked by the
     * combat path BEFORE any damage is applied, so it never reaches here.
     *
     * @param {number} amount HP to remove
     * @returns {DamageResultValue}
     */
    takeDamage(amount) {
        // A tank that is already out cannot be damaged again.
        if (!this.isAlive()) return DamageResult.DEAD;

        this.hp -= amount;
        this.damageReceived += amount;

        if (this.hp <= 0) {
            this.lives -= 1;
            if (this.lives > 0) {
                // §7.1: a non-final life costs a life AND refills HP.
                this.hp = MAX_HP;
                return DamageResult.RESPAWN;
            }
            this.alive = false;
            return DamageResult.DEAD;
        }
        return DamageResult.HIT;
    }

    /**
     * Programs the actions for this round.
     *
     * Port of `game/robot.py::Tank.set_actions`, which is where §3.2's
     * "el ejecutor recorta a 6" actually happens.
     *
     * This is the TRIM only. The Python's other submit-time behaviour —
     * rejecting the WHOLE programming when a precondition fails, and
     * emitting `action_rejected` — belongs to `Engine.submit_actions`,
     * which is the demo's input layer (T7), not the simulation.
     *
     * @param {string[]} actions action names in the order they were written
     * @returns {string[]} the buffer as stored, trimmed
     */
    setActions(actions) {
        this.actions = actions.slice(0, MAX_ACTIONS);
        return this.actions;
    }

    /** Empties the program. Port of `Tank.clear_actions`. @returns {void} */
    clearActions() {
        this.actions = [];
    }

    /**
     * Spends one blast charge.
     *
     * Port of `game/robot.py::Tank.use_blast`. The cap is NOT the action's
     * job: an `E` with no charge left is a silent no-op that the executor
     * renders as a wasted turn (§3.2 HUECO).
     *
     * @returns {boolean} true when the blast may actually detonate
     */
    useBlast() {
        if (this.blastCharges > 0) {
            this.blastCharges -= 1;
            return true;
        }
        return false;
    }

    /** Turns 90° counter-clockwise. Port of `Tank.face_left`. @returns {void} */
    faceLeft() {
        this.direction = DIR_LEFT[this.direction];
    }

    /** Turns 90° clockwise. Port of `Tank.face_right`. @returns {void} */
    faceRight() {
        this.direction = DIR_RIGHT[this.direction];
    }

    /**
     * Clears everything that belongs to a single round.
     *
     * Port of `game/robot.py::Tank.reset_round`.
     *
     * Deliberately NOT the same thing as the round executor's `startRound`,
     * which mirrors `Engine.start_round` and keeps the action buffer: tanks
     * program AFTER the round starts, so clearing it here would throw the
     * program away. The two reset different halves, as they do in Python.
     *
     * @returns {void}
     */
    resetRound() {
        this.actions = [];
        this.turboStack = 0;
        this.blastCharges = BLAST_CHARGES_PER_ROUND;
        this.shieldedThisStep = false;
    }
}