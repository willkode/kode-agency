import React from 'react';
import { cn } from "@/lib/utils";

export default function Card({ children, className, hoverEffect = true }) {
  return (
    <div 
      className={cn(
        "bg-slate-900 border border-slate-800 rounded-xl p-6 transition-all duration-300",
        hoverEffect && "hover:border-indigo-500/50 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-indigo-500/10",
        className
      )}
    >
      {children}
    </div>
  );
}