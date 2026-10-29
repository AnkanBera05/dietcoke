/**
 * DIET COKE INTERACTIVE FLAVOR SELECTOR
 * Synchronizes with API-driven products database.
 * Dynamic flavor cards, 3D can updates, particle shifts, mobile swipe support.
 */

class FlavorSelector {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.flavorListContainer = document.getElementById('flavorButtonsList');
        this.flavorDisplay = document.getElementById('activeFlavorDisplay');
        this.flavorBadge = document.getElementById('activeFlavorBadge');
        this.flavorTitle = document.getElementById('activeFlavorTitle');
        this.flavorTagline = document.getElementById('activeFlavorTagline');
        this.flavorDesc = document.getElementById('activeFlavorDesc');
        this.flavorNotes = document.getElementById('activeFlavorNotes');
        this.flavorSpecs = document.getElementById('activeFlavorSpecs');
        this.flavorBackdrop = document.getElementById('flavorBackdrop');

        this.products = [];
        this.currentIndex = 0;

        // Touch swipe tracking
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    async init() {
        try {
            const resp = await fetch('/api/products');
            this.products = await resp.json();
        } catch (e) {
            console.warn("Could not load flavors from API, using defaults", e);
            this.products = [
                {
                    slug: "original",
                    name: "Diet Coke Original",
                    tagline: "The Unapologetic Classic",
                    accent_color: "#E4002B",
                    badge: "ICONIC ORIGINAL",
                    calories: 0,
                    sugar: "0g",
                    caffeine: "46mg",
                    volume: "355 mL / 12 FL OZ",
                    description: "Crisp, cold, and unmistakably bold. The timeless silver aluminum icon crafted with zero sugar, zero calories, and maximum effervescence.",
                    taste_notes: ["Crisp Carbonation", "Zero Sugar", "Aluminum Chill", "Iconic Kick"]
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
                    description: "An electrifying collision of deep dark cherry aromatics infused into our razor-sharp silver fizz. Tart, sultry, and instantly refreshing.",
                    taste_notes: ["Dark Cherry Burst", "Velvet Tang", "Electric Fizz", "Zero Guilt"]
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
                    description: "Sun-kissed Persian lime peel oils meeting explosive silver carbonation. A razor-sharp citrus zap that cuts through the heat instantly.",
                    taste_notes: ["Key Lime Spark", "Glacial Cold", "Citrus Peel Bite", "Zero Calories"]
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
                    description: "Sensual bourbon vanilla orchid bean extracts layered gently over aggressive silver carbonation. Creamy yet exhilaratingly crisp.",
                    taste_notes: ["Bourbon Vanilla Bean", "Silky Sweetness", "Cold Snap", "Bold Finish"]
                }
            ];
        }

        this.renderButtons();
        this.selectFlavor(0);
        this.setupSwipe();
    }

    renderButtons() {
        if (!this.flavorListContainer) return;
        this.flavorListContainer.innerHTML = '';

        this.products.forEach((p, idx) => {
            const btn = document.createElement('button');
            btn.className = `flavor-pill-btn ${idx === 0 ? 'active' : ''}`;
            btn.setAttribute('data-index', idx);
            btn.style.setProperty('--accent', p.accent_color);

            btn.innerHTML = `
                <span class="flavor-dot" style="background: ${p.accent_color}; box-shadow: 0 0 12px ${p.accent_color};"></span>
                <span class="flavor-name">${p.name.replace('Diet Coke ', '')}</span>
            `;

            btn.addEventListener('click', () => {
                this.selectFlavor(idx);
                if (window.dietCokeAudio) window.dietCokeAudio.playClick();
            });

            this.flavorListContainer.appendChild(btn);
        });
    }

