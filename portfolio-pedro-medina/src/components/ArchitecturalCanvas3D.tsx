import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type SpatialMode = 'monolith' | 'lattice' | 'orbital';

interface ArchitecturalCanvas3DProps {
  mode?: SpatialMode;
  className?: string;
}

export const ArchitecturalCanvas3D: React.FC<ArchitecturalCanvas3DProps> = ({
  mode = 'monolith',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<SpatialMode>(mode);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Studio Lighting (Swiss Architectural Daylight + Warm Signal Rim)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
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

    // Master Group for kinetic sculpture
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. Core Architectural Polyhedron (Matte Titanium/Obsidian)
    const coreGeo = new THREE.IcosahedronGeometry(1.15, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.78,
      roughness: 0.24,
      flatShading: true
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    // 2. Precision Wireframe Cage
    const wireGeo = new THREE.IcosahedronGeometry(1.42, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x71717a,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    masterGroup.add(wireMesh);

    // 3. Signal-Orange Calibration Rings
    const ringGeo1 = new THREE.TorusGeometry(1.82, 0.014, 16, 120);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xff4f18,
      transparent: true,
      opacity: 0.85
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.6;
    ring1.rotation.y = Math.PI / 8;
    masterGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.12, 0.008, 12, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xa1a1aa,
      transparent: true,
      opacity: 0.45
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 3.2;
    ring2.rotation.z = Math.PI / 5;
    masterGroup.add(ring2);

    // 4. Parametric Lattice Nodes (Clean Geometric Datum Points)
    const nodeGeo = new THREE.BoxGeometry(0.065, 0.065, 0.065);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xff4f18,
      metalness: 0.4,
      roughness: 0.2
    });
    const nodesGroup = new THREE.Group();
    const posAttr = wireGeo.attributes.position;
    const seen = new Set<string>();
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

    // 5. Subtle Architectural Datum Floor Grid
    const gridHelper = new THREE.GridHelper(9, 18, 0xff4f18, 0x3f3f46);
    gridHelper.position.y = -2.1;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.22;
    scene.add(gridHelper);

    // Pointer / Drag Interaction with Smooth Damping
    let targetRotX = 0.18;
    let targetRotY = -0.35;
    let currentRotX = targetRotX;
    let currentRotY = targetRotY;
    let dragging = false;
    let prevX = 0;
    let prevY = 0;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      setIsDragging(true);
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (dragging) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        targetRotY += dx * 0.008;
        targetRotX += dy * 0.008;
        prevX = e.clientX;
        prevY = e.clientY;
      } else {
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        targetRotY = -0.35 + nx * 0.28;
        targetRotX = 0.18 + ny * 0.18;
      }
    };

    const onPointerUp = () => {
      dragging = false;
      setIsDragging(false);
    };

    const el = renderer.domElement;
    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // ResizeObserver for crisp responsive rendering
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Theme observer (Dark vs Light Swiss Alabaster)
    const updateThemeColors = () => {
      const isDark = document.documentElement.classList.contains('dark');
      coreMat.color.setHex(isDark ? 0x18181b : 0xe4e4e7);
      coreMat.roughness = isDark ? 0.24 : 0.35;
      wireMat.color.setHex(isDark ? 0x71717a : 0x52525b);
      wireMat.opacity = isDark ? 0.35 : 0.28;
    };
    updateThemeColors();

    const themeObserver = new MutationObserver(updateThemeColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;

      const activeMode = modeRef.current;

      if (activeMode === 'monolith') {
        coreMesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);
        wireMesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);
        nodesGroup.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);
        coreMesh.rotation.y = t * 0.18;
        wireMesh.rotation.y = -t * 0.1;
      } else if (activeMode === 'lattice') {
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
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      renderer.dispose();
      if (el.parentElement === container) {
        container.removeChild(el);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      } ${className}`}
      aria-label="Interactive 3D Architectural Sculpture"
    />
  );
};
