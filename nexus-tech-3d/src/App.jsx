import React, { useEffect, useRef, useState } from 'react';
import { SceneManager } from './three/SceneManager';
import Navbar from './components/Navbar';
import ScrollOverlay from './components/ScrollOverlay';
import CartDrawer from './components/CartDrawer';
import SpecsModal from './components/SpecsModal';

export default function App() {
  const canvasRef = useRef(null);
  const sceneManagerRef = useRef(null);

  const [scrollPercent, setScrollPercent] = useState(0);
  const [selectedColor, setSelectedColor] = useState('obsidian');
  const [isInspectMode, setIsInspectMode] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    { id: 'nexus-01', color: 'obsidian', price: 499, quantity: 1 }
  ]);

  // Web Audio Context reference for ambient cyber drone
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  // Initialize Three.js Engine
  useEffect(() => {
    if (!canvasRef.current) return;
    const sm = new SceneManager(canvasRef.current);
    sceneManagerRef.current = sm;

    return () => {
      sm.destroy();
    };
  }, []);

  // Handle Scroll Progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      
      const roundedPercent = Math.min(100, Math.max(0, Math.round(progress * 100)));
      setScrollPercent(roundedPercent);

      if (sceneManagerRef.current) {
        sceneManagerRef.current.setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Mouse Drag for Inspect Mode
  useEffect(() => {
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      if (!isInspectMode) return;
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging || !isInspectMode || !sceneManagerRef.current) return;
      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;
      prevMouse = { x: e.clientX, y: e.clientY };

      sceneManagerRef.current.inspectRotation.y += deltaX * 0.01;
      sceneManagerRef.current.inspectRotation.x += deltaY * 0.01;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isInspectMode]);

  // Ambient Audio Synthesizer (Native Web Audio API, no external mp3 needed)
  const toggleAudio = () => {
    if (isAudioPlaying) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsAudioPlaying(false);
    } else {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        // Sub-bass drone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(55, ctx.currentTime); // A1 note 55Hz

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, ctx.currentTime);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        oscRef.current = osc;
        setIsAudioPlaying(true);
      } catch (err) {
        console.warn('Web Audio synthesis not supported:', err);
      }
    }
  };

  const handleSelectColor = (colorId) => {
    setSelectedColor(colorId);
    if (sceneManagerRef.current) {
      sceneManagerRef.current.setColorway(colorId);
    }
  };

  const handleAddToCart = (color) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.color === color);
      if (existing) {
        return prev.map(i => i.color === color ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: `nexus-01-${color}`, color, price: 499, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index, newQty) => {
    setCartItems(prev => prev.map((item, idx) => idx === index ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveItem = (index) => {
    setCartItems(prev => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 3D WebGL Canvas Layer (Fixed in background) */}
      <div 
        ref={canvasRef} 
        className={`fixed inset-0 w-full h-full z-0 transition-opacity duration-500 ${
          isInspectMode ? 'cursor-grab active:cursor-grabbing pointer-events-auto' : 'pointer-events-none'
        }`}
      />

      {/* Cyber Grid Background Accents */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20"></div>

      {/* Top Navbar */}
      <Navbar 
        scrollPercent={scrollPercent}
        isInspectMode={isInspectMode}
        onToggleInspect={() => {
          const next = !isInspectMode;
          setIsInspectMode(next);
          if (sceneManagerRef.current) {
            sceneManagerRef.current.isInspectMode = next;
          }
        }}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={toggleAudio}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenSpecs={() => setIsSpecsOpen(true)}
      />

      {/* 3D Inspect Mode Floating Helper Pill */}
      {isInspectMode && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 glass-panel px-6 py-3 rounded-full text-xs font-mono text-cyan-300 border border-cyan-500/50 shadow-2xl flex items-center gap-3 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Click and drag anywhere to orbit 3D model</span>
          <button 
            onClick={() => {
              setIsInspectMode(false);
              if (sceneManagerRef.current) sceneManagerRef.current.isInspectMode = false;
            }}
            className="px-2.5 py-1 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 font-bold"
          >
            Resume Scroll
          </button>
        </div>
      )}

      {/* Scrollable Story Stages Overlay */}
      <ScrollOverlay 
        selectedColor={selectedColor}
        onSelectColor={handleSelectColor}
        onAddToCart={handleAddToCart}
        onOpenSpecs={() => setIsSpecsOpen(true)}
        scrollProgress={scrollPercent}
      />

      {/* Slide-over Shopping Cart */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
      />

      {/* Technical Specifications Modal */}
      <SpecsModal 
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />

    </div>
  );
}

