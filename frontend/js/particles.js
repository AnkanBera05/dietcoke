/**
 * HYPER-DYNAMIC CARBONATION & FIZZ PARTICLE PHYSICS
 * Advanced multi-layer particle system:
 * - Interactive cursor fizz vortex trail
 * - Expanding sonic shockwave blast rings
 * - Glistening effervescent micro-sparks
 * - Cryogenic dry ice mist clouds
 * - Bubble pop micro-splashes
 * - Mouse repulsion turbulence & scroll hyper-drive acceleration
 */

class FizzParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.particles = [];
        this.burstParticles = [];
        this.cursorSparks = [];
        this.shockwaves = [];
        this.mistParticles = [];

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouseX = this.width / 2;
        this.mouseY = this.height / 2;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        this.mouseSpeed = 0;
        this.scrollVelocity = 0;
        this.accentColor = { r: 228, g: 0, b: 43 }; // Diet Coke Red default
        this.isMobile = window.innerWidth < 768;
        this.maxAmbientBubbles = this.isMobile ? 60 : 160;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize(), { passive: true });

        // Cursor fizz vortex generator
        window.addEventListener('mousemove', (e) => {
            const dx = e.clientX - this.mouseX;
            const dy = e.clientY - this.mouseY;
            this.mouseSpeed = Math.min(Math.sqrt(dx * dx + dy * dy), 35);
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            // Spawn fizzy cursor trail when moving
            if (this.mouseSpeed > 4 && Math.random() > 0.3) {
                const count = Math.min(Math.floor(this.mouseSpeed * 0.35), 6);
                for (let i = 0; i < count; i++) {
                    this.cursorSparks.push(this.createCursorSpark(e.clientX, e.clientY));
                }
            }
        }, { passive: true });

        // Click Shockwave Blast
        window.addEventListener('click', (e) => {
            this.triggerShockwave(e.clientX, e.clientY);
            this.explodeBurst(e.clientX, e.clientY, 35);
        }, { passive: true });

        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            this.scrollVelocity = (currentScrollY - lastScrollY) * 0.25;
            lastScrollY = currentScrollY;
        }, { passive: true });

        // Ambient bubbles
        for (let i = 0; i < this.maxAmbientBubbles; i++) {
            this.particles.push(this.createBubble(true));
        }

        // Mist clouds
        const mistCount = this.isMobile ? 6 : 14;
        for (let i = 0; i < mistCount; i++) {
            this.mistParticles.push(this.createMist(true));
        }

        this.animate();
    }

    setAccentColor(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            this.accentColor = {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            };
        }
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.isMobile = this.width < 768;
        this.maxAmbientBubbles = this.isMobile ? 60 : 160;
    }

    createBubble(randomY = false) {
        return {
            x: Math.random() * this.width,
            y: randomY ? Math.random() * this.height : this.height + Math.random() * 50,
            radius: Math.random() * 4.0 + 1.2,
            baseSpeedY: Math.random() * 2.2 + 0.9,
            speedY: 0,
            speedX: (Math.random() - 0.5) * 0.8,
            wobbleSpeed: Math.random() * 0.05 + 0.02,
            wobbleDist: Math.random() * 2.0 + 0.6,
            wobblePhase: Math.random() * Math.PI * 2,
            alpha: Math.random() * 0.65 + 0.25,
            isSpark: Math.random() > 0.82
        };
    }

    createCursorSpark(x, y) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.5 + 1.0;
        return {
            x: x + (Math.random() - 0.5) * 16,
            y: y + (Math.random() - 0.5) * 16,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.2,
            radius: Math.random() * 2.8 + 1.0,
            alpha: 1.0,
            decay: Math.random() * 0.045 + 0.025,
            color: Math.random() > 0.4 ? this.accentColor : { r: 255, g: 255, b: 255 }
        };
    }

    createMist(randomY = false) {
        return {
            x: Math.random() * this.width,
            y: randomY ? Math.random() * this.height : this.height * 0.5 + (Math.random() - 0.5) * 350,
            radius: Math.random() * 150 + 90,
            alpha: Math.random() * 0.05 + 0.015,
            speedX: (Math.random() - 0.5) * 0.35,
            speedY: (Math.random() - 0.5) * 0.25
        };
    }

    triggerShockwave(x, y, maxRadius = 180, color = null) {
        this.shockwaves.push({
            x: x,
            y: y,
            radius: 5,
            maxRadius: maxRadius,
            alpha: 0.9,
            color: color || this.accentColor,
            speed: 7.5
        });
    }

    explodeBurst(x, y, count = 140, customColor = null) {
        const color = customColor || this.accentColor;
        const actualCount = this.isMobile ? Math.floor(count * 0.55) : count;

        this.triggerShockwave(x, y, 220, color);

        for (let i = 0; i < actualCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const force = Math.random() * 16 + 3;
            this.burstParticles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * force,
                vy: Math.sin(angle) * force - Math.random() * 5,
                radius: Math.random() * 5.0 + 1.5,
                alpha: 1.0,
                decay: Math.random() * 0.028 + 0.016,
                gravity: 0.22,
                color: Math.random() > 0.35 ? color : { r: 255, g: 255, b: 255 }
            });
        }
    }

    update() {
        this.scrollVelocity *= 0.90;
        this.mouseSpeed *= 0.92;

        // Ambient bubbles update
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.wobblePhase += p.wobbleSpeed;
            // Hyper-drive acceleration on scroll
            p.speedY = p.baseSpeedY + Math.abs(this.scrollVelocity * 0.9);

            // Cursor eddy turbulence
            const dx = p.x - this.mouseX;
            const dy = p.y - this.mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150 && dist > 0) {
                const force = (150 - dist) / 150;
                p.x += (dx / dist) * force * 5.0;
                p.y += (dy / dist) * force * 5.0;
            }

            p.x += Math.sin(p.wobblePhase) * p.wobbleDist + p.speedX;
            p.y -= p.speedY;

            if (p.y < -30 || p.x < -30 || p.x > this.width + 30) {
                this.particles[i] = this.createBubble(false);
            }
        }

        // Cursor sparks update
        for (let i = this.cursorSparks.length - 1; i >= 0; i--) {
            const sp = this.cursorSparks[i];
            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.vx *= 0.94;
            sp.vy *= 0.94;
            sp.alpha -= sp.decay;
            if (sp.alpha <= 0) {
                this.cursorSparks.splice(i, 1);
            }
        }

        // Burst particles update
        for (let i = this.burstParticles.length - 1; i >= 0; i--) {
            const bp = this.burstParticles[i];
            bp.x += bp.vx;
            bp.y += bp.vy;
            bp.vy += bp.gravity;
            bp.vx *= 0.95;
            bp.alpha -= bp.decay;
            if (bp.alpha <= 0) {
                this.burstParticles.splice(i, 1);
            }
        }

        // Shockwaves update
        for (let i = this.shockwaves.length - 1; i >= 0; i--) {
            const sw = this.shockwaves[i];
            sw.radius += sw.speed;
            sw.alpha = Math.max(0, 1 - (sw.radius / sw.maxRadius));
            if (sw.radius >= sw.maxRadius) {
                this.shockwaves.splice(i, 1);
            }
        }

        // Mist update
        for (let i = 0; i < this.mistParticles.length; i++) {
            const mp = this.mistParticles[i];
            mp.x += mp.speedX + (this.mouseX - this.width / 2) * 0.0003;
            mp.y += mp.speedY;
            if (mp.x < -mp.radius) mp.x = this.width + mp.radius;
            if (mp.x > this.width + mp.radius) mp.x = -mp.radius;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Volumetric Dry Ice Mist
        for (let i = 0; i < this.mistParticles.length; i++) {
            const mp = this.mistParticles[i];
            const grad = this.ctx.createRadialGradient(mp.x, mp.y, 0, mp.x, mp.y, mp.radius);
            grad.addColorStop(0, `rgba(${this.accentColor.r}, ${this.accentColor.g}, ${this.accentColor.b}, ${mp.alpha})`);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            this.ctx.fillStyle = grad;
            this.ctx.beginPath();
            this.ctx.arc(mp.x, mp.y, mp.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // 2. Expanding Shockwave Rings
        for (let i = 0; i < this.shockwaves.length; i++) {
            const sw = this.shockwaves[i];
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(${sw.color.r}, ${sw.color.g}, ${sw.color.b}, ${sw.alpha * 0.85})`;
            this.ctx.lineWidth = 3.5;
            this.ctx.shadowColor = `rgba(${sw.color.r}, ${sw.color.g}, ${sw.color.b}, 1)`;
            this.ctx.shadowBlur = 12;
            this.ctx.stroke();
            this.ctx.restore();
        }

        // 3. Ambient Effervescent Bubbles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

            if (p.isSpark) {
                this.ctx.fillStyle = `rgba(${this.accentColor.r}, ${this.accentColor.g}, ${this.accentColor.b}, ${p.alpha})`;
                this.ctx.shadowColor = `rgba(${this.accentColor.r}, ${this.accentColor.g}, ${this.accentColor.b}, 0.9)`;
                this.ctx.shadowBlur = 8;
                this.ctx.fill();
            } else {
                this.ctx.fillStyle = `rgba(230, 235, 245, ${p.alpha * 0.4})`;
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha * 0.9})`;
                this.ctx.lineWidth = 0.9;
                this.ctx.stroke();
                this.ctx.fill();

                // Specular highlight gleam
                this.ctx.beginPath();
                this.ctx.arc(p.x - p.radius * 0.35, p.y - p.radius * 0.35, p.radius * 0.28, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
                this.ctx.fill();
            }
            this.ctx.restore();
        }

        // 4. Cursor Fizz Vortex Sparks
        for (let i = 0; i < this.cursorSparks.length; i++) {
            const sp = this.cursorSparks[i];
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${sp.color.r}, ${sp.color.g}, ${sp.color.b}, ${sp.alpha})`;
            this.ctx.shadowColor = `rgba(${sp.color.r}, ${sp.color.g}, ${sp.color.b}, 0.8)`;
            this.ctx.shadowBlur = 6;
            this.ctx.fill();
            this.ctx.restore();
        }

        // 5. Burst Explosion Particles
        for (let i = 0; i < this.burstParticles.length; i++) {
            const bp = this.burstParticles[i];
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(bp.x, bp.y, bp.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${bp.color.r}, ${bp.color.g}, ${bp.color.b}, ${bp.alpha})`;
            this.ctx.shadowColor = `rgba(${bp.color.r}, ${bp.color.g}, ${bp.color.b}, 1)`;
            this.ctx.shadowBlur = 10;
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

window.FizzParticleSystem = FizzParticleSystem;
