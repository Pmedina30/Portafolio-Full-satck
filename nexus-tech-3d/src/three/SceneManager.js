import * as THREE from 'three';

export class SceneManager {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.width = canvasContainer.clientWidth;
    this.height = canvasContainer.clientHeight;

    this.scrollProgress = 0;
    this.targetScrollProgress = 0;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isInspectMode = false;
    this.inspectRotation = { x: 0, y: 0 };

    this.colorways = {
      obsidian: {
        body: 0x111827,
        cushion: 0x090d16,
        accent: 0x1f2937,
        led: 0x06b6d4,
        metalness: 0.92,
        roughness: 0.25,
        rimColor: 0x06b6d4
      },
      cyan: {
        body: 0x083344,
        cushion: 0x041f2a,
        accent: 0x0e7490,
        led: 0x22d3ee,
        metalness: 0.88,
        roughness: 0.2,
        rimColor: 0x22d3ee
      },
      silver: {
        body: 0xd1d5db,
        cushion: 0x1f2937,
        accent: 0x9ca3af,
        led: 0x38bdf8,
        metalness: 0.98,
        roughness: 0.15,
        rimColor: 0xffffff
      },
      violet: {
        body: 0x3b0764,
        cushion: 0x1e0538,
        accent: 0x6b21a8,
        led: 0xc084fc,
        metalness: 0.9,
        roughness: 0.22,
        rimColor: 0xa855f7
      }
    };

    this.currentColorway = 'obsidian';

