/**
 * DIET COKE HYPER-CINEMATIC 3D ENGINE (Three.js)
 * High-Budget Commercial Motion Design:
 * - Supersonic Z-axis intro launch into hero position
 * - Orbiting 3D carbonation bubbles & frost crystals
 * - Pressurized micro-vibration & aggressive kinetic mouse banking
 * - Dynamic studio rim lights & chromatic specular highlights
 * - Acrobatic spin-flips on flavor change
 * - Extreme macro camera zoom choreography on scroll
 */

class DietCoke3DExperience {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.canGroup = null;
        this.canMesh = null;
        this.lidMesh = null;
        this.rimMesh = null;
        this.shadowMesh = null;
        
        // 3D Orbiting Atmosphere (Bubbles & Ice Crystals)
        this.orbitGroup = null;
        this.orbitParticles = [];
        this.iceCubes = [];

        // Lighting references
        this.redRimLight = null;
        this.keyLight = null;
        this.backLight = null;
        this.glowLight = null;

        // Textures
        this.textures = {};
        this.currentFlavor = 'original';
        this.currentAccentColor = '#E4002B';

        // Mouse & Physics state
        this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0, vx: 0, vy: 0 };
        this.scroll = { y: 0, targetY: 0, progress: 0 };
        this.canBaseRotation = { x: 0.12, y: -0.35, z: 0 };
        
        // Kinetic States
        this.isIntroPlaying = true;
        this.introProgress = 0;
        this.isSpinning = false;
        this.spinVelocity = 0;
        this.isMobile = window.innerWidth < 768;
        this.fizzVibration = 0;

        this.init();
    }

    init() {
        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || window.innerHeight;

        // 1. Scene & Camera Setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x0a0b0d, 0.028);

        this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 120);
        this.camera.position.set(0, 0, 7.8);

        // 2. WebGL Renderer with High-Precision ACES Filmic Tone Mapping
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.35;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // 3. Studio Lighting Rig
        this.setupLighting();

        // 4. Load Textures & Build Can + Orbiting Atmosphere
        this.loadTextures(() => {
            this.buildRealisticCan();
            this.buildOrbitingAtmosphere();
            this.setupEvents();
            this.playIntroBlast();
            this.animate();
        });
    }

    setupLighting() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.65);
        this.scene.add(ambient);

        // High Specular Key Light (Crisp Aluminum reflections)
        this.keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
        this.keyLight.position.set(5, 7, 6);
        this.keyLight.castShadow = true;
        this.scene.add(this.keyLight);

        // Electric Red Silhouette Rim Light
        this.redRimLight = new THREE.PointLight(0xE4002B, 6.5, 18);
        this.redRimLight.position.set(-4.2, 2.0, -2.2);
        this.scene.add(this.redRimLight);

        // Glacial Cool Silver Rim
        const silverFill = new THREE.DirectionalLight(0xcce4ff, 2.0);
        silverFill.position.set(-5, -2, 4);
        this.scene.add(silverFill);

        // Backlight Flare
        this.backLight = new THREE.PointLight(0xE4002B, 4.0, 20);
        this.backLight.position.set(0, 4, -5);
        this.scene.add(this.backLight);

        // Bottom Up-Light for metallic base bevel
        this.glowLight = new THREE.PointLight(0xE4002B, 2.5, 10);
        this.glowLight.position.set(0, -3.8, 1.5);
        this.scene.add(this.glowLight);
    }

    loadTextures(callback) {
        const textureLoader = new THREE.TextureLoader();
        const texturePaths = {
            classic: '/assets/textures/can_label_classic.png',
            original: '/assets/textures/can_label_original.png',
            cherry: '/assets/textures/can_label_cherry.png',
            lime: '/assets/textures/can_label_lime.png',
            vanilla: '/assets/textures/can_label_vanilla.png',
            raspberry: '/assets/textures/can_label_raspberry.png',
            normalDroplets: '/assets/textures/can_normal_droplets.png',
            lid: '/assets/textures/can_lid.png'
        };

        let loadedCount = 0;
        const total = Object.keys(texturePaths).length;

        const checkFinish = () => {
            loadedCount++;
            if (loadedCount >= total && callback) callback();
        };

        for (const [key, path] of Object.entries(texturePaths)) {
            textureLoader.load(
                path,
                (tex) => {
                    tex.generateMipmaps = true;
                    tex.minFilter = THREE.LinearMipmapLinearFilter;
                    tex.magFilter = THREE.LinearFilter;
                    tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
                    this.textures[key] = tex;
                    checkFinish();
                },
                undefined,
                () => {
                    this.textures[key] = this.createFallbackTexture();
                    checkFinish();
                }
            );
        }
    }

    createFallbackTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createLinearGradient(0, 0, 1024, 0);
        grad.addColorStop(0, '#B0B5B9');
        grad.addColorStop(0.3, '#E6EAED');
        grad.addColorStop(0.5, '#C8CDD0');
        grad.addColorStop(0.8, '#FFFFFF');
        grad.addColorStop(1, '#A8ADB1');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 512);

        ctx.fillStyle = '#E4002B';
        ctx.font = 'bold 90px sans-serif';
        ctx.fillText('Diet Coke', 260, 240);
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText('NO SUGAR NO CALORIES', 240, 310);
        return new THREE.CanvasTexture(canvas);
    }

    buildRealisticCan() {
        this.canGroup = new THREE.Group();
        this.scene.add(this.canGroup);

        const canRadius = 1.05;
        const canHeight = 3.65;
        const segments = 64;

        // 1. Can Main Cylindrical Body
        const bodyGeo = new THREE.CylinderGeometry(canRadius, canRadius, canHeight, segments, 1, true);
        const bodyMat = new THREE.MeshStandardMaterial({
            map: this.textures.original,
            normalMap: this.textures.normalDroplets || null,
            normalScale: new THREE.Vector2(0.9, 0.9),
            metalness: 0.90,
            roughness: 0.18,
            envMapIntensity: 2.2
        });
        this.canMesh = new THREE.Mesh(bodyGeo, bodyMat);
        this.canMesh.castShadow = true;
        this.canMesh.receiveShadow = true;
        this.canGroup.add(this.canMesh);

        // 2. Chime (Tapered Top Neck)
        const chimeHeight = 0.24;
        const chimeGeo = new THREE.CylinderGeometry(canRadius * 0.88, canRadius, chimeHeight, segments, 1, true);
        const silverMat = new THREE.MeshStandardMaterial({
            color: 0xE8ECF0,
            metalness: 0.96,
            roughness: 0.12,
            envMapIntensity: 2.4
        });
        const chimeMesh = new THREE.Mesh(chimeGeo, silverMat);
        chimeMesh.position.y = canHeight / 2 + chimeHeight / 2;
        this.canGroup.add(chimeMesh);

        // 3. Top Rim / Chime Crimp Ring
        const rimGeo = new THREE.TorusGeometry(canRadius * 0.88, 0.05, 20, segments);
        rimGeo.rotateX(Math.PI / 2);
        this.rimMesh = new THREE.Mesh(rimGeo, silverMat);
        this.rimMesh.position.y = canHeight / 2 + chimeHeight;
        this.canGroup.add(this.rimMesh);

        // 4. Stamped Aluminum Can Lid
        const lidGeo = new THREE.CircleGeometry(canRadius * 0.87, segments);
        lidGeo.rotateX(-Math.PI / 2);
        const lidMat = new THREE.MeshStandardMaterial({
            map: this.textures.lid || null,
            color: 0xD4D9DE,
            metalness: 0.94,
            roughness: 0.20
        });
        this.lidMesh = new THREE.Mesh(lidGeo, lidMat);
        this.lidMesh.position.y = canHeight / 2 + chimeHeight - 0.015;
        this.canGroup.add(this.lidMesh);

        // 5. Tapered Bottom Dome Bevel
        const bottomHeight = 0.22;
        const bottomGeo = new THREE.CylinderGeometry(canRadius, canRadius * 0.84, bottomHeight, segments, 1, true);
        const bottomMesh = new THREE.Mesh(bottomGeo, silverMat);
        bottomMesh.position.y = -canHeight / 2 - bottomHeight / 2;
        this.canGroup.add(bottomMesh);

        // 6. Contact Ground Shadow with Soft Falloff
        const shadowGeo = new THREE.PlaneGeometry(4.2, 4.2);
        shadowGeo.rotateX(-Math.PI / 2);
        const shadowMat = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.55
        });
        this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
        this.shadowMesh.position.y = -canHeight / 2 - bottomHeight - 0.25;
        this.scene.add(this.shadowMesh);

        // Start from deep Z space for dramatic intro blast
        this.canGroup.position.set(0, 0, -28);
        this.canGroup.rotation.set(-0.8, -Math.PI, 0.4);
        this.canGroup.scale.set(0.1, 0.1, 0.1);
    }

    buildOrbitingAtmosphere() {
        this.orbitGroup = new THREE.Group();
        this.scene.add(this.orbitGroup);

        // 1. Orbiting 3D Glass Bubbles
        const bubbleGeo = new THREE.SphereGeometry(0.08, 16, 16);
        const bubbleMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transmission: 0.92,
            opacity: 1,
            transparent: true,
            roughness: 0.05,
            ior: 1.33
        });

        const bubbleCount = this.isMobile ? 24 : 65;
        for (let i = 0; i < bubbleCount; i++) {
            const mesh = new THREE.Mesh(bubbleGeo, bubbleMat);
            const radius = 1.6 + Math.random() * 2.8;
            const theta = Math.random() * Math.PI * 2;
            const y = (Math.random() - 0.5) * 5.0;
            const speed = (0.4 + Math.random() * 0.8) * (Math.random() > 0.5 ? 1 : -1);
            const scale = 0.4 + Math.random() * 1.2;

            mesh.position.set(Math.cos(theta) * radius, y, Math.sin(theta) * radius);
            mesh.scale.set(scale, scale, scale);
            this.orbitGroup.add(mesh);

            this.orbitParticles.push({
                mesh: mesh,
                radius: radius,
                theta: theta,
                speed: speed * 0.015,
                y: y,
                bobPhase: Math.random() * Math.PI * 2
            });
        }

        // 2. Translucent Glistening Ice Crystals
        const iceGeo = new THREE.DodecahedronGeometry(0.18, 0);
        const iceMat = new THREE.MeshPhysicalMaterial({
            color: 0xDDEEFF,
            transmission: 0.88,
            roughness: 0.12,
            transparent: true,
            opacity: 0.85
        });

        const iceCount = this.isMobile ? 4 : 10;
        for (let i = 0; i < iceCount; i++) {
            const ice = new THREE.Mesh(iceGeo, iceMat);
            const r = 2.0 + Math.random() * 2.2;
            const angle = (i / iceCount) * Math.PI * 2;
            ice.position.set(Math.cos(angle) * r, (Math.random() - 0.5) * 3.5, Math.sin(angle) * r);
            this.orbitGroup.add(ice);

            this.iceCubes.push({
                mesh: ice,
                angle: angle,
                r: r,
                speed: 0.008 + Math.random() * 0.008,
                rotSpeedX: Math.random() * 0.03,
                rotSpeedY: Math.random() * 0.03
            });
        }
    }

    playIntroBlast() {
        if (!this.canGroup) return;

        // Cinematic Launch: Can zooms from deep space into camera view
        if (window.gsap) {
            gsap.to(this.canGroup.position, {
                x: 0,
                y: 0,
                z: 0,
                duration: 2.2,
                ease: "power4.out"
            });
            gsap.to(this.canGroup.scale, {
                x: 1.0,
                y: 1.0,
                z: 1.0,
                duration: 2.0,
                ease: "back.out(1.4)"
            });
            gsap.to(this.canGroup.rotation, {
                x: this.canBaseRotation.x,
                y: this.canBaseRotation.y,
                z: 0,
                duration: 2.4,
                ease: "power3.out",
                onComplete: () => {
                    this.isIntroPlaying = false;
                }
            });
        } else {
            this.canGroup.position.set(0, 0, 0);
            this.canGroup.scale.set(1, 1, 1);
            this.canGroup.rotation.set(this.canBaseRotation.x, this.canBaseRotation.y, 0);
            this.isIntroPlaying = false;
        }

        // Particle explosion trigger
        if (window.fizzParticles) {
            setTimeout(() => {
                window.fizzParticles.explodeBurst(window.innerWidth * 0.5, window.innerHeight * 0.5, 180, { r: 255, g: 255, b: 255 });
            }, 600);
        }
    }

    setupEvents() {
        window.addEventListener('resize', () => this.onResize(), { passive: true });

        // High-Precision Mouse Banking Dynamics
        let lastX = 0, lastY = 0;
        window.addEventListener('mousemove', (e) => {
            const normX = (e.clientX / window.innerWidth) * 2 - 1;
            const normY = -(e.clientY / window.innerHeight) * 2 + 1;
            this.mouse.vx = normX - lastX;
            this.mouse.vy = normY - lastY;
            lastX = normX;
            lastY = normY;

            this.mouse.targetX = normX;
            this.mouse.targetY = normY;
        }, { passive: true });

        // Touch parallax for mobile
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const t = e.touches[0];
                this.mouse.targetX = (t.clientX / window.innerWidth) * 2 - 1;
                this.mouse.targetY = -(t.clientY / window.innerHeight) * 2 + 1;
            }
        }, { passive: true });

        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    }

    onResize() {
        if (!this.container || !this.renderer || !this.camera) return;
        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || window.innerHeight;
        this.isMobile = width < 768;

        this.camera.aspect = width / height;
        this.camera.position.z = this.isMobile ? 9.8 : 7.8;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    onScroll() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        this.scroll.progress = Math.min(Math.max(scrollY / (maxScroll || 1), 0), 1);
        this.scroll.targetY = scrollY;
    }

    setFlavor(flavorSlug, accentHex = '#E4002B') {
        if (!this.canMesh || this.currentFlavor === flavorSlug) return;
        this.currentFlavor = flavorSlug;
        this.currentAccentColor = accentHex;

        // Acrobatic 720-Degree Sonic Spin Flip
        this.isSpinning = true;
        this.spinVelocity = 0.85;

        // Texture Swap
        const targetTex = this.textures[flavorSlug] || this.textures.original;
        if (targetTex && this.canMesh.material) {
            this.canMesh.material.map = targetTex;
            this.canMesh.material.needsUpdate = true;
        }

        // Lighting morphing
        const color = new THREE.Color(accentHex);
        if (window.gsap) {
            gsap.to(this.redRimLight.color, { r: color.r, g: color.g, b: color.b, duration: 0.6 });
            gsap.to(this.backLight.color, { r: color.r, g: color.g, b: color.b, duration: 0.6 });
            gsap.to(this.glowLight.color, { r: color.r, g: color.g, b: color.b, duration: 0.6 });
        } else {
            this.redRimLight.color.set(color);
            this.backLight.color.set(color);
            this.glowLight.color.set(color);
        }

        // Kinetic Jump Bounce
        if (window.gsap && this.canGroup) {
            gsap.fromTo(this.canGroup.position, 
                { y: 0.6 }, 
                { y: 0, duration: 0.8, ease: "bounce.out" }
            );
        }

        if (window.dietCokeAudio) {
            window.dietCokeAudio.playWhoosh();
        }
    }

    updateScrollCinematics() {
        if (!this.canGroup || this.isIntroPlaying) return 0;

        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;
        const stage = scrollY / heroHeight;

        // Choreography Timeline:
        // 0.0 - 1.0 (Hero to Experience): Can zooms toward camera, glides laterally to right
        // 1.0 - 2.0 (Experience to Flavors): Can recedes slightly, tilts into 3/4 view
        // 2.0+ (Flavors to Fizz/Opener): Extreme perspective angle
        let targetX = 0;
        let targetY = 0;
        let targetZ = 0;
        let targetScale = 1.0;

        if (stage < 1.0) {
            targetX = stage * (this.isMobile ? 0.6 : 1.85);
            targetY = -stage * 0.45;
            targetZ = stage * (this.isMobile ? 0.6 : 1.2);
            targetScale = (this.isMobile ? 0.8 : 1.0) + stage * 0.28;
        } else if (stage < 2.2) {
            const sub = stage - 1.0;
            const maxX = this.isMobile ? 0.6 : 1.85;
            targetX = maxX - sub * maxX;
            targetY = -0.45 + sub * 0.45;
            targetZ = (this.isMobile ? 0.6 : 1.2) - sub * (this.isMobile ? 0.6 : 1.2);
            targetScale = (this.isMobile ? 0.8 : 1.0);
        }

        this.canGroup.position.x += (targetX - this.canGroup.position.x) * 0.1;
        this.canGroup.position.y += (targetY - this.canGroup.position.y) * 0.1;
        this.canGroup.scale.set(targetScale, targetScale, targetScale);

        if (this.shadowMesh) {
            this.shadowMesh.position.x = this.canGroup.position.x;
            this.shadowMesh.position.z = this.canGroup.position.z;
        }

        return scrollY * 0.0038;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // 1. Dynamic Kinetic Mouse Physics with Velocity Banking
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

        const time = performance.now() * 0.0018;

        // 2. Pressurized Carbonation Micro-Vibration
        this.fizzVibration = Math.sin(time * 45) * 0.0035;

        // 3. Scroll transformations
        const scrollRotateY = this.updateScrollCinematics() || 0;

        // 4. Spin Flip Velocity
        if (this.isSpinning) {
            this.canBaseRotation.y += this.spinVelocity;
            this.spinVelocity *= 0.93;
            if (this.spinVelocity < 0.006) {
                this.isSpinning = false;
                this.spinVelocity = 0;
            }
        } else {
            this.canBaseRotation.y += 0.003;
        }

        // 5. Apply Aggressive 3D Banking & Rotations
        if (this.canGroup && !this.isIntroPlaying) {
            const idleFloatY = Math.sin(time * 1.2) * 0.12;
            const idleTiltX = Math.cos(time * 0.9) * 0.05;

            // Aggressive aerodynamic bank on mouse velocity
            const bankZ = -this.mouse.x * 0.35 + (this.mouse.vx * 1.2);
            const tiltX = this.canBaseRotation.x + idleTiltX - (this.mouse.y * 0.45);
            const tiltY = this.canBaseRotation.y + scrollRotateY + (this.mouse.x * 0.75);

            this.canGroup.rotation.x += (tiltX - this.canGroup.rotation.x) * 0.12;
            this.canGroup.rotation.y = tiltY;
            this.canGroup.rotation.z += (bankZ - this.canGroup.rotation.z) * 0.12;

            // Z-Depth parallax push/pull
            const targetZ = (-this.mouse.y * 0.6) + this.fizzVibration;
            this.canGroup.position.z += (targetZ - this.canGroup.position.z) * 0.08;
            this.canGroup.position.y += idleFloatY * 0.03;
        }

        // 6. Animate Orbiting Atmosphere (Bubbles & Ice Crystals)
        if (this.orbitGroup) {
            this.orbitGroup.rotation.y += 0.004;

            for (let i = 0; i < this.orbitParticles.length; i++) {
                const p = this.orbitParticles[i];
                p.theta += p.speed;
                const bob = Math.sin(time * 2 + p.bobPhase) * 0.2;
                p.mesh.position.x = Math.cos(p.theta) * p.radius;
                p.mesh.position.z = Math.sin(p.theta) * p.radius;
                p.mesh.position.y = p.y + bob;
            }

            for (let i = 0; i < this.iceCubes.length; i++) {
                const ic = this.iceCubes[i];
                ic.angle += ic.speed;
                ic.mesh.position.x = Math.cos(ic.angle) * ic.r;
                ic.mesh.position.z = Math.sin(ic.angle) * ic.r;
                ic.mesh.rotation.x += ic.rotSpeedX;
                ic.mesh.rotation.y += ic.rotSpeedY;
            }
        }

        // 7. Render
        this.renderer.render(this.scene, this.camera);
    }
}

window.DietCoke3DExperience = DietCoke3DExperience;
