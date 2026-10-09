// ─── TankStrike itch.io demo — entry point ──────────────────────────
//
// The demo is the EXISTING web client wired to a LOCAL simulation instead of
// a server. Everything under ../static/ is imported read-only; nothing there
// is modified, copied or re-implemented. `socket.js` is deliberately NOT
// imported: the demo makes no network call of any kind, so it runs with zero
// server and zero network dependency.
//
// T1 proved the wiring. T2-T6 built the simulation under `sim/` and T7a built
// the projection under `view.js`. T7b (this task) is the browser integration:
//
//   * one `requestAnimationFrame` loop drives the page; the round's six step
//     beats are replayed through the reused `animation.js` (whose own timers
//     are the reused module's, per R3, not the demo's loop),
//   * a round resolves when the player executes, OR automatically when the
//     25-second round countdown reaches zero; the countdown is driven by the
//     same rAF loop through `components.js::startTopTimerFluid`, so the demo
//     still introduces no `setTimeout`,
//   * `state.animating` gates the controls during playback,
//   * the winner modal carries a "Play again" button that rebuilds the match,
//     and the bot-count picker below it that the next match is built with. The
//     start gate carries the SAME picker, in a second copy, over the same one
//     module-level selection — see {@link selectBotCount},
//   * a bot that throws still submits a patrol plan instead of stalling.
//   * the demo opens on a start gate: the board is already painted behind a
//     modal, but nothing runs until PLAY — see {@link beginMatch}.
//
// It also lands the fixes earlier tasks deferred here: H4/H5 (the import
// graph and the duplicated constants), H13 (an empty beat list is the
// no-winner case), R2 (`refreshInputsEnabled` after every round), R5 (clear
// the shared submit channel), R6 (sound on a gesture) and H8 (the two HUD
// strings).

import { state } from '../static/js/state.js';
import { getRefs } from '../static/js/refs.js';
import { render } from '../static/js/renderer.js';
import { initUI, setInputsDisabled, refreshInputsEnabled } from '../static/js/ui.js';
import { setupCanvas } from '../static/js/layout.js';
import {
    showWinnerModal,
    hideWinnerModal,
    showPlayerUI,
    startTopTimerFluid,
    stopTopTimerFluid,
    correctTopTimerFluid,
    setTopTimerText
} from '../static/js/components.js';
import { sound } from '../static/js/sound.js';
import { startAnimation, playNextFrame, finishAnimation } from '../static/js/animation.js';
import { loadSprites } from './sprite-loader.js';
import { DEFAULT_BOT_COUNT, clampBotCount, createMatch, parseCommandKeys } from './initial-state.js';
import { ROUND_STEPS, Round, VictoryStatus } from './sim/round.js';
import { decideActions, fallbackPatrolActions } from './sim/bots.js';
import { MAX_ACTIONS } from './sim/tank.js';
import { projectFrame, projectGameState } from './view.js';

/**
 * The demo's round length, in seconds.
 *
 * The canonical game uses `PROGRAMMING_TIME = 15` plus a 5-second grace
 * (`game/timers.py`). The demo ran 10 seconds until the human asked for 15 more
 * on top of it, so it now runs 25; the deviation is recorded in
 * `odd/tasks/demo-itch-io.md`.
 *
 * Fixed: Now uses 15 seconds to match the canonical game's PROGRAMMING_TIME.
 */
const ROUND_SECONDS = 15;

/** @type {object|null} resolved once at boot, reused by the frame loop */
let refs = null;

/** @type {{board: object, tanks: Map<string, object>, playerName: string, playerNum: number, botNames: string[]}|null} */
let match = null;

/** @type {Round|null} the current match's round executor */
let round = null;

/**
 * Non-null while a round's beats are playing back. Holds the outcome the
 * round already decided, shown once `state.animating` drops.
 * @type {{victory: object|null}|null}
 */
let pending = null;

/** Render request flag: repaint only when the state actually changed. */
let needsRender = false;

