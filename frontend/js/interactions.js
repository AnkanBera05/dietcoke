/**
 * DIET COKE 5 INTERACTIVE LABS
 * 1. Can Pressure Shaker (Shake to Detonate Geyser)
 * 2. Commercial Beatpad & Audio Sequencer
 * 3. Condensation Frost Wiper (Scratch the Frost)
 * 4. Custom Flavor Lab (Mix & Design Your Edition)
 * 5. Ice Cube Slingshot & Clinker
 */

class DietCokeInteractions {
    constructor() {
        this.initShaker();
        this.initBeatpad();
        this.initFrostWiper();
        this.initFlavorLab();
        this.initIceSlingshot();
    }

    // =========================================================================
    // 1. THE PRESSURE SHAKER ("SHAKE TO DETONATE")
    // =========================================================================
    initShaker() {
        this.shakeCan = document.getElementById('shakerCanMockup');
        this.shakeBtn = document.getElementById('shakerTriggerBtn');
        this.shakeReleaseBtn = document.getElementById('shakerReleaseBtn');
        this.psiMeter = document.getElementById('shakerPsiFill');
        this.psiValue = document.getElementById('shakerPsiValue');
        this.pressureLevel = 0; // 0 to 100
        this.shakeDecayTimer = null;

        if (!this.shakeBtn || !this.shakeCan) return;

        const doShake = () => {
            if (this.pressureLevel >= 100) return;
            this.pressureLevel = Math.min(this.pressureLevel + 14, 100);
            this.updateShakerUI();

            // Audio rattle
            if (window.dietCokeAudio) {
                window.dietCokeAudio.playPressureRattle(this.pressureLevel / 100);
            }

            // Can rattle shake
            this.shakeCan.classList.remove('rattling');
            void this.shakeCan.offsetWidth;
            this.shakeCan.classList.add('rattling');

            // Emit tiny fizz sparks
            if (window.fizzParticles) {
                const r = this.shakeCan.getBoundingClientRect();
                window.fizzParticles.explodeBurst(r.left + r.width / 2, r.top + r.height * 0.3, 15);
            }
        };

        this.shakeBtn.addEventListener('click', doShake);
        this.shakeBtn.addEventListener('touchstart', (e) => { e.preventDefault(); doShake(); }, { passive: false });

        // Motion Shake for Mobile (DeviceMotionEvent)
        if (window.DeviceMotionEvent) {
            let lastX = 0, lastY = 0, lastZ = 0;
            window.addEventListener('devicemotion', (e) => {
                const acc = e.accelerationIncludingGravity;
                if (!acc) return;
                const delta = Math.abs(acc.x - lastX) + Math.abs(acc.y - lastY) + Math.abs(acc.z - lastZ);
                if (delta > 22) {
                    doShake();
                }
                lastX = acc.x; lastY = acc.y; lastZ = acc.z;
            }, { passive: true });
        }

        if (this.shakeReleaseBtn) {
            this.shakeReleaseBtn.addEventListener('click', () => this.detonateGeyser());
        }
    }

    updateShakerUI() {
        if (this.psiMeter) this.psiMeter.style.width = `${this.pressureLevel}%`;
        if (this.psiValue) this.psiValue.textContent = `${Math.round(this.pressureLevel * 1.5)} PSI`;

        if (this.pressureLevel >= 85) {
            this.psiValue.style.color = '#FF1A46';
            if (this.shakeReleaseBtn) this.shakeReleaseBtn.style.display = 'inline-flex';
        } else {
            this.psiValue.style.color = '#FFFFFF';
        }
    }

    detonateGeyser() {
        if (!this.shakeCan) return;

        // Sound
        if (window.dietCokeAudio) {
            window.dietCokeAudio.playGeyserDetonate();
        }

        // Violent screen rumble
        document.body.classList.add('screen-rumble');
        setTimeout(() => document.body.classList.remove('screen-rumble'), 800);

        // Huge shockwave and 250 particle eruption
        if (window.fizzParticles) {
            const r = this.shakeCan.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height * 0.2;
            window.fizzParticles.triggerShockwave(cx, cy, 350, { r: 255, g: 255, b: 255 });
            window.fizzParticles.explodeBurst(cx, cy, 220, { r: 255, g: 0, b: 43 });
            setTimeout(() => {
                window.fizzParticles.explodeBurst(cx, cy, 140, { r: 255, g: 255, b: 255 });
            }, 150);
        }

        // Spray visual
        const spray = document.getElementById('shakerSpray');
        if (spray) {
            spray.classList.add('active');
            setTimeout(() => spray.classList.remove('active'), 2000);
        }

        // Reset
        this.pressureLevel = 0;
        this.updateShakerUI();
        if (this.shakeReleaseBtn) this.shakeReleaseBtn.style.display = 'none';
    }

