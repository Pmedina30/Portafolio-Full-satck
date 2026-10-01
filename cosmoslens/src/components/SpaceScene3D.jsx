import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Procedural Earth Texture Generator
 * Creates an exquisite 2048x1024 landmass/ocean map with city night lights
 * so the app renders immediately without waiting for external texture network calls.
 */
function createEarthTextures() {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Deep ocean base
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#06132b');
  oceanGrad.addColorStop(0.5, '#020b1e');
  oceanGrad.addColorStop(1, '#06132b');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Procedural continental landmasses
  ctx.fillStyle = '#1c3d2e';
  // North America
  ctx.beginPath();
  ctx.ellipse(500, 320, 240, 150, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // South America
  ctx.beginPath();
  ctx.ellipse(680, 680, 140, 220, -0.2, 0, Math.PI * 2);
  ctx.fill();
  // Eurasia
  ctx.beginPath();
  ctx.ellipse(1350, 280, 380, 170, -0.1, 0, Math.PI * 2);
  ctx.fill();
  // Africa
  ctx.beginPath();
  ctx.ellipse(1120, 520, 160, 210, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Australia
  ctx.beginPath();
  ctx.ellipse(1680, 720, 110, 80, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Greenland
  ctx.beginPath();
  ctx.ellipse(750, 160, 80, 60, -0.3, 0, Math.PI * 2);
  ctx.fillStyle = '#a0c4d8';
  ctx.fill();

  // Coastal shallows & elevation highlights
  ctx.fillStyle = '#2d5c43';
  ctx.beginPath();
  ctx.ellipse(1380, 320, 260, 110, -0.1, 0, Math.PI * 2);
  ctx.ellipse(510, 350, 170, 90, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Polar ice caps
  ctx.fillStyle = '#e8f4f8';
  ctx.fillRect(0, 0, width, 55);
  ctx.fillRect(0, height - 70, width, 70);

  // City night lights glow simulation
  ctx.fillStyle = '#ffe082';
  for (let i = 0; i < 600; i++) {
    const x = (Math.random() * width) | 0;
    const y = (Math.random() * height) | 0;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    // Only place city lights on land
    if (pixel[1] > 35 && pixel[0] > 10 && y > 120 && y < height - 120) {
      ctx.globalAlpha = Math.random() * 0.7 + 0.3;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 1.6 + 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Procedural Swirling Clouds Texture
 */
function createCloudTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * 1024;
    const y = 80 + Math.random() * 350;
    const rx = 40 + Math.random() * 90;
    const ry = 15 + Math.random() * 35;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, (Math.random() - 0.5) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

/**
 * Celestial Body Texture Generators (Moon, Mars, Jupiter)
 */
function createBodyTexture(bodyId) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (bodyId === 'moon') {
    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, 0, 1024, 512);
    // Dark maria
    ctx.fillStyle = '#334155';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 90 + 30, 0, Math.PI * 2);
      ctx.fill();
    }
    // Bright impact craters
    ctx.fillStyle = '#cbd5e1';
    for (let i = 0; i < 150; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 6 + 1, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (bodyId === 'mars') {
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#c2410c');
    grad.addColorStop(0.5, '#ea580c');
    grad.addColorStop(1, '#9a3412');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Dark volcanic basalt regions (Syrtis Major)
    ctx.fillStyle = '#7c2d12';
    for (let i = 0; i < 25; i++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * 1024, Math.random() * 512, Math.random() * 120 + 40, Math.random() * 50 + 20, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    // Polar ice caps
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 1024, 30);
    ctx.fillRect(0, 485, 1024, 27);
  } else if (bodyId === 'jupiter') {
    // Cloud bands
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0.0, '#78350f');
    grad.addColorStop(0.2, '#fef3c7');
    grad.addColorStop(0.35, '#b45309');
    grad.addColorStop(0.5, '#d97706');
    grad.addColorStop(0.65, '#fde68a');
    grad.addColorStop(0.85, '#92400e');
    grad.addColorStop(1.0, '#451a03');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Great Red Spot
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(650, 360, 80, 50, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

export default function SpaceScene3D({
  currentBody,
  satellites,
  selectedObject,
  onSelectObject,
  timeMultiplier = 1,
  isPaused = false,
  onWebGLFailure,
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const animFrameRef = useRef(null);

  const satelliteMeshesRef = useRef([]);
  const orbitLinesRef = useRef([]);
  const earthGroupRef = useRef(null);
  const cloudsMeshRef = useRef(null);
  const targetCameraPos = useRef(new THREE.Vector3(0, 1.8, 4.6));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect WebGL capability safely
    let gl;
    try {
      const testCanvas = document.createElement('canvas');
      gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
      if (!gl) {
        if (onWebGLFailure) onWebGLFailure();
        return;
      }
    } catch (e) {
      if (onWebGLFailure) onWebGLFailure();
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.8, 4.6);
    cameraRef.current = camera;

    // 2. High-performance Antialiased WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Smooth Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.8;
    controls.maxDistance = 12.0;
    controls.enablePan = false;
    controlsRef.current = controls;

    // 4. Spatial Lighting
    const ambientLight = new THREE.AmbientLight(0x1a2644, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(12, 6, 10);
    scene.add(sunLight);

    // Subtle blue fill light from deep space
    const fillLight = new THREE.DirectionalLight(0x00E5FF, 0.6);
    fillLight.position.set(-10, -4, -8);
    scene.add(fillLight);

    // 5. Procedural Deep Space Starfield with spectral classification
    const starCount = 2800;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const spectralPalette = [
      new THREE.Color('#ffffff'), // Class A/F white
      new THREE.Color('#93c5fd'), // Class B blue-white
      new THREE.Color('#00E5FF'), // visionOS neon cyan
      new THREE.Color('#fef08a'), // Class G yellow
      new THREE.Color('#fca5a5'), // Class M red dwarf
      new THREE.Color('#c084fc')  // visionOS violet
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 80 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const color = spectralPalette[Math.floor(Math.random() * spectralPalette.length)];
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 6. Primary Celestial Body Sphere
    const celestialGroup = new THREE.Group();
    earthGroupRef.current = celestialGroup;
    scene.add(celestialGroup);

    // Earth globe base
    const earthGeo = new THREE.SphereGeometry(1.0, 64, 64);
    const earthTex = createEarthTextures();
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTex,
      roughness: 0.7,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    celestialGroup.add(earthMesh);

    // Earth cloud layer
    const cloudsGeo = new THREE.SphereGeometry(1.015, 64, 64);
    const cloudsTex = createCloudTexture();
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudsTex,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    cloudsMeshRef.current = cloudsMesh;
    celestialGroup.add(cloudsMesh);

    // Atmosphere Fresnel Glow
    const atmosphereGeo = new THREE.SphereGeometry(1.15, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        glowColor: { value: new THREE.Color('#00E5FF') }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(glowColor, intensity * 0.75);
        }
      `
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    celestialGroup.add(atmosphereMesh);

    // 7. Generate Orbital Paths and Satellite 3D Meshes
    satelliteMeshesRef.current = [];
    orbitLinesRef.current = [];

    satellites.forEach((sat, index) => {
      // Orbital Elliptical Path
      const orbitCurve = new THREE.EllipseCurve(
        0, 0,
        sat.orbitRadius3D, sat.orbitRadius3D * 0.96, // subtle eccentricity
        0, 2 * Math.PI,
        false,
        0
      );
      const points = orbitCurve.getPoints(120);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(p.x, 0, p.y))
      );
      
      const orbitMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(sat.orbitColor),
        transparent: true,
        opacity: 0.35,
        linewidth: 1
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);

      // Rotate orbit line by satellite inclination
      const inclinationRad = THREE.MathUtils.degToRad(sat.inclinationDeg);
      orbitLine.rotation.x = THREE.MathUtils.degToRad(20);
      orbitLine.rotation.z = inclinationRad;
      scene.add(orbitLine);
      orbitLinesRef.current.push(orbitLine);

      // Satellite 3D Group
      const satGroup = new THREE.Group();
      satGroup.userData = { id: sat.id, name: sat.name, data: sat };

      // Core Satellite Bus
      const busGeo = new THREE.BoxGeometry(0.04, 0.04, 0.05);
      const busMat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.85,
        roughness: 0.2
      });
      const busMesh = new THREE.Mesh(busGeo, busMat);
      satGroup.add(busMesh);

      // Solar Panels
      const panelGeo = new THREE.BoxGeometry(0.12, 0.005, 0.04);
      const panelMat = new THREE.MeshStandardMaterial({
        color: 0x1e3a8a,
        emissive: 0x0f172a,
        metalness: 0.9,
        roughness: 0.1
      });
      const panelMesh = new THREE.Mesh(panelGeo, panelMat);
      satGroup.add(panelMesh);

      // Pulsing Glowing Beacon
      const beaconGeo = new THREE.SphereGeometry(0.025, 16, 16);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(sat.beaconColor),
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      satGroup.add(beaconMesh);

      // Outer Halo Ring
      const ringGeo = new THREE.RingGeometry(0.04, 0.055, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(sat.beaconColor),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      satGroup.add(ringMesh);

      scene.add(satGroup);
      satelliteMeshesRef.current.push({
        mesh: satGroup,
        orbitRadius: sat.orbitRadius3D,
        eccentricity: 0.96,
        inclinationZ: sat.inclinationDeg,
        speed: sat.speed3D * 0.004,
        angle: (index * (Math.PI * 2 / satellites.length)),
        data: sat
      });
    });

    // 8. Raycasting for Object Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactableObjects = satelliteMeshesRef.current.map(s => s.mesh);
      const intersects = raycaster.intersectObjects(interactableObjects, true);

      if (intersects.length > 0) {
        // Find top group
        let hit = intersects[0].object;
        while (hit.parent && !hit.userData?.id) {
          hit = hit.parent;
        }
        if (hit.userData?.data) {
          onSelectObject(hit.userData.data);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // 9. Resize listener
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Slow Earth rotation
      if (!isPaused && earthGroupRef.current) {
        earthGroupRef.current.rotation.y += 0.0008 * (timeMultiplier || 1);
        if (cloudsMeshRef.current) {
          cloudsMeshRef.current.rotation.y += 0.0011 * (timeMultiplier || 1);
        }
      }

      // Propagate Satellites along orbital paths
      if (satelliteMeshesRef.current) {
        satelliteMeshesRef.current.forEach((item) => {
          if (!isPaused) {
            item.angle += item.speed * (timeMultiplier || 1);
          }

          // Keplerian position
          const x = Math.cos(item.angle) * item.orbitRadius;
          const z = Math.sin(item.angle) * item.orbitRadius * item.eccentricity;
          const y = 0;

          const vec = new THREE.Vector3(x, y, z);
          // Apply orbit line orientation
          vec.applyAxisConversion = true;
          vec.applyAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(item.inclinationZ));
          vec.applyAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(20));

          item.mesh.position.copy(vec);

          // Face satellite in direction of orbit velocity vector
          const nextAngle = item.angle + 0.01;
          const nextX = Math.cos(nextAngle) * item.orbitRadius;
          const nextZ = Math.sin(nextAngle) * item.orbitRadius * item.eccentricity;
          const nextVec = new THREE.Vector3(nextX, 0, nextZ);
          nextVec.applyAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(item.inclinationZ));
          nextVec.applyAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(20));
          item.mesh.lookAt(nextVec);

          // Halo breath effect
          const scale = 1 + Math.sin(clock.getElapsedTime() * 4 + item.angle) * 0.15;
          item.mesh.children.forEach(c => {
            if (c.geometry instanceof THREE.RingGeometry) {
              c.scale.set(scale, scale, 1);
            }
          });
        });
      }

      // Smooth Camera Animation when focusing objects
      if (camera && targetCameraPos.current) {
        camera.position.lerp(targetCameraPos.current, 0.04);
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      renderer.dispose();
    };
  }, []);

  // Update body texture & scale when user switches celestial bodies
  useEffect(() => {
    if (!earthGroupRef.current) return;
    const body = currentBody || { id: 'earth', cameraDistance: 4.8 };

    // Update target camera distance smoothly
    targetCameraPos.current.set(0, 1.5, body.cameraDistance || 4.8);

    const mainSphere = earthGroupRef.current.children[0];
    const atmosphere = earthGroupRef.current.children[2];

    if (body.id === 'earth') {
      mainSphere.material.map = createEarthTextures();
      mainSphere.material.needsUpdate = true;
      if (cloudsMeshRef.current) cloudsMeshRef.current.visible = true;
      if (atmosphere) {
        atmosphere.visible = true;
        atmosphere.material.uniforms.glowColor.value.set('#00E5FF');
      }
    } else {
      mainSphere.material.map = createBodyTexture(body.id);
      mainSphere.material.needsUpdate = true;
      if (cloudsMeshRef.current) cloudsMeshRef.current.visible = false;
      if (atmosphere) {
        atmosphere.visible = body.id !== 'moon';
        atmosphere.material.uniforms.glowColor.value.set(body.color || '#8A2BE2');
      }
    }
  }, [currentBody]);

  // When a satellite is selected, smoothly pan camera towards it
  useEffect(() => {
    if (!selectedObject) return;
    const found = satelliteMeshesRef.current.find(s => s.data.id === selectedObject.id);
    if (found && cameraRef.current) {
      const pos = found.mesh.position;
      targetCameraPos.current.set(pos.x * 1.5 + 0.6, pos.y * 1.5 + 0.5, pos.z * 1.5 + 1.2);
    }
  }, [selectedObject]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* 3D Viewport Controls HUD overlay */}
      <div className="absolute top-20 left-6 pointer-events-none flex flex-col gap-1.5 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-vision-cyan animate-ping" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-vision-cyan">
            {currentBody?.name || 'Earth Orbital Sphere'} // 60 FPS NOMINAL
          </span>
        </div>
        <p className="text-[12px] text-slate-400 font-mono">
          Azimuth: 142.6° | Elevation: 28.4° | Range: {(currentBody?.cameraDistance * 1000).toFixed(0)} km
        </p>
      </div>

      <div className="absolute bottom-28 left-6 pointer-events-none z-10 flex items-center gap-3 text-[11px] font-mono text-slate-400">
        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 backdrop-blur-md">
          Left Drag: Rotate Orbit
        </span>
        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 backdrop-blur-md">
          Scroll: Zoom
        </span>
        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 backdrop-blur-md">
          Click Target: Inspect Telemetry
        </span>
      </div>
    </div>
  );
}
