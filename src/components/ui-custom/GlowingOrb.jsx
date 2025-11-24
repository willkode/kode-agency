import React from 'react';

export default function GlowingOrb({ 
  color = "#73e28a", 
  size = "300px", 
  position = "top-right",
  blur = "100px",
  opacity = 0.15
}) {
  const positionClasses = {
    'top-right': 'top-0 right-0 translate-x-1/3 -translate-y-1/3',
    'top-left': 'top-0 left-0 -translate-x-1/3 -translate-y-1/3',
    'bottom-right': 'bottom-0 right-0 translate-x-1/3 translate-y-1/3',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/3 translate-y-1/3',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <div 
      className={`absolute ${positionClasses[position]} pointer-events-none animate-pulse-slow`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur})`,
        opacity: opacity,
      }}
    />
  );
}