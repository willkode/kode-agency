import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle, AlertTriangle, Loader2, RotateCcw, ShieldAlert } from 'lucide-react';
import Card from '@/components/ui-custom/Card';

const complexityColors = {
  Low: 'bg-[#73e28a]/20 text-[#73e28a] border-[#73e28a]/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  High: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const migrateColors = {
  Yes: 'bg-[#73e28a]/20 text-[#73e28a] border-[#73e28a]/30',
  Mostly: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  No: 'bg-red-500/20 text-red-400 border-red-500/30'
};

export default function ScanPreview({ scan, onPay, isPaying, onNewScan }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header card */}
      <Card className="p-6 bg-slate-900/80 border-slate-700">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Scan Complete</h2>
            <p className="text-slate-400 text-sm truncate max-w-md">{scan.github_url}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {scan.can_migrate && (
              <Badge className={migrateColors[scan.can_migrate]}>
                Migratable: {scan.can_migrate}
              </Badge>
            )}
            {scan.complexity && (
              <Badge className={complexityColors[scan.complexity]}>
                Complexity: {scan.complexity}
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Executive Summary Preview */}
      <Card className="p-6 bg-slate-900/80 border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[#73e28a]" />
          Executive Summary (Free Preview)
        </h3>
        <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
          {scan.executive_summary}
        </div>
      </Card>

      {/* Locked Report */}
      <Card className="p-0 bg-slate-900/80 border-[#73e28a]/30 overflow-hidden relative">
        {/* Blurred preview */}
        <div className="p-6 filter blur-sm select-none pointer-events-none opacity-50">
          <div className="space-y-4">
            <div className="h-4 bg-slate-700 rounded w-3/4" />
            <div className="h-4 bg-slate-700 rounded w-full" />
            <div className="h-4 bg-slate-700 rounded w-2/3" />
            <div className="h-4 bg-slate-700 rounded w-full" />
            <div className="h-4 bg-slate-700 rounded w-5/6" />
            <div className="h-4 bg-slate-700 rounded w-full" />
            <div className="h-4 bg-slate-700 rounded w-3/4" />
            <div className="h-4 bg-slate-700 rounded w-full" />
          </div>
        </div>

        {/* Lock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="text-center px-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#73e28a]/20 border border-[#73e28a]/30 flex items-center justify-center">
              <Lock className="w-7 h-7 text-[#73e28a]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Full Report Locked</h3>
            <p className="text-slate-400 text-sm mb-2 max-w-xs mx-auto">
              Unlock your complete migration plan including:
            </p>
            <ul className="text-slate-400 text-sm mb-6 space-y-1 text-left max-w-xs mx-auto">
              {[
                '9 detailed analysis sections',
                'Exact file-by-file change list',
                'Cloudflare / Vercel / Netlify checklists',
                'Copy-paste AI agent action list',
                'Risk register + cutover plan',
                'Step-by-step QA test plan'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#73e28a] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Button
              onClick={onPay}
              disabled={isPaying}
              className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-12 px-8 text-base"
            >
              {isPaying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Unlock for $25
                </>
              )}
            </Button>
            <p className="text-slate-500 text-xs mt-3">One-time fee. Report saved to your account forever.</p>
          </div>
        </div>
      </Card>

      <div className="text-center">
        <button
          onClick={onNewScan}
          className="text-slate-500 hover:text-slate-300 text-sm flex items-center gap-2 mx-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Scan a different repo
        </button>
      </div>
    </div>
  );
}