    selectFlavor(index) {
        if (!this.products[index]) return;
        this.currentIndex = index;
        const p = this.products[index];

        // 1. Update button states
        const allBtns = this.flavorListContainer.querySelectorAll('.flavor-pill-btn');
        allBtns.forEach((b, i) => {
            b.classList.toggle('active', i === index);
        });

        // 2. Animate out text then animate in
        if (this.flavorDisplay) {
            this.flavorDisplay.classList.add('transitioning');
            setTimeout(() => {
                if (this.flavorBadge) {
                    this.flavorBadge.textContent = p.badge || "DIET COKE";
                    this.flavorBadge.style.color = p.accent_color;
                    this.flavorBadge.style.borderColor = p.accent_color;
                }
                if (this.flavorTitle) {
                    this.flavorTitle.textContent = p.name;
                    this.flavorTitle.style.color = '#FFFFFF';
                }
                if (this.flavorTagline) {
                    this.flavorTagline.textContent = p.tagline || "";
                }
                if (this.flavorDesc) {
                    this.flavorDesc.textContent = p.description || "";
                }
                if (this.flavorSpecs) {
                    this.flavorSpecs.innerHTML = `
                        <div class="spec-box"><span class="spec-num">${p.calories}</span><span class="spec-lbl">CALORIES</span></div>
                        <div class="spec-box"><span class="spec-num">${p.sugar}</span><span class="spec-lbl">SUGAR</span></div>
                        <div class="spec-box"><span class="spec-num">${p.caffeine}</span><span class="spec-lbl">CAFFEINE</span></div>
                        <div class="spec-box"><span class="spec-num">SILVER</span><span class="spec-lbl">CHILL</span></div>
                    `;
                }
                if (this.flavorNotes && p.taste_notes) {
                    this.flavorNotes.innerHTML = p.taste_notes.map(n => `<span class="taste-tag" style="border-color:${p.accent_color}55"><i class="tag-spark" style="background:${p.accent_color}"></i>${n}</span>`).join('');
                }

                this.flavorDisplay.classList.remove('transitioning');
            }, 250);
        }

        // 3. Update Ambient Backdrop Aura with Flash Pulse
        if (this.flavorBackdrop) {
            this.flavorBackdrop.style.background = `radial-gradient(circle at 50% 50%, ${p.accent_color}44 0%, rgba(10,11,13,0.95) 70%)`;
            setTimeout(() => {
                if (this.flavorBackdrop) {
                    this.flavorBackdrop.style.background = `radial-gradient(circle at 50% 50%, ${p.accent_color}24 0%, rgba(10,11,13,0.95) 70%)`;
                }
            }, 450);
        }

        // 4. Update 3D Can Experience (Triggers 720-degree spin flip & jump bounce)
        if (window.dietCoke3D) {
            window.dietCoke3D.setFlavor(p.slug, p.accent_color);
        }

        // 5. Update Particle System & Trigger Massive Shockwave
        if (window.fizzParticles) {
            window.fizzParticles.setAccentColor(p.accent_color);
            window.fizzParticles.triggerShockwave(window.innerWidth * 0.5, window.innerHeight * 0.5, 260);
            window.fizzParticles.explodeBurst(window.innerWidth * 0.5, window.innerHeight * 0.5, 80);
        }

        // 6. Record telemetry
        fetch('/api/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_type: 'flavor_view',
                payload: { slug: p.slug }
            })
        }).catch(() => {});
    }

    setupSwipe() {
        if (!this.container) return;

        this.container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipeGesture();
        }, { passive: true });
    }

    handleSwipeGesture() {
        const deltaX = this.touchEndX - this.touchStartX;
        const threshold = 50;

        if (deltaX < -threshold) {
            // Swipe Left -> Next Flavor
            const nextIdx = (this.currentIndex + 1) % this.products.length;
            this.selectFlavor(nextIdx);
        } else if (deltaX > threshold) {
            // Swipe Right -> Prev Flavor
            const prevIdx = (this.currentIndex - 1 + this.products.length) % this.products.length;
            this.selectFlavor(prevIdx);
        }
    }
}

window.FlavorSelector = FlavorSelector;
