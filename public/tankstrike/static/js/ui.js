// ─── Events ────────────────────────────────────────────────

import { state } from './state.js';
import { addChatMessage } from './chat.js';
import { getRefsObj } from './refs.js';

export function setInputsDisabled(refs, disabled) {
    if (!refs || !refs.commandDisplay) return;
    const buttons = ['W', 'A', 'S', 'D', 'Q', 'E', 'Z', 'X', 'C'].map((c) => refs['cmd' + c]).filter(Boolean);
    if (refs.sendBtn) buttons.push(refs.sendBtn);
    buttons.forEach((btn) => {
        if (!btn) return;
        btn.disabled = disabled;
        if (disabled) {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        }
    });
    if (disabled) {
        const cells = refs.commandDisplay.querySelectorAll('.cmd-cell');
        cells.forEach((cell) => {
            cell.textContent = '';
            cell.classList.remove('filled');
        });
    }
}

export function refreshInputsEnabled() {
    const refs = getRefsObj();
    if (!refs || !refs.commandDisplay || !state.gameState || !state.myName) return;

    // Si esta animando los 6 steps, nunca habilitar (aunque gameState diga programming por un momento)
    if (state.animating) {
        setInputsDisabled(refs, true);
        return;
    }

    const tanks = state.gameState.tanks || {};
    const tank = tanks[state.myName];
    // Muerto sin vidas: nunca habilitar bajo ningun motivo, aunque vuelva programming
    if (!tank || tank.phase !== 'alive' || tank.lives === 0 || tank.alive === false) {
        setInputsDisabled(refs, true);
        return;
    }
    const programming = state.gameState.state === 'programming';

    setInputsDisabled(refs, !programming);
}

