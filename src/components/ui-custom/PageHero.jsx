import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowUpRight } from 'lucide-react';

export default function PageHero({ title, backgroundImage }) {
  return (
    <div className="relative min-h-[450px] md:min-h-[550px] overflow-hidden bg-slate-950">
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <img 
            src={backgroundImage} 
            alt="" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30"></div>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 hidden md:block">
        <div className="w-24 h-24 rounded-full border border-slate-700/50" style={{
          background: 'radial-gradient(circle, transparent 40%, rgba(115, 226, 138, 0.1) 100%)'
        }}>
          <div className="w-full h-full rounded-full" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '8px 8px'
          }}></div>
        </div>
      </div>

      {/* Rotating Circle Badge */}
      <div className="absolute top-24 right-32 hidden lg:block">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
            <defs>
              <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"/>
            </defs>
            <circle cx="50" cy="50" r="45" fill="none" stroke="#73e28a" strokeWidth="2"/>
            <text fill="#73e28a" fontSize="8" fontWeight="500">
              <textPath href="#circlePath" startOffset="0%">
                Creative Development Agency • Creative Development Agency •
              </textPath>
            </text>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
              <span className="text-[#73e28a] text-xl font-bold">K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Diagonal Lines */}
      <div className="absolute top-32 right-10 hidden lg:flex gap-1">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="w-0.5 bg-gradient-to-b from-[#73e28a] to-transparent transform -skew-x-12"
            style={{ height: `${80 + i * 5}px`, opacity: 0.6 - i * 0.04 }}
          ></div>
        ))}
      </div>

      {/* Small Floating Image */}
      <div className="absolute top-1/3 right-1/4 hidden md:block">
        <div className="w-20 h-28 rounded-full overflow-hidden border-2 border-white/20 shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=200&fit=crop" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center min-h-[450px] md:min-h-[550px]">
        <div className="pt-20">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8">{title}</h1>
          <div className="inline-flex items-center gap-3 px-6 py-3 border border-[#73e28a]/30 bg-slate-900/50 backdrop-blur-sm">
            <ArrowUpRight className="w-4 h-4 text-[#73e28a]" />
            <Link to={createPageUrl('Home')} className="text-[#73e28a] hover:underline text-sm font-medium">Home</Link>
            <span className="text-slate-500">/</span>
            <span className="text-slate-300 text-sm">{title}</span>
          </div>
        </div>
      </div>

      {/* Bottom decorative squares */}
      <div className="absolute bottom-10 right-20 hidden md:block">
        <div className="w-8 h-8 border border-slate-700/50 transform rotate-45"></div>
      </div>
    </div>
  );
}