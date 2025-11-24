import React from 'react';

export default function RotatingBadge({ text = "Creative Development Agency", size = 120 }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
        <defs>
          <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"/>
        </defs>
        <circle cx="50" cy="50" r="45" fill="none" stroke="#73e28a" strokeWidth="2"/>
        <text fill="#73e28a" fontSize="8" fontWeight="500" letterSpacing="1">
          <textPath href="#circlePath" startOffset="0%">
            {text} • {text} •
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
          <span className="text-[#73e28a] text-lg font-bold">K</span>
        </div>
      </div>
    </div>
  );
}