    // =========================================================================
    // 2. COMMERCIAL BEATPAD & AUDIO SOUNDBOARD
    // =========================================================================
    initBeatpad() {
        const pads = document.querySelectorAll('.beatpad-key');
        const eqBars = document.querySelectorAll('.eq-bar');

        pads.forEach(pad => {
            const padHandler = () => {
                const idx = parseInt(pad.getAttribute('data-pad') || '0');
                if (window.dietCokeAudio) {
                    window.dietCokeAudio.playBeatPadSound(idx);
                }

                // Visualizer dance
                eqBars.forEach(b => {
                    b.style.height = `${Math.floor(Math.random() * 80 + 20)}%`;
                    setTimeout(() => { b.style.height = `${Math.floor(Math.random() * 25 + 5)}%`; }, 250);
                });

                // Pad active spring
                pad.classList.add('hit');
                setTimeout(() => pad.classList.remove('hit'), 180);

                // Embers
                if (window.fizzParticles) {
                    const r = pad.getBoundingClientRect();
                    window.fizzParticles.explodeBurst(r.left + r.width / 2, r.top + r.height / 2, 25);
                }
            };

            pad.addEventListener('click', padHandler);
            pad.addEventListener('touchstart', (e) => { e.preventDefault(); padHandler(); }, { passive: false });
        });
    }

    // =========================================================================
    // 3. CONDENSATION FROST WIPER ("SCRATCH THE FROST")
    // =========================================================================
    initFrostWiper() {
        const canvas = document.getElementById('frostCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const counter = document.getElementById('frostCounter');
        let isWiping = false;
        let clearedPixels = 0;

        const resize = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            drawInitialFrost();
        };

        const drawInitialFrost = () => {
            // Draw opaque frosty ice layer with condensation texture
            ctx.fillStyle = 'rgba(215, 225, 235, 0.94)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Frost noise & ice crystals
            for (let i = 0; i < 400; i++) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
                ctx.beginPath();
                ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3 + 1, 0, Math.PI * 2);
                ctx.fill();
            }

