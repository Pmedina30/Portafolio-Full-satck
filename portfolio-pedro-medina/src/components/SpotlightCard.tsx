import React, { useRef, useState, useCallback } from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'purple' | 'blue' | 'emerald' | 'amber';
  spotlightSize?: number;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  glowColor = 'purple',
  spotlightSize = 350,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setOpacity(1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
  }, []);

  const getGlowGradients = () => {
    switch (glowColor) {
      case 'blue':
        return {
          inner: 'rgba(59, 130, 246, 0.18)',
          border: 'rgba(56, 189, 248, 0.35)'
        };
      case 'emerald':
        return {
          inner: 'rgba(16, 185, 129, 0.18)',
          border: 'rgba(52, 211, 153, 0.35)'
        };
      case 'amber':
        return {
          inner: 'rgba(245, 158, 11, 0.18)',
          border: 'rgba(251, 191, 36, 0.35)'
        };
      case 'purple':
      default:
        return {
          inner: 'rgba(168, 85, 247, 0.18)',
          border: 'rgba(192, 132, 252, 0.35)'
        };
    }
  };

  const glow = getGlowGradients();

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-2xl bg-[#0D0D11] border border-neutral-800/80 p-6 overflow-hidden transition-all duration-300 hover:border-neutral-700/80 group ${className}`}
      {...props}
    >
      {/* 1. Dynamic Radial Gradient Border Glow (Mouse Tracking) */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${glow.border}, transparent 65%)`
        }}
      />

      {/* 2. Dynamic Radial Gradient Card Surface Glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(${spotlightSize * 1.2}px circle at ${position.x}px ${position.y}px, ${glow.inner}, transparent 65%)`
        }}
      />

      {/* 3. Card Content (Positioned relatively above gradients) */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

