/**
 * DIET COKE 10 SECTIONS INTERACTIVITY & THE FIZZ EXPERIMENTS
 * Matches the exact 10-section inspiration layout and adds all interactive features:
 * - Section 02: Feel the Fizz interactive audio wave
 * - Section 03: 5 Flavor Alcove switcher (Classic, Lime, Cherry, Vanilla, Raspberry)
 * - Section 04: Press Play sensory modes (The Sound, The Fizz, The Feeling)
 * - Section 05: Moments Switcher (Sunset Drive, Beach, Neon City, Urban)
 * - Section 06: Lifestyle Energy Switcher (Gym, Work, Travel, Food, Night Out)
 * - Section 09: Real Moments Interactive Polaroid Wall with draggable cards & likes
 * - Section 10: Buy Now Interactive Order Drawer
 * - The 5 Fizz Experiments (Shaker, Beatpad, Frost Wiper, Flavor Lab, Ice Slingshot)
 * - Bonus Experiment 6: Carbonation Bubble Popper game
 */

class DietCokeInspoInteractions {
    constructor() {
        this.initSection2FizzButton();
        this.initSection3Flavors();
        this.initSection4SensoryModes();
        this.initSection5Moments();
        this.initSection6Lifestyle();
        this.initSection9Polaroids();
        this.initBuyNowModal();

        // The 5 Fizz Experiments
        this.initShaker();
        this.initBeatpad();
        this.initFrostWiper();
        this.initFlavorLab();
        this.initIceSlingshot();
        this.initBubblePopper();
    }

    // =========================================================================
    // SECTION 02: "FEEL THE FIZZ" BUTTON
    // =========================================================================
    initSection2FizzButton() {
        const btn = document.getElementById('feelTheFizzBtn');
        if (!btn) return;
        btn.addEventListener('click', () => {
            if (window.dietCokeAudio) {
                window.dietCokeAudio.burstFizz(3.0);
                window.dietCokeAudio.playClick();
            }
            if (window.fizzParticles) {
                const r = btn.getBoundingClientRect();
                window.fizzParticles.triggerShockwave(r.left + r.width / 2, r.top + r.height / 2, 280);
                window.fizzParticles.explodeBurst(r.left + r.width / 2, r.top + r.height / 2, 90);
            }
        });
    }

