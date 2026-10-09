// ─── The round: exactly 6 steps, 3 phases each (docs/RULES.md §2) ─────
//
// Port of the step executor of `game/round_executor.py`, minus everything
// the demo does not have: there is no board view, no `fx` list, no stream,
// no game state machine, no timers, no lobby. No DOM, no canvas, nothing
// imported from `web/static/`.
//
// ## A round is exactly 6 steps, always
//
// §2.2: "Una ronda son exactamente 6 pasos, siempre, aunque no haya nada
// que animar". The engine does not teleport, and neither does the demo: the
// renderer has to see the whole route. The demo has no `FRAME_DELAY` and no
// programming countdown — the round resolves the moment the player submits —
// so the executor's six steps are the entire round.
//
// ## Three phases, not five
//
// Python runs ROTOR, ESCUDO, ACCIONES, LÁSER DEL MAPA, LIMPIAR ESCUDO. Rotors
// and map lasers are DORMIDO (no air map enables them), so the demo keeps
// the shield, the actions and the shield clear, IN THAT ORDER. The order is
// the contract: the shield has to be up BEFORE the actions so it blocks what
// happens in this very step, and it has to be lowered at the end or it would
// keep blocking the following steps.
//
// ## Simultaneity (§2.3)
//
//   * every living tank of the snapshot plays its step action inside this one
//     step — the loop walks the whole snapshot, there is no per-tank frame,
//   * two tanks that shoot each other BOTH shoot: the result is mutual,
//   * a tank that dies THIS step still plays its action. The guard only
//     skips a tank that already died in an EARLIER step of THIS round,
//     because `deadThisRound` is cleared at round start. Kill someone and
//     die in the same step and your shot still leaves — as long as you have
//     a life left. If that loss was your LAST life you do NOT act: the
//     `isAlive()` check cuts before the `deadThisRound` guard.
//
// ## The tiebreak order is a demo decision, not a port
//
// §2.3 flags the iteration order as a HUECO: Python walks `engine.tanks`,
// which is a dict in INSERTION (registration) order — not a designed
// priority, so the outcome of a contested cell depends on who was added to
// the roster first. The demo walks the snapshot in HULL NUMBER ASCENDING:
// stable, documented, and independent of registration. It is the only place
// the demo invents a rule instead of copying one, and it is why
// `snapshot()` sorts instead of merely filtering.
//
// ## H2 — this file owns the kill counter
//
// Python splits the credit across two layers: the combat resolver credits
// laser and blast deaths because it knows the attacker, and
// `round_executor.py` credits a push because the class that moves the tank
// does not. The demo's resolvers know the attacker in every case and stamp
// `killer` on the death record instead, so `sim/round.js` is the ONLY writer
// of `Tank.kills` and credits each record that names a killer, exactly once.
//
// It filters on `killer !== null` and NEVER on the death `cause`. There are
// four causes in the demo — `pushed_off_map`, `fell_off_map`, `killed_by_laser`,
// `killed_by_blast` — so filtering on the push cause would credit pushes and
// silently drop every laser and blast kill. The failure is invisible: the
// game still runs, it just stops counting.
//
// ## Respawn and victory live here too
//
// `Engine.start_round` draws a tank back onto the board and
// `RoundExecutor._check_winner` decides the match, and both belong to this
// file: the first is the other half of the round reset, the second is the
// other end of the round. They are here rather than in a `sim/victory.js`
// because the import-closure contract in `test/actions-round.test.js` pins the
// set of modules this one may reach, and a new module widens it.
//
// Three things about them are easy to get wrong, so they are stated here as
// well as where they are implemented:
//
//   * the placement is a draw over the WHOLE grid, not a spawn point: the maps
//     declare none and the board keeps no list of them,
//   * the cell of DEATH is out of the draw, and a saturated board QUEUES the
//     tank rather than handing the death cell back. `Board.pickFreeCell` does
//     offer it back once nothing else is free, so the draw is built here and
//     does not route through it,
//   * the winner is the only tank with LIVES. Board presence is not part of the
//     predicate, and neither is HP: Python computed an `on_board` value for
//     every tank in `_check_winner`, never read it, and deleted it as dead code.
//
// ## Where the respawn queue lives
//
// There is no queue list, on either side. §7.2's HUECO calls it a "respawn
// queue", and what implements it is a single fact: a tank that is alive, has
// lives, and whose cell does not name it. `startRound` retries exactly that,
// so a tank that could not be placed last round is placed this one — and one
// that could not be placed this round is still waiting next time. Nothing
// records the deferral and nothing announces it.
//
// ## Deliberately not ported
//
//   * the frame dict (`_frame`, `get_compact_status`) and the `fx` list: both
//     are the /view and the stream's protocol. The step result below carries
//     the simulation's own facts; turning them into animation input is T7's,
//   * `_process_rotors`, `_process_map_lasers` and the pit branch of a death:
//     DORMIDO, no air map enables them,
//   * `Engine.record_events`'s 20-line cap and `Engine.record_fx`'s 24-entry
//     cap: those bound what the stream and the renderer are sent. The demo
//     holds the round's log in memory for one round and then drops it,
//   * `paralyzed` and `connected`: bombs are DESCONECTADO items and the
//     disconnect path died with the web producer (HUECO-9). §7.3's disconnect
//     grace goes with `connected`, so "counts for victory" is "has lives",
//   * `Engine.announce_eliminations`: it emits the `player_eliminated` stream
//     event and leaves the wording to the app. The demo has no stream and no
//     announcement, and every elimination already carries its line in the step
//     that caused it,
//   * `Engine.submit_actions`'s reject-the-whole-programming rule: that is
//     the input layer, T7's. The trim to 6 IS here, on `Tank.setActions`.

