import React, { useEffect, useState } from 'react';
import { Loader2, GitBranch, FileSearch, Brain, CheckCircle } from 'lucide-react';
import Card from '@/components/ui-custom/Card';

const STEPS = [
  { icon: GitBranch, label: 'Fetching repository structure...', delay: 0 },
  { icon: FileSearch, label: 'Reading key config files...', delay: 3000 },
  { icon: Brain, label: 'Running AI migration analysis...', delay: 7000 },
  { icon: CheckCircle, label: 'Compiling your report...', delay: 20000 },
];

export default function ScanProgress({ githubUrl }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((step, i) =>
      setTimeout(() => setCurrentStep(i), step.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <Card className="p-8 bg-slate-900/80 border-slate-700 max-w-2xl mx-auto text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#73e28a]/20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#73e28a] animate-spin" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Scanning Repository</h2>
      <p className="text-slate-400 text-sm mb-8 truncate max-w-md mx-auto">{githubUrl}</p>

      <div className="space-y-4 text-left">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isDone = i < currentStep;
          const isActive = i === currentStep;
          return (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-slate-800 border border-[#73e28a]/30' : isDone ? 'opacity-60' : 'opacity-30'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-[#73e28a]/20' : isActive ? 'bg-[#73e28a]/20' : 'bg-slate-800'}`}>
                {isDone ? (
                  <CheckCircle className="w-4 h-4 text-[#73e28a]" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-[#73e28a] animate-spin" />
                ) : (
                  <Icon className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <span className={`text-sm ${isActive ? 'text-white' : isDone ? 'text-slate-400' : 'text-slate-600'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-slate-500 text-xs mt-8">This may take 30–60 seconds depending on repo size.</p>
    </Card>
  );
}