/**
 * Whether the player has pressed PLAY.
 *
 * The demo boots with the match BUILT but inert: the board paints behind the
 * start modal, so the first screen is not a black rectangle, yet the countdown
 * is un-armed, the controls are disabled and {@link submitRound} refuses
 * every call. Gating the submit rather than only the buttons matters because
 * the countdown's own auto-execute and the `#send-btn` listener both reach
 * `submitRound` without touching a button.
 *
 * Only PLAY flips it, and only once; `resetMatch` ("Play again") deliberately
 * leaves it set, so a rematch never re-opens the gate.
 * @type {boolean}
 */
let started = false;

/**
 * The round countdown.
 *
 * `deadline` is a `performance.now()` timestamp, not a scheduled callback: the
 * frame loop compares the clock, so the countdown adds no `setTimeout`. The
 * bar itself drains through the reused fluid helper.
 *
 * `pendingArm` defers the start by one frame on purpose: `renderer.js::updateUI`
 * zeroes and cancels the shared top timer on every render, and the round-start
 * render must run first, so the countdown is armed AFTER it.
 *
 * `lastPlayed` tracks the last second at which the countdown sound was played
 * to avoid replaying it multiple times per second.
 *
 * @type {{total: number, deadline: number, armed: boolean, pendingArm: boolean, lastPlayed: number|null}}
 */
const countdown = { total: ROUND_SECONDS, deadline: 0, armed: false, pendingArm: false, lastPlayed: null };

/**
 * How many bots the pickers currently mark, and therefore how many the next
 * {@link resetMatch} — and a first {@link beginMatch} — builds.
 *
 * It starts at {@link DEFAULT_BOT_COUNT} because the gate boots the match
 * behind it with the default roster, so a player who never touches a picker is
 * never asked to configure anything.
 *
 * There are TWO copies of the picker (the winner modal and the start gate) and
 * this ONE value behind both: {@link selectBotCount} re-marks every copy, so
 * the two screens can never disagree about what the player picked.
 *
 * @type {number}
 */
let selectedBotCount = DEFAULT_BOT_COUNT;

/**
 * EVERY copy of the bot-count picker, resolved once at boot.
 *
 * `refs.js` is read-only and resolves no picker, so this is the demo's own
 * lookup, null-tolerant like {@link startModal}: a missing picker must degrade
 * to "nothing to mark", never to a boot-time crash. An EMPTY array is that
 * degradation — every loop below iterates over copies, so "no picker" is a
 * zero-length loop rather than a special case.
 * @type {HTMLElement[]}
 */
let botCountPickers = [];

/**
 * Marks one bot count as the current choice, in the DOM and on the module.
 *
 * The mark is both visual (the `selected` class) and announced
 * (`aria-pressed`), it is cleared from the siblings because the row is one
 * single-choice set, and it is written to EVERY copy of the picker so the
 * winner modal and the start gate stay in lockstep behind the one
 * {@link selectedBotCount}.
 *
 * Nothing else happens here on purpose: choosing a count is not starting a
 * match — "Play again" and PLAY are the controls that build one.
 *
 * @param {number} count any value; clamped, because it came from the DOM
 * @returns {void}
 */
function selectBotCount(count) {
    selectedBotCount = clampBotCount(count);
    for (const picker of botCountPickers) {
        for (const button of picker.querySelectorAll('[data-bot-count]')) {
            const marked = Number(button.dataset.botCount) === selectedBotCount;
            button.classList.toggle('selected', marked);
            button.setAttribute('aria-pressed', marked ? 'true' : 'false');
        }
    }
}

/** @returns {void} */
function markDirty() {
    needsRender = true;
}

/**
 * Stops the round countdown. Called when a round is submitted (button or
 * auto-execute) and when the match ends.
 * @returns {void}
 */
function stopCountdown() {
    stopTopTimerFluid();
    countdown.armed = false;
    countdown.pendingArm = false;
    countdown.lastPlayed = null;
}

/**
 * Arms the round countdown for the current programming phase.
 *
 * The frame loop starts the fluid drain on its next pass, after the render
 * that `startNextRound`/boot scheduled. Passing a shorter `seconds` is the
 * browser test's seam; in play it is always {@link ROUND_SECONDS}.
 * @param {number} [seconds=ROUND_SECONDS]
 * @returns {void}
 */