import { getAction } from './actions.js';
import { Combat } from './combat.js';
import { Movement } from './movement.js';
import { BLAST_CHARGES_PER_ROUND, pickRandomDirection } from './tank.js';

/** @typedef {import('./board.js').Board} Board */

/** @typedef {import('./tank.js').Tank} Tank */

/**
 * Type-only reference to the movement and combat death records. No runtime
 * import edge: the death record shape is the contract between the resolvers
 * and this file, and it is already pinned by their own tests.
 * @typedef {import('./movement.js').DeathRecord | import('./combat.js').CombatDeathRecord} DeathRecord
 */

/**
 * The phase names, in the order a step runs them.
 *
 * Python numbers them 2, 3 and 5 of five; ROTOR (1) and MAP LASER (4) are
 * DORMIDO and leave no gap here.
 * @type {Readonly<Record<string, string>>}
 */
export const StepPhase = Object.freeze({
    /** The command shield goes up, before anything moves or shoots. */
    SHIELD: 'shield',
    /** Movement, pushes, laser and blast: every tank, in one pass. */
    ACTIONS: 'actions',
    /** The shield flag comes down, so it cannot block a later step. */
    CLEAR_SHIELD: 'clear_shield'
});

/** The phases of a step, in execution order. @type {ReadonlyArray<string>} */
export const STEP_PHASES = Object.freeze([
    StepPhase.SHIELD,
    StepPhase.ACTIONS,
    StepPhase.CLEAR_SHIELD
]);

/** docs/RULES.md §2.2: a round is six steps, always. */
export const ROUND_STEPS = 6;

/**
 * How a round ended (docs/RULES.md §7.3).
 *
 * Python has no such trio: it writes `engine.winner` and flips `engine.state`
 * to `GAME_OVER` (win or draw) or `WAITING`. The demo has no game state
 * machine — T4 dropped it with the rest of the engine — so the outcome is one
 * value instead of two fields that can disagree, and `ONGOING` is the
 * `WAITING` case: more than one tank with lives, the match continues.
 */
export const VictoryStatus = Object.freeze({
    /** More than one tank with lives: the match goes on. */
    ONGOING: 'ongoing',
    /** Exactly one tank with lives. */
    WIN: 'win',
    /** Nobody with lives at all. */
    DRAW: 'draw'
});

/**
 * The result of one victory check.
 *
 * @typedef {object} VictoryOutcome
 * @property {string} status one of {@link VictoryStatus}
 * @property {string|null} winner the id of the last tank with lives, or null
 */

/**
 * Where a respawn landed, or that it did not land at all.
 *
 * @typedef {object} RespawnResult
 * @property {boolean} queued true when the board was saturated and the draw
 *   was skipped; the tank stays off the board and is retried next round (§7.2)
 * @property {import('./board.js').Cell|null} cell where it was placed, null
 *   when it was queued
 * @property {string} direction the facing after the draw: a fresh one, or the
 *   one it had when it was queued
 */

