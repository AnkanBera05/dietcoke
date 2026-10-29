/**
 * DIET COKE PROMOTIONAL EXPERIENCE - CORE ORCHESTRATOR
 * Unites 3D Can, Particle Physics, Web Audio, GSAP Timeline,
 * Dynamic Content Hydration, Interactive Can Opener, and Mobile Menus.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Audio Engine
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    if (soundToggleBtn && window.dietCokeAudio) {
        soundToggleBtn.addEventListener('click', () => {
            const isPlaying = window.dietCokeAudio.toggleMute();
            soundToggleBtn.classList.toggle('active', isPlaying);
            const label = soundToggleBtn.querySelector('.sound-label');
            if (label) {
                label.textContent = isPlaying ? 'SOUND ON' : 'SOUND OFF';
            }
            // Send telemetry event
            if (isPlaying) {
                fetch('/api/telemetry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ event_type: 'sound_toggle' })
                }).catch(() => {});
            }
        });
    }

    // 2. Initialize Particle System
    if (window.FizzParticleSystem) {
        window.fizzParticles = new FizzParticleSystem('fizzCanvas');
    }

    // 3. Initialize 3D Can Experience
    if (window.DietCoke3DExperience) {
        window.dietCoke3D = new DietCoke3DExperience('threeCanContainer');
    }

    // 4. Initialize Interactive Pull-Tab Can Opener
    if (window.InteractiveCanOpener) {
        window.canOpener = new InteractiveCanOpener('canOpenerStage');
    }

    // 5. Initialize Flavor Selector
    if (window.FlavorSelector) {
        window.flavorSelector = new FlavorSelector('flavors');
    }

    // 6. Initialize Product Carousel
    if (window.CinematicProductCarousel) {
        window.productCarousel = new CinematicProductCarousel('products');
    }

    // 7. Initialize Cinematic Scroll Timeline
    if (window.CinematicScrollController) {
        window.scrollTimeline = new CinematicScrollController();
    }

    // 8. Hydrate Dynamic Content from Backend API
    await hydrateSiteContent();

    // 9. Floating Glass Navbar Scroll Behavior
    const mainNav = document.getElementById('mainNav');
    window.addEventListener('scroll', () => {
        if (!mainNav) return;
        if (window.scrollY > 40) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    }, { passive: true });

    // 10. Mobile Menu Hamburger Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileNavOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileNavOverlay.classList.toggle('open');
            mobileMenuBtn.classList.toggle('active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavOverlay.classList.remove('open');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 11. Custom Desktop Cursor (Disabled on Touch / Mobile)
    setupCustomCursor();

    // 12. Magnetic Interactive Buttons
    setupMagneticButtons();

    // 13. Record Visitor Telemetry
    recordVisit();
});

function setupMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const magneticElements = document.querySelectorAll('.cta-button, .cta-secondary-btn, .carousel-nav-btn, .sound-toggle-btn');
    
    magneticElements.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const relX = e.clientX - (rect.left + rect.width / 2);
            const relY = e.clientY - (rect.top + rect.height / 2);
            btn.style.transform = `translate3d(${relX * 0.28}px, ${relY * 0.28}px, 0) scale(1.04)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            setTimeout(() => { btn.style.transition = ''; }, 400);
        });
    });
}

async function hydrateSiteContent() {
    try {
        const resp = await fetch('/api/content');
        if (!resp.ok) return;
        const content = await resp.json();

        // Hero headlines
        const hw1 = document.getElementById('heroWord1');
        const hw2 = document.getElementById('heroWord2');
        const hw3 = document.getElementById('heroWord3');
        const sub = document.getElementById('heroSubheadline');
        const cta = document.getElementById('heroCtaBtn');

        if (hw1 && content.hero_headline_1) hw1.textContent = content.hero_headline_1;
        if (hw2 && content.hero_headline_2) hw2.textContent = content.hero_headline_2;
        if (hw3 && content.hero_headline_3) hw3.textContent = content.hero_headline_3;
        if (sub && content.hero_subheadline) sub.textContent = content.hero_subheadline;
        if (cta && content.hero_cta) cta.textContent = content.hero_cta;

        // Ticker announcement
        const ticker = document.getElementById('announcementTicker');
        if (ticker && content.ticker_announcement) ticker.textContent = content.ticker_announcement;

        // Fizz section
        const fizzH = document.getElementById('fizzHeadline');
        const fizzSub = document.getElementById('fizzSubheadline');
        if (fizzH && content.fizz_headline) fizzH.textContent = content.fizz_headline;
        if (fizzSub && content.fizz_subheadline) fizzSub.textContent = content.fizz_subheadline;

        // Story section
        const storyH = document.getElementById('storyHeading');
        const storyB = document.getElementById('storyBody');
        if (storyH && content.story_heading) storyH.textContent = content.story_heading;
        if (storyB && content.story_body) storyB.textContent = content.story_body;

        // Stats
        const statSugar = document.getElementById('statSugar');
        const statCal = document.getElementById('statCalories');
        const statRef = document.getElementById('statRefresh');
        const statYear = document.getElementById('statYear');

        if (statSugar && content.stat_sugar) statSugar.textContent = content.stat_sugar;
        if (statCal && content.stat_calories) statCal.textContent = content.stat_calories;
        if (statRef && content.stat_refreshment) statRef.textContent = content.stat_refreshment;
        if (statYear && content.stat_year) statYear.textContent = content.stat_year;

    } catch (e) {
        console.warn("Could not hydrate site content", e);
    }
}

function setupCustomCursor() {
    // Only enable cursor on devices with fine pointer (non-touch)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    if (!cursorDot || !cursorRing) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    const interactiveSelectors = 'a, button, input, .flavor-pill-btn, #openerTab, .carousel-slide';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            cursorRing.classList.add('hovering');
        } else {
            cursorRing.classList.remove('hovering');
        }
    });

    function renderCursor() {
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        requestAnimationFrame(renderCursor);
    }
    renderCursor();
}

function recordVisit() {
    fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: 'visit' })
    }).catch(() => {});
}
