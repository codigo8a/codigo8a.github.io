// ─── Demo initial state (pure, no DOM, no timers, no network) ──
//
// The shape here is not invented: it mirrors what the reused client
// modules read off `state.gameState`.
//
//   renderer.js  updateUI()  -> gs.state, gs.round, gs.remaining_time,
//                               gs.alive_count, gs.total_count,
//                               gs.waiting_room, gs.scoreboard, gs.tanks
//   renderer.js  drawBoard() -> gs.board.{width,height,cells,rotors,
//                               conveyors,repulsors,lasers,laser_walls},
//                               gs.fx, gs.tanks
//   ui.js  refreshInputsEnabled()/addCmd() -> tank.phase, tank.lives,
//                               tank.alive, and gs.state === 'programming'
//
// Keeping it in its own module (instead of inline in main.js) is what
// makes it testable under `node --test`: this file imports nothing, so
// it loads in Node without a DOM.
//
// T2-T7 replace the body of this module with the real simulation. T1
// only proves the renderer and the sidebar read a sane state.
//
// H5: the constants below are NOT re-declared here any more. They live in
// `sim/board.js` and `sim/tank.js` and are imported, so there is exactly one
// source of truth. The re-exports keep the names `initial-state.test.js`
// imports (that earlier test is outside T7b's edit surface and must not
// change).
//
// The roster is a DRAW, not a table. `OPENING_ROSTER` used to pin @you to
// (1,1) facing N, @bot-1 to (5,5) and @bot-2 to (10,10), so every replay of
// the demo opened on the same three cells — while §7.2 has no spawn points at
// all and T5 had already ported the random respawn draw. The opening is that
// same draw on an empty board (see {@link drawOpeningRoster}), and the bot
// count is the player's choice from the winner modal.

import { Board, BOARD_SIZE } from './sim/board.js';
import { MAX_ACTIONS, MAX_HP, MAX_LIVES, Tank, pickRandomDirection } from './sim/tank.js';

/** docs/RULES.md §1: the arena is a square 12x12 board, no edge wall. */
export { BOARD_SIZE };

/** docs/RULES.md §5: a tank starts with 5 HP. */
export { MAX_HP as START_HP };

/** docs/RULES.md §5: a tank starts with 3 lives. */
export { MAX_LIVES as START_LIVES };

/** The player owns tank #1 from boot: the demo has no lobby or claim gate. */
export const PLAYER_NAME = '@you';

/**
 * The bot counts the demo supports: one duel up to a four-bot brawl (five tanks
 * including the player).
 *
 * Four is a demo decision, not a rule of the game: the human asked to cap the
 * roster here, so the picker, the clamp and the roster builder keep one answer
 * to "what is the maximum". It does NOT make every hull colour unique — the
 * palette still carries four colours (`renderer.js` picks
 * `SPRITE_COLORS[(num - 1) % 4]`), so on a four-bot match tank numbers 1 and 5
 * still share one. The hull number the same renderer draws on each tank is what
 * keeps them readable.
 */
export const MIN_BOT_COUNT = 1;
export const MAX_BOT_COUNT = 4;

/**
 * The roster the FIRST match boots with, so a player who lands on the itch.io
 * page is never asked to configure anything: the start gate still opens on
 * today's two-bot duel. A choice made in the winner modal replaces it from the
 * second match on.
 */
export const DEFAULT_BOT_COUNT = 2;

/**
 * Brings any bot count into the supported range.
 *
 * The count reaches this module from a DOM (`data-bot-count` read back off a
 * button), so it is user input and cannot be trusted as an integer: a missing
 * or unparseable value falls back to {@link DEFAULT_BOT_COUNT} rather than to
 * an empty roster, a fractional one is floored instead of rounded up into a
 * count that was never offered, and the ends are clamped.
 *
 * @param {unknown} value
 * @returns {number} an integer in [MIN_BOT_COUNT, MAX_BOT_COUNT]
 */
export function clampBotCount(value) {
    // `Number(null)` and `Number('')` are both 0, which would silently read a
    // MISSING count as "one bot". A missing value is not a count: it falls back
    // to the default, exactly like an unparseable one.
    if (value === null || value === undefined || value === '') return DEFAULT_BOT_COUNT;
    const count = Math.floor(Number(value));
    if (!Number.isFinite(count)) return DEFAULT_BOT_COUNT;
    return Math.min(MAX_BOT_COUNT, Math.max(MIN_BOT_COUNT, count));
}

/**
 * The ids of the bots that fill a roster: `@bot-1` … `@bot-N`.
 *
 * Clamped through {@link clampBotCount}, so callers never have to validate a
 * count before asking for the names.
 *
 * @param {number} [count=DEFAULT_BOT_COUNT]
 * @returns {string[]}
 */
export function botNames(count = DEFAULT_BOT_COUNT) {
    const total = clampBotCount(count);
    return Array.from({ length: total }, (_, index) => `@bot-${index + 1}`);
}

