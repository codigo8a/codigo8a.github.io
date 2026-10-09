// ─── Componentes compartidos ───────────────────────────────
// Única implementación de: modal de ganador, countdown, lista de
// jugadores, lobby de espera y colores de tanque. La usa `/`
// (página fusionada: espectador por defecto + jugador tras el claim).
// Estilos: web/static/components.css

import { TANK_COLORS } from './constants.js';
import { state } from './state.js';

/** Color estable del tanque según su número. */
export function tankColor(num) {
    return TANK_COLORS[(num - 1) % TANK_COLORS.length];
}

// ── Modal de ganador ───────────────────────────────────────

/**
 * Muestra el modal centrado en el viewport (pantalla), no en el tablero.
 * Asi no pierde el centro con mapas pequeños (RoboStrike 9x7) y es
 * responsive en celular/pc.
 */
export function showWinnerModal(refs, winner, lobbyTime = null, matchKills = 0, publicMaps = null) {
    refs.winnerName.textContent = winner ? `🏆 ${winner} 🏆` : '💀 DRAW! 💀';

    // Resolve public maps: explicit param wins, then state cache, then fallback
    const _maps = publicMaps || state.publicMaps || state.gameState?.public_maps || null;
    const _effective =
        _maps && Object.keys(_maps).length ? _maps : { basic: { name: 'Basic' }, robostrike: { name: 'RoboStrike' } };

    // Keep "¡GANADOR!" heading, remove the 🏆 emoji
    const heading = refs.winnerModal.querySelector('h2');
    if (heading) {
        heading.textContent = 'WINNER!';
    }

    // Kills de la partida (matchKills viene del game_over, NO del ScoreBoard
    // acumulado globalmente)
    let killsEl = refs.winnerModal.querySelector('#winner-kills');
    if (winner) {
        if (!killsEl) {
            killsEl = document.createElement('div');
            killsEl.className = 'winner-kills';
            killsEl.id = 'winner-kills';
            refs.winnerName.after(killsEl);
        }
        killsEl.textContent = `⚔ ${matchKills} ${matchKills === 1 ? 'kill' : 'kills'}`;
    } else if (killsEl) {
        killsEl.remove();
    }

    // ── Voting boxes (public maps only) ─────────────────────
    const contentRoot = refs.winnerModal.querySelector('.modal-content');
    let voteContainer = refs.winnerModal.querySelector('#vote-boxes');
    if (voteContainer) {
        voteContainer.innerHTML = '';
    } else {
        voteContainer = document.createElement('div');
        voteContainer.id = 'vote-boxes';
        voteContainer.className = 'vote-boxes';
    }
    // Caja fieldset: borde alrededor de los botones con la leyenda
    // "Próximo Mapa" montada en la línea superior (que se corta debajo
    // del texto). Idempotente entre partidas.
    let voteFieldset = refs.winnerModal.querySelector('.vote-fieldset');
    if (!voteFieldset) {
        voteFieldset = document.createElement('fieldset');
        voteFieldset.className = 'vote-fieldset';
        const legend = document.createElement('legend');
        legend.className = 'vote-legend';
        legend.textContent = 'Next Map';
        voteFieldset.appendChild(legend);
    }
    voteFieldset.appendChild(voteContainer);
    // Solo votan los jugadores registrados (el server rechaza el sid de un
    // espectador), así que a quien no tiene nombre no se le muestran las
    // cajas: solo le generarían "Voto no aceptado" por cada click.
    voteFieldset.style.display = state.myName ? '' : 'none';
    // Build boxes from _effective (already filtered to public)
    voteContainer.style.display = 'flex';
    for (const key of (state.myName ? Object.keys(_effective).sort() : [])) {
        const box = document.createElement('div');
        box.className = 'vote-box';
        if (state.myVote === key) box.classList.add('selected');
        box.dataset.map = key;
        const label = document.createElement('span');
        label.className = 'vote-label';
        label.textContent = key.toUpperCase();
        const badge = document.createElement('span');
        badge.className = 'vote-badge';
        badge.dataset.map = key;
        badge.textContent = '0';
        box.appendChild(label);
        box.appendChild(badge);
        box.addEventListener('click', () => {
            state.myVote = key;
            for (const b of voteContainer.querySelectorAll('.vote-box')) {
                b.classList.toggle('selected', b.dataset.map === key);
            }
            if (state.socket) {
                state.socket.emit('vote_map', { choice: key, map: key });
            }
        });
        voteContainer.appendChild(box);
    }

    // Centrado en viewport: limpiar cualquier posicion anclada al tablero
    const content = refs.winnerModalContent || refs.winnerModal.querySelector('.modal-content');
    refs.winnerModal.style.removeProperty('--modal-x');
    refs.winnerModal.style.removeProperty('--modal-y');
    if (content) content.style.fontSize = '';
    refs.winnerModal.classList.remove('hidden');

    // Tercera línea: siempre con texto + contador (nunca solo el número)
    if (lobbyTime !== null) {
        // Construcción por DOM (textContent), nunca innerHTML, para no
        // meter el contador como HTML crudo.
        const buildSub = () => {
            const el = document.createElement('div');
            el.className = 'winner-sub';
            el.id = 'winner-sub';
            el.append('Next match in ');
            const num = document.createElement('span');
            num.className = 'countdown-number';
            num.textContent = String(lobbyTime);
            el.append(num);
            el.append('s');
            return el;
        };
        const sub = refs.winnerModal.querySelector('#winner-sub');
        if (sub) {
            sub.replaceWith(buildSub());
        } else if (content && content.firstElementChild) {
            content.firstElementChild.after(buildSub());
        }
    }

    // Voting at the very end, after countdown (winner-sub)
    if (voteFieldset && contentRoot) contentRoot.appendChild(voteFieldset);
    else if (voteFieldset && content) content.appendChild(voteFieldset);
}

