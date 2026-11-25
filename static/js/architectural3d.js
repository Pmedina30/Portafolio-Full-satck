import * as THREE from '../vendor/three.module.min.js';

export function initArchitectural3D(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let currentMode = 'monolith';
  const width = container.clientWidth || 480;
  const height = container.clientHeight || 360;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(0, 0.35, 5.2);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

  // Studio Architectural Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(4, 6, 5);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xff4f18, 1.8);
  rimLight.position.set(-5, -2, 3);
  scene.add(rimLight);

  const coolFill = new THREE.DirectionalLight(0xd4d4d8, 0.9);
  coolFill.position.set(0, -5, -4);
  scene.add(coolFill);

  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // 1. Core Architectural Polyhedron
  const coreGeo = new THREE.IcosahedronGeometry(1.12, 1);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    metalness: 0.78,
    roughness: 0.24,
    flatShading: true
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  masterGroup.add(coreMesh);

  // 2. Precision Wireframe Cage
  const wireGeo = new THREE.IcosahedronGeometry(1.4, 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x71717a,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  masterGroup.add(wireMesh);

  // 3. Calibration Rings
  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(1.8, 0.014, 16, 120),
    new THREE.MeshBasicMaterial({ color: 0xff4f18, transparent: true, opacity: 0.85 })
  );
  ring1.rotation.x = Math.PI / 2.6;
  ring1.rotation.y = Math.PI / 8;
  masterGroup.add(ring1);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.1, 0.008, 12, 120),
    new THREE.MeshBasicMaterial({ color: 0x8c8c84, transparent: true, opacity: 0.45 })
  );
  ring2.rotation.x = -Math.PI / 3.2;
  ring2.rotation.z = Math.PI / 5;
  masterGroup.add(ring2);

  // 4. Parametric Lattice Datum Nodes
  const nodeGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
  const nodeMat = new THREE.MeshStandardMaterial({
    color: 0xff4f18,
    metalness: 0.4,
    roughness: 0.2
  });
  const nodesGroup = new THREE.Group();
  const posAttr = wireGeo.attributes.position;
  const seen = new Set();
  for (let i = 0; i < posAttr.count; i++) {
    const vx = posAttr.getX(i);
    const vy = posAttr.getY(i);
    const vz = posAttr.getZ(i);
    const key = `${vx.toFixed(2)},${vy.toFixed(2)},${vz.toFixed(2)}`;
    if (!seen.has(key)) {
      seen.add(key);
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(vx, vy, vz);
      nodesGroup.add(node);
    }
  }
  masterGroup.add(nodesGroup);

  // 5. Datum Floor Grid
  const gridHelper = new THREE.GridHelper(9, 18, 0xff4f18, 0x52525b);
  gridHelper.position.y = -2.05;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.2;
  scene.add(gridHelper);

  // Interaction
  let targetRotX = 0.18;
  let targetRotY = -0.35;
  let currentRotX = targetRotX;
  let currentRotY = targetRotY;
  let dragging = false;
  let prevX = 0;
  let prevY = 0;

  const el = renderer.domElement;
  el.addEventListener('pointerdown', (e) => {
    dragging = true;
    container.style.cursor = 'grabbing';
    prevX = e.clientX;
    prevY = e.clientY;
  });

  window.addEventListener('pointermove', (e) => {
    const rect = container.getBoundingClientRect();
    if (dragging) {
      targetRotY += (e.clientX - prevX) * 0.008;
      targetRotX += (e.clientY - prevY) * 0.008;
      prevX = e.clientX;
      prevY = e.clientY;
    } else {
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = -0.35 + nx * 0.25;
      targetRotX = 0.18 + ny * 0.16;
    }
  });

  window.addEventListener('pointerup', () => {
    dragging = false;
    container.style.cursor = 'grab';
  });

  // ResizeObserver
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width: w, height: h } = entry.contentRect;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    }
  });
  ro.observe(container);

  // Theme sync
  const syncTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    coreMat.color.setHex(isDark ? 0x18181b : 0xe4e4e7);
    coreMat.roughness = isDark ? 0.24 : 0.36;
    wireMat.color.setHex(isDark ? 0x71717a : 0x52525b);
  };
  syncTheme();
  new MutationObserver(syncTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  // Mode buttons
  document.querySelectorAll('[data-spatial-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentMode = btn.getAttribute('data-spatial-mode') || 'monolith';
      document.querySelectorAll('[data-spatial-mode]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = prefersReduced ? 0 : clock.getElapsedTime();

    currentRotX += (targetRotX - currentRotX) * 0.06;
    currentRotY += (targetRotY - currentRotY) * 0.06;

    if (currentMode === 'monolith') {
      coreMesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);
      wireMesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);
      nodesGroup.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);
      coreMesh.rotation.y = t * 0.18;
      wireMesh.rotation.y = -t * 0.1;
    } else if (currentMode === 'lattice') {
      coreMesh.scale.lerp(new THREE.Vector3(0.72, 0.72, 0.72), 0.08);
      wireMesh.scale.lerp(new THREE.Vector3(1.18, 1.18, 1.18), 0.08);
      nodesGroup.scale.lerp(new THREE.Vector3(1.18, 1.18, 1.18), 0.08);
      coreMesh.rotation.y = t * 0.32;
      wireMesh.rotation.y = -t * 0.22;
    } else {
      coreMesh.scale.lerp(new THREE.Vector3(0.88, 0.88, 0.88), 0.08);
      wireMesh.scale.lerp(new THREE.Vector3(1.05, 1.05, 1.05), 0.08);
      nodesGroup.scale.lerp(new THREE.Vector3(1.05, 1.05, 1.05), 0.08);
      coreMesh.rotation.y = t * 0.45;
      coreMesh.rotation.z = Math.sin(t * 0.5) * 0.15;
    }

    nodesGroup.rotation.copy(wireMesh.rotation);
    ring1.rotation.z = t * 0.24;
    ring2.rotation.y = -t * 0.18;

    masterGroup.rotation.x = currentRotX;
    masterGroup.rotation.y = currentRotY;
    masterGroup.position.y = Math.sin(t * 1.1) * 0.06;

    renderer.render(scene, camera);
  }
  animate();
}
