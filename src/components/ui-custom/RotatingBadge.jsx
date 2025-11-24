import React from 'react';

export default function RotatingBadge({ text = "Award Winning Software Development Agency", size = 120 }) {
  const logoSize = size * 0.35;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
        <defs>
          <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"/>
        </defs>
        <circle cx="50" cy="50" r="45" fill="none" stroke="#73e28a" strokeWidth="2"/>
        <text fill="#73e28a" fontSize="6.5" fontWeight="500" letterSpacing="0.5">
          <textPath href="#circlePath" startOffset="0%">
            {text} • {text} •
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691e276e2117009b68e21c5c/3e54475dc_KA-Logo.png" 
          alt="KA" 
          style={{ width: logoSize, height: logoSize }}
          className="object-contain"
        />
      </div>
    </div>
  );
}