    // =========================================================================
    // SECTION 03: 5 FLAVOR ALCOVE SHOWCASE (Classic, Lime, Cherry, Vanilla, Raspberry)
    // =========================================================================
    initSection3Flavors() {
        const canItems = document.querySelectorAll('.alcove-can-item');
        const prevBtn = document.getElementById('alcovePrev');
        const nextBtn = document.getElementById('alcoveNext');
        const activeName = document.getElementById('alcoveActiveFlavorName');
        const activeDesc = document.getElementById('alcoveActiveDesc');

        const flavorData = {
            classic: { name: "DIET COKE CLASSIC", color: "#E4002B", desc: "The iconic, crisp, zero-sugar silver legend perfected since 1982." },
            lime: { name: "DIET COKE LIME", color: "#28A745", desc: "Sun-kissed Persian lime oils meeting explosive silver carbonation." },
            cherry: { name: "DIET COKE CHERRY", color: "#B81D39", desc: "A fiery twist of midnight cherry infused into razor-sharp fizz." },
            vanilla: { name: "DIET COKE VANILLA", color: "#E5A93C", desc: "Bourbon vanilla orchid bean extracts layered over aggressive bubbles." },
            raspberry: { name: "DIET COKE RASPBERRY", color: "#E91E63", desc: "Wild mountain raspberries bursting with tangy effervescence." }
        };

        let currentIdx = 0;
        const slugs = ['classic', 'lime', 'cherry', 'vanilla', 'raspberry'];

        const selectAlcoveFlavor = (idx) => {
            currentIdx = (idx + slugs.length) % slugs.length;
            const slug = slugs[currentIdx];
            const data = flavorData[slug];

            canItems.forEach((item, i) => {
                const isActive = (i === currentIdx);
                item.classList.toggle('active', isActive);
                if (isActive) {
                    item.style.transform = 'translateY(-24px) scale(1.15)';
                    item.style.filter = `drop-shadow(0 15px 35px ${data.color}88)`;
                } else {
                    item.style.transform = 'translateY(0) scale(1)';
                    item.style.filter = 'drop-shadow(0 8px 16px rgba(0,0,0,0.6))';
                }
            });

            if (activeName) {
                activeName.textContent = data.name;
                activeName.style.color = data.color;
            }
            if (activeDesc) {
                activeDesc.textContent = data.desc;
            }

            // Sync with 3D can engine & audio
            if (window.dietCoke3D) {
                window.dietCoke3D.setFlavor(slug, data.color);
            }
            if (window.fizzParticles) {
                window.fizzParticles.setAccentColor(data.color);
            }
            if (window.dietCokeAudio) {
                window.dietCokeAudio.playClick();
            }
        };

        canItems.forEach((item, i) => {
            item.addEventListener('click', () => selectAlcoveFlavor(i));
        });

        if (prevBtn) prevBtn.addEventListener('click', () => selectAlcoveFlavor(currentIdx - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => selectAlcoveFlavor(currentIdx + 1));
    }

    // =========================================================================
    // SECTION 04: "PRESS PLAY" SENSORY MODES
    // =========================================================================
    initSection4SensoryModes() {
        const soundBtn = document.getElementById('sensorySoundBtn');
        const fizzBtn = document.getElementById('sensoryFizzBtn');
        const feelingBtn = document.getElementById('sensoryFeelingBtn');
        const openBtn = document.getElementById('openTheCanBtn');

        if (openBtn) {
            openBtn.addEventListener('click', () => {
                if (window.canOpener) {
                    window.canOpener.triggerCanOpen();
                } else if (window.dietCokeAudio) {
                    window.dietCokeAudio.playCrispCanPop();
                }
            });
        }

        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                if (window.dietCokeAudio) window.dietCokeAudio.playCrispCanPop();
                soundBtn.classList.add('pulse');
                setTimeout(() => soundBtn.classList.remove('pulse'), 400);
            });
        }

        if (fizzBtn) {
            fizzBtn.addEventListener('click', () => {
                if (window.dietCokeAudio) window.dietCokeAudio.burstFizz(2.5);
                if (window.fizzParticles) {
                    const r = fizzBtn.getBoundingClientRect();
                    window.fizzParticles.explodeBurst(r.left + r.width / 2, r.top + r.height / 2, 60);
                }
            });
        }

        if (feelingBtn) {
            feelingBtn.addEventListener('click', () => {
                if (window.dietCokeAudio) {
                    window.dietCokeAudio.playSubBassDrop();
                    window.dietCokeAudio.triggerHaptic([60, 100, 60, 40]);
                }
                document.body.classList.add('screen-rumble');
                setTimeout(() => document.body.classList.remove('screen-rumble'), 500);
            });
        }
    }

    // =========================================================================
    // SECTION 05: "GOOD TASTE FOR BRIGHTER DAYS" MOMENTS SWITCHER
    // =========================================================================
    initSection5Moments() {
        const momentCards = document.querySelectorAll('.moment-thumb-card');
        const stage = document.getElementById('momentsStageBackdrop');
        const titleEl = document.getElementById('momentActiveTitle');

        const momentThemes = [
            { name: "SUNSET HIGHWAY DRIVE", grad: "radial-gradient(circle at 65% 45%, rgba(255, 120, 40, 0.3) 0%, rgba(20, 10, 5, 0.95) 75%)" },
            { name: "GOLDEN BEACH BREEZE", grad: "radial-gradient(circle at 65% 45%, rgba(255, 180, 50, 0.35) 0%, rgba(10, 20, 30, 0.95) 75%)" },
            { name: "MIDNIGHT NEON SKYLINE", grad: "radial-gradient(circle at 65% 45%, rgba(228, 0, 43, 0.35) 0%, rgba(10, 5, 25, 0.98) 75%)" },
            { name: "DOWNTOWN MORNING RUSH", grad: "radial-gradient(circle at 65% 45%, rgba(0, 160, 255, 0.25) 0%, rgba(10, 12, 16, 0.95) 75%)" }
        ];

        momentCards.forEach((card, idx) => {
            card.addEventListener('click', () => {
                momentCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                const t = momentThemes[idx] || momentThemes[0];
                if (stage) stage.style.background = t.grad;
                if (titleEl) titleEl.textContent = t.name;

                if (window.dietCokeAudio) window.dietCokeAudio.playWhoosh();
            });
        });
    }

    // =========================================================================
    // SECTION 06: "SAME ENERGY DIFFERENT PLACES" LIFESTYLE SELECTOR
    // =========================================================================
    initSection6Lifestyle() {
        const pills = document.querySelectorAll('.lifestyle-pill-btn');
        const sceneTitle = document.getElementById('lifestyleSceneTitle');

        const lifestyleScenes = {
            gym: { title: "POST-WORKOUT RECHARGE", sound: "whoosh" },
            work: { title: "CREATIVE DESK FUEL", sound: "click" },
            travel: { title: "AIRPORT CHILL DEPARTURE", sound: "whoosh" },
            food: { title: "PERFECT SAVORY PAIRING", sound: "pop" },
            night: { title: "CLUB BASS & NEON ENERGY", sound: "pop" }
        };

        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                const key = pill.getAttribute('data-lifestyle');
                const data = lifestyleScenes[key] || lifestyleScenes.gym;

                if (sceneTitle) sceneTitle.textContent = data.title;

                if (window.dietCokeAudio) {
                    if (data.sound === 'pop') window.dietCokeAudio.playCrispCanPop();
                    else window.dietCokeAudio.playWhoosh();
                }

                if (window.fizzParticles) {
                    const r = pill.getBoundingClientRect();
                    window.fizzParticles.explodeBurst(r.left + r.width / 2, r.top + r.height / 2, 35);
                }
            });
        });
    }

    // =========================================================================
    // SECTION 09: "REAL PEOPLE REAL MOMENTS" DRAGGABLE POLAROID WALL
    // =========================================================================
    initSection9Polaroids() {
        const polaroids = document.querySelectorAll('.polaroid-item');

        polaroids.forEach(p => {
            // Like Heart Button
            const likeBtn = p.querySelector('.polaroid-like-btn');
            const countEl = p.querySelector('.like-count');

            if (likeBtn && countEl) {
                likeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    let cnt = parseInt(countEl.textContent || '99') + 1;
                    countEl.textContent = cnt;
                    likeBtn.classList.add('liked');

                    if (window.dietCokeAudio) window.dietCokeAudio.playClick();
                    if (window.fizzParticles) {
                        const r = likeBtn.getBoundingClientRect();
                        window.fizzParticles.explodeBurst(r.left + r.width / 2, r.top + r.height / 2, 25, { r: 255, g: 60, b: 90 });
                    }
                });
            }

            // Draggable cards physics
            let isDragging = false;
            let startX, startY, origX = 0, origY = 0;

            const onStart = (cx, cy) => {
                isDragging = true;
                startX = cx;
                startY = cy;
                p.style.zIndex = '30';
                p.style.transition = 'none';
            };

            const onMove = (cx, cy) => {
                if (!isDragging) return;
                const dx = cx - startX;
                const dy = cy - startY;
                p.style.transform = `translate3d(${origX + dx}px, ${origY + dy}px, 0) scale(1.05) rotate(4deg)`;
            };

            const onEnd = (cx, cy) => {
                if (!isDragging) return;
                isDragging = false;
                origX += (cx - startX);
                origY += (cy - startY);
                p.style.transition = 'transform 0.3s ease';
                p.style.transform = `translate3d(${origX}px, ${origY}px, 0) scale(1) rotate(0deg)`;
            };

            p.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
            window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
            window.addEventListener('mouseup', (e) => onEnd(e.clientX, e.clientY));

            p.addEventListener('touchstart', (e) => {
                if (e.touches.length > 0) onStart(e.touches[0].clientX, e.touches[0].clientY);
            }, { passive: true });
            window.addEventListener('touchmove', (e) => {
                if (e.touches.length > 0) onMove(e.touches[0].clientX, e.touches[0].clientY);
            }, { passive: true });
            window.addEventListener('touchend', (e) => {
                if (e.changedTouches.length > 0) onEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            });
        });
    }

    // =========================================================================
    // "BUY NOW" MODAL ORDER DRAWER
    // =========================================================================
    initBuyNowModal() {
        const buyBtns = document.querySelectorAll('.buy-now-trigger');
        const modal = document.getElementById('buyNowModal');
        const closeBtn = document.getElementById('closeBuyModalBtn');
        const orderConfirmBtn = document.getElementById('confirmOrderBtn');

        buyBtns.forEach(b => {
            b.addEventListener('click', (e) => {
                e.preventDefault();
                if (modal) modal.style.display = 'flex';
                if (window.dietCokeAudio) window.dietCokeAudio.playClick();
            });
        });

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
        }

        // Pack options selection
        const packCards = document.querySelectorAll('.pack-option-card');
        packCards.forEach(card => {
            card.addEventListener('click', () => {
                packCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                if (window.dietCokeAudio) window.dietCokeAudio.playClick();
            });
        });

        const ecoBtn = document.getElementById('ecoCommitmentBtn');
        if (ecoBtn) {
            ecoBtn.addEventListener('click', () => {
                if (window.dietCokeAudio) window.dietCokeAudio.playCrispCanPop();
                if (window.fizzParticles) {
                    const r = ecoBtn.getBoundingClientRect();
                    window.fizzParticles.explodeBurst(r.left + r.width / 2, r.top + r.height / 2, 40, { r: 105, g: 240, b: 174 });
                }
                alert("🌿 DIET COKE 100% RECYCLABLE INITIATIVE:\n\nOur silver aluminum cans are 100% infinitely recyclable and chill up to 3x faster than plastic bottles. By 2030, our supply network operates on 100% renewable energy.");
            });
        }

        if (orderConfirmBtn && modal) {
            orderConfirmBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                if (window.dietCokeAudio) window.dietCokeAudio.playCrispCanPop();
                if (window.fizzParticles) {
                    window.fizzParticles.explodeBurst(window.innerWidth * 0.5, window.innerHeight * 0.5, 200);
                }
                alert("🎉 Cold Diet Coke packs on the way! Thank you for choosing Diet Coke.");
            });
        }
    }

    // =========================================================================
    // EXPERIMENT 01: THE PRESSURE SHAKER
    // =========================================================================
    initShaker() {
        this.shakeCan = document.getElementById('shakerCanMockup');
        this.shakeBtn = document.getElementById('shakerTriggerBtn');
        this.shakeReleaseBtn = document.getElementById('shakerReleaseBtn');
        this.psiMeter = document.getElementById('shakerPsiFill');
        this.psiValue = document.getElementById('shakerPsiValue');
        this.pressureLevel = 0;

        if (!this.shakeBtn || !this.shakeCan) return;

        const doShake = () => {
            if (this.pressureLevel >= 100) return;
            this.pressureLevel = Math.min(this.pressureLevel + 15, 100);
            this.updateShakerUI();

            if (window.dietCokeAudio) {
                window.dietCokeAudio.playPressureRattle(this.pressureLevel / 100);
            }

            this.shakeCan.classList.remove('rattling');
            void this.shakeCan.offsetWidth;
            this.shakeCan.classList.add('rattling');

            if (window.fizzParticles) {
                const r = this.shakeCan.getBoundingClientRect();
                window.fizzParticles.explodeBurst(r.left + r.width / 2, r.top + r.height * 0.3, 15);
            }
        };

        this.shakeBtn.addEventListener('click', doShake);
        this.shakeBtn.addEventListener('touchstart', (e) => { e.preventDefault(); doShake(); }, { passive: false });

        if (window.DeviceMotionEvent) {
            let lastX = 0, lastY = 0, lastZ = 0;
            window.addEventListener('devicemotion', (e) => {
                const acc = e.accelerationIncludingGravity;
                if (!acc) return;
                const delta = Math.abs(acc.x - lastX) + Math.abs(acc.y - lastY) + Math.abs(acc.z - lastZ);
                if (delta > 22) doShake();
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

        if (window.dietCokeAudio) window.dietCokeAudio.playGeyserDetonate();

        document.body.classList.add('screen-rumble');
        setTimeout(() => document.body.classList.remove('screen-rumble'), 800);

        if (window.fizzParticles) {
            const r = this.shakeCan.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height * 0.2;
            window.fizzParticles.triggerShockwave(cx, cy, 350, { r: 255, g: 255, b: 255 });
            window.fizzParticles.explodeBurst(cx, cy, 220, { r: 255, g: 0, b: 43 });
        }

        const spray = document.getElementById('shakerSpray');
        if (spray) {
            spray.classList.add('active');
            setTimeout(() => spray.classList.remove('active'), 2000);
        }

        this.pressureLevel = 0;
        this.updateShakerUI();
        if (this.shakeReleaseBtn) this.shakeReleaseBtn.style.display = 'none';
    }

    // =========================================================================
    // EXPERIMENT 02: COMMERCIAL BEATPAD
    // =========================================================================
    initBeatpad() {
        const pads = document.querySelectorAll('.beatpad-key');
        const eqBars = document.querySelectorAll('.eq-bar');

        pads.forEach(pad => {
            const padHandler = () => {
                const idx = parseInt(pad.getAttribute('data-pad') || '0');
                if (window.dietCokeAudio) window.dietCokeAudio.playBeatPadSound(idx);

                eqBars.forEach(b => {
                    b.style.height = `${Math.floor(Math.random() * 80 + 20)}%`;
                    setTimeout(() => { b.style.height = `${Math.floor(Math.random() * 25 + 5)}%`; }, 250);
                });

                pad.classList.add('hit');
                setTimeout(() => pad.classList.remove('hit'), 180);

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
    // EXPERIMENT 03: CONDENSATION FROST WIPER
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
            ctx.fillStyle = 'rgba(215, 225, 235, 0.94)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < 400; i++) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
                ctx.beginPath();
                ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3 + 1, 0, Math.PI * 2);
                ctx.fill();
            }

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
    // EXPERIMENT 04: CUSTOM FLAVOR LAB
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
                alert("✨ Custom Diet Coke Edition formula locked in!");
            });
        }
    }

    // =========================================================================
    // EXPERIMENT 05: ICE CUBE SLINGSHOT
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

            const flingX = -currentX * 2.8;
            const flingY = -currentY * 4.0 - 240;

            icePuck.style.transition = 'transform 0.45s cubic-bezier(0.12, 0.8, 0.32, 1)';
            icePuck.style.transform = `translate3d(${flingX}px, ${flingY}px, 0) scale(0.6) rotate(180deg)`;

            setTimeout(() => {
                if (window.dietCokeAudio) window.dietCokeAudio.playIceClink();
                score += 1;
                if (scoreCounter) scoreCounter.textContent = `HITS: ${score}`;

                if (targetCan) {
                    targetCan.classList.add('hit-wobble');
                    setTimeout(() => targetCan.classList.remove('hit-wobble'), 300);
                }

                if (window.fizzParticles) {
                    const r = targetCan ? targetCan.getBoundingClientRect() : slingshotStage.getBoundingClientRect();
                    window.fizzParticles.explodeBurst(r.left + r.width / 2, r.top + r.height * 0.4, 45, { r: 220, g: 240, b: 255 });
                }

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

    // =========================================================================
    // EXPERIMENT 06: CARBONATION BUBBLE POPPER GAME
    // =========================================================================
    initBubblePopper() {
        const gameArea = document.getElementById('bubblePopperStage');
        const scoreEl = document.getElementById('bubbleScoreVal');
        if (!gameArea) return;

        let score = 0;

        const spawnBubble = () => {
            if (document.hidden || !gameArea) return;
            const b = document.createElement('div');
            b.className = 'game-bubble';
            const size = Math.floor(Math.random() * 32 + 24);
            b.style.width = `${size}px`;
            b.style.height = `${size}px`;
            b.style.left = `${Math.random() * 85 + 5}%`;
            b.style.bottom = '-40px';

            const popHandler = (e) => {
                e.stopPropagation();
                score += 10;
                if (scoreEl) scoreEl.textContent = `${score}`;

                if (window.dietCokeAudio) window.dietCokeAudio.playClick();
                if (window.fizzParticles) {
                    const r = b.getBoundingClientRect();
                    window.fizzParticles.explodeBurst(r.left + r.width / 2, r.top + r.height / 2, 20);
                }

                b.classList.add('popped');
                setTimeout(() => b.remove(), 150);
            };

            b.addEventListener('mousedown', popHandler);
            b.addEventListener('touchstart', popHandler, { passive: true });

            gameArea.appendChild(b);

            // Animate up
            const duration = Math.random() * 2500 + 3000;
            const anim = b.animate([
                { transform: 'translateY(0) scale(1)' },
                { transform: `translateY(-${gameArea.clientHeight + 60}px) scale(1.1)` }
            ], { duration: duration, easing: 'linear' });

            anim.onfinish = () => { b.remove(); };
        };

        setInterval(spawnBubble, 650);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.dietCokeInteractions = new DietCokeInspoInteractions();
});
