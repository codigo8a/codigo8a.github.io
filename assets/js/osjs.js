document.addEventListener("DOMContentLoaded", () => {
    // OS.js Clock update
    const clockElement = document.querySelector('.osjs-panel-item[data-name="clock"] span');
    
    function updateClock() {
        if (!clockElement) return;
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    if (clockElement) {
        updateClock();
        setInterval(updateClock, 1000);
    }
});
