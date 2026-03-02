import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function OutputBlock({ title, content, language = 'plaintext' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <span className="text-slate-300 text-sm font-medium">{title}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#73e28a]" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed bg-slate-900 max-h-[480px] overflow-y-auto">
        <code>{content}</code>
      </pre>
    </div>
  );
}