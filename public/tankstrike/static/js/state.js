// ─── Shared State ──────────────────────────────────────────
// Mutable singleton — all shared state lives here.

export const state = {
    socket: null,
    gameState: null,
    myName: null,
    myNum: null,
    pendingClaim: false,
    myCommands: '',
    resetCommands: null,
    cellSize: 40,
    boardX: 0,
    boardY: 0,
    myVote: null,
    publicMaps: null,

    // Animation state
    animating: false,
    animationFrames: [],
    currentFrame: -1,
    animationTimer: null,
    animationSpeed: 750,

    // Movement transition state
    tankTransitions: {}, // {tankId: {fromX, fromY, toX, toY, startTime, duration}}
    tankRotations: {}, // {tankId: {fromAngle, toAngle, startTime, duration}}
    transitionRafId: null,
    currentFrameEffects: null,

    // Sprite state
    spritesLoaded: false,

    // Death animation state
    deathAnimFrame: 0,
    deathAnimTimer: null,
    deathAnimCallback: null,
    deathAnimActive: false,
    deathAnimX: 0,
    deathAnimY: 0,
    deathAnims: [], // [{x, y, frame, active}] — muertes simultáneas
    currentDeaths: [], // muertes del paso actual (para pre_death_hp)
    // Pit shrink (pozo) animation — tank falls into pit
    pitAnims: [], // [{x,y,num,direction,scale,active,tankId}]
    pitAnimTimer: null,
    pitAnimRaf: null,
    pitAnimActive: false
};