export function hideWinnerModal(refs) {
    refs.winnerModal.classList.add('hidden');
    // Clear vote selection for next match
    const vc = refs.winnerModal.querySelector('#vote-boxes');
    if (vc) {
        for (const b of vc.querySelectorAll('.vote-box')) {
            b.classList.remove('selected');
        }
    }
}

export function updateVoteCounts(counts) {
    const vc = document.getElementById('vote-boxes');
    if (!vc) return;
    if (counts.basic !== undefined) {
        const b = vc.querySelector('.vote-badge[data-map="basic"]');
        if (b) b.textContent = String(counts.basic);
    }
    if (counts.robostrike !== undefined) {
        const b = vc.querySelector('.vote-badge[data-map="robostrike"]');
        if (b) b.textContent = String(counts.robostrike);
    }
}

// ── Barra superior (RONDA N) ─────────────────────────────────
// remaining/total en segundos. remaining>0 → llena proporcional;
// si no, barra vacía (sin color) y "0s".
export function setTopTimer(refs, remaining, total) {
    const t = total > 0 ? total : 1;
    if (remaining > 0) {
        const ratio = Math.min(1, Math.max(0, remaining / t));
        refs.timerFill.style.width = `${ratio * 100}%`;
        refs.timerText.textContent = `${Math.ceil(remaining)}s`;
    } else {
        refs.timerFill.style.width = '0%';
        refs.timerText.textContent = '0s';
    }
}

// Drenaje FLUIDO (lineal, sin escalones): la barra se anima por frames
// desde round_started durante `total` segundos. El número sigue por ticks
// del servidor (setTopTimerText) para no desync; la barra va por reloj local.
let topTimerRaf = null;
let topTimerT0 = 0;

export function stopTopTimerFluid() {
    if (topTimerRaf) {
        cancelAnimationFrame(topTimerRaf);
        topTimerRaf = null;
    }
}

// True si la animación arrancó hace menos de ms: evita el doble
// arranque visible (tick 0 y round_started llegan casi juntos).
export function isTopTimerFresh(ms = 1500) {
    return topTimerRaf !== null && performance.now() - topTimerT0 < ms;
}

