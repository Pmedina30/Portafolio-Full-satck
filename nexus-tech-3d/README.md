# NEXUS-01: Cybernetic Neural Spatial Audio (3D Tech Store)

A viral, high-converting tech store landing page for the **NEXUS-01** flagship headphone, built with **Three.js**, **React**, and **Tailwind CSS**. Features real-time Apple-style **3D scroll-driven kinematics**, exploded view animations, spatial driver zoom, live color customizer, and an interactive slide-over cart.

---

## 🚀 Key 3D & Interactive Features

- **Apple-Style Exploded 3D Scroll**:
  - **Stage 1: Hero Reveal**: Smooth 3D rotation with dynamic metallic reflections and sweeping studio lights.
  - **Stage 2: Exploded Kinematics**: Headphone sub-assemblies (outer CNC earcups, beryllium-titanium planar drivers, Neural-16 tensor chips, and memory foam cushions) physically separate along the X/Z axes with holographic callout cards.
  - **Stage 3: Spatial Driver Macro Zoom**: Camera dives directly into the 50mm titanium acoustic diaphragm with pulsing soundwave audio particles.
  - **Stage 4: Live 3D Colorway Customizer**: Headphone reassembles in real time. Clicking color swatches updates the 3D PBR materials and LED neon ring emissions immediately:
    - *Obsidian Cyber* (`#111827` / Cyan LED)
    - *Neon Cyberpunk* (`#0e7490` / Neon Cyan LED)
    - *Titanium Silver* (`#d1d5db` / Frost Blue LED)
    - *Cosmic Nebula* (`#581c87` / Violet LED)
  - **Stage 5: Tech Blueprint & Purchase**: Detailed audio specs and checkout trigger.
- **Interactive 360° Inspection Mode**:
  - Click **"Inspect 3D"** in the top bar to freely orbit, tilt, and spin the 3D model using mouse or touch drag.
- **Built-in Cyber Ambient Audio**:
  - Toggle audio in the navigation bar to hear a generative lowpass cyber drone synthesized entirely in real-time via the Web Audio API (zero external audio file downloads required).
- **Interactive Cart Drawer**:
  - Slide-over shopping bag with selected colorway preview, quantity toggles, and instant checkout confirmation modal.

---

## ⚡ Quick Start

### Method 1: Double-Click Launcher
Double-click **`run_nexus.bat`** in the project root.
Open your browser at **`http://localhost:5174`**.

### Method 2: Manual Terminal
```bash
cd nexus-tech-3d
npm install
npm run dev
```

---

## 📂 Architecture

```
nexus-tech-3d/
├── package.json               # Three.js, React 18, Tailwind CSS, Lucide
├── tailwind.config.js         # Cyber dark & neon aesthetic palette
├── vite.config.js             # Dev server on port 5174
├── src/
│   ├── index.css              # Cyber scrollbar & glow utilities
│   ├── App.jsx                # Coordinates Three.js canvas & scroll progress
│   ├── main.jsx               # React entrypoint
│   ├── three/
│   │   └── SceneManager.js    # Three.js WebGL engine with exploded kinematics
│   └── components/
│       ├── Navbar.jsx         # Sticky header with 3D scene % & audio toggle
│       ├── ScrollOverlay.jsx  # 5-stage scroll story overlay & color swatches
│       ├── CartDrawer.jsx     # Slide-over cart & order confirmation
│       └── SpecsModal.jsx     # Full technical blueprint specs dialog
```

