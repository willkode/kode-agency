import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowUpRight } from 'lucide-react';

export default function PageHero({ title, backgroundImage }) {
  return (
    <div className="relative min-h-[450px] md:min-h-[550px] overflow-hidden bg-slate-950">
      {/* Background Image */}
      {backgroundImage &&
      <div className="absolute inset-0">
          <img
          src={backgroundImage}
          alt=""
          className="w-full h-full object-cover opacity-60" />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30"></div>
        </div>
      }

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



      {/* Diagonal Lines */}
      <div className="absolute top-32 right-10 hidden lg:flex gap-1">
        {[...Array(12)].map((_, i) =>
        <div
          key={i}
          className="w-0.5 bg-gradient-to-b from-[#73e28a] to-transparent transform -skew-x-12"
          style={{ height: `${80 + i * 5}px`, opacity: 0.6 - i * 0.04 }}>
        </div>
        )}
      </div>



      {/* Content */}
      <div className="bg-slate-950 mx-auto px-4 relative z-10 container h-full flex items-center min-h-[450px] md:min-h-[550px]">
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
    </div>);

}