/**
 * One tank's turn inside a step.
 *
 * @typedef {object} StepActionEntry
 * @property {string} tank id of the tank that acted
 * @property {number} num hull number, for the log line and the sprite colour
 * @property {string} action the internal action name it played
 * @property {string[]} events its log lines
 * @property {string} [direction] where it ended up facing — turns only
 * @property {Array<[number, number]>} [laserPath] cells the beam crossed — laser only
 * @property {boolean} [fired] whether the blast really detonated — blast only;
 *   `false` is the silent no-op of an `E` with no charge (§3.2)
 * @property {Array<{x: number, y: number}>} [pushSteps] tiles a pushed tank ended on
 * @property {number} [moved] tiles the acting tank actually advanced
 * @property {number} [turboStack] the stack after the action — turbo only
 */

/**
 * One executed step of the round: the beat the renderer animates.
 *
 * @typedef {object} StepBeat
 * @property {'step'} phase
 * @property {number} step 1-based, as every log line and the HUD spell it
 * @property {string} description `Step 3: R1 laser, R2 forward`, or `Step 3`
 * @property {StepActionEntry[]} actions one row per tank that acted
 * @property {DeathRecord[]} deaths every life lost in this step
 * @property {string[]} events every log line this step produced
 * @property {string[]} phases the phases that ran, in order
 */

/**
 * Runs a match's rounds over one board and one roster.
 *
 * Like `RoundExecutor`, which holds a reference to the engine it drives.
 * The demo has no engine object: the board and the id->Tank registry ARE the
 * match, and the resolvers are built here from the two.
 */
export class Round {
    /**
     * @param {object} context
     * @param {Board} context.board
     * @param {Map<string, Tank>} context.tanks every tank in the match
     * @param {() => number} [context.random=Math.random] the draw source behind
     *   the respawn cell and the respawn facing. Injectable so a test can pin a
     *   placement; Python uses the `random` module for the same two draws.
     */
    constructor({ board, tanks, random = Math.random }) {
        /** @type {Board} */
        this.board = board;
        /** @type {Map<string, Tank>} */
        this.tanks = tanks;
        /** @type {() => number} */
        this.random = random;

        /** @type {Movement} the movement half of Python's `CombatResolver` */
        this.movement = new Movement({ board, tanks });
        /** @type {Combat} the laser/blast half */
        this.combat = new Combat({ board, tanks });

        /** @type {number} how many rounds have started */
        this.roundNum = 0;
        /** @type {string[]} the current round's log lines, oldest first */
        this.roundEvents = [];
        /** @type {VictoryOutcome} the last victory check (docs/RULES.md §7.3) */
        this.victory = { status: VictoryStatus.ONGOING, winner: null };
    }

    /**
     * The only thing an action is allowed to reach for.
     *
     * Python hands the actions `engine.combat` and they call three methods on
     * it. The demo split that one class in two, so an action gets both.
     * @returns {{movement: Movement, combat: Combat}}
     */
    world() {
        return { movement: this.movement, combat: this.combat };
    }

    /**
     * The living tanks, in the order they act: hull number ascending.
     *
     * §2.3 HUECO. Python filters `engine.tanks.values()` and gets registration
     * order; the demo sorts, so the order is a documented rule rather than an
     * accident of who was added to the roster first.
     *
     * @returns {Tank[]}
     */
    snapshot() {
        return [...this.tanks.values()].filter((tank) => tank.isAlive()).sort((a, b) => a.num - b.num);
    }

    /**
     * Whether the board's cell at this tank's coordinates names THIS tank.
     *
     * The predicate is `cell.tank_id == tank.id` and it must never be
     * `board.has_tank(x, y)`. `Engine.start_round` documents why in its own
     * comment: if another tank walked onto the cell of death, `has_tank` says
     * yes and the ghost plays the rest of the match standing on top of it,
     * with no respawn ever happening. Owning the cell is the only thing that
     * counts as being on the board.
     *
     * @param {Tank} tank
     * @returns {boolean}
     */
    isOnBoard(tank) {
        const cell = this.board.getCell(tank.x, tank.y);
        return cell !== null && cell.tankId === tank.id;
    }

