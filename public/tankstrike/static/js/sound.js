// ─── Sound ──────────────────────────────────────────────────

class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.master = null;
    }

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            this.enabled = false;
            return;
        }
        // Cadena master con headroom: todo pasa por el compresor para
        // evitar clipping cuando se superponen explosiones + láseres.
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.9;
        const comp = this.ctx.createDynamicsCompressor();
        comp.threshold.value = -18;
        comp.knee.value = 20;
        comp.ratio.value = 8;
        comp.attack.value = 0.003;
        comp.release.value = 0.15;
        this.master.connect(comp);
        comp.connect(this.ctx.destination);
    }

    _dest() {
        return this.master || this.ctx.destination;
    }

    play(type) {
        if (!this.enabled || !this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        switch (type) {
            case 'laser':
                this._playLaser();
                break;
            case 'blast':
                this._playBlast();
                break;
            case 'hit':
                this._playHit();
                break;
            case 'death':
                this._playDeath();
                break;
            case 'pit_fall':
            case 'pit':
                this._playPitFall();
                break;
            case 'shield':
                this._playShield();
                break;
            case 'turn':
                this._playTurn();
                break;
            case 'move':
                this._playMove();
                break;
            case 'countdown':
                this._playCountdown();
                break;
            case 'gameover':
                this._playGameover();
                break;
        }
    }

    _playLaser() {
        // Pulso electromagnético moderno (sin "bip" de videojuego):
        // chirp descendente 2.5k→400Hz en 90ms sobre zumbido metálico
        // (2 osc detuned + bandpass), attack instantáneo y tail corto con
        // reverb simulada (delay/feedback atenuado).
        const t = this.ctx.currentTime;
        const out = this._dest();

        // Reverb simulada: delay corto con feedback atenuado
        const delay = this.ctx.createDelay(0.2);
        delay.delayTime.value = 0.09;
        const feedback = this.ctx.createGain();
        feedback.gain.value = 0.35;
        const wet = this.ctx.createGain();
        wet.gain.value = 0.25;
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(wet);
        wet.connect(out);

        // Zumbido metálico: 2 saw detuned a través de bandpass
        const bp = this.ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 1200;
        bp.Q.value = 8;
        const humGain = this.ctx.createGain();
        humGain.gain.setValueAtTime(0.12, t);
        humGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        bp.connect(humGain);
        humGain.connect(out);
        humGain.connect(delay);
        for (const detune of [-8, 8]) {
            const hum = this.ctx.createOscillator();
            hum.type = 'sawtooth';
            hum.frequency.value = 180;
            hum.detune.value = detune;
            hum.connect(bp);
            hum.start(t);
            hum.stop(t + 0.12);
        }

        // Chirp descendente 2500→400Hz en 90ms, attack instantáneo
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(out);
        gain.connect(delay);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2500, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.09);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        osc.start(t);
        osc.stop(t + 0.12);
    }

    _playBlast() {
        const t = this.ctx.currentTime;
        const out = this._dest();
        // Cuerpo de ruido con más presencia que antes
        const bufferSize = this.ctx.sampleRate * 0.35;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) ** 2;
        }
        const source = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        source.buffer = buffer;
        source.connect(gain);
        gain.connect(out);
        gain.gain.setValueAtTime(0.45, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
        source.start(t);
        // Sub thump corto que le da peso
        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.connect(subGain);
        subGain.connect(out);
        sub.type = 'sine';
        sub.frequency.setValueAtTime(70, t);
        sub.frequency.exponentialRampToValueAtTime(32, t + 0.28);
        subGain.gain.setValueAtTime(0.5, t);
        subGain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        sub.start(t);
        sub.stop(t + 0.3);
    }

    _playHit() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this._dest());
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    _playDeath() {
        // Explosión espectacular (~1.6s): mega crack + punch + cuerpo
        // largo con barrido estéreo + doble sub + retumbe + cola épica.
        const t = this.ctx.currentTime;
        const out = this._dest();

        // Mega crack inicial brillante: el golpe que se siente
        // hasta en parlante de teléfono
        const crackLen = Math.floor(this.ctx.sampleRate * 0.12);
        const crackBuf = this.ctx.createBuffer(1, crackLen, this.ctx.sampleRate);
        const crackData = crackBuf.getChannelData(0);
        for (let i = 0; i < crackLen; i++) crackData[i] = Math.random() * 2 - 1;
        const crack = this.ctx.createBufferSource();
        crack.buffer = crackBuf;
        const crackHp = this.ctx.createBiquadFilter();
        crackHp.type = 'highpass';
        crackHp.frequency.value = 2000;
        const crackGain = this.ctx.createGain();
        crack.connect(crackHp);
        crackHp.connect(crackGain);
        crackGain.connect(out);
        crackGain.gain.setValueAtTime(0.7, t);
        crackGain.gain.setTargetAtTime(0, t, 0.01);
        crack.start(t);
        crack.stop(t + 0.12);

        // Punch en el pecho: caída rápida 120→38Hz
        const punch = this.ctx.createOscillator();
        const punchGain = this.ctx.createGain();
        punch.connect(punchGain);
        punchGain.connect(out);
        punch.type = 'sine';
        punch.frequency.setValueAtTime(120, t);
        punch.frequency.exponentialRampToValueAtTime(38, t + 0.18);
        punchGain.gain.setValueAtTime(0.7, t);
        punchGain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
        punch.start(t);
        punch.stop(t + 0.22);

        // Cuerpo largo de ruido con lowpass que cierra 5000→120
        const bufferSize = Math.floor(this.ctx.sampleRate * 1.2);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) ** 1.5;
        }
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        const bodyLp = this.ctx.createBiquadFilter();
        bodyLp.type = 'lowpass';
        bodyLp.frequency.setValueAtTime(5000, t);
        bodyLp.frequency.exponentialRampToValueAtTime(120, t + 1.2);
        const gain = this.ctx.createGain();
        source.connect(bodyLp);
        bodyLp.connect(gain);
        gain.connect(out);
        gain.gain.setValueAtTime(0.6, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 1.2);
        source.start(t);

        // Barrido estéreo del cuerpo: va de oreja a oreja (auriculares).
        // En parlante mono se suma sin problema.
        if (this.ctx.createStereoPanner) {
            const panner = this.ctx.createStereoPanner();
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.frequency.value = 0.7;
            lfoGain.gain.value = 0.6;
            lfo.connect(lfoGain);
            lfoGain.connect(panner.pan);
            gain.disconnect();
            gain.connect(panner);
            panner.connect(out);
            lfo.start(t);
            lfo.stop(t + 1.3);
        }

        // Doble sub detuned 65→24Hz: peso de cine
        for (const detune of [-6, 6]) {
            const sub = this.ctx.createOscillator();
            const subGain = this.ctx.createGain();
            sub.connect(subGain);
            subGain.connect(out);
            sub.type = 'sine';
            sub.frequency.value = 65;
            sub.detune.value = detune;
            sub.frequency.exponentialRampToValueAtTime(24, t + 0.9);
            subGain.gain.setValueAtTime(0.5, t);
            subGain.gain.exponentialRampToValueAtTime(0.01, t + 1.0);
            sub.start(t);
            sub.stop(t + 1.0);
        }

        // Retumbe descendente heredado de la versión anterior
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.connect(oscGain);
        oscGain.connect(this._dest());
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.5);
        oscGain.gain.setValueAtTime(0.25, t);
        oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
        osc.start(t);
        osc.stop(t + 0.5);
    }

    _playPitFall() {
        // Caída libre al pozo (~620ms): viento aireado + silbido descendente
        // 900→80Hz + thud suave en el fondo. Sin crack/punch — distinto a death.
        const t = this.ctx.currentTime;
        const out = this._dest();

        // Viento: ruido blanco filtrado lowpass 1800→400Hz, 560ms
        const windLen = Math.floor(this.ctx.sampleRate * 0.56);
        const windBuf = this.ctx.createBuffer(1, windLen, this.ctx.sampleRate);
        const windData = windBuf.getChannelData(0);
        for (let i = 0; i < windLen; i++) windData[i] = (Math.random() * 2 - 1) * (1 - i / windLen) ** 1.2;
        const windSrc = this.ctx.createBufferSource();
        windSrc.buffer = windBuf;
        const windLp = this.ctx.createBiquadFilter();
        windLp.type = 'lowpass';
        windLp.frequency.setValueAtTime(1800, t);
        windLp.frequency.exponentialRampToValueAtTime(400, t + 0.5);
        windLp.Q.value = 0.7;
        const windGain = this.ctx.createGain();
        windSrc.connect(windLp);
        windLp.connect(windGain);
        windGain.connect(out);
        windGain.gain.setValueAtTime(0.22, t);
        windGain.gain.exponentialRampToValueAtTime(0.01, t + 0.56);
        windSrc.start(t);
        windSrc.stop(t + 0.56);

        // Silbido descendente: sine 900→80Hz en 450ms, aireado y audible
        const whistle = this.ctx.createOscillator();
        const whistleGain = this.ctx.createGain();
        whistle.connect(whistleGain);
        // leve Doppler estéreo cuando hay panner
        if (this.ctx.createStereoPanner) {
            const panner = this.ctx.createStereoPanner();
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.frequency.value = 3.5;
            lfoGain.gain.value = 0.5;
            lfo.connect(lfoGain);
            lfoGain.connect(panner.pan);
            whistleGain.connect(panner);
            panner.connect(out);
            lfo.start(t);
            lfo.stop(t + 0.5);
        } else {
            whistleGain.connect(out);
        }
        whistle.type = 'sine';
        whistle.frequency.setValueAtTime(900, t);
        whistle.frequency.exponentialRampToValueAtTime(80, t + 0.45);
        whistleGain.gain.setValueAtTime(0.35, t);
        whistleGain.gain.exponentialRampToValueAtTime(0.01, t + 0.48);
        whistle.start(t);
        whistle.stop(t + 0.48);

        // Thud suave en el fondo: sine 60→30Hz, 150ms, arranca a 0.38s
        const thud = this.ctx.createOscillator();
        const thudGain = this.ctx.createGain();
        thud.connect(thudGain);
        thudGain.connect(out);
        thud.type = 'sine';
        const thudT = t + 0.38;
        thud.frequency.setValueAtTime(60, thudT);
        thud.frequency.exponentialRampToValueAtTime(30, thudT + 0.14);
        thudGain.gain.setValueAtTime(0.0, t);
        thudGain.gain.setValueAtTime(0.0, thudT);
        thudGain.gain.linearRampToValueAtTime(0.4, thudT + 0.01);
        thudGain.gain.exponentialRampToValueAtTime(0.01, thudT + 0.15);
        thud.start(thudT);
        thud.stop(thudT + 0.15);
    }

    _playShield() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this._dest());
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }

    _playTurn() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this._dest());
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    _playMove() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this._dest());
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    _playCountdown() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this._dest());
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    _playGameover() {
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this._dest());
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.15);
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.15 + 0.2);
            osc.start(this.ctx.currentTime + i * 0.15);
            osc.stop(this.ctx.currentTime + i * 0.15 + 0.2);
        });
    }
}

export const sound = new SoundManager();