            // Dripping condensation trails
            ctx.strokeStyle = 'rgba(180, 200, 220, 0.4)';
            ctx.lineWidth = 2;
            for (let i = 0; i < 15; i++) {
                const sx = Math.random() * canvas.width;
                const sy = Math.random() * (canvas.height * 0.5);
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx + (Math.random() - 0.5) * 8, sy + Math.random() * 80 + 40);
                ctx.stroke();
            }
        };

        const wipe = (x, y) => {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 36, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';

            if (Math.random() > 0.8 && window.dietCokeAudio) {
                window.dietCokeAudio.playWipeSqueak();
            }

            clearedPixels += 1;
            if (counter && clearedPixels % 8 === 0) {
                const pct = Math.min(Math.round((clearedPixels / 280) * 100), 100);
                counter.textContent = `${pct}% CLEARED`;
                if (pct >= 85) {
                    counter.textContent = "100% CHILL UNLOCKED!";
                    counter.style.color = "#00E676";
                }
            }
        };

        canvas.addEventListener('mousedown', (e) => {
            isWiping = true;
            const r = canvas.getBoundingClientRect();
            wipe(e.clientX - r.left, e.clientY - r.top);
        });

        window.addEventListener('mousemove', (e) => {
            if (!isWiping) return;
            const r = canvas.getBoundingClientRect();
            wipe(e.clientX - r.left, e.clientY - r.top);
        });

        window.addEventListener('mouseup', () => { isWiping = false; });

        // Mobile touch wiping
        canvas.addEventListener('touchstart', (e) => {
            isWiping = true;
            const r = canvas.getBoundingClientRect();
            const t = e.touches[0];
            wipe(t.clientX - r.left, t.clientY - r.top);
        }, { passive: true });

        canvas.addEventListener('touchmove', (e) => {
            if (!isWiping) return;
            const r = canvas.getBoundingClientRect();
            const t = e.touches[0];
            wipe(t.clientX - r.left, t.clientY - r.top);
        }, { passive: true });

        canvas.addEventListener('touchend', () => { isWiping = false; });

        window.addEventListener('resize', resize);
        setTimeout(resize, 200);

        const resetBtn = document.getElementById('frostResetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                clearedPixels = 0;
                if (counter) counter.textContent = '0% CLEARED';
                drawInitialFrost();
            });
        }
    }

    // =========================================================================
    // 4. CUSTOM FLAVOR LAB ("CREATE YOUR EDITION")
    // =========================================================================
    initFlavorLab() {
        const baseSelect = document.getElementById('labBase');
        const infusionSelect = document.getElementById('labInfusion');
        const nameInput = document.getElementById('labNameInput');
        const previewCan = document.getElementById('labCanPreview');
        const previewBadge = document.getElementById('labBadgePreview');
        const previewName = document.getElementById('labNamePreview');

        const updateLabPreview = () => {
            const base = baseSelect ? baseSelect.value : 'silver';
            const infusion = infusionSelect ? infusionSelect.value : '#E4002B';
            const customTitle = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : "YOUR EDITION";

            if (previewCan) {
                previewCan.style.background = `linear-gradient(135deg, ${base === 'obsidian' ? '#111' : '#E0E4E8'} 20%, ${infusion} 70%, #000 100%)`;
                previewCan.style.boxShadow = `0 20px 60px ${infusion}66`;
            }

            if (previewBadge) {
                previewBadge.textContent = base.toUpperCase();
                previewBadge.style.color = infusion;
                previewBadge.style.borderColor = infusion;
            }

            if (previewName) {
                previewName.textContent = customTitle.toUpperCase();
            }
        };

        if (baseSelect) baseSelect.addEventListener('change', updateLabPreview);
        if (infusionSelect) infusionSelect.addEventListener('change', updateLabPreview);
        if (nameInput) nameInput.addEventListener('input', updateLabPreview);

        const labSaveBtn = document.getElementById('labSaveBtn');
        if (labSaveBtn) {
            labSaveBtn.addEventListener('click', () => {
                if (window.dietCokeAudio) window.dietCokeAudio.playCrispCanPop();
                if (window.fizzParticles) {
                    window.fizzParticles.explodeBurst(window.innerWidth * 0.5, window.innerHeight * 0.5, 120);
                }
                alert("✨ Custom Diet Coke Edition created! Your can formula is now locked in!");
            });
        }
    }

    // =========================================================================
    // 5. ICE CUBE SLINGSHOT ("TOSS THE ICE")
    // =========================================================================
    initIceSlingshot() {
        const slingshotStage = document.getElementById('slingshotStage');
        const icePuck = document.getElementById('icePuck');
        const scoreCounter = document.getElementById('iceScore');
        const targetCan = document.getElementById('slingshotTargetCan');

        if (!slingshotStage || !icePuck) return;

        let isDraggingIce = false;
        let startX = 0, startY = 0;
        let currentX = 0, currentY = 0;
        let score = 0;

        const onStart = (cx, cy) => {
            isDraggingIce = true;
            startX = cx;
            startY = cy;
            icePuck.style.transition = 'none';
        };

        const onMove = (cx, cy) => {
            if (!isDraggingIce) return;
            currentX = Math.min(Math.max(cx - startX, -70), 70);
            currentY = Math.min(Math.max(cy - startY, -20), 80);
            icePuck.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        };

        const onRelease = () => {
            if (!isDraggingIce) return;
            isDraggingIce = false;

            // Fling forward into the can
            const flingX = -currentX * 2.8;
            const flingY = -currentY * 4.0 - 240;

            icePuck.style.transition = 'transform 0.45s cubic-bezier(0.12, 0.8, 0.32, 1)';
            icePuck.style.transform = `translate3d(${flingX}px, ${flingY}px, 0) scale(0.6) rotate(180deg)`;

            // Sound
            setTimeout(() => {
                if (window.dietCokeAudio) {
                    window.dietCokeAudio.playIceClink();
                }
                score += 1;
                if (scoreCounter) scoreCounter.textContent = `HITS: ${score}`;

                // Can hit wobble
                if (targetCan) {
                    targetCan.classList.add('hit-wobble');
                    setTimeout(() => targetCan.classList.remove('hit-wobble'), 300);
                }

                // Particle splash
                if (window.fizzParticles) {
                    const r = targetCan ? targetCan.getBoundingClientRect() : slingshotStage.getBoundingClientRect();
                    window.fizzParticles.explodeBurst(r.left + r.width / 2, r.top + r.height * 0.4, 45, { r: 220, g: 240, b: 255 });
                }

                // Snap ice back to slingshot cradle
                setTimeout(() => {
                    icePuck.style.transition = 'transform 0.3s ease';
                    icePuck.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
                }, 350);
            }, 300);
        };

        icePuck.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
        window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
        window.addEventListener('mouseup', onRelease);

        icePuck.addEventListener('touchstart', (e) => {
            const t = e.touches[0];
            onStart(t.clientX, t.clientY);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!isDraggingIce) return;
            const t = e.touches[0];
            onMove(t.clientX, t.clientY);
        }, { passive: true });

        window.addEventListener('touchend', onRelease);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.dietCokeInteractions = new DietCokeInteractions();
});