export function initUI() {
    const refs = getRefsObj();
    console.log('[UI] initUI start', 'clearBtn:', refs.clearBtn, 'sendBtn:', refs.sendBtn);
    const cmds = [];

    function updateDisplay() {
        if (!refs.commandDisplay) return;
        state.myCommands = cmds.join('');

        const cells = refs.commandDisplay.querySelectorAll('.cmd-cell');
        const iconMap = {
            W: '↑',
            A: '←',
            S: '↓',
            D: '→',
            Q: '🔫',
            E: '⚡',
            Z: '🚀',
            turbo_forward_2: '🚀↑',
            turbo_forward_3: '🚀🚀↑',
            turbo_back_2: '🚀↓',
            turbo_back_3: '🚀🚀↓',
            turbo_left_2: '🚀←',
            turbo_left_3: '🚀🚀←',
            turbo_right_2: '🚀→',
            turbo_right_3: '🚀🚀→',
            turbo_placeholder: ''
        };

        for (let i = 0; i < cells.length; i++) {
            const cmd = cmds[i];
            // Si el ícono no está en el mapa estático, intentamos renderizar
            // dinámicamente una combinación turbo_<dir>_<n> (n cohetes + flecha).
            const renderTurboIcon = (cand) => {
                if (!cand) return null;
                const m = cand.match(/^turbo_(forward|back|left|right)_(\d+)$/);
                if (!m) return null;
                const dirs = { forward: '↑', back: '↓', left: '←', right: '→' };
                return '🚀'.repeat(parseInt(m[2], 10)) + dirs[m[1]];
            };
            const icon = iconMap[cmd] ?? renderTurboIcon(cmd) ?? (cmd ? cmd : '');
            cells[i].textContent = icon;
            cells[i].classList.toggle('filled', !!cmd);
        }

        const blastCount = cmds.filter((c) => c === 'E').length;
        const lastIsTurbo = cmds.length > 0 && cmds[cmds.length - 1] === 'Z';

        ['W', 'A', 'S', 'D', 'Q', 'E', 'Z', 'X', 'C'].forEach((c) => {
            const btn = refs['cmd' + c];
            if (!btn) return;
            const isActive = cmds.includes(c);
            let disabled = false;

            // Muerto sin vidas: nunca iluminar
            const t = state.gameState?.tanks?.[state.myName];
            const deadNoLives = !t || t.phase !== 'alive' || t.lives === 0 || t.alive === false || state.animating;
            if (deadNoLives && state.gameState?.state !== 'lobby') {
                // durante partida muerto: todo bloqueado
                disabled = true;
            } else {
                if (c === 'X' || c === 'C') {
                    disabled = true;
                }

                const otherCommands = cmds.filter((x) => x !== 'Z' && !['W','A','S','D'].includes(x)).length;
                const maxPropulsores = Math.max(0, 6 - otherCommands - 1);
                const propulsorCount = cmds.filter((x) => x === 'Z').length;

                if (c === 'Z' && propulsorCount >= maxPropulsores) {
                    disabled = true;
                }

                if (lastIsTurbo && !['W', 'A', 'S', 'D', 'Z'].includes(c)) {
                    disabled = true;
                }

                if (c === 'E' && blastCount >= 2) {
                    disabled = true;
                }
            }

            btn.classList.toggle('active', isActive && !disabled);
            btn.setAttribute('aria-pressed', String(isActive && !disabled));
            btn.disabled = disabled;
        });
    }

    function resetCommands() {
        cmds.length = 0;
        updateDisplay();
    }

    function addCmd(c) {
        // Muerto sin vidas o animando 6 steps: no aceptar comandos
        const td = state.gameState?.tanks?.[state.myName];
        if (!td || td.phase !== 'alive' || td.lives === 0 || td.alive === false || state.animating) {
            if (state.gameState?.state !== 'lobby') return;
        }
        if (c === 'X' || c === 'C') return;

        const blastCount = cmds.filter((x) => x === 'E').length;
        if (c === 'E' && blastCount >= 2) return;

        const lastIsTurbo = cmds.length > 0 && cmds[cmds.length - 1] === 'Z';
        if (lastIsTurbo && !['W', 'A', 'S', 'D', 'Z'].includes(c)) return;

        // Límite dinámico de propulsores: cada propulsor + su dirección final
        // deben caber en los 6 slots disponibles (MAX_ACTIONS = 6).
        const otherCommands = cmds.filter((x) => x !== 'Z' && !['W','A','S','D'].includes(x)).length;
        const maxPropulsores = Math.max(0, 6 - otherCommands - 1);
        if (c === 'Z') {
            const propulsorCount = cmds.filter((x) => x === 'Z').length;
            if (propulsorCount >= maxPropulsores) return;
        }

        if (cmds.length < 6) {
            cmds.push(c);
            updateDisplay();
        }
    }

    ['W', 'A', 'S', 'D', 'Q', 'E', 'Z', 'X', 'C'].forEach((c) => {
        const btn = refs['cmd' + c];
        if (btn) {
            btn.addEventListener('click', () => addCmd(c));
        }
    });

    if (refs.clearBtn && typeof refs.clearBtn.addEventListener === 'function') {
        refs.clearBtn.addEventListener('click', () => {
            console.log('[CLEAR BTN] clicked, cmds:', cmds.join(''), 'disabled:', refs.clearBtn.disabled);
            if (cmds.length > 0) {
                cmds.pop();
                updateDisplay();
                console.log('[CLEAR BTN] after pop, cmds:', cmds.join(''));
            }
        });
    } else {
        console.warn('[CLEAR BTN] not found or addEventListener unavailable', refs.clearBtn);
    }

    if (refs.sendBtn) {
        refs.sendBtn.addEventListener('click', () => {
            const cmd = cmds.join('');
            if (cmd) {
                state.myCommands = cmd;
                addChatMessage('Sistema', `✅ ${state.myName} listo`);
                // Enviar comando al servidor inmediatamente (como demo)
                if (state.socket && state.socket.connected) {
                    state.socket.emit('command', { command: cmd });
                    state.socket.emit('player_ready', {});
                }
            }
        });
    }

    // ── Editable tank name (Tu Tanque header) ──────────────
    (function setupNameEditing() {
        const nameBtn = refs.editNameBtn;
        const nameInput = refs.editNameInput;
        const cancelBtn = refs.cancelNameBtn;
        const prefix = refs.editNamePrefix;
        const nameSpan = refs.myTankName;
        const nameError = refs.nameError;
        if (!nameBtn || !nameInput || !nameSpan) return;

        // Sufijo sin @ — el @ es prefijo fijo visual, no editable
        const NAME_RE = /^[A-Za-z0-9_-]+$/;

        // N3: sólo un jugador registrado renombra. El evento `session`
        // habilita el lápiz vía _nameEdit.setCanRename.
        let canRename = false;

        function applyPencil() {
            if (!nameBtn) return;
            nameBtn.classList.toggle('hidden', !canRename);
        }

        function stripAt(val) {
            return (val || '').trim().replace(/^@+/, '');
        }

        function showError(msg) {
            if (!nameError) return;
            if (msg) {
                nameError.textContent = msg;
                nameError.classList.remove('hidden');
            } else {
                nameError.textContent = '';
                nameError.classList.add('hidden');
            }
        }

        function validateLocal(val) {
            // val es el sufijo sin @ (contenido del input)
            const v = stripAt(val);
            if (!v) return 'Name cannot be empty';
            const full = '@' + v;
            if (full.length > 20) return 'Max 20 characters (with @)';
            if (val.includes('@')) return 'The @ is fixed, it cannot be edited';
            if (!NAME_RE.test(v)) return 'Only letters, numbers, _ - (the @ is fixed)';
            return '';
        }

        function enterEdit() {
            const suffix = stripAt(state.myName || '');
            nameInput.value = suffix;
            nameSpan.classList.add('hidden');
            nameBtn.classList.add('hidden');
            if (prefix) prefix.classList.remove('hidden');
            nameInput.classList.remove('hidden');
            if (cancelBtn) cancelBtn.classList.remove('hidden');
            showError('');
            nameInput.disabled = false;
            nameInput.focus();
            nameInput.select();
        }

        function exitEdit() {
            nameInput.classList.add('hidden');
            if (prefix) prefix.classList.add('hidden');
            if (cancelBtn) cancelBtn.classList.add('hidden');
            nameSpan.classList.remove('hidden');
            applyPencil();
            nameInput.disabled = false;
            showError('');
        }

        function commitEdit() {
            const rawSuffix = nameInput.value.trim();
            const err = validateLocal(rawSuffix);
            if (err) {
                showError(err);
                return;
            }
            const suffix = stripAt(rawSuffix);
            if (!suffix) {
                showError('Name cannot be empty');
                return;
            }
            const newName = '@' + suffix;
            if (newName === state.myName) {
                exitEdit();
                return;
            }
            // disable while waiting for server response
            nameInput.disabled = true;
            if (state.socket) {
                state.socket.emit('rename', { newName: newName, name: newName });
            }
            // will be re-enabled on renamed/name_occupied/error
            // keep input visible until server responds; allow cancel via Esc
        }

        nameBtn.addEventListener('click', enterEdit);
        if (cancelBtn) cancelBtn.addEventListener('click', exitEdit);

        nameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                commitEdit();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                exitEdit();
            }
        });

        nameInput.addEventListener('input', () => {
            const err = validateLocal(nameInput.value);
            // show inline while typing only if invalid and not empty-ish
            if (err && nameInput.value.trim().length > 0) showError(err);
            else showError('');
        });

        nameInput.addEventListener('blur', () => {
            // Validate on blur but don't auto-commit; keep editing if invalid,
            // auto-cancel if empty? Spec says blur validates.
            const v = nameInput.value.trim();
            if (!v) {
                // empty -> cancel
                exitEdit();
                return;
            }
            const err = validateLocal(nameInput.value);
            if (err) showError(err);
        });

        // Expose helpers for socket handlers to close/reset
        refs._nameEdit = {
            exitEdit,
            showError,
            setCanRename: (value) => {
                canRename = !!value;
                applyPencil();
            },
            enable: () => {
                nameInput.disabled = false;
            }
        };
        applyPencil();
    })();

    return { resetCommands };
}