    /**
     * Puts a tank back on the board: a free cell of the WHOLE grid, never the
     * cell it died on, and a fresh random facing.
     *
     * Port of `Engine._respawn_tank`, draw for draw:
     *
     *   * the candidate list is every cell that is free RIGHT NOW — in bounds,
     *     of pure `EMPTY` type (never a wall, item, pit or rotor) and with no
     *     tank on it — minus the cell of death. The maps declare no spawn
     *     points and the board keeps no spawn list, so there is nothing to
     *     prefer: it is a draw over the whole grid (§7.2),
     *   * the cell is drawn first and the FACING second, both off the same
     *     source. The direction the tank had is NOT kept,
     *   * a saturated board does NOT fall back to the cell of death: the tank
     *     is queued, keeps its death coordinates, and `startRound` draws again
     *     next round. §7.2's HUECO asks for exactly that, and it is why the
     *     draw lives here instead of going through `Board.pickFreeCell`, whose
     *     `avoid` option hands the death cell back once nothing else is free
     *     (see "Where the queue lives" above),
     *   * nothing is recorded: no event, no warning, no line of any kind. The
     *     Python only logs it, and the demo has no log — §7.2's "tampoco hay
     *     aviso explícito al jugador".
     *
     * @param {Tank} tank
     * @returns {RespawnResult}
     */
    respawnTank(tank) {
        const deathX = tank.x;
        const deathY = tank.y;
        // `freeCells` is x-major, the same order the Python comprehension walks
        // the grid in, so a draw over this list is a draw over the same list.
        const candidates = this.board
            .freeCells()
            .filter((cell) => cell.x !== deathX || cell.y !== deathY);

        if (candidates.length === 0) {
            // Saturated: stay in the respawn queue. The queue IS this state — an
            // alive tank with lives whose cell does not name it — and
            // `startRound` retries exactly that state next round, so no list is
            // kept here. Python keeps none either.
            return { queued: true, cell: null, direction: tank.direction };
        }

        const cell = candidates[Math.floor(this.random() * candidates.length)];
        this.board.placeTank(cell.x, cell.y, tank.id);
        tank.x = cell.x;
        tank.y = cell.y;
        tank.direction = pickRandomDirection(this.random);
        // Back in the round: its programmed actions play from step 1.
        tank.deadThisRound = false;
        return { queued: false, cell, direction: tank.direction };
    }

    /**
     * Decides the match from the lives that are left (docs/RULES.md §7.3).
     *
     * Port of `RoundExecutor._check_winner`, which reads the winner off
     * `with_lives` and its length: exactly one tank with lives wins, zero is a
     * draw, anything else means the match continues.
     *
     * The predicate is {@link countsForVictory} — lives, and nothing else. In
     * particular it does NOT require board presence: a tank that lost a life
     * and is waiting for its respawn is not on the board, still has lives, and
     * still wins. Python computed an `on_board` value for every tank in this
     * very function, never read it, and deleted it as dead code; §7.3 records
     * that. Do not reintroduce it.
     *
     * Python also flips `engine.state` here — `GAME_OVER` on a win or a draw,
     * `WAITING` otherwise. The demo has no game state machine, so
     * {@link VictoryStatus} carries the same information instead.
     *
     * @returns {VictoryOutcome}
     */
    checkWinner() {
        const withLives = [...this.tanks.values()].filter(countsForVictory);
        /** @type {VictoryOutcome} */
        let outcome;
        if (withLives.length === 1) {
            outcome = { status: VictoryStatus.WIN, winner: withLives[0].id };
        } else if (withLives.length === 0) {
            outcome = { status: VictoryStatus.DRAW, winner: null };
        } else {
            outcome = { status: VictoryStatus.ONGOING, winner: null };
        }
        this.victory = outcome;
        return outcome;
    }

    /**
     * Opens a new round.
     *
     * Port of the reset half of `Engine.start_round`: the volatile per-round
     * state is dropped and the tanks that lost a life last round come back.
     *
     * It does NOT call `Tank.resetRound`, and the asymmetry is the Python's
     * own: `Engine.start_round` resets the volatile fields inline and its
     * comment says why — "solo respawn, NO limpiar acciones". Tanks are
     * programmed AFTER the round starts, so wiping the action buffer here
     * would throw the program away before it was ever played. `Tank`
     * `resetRound` is the full per-tank port and keeps that difference.
     *
     * The respawn PLACEMENT is the second half of the Python's reset, which
     * runs it as a separate pass over the roster: a tank whose cell does not
     * name it — killed in combat, pushed off the edge, or with its cell of
     * death walked over by a rival — is drawn back onto the board here, with a
     * random facing. See {@link Round#respawnTank}. Both halves are merged into
     * one walk below; Python's two passes have the same guard (`is_alive`) and
     * the same end state, and the demo's walk is in hull order (H9).
     *
     * @returns {number} the new round number
     */
    startRound() {
        this.roundNum += 1;
        this.roundEvents = [];

        for (const tank of this.snapshot()) {
            // The volatile half of the reset, field by field as Python does
            // it: charges back to full, no banked turbo, no leftover shield.
            tank.blastCharges = BLAST_CHARGES_PER_ROUND;
            tank.turboStack = 0;
            tank.shieldedThisStep = false;
            // Python clears `dead_this_round` for the tank that respawns, in
            // two branches that between them cover every alive tank holding
            // the flag: the anomalous "dead but still standing on the board"
            // one, and the real one — alive with a cell that does not hold it.
            tank.deadThisRound = false;
            // And the respawn itself, for the tanks that are not on the board.
            if (!this.isOnBoard(tank)) this.respawnTank(tank);
        }

        return this.roundNum;
    }