export function startTopTimerFluid(refs, total) {
    stopTopTimerFluid();
    topTimerT0 = performance.now();
    const t = total > 0 ? total : 1;
    // Sin transición CSS: el ancho se setea cada frame, la transición
    // generaría lag (frenos/acelerones).
    refs.timerFill.style.transition = 'none';
    refs.timerFill.style.width = '100%';
    const t0 = performance.now();
    const totalMs = t * 1000;
    const step = (now) => {
        const ratio = Math.min(1, Math.max(0, (now - t0) / totalMs));
        refs.timerFill.style.width = `${(1 - ratio) * 100}%`;
        if (ratio < 1) {
            topTimerRaf = requestAnimationFrame(step);
        } else {
            refs.timerFill.style.width = '0%';
            topTimerRaf = null;
        }
    };
    topTimerRaf = requestAnimationFrame(step);
}

export function correctTopTimerFluid(refs, remaining, total) {
    if (!refs.timerFill || !refs.timerText) return;
    const tt = total > 0 ? total : 1;
    const r = Math.min(tt, Math.max(0, remaining));
    // corrige drift: reinicia desde el % real del server
    stopTopTimerFluid();
    refs.timerFill.style.transition = 'none';
    refs.timerFill.style.width = `${(r / tt) * 100}%`;
    refs.timerText.textContent = r > 0 ? `${Math.ceil(r)}s` : '0s';
    if (r <= 0) return;
    topTimerT0 = performance.now();
    const t0 = performance.now();
    const totalMs = r * 1000;
    const startRatio = r / tt;
    const step = (now) => {
        const elapsed = now - t0;
        const ratio = Math.max(0, startRatio * (1 - elapsed / totalMs));
        refs.timerFill.style.width = `${ratio * 100}%`;
        if (elapsed < totalMs && ratio > 0) {
            topTimerRaf = requestAnimationFrame(step);
        } else {
            refs.timerFill.style.width = '0%';
            topTimerRaf = null;
        }
    };
    topTimerRaf = requestAnimationFrame(step);
}

export function setTopTimerText(refs, remaining) {
    refs.timerText.textContent = remaining > 0 ? `${Math.ceil(remaining)}s` : '0s';
}

export function syncTopTimerFluid(refs, remaining, total) {
    if (!refs.timerFill || !refs.timerText) return;
    if (topTimerRaf !== null) return;
    const tt = total > 0 ? total : 1;
    const r = Math.min(tt, Math.max(0, remaining));
    stopTopTimerFluid();
    refs.timerFill.style.transition = 'none';
    refs.timerFill.style.width = `${(r / tt) * 100}%`;
    refs.timerText.textContent = r > 0 ? `${Math.ceil(r)}s` : '0s';
    if (r <= 0) return;
    topTimerT0 = performance.now();
    const t0 = performance.now();
    const totalMs = r * 1000;
    const startRatio = r / tt;
    const step = (now) => {
        const elapsed = now - t0;
        const ratio = Math.max(0, startRatio * (1 - elapsed / totalMs));
        refs.timerFill.style.width = `${ratio * 100}%`;
        if (elapsed < totalMs && ratio > 0) {
            topTimerRaf = requestAnimationFrame(step);
        } else {
            refs.timerFill.style.width = '0%';
            topTimerRaf = null;
        }
    };
    topTimerRaf = requestAnimationFrame(step);
}

// ── Tabla de posiciones (ScoreBoard) ─────────────────────────
// Nombres con textContent (nunca innerHTML): los nombres vienen de
// jugadores y pueden contener markup.
const SCORE_MEDAL = ['🥇', '🥈', '🥉'];

