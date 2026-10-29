/**
 * INTERACTIVE "PULL TO OPEN" CAN SIMULATION (HYPER-ANIMATED)
 * Features metal strain resistance, audio creak feedback,
 * violent camera shake, dual shockwave detonation, and geyser fizz fountains.
 */

class InteractiveCanOpener {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.tab = document.getElementById('openerTab');
        this.seal = document.getElementById('openerSeal');
        this.statusText = document.getElementById('openerStatus');
        this.instructionText = document.getElementById('openerInstruction');
        this.resetBtn = document.getElementById('openerResetBtn');
        this.fizzSpray = document.getElementById('openerSpray');

        this.isDragging = false;
        this.isOpened = false;
        this.startY = 0;
        this.dragProgress = 0;
        this.threshold = 0.62;
        this.lastSoundProgress = 0;

        this.init();
    }

    init() {
        if (!this.tab) return;

        this.tab.addEventListener('mousedown', (e) => this.onDragStart(e.clientY));
        window.addEventListener('mousemove', (e) => this.onDragMove(e.clientY));
        window.addEventListener('mouseup', () => this.onDragEnd());

        // Support both tab and lid touch target for effortless mobile gestures
        const lid = document.querySelector('.opener-lid-mockup');
        const touchTargets = [this.tab, lid].filter(Boolean);

        touchTargets.forEach(el => {
            el.addEventListener('touchstart', (e) => {
                if (e.touches.length > 0) this.onDragStart(e.touches[0].clientY);
            }, { passive: false });
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0 && this.isDragging) {
                e.preventDefault();
                this.onDragMove(e.touches[0].clientY);
            }
        }, { passive: false });

        window.addEventListener('touchend', () => this.onDragEnd());

        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.resetCan());
        }
    }

    onDragStart(clientY) {
        if (this.isOpened) return;
        this.isDragging = true;
        this.startY = clientY;
        this.tab.classList.add('grabbing');
        if (window.dietCokeAudio) {
            window.dietCokeAudio.playClick();
        }
    }

    onDragMove(clientY) {
        if (!this.isDragging || this.isOpened) return;

        const deltaY = this.startY - clientY;
        const maxDrag = 150;
        this.dragProgress = Math.min(Math.max(deltaY / maxDrag, 0), 1);

        this.updateVisuals(this.dragProgress);

        // Sound effect as resistance builds up
        if (Math.abs(this.dragProgress - this.lastSoundProgress) > 0.15) {
            this.lastSoundProgress = this.dragProgress;
            if (window.dietCokeAudio) {
                window.dietCokeAudio.playMetalCreak(this.dragProgress);
            }
        }

        if (this.dragProgress >= this.threshold && !this.isOpened) {
            this.triggerCanOpen();
        }
    }

    onDragEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.tab.classList.remove('grabbing');

        if (!this.isOpened) {
            this.dragProgress = 0;
            this.updateVisuals(0);
        }
    }

    updateVisuals(progress) {
        const tabRotation = progress * 72;
        const tabElevation = progress * 28;
        this.tab.style.transform = `rotateX(${tabRotation}deg) translateY(-${tabElevation}px) translateZ(${progress * 15}px)`;

        if (this.seal) {
            const sealDepression = progress * 10;
            this.seal.style.transform = `scale(${1 - progress * 0.12}) translateY(${sealDepression}px)`;
            this.seal.style.opacity = `${1 - progress * 0.45}`;
        }

        // Strain vignette glow on container
        if (this.container) {
            this.container.style.boxShadow = `0 24px 80px rgba(228, 0, 43, ${progress * 0.45})`;
        }
    }

    triggerCanOpen() {
        this.isOpened = true;
        this.isDragging = false;
        this.tab.classList.remove('grabbing');
        this.tab.classList.add('opened');

        // Play authentic procedural audio
        if (window.dietCokeAudio) {
            window.dietCokeAudio.playCanCrack();
        }

        // Snap tab completely back
        this.tab.style.transform = 'rotateX(86deg) translateY(-36px) translateZ(14px)';

        // Flap drops into the can
        if (this.seal) {
            this.seal.style.transform = 'rotateX(-75deg) translateY(22px) scale(0.85)';
            this.seal.style.opacity = '0.15';
        }

        // Violent screen camera shake
        this.container.classList.add('can-shake');
        document.body.classList.add('screen-rumble');
        setTimeout(() => {
            this.container.classList.remove('can-shake');
            document.body.classList.remove('screen-rumble');
        }, 600);

        // Huge particle detonations & shockwave rings
        if (window.fizzParticles) {
            const rect = this.container.getBoundingClientRect();
            const burstX = rect.left + rect.width / 2;
            const burstY = rect.top + rect.height * 0.40;

            window.fizzParticles.triggerShockwave(burstX, burstY, 320, { r: 255, g: 255, b: 255 });
            window.fizzParticles.explodeBurst(burstX, burstY, 220, { r: 255, g: 255, b: 255 });
            
            setTimeout(() => {
                window.fizzParticles.triggerShockwave(burstX, burstY, 260, { r: 228, g: 0, b: 43 });
                window.fizzParticles.explodeBurst(burstX, burstY, 140, { r: 228, g: 0, b: 43 });
            }, 100);

            setTimeout(() => {
                window.fizzParticles.explodeBurst(burstX, burstY, 80, { r: 255, g: 220, b: 220 });
            }, 250);
        }

        // Geyser spray effect
        if (this.fizzSpray) {
            this.fizzSpray.classList.add('active');
            setTimeout(() => this.fizzSpray.classList.remove('active'), 1800);
        }

        // Text reveal with kinetic punch
        if (this.instructionText) {
            this.instructionText.style.opacity = '0';
        }

        if (this.statusText) {
            this.statusText.textContent = "AHHH. THAT'S BETTER.";
            this.statusText.classList.add('glow', 'kinetic-punch');
        }

        if (this.resetBtn) {
            this.resetBtn.style.display = 'inline-flex';
            this.resetBtn.style.opacity = '1';
        }

        // Telemetry
        fetch('/api/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event_type: 'can_pop' })
        }).catch(() => {});
    }

    resetCan() {
        this.isOpened = false;
        this.dragProgress = 0;
        this.tab.classList.remove('opened');
        this.updateVisuals(0);

        if (this.seal) {
            this.seal.style.transform = 'none';
            this.seal.style.opacity = '1';
        }

        if (this.statusText) {
            this.statusText.textContent = "PULL TO OPEN";
            this.statusText.classList.remove('glow', 'kinetic-punch');
        }

        if (this.instructionText) {
            this.instructionText.style.opacity = '1';
        }

        if (this.resetBtn) {
            this.resetBtn.style.display = 'none';
        }

        if (this.container) {
            this.container.style.boxShadow = '';
        }

        if (window.dietCokeAudio) {
            window.dietCokeAudio.playClick();
        }
    }
}

window.InteractiveCanOpener = InteractiveCanOpener;
