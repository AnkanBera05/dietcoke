/**
 * ULTRA-CRISP DIET COKE PROCEDURAL AUDIO ENGINE
 * Hyper-realistic Web Audio synthesizer reproducing the iconic:
 * - Ultra-crisp aluminum tab leverage crack & ping
 * - High-pressure aerosol CO2 explosion (PSSS-SHHHHH!)
 * - Hollow metallic can body resonance & liquid glug
 * - Granular effervescent micro-bubble fizz
 * - Interactive beatpad samples & ice clinks
 * - Mobile audio auto-unlock
 */

class DietCokeAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = true;
        this.masterGain = null;
        this.initialized = false;

        this.setupMobileAutoUnlock();
    }

    init() {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.95, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);
            this.initialized = true;
        } catch (e) {
            console.warn("Web Audio API not supported", e);
        }
    }

    setupMobileAutoUnlock() {
        // Unlock AudioContext on first touch / click gesture for mobile
        const unlock = () => {
            if (!this.initialized) this.init();
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            window.removeEventListener('touchstart', unlock);
            window.removeEventListener('click', unlock);
        };
        window.addEventListener('touchstart', unlock, { passive: true, once: true });
        window.addEventListener('click', unlock, { passive: true, once: true });
    }

    toggleMute() {
        if (!this.initialized) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.95, this.ctx.currentTime, 0.04);
        }
        if (!this.isMuted) {
            this.playCrispCanPop();
            this.triggerHaptic([30, 40]);
        }
        return !this.isMuted;
    }

    triggerHaptic(pattern = [40]) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try { navigator.vibrate(pattern); } catch (e) {}
        }
    }

    // =========================================================================
    // THE ULTRA-CRISP DIET COKE CAN OPENING SOUND
    // =========================================================================
    playCrispCanPop() {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            this.triggerHaptic([25, 80, 50, 30]);

            // LAYER 1: Sharp Aluminum Tab Fracture / Leverage Snap Transient
            const snapOsc = this.ctx.createOscillator();
            const snapGain = this.ctx.createGain();
            snapOsc.type = 'triangle';
            snapOsc.frequency.setValueAtTime(4600, t);
            snapOsc.frequency.exponentialRampToValueAtTime(320, t + 0.035);

            snapGain.gain.setValueAtTime(1.0, t);
            snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

            snapOsc.connect(snapGain);
            snapGain.connect(this.masterGain);
            snapOsc.start(t);
            snapOsc.stop(t + 0.05);

            // LAYER 2: High Metal Ping Resonance (Aluminum ping)
            const pingOsc = this.ctx.createOscillator();
            const pingGain = this.ctx.createGain();
            pingOsc.type = 'sine';
            pingOsc.frequency.setValueAtTime(5800, t + 0.005);
            pingOsc.frequency.exponentialRampToValueAtTime(2400, t + 0.08);

            pingGain.gain.setValueAtTime(0.4, t + 0.005);
            pingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

            pingOsc.connect(pingGain);
            pingGain.connect(this.masterGain);
            pingOsc.start(t + 0.005);
            pingOsc.stop(t + 0.1);

            // LAYER 3: Explosive High-Pressure Gas Rush (PSSS-SHHHHHHH!)
            const noiseLength = Math.floor(this.ctx.sampleRate * 1.3);
            const noiseBuffer = this.ctx.createBuffer(1, noiseLength, this.ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < noiseLength; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            const hissSource = this.ctx.createBufferSource();
            hissSource.buffer = noiseBuffer;

            // Dual bandpass filter for authentic soda hiss
            const bpFilter = this.ctx.createBiquadFilter();
            bpFilter.type = 'bandpass';
            bpFilter.frequency.setValueAtTime(5400, t + 0.01);
            bpFilter.frequency.exponentialRampToValueAtTime(1900, t + 0.85);
            bpFilter.Q.setValueAtTime(2.8, t);

            const hpFilter = this.ctx.createBiquadFilter();
            hpFilter.type = 'highpass';
            hpFilter.frequency.setValueAtTime(1400, t);

            const hissGain = this.ctx.createGain();
            hissGain.gain.setValueAtTime(0.001, t);
            hissGain.gain.linearRampToValueAtTime(0.95, t + 0.022); // Instant explosive burst
            hissGain.gain.exponentialRampToValueAtTime(0.001, t + 1.1);

            hissSource.connect(bpFilter);
            bpFilter.connect(hpFilter);
            hpFilter.connect(hissGain);
            hissGain.connect(this.masterGain);

            hissSource.start(t + 0.01);
            hissSource.stop(t + 1.25);

            // LAYER 4: Hollow Aluminum Can Body Resonance (840 Hz & 1220 Hz)
            const canRes = this.ctx.createOscillator();
            const canGain = this.ctx.createGain();
            canRes.type = 'sine';
            canRes.frequency.setValueAtTime(840, t + 0.02);
            canRes.frequency.exponentialRampToValueAtTime(760, t + 0.5);

            canGain.gain.setValueAtTime(0.35, t + 0.02);
            canGain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

            canRes.connect(canGain);
            canGain.connect(this.masterGain);
            canRes.start(t + 0.02);
            canRes.stop(t + 0.6);

            // LAYER 5: Liquid Glug Thump
            const glugOsc = this.ctx.createOscillator();
            const glugGain = this.ctx.createGain();
            glugOsc.type = 'sine';
            glugOsc.frequency.setValueAtTime(260, t + 0.035);
            glugOsc.frequency.exponentialRampToValueAtTime(95, t + 0.22);

            glugGain.gain.setValueAtTime(0.5, t + 0.035);
            glugGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

            glugOsc.connect(glugGain);
            glugGain.connect(this.masterGain);
            glugOsc.start(t + 0.035);
            glugOsc.stop(t + 0.28);

            // LAYER 6: Lingering Micro-bubble Fizz Effervescence (2.8 seconds)
            this.burstFizz(2.8);
        } catch (e) {
            console.warn("Error playing crisp can pop", e);
        }
    }

    // Alias for compatibility
    playCanCrack() {
        this.playCrispCanPop();
    }

    burstFizz(duration = 2.0) {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const bufferSize = Math.floor(this.ctx.sampleRate * duration);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);

            let last = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                last = (last * 0.85) + (white * 0.15);
                const pop = Math.random() > 0.982 ? (Math.random() - 0.5) * 2.2 : 0;
                data[i] = last + pop;
            }

            const source = this.ctx.createBufferSource();
            source.buffer = buffer;

            const hp = this.ctx.createBiquadFilter();
            hp.type = 'highpass';
            hp.frequency.setValueAtTime(3600, t);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.42, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

            source.connect(hp);
            hp.connect(gain);
            gain.connect(this.masterGain);

            source.start(t);
            source.stop(t + duration);
        } catch (e) {}
    }

    playIceClink() {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            this.triggerHaptic([15]);

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            const freq = 3200 + Math.random() * 800;
            osc.frequency.setValueAtTime(freq, t);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.12);

            gain.gain.setValueAtTime(0.35, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(t);
            osc.stop(t + 0.15);
        } catch (e) {}
    }

    playPressureRattle(intensity = 0.5) {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            this.triggerHaptic([20]);

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180 + intensity * 220, t);
            gain.gain.setValueAtTime(0.18 * intensity, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(t);
            osc.stop(t + 0.09);
        } catch (e) {}
    }

    playGeyserDetonate() {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            this.triggerHaptic([50, 100, 80, 50]);

            // Sub bass roar
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(110, t);
            osc.frequency.exponentialRampToValueAtTime(28, t + 1.2);
            gain.gain.setValueAtTime(1.0, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 1.3);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(t);
            osc.stop(t + 1.4);

            // Giant geyser roar
            this.burstFizz(3.5);
        } catch (e) {}
    }

    playWipeSqueak() {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1400 + Math.random() * 400, t);
            osc.frequency.linearRampToValueAtTime(2200, t + 0.05);

            gain.gain.setValueAtTime(0.1, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(t);
            osc.stop(t + 0.07);
        } catch (e) {}
    }

    playBeatPadSound(padIndex) {
        if (this.isMuted || !this.ctx) return;
        this.triggerHaptic([25]);

        switch (padIndex) {
            case 0: // Can Pop
                this.playCrispCanPop();
                break;
            case 1: // Ice Clink
                this.playIceClink();
                break;
            case 2: // Intense Fizz Sizzle
                this.burstFizz(1.2);
                break;
            case 3: // Metallic Rim Tap
                this.playMetalPing();
                break;
        }
    }

    playMetalPing() {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(2850, t);
            osc.frequency.exponentialRampToValueAtTime(1100, t + 0.18);
            gain.gain.setValueAtTime(0.4, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(t);
            osc.stop(t + 0.22);
        } catch (e) {}
    }

    playMetalCreak(intensity = 0.5) {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(550 + intensity * 450, t);
            osc.frequency.linearRampToValueAtTime(850 + intensity * 650, t + 0.06);

            gain.gain.setValueAtTime(0.09 * intensity, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(t);
            osc.stop(t + 0.08);
        } catch (e) {}
    }

    playClick() {
        if (this.isMuted || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1800, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(500, this.ctx.currentTime + 0.035);
            gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.04);
        } catch (e) {}
    }

    playWhoosh() {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(160, t);
            filter.frequency.exponentialRampToValueAtTime(1900, t + 0.16);
            filter.frequency.exponentialRampToValueAtTime(120, t + 0.42);

            gain.gain.setValueAtTime(0.01, t);
            gain.gain.linearRampToValueAtTime(0.35, t + 0.14);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.48);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);

            osc.start(t);
            osc.stop(t + 0.52);
        } catch (e) {}
    }
}

window.dietCokeAudio = new DietCokeAudioEngine();
