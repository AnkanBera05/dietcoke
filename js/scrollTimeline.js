/**
 * SCROLL-TRIGGERED CINEMATIC TIMELINE & RED LIQUID TRANSITION
 * Manages Scenes 1 to 8:
 * - Headline word-split kinematics
 * - 3D camera zoom & can lateral translation
 * - Floating informational callout reveals
 * - Thousands of bubbles exploding at climax
 * - Full-screen Diet Coke red liquid wave transition
 * - Section reveals
 */

class CinematicScrollController {
    constructor() {
        this.redTransitionOverlay = document.getElementById('redTransitionOverlay');
        this.infoCallouts = document.querySelectorAll('.scene-callout');
        this.hasTriggeredScene6Burst = false;
        this.playedWhoosh = false;

        this.init();
    }

    init() {
        this.hideRedOverlay();

        // Register GSAP plugins if available
        if (window.gsap && window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
            this.buildGsapTimeline();
        } else {
            this.buildRafScrollFallback();
        }

        this.setupFizzSection();
    }

    hideRedOverlay() {
        if (!this.redTransitionOverlay) return;
        this.redTransitionOverlay.style.opacity = '0';
        this.redTransitionOverlay.style.visibility = 'hidden';
        this.redTransitionOverlay.style.clipPath = 'polygon(0 0, 0 0, 0 100%, 0 100%)';
    }

    buildGsapTimeline() {
        // 1. Hero Text Word Splitting Kinematics
        const heroWords = document.querySelectorAll('.hero-headline-word');
        if (heroWords.length > 0) {
            gsap.timeline({
                scrollTrigger: {
                    trigger: "#hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.2
                }
            })
            .to(heroWords[0], { x: -140, y: -60, rotateZ: -12, opacity: 0.15, filter: "blur(6px)" }, 0)
            .to(heroWords[1], { scale: 1.5, y: -90, opacity: 0.1, filter: "blur(8px)" }, 0)
            .to(heroWords[2], { x: 160, y: -40, rotateZ: 8, opacity: 0.2, filter: "blur(4px)" }, 0);
        }

        // 2. Scene 4 & 5: Information Callouts Appearance
        if (this.infoCallouts.length > 0) {
            gsap.timeline({
                scrollTrigger: {
                    trigger: "#experience",
                    start: "top 75%",
                    end: "center center",
                    scrub: 1
                }
            })
            .fromTo(this.infoCallouts, 
                { opacity: 0, y: 50, scale: 0.8 },
                { opacity: 1, y: 0, scale: 1, stagger: 0.2, ease: "power2.out" }
            );
        }

        // 3. Scene 6: Carbonation Bubble Explosion Trigger
        ScrollTrigger.create({
            trigger: "#experience",
            start: "center 45%",
            onEnter: () => {
                if (!this.hasTriggeredScene6Burst && window.fizzParticles) {
                    this.hasTriggeredScene6Burst = true;
                    window.fizzParticles.explodeBurst(window.innerWidth * 0.5, window.innerHeight * 0.45, 240, { r: 255, g: 255, b: 255 });
                    setTimeout(() => {
                        window.fizzParticles.explodeBurst(window.innerWidth * 0.5, window.innerHeight * 0.45, 120, { r: 228, g: 0, b: 43 });
                    }, 140);
                    if (window.dietCokeAudio) window.dietCokeAudio.playCanCrack();
                }
            },
            onLeaveBack: () => {
                this.hasTriggeredScene6Burst = false;
            }
        });

        // 4. Scene 7: Full-Screen Red Transition Wave (Sweeps in & exits smoothly)
        const triggerEl = document.getElementById('transitionTrigger');
        if (triggerEl) {
            ScrollTrigger.create({
                trigger: triggerEl,
                start: "top 70%",
                end: "bottom 20%",
                scrub: 0.8,
                onUpdate: (self) => {
                    this.updateRedSweep(self.progress);
                },
                onLeave: () => {
                    this.hideRedOverlay();
                },
                onLeaveBack: () => {
                    this.hideRedOverlay();
                }
            });
        }
    }

    buildRafScrollFallback() {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = window.innerHeight;
            const progress = Math.min(Math.max(scrollY / heroHeight, 0), 1);

            const heroWords = document.querySelectorAll('.hero-headline-word');
            if (heroWords.length >= 3) {
                heroWords[0].style.transform = `translate3d(${-progress * 120}px, ${-progress * 40}px, 0) rotateZ(${-progress * 8}deg)`;
                heroWords[1].style.transform = `translate3d(0, ${-progress * 60}px, 0) scale(${1 + progress * 0.4})`;
                heroWords[2].style.transform = `translate3d(${progress * 130}px, ${-progress * 30}px, 0) rotateZ(${progress * 6}deg)`;
            }

            const expElem = document.getElementById('experience');
            if (expElem) {
                const rect = expElem.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.6 && !this.hasTriggeredScene6Burst) {
                    this.hasTriggeredScene6Burst = true;
                    if (window.fizzParticles) {
                        window.fizzParticles.explodeBurst(window.innerWidth / 2, window.innerHeight / 2, 200);
                    }
                }
            }
        }, { passive: true });
    }

    updateRedSweep(progress) {
        if (!this.redTransitionOverlay) return;

        // If at boundaries, guarantee it is completely hidden
        if (progress <= 0.05 || progress >= 0.95) {
            this.hideRedOverlay();
            return;
        }

        this.redTransitionOverlay.style.visibility = 'visible';

        // Wave sweep:
        // From 0.05 to 0.50: right edge expands from 0% to 100%
        // From 0.50 to 0.95: left edge catches up from 0% to 100%
        let leftEdge = 0;
        let rightEdge = 100;

        if (progress < 0.5) {
            // Expanding in
            const localP = (progress - 0.05) / 0.45;
            leftEdge = 0;
            rightEdge = Math.min(Math.max(localP * 100, 0), 100);
            this.redTransitionOverlay.style.opacity = Math.min(localP * 2, 1).toString();
        } else {
            // Exiting out
            const localP = (progress - 0.5) / 0.45;
            leftEdge = Math.min(Math.max(localP * 100, 0), 100);
            rightEdge = 100;
            this.redTransitionOverlay.style.opacity = Math.max(1 - localP * 1.5, 0).toString();
        }

        // Polygon wave
        this.redTransitionOverlay.style.clipPath = `polygon(${leftEdge}% 0%, ${rightEdge}% 0%, ${rightEdge}% 100%, ${leftEdge}% 100%)`;

        if (progress > 0.45 && progress < 0.55 && window.dietCokeAudio && !this.playedWhoosh) {
            this.playedWhoosh = true;
            window.dietCokeAudio.playWhoosh();
            setTimeout(() => { this.playedWhoosh = false; }, 1200);
        }
    }

    setupFizzSection() {
        const fizzSection = document.getElementById('fizz');
        if (!fizzSection) return;

        window.addEventListener('scroll', () => {
            const rect = fizzSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                if (window.fizzParticles) {
                    window.fizzParticles.scrollVelocity += 1.8;
                }
            }
        }, { passive: true });
    }
}

window.CinematicScrollController = CinematicScrollController;
