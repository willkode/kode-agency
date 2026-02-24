import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, RotateCcw } from 'lucide-react';
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

export default function FullReport({ scan, onNewScan }) {
  const handleDownload = () => {
    const blob = new Blob([scan.report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration-plan-${scan.github_url.split('/').pop()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6 bg-slate-900/80 border-[#73e28a]/30">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-5 h-5 text-[#73e28a]" />
              <h2 className="text-xl font-bold text-white">Full Migration Plan Unlocked</h2>
            </div>
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
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="border-slate-700 text-black hover:text-black"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Download .md
            </Button>
          </div>
        </div>
      </Card>

      {/* Full Report */}
      <Card className="p-8 bg-slate-900/80 border-slate-700">
        <div className="prose prose-invert prose-slate max-w-none
          prose-headings:text-white
          prose-h1:text-2xl prose-h1:font-bold prose-h1:border-b prose-h1:border-slate-700 prose-h1:pb-3 prose-h1:mb-6
          prose-h2:text-xl prose-h2:font-bold prose-h2:text-[#73e28a] prose-h2:mt-8
          prose-h3:text-base prose-h3:font-bold prose-h3:text-slate-200
          prose-p:text-slate-400 prose-p:leading-relaxed
          prose-li:text-slate-400
          prose-strong:text-white
          prose-code:bg-slate-800 prose-code:text-[#73e28a] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700
          prose-blockquote:border-l-[#73e28a] prose-blockquote:text-slate-400
          prose-table:text-sm
          prose-th:text-white prose-th:bg-slate-800
          prose-td:text-slate-400 prose-td:border-slate-700
          prose-hr:border-slate-700
        ">
          <ReactMarkdown>{scan.report}</ReactMarkdown>
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