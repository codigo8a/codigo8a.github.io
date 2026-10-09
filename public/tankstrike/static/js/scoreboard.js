// ─── ScoreBoard (espejo del servidor) ──────────────────────────
// La tabla vive en el back (game/scoreboard.py → data/scoreboard.json)
// y llega al front por evento "scoreboard" + snapshot en game_state.
// Este módulo es solo el espejo en memoria que renderiza el sidebar.

let current = [];

function norm(name) {
    return String(name || '')
        .trim()
        .toLowerCase();
}

export function setScoreboard(list) {
    current = Array.isArray(list) ? list : [];
}

export function getScore(name) {
    const key = norm(name);
    if (!key) return null;
    return current.find((e) => norm(e.display) === key) || null;
}

// Compat con llamadas existentes: top ya ordenado desde el server.
export function topScore() {
    return current;
}

export const scoreboard = { top: topScore, get: getScore };