/** Renderiza el top (ya ordenado) en el contenedor del sidebar. */
export function renderScoreboardList(container, entries) {
    if (!container) return;
    container.innerHTML = '';
    if (!entries.length) {
        const empty = document.createElement('div');
        empty.className = 'score-empty';
        empty.textContent = 'No data yet';
        container.appendChild(empty);
        return;
    }
    entries.forEach((e, i) => {
        const row = document.createElement('div');
        row.className = 'score-row';
        const pos = document.createElement('span');
        pos.className = 'score-pos';
        pos.textContent = SCORE_MEDAL[i] || `${i + 1}.`;
        const name = document.createElement('span');
        name.className = 'score-name';
        name.textContent = e.display;
        const stats = document.createElement('span');
        stats.className = 'score-stats';
        stats.textContent = `🏆${e.wins} ⚔${e.kills}`;
        row.appendChild(pos);
        row.appendChild(name);
        row.appendChild(stats);
        container.appendChild(row);
    });
}

// ── Lista de jugadores (roster fijo + sala de espera) ─────

const PHASE_BADGE = { alive: '', dead: '💀', eliminated: '☠️' };

function phaseOf(tank) {
    return tank.phase || (tank.alive ? 'alive' : 'eliminated');
}

function makeRow(tank) {
    const phase = phaseOf(tank);
    const row = document.createElement('div');
    let phaseClass = '';
    if (phase === 'dead') phaseClass = ' player-dead';
    else if (phase === 'eliminated') phaseClass = ' player-eliminated';
    row.className = 'player-row' + phaseClass;

    const name = document.createElement('span');
    name.className = 'player-name';
    name.textContent = `${tank.num} ${PHASE_BADGE[phase]} ${tank.id}`.trim();

    const kills = document.createElement('span');
    kills.className = 'player-kills';
    kills.textContent = `⚔${tank.kills ?? 0}`;

    const hp = document.createElement('span');
    hp.className = 'player-hp';
    let hpText;
    if (phase === 'eliminated') hpText = 'eliminated';
    else if (phase === 'dead') hpText = `💀 ${tank.lives}❤`;
    else hpText = `❤${tank.lives} HP:${tank.hp}`;
    hp.textContent = hpText;

    row.appendChild(name);
    row.appendChild(kills);
    row.appendChild(hp);
    return row;
}

function makeWaitingRow(wName) {
    const row = document.createElement('div');
    row.className = 'player-row player-waiting';

    const nm = document.createElement('span');
    nm.className = 'player-name';
    nm.textContent = `⏳ ${wName}`;

    const tag = document.createElement('span');
    tag.className = 'player-hp';
    tag.textContent = 'waiting';

    row.appendChild(nm);
    row.appendChild(tag);
    return row;
}

/** Oculta el botón JUGAR una vez reclamado el tanque (o pedido de espera). */
export function hidePlayOffer(refs) {
    if (refs.playPanel) refs.playPanel.classList.add('hidden');
}

/** Muestra las secciones de jugador: recién cuando el cliente tiene tanque. */
export function showPlayerUI(refs) {
    hidePlayOffer(refs);
    if (refs.playerSection) refs.playerSection.classList.remove('hidden');
    if (refs.commandsSection) refs.commandsSection.classList.remove('hidden');
}

/** Vuelve a ofrecer JUGAR (inverso de hidePlayOffer). */
export function showPlayOffer(refs) {
    if (refs.playPanel) refs.playPanel.classList.remove('hidden');
}

/** Esconde las secciones de jugador: el cliente vuelve a ser espectador. */
export function hidePlayerUI(refs) {
    if (refs.playerSection) refs.playerSection.classList.add('hidden');
    if (refs.commandsSection) refs.commandsSection.classList.add('hidden');
}

/** Renderiza el roster de la partida (orden estable por número).
 *  Los que esperan van en el panel Lobby (renderLobbyList), no acá. */
export function renderPlayersList(container, gs) {
    if (!container) return;
    container.innerHTML = '';
    const tanks = Object.values(gs.tanks || {});
    tanks.sort((a, b) => a.num - b.num);
    for (const tank of tanks) container.appendChild(makeRow(tank));
}

/** Renderiza la sala de espera: tanques que entran al terminar la partida.
 *  Si no hay nadie, no hay nada que dibujar: el panel lo oculta `renderer.js`. */
export function renderLobbyList(container, gs) {
    if (!container) return;
    container.innerHTML = '';
    for (const wName of gs.waiting_room || []) container.appendChild(makeWaitingRow(wName));
}
