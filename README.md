# DIET COKE — THAT'S SO DIET COKE
### Premium Cinematic Promotional Experience & Admin CMS

A high-budget, cinematic beverage advertising website and custom Admin Control Center created for **Diet Coke**.

---

## 🌟 Key Features

### 1. Public Promotional Experience (`/`)
- **First 5 Seconds Crazy Hero**:
  - Fullscreen 3D realistic aluminum Diet Coke can rotating in 3D.
  - Interactive mouse tilt, spring physics, and cursor tracking.
  - Brushed aluminum anisotropic streaks, condensation normal-mapped droplets, realistic top crimped rim, and pull-tab lid.
  - Dramatic Diet Coke red (`#E4002B`) rim lighting, key light highlights, and dynamic contact ground shadow.
  - Bold campaign typography: **THAT'S SO DIET COKE.** (split words with scroll kinematics).
- **Parallax & Scroll-Triggered Kinematics (Scenes 1–8)**:
  - Macro camera zoom into the can.
  - Can lateral glide revealing floating callout cards (Zero Sugar, Carbonation, 100% Recyclable Aluminum, Botanical Kick).
  - Climax bubble explosion when scrolling into the experience.
- **Full-Screen Red Liquid Transition**:
  - Liquid SVG / polygon wave sweep across the viewport in signature Diet Coke red, revealing the flavor repertoire.
- **Interactive Flavor Selector ("WHAT'S YOUR FLAVOR?")**:
  - Original, Feisty Cherry, Sublime Lime, Velvet Vanilla (and dynamic custom admin flavors).
  - Live 3D can 360-degree spin-flip, texture change, accent lighting morphing, and particle shift.
  - Mobile swipe support for touch gestures.
- **Liquid & Carbonation Particle Physics**:
  - Multi-tier particle simulation: ambient buoyant bubbles, fizzy sparks, liquid mist, burst explosions.
  - Mouse repulsion and scroll acceleration.
- **Interactive "PULL TO OPEN" Can Simulation**:
  - Realistic 3D aluminum can top with finger ring tab.
  - Drag or touch pull physics: tab bends in 3D, scored seal flexes inward.
  - Pressurized pop & hiss (`pssshh-crack!`), camera shake, CO2 mist explosion, and celebratory reveal: **AHHH. THAT'S BETTER.**
  - "Crack Another Can" reset button.
- **Procedural Web Audio Engine**:
  - Zero external audio file dependencies.
  - Realistic procedural synthesis: tab snap transient, pressurized CO2 hiss release, effervescent fizz, metallic whoosh, UI click feedback.
  - Sound toggle in top right (`SOUND ON / SOUND OFF`, muted by default).
- **Cinematic Product Carousel**:
  - Large visual Dominance, **01 / 04** progress counter with animated progress bar.
  - Dragging, touch swipe, keyboard arrows, and navigation buttons.
- **Floating Glassmorphic Navbar & Mobile Drawer**:
  - Translucent glass with blur on scroll, mobile hamburger menu, custom metallic desktop cursor.

---

### 2. Brand Admin Dashboard (`/admin`)
- **Completely separate, secure, and practical CMS**:
  - Session token authentication (`admin` / `dietcoke2026!`).
  - Password change form with old/new validation.
- **Product & Flavor Catalog Manager**:
  - Full CRUD: Add new flavors, edit existing, delete, reorder.
  - Configurable: Name, Slug, Tagline, Accent Color (color picker), Secondary Color, Badge, Calories, Sugar, Caffeine, Description, and Taste Notes.
- **Live Copy & Campaign Editor**:
  - Hero headline words, subheadline, CTA text, announcement ticker, can opener slogans, brand story, and stats.
  - Instant live publishing to the frontend without code changes.
- **Live Telemetry & Analytics**:
  - Real-time counters: Visits, Can Pops (Tab Pulls), Sound Unmutes, Engagement Conversion %.
  - Flavor Popularity distribution bar chart.
- **Danger Zone**:
  - "Restore Brand Defaults" one-click button.

---

## 🚀 Running the Application

To start the server:
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
Or double-click:
```bash
start.bat
```

- **Public Experience**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Admin Dashboard**: [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)
- **Admin Credentials**: `admin` / `dietcoke2026!`