function armCountdown(seconds = ROUND_SECONDS) {
    stopTopTimerFluid();
    countdown.total = seconds;
    countdown.deadline = 0;
    countdown.armed = false;
    countdown.pendingArm = true;
    countdown.lastPlayed = null;
}

/**
 * @returns {number} seconds left on the countdown, 0 when it is not armed
 */
function countdownRemaining() {
    if (!countdown.armed) return 0;
    return Math.max(0, (countdown.deadline - performance.now()) / 1000);
}

/**
 * Advances the round countdown. Runs every frame; no callback, no timer.
 *
 * At zero the round executes automatically, whether or not the player pressed
 * anything. The submit goes through {@link submitRound} with `force`, which
 * clears the player's action buffer exactly like the button path — without
 * that clear, `startRound`'s deliberate failure to reset the buffer (H10)
 * would replay the previous round's program.
 * @returns {void}
 */
function tickCountdown() {
    if (countdown.pendingArm) {
        countdown.pendingArm = false;
        countdown.armed = true;
        countdown.deadline = performance.now() + countdown.total * 1000;
        startTopTimerFluid(refs, countdown.total);
        setTopTimerText(refs, countdown.total);
        console.log('[tickCountdown] countdown armed, deadline in', countdown.total, 'seconds');
    }
    if (!countdown.armed || state.animating || pending) return;

    const remaining = countdownRemaining();
    // A stray render (e.g. the sprite loader marking the page dirty) cancels
    // the shared timer and zeroes the bar. Restore the drain from the real
    // remaining time; the auto-execute below is clock-driven, not bar-driven.
    if (remaining > 0 && refs.timerFill && refs.timerFill.style.width === '0%') {
        correctTopTimerFluid(refs, remaining, countdown.total);
    }
    setTopTimerText(refs, remaining);

    // Play countdown sound at 3, 2, 1 seconds
    const remainingCeil = Math.ceil(remaining);
    if (remainingCeil <= 3 && remainingCeil > 0 && remainingCeil !== countdown.lastPlayed) {
        sound.play('countdown');
        countdown.lastPlayed = remainingCeil;
    }

    if (remaining <= 0) {
        console.log('[tickCountdown] countdown reached zero, auto-executing');
        submitRound(state.myCommands, { force: true });
        countdown.lastPlayed = null;
    }
}

/**
 * Logs every ref that refs.js could not resolve. Several reused modules
 * dereference those refs without a null check, so this is the first place
 * to look when the demo misbehaves.
 * @param {object} resolved
 * @returns {void}
 */
function reportMissingRefs(resolved) {
    const missing = Object.keys(resolved).filter((k) => k !== 'ctx' && !resolved[k]);
    if (missing.length) console.warn('[demo] refs.js could not resolve:', missing.join(', '));
    else console.log('[demo] all refs resolved successfully');
}

/**
 * Re-locks the two dead command keys after a `refreshInputsEnabled` call.
 *
 * `ui.js::setInputsDisabled` is read-only and re-enables every command button
 * — including the bomb (`X`) and shield (`C`) — whenever the round is
 * programmable, so the `disabled` attribute in `index.html` does not survive
 * boot or a new round. The demo has neither action (`ui.js::addCmd` drops both
 * keys), so they must be genuinely disabled, not merely dimmed: setting the
 * property restores the attribute too, which is what keeps them unfocusable
 * and announced as unavailable by assistive tech. `getRefsObj()` exposes the
 * same objects as the `refs` resolved here, so this locks the live buttons.
 * @param {object} resolved refs
 * @returns {void}
 */
function lockDeadKeys(resolved) {
    if (!resolved) return;
    for (const key of ['cmdX', 'cmdC']) {
        const btn = resolved[key];
        if (!btn) continue;
        btn.disabled = true;
        btn.setAttribute('disabled', '');
    }
}

/**
 * AudioContext starts suspended until a real user gesture, so sound is
 * armed on the first interaction rather than at boot (R6).
 * @returns {void}
 */
