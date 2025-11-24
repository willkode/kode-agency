import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SectionLabel({ text, icon = true }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {icon && (
        <div className="w-6 h-6 rounded bg-[#73e28a]/20 flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-[#73e28a]" />
        </div>
      )}
      <span className="text-[#73e28a] text-sm font-semibold uppercase tracking-wider">{text}</span>
    </div>
  );
}