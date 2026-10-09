// ─── Chat ──────────────────────────────────────────────────
// El panel de chat fue eliminado del DOM: los mensajes del sistema
// (eventos de ronda, muertes, avisos) ahora van a console.log.
// Se mantiene addChatMessage como único punto de emisión para no
// tocar a todos sus llamadores (socket.js, animation.js).

export function addChatMessage(user, text) {
    console.log(`[chat] ${user}: ${text}`);
}