function armSoundOnFirstGesture() {
    const arm = () => {
        sound.init();
        window.removeEventListener('pointerdown', arm);
        window.removeEventListener('keydown', arm);
    };
    window.addEventListener('pointerdown', arm);
    window.addEventListener('keydown', arm);
}

/**
 * Projects the current match into the shape the reused modules read.
 * @param {string} phase 'programming' or 'executing'
 * @returns {object}
 */
function projectCurrent(phase) {
    return projectGameState({
        board: match.board,
        tanks: match.tanks,
        round: round.roundNum,
        state: phase
    });
}

/**
 * A bot's plan for one round, guaranteed non-empty.
 *
 * `decideActions` already folds in `BotRunner`'s fallback (H14); this outer
 * belt is the task's explicit requirement that no internal error can ever
 * stall the round. If even the patrol plan throws, it degrades to a full
 * laser plan.
 *
 * @param {object} bot a sim Tank
 * @returns {string[]}
 */
function decideBot(bot) {
    try {
        return decideActions(bot, round);
    } catch {
        try {
            return fallbackPatrolActions(bot, round);
        } catch {
            return Array.from({ length: MAX_ACTIONS }, () => 'laser');
        }
    }
}

/**
 * Consumes the round the player just queued and kicks its playback.
 *
 * R5: `state.myCommands` is the shared channel between `ui.js` and the
 * transport. It is read, cleared and the sidebar reset here — exactly what
 * `socket.js` does — so an empty submit can never replay the previous round.
 *
 * Before PLAY this is a pure no-op and returns `false`: the guard sits ABOVE
 * the channel clear, so a refused submit consumes nothing and cannot leave a
 * half-cleared plan behind.
 *
 * @param {string} commands the joined sidebar keys
 * @param {object} [options]
 * @param {boolean} [options.force=false] submit even when `commands` is empty.
 *   The countdown's auto-execute needs this: an idle player still ends the
 *   programming phase, and forcing runs `player.setActions([])`, which is what
 *   clears the buffer `startRound` deliberately keeps (H10).
 * @returns {boolean} whether a round was submitted
 */
export function submitRound(commands, { force = false } = {}) {
    console.log('[submitRound] called, started:', started, 'force:', force, 'commands:', commands, 'state.myCommands:', state.myCommands);
    if (!started) {
        console.warn('[submitRound] not started, ignoring');
        return false;
    }

    const queued = commands ?? state.myCommands ?? '';
    state.myCommands = '';
    if (state.resetCommands) state.resetCommands();

    // Locked while the six steps play back; `pending` covers the one-frame
    // gap between the last beat and the frame-loop finalize.
    if (state.animating || pending) {
        console.log('[submitRound] animating or pending, ignoring');
        markDirty();
        return false;
    }
    if (!queued && !force) {
        console.log('[submitRound] no commands and not forced, ignoring');
        markDirty();
        return false;
    }

    const player = match.tanks.get(match.playerName);
    if (!player) {
        console.error('[submitRound] player not found');
        return false;
    }

    // The round is going: stop the countdown before anything else can fire it.
    stopCountdown();
    player.setActions(parseCommandKeys(queued));
    for (const name of match.botNames) {
        const bot = match.tanks.get(name);
        if (bot) bot.setActions(decideBot(bot));
    }

    // The beat is yielded AFTER its step executed, so the projection taken
    // here is exactly the state that step produced.
    const frames = [];
    let victory = null;
    for (const beat of round.iterSteps()) {
        if (beat.phase === 'step') {
            frames.push(
                projectFrame({
                    beat,
                    gameState: projectCurrent('executing'),
                    index: frames.length,
                    total: ROUND_STEPS
                })
            );
        } else if (beat.phase === 'end') {
            victory = beat.victory;
        }
    }

    console.log('[submitRound] frames generated:', frames.length, 'victory:', victory);

    if (frames.length === 0) {
        // H13: `iterSteps` returns before its first beat when no tank holds
        // lives. No beats with an `ongoing` status is the no-winner case, not
        // a match in progress — resolve it as a draw instead of stalling.
        finishRound(null);
        return true;
    }

    pending = { victory };
    startAnimation(frames.length);
    state.animationFrames = frames;
    playNextFrame();
    return true;
}