    /**
     * The round, one beat per step.
     *
     * Port of `RoundExecutor.iter_steps`. Yields `{phase: 'start'}`, exactly
     * {@link ROUND_STEPS} step beats, then `{phase: 'end'}`, which carries the
     * victory outcome.
     *
     * The check sits AFTER the six steps and never inside one (§7.3): a round
     * that decided its match on step 1 still runs steps 2 to 6, and only the
     * closing beat can name a winner.
     *
     * With no living tank there is nothing to animate and nobody to count, so
     * the generator yields nothing at all — the same early return the Python
     * does before its first beat, and the same reason it never reaches
     * `_check_winner`: with nobody alive the round does not exist.
     *
     * @returns {Generator<object, void, void>}
     */
    *iterSteps() {
        const snapshot = this.snapshot();
        if (snapshot.length === 0) return;

        yield { phase: 'start', round: this.roundNum };

        for (let step = 0; step < ROUND_STEPS; step++) {
            yield { phase: 'step', ...this.executeStep(snapshot, step) };
        }

        // Python announces the eliminations here before checking the winner —
        // "preguntarle al MOTOR una vez al cerrar la ronda las cubre todas", so
        // the four death paths cannot forget one. `announce_eliminations` emits
        // the `player_eliminated` stream event and defers the wording to the app
        // (`game/announcements.py`); the demo has neither a stream nor a lobby
        // ceremony, and each elimination already carries its line in the step
        // that caused it (⚔️ for a death with an author, ☠️ for the last life).
        const victory = this.checkWinner();
        yield { phase: 'end', round: this.roundNum, victory };
    }

    /**
     * The round as a list of step beats, for a caller that does not animate.
     *
     * Port of `RoundExecutor.execute`, built on {@link Round#iterSteps} the
     * same way. Python returns FRAMES here; the demo returns the step beats,
     * which is what its caller can use.
     *
     * @returns {StepBeat[]}
     */
    execute() {
        return [...this.iterSteps()].filter((beat) => beat.phase === 'step');
    }

    /**
     * One complete step: the three phases, in order.
     *
     * Port of `RoundExecutor._ejecutar_paso`, whose docstring calls its own
     * line order "EL ORDEN DE ESTA FUNCIÓN ES EL CONTRATO de la ronda". The
     * Python filters the snapshot between phases because a phase can kill
     * somebody; with map lasers gone, nothing runs between the actions and
     * the shield clear, so the surviving filtering is the one inside the
     * ACTIONS phase itself.
     *
     * @param {Tank[]} snapshot the round's living tanks, in action order
     * @param {number} stepIndex 0-based; the beat reports it 1-based
     * @returns {StepBeat}
     */
    executeStep(snapshot, stepIndex) {
        const step = stepIndex + 1;
        /** @type {string[]} */
        const phases = [];

        // 1. SHIELD (Python phase 2). Up before the actions, so it blocks what
        //    happens in this very step.
        this.processShields(snapshot, stepIndex);
        phases.push(StepPhase.SHIELD);

        // 2. ACTIONS (Python phase 3): every tank of the snapshot, one pass.
        const { actions, deaths, events } = this.executeActions(snapshot, stepIndex);
        phases.push(StepPhase.ACTIONS);

        // 3. CLEAR SHIELD (Python phase 5). Down at the end, or it would keep
        //    blocking the steps that follow.
        this.clearShield(snapshot);
        phases.push(StepPhase.CLEAR_SHIELD);

        this.roundEvents.push(...events);

        return {
            phase: 'step',
            step,
            description: describeStep(step, actions),
            actions,
            deaths,
            events,
            phases
        };
    }