/**
 * Draws the opening placement: a free cell and a facing per tank, the player
 * first and the bots after it, each placed on the board before the next draw.
 *
 * This is the SAME draw T5 ported for respawns — `board.pickFreeCell` plus
 * `pickRandomDirection` — because docs/RULES.md §7.2 has no spawn points at
 * all: any free cell is valid, drawn at random. The opening is that draw on an
 * empty board. Reusing the two primitives is the point (H5): a second picker
 * could disagree with the respawn one later.
 *
 * Placing each tank immediately is what keeps §1 (one tank per cell) without
 * an `avoid` list: the cell a previous draw took is no longer free, so the
 * next draw cannot return it.
 *
 * @param {object} [options]
 * @param {number} [options.botCount=DEFAULT_BOT_COUNT] clamped, never trusted
 * @param {() => number} [options.random=Math.random] the single injectable
 *   source both halves of the draw read; a pinned one replays one placement
 * @returns {{board: import('./sim/board.js').Board,
 *   placements: Array<{name: string, num: number, x: number, y: number, direction: string}>,
 *   botNames: string[]}}
 */
function drawOpeningRoster({ botCount = DEFAULT_BOT_COUNT, random = Math.random } = {}) {
    const board = new Board(BOARD_SIZE, BOARD_SIZE);
    const bots = botNames(botCount);
    const placements = [];

    [PLAYER_NAME, ...bots].forEach((name, index) => {
        // The player keeps #1 and the bots count upward: `num` drives the hull
        // colour and the number painted on it.
        const cell = board.pickFreeCell({ random });
        if (cell === null) {
            // Unreachable by construction: at most five tanks on 144 cells, so
            // the last draw still sees 140 free ones. Throwing names the broken
            // invariant instead of quietly stacking two tanks on one cell.
            throw new Error(`no free cell left for ${name} on a ${board.width}x${board.height} board`);
        }
        const direction = pickRandomDirection(random);
        board.placeTank(cell.x, cell.y, name);
        placements.push({ name, num: index + 1, x: cell.x, y: cell.y, direction });
    });

    return { board, placements, botNames: bots };
}

/** One tank entry, mirroring `game/robot.py::to_dict` + `phase`. */
function createTank({ name, num, x, y, direction }) {
    return {
        id: name,
        num,
        x,
        y,
        direction,
        hp: MAX_HP,
        lives: MAX_LIVES,
        alive: true,
        kills: 0,
        // 'alive' | 'dead' | 'eliminated' — engine.py::tank_phase
        phase: 'alive',
        shielded_this_step: false,
        actions: [],
        items: {
            shield: false,
            auto_laser: false,
            bomb: false,
            xcross: false,
            blast_charges: 2
        }
    };
}

/**
 * Empty arena. No walls, no pits, no lasers, no conveyors for T1: the air
 * maps of §1 declare none of them, and T2 owns board contents.
 */
function createBoard() {
    return {
        width: BOARD_SIZE,
        height: BOARD_SIZE,
        cells: [],
        rotors: [],
        conveyors: [],
        repulsors: [],
        lasers: [],
        laser_walls: [],
        laser_beams: []
    };
}

/**
 * Standings row for `components.js::renderScoreboardList`
 * ({display, wins, kills}). Demo-local: there is no database and no
 * persistence (explicitly out of scope); T7 refreshes it as matches end.
 */
function createStandings(tanks) {
    return Object.values(tanks).map((t) => ({
        display: t.id,
        wins: 0,
        kills: t.kills
    }));
}

/**
 * Builds the opening `state.gameState` plus the identity the client uses
 * to address the player's tank inside `gameState.tanks`.
 *
 * The roster comes from {@link drawOpeningRoster}, the same draw
 * {@link createMatch} uses, so the DOM-contract seed can never describe a
 * match the demo would not play. Only the SHAPE differs: these are plain
 * objects with a scoreboard, for the modules that read `state.gameState`
 * without a simulation behind it.
 *
 * @param {object} [options] as {@link createMatch}
 * @returns {{gameState: object, playerName: string, playerNum: number}}
 */
export function createInitialGameState(options = {}) {
    const { placements } = drawOpeningRoster(options);

    const tanks = {};
    for (const placement of placements) tanks[placement.name] = createTank(placement);

    const rosterSize = placements.length;

    return {
        gameState: {
            state: 'programming',
            round: 1,
            // The demo has no timers at all, so there is nothing to count
            // down. renderer.js falls back to "0s" on the (hidden) bar.
            remaining_time: 0,
            total_time: 0,
            map_name: 'Local Demo',
            board: createBoard(),
            tanks,
            alive_count: rosterSize,
            total_count: rosterSize,
            // No lobby, no waiting room (out of scope).
            waiting_room: [],
            scoreboard: createStandings(tanks),
            fx: []
        },
        playerName: PLAYER_NAME,
        playerNum: 1
    };
}

/**
 * Builds a real match for T7b's controller: the simulation `Board` plus the
 * `Tank` registry, with the drawn opening roster already placed on it.
 *
 * `createInitialGameState` above stays the T1 seed (plain objects, with a
 * scoreboard) used by the seed/DOM contract test; this factory is what the
 * live demo drives, projected through `view.js`.
 *
 * @param {object} [options]
 * @param {number} [options.botCount=DEFAULT_BOT_COUNT] how many bots fill the
 *   roster besides the player; clamped, because the winner modal feeds it from
 *   the DOM
 * @param {() => number} [options.random=Math.random] the injectable draw
 * @returns {{
 *   board: import('./sim/board.js').Board,
 *   tanks: Map<string, import('./sim/tank.js').Tank>,
 *   playerName: string,
 *   playerNum: number,
 *   botNames: string[]
 * }}
 */