/**
 * Settles a finished round: end the match or open the next one.
 *
 * The decision uses the victory the round's closing beat reported. Only
 * `ONGOING` continues; a `null` victory is the H13 no-winner case.
 *
 * @param {object|null} victory a `VictoryOutcome`
 * @returns {void}
 */
function finishRound(victory) {
    pending = null;
    if (victory && victory.status === VictoryStatus.WIN) {
        endMatch(victory.winner);
    } else if (victory && victory.status === VictoryStatus.DRAW) {
        endMatch(null);
    } else if (victory === null) {
        endMatch(null);
    } else {
        startNextRound();
    }
}

/**
 * Opens the next round and re-enables the controls (R2). Without the refresh
 * the sidebar would stay locked forever, because `refreshInputsEnabled` has
 * no other caller once `socket.js` is not imported.
 * @returns {void}
 */
function startNextRound() {
    round.startRound();
    state.gameState = projectCurrent('programming');
    refreshInputsEnabled();
    lockDeadKeys(refs);
    armCountdown();
    markDirty();
}

/**
 * Ends the match: locks the controls and shows the reused winner modal.
 * @param {string|null} winnerName the winner's id, or null for a draw
 * @returns {void}
 */
function endMatch(winnerName) {
    stopCountdown();
    const winner = winnerName ? match.tanks.get(winnerName) : null;
    setInputsDisabled(refs, true);
    showWinner(refs, winnerName, winner ? winner.kills : 0);
    markDirty();
}

/**
 * Shows the winner modal through the reused component.
 *
 * `showWinnerModal` also builds the "Next Map" vote boxes, which need a
 * server; the demo has one map and no voting, so that block is hidden here
 * rather than in the shared component.
 *
 * The bot-count picker is re-marked from the match that just ENDED, so the
 * modal always opens on the count the player was actually playing and the
 * module state follows it. The component only rewrites the h2,
 * #winner-kills, #vote-boxes and #winner-sub, so the picker — placed after
 * #play-again-btn — survives every call untouched.
 *
 * @param {object} resolved refs
 * @param {string|null} name winner's display name, or null for a draw
 * @param {number} [matchKills=0]
 * @returns {void}
 */
export function showWinner(resolved, name, matchKills = 0) {
    sound.play('gameover');
    showWinnerModal(resolved, name, null, matchKills);
    const voting = resolved.winnerModal.querySelector('.vote-fieldset');
    if (voting) voting.style.display = 'none';
    // The finished match is the ground truth for the count, never the count
    // the picker happened to be left on.
    selectBotCount(match ? match.botNames.length : DEFAULT_BOT_COUNT);
}

/**
 * @param {object} resolved refs
 * @returns {void}
 */
export function hideWinner(resolved) {
    hideWinnerModal(resolved);
}

/**
 * Rebuilds the whole match: fresh board, fresh tanks, round 1.
 *
 * "Play again" must be a clean reset, so nothing from the previous match
 * survives: the animation state, the submit channel, the modal and the
 * simulation are all replaced. It is the ONE place a match is BUILT from
 * {@link selectedBotCount}, which is why choosing a count in either modal
 * cannot by itself restart anything, and why {@link beginMatch} routes a
 * non-default gate choice through here instead of building its own match.
 *
 * It deliberately leaves `started` set and the gate closed: a rematch is a
 * mid-session reset, not a new session, so the player must not have to press
 * PLAY again to play again.
 * @returns {void}
 */
export function resetMatch() {
    finishAnimation();
    hideWinner(refs);
    state.myCommands = '';
    if (state.resetCommands) state.resetCommands();
    pending = null;

    match = createMatch({ botCount: selectedBotCount });
    round = new Round({ board: match.board, tanks: match.tanks });
    round.startRound();

    state.myName = match.playerName;
    state.myNum = match.playerNum;
    state.gameState = projectCurrent('programming');

    refreshInputsEnabled();
    lockDeadKeys(refs);
    armCountdown();
    markDirty();
}

