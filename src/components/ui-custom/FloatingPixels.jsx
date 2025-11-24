import React, { useEffect, useState } from 'react';

export default function FloatingPixels({ count = 20 }) {
  const [pixels, setPixels] = useState([]);

  useEffect(() => {
    const newPixels = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setPixels(newPixels);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pixels.map((pixel) => (
        <div
          key={pixel.id}
          className="absolute rounded-sm bg-[#73e28a]"
          style={{
            left: `${pixel.left}%`,
            top: `${pixel.top}%`,
            width: `${pixel.size}px`,
            height: `${pixel.size}px`,
            opacity: pixel.opacity,
            animation: `float-pixel ${pixel.duration}s ease-in-out ${pixel.delay}s infinite`,
          }}
        />
      ))}
      
      <style>{`
        @keyframes float-pixel {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.1;
          }
          25% {
            transform: translateY(-20px) translateX(10px) scale(1.2);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-10px) translateX(-5px) scale(0.8);
            opacity: 0.2;
          }
          75% {
            transform: translateY(-30px) translateX(15px) scale(1.1);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}