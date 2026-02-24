import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, ArrowRight, Loader2, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '@/components/ui-custom/Card';

export default function ScanForm({ onScanStart, isScanning, user }) {
  const [githubUrl, setGithubUrl] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!githubUrl.trim()) return;
    onScanStart(githubUrl.trim());
  };

  return (
    <Card className="p-8 bg-slate-900/80 border-slate-700 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#73e28a]/20 flex items-center justify-center">
          <Github className="w-8 h-8 text-[#73e28a]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Scan Your Base44 Repo</h2>
        <p className="text-slate-400">
          Paste your public GitHub repository URL to get your full migration analysis.
        </p>
      </div>

      {!user && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
          <Lock className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-yellow-300 font-medium text-sm">Login required</p>
            <p className="text-yellow-400/80 text-sm mt-1">You must be logged in to run a scan. Your results are saved to your account so you can return anytime.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-300">GitHub Repository URL</Label>
          <div className="flex gap-3">
            <Input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/my-base44-app"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 flex-1"
              disabled={isScanning || !user}
            />
          </div>
          <div className="mt-1">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
            >
              Repository must be public.{' '}
              <span className="text-[#73e28a] underline underline-offset-2">How to make it public</span>
              {showGuide ? <ChevronUp className="w-3 h-3 text-[#73e28a]" /> : <ChevronDown className="w-3 h-3 text-[#73e28a]" />}
            </button>

            {showGuide && (
              <div className="mt-3 p-4 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-slate-300 space-y-2">
                <p className="font-semibold text-white">How to make your GitHub repo public:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
                  <li>Go to your repository on <span className="text-white">github.com</span></li>
                  <li>Click <span className="text-white">Settings</span> (top tab)</li>
                  <li>Scroll to the bottom — <span className="text-white">Danger Zone</span></li>
                  <li>Click <span className="text-white">"Change repository visibility"</span></li>
                  <li>Select <span className="text-white">"Make public"</span> and confirm</li>
                </ol>
                <p className="text-slate-500 text-xs pt-1">You can make it private again after the scan. Private repo support coming soon.</p>
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isScanning || !githubUrl.trim() || !user}
          className="w-full bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-12"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Scanning Repository...
            </>
          ) : (
            <>
              Run Free Scan <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>

        {!user && (
          <p className="text-center text-slate-500 text-sm">
            <button
              type="button"
              onClick={() => window.base44?.auth?.redirectToLogin()}
              className="text-[#73e28a] hover:underline"
            >
              Login or create an account
            </button>{' '}to run your scan
          </p>
        )}
      </form>
    </Card>
  );
}