/**
 * The start modal, resolved once at boot.
 *
 * `refs.js` is read-only and resolves no gate element, so this is the demo's
 * own lookup, kept null-tolerant on purpose: a missing gate must degrade to
 * "nothing to show", never to a boot-time crash.
 * @type {HTMLElement|null}
 */
let startModal = null;

/**
 * Reveals the start gate — the demo's first screen.
 * @returns {void}
 */
function showStartGate() {
    if (startModal) startModal.classList.remove('hidden');
}

/**
 * Closes the start gate, leaving the board the player's whole screen.
 * @returns {void}
 */
function hideStartGate() {
    if (startModal) startModal.classList.add('hidden');
}

/**
 * Starts the match. This single function is what the start gate exists for.
 *
 * It makes the match already behind the modal LIVE: the flag, the gate, the
 * controls, the dead-key locks and the countdown. Idempotent by construction
 * (the `started` guard is the only other flip), so a double click or a test
 * driving both the button and the handle cannot re-arm the countdown from zero.
 *
 * ONE exception, and it is the load-bearing part: the boot match was built at
 * {@link DEFAULT_BOT_COUNT} so there is a real, painted board behind the gate.
 * When the gate's picker marks a DIFFERENT count, that roster is not the one
 * the player asked to play, so the match is rebuilt through
 * {@link resetMatch} — the one path that reads {@link selectedBotCount} — and
 * that call arms the countdown, enables the controls and repaints on its own.
 * When the count matches, nothing is rebuilt: the board behind the gate is
 * already the right match, and a full reset would throw away a real opening
 * draw for no reason.
 *
 * The gate is closed BEFORE the rebuild, because {@link resetMatch} only hides
 * the winner modal: without that ordering the rebuild could leave the start
 * modal open on top of a live match.
 *
 * Audio needs no handling here: this click IS the user gesture
 * {@link armSoundOnFirstGesture} has been waiting for.
 * @returns {void}
 */
export function beginMatch() {
    console.log('[beginMatch] called, started:', started);
    if (started) return;
    started = true;
    hideStartGate();
    if (match && match.botNames.length !== selectedBotCount) {
        console.log('[beginMatch] bot count changed, resetting match');
        resetMatch();
        return;
    }
    console.log('[beginMatch] calling refreshInputsEnabled');
    refreshInputsEnabled();
    lockDeadKeys(refs);
    armCountdown();
    markDirty();
    console.log('[beginMatch] match started, countdown armed');
}

/**
 * The single sim -> page seam the browser test drives.
 *
 * Exposed on `window` so `web/demo/test_e2e.py` can shorten a match without
 * fabricating its outcome: it still goes through `submitRound` and the real
 * victory check. `armCountdown`/`countdownRemaining` are the countdown seam, so
 * a test can observe the drain and the auto-execute without waiting ten real
 * seconds; `beginMatch`/`started` are the start-gate seam, so a test can drive
 * and observe the gate the same way. Nothing in the demo reads any of it.
 * @returns {void}
 */
function exposeTestHandle() {
    window.__tankstrikeDemo = {
        ready: true,
        state,
        get round() {
            return round;
        },
        get match() {
            return match;
        },
        get started() {
            return started;
        },
        get countdownRemaining() {
            return countdownRemaining();
        },
        armCountdown,
        beginMatch,
        submitRound,
        resetMatch
    };
}

/**
 * Boot: build the match, bind the controls and start the one loop.
 *
 * The match built HERE always takes {@link DEFAULT_BOT_COUNT}: the board behind
 * the start gate has to be real game state, and a player who lands on the page
 * is never asked to configure anything before seeing a round. That default is
 * not final — the gate's picker is bound below, and {@link beginMatch} rebuilds
 * the match if it marks another count when PLAY is pressed.
 * @returns {void}
 */
