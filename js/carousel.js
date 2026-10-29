/**
 * CINEMATIC PRODUCT CAROUSEL
 * Features oversized visuals, sleek "01 / 04" progress indicator,
 * mouse dragging, touch swiping, keyboard arrow navigation,
 * and API-driven product integration.
 */

class CinematicProductCarousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.slideTrack = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('carouselPrev');
        this.nextBtn = document.getElementById('carouselNext');
        this.currentCounter = document.getElementById('carouselCounterCurrent');
        this.totalCounter = document.getElementById('carouselCounterTotal');
        this.progressBar = document.getElementById('carouselProgressBar');

        this.products = [];
        this.currentIndex = 0;
        this.isDragging = false;
        this.startX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;

        this.init();
    }

    async init() {
        try {
            const resp = await fetch('/api/products');
            this.products = await resp.json();
        } catch (e) {
            console.warn("Using fallback products for carousel", e);
            this.products = [
                {
                    slug: "original",
                    name: "Diet Coke Original",
                    tagline: "The Unapologetic Silver Legend",
                    accent_color: "#E4002B",
                    badge: "ICONIC ORIGINAL",
                    calories: 0,
                    sugar: "0g",
                    caffeine: "46mg",
                    volume: "355 mL / 12 FL OZ",
                    description: "Crisp, cold, and unmistakably bold. The timeless silver aluminum icon crafted with zero sugar, zero calories, and maximum effervescence."
                },
                {
                    slug: "cherry",
                    name: "Diet Coke Feisty Cherry",
                    tagline: "A Fiery Twist of Midnight Cherry",
                    accent_color: "#B81D39",
                    badge: "FAN FAVORITE",
                    calories: 0,
                    sugar: "0g",
                    caffeine: "46mg",
                    volume: "355 mL / 12 FL OZ",
                    description: "An electrifying collision of deep dark cherry aromatics infused into our razor-sharp silver fizz. Tart, sultry, and instantly refreshing."
                },
                {
                    slug: "lime",
                    name: "Diet Coke Sublime Lime",
                    tagline: "Ultra-Crisp Zesty Shockwave",
                    accent_color: "#00A859",
                    badge: "CITRUS SURGE",
                    calories: 0,
                    sugar: "0g",
                    caffeine: "46mg",
                    volume: "355 mL / 12 FL OZ",
                    description: "Sun-kissed Persian lime peel oils meeting explosive silver carbonation. A razor-sharp citrus zap that cuts through the heat instantly."
                },
                {
                    slug: "vanilla",
                    name: "Diet Coke Velvet Vanilla",
                    tagline: "Madagascar Silk Meets Raw Fizz",
                    accent_color: "#E5A93C",
                    badge: "LIMITED EDITION",
                    calories: 0,
                    sugar: "0g",
                    caffeine: "46mg",
                    volume: "355 mL / 12 FL OZ",
                    description: "Sensual bourbon vanilla orchid bean extracts layered gently over aggressive silver carbonation. Creamy yet exhilaratingly crisp."
                }
            ];
        }

        this.renderSlides();
        this.updateNavigation();
        this.setupEventListeners();
    }

    renderSlides() {
        if (!this.slideTrack) return;
        this.slideTrack.innerHTML = '';

        this.products.forEach((p, idx) => {
            const slide = document.createElement('div');
            slide.className = `carousel-slide ${idx === 0 ? 'active' : ''}`;
            slide.setAttribute('data-index', idx);
            slide.style.setProperty('--card-accent', p.accent_color);

            slide.innerHTML = `
                <div class="carousel-card-backdrop" style="background: radial-gradient(circle at 50% 40%, ${p.accent_color}22 0%, rgba(15,16,20,0.85) 75%);"></div>
                <div class="carousel-card-content">
                    <span class="carousel-badge" style="color:${p.accent_color}; border-color:${p.accent_color};">${p.badge || 'DIET COKE'}</span>
                    <h3 class="carousel-title">${p.name}</h3>
                    <p class="carousel-tagline">${p.tagline || ''}</p>
                    <div class="carousel-can-visual">
                        <div class="can-glow-ring" style="background: radial-gradient(circle, ${p.accent_color}55 0%, transparent 70%);"></div>
                        <img src="/assets/textures/can_label_${p.slug}.png" alt="${p.name}" class="carousel-can-img" onerror="this.src='/assets/can_reference.jpg'" />
                    </div>
                    <div class="carousel-meta-row">
                        <span class="meta-pill"><strong>${p.calories}</strong> CALORIES</span>
                        <span class="meta-pill"><strong>${p.sugar}</strong> SUGAR</span>
                        <span class="meta-pill"><strong>${p.volume}</strong></span>
                    </div>
                    <p class="carousel-desc">${p.description || ''}</p>
                    <button class="carousel-select-btn" onclick="if(window.flavorSelector) { window.flavorSelector.selectFlavor(${idx}); document.getElementById('flavors').scrollIntoView({behavior:'smooth'}); }">
                        SELECT FLAVOR
                    </button>
                </div>
            `;

            this.slideTrack.appendChild(slide);
        });

        if (this.totalCounter) {
            this.totalCounter.textContent = String(this.products.length).padStart(2, '0');
        }
    }

    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        // Keyboard arrows
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        // Touch swipe on container
        if (this.container) {
            this.container.addEventListener('touchstart', (e) => {
                this.startX = e.touches[0].clientX;
            }, { passive: true });

            this.container.addEventListener('touchend', (e) => {
                const endX = e.changedTouches[0].clientX;
                const diff = endX - this.startX;
                if (diff < -50) this.next();
                if (diff > 50) this.prev();
            }, { passive: true });

            // Mouse drag
            this.container.addEventListener('mousedown', (e) => {
                this.isDragging = true;
                this.startX = e.clientX;
            });
            window.addEventListener('mouseup', (e) => {
                if (!this.isDragging) return;
                this.isDragging = false;
                const diff = e.clientX - this.startX;
                if (diff < -50) this.next();
                if (diff > 50) this.prev();
            });
        }
    }

    goTo(index) {
        if (index < 0) index = this.products.length - 1;
        if (index >= this.products.length) index = 0;
        this.currentIndex = index;

        this.updateNavigation();

        if (window.dietCokeAudio) {
            window.dietCokeAudio.playWhoosh();
        }

        if (window.fizzParticles) {
            const currentP = this.products[this.currentIndex];
            if (currentP) {
                window.fizzParticles.setAccentColor(currentP.accent_color);
                window.fizzParticles.explodeBurst(window.innerWidth * 0.5, window.innerHeight * 0.7, 50);
            }
        }
    }

    next() {
        this.goTo(this.currentIndex + 1);
    }

    prev() {
        this.goTo(this.currentIndex - 1);
    }

    updateNavigation() {
        const slides = this.slideTrack ? this.slideTrack.querySelectorAll('.carousel-slide') : [];
        slides.forEach((s, idx) => {
            s.classList.toggle('active', idx === this.currentIndex);
            // 3D curved carousel kinematics
            const diff = idx - this.currentIndex;
            const offset = diff * 105;
            const rotateY = diff * -22;
            const translateZ = Math.abs(diff) * -80;
            s.style.transform = `translateX(${offset}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${idx === this.currentIndex ? 1 : 0.86})`;
            s.style.opacity = idx === this.currentIndex ? '1' : '0.35';
        });

        if (this.currentCounter) {
            this.currentCounter.textContent = String(this.currentIndex + 1).padStart(2, '0');
        }

        if (this.progressBar) {
            const pct = ((this.currentIndex + 1) / Math.max(this.products.length, 1)) * 100;
            this.progressBar.style.width = `${pct}%`;
        }
    }
}

window.CinematicProductCarousel = CinematicProductCarousel;
