// ─── DOM References ────────────────────────────────────────
// Deferred to init-time — no parse-time DOM access.

let refs = {};

export function getRefs() {
    refs = {
        canvas: document.getElementById('game-canvas'),
        ctx: document.getElementById('game-canvas').getContext('2d'),
        playPanel: document.getElementById('play-panel'),
        playBtn: document.getElementById('play-btn'),
        accountAnon: document.getElementById('account-anon'),
        accountMe: document.getElementById('account-me'),
        accountName: document.getElementById('account-name'),
        accountIdentifier: document.getElementById('account-identifier'),
        playerSection: document.getElementById('player-section'),
        commandsSection: document.getElementById('commands-section'),
        lobbyPanel: document.getElementById('lobby-panel'),
        lobbyList: document.getElementById('lobby-list'),
        lobbyCount: document.getElementById('lobby-count'),
        commandDisplay: document.getElementById('command-display'),
        sendBtn: document.getElementById('send-btn'),
        clearBtn: document.getElementById('clear-btn'),
        cmdW: document.getElementById('cmd-w'),
        cmdA: document.getElementById('cmd-a'),
        cmdS: document.getElementById('cmd-s'),
        cmdD: document.getElementById('cmd-d'),
        cmdQ: document.getElementById('cmd-q'),
        cmdE: document.getElementById('cmd-e'),
        cmdZ: document.getElementById('cmd-z'),
        cmdX: document.getElementById('cmd-x'),
        cmdC: document.getElementById('cmd-c'),
        playersList: document.getElementById('players-list'),
        scoreList: document.getElementById('score-list'),
        playerCount: document.getElementById('player-count'),
        playerInfo: document.getElementById('player-info'),
        playerNameHeader: document.getElementById('player-name-header'),
        myTankName: document.getElementById('my-tank-name'),
        editNameBtn: document.getElementById('edit-name-btn'),
        editNamePrefix: document.getElementById('edit-name-prefix'),
        editNameInput: document.getElementById('edit-name-input'),
        cancelNameBtn: document.getElementById('cancel-name-btn'),
        nameError: document.getElementById('name-error'),
        roundLabel: document.getElementById('round-label'),
        timerFill: document.getElementById('timer-fill'),
        timerText: document.getElementById('timer-text'),
        winnerModal: document.getElementById('winner-modal'),
        winnerName: document.getElementById('winner-name'),
        winnerModalContent: document.querySelector('#winner-modal .modal-content')
    };
    return refs;
}

export function getRefsObj() {
    return refs;
}