function startDemo() {
    console.log('[startDemo] starting demo');
    refs = getRefs();
    reportMissingRefs(refs);

    // State first: ui.js reads state.gameState.tanks[state.myName] on every
    // button click and refuses commands unless the player's tank is alive.
    match = createMatch();
    round = new Round({ board: match.board, tanks: match.tanks });
    round.startRound();

    state.gameState = projectCurrent('programming');
    state.myName = match.playerName;
    state.myNum = match.playerNum;
    state.socket = null;
    state.animating = false;

    // Rebinds the nine command buttons, the undo button and the name editor.
    state.resetCommands = initUI().resetCommands;

    // The demo has no claim gate, so the player panels are up from boot.
    showPlayerUI(refs);

    // Sizes the canvas to #game-area and renders the first frame.
    setupCanvas();

    // ui.js already binds #send-btn; it mirrors socket.js in stamping
    // state.myCommands first, so this listener sees the queued round. `force`
    // lets an empty Execute press end the programming phase early, the same
    // way the countdown does.
    refs.sendBtn.addEventListener('click', () => {
        console.log('[sendBtn] clicked, myCommands:', state.myCommands);
        submitRound(state.myCommands, { force: true });
    });

    const playAgain = document.getElementById('play-again-btn');
    if (playAgain) playAgain.addEventListener('click', resetMatch);

    // The start gate. It is built inert above (the round is in the programming
    // phase with the player alive, which is why the board behind it is real
    // game state and not a mock) and made live by `beginMatch` alone.
    startModal = document.getElementById('start-modal');
    if (startModal) {
        const startBtn = startModal.querySelector('#start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log('[startBtn] clicked');
                beginMatch();
            });
        }
    }

    // The bot-count pickers — BOTH copies, the winner modal's and the start
    // gate's, resolved by their shared class because one element cannot live in
    // two modals. One delegated listener per row instead of five on the
    // buttons: the count lives in `data-bot-count`, so the row is the only
    // thing that has to survive a markup change. A click only MARKS the
    // choice — `beginMatch` (on the gate) and `resetMatch` ("Play again") are
    // what read it. A page with no picker at all binds nothing and degrades to
    // "the default roster".
    botCountPickers = [...document.querySelectorAll('.bot-count-picker')];
    for (const picker of botCountPickers) {
        picker.addEventListener('click', (event) => {
            const button = event.target.closest('[data-bot-count]');
            if (button && picker.contains(button)) {
                selectBotCount(button.dataset.botCount);
            }
        });
    }
    // The shipped markup marks the default; restate it from the module so the
    // first match and every picker cannot disagree.
    selectBotCount(selectedBotCount);

    armSoundOnFirstGesture();

    // T8/R1: load the sprites through the demo's own relative loader. The
    // base is relative to THIS module, so it resolves to `demo/sprites/` in
    // the package regardless of the subpath the page is served from. The
    // loader fills the same `SPRITES` map renderer.js reads; the repaint on
    // completion is what switches the tanks from the vector fallback to
    // their sprite art.
    loadSprites(new URL('./sprites/', import.meta.url))
        .then(markDirty)
        .catch(() => {});

    // Gated boot: `refreshInputsEnabled` is deliberately NOT called here. It
    // would unlock the keyboard the moment the round exists, and the countdown
    // must not be armed either — both wait for `beginMatch`. Locking is
    // explicit so the reason is on the line that does the locking, and the
    // dead keys are re-locked through the same call every later round uses.
    setInputsDisabled(refs, true);
    lockDeadKeys(refs);
    exposeTestHandle();
    showStartGate();
    markDirty();
    requestAnimationFrame(frame);
    console.log('[startDemo] demo started, waiting for PLAY');
}

/**
 * The demo's single loop. No setTimeout, no interval, no thread: one
 * requestAnimationFrame chain for the whole page. It finalizes a round once
 * the reused playback has cleared `state.animating`, advances the round
 * countdown (and auto-executes it at zero), and repaints on demand.
 * @returns {void}
 */
function frame() {
    if (pending && !state.animating) {
        finishRound(pending.victory);
    }
    if (needsRender) {
        needsRender = false;
        render();
    }
    tickCountdown();
    requestAnimationFrame(frame);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startDemo);
} else {
    startDemo();
}