    /**
     * Raises the command shield of every tank that programmed it for this
     * step.
     *
     * Port of `RoundExecutor._process_shields`. It reads the program rather
     * than running the `shield` action, so a shielded tank spends its turn:
     * the ACTIONS phase skips a `shield` step.
     *
     * §3.2 marks the command as unplayable, so through the demo's input layer
     * this never fires; it is kept because it is a live phase of the contract
     * and because a program set directly has to behave.
     *
     * @param {Tank[]} snapshot
     * @param {number} stepIndex
     * @returns {void}
     */
    processShields(snapshot, stepIndex) {
        for (const tank of snapshot) {
            if (!tank.isAlive() || tank.deadThisRound) continue;
            if (tank.actions[stepIndex] === 'shield') tank.shieldedThisStep = true;
        }
    }

    /**
     * Lowers every shield flag at the end of the step.
     * @param {Tank[]} snapshot
     * @returns {void}
     */
    clearShield(snapshot) {
        for (const tank of snapshot) tank.shieldedThisStep = false;
    }

    /**
     * The action `tank` has to play on this step, already executed.
     *
     * Port of `RoundExecutor._accion_del_paso`, guard for guard. Null means
     * this tank does not act, and the four ways to get there are the four
     * ways the Python lists: it is out, it already died in an EARLIER step of
     * this round, it has nothing programmed for this step, or its action does
     * not exist. A `shield` step returns null too — that one was consumed by
     * the SHIELD phase.
     *
     * The order of the first two guards IS the simultaneity contract (§2.3):
     * `isAlive()` cuts before `deadThisRound`, which is why dying on your
     * last life silences you for the very step you die, while dying with a
     * life to spare does not.
     *
     * @param {Tank} tank
     * @param {number} stepIndex
     * @param {Set<string>} deadThisStep ids that died during THIS step: a tank
     *   in here still plays its action
     * @returns {{name: string, events: string[], extra: object}|null}
     */
    actionForStep(tank, stepIndex, deadThisStep) {
        // No life left (or already eliminated): out, even this step.
        if (!tank.isAlive()) return null;
        // Died in a previous step of this round: it comes back next round.
        if (tank.deadThisRound && !deadThisStep.has(tank.id)) return null;
        // Nothing programmed for this step: a 2-action tank idles from step 3
        // on, and a tank that programmed nothing idles forever.
        if (stepIndex >= tank.actions.length) return null;

        const name = tank.actions[stepIndex];
        if (name === 'shield') return null; // handled by the SHIELD phase
        const action = getAction(name);
        if (action === null) return null; // unknown action: skipped in silence

        const { events, extra } = action(tank, this.world());
        return { name, events, extra };
    }

    /**
     * Plays every tank's step action and emits one step's worth of results.
     *
     * Port of `RoundExecutor._execute_actions`, with the three death paths
     * Python keeps apart collapsed into the single list the demo's resolvers
     * hand over. The frame ORDER it documents is preserved: the action's own
     * effects first, then the deaths it caused.
     *
     * @param {Tank[]} snapshot
     * @param {number} stepIndex
     * @returns {{actions: StepActionEntry[], deaths: DeathRecord[], events: string[]}}
     */
    executeActions(snapshot, stepIndex) {
        /** @type {StepActionEntry[]} */
        const actions = [];
        /** @type {DeathRecord[]} */
        const deaths = [];
        /** @type {string[]} */
        const events = [];
        /** @type {Set<string>} */
        const deadThisStep = new Set();

        for (const tank of snapshot) {
            const turn = this.actionForStep(tank, stepIndex, deadThisStep);
            if (turn === null) continue;

            actions.push(actionEntry(tank, turn.name, turn.events, turn.extra));
            events.push(...turn.events);

            for (const death of turn.extra.deaths) {
                // Recorded before anything else: a tank that dies here is
                // still allowed to play its own action this same step.
                deadThisStep.add(death.tank);
                deaths.push(death);
                this.creditKill(death);
                const line = eliminationLine(death);
                if (line !== null) events.push(line);
            }
        }

        return { actions, deaths, events };
    }