export function createMatch(options = {}) {
    const { board, placements, botNames: bots } = drawOpeningRoster(options);

    /** @type {Map<string, import('./sim/tank.js').Tank>} */
    const tanks = new Map();
    for (const placement of placements) {
        const { name, num, x, y, direction } = placement;
        tanks.set(name, new Tank(name, num, x, y, direction));
    }

    return { board, tanks, playerName: PLAYER_NAME, playerNum: 1, botNames: bots };
}

/**
 * The sidebar key -> simulation action name map, port of
 * `game/commands.py::VALID_COMMANDS`.
 * @type {Readonly<Record<string, string>>}
 */
export const KEY_TO_ACTION = Object.freeze({
    W: 'forward',
    S: 'back',
    A: 'turn_left',
    D: 'turn_right',
    Q: 'laser',
    E: 'blast',
    Z: 'turbo'
});

/**
 * `game/commands.py::TURBO_DIR_MAP`: the key a `Z` may be glued to, and the
 * directional turbo action it becomes. The suffix (`_2`, `_3`, ...) is
 * `z_count + 1`, added by {@link _applyTurboDirection}.
 * @type {Readonly<Record<string, string>>}
 */
const TURBO_DIR_MAP = Object.freeze({
    W: 'turbo_forward',
    S: 'turbo_back',
    A: 'turbo_left',
    D: 'turbo_right'
});

/** The keys that complete a turbo rewrite, `game/commands.py::DIRECTION_COMMANDS`. */
const DIRECTION_COMMANDS = new Set(['W', 'A', 'S', 'D']);

/**
 * Turns a key sequence into the turbo-directional program the simulation
 * plays. Literal port of `game/commands.py::_apply_turbo_direction`, exported
 * so `tests/test_commands.py::TestTurboDirection` can be ported vector by
 * vector.
 *
 * The rule (the load-bearing one this demo shipped without):
 *
 *   * a run of `zCount` `Z`s followed by a direction key becomes `zCount`
 *     empty placeholders plus ONE `turbo_<dir>_<zCount + 1>` jump, which
 *     moves `zCount + 1` cells WITHOUT turning,
 *   * a single trailing `Z` stays a `Z`, so it keeps charging `turbo_stack`,
 *   * a run of 2+ `Z`s with no direction rewrites to placeholders plus a
 *     `turbo_forward_<zCount>` forward jump,
 *   * every other key passes through unchanged.
 *
 * The result mixes key tokens (`W`, `Q`, `Z`) with turbo action names, which
 * is exactly what the Python returns; {@link parseCommandKeys} maps the keys
 * afterwards.
 *
 * @param {string[]} actions key tokens, in written order
 * @returns {string[]} key tokens and turbo action names, same length as input
 */
export function _applyTurboDirection(actions) {
    /** @type {string[]} */
    const result = [];
    let i = 0;
    while (i < actions.length) {
        const a = actions[i];
        if (a === 'Z') {
            let zCount = 0;
            while (i + zCount < actions.length && actions[i + zCount] === 'Z') zCount += 1;
            i += zCount;
            if (i < actions.length && DIRECTION_COMMANDS.has(actions[i])) {
                const turboName = TURBO_DIR_MAP[actions[i]];
                const steps = zCount + 1;
                for (let k = 0; k < zCount; k++) result.push('turbo_placeholder');
                result.push(`${turboName}_${steps}`);
                i += 1;
            } else if (zCount === 1) {
                result.push('Z');
            } else {
                for (let k = 0; k < zCount - 1; k++) result.push('turbo_placeholder');
                result.push(`turbo_forward_${zCount}`);
            }
        } else {
            result.push(a);
            i += 1;
        }
    }
    return result;
}

/**
 * Translates the string `ui.js` accumulates (`WASD`, `QEZ`...) into the sim's
 * action vocabulary, dropping anything unmapped (X, C and junk).
 *
 * The turbo rewrite runs FIRST, exactly as in `parse_message`: the key
 * sequence is transformed, then the result is mapped to action names, then
 * trimmed to `MAX_ACTIONS`. Doing the trim first would silently drop a jump
 * whose charge sits at the boundary (`QQQQQZD`).
 *
 * @param {string|null|undefined} commands the joined sidebar keys
 * @returns {string[]} sim action names, in written order
 */
export function parseCommandKeys(commands) {
    /** @type {string[]} */
    const keys = [];
    for (const key of String(commands ?? '').toUpperCase()) {
        if (KEY_TO_ACTION[key]) keys.push(key);
    }
    return _applyTurboDirection(keys)
        // `?? entry` keeps the turbo action names the rewrite produced.
        .map((entry) => KEY_TO_ACTION[entry] ?? entry)
        .slice(0, MAX_ACTIONS);
}