// ─── Actions: the seven commands a tank can play (docs/RULES.md §3) ───
//
// Port of `game/actions.py`. The Python uses the Strategy pattern — one
// class per action behind `ACTION_REGISTRY` — to replace an if/elif chain.
// JavaScript closes over the tank it acts on, so each entry here is a
// factory that takes `(tank, world)` and answers the same two things the
// Python's `execute()` did: the log lines and the extra the step frame
// carries.
//
// No DOM, no canvas, no imports from `web/static/`. `world` is the demo's
// version of the Python's `engine.combat`: the three methods an action is
// allowed to reach for, and nothing else. Here they live on two classes —
// `sim/movement.js` and `sim/combat.js` — so `world` hands both over.
//
// ## The seven reachable actions
//
// §3.1 lists the keys of `VALID_COMMANDS`: W forward, S back, A turn_left,
// D turn_right, Q laser, E blast, Z turbo. Those seven are what the demo's
// input can produce, and {@link VALID_ACTIONS} is their list.
//
// ## `shield` is registered but NOT exposed
//
// §3.2 marks this as a HUECO: `shield` is in the engine's `ACTION_REGISTRY`
// and has a screen label in `format_actions`, but `VALID_COMMANDS` has no key
// for it, so no chat input can program it. It can only be set through the API.
// The demo mirrors the gap EXACTLY — the action exists and is executable, and
// it is not in {@link VALID_ACTIONS}. The step executor's SHIELD phase still
// honours it (that is where Python reads it), so a program set directly does
// get immunity for its step.
//
// ## `turbo_placeholder` and the dynamic `turbo_<dir>_<n>` family
//
// Both come from `commands._apply_turbo_direction`, the parse-time rewrite
// that turns a `Z` glued to a direction key into a lateral/forward jump
// (`ZD` → one placeholder plus `turbo_right_2`). The rewrite is ported in
// `initial-state.js::_applyTurboDirection`, so the names are now REACHABLE
// from the sidebar and are registered here exactly as `game/actions.py`
// registers them: `turbo_placeholder` is a static no-op entry, and
// `turbo_<base>_<n>` is resolved DYNAMICALLY by {@link getAction}. The
// placeholder is the first of the pair and burns one step, which is why a
// `Z` `D` program consumes two of the six steps.
//
// ## The turbo cap is lifted
//
// Both the engine and the demo now bank the turbo stack without a maximum —
// the player can stack as many as they like and spend them on the next
// forward/back (stack + 1 tiles, or via the rewrite turbo_<dir>_<n> for a
// direct multi-cell jump).

import { MAX_HP, MAX_LIVES } from './tank.js';

/** @typedef {import('./tank.js').Tank} Tank */

/**
 * The world an action may touch: the two resolvers, and nothing else.
 *
 * @typedef {object} ActionWorld
 * @property {import('./movement.js').Movement} movement
 * @property {import('./combat.js').Combat} combat
 */

/**
 * What an action reports back to the step executor.
 *
 * `deaths` is uniform across all actions and is the single list the
 * executor walks. That uniformity is the demo's own shape: Python splits the
 * same information into `push_deaths`, `deaths` and a hand-built entry for a
 * self-fall, because three different layers produce them. The demo's movement
 * path already emits the self-fall record itself (`fell_off_map`, killer
 * null), and combat emits its own, so one list carries all four causes and
 * there is a single place where a life can be credited.
 *
 * @typedef {object} ActionResult
 * @property {string[]} events front-facing log lines for the HUD
 * @property {object} extra per-action payload for the step entry; every key
 *   beyond `action` and `deaths` is optional and present only when it applies
 */

/**
 * The seven action names the demo's input can produce, in the order of
 * `VALID_COMMANDS` in `game/commands.py`.
 *
 * @type {ReadonlyArray<string>}
 */
export const VALID_ACTIONS = Object.freeze([
    'forward',
    'back',
    'turn_left',
    'turn_right',
    'laser',
    'blast',
    'turbo'
]);

/** Facing glyph for the turn log line. `game/actions.py::DIR_SYM`. */
const DIR_SYMBOL = Object.freeze({ N: '↑', S: '↓', E: '→', W: '←' });

/**
 * Advances one tile, or `turboStack + 1` when a stack is banked.
 *
 * Port of `ForwardAction` and `BackAction`, which are the same code with a
 * different movement vector. Spending the stack here — not inside the
 * movement path — is what `game/actions.py` does too.
 *
 * @param {Tank} tank
 * @param {ActionWorld} world
 * @param {'forward' | 'back'} action
 * @returns {ActionResult}
 */
function move(tank, world, action) {
    let steps = null;
    if (tank.turboStack > 0) {
        steps = tank.turboStack + 1; // the move tile plus the banked stack
        tank.turboStack = 0; // spent by this move
    }
    const result = world.movement.executeMovement(tank, action, steps);
    return {
        events: result.events,
        extra: {
            action,
            pushSteps: result.pushSteps,
            moved: result.moved,
            deaths: result.deaths
        }
    };
}

/**
 * @param {Tank} tank
 * @param {ActionWorld} world
 * @returns {ActionResult}
 */
function forward(tank, world) {
    return move(tank, world, 'forward');
}

/**
 * @param {Tank} tank
 * @param {ActionWorld} world
 * @returns {ActionResult}
 */
function back(tank, world) {
    return move(tank, world, 'back');
}

/**
 * @param {Tank} tank
 * @param {ActionWorld} world
 * @returns {ActionResult}
 */
function turnLeft(tank, world) {
    tank.faceLeft();
    return {
        events: [],
        extra: { action: 'turn_left', direction: DIR_SYMBOL[tank.direction] ?? '?', deaths: [] }
    };
}