    /**
     * Credits one death to its killer.
     *
     * H2. The ONLY place in the demo that writes `Tank.kills`, and the only
     * thing it filters on is whether the record names an author.
     *
     * It must NEVER filter on `death.cause`: the demo has four causes
     * (`pushed_off_map`, `fell_off_map`, `killed_by_laser`, `killed_by_blast`)
     * and a cause filter would credit pushes while dropping every laser and
     * blast kill — a failure that is invisible, because the game keeps running
     * and simply stops counting.
     *
     * Python's predicate for "this death counts" is
     * `result in ("dead", "respawn")`, and the demo's resolvers apply it
     * before emitting the record: a non-final death arrives here with a
     * killer too (§6.1).
     *
     * @param {DeathRecord} death
     * @returns {void}
     */
    creditKill(death) {
        if (death.killer === null || death.killer === undefined) return;
        const killer = this.tanks.get(death.killer);
        if (killer === undefined) return;
        killer.kills += 1;
    }
}

/**
 * Whether `tank` counts for the victory condition (docs/RULES.md §7.3).
 *
 * Port of `RoundExecutor._counts_for_victory`, with the disconnect half
 * dropped and the rest stated in full rather than left implicit:
 *
 *   * dropped: the disconnect grace (`DISCONNECT_GRACE_TIME`, 10 s). §7.3 marks
 *     it DESCONECTADO — the mechanism is wired and reachable, but nothing
 *     triggers it, because in the current runtime `connected` is only ever set
 *     to `True`, so `player_present` always answers yes and the grace never
 *     bites. The producer of a disconnection died with the web path. The demo
 *     has no connections at all, so "counts for victory" reduces to "has
 *     lives", which is what this function is, whole,
 *   * kept, and deliberately: nothing else. Not HP, not `isAlive()`, and above
 *     all NOT being on the board. `isAlive()` is the ACTION gate — who plays a
 *     step — and this is the victory gate, which is a different question: a
 *     tank waiting for its respawn is alive, has lives, and is nowhere on the
 *     board, and it still counts.
 *
 * @param {Tank} tank
 * @returns {boolean}
 */
function countsForVictory(tank) {
    return tank.lives > 0;
}

/**
 * The tank's row inside a step's actions.
 *
 * Port of `RoundExecutor._entrada_de_accion`, minus the renderer-facing
 * `blast_pos` / `push_from` / `push_pos` / `push_count` keys: those are the
 * animation protocol of `web/static/js/animation.js` and building them from
 * the simulation is T7's. `fired` is kept even though Python has no such key,
 * because it is the only signal that an `E` without charges detonated
 * nothing (§3.2).
 *
 * @param {Tank} tank
 * @param {string} name
 * @param {string[]} events
 * @param {object} extra
 * @returns {StepActionEntry}
 */
function actionEntry(tank, name, events, extra) {
    /** @type {StepActionEntry} */
    const entry = { tank: tank.id, num: tank.num, action: name, events };
    if (extra.direction !== undefined) entry.direction = extra.direction;
    if (extra.laserPath !== undefined) entry.laserPath = extra.laserPath;
    if (extra.fired !== undefined) entry.fired = extra.fired;
    if (extra.pushSteps !== undefined && extra.pushSteps.length > 0) {
        entry.pushSteps = extra.pushSteps;
    }
    if (extra.moved !== undefined) entry.moved = extra.moved;
    if (extra.turboStack !== undefined) entry.turboStack = extra.turboStack;
    return entry;
}

/**
 * `Step 3: R1 laser, R2 forward`, or plain `Step 3` when nobody acted.
 *
 * Port of the description `RoundExecutor._emitir_frame_del_paso` builds.
 * @param {number} step 1-based
 * @param {StepActionEntry[]} actions
 * @returns {string}
 */
function describeStep(step, actions) {
    const parts = actions.map((entry) => `R${entry.num} ${entry.action}`);
    return parts.length ? `Step ${step}: ${parts.join(', ')}` : `Step ${step}`;
}

/**
 * The Python's elimination line for a death with an author, verbatim.
 *
 * `⚔️ R1 (ana) eliminated R2 (beto)` — the same string the live game prints,
 * so the demo HUD reads the same. A death without an author (a tank that fell
 * on its own) has no line: its own event was already reported by the movement
 * path.
 *
 * @param {DeathRecord} death
 * @returns {string|null}
 */
function eliminationLine(death) {
    if (death.killer === null || death.killer === undefined) return null;
    return `⚔️ R${death.killerNum} (${death.killer}) eliminated R${death.num} (${death.tank})`;
}