    this.init();
    this.createLights();
    this.createModel();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  init() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(42, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, 5.5);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.container.appendChild(this.renderer.domElement);
  }

  createLights() {
    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(this.ambientLight);

    // Key front light
    this.keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    this.keyLight.position.set(3, 4, 5);
    this.scene.add(this.keyLight);

    // Cyber Cyan Rim light
    this.rimLight1 = new THREE.DirectionalLight(0x06b6d4, 3.5);
    this.rimLight1.position.set(-5, 2, -2);
    this.scene.add(this.rimLight1);

    // Electric Violet Accent light
    this.rimLight2 = new THREE.DirectionalLight(0x8b5cf6, 2.5);
    this.rimLight2.position.set(5, -3, -3);
    this.scene.add(this.rimLight2);

    // Dynamic inner driver light
    this.innerLight = new THREE.PointLight(0x06b6d4, 1.5, 4);
    this.innerLight.position.set(0, 0, 0);
    this.scene.add(this.innerLight);
  }

  createModel() {
    this.rootGroup = new THREE.Group();
    this.scene.add(this.rootGroup);

    const cfg = this.colorways[this.currentColorway];

    // Shared Materials
    this.bodyMaterial = new THREE.MeshStandardMaterial({
      color: cfg.body,
      metalness: cfg.metalness,
      roughness: cfg.roughness
    });

    this.cushionMaterial = new THREE.MeshStandardMaterial({
      color: cfg.cushion,
      roughness: 0.85,
      metalness: 0.1
    });

    this.accentMaterial = new THREE.MeshStandardMaterial({
      color: cfg.accent,
      metalness: 0.95,
      roughness: 0.1
    });

    this.driverMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 1.0,
      roughness: 0.15,
      wireframe: false
    });

    this.chipMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.3,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.4
    });

    this.ledMaterial = new THREE.MeshBasicMaterial({
      color: cfg.led
    });

    // 1. HEADBAND ASSEMBLY
    this.headbandGroup = new THREE.Group();
    
    // Headband Curve
    const bandCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-1.6, 0.4, 0),
      new THREE.Vector3(-1.2, 1.8, 0),
      new THREE.Vector3(1.2, 1.8, 0),
      new THREE.Vector3(1.6, 0.4, 0)
    );
    const bandGeometry = new THREE.TubeGeometry(bandCurve, 64, 0.12, 16, false);
    const headbandMesh = new THREE.Mesh(bandGeometry, this.accentMaterial);
    this.headbandGroup.add(headbandMesh);

    // Inner Comfort Cushion
    const cushionCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-1.1, 0.8, 0),
      new THREE.Vector3(-0.8, 1.65, 0),
      new THREE.Vector3(0.8, 1.65, 0),
      new THREE.Vector3(1.1, 0.8, 0)
    );
    const cushionBandGeo = new THREE.TubeGeometry(cushionCurve, 40, 0.09, 12, false);
    const cushionBandMesh = new THREE.Mesh(cushionBandGeo, this.cushionMaterial);
    this.headbandGroup.add(cushionBandMesh);

    this.rootGroup.add(this.headbandGroup);

    // Helper to create an ear cup subassembly
    const createEarAssembly = (isLeft) => {
      const assembly = new THREE.Group();
      const sign = isLeft ? -1 : 1;

      // Outer Acoustic Shell
      const shellGeo = new THREE.CylinderGeometry(0.85, 0.8, 0.45, 36);
      shellGeo.rotateZ(Math.PI / 2);
      const shell = new THREE.Mesh(shellGeo, this.bodyMaterial);
      shell.name = isLeft ? 'left_shell' : 'right_shell';
      assembly.add(shell);

      // Glowing LED Accent Ring
      const ringGeo = new THREE.TorusGeometry(0.78, 0.03, 16, 48);
      ringGeo.rotateY(Math.PI / 2);
      const ring = new THREE.Mesh(ringGeo, this.ledMaterial);
      ring.position.x = sign * 0.22;
      assembly.add(ring);

      // Memory Foam Cushion
      const cushionGeo = new THREE.TorusGeometry(0.82, 0.22, 16, 48);
      cushionGeo.rotateY(Math.PI / 2);
      const cushion = new THREE.Mesh(cushionGeo, this.cushionMaterial);
      cushion.position.x = sign * -0.22;
      assembly.add(cushion);

      // Titanium Driver Diaphragm
      const driverGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.08, 32);
      driverGeo.rotateZ(Math.PI / 2);
      const driver = new THREE.Mesh(driverGeo, this.driverMaterial);
      driver.name = 'driver';
      assembly.add(driver);

      // Neural Core Microchip (visible when exploded)
      const chipGeo = new THREE.BoxGeometry(0.04, 0.35, 0.35);
      const chip = new THREE.Mesh(chipGeo, this.chipMaterial);
      chip.name = 'neural_chip';
      assembly.add(chip);

      // Mounting Yoke
      const yokeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.55, 16);
      const yoke = new THREE.Mesh(yokeGeo, this.accentMaterial);
      yoke.position.y = 0.85;
      assembly.add(yoke);

      return { assembly, shell, ring, cushion, driver, chip };
    };

    // Left Assembly
    const left = createEarAssembly(true);
    this.leftGroup = left.assembly;
    this.leftGroup.position.set(-1.6, 0.1, 0);
    this.leftParts = left;
    this.rootGroup.add(this.leftGroup);

    // Right Assembly
    const right = createEarAssembly(false);
    this.rightGroup = right.assembly;
    this.rightGroup.position.set(1.6, 0.1, 0);
    this.rightParts = right;
    this.rootGroup.add(this.rightGroup);
  }

  createParticles() {
    const count = 220;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const baseColor = new THREE.Color(0x06b6d4);
    const secondColor = new THREE.Color(0x8b5cf6);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      positions[idx] = (Math.random() - 0.5) * 8;
      positions[idx + 1] = (Math.random() - 0.5) * 6;
      positions[idx + 2] = (Math.random() - 0.5) * 6;

      const c = Math.random() > 0.5 ? baseColor : secondColor;
      colors[idx] = c.r;
      colors[idx + 1] = c.g;
      colors[idx + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  setColorway(id) {
    if (!this.colorways[id]) return;
    this.currentColorway = id;
    const cfg = this.colorways[id];

    this.bodyMaterial.color.setHex(cfg.body);
    this.bodyMaterial.metalness = cfg.metalness;
    this.bodyMaterial.roughness = cfg.roughness;

    this.cushionMaterial.color.setHex(cfg.cushion);
    this.accentMaterial.color.setHex(cfg.accent);

    this.ledMaterial.color.setHex(cfg.led);
    this.rimLight1.color.setHex(cfg.rimColor);
    this.innerLight.color.setHex(cfg.led);
  }

  setScrollProgress(p) {
    this.targetScrollProgress = Math.max(0, Math.min(1, p));
  }

  bindEvents() {
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', (e) => {
      if (this.isInspectMode) return;
      this.mouse.targetX = (e.clientX / this.width - 0.5) * 2;
      this.mouse.targetY = (e.clientY / this.height - 0.5) * 2;
    });
  }

  onResize() {
    if (!this.container) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  animate() {
    this.rafId = requestAnimationFrame(this.animate.bind(this));

    const time = performance.now() * 0.001;

    // Smooth scroll progress lerp
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.075;
    const p = this.scrollProgress;

    // Smooth mouse lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Subtle particle drift
    if (this.particles) {
      this.particles.rotation.y = time * 0.03;
      this.particles.rotation.x = Math.sin(time * 0.02) * 0.1;
    }

    if (!this.isInspectMode) {
      // ----------------------------------------------------
      // CINEMATIC SCROLL STAGES (Apple-Style Exploded View)
      // ----------------------------------------------------

      // Default Positions
      let baseRotX = 0;
      let baseRotY = 0;
      let baseRotZ = 0;
      let camZ = 5.5;
      let camX = 0;
      let camY = 0;

      let explodeOut = 0;     // Separation distance of earcups
      let driverPop = 0;      // Driver displacement
      let chipPop = 0;        // Neural chip displacement
      let headbandRise = 0;   // Headband upward movement

      if (p <= 0.25) {
        // STAGE 0 -> 1: Hero Entry & Tilted Angle
        const t = p / 0.25;
        baseRotY = -0.5 + t * 0.8;
        baseRotX = Math.sin(t * Math.PI) * 0.2;
        camZ = 5.5 - t * 0.3;
      } else if (p <= 0.55) {
        // STAGE 1 -> 2: EXPLODED ENGINEERING VIEW
        const t = (p - 0.25) / 0.3;
        const ease = Math.sin(t * Math.PI * 0.5);

        baseRotY = 0.3 + ease * 0.6;
        baseRotX = 0.15 + ease * 0.25;
        baseRotZ = ease * -0.1;

        explodeOut = ease * 1.4;    // Earcups separate outwards
        driverPop = ease * 0.9;     // Titanium driver pops out
        chipPop = ease * 0.7;       // Neural chip explodes forward
        headbandRise = ease * 0.6;  // Headband floats upwards

        camZ = 5.2 + ease * 0.4;
      } else if (p <= 0.75) {
        // STAGE 2 -> 3: SPATIAL DRIVER MACRO ZOOM
        const t = (p - 0.55) / 0.2;
        const ease = Math.sin(t * Math.PI * 0.5);

        // Zoom camera towards driver
        camX = -1.2 * ease;
        camY = 0.1 * ease;
        camZ = 5.6 - ease * 2.6;

        baseRotY = 0.9 - ease * 0.3;
        baseRotX = 0.4 - ease * 0.2;

        explodeOut = 1.4 - ease * 0.4;
        driverPop = 0.9 + Math.sin(time * 18) * 0.04; // Driver bass pulse vibration!
        chipPop = 0.7;
        headbandRise = 0.6;
      } else if (p <= 0.9) {
        // STAGE 3 -> 4: REASSEMBLY & COLOR CUSTOMIZER
        const t = (p - 0.75) / 0.15;
        const ease = Math.sin(t * Math.PI * 0.5);

        camX = -1.2 * (1 - ease);
        camZ = 3.0 + ease * 2.3;

        baseRotY = 0.6 + ease * 0.5;
        baseRotX = 0.2 * (1 - ease);

        explodeOut = 1.0 * (1 - ease);
        driverPop = 0.9 * (1 - ease);
        chipPop = 0.7 * (1 - ease);
        headbandRise = 0.6 * (1 - ease);
      } else {
        // STAGE 4 -> 5: FINAL HERO CHECKOUT STANCE
        const t = (p - 0.9) / 0.1;
        baseRotY = 1.1 + t * 0.3 + Math.sin(time * 0.5) * 0.05;
        baseRotX = -0.15;
        baseRotZ = 0.1;
        camZ = 5.3;
      }

      // Apply root transformations with mouse parallax
      this.rootGroup.rotation.y = baseRotY + this.mouse.x * 0.35;
      this.rootGroup.rotation.x = baseRotX - this.mouse.y * 0.25;
      this.rootGroup.rotation.z = baseRotZ;

      // Gentle floating bob
      this.rootGroup.position.y = Math.sin(time * 1.5) * 0.08;

      // Apply exploded displacements to parts
      this.leftGroup.position.x = -1.6 - explodeOut;
      this.rightGroup.position.x = 1.6 + explodeOut;

      this.leftParts.driver.position.x = -driverPop;
      this.rightParts.driver.position.x = driverPop;

      this.leftParts.chip.position.z = chipPop;
      this.rightParts.chip.position.z = chipPop;

      this.headbandGroup.position.y = headbandRise;

      this.camera.position.x = camX;
      this.camera.position.y = camY;
      this.camera.position.z = camZ;
    } else {
      // Free inspect mode
      this.rootGroup.rotation.x = this.inspectRotation.x;
      this.rootGroup.rotation.y = this.inspectRotation.y;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize.bind(this));
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
  }
}

