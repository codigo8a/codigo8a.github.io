// ─── The board: a dense square grid of cells ─────────────────────────
//
// Port of `game/board.py`, scoped to what the demo needs (T2). No DOM,
// no canvas, no imports at all: the simulation has to stay loadable under
// `node --test`, and `web/static/js/constants.js` is exactly the kind of
// module that cannot be (it touches CanvasRenderingContext2D.prototype at
// module scope).
//
// docs/RULES.md §1, VIVO only:
//   * the board is SQUARE, 12x12 on both air maps,
//   * one tank per cell,
//   * there is NO edge wall. The edge is the absence of a cell; walking off
//     it is a fall, not a bounce (see `sim/movement.js`),
//   * there are no fixed spawn points: a tank may appear on any free cell
//     (§7.2), which is why this module exposes free-cell selection.
//
// Deliberately absent, per "Deliberate exclusions: DORMIDO mechanics" in
// odd/tasks/demo-itch-io.md: pits, conveyors, rotors, map lasers and the
// repulsor. No map on air enables any of them (both declare `walls: []`
// and `items: []`), so the code would be unreachable. `CellType.WALL` is
// KEPT even though `arena` declares none: it is two lines and it guards
// the push contract ("no push against a wall") and the laser contract
// ("stops at a WALL").
//
// `CellType` string values are the transport for the renderer: the cells
// this board exports carry `t`, and `web/static/js/renderer.js::drawBoard`
// matches those strings (`c.t === 'repulsor'`, and the same for conveyor
// directions) as its fallback for board views that omit the `repulsors` /
// `conveyors` collections. Keeping the values identical to Python is what
// makes that fallback work by construction (feature risk R4).

/** @typedef {{x: number, y: number}} Cell */

/** @typedef {{type: string, tankId: string|null}} BoardCell */

/**
 * `game/board.py::CellType`, minus every DORMIDO member. A cell's `type`
 * keeps its Python string value so a board view is renderer-compatible.
 */
export const CellType = Object.freeze({
    /** An ordinary walkable cell. */
    EMPTY: 'empty',
    /** The only terrain that refuses tanks. Unused on air maps, kept for §5.1. */
    WALL: 'wall'
});

/** docs/RULES.md §1: the air maps are 12x12. */
export const BOARD_SIZE = 12;

/**
 * Storage key for a coordinate pair. Kept out of the public surface so
 * callers cannot depend on how the grid is indexed.
 * @param {number} x
 * @param {number} y
 * @returns {string}
 */
function key(x, y) {
    return `${x},${y}`;
}

/**
 * The arena: a dense rectangular grid of cells plus the tank reference
 * each cell carries.
 *
 * Port of `game/board.py::Board` minus the DORMIDO helper methods.
 */
export class Board {
    /**
     * @param {number} [width=BOARD_SIZE]
     * @param {number} [height=BOARD_SIZE]
     */
    constructor(width = BOARD_SIZE, height = BOARD_SIZE) {
        this.width = width;
        this.height = height;
        /** @type {Map<string, BoardCell>} dense: every in-bounds pair has a cell */
        this.cells = new Map();
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                this.cells.set(key(x, y), { type: CellType.EMPTY, tankId: null });
            }
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean} whether (x, y) names a cell of this board
     */
    inBounds(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {BoardCell|null} null off-board: the edge is the absence of a cell
     */
    getCell(x, y) {
        return this.cells.get(key(x, y)) ?? null;
    }

    /**
     * Replaces the terrain of a cell, clearing any tank reference with it.
     * Off-board writes are silently dropped, as in `Board.set_cell`.
     * @param {number} x
     * @param {number} y
     * @param {string} type one of {@link CellType}
     * @returns {void}
     */
    setCell(x, y, type) {
        if (!this.inBounds(x, y)) return;
        this.cells.set(key(x, y), { type, tankId: null });
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean} whether a tank may stand here: in bounds, not a WALL, unoccupied
     */
    isWalkable(x, y) {
        const cell = this.getCell(x, y);
        if (cell === null) return false;
        return cell.type !== CellType.WALL && cell.tankId === null;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    hasTank(x, y) {
        const cell = this.getCell(x, y);
        return cell !== null && cell.tankId !== null;
    }

    /**
     * Puts `tankId` on a cell. Like `Board.place_tank` this OVERWRITES an
     * occupied cell; only {@link Board#moveTank} enforces one tank per cell.
     * @param {number} x
     * @param {number} y
     * @param {string} tankId
     * @returns {boolean} false when the cell is missing or not walkable terrain
     */
    placeTank(x, y, tankId) {
        const cell = this.getCell(x, y);
        if (cell === null || cell.type === CellType.WALL) return false;
        cell.tankId = tankId;
        return true;
    }

    /**
     * Clears the tank reference of a cell, leaving the terrain alone.
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    removeTank(x, y) {
        const cell = this.getCell(x, y);
        if (cell !== null) cell.tankId = null;
    }

    /**
     * Moves the tank reference from one cell to another.
     * @param {number} fx source x
     * @param {number} fy source y
     * @param {number} tx target x
     * @param {number} ty target y
     * @returns {boolean} false when either cell is missing, the source is
     *   empty, or the target is a WALL or occupied — the §1 one-tank rule.
     */
    moveTank(fx, fy, tx, ty) {
        const src = this.getCell(fx, fy);
        const dst = this.getCell(tx, ty);
        if (src === null || dst === null) return false;
        if (src.tankId === null) return false;
        if (dst.type === CellType.WALL || dst.tankId !== null) return false;
        dst.tankId = src.tankId;
        src.tankId = null;
        return true;
    }

    /**
     * Whether a tank may APPEAR here (docs/RULES.md §7.2: no spawn points).
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isFree(x, y) {
        const cell = this.getCell(x, y);
        return cell !== null && cell.type === CellType.EMPTY && cell.tankId === null;
    }

    /**
     * Every cell a tank may appear in, in x-major order so a seeded draw
     * is reproducible.
     * @returns {Cell[]}
     */
    freeCells() {
        const out = [];
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.isFree(x, y)) out.push({ x, y });
            }
        }
        return out;
    }

    /**
     * Draws a cell for a tank to appear in, preferring one other than the
     * cell of death (docs/RULES.md §7.2).
     *
     * Port of `Engine._respawn_tank`'s selection. The cell of death is
     * **excluded outright**: the Python filters it out of the candidate
     * comprehension and has no fallback, so when nothing else is free the
     * result is empty and the tank is queued for respawn instead of being
     * handed its own death cell back.
     *
     * @param {object} [options]
     * @param {Cell|null} [options.avoid] the cell of death, if any; excluded
     * @param {() => number} [options.random] draw in [0, 1); injectable for tests
     * @returns {Cell|null} null when no free cell remains, or only the avoided one does
     */
    pickFreeCell({ avoid = null, random = Math.random } = {}) {
        const free = this.freeCells();
        const available = avoid === null ? free : free.filter((c) => c.x !== avoid.x || c.y !== avoid.y);
        if (!available.length) return null;
        return available[Math.floor(random() * available.length)];
    }
}