/**
 * @param {Tank} tank
 * @param {ActionWorld} world
 * @returns {ActionResult}
 */
function turnRight(tank, world) {
    tank.faceRight();
    return {
        events: [],
        extra: { action: 'turn_right', direction: DIR_SYMBOL[tank.direction] ?? '?', deaths: [] }
    };
}

/**
 * @param {Tank} tank
 * @param {ActionWorld} world
 * @returns {ActionResult}
 */
function laser(tank, world) {
    const result = world.combat.executeLaser(tank);
    return {
        events: result.events,
        extra: { action: 'laser', laserPath: result.laserPath, deaths: result.deaths }
    };
}

/**
 * @param {Tank} tank
 * @param {ActionWorld} world
 * @returns {ActionResult}
 */
function blast(tank, world) {
    // The cap is `Tank.useBlast`'s, not the action's. Without a charge the
    // turn is WASTED: no explosion, no event, no warning to the player.
    // `fired: false` is the whole report (§3.2 HUECO).
    if (tank.useBlast()) {
        const result = world.combat.executeBlast(tank);
        return { events: result.events, extra: { action: 'blast', fired: true, deaths: result.deaths } };
    }
    return { events: [], extra: { action: 'blast', fired: false, deaths: [] } };
}

/**
 * Banks one turbo level. Port of `TurboAction`.
 *
 * The cap is lifted: the engine and the demo now stack turbo without limit
 * (the next forward/back spends the whole stack as `stack + 1` tiles).
 *
 * @param {Tank} tank
 * @param {ActionWorld} world
 * @returns {ActionResult}
 */
function turbo(tank, world) {
    tank.turboStack += 1;
    return { events: [], extra: { action: 'turbo', turboStack: tank.turboStack, deaths: [] } };
}

/**
 * Directional turbo: move `steps` cells along `base` WITHOUT turning.
 *
 * Port of `game/actions.py::TurboDirectionAction`. `base` is one of
 * `forward` / `back` / `left` / `right`; the movement path resolves it to a
 * vector (`left`/`right` are perpendicular to the facing). This is the
 * action a sidebar `Z` `D` finally plays, after the parse-time rewrite has
 * spent a placeholder step on the charge.
 *
 * @param {Tank} tank
 * @param {ActionWorld} world
 * @param {'forward' | 'back' | 'left' | 'right'} base
 * @param {number} steps
 * @returns {ActionResult}
 */
function turboDirection(tank, world, base, steps) {
    const result = world.movement.executeMovement(tank, base, steps);
    return {
        events: result.events,
        extra: {
            action: `turbo_${base}_${steps}`,
            pushSteps: result.pushSteps,
            moved: result.moved,
            deaths: result.deaths
        }
    };
}

/**
 * The empty step a directional turbo charges for. Port of
 * `game/actions.py::TurboPlaceholderAction`.
 *
 * It does nothing at all but occupy its step, which is the contract: a
 * `Z` `D` program is `[placeholder, turbo_right_2]`, so the jump happens on
 * the step AFTER the charge. Do not "optimise" it into the same step.
 *
 * @returns {ActionResult}
 */
function turboPlaceholder() {
    return { events: [], extra: { action: 'turbo_placeholder', deaths: [] } };
}

/**
 * Total immunity for the current step. Port of `ShieldAction`.
 *
 * Registered and executable, unreachable from the input layer (§3.2 HUECO).
 * The step executor's SHIELD phase sets the flag without going through here —
 * exactly as `RoundExecutor._process_shields` does in Python — so this entry
 * exists for parity, not to be reached during a round.
 *
 * @param {Tank} tank
 * @returns {ActionResult}
 */
function shield(tank) {
    tank.shieldedThisStep = true;
    return {
        events: [`🛡️ R${tank.num} (${tank.id}) activates shield`],
        extra: { action: 'shield', deaths: [] }
    };
}

/**
 * `ACTION_REGISTRY`: the seven playable actions plus `shield` and the
 * turbo placeholder. The dynamic `turbo_<base>_<n>` entries are NOT here —
 * they are resolved by {@link getAction}, as in `game/actions.py`.
 *
 * @type {Readonly<Record<string, (tank: Tank, world: ActionWorld) => ActionResult>>}
 */
export const ACTION_REGISTRY = Object.freeze({
    forward,
    back,
    turn_left: turnLeft,
    turn_right: turnRight,
    laser,
    blast,
    turbo,
    shield,
    turbo_placeholder: turboPlaceholder
});

/** The four directions a `turbo_<base>_<n>` name may carry. */
const TURBO_BASES = new Set(['forward', 'back', 'left', 'right']);

/**
 * The action for `name`, or null when there is none.
 *
 * Port of `game/actions.py::get_action`: a registry lookup, then the dynamic
 * `turbo_<base>_<n>` parse. An unknown name is skipped in SILENCE by the
 * step executor (§3.2 HUECO), so this returning null is a normal outcome,
 * not an error.
 *
 * @param {string} name
 * @returns {((tank: Tank, world: ActionWorld) => ActionResult)|null}
 */
export function getAction(name) {
    const action = ACTION_REGISTRY[name];
    if (action) return action;

    // Dynamic turbo directional: turbo_forward_2, turbo_right_3, etc.
    const parts = name.split('_');
    if (parts.length !== 3 || parts[0] !== 'turbo') return null;
    const base = parts[1];
    if (!TURBO_BASES.has(base)) return null;
    // The `^[+-]?\d+$` test mirrors Python's `int(parts[2])`: a strict
    // integer, so "2x" or "" is rejected instead of silently truncated by
    // parseInt.
    if (!/^[+-]?\d+$/.test(parts[2])) return null;
    const steps = Number(parts[2]);
    return (tank, world) => turboDirection(tank, world, base, steps);
}