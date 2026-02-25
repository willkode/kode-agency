import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { CheckCircle, Code, GitBranch, Zap, Shield, FileText } from 'lucide-react';
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import PageHero from '@/components/ui-custom/PageHero';
import SectionLabel from '@/components/ui-custom/SectionLabel';
import GridBackground from '@/components/ui-custom/GridBackground';
import GlowingOrb from '@/components/ui-custom/GlowingOrb';
import SEO from '@/components/SEO';
import { usePageView, useScrollDepth, useTimeOnPage, track } from '@/components/analytics/useAnalytics';
import ScanForm from '@/components/frontend-exporter/ScanForm';
import ScanProgress from '@/components/frontend-exporter/ScanProgress';
import FullReport from '@/components/frontend-exporter/FullReport';
import MigrationQuoteForm from '@/components/frontend-exporter/MigrationQuoteForm';

const FEATURES = [
  { icon: GitBranch, title: 'Repo Structure Analysis', desc: 'Maps all Base44 SDK usages, config files, entities, and backend function calls.' },
  { icon: Code, title: 'Exact Change Instructions', desc: 'File-by-file patch instructions — no guessing, no rewrites.' },
  { icon: Zap, title: 'Hosting Checklists', desc: 'Copy-paste setup for Cloudflare Pages, Vercel, and Netlify.' },
  { icon: Shield, title: 'Auth & CORS Audit', desc: 'Identifies redirect URLs, cookie assumptions, and origin issues.' },
  { icon: FileText, title: 'AI Agent Action List', desc: 'Sequential tasks another AI agent can execute safely.' },
  { icon: CheckCircle, title: 'Risk Register', desc: 'Every migration risk mapped with mitigation and rollback plans.' },
];

export default function FrontendExporterPage() {
  usePageView('frontend_exporter');
  useScrollDepth('frontend_exporter');
  useTimeOnPage('frontend_exporter');

  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [scanState, setScanState] = useState('idle'); // idle | scanning | done | error
  const [currentScan, setCurrentScan] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanningUrl, setScanningUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Load user
  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null)).finally(() => setUserLoading(false));
  }, []);

  // Resume from URL param
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const scanId = urlParams.get('scan_id');
    if (scanId) {
      base44.entities.FrontendExporterScan.filter({ id: scanId })
        .then((scans) => {
          if (scans && scans.length > 0) {
            setCurrentScan(scans[0]);
            setScanState('done');
          }
        })
        .catch(() => {});
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleScanStart = async (githubUrl) => {
    track('frontend_exporter_scan_started', { github_url: githubUrl });
    setIsScanning(true);
    setScanningUrl(githubUrl);
    setScanState('scanning');
    setErrorMsg('');

    try {
      // Create the scan record first
      const scan = await base44.entities.FrontendExporterScan.create({
        github_url: githubUrl,
        user_email: user.email,
        status: 'scanning'
      });

      // Kick off the AI scan
      await base44.functions.invoke('scanGithubRepo', {
        github_url: githubUrl,
        scan_id: scan.id
      });

      // Reload the updated scan
      const updated = await base44.entities.FrontendExporterScan.filter({ id: scan.id });
      if (updated && updated.length > 0) {
        setCurrentScan(updated[0]);
        track('frontend_exporter_scan_completed', { github_url: githubUrl });
        setScanState('done');
      }
    } catch (err) {
      track('frontend_exporter_scan_failed', { github_url: githubUrl, error: err.message });
      setErrorMsg(err.message || 'Scan failed. Please try again.');
      setScanState('error');
    } finally {
      setIsScanning(false);
    }
  };

  const handleNewScan = () => {
    setCurrentScan(null);
    setScanState('idle');
    setErrorMsg('');
    setScanningUrl('');
  };

  return (
    <div className="bg-slate-950 text-white">
      <SEO
        title="Frontend Exporter - Base44 Migration Planner"
        description="Scan your Base44 GitHub repo and get a complete migration plan to host your frontend externally while keeping Base44 as your backend. $25 one-time."
        keywords={["Base44 migration", "frontend exporter", "Base44 export", "host Base44 app externally", "Vercel", "Cloudflare Pages"]}
        url="/FrontendExporter"
      />
      <PageHero title="Frontend Exporter" />

      {/* Hero Section */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        <GlowingOrb position="top-right" size="400px" opacity={0.08} />

        <div className="relative z-10">
          {scanState === 'idle' && (
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <SectionLabel text="Base44 Migration Tool" />
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Move your frontend.<br />
                  <span className="text-[#73e28a]">Keep your backend.</span>
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-4">
                  Paste your public GitHub repo. Our AI scans every file and produces an exact migration plan to host your frontend on Cloudflare, Vercel, or Netlify — while keeping Base44 as your backend.
                </p>
                <p className="text-slate-400 leading-relaxed mb-8">
                  No rewrites. No guesswork. Just a precise, file-by-file action list.
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 text-[#73e28a] text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    100% free
                  </div>
                  <div className="flex items-center gap-2 text-[#73e28a] text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Full report included
                  </div>
                  <div className="flex items-center gap-2 text-[#73e28a] text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Saved to your account
                  </div>
                </div>
              </div>

              <div>
                {userLoading ? (
                  <Card className="p-8 bg-slate-900/80 border-slate-700 max-w-2xl mx-auto animate-pulse h-48" />
                ) : (
                  <ScanForm
                    onScanStart={handleScanStart}
                    isScanning={isScanning}
                    user={user}
                  />
                )}
              </div>
            </div>
          )}

          {scanState === 'scanning' && (
            <ScanProgress githubUrl={scanningUrl} />
          )}

          {scanState === 'done' && currentScan && (
            <div className="max-w-4xl mx-auto space-y-8">
              <FullReport scan={currentScan} onNewScan={handleNewScan} />
              <MigrationQuoteForm scan={currentScan} user={user} />
            </div>
          )}

          {scanState === 'error' && (
            <div className="max-w-2xl mx-auto text-center">
              <Card className="p-8 bg-slate-900/80 border-red-500/30">
                <p className="text-red-400 font-medium mb-4">Scan failed</p>
                <p className="text-slate-400 text-sm mb-6">{errorMsg || 'Something went wrong. Please try again.'}</p>
                <Button
                  onClick={handleNewScan}
                  className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold"
                >
                  Try Again
                </Button>
              </Card>
            </div>
          )}
        </div>
      </Section>

      {/* Features Grid - only show when idle */}
      {scanState === 'idle' && (
        <Section className="py-24 bg-slate-900/50 relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-center mb-16">
              <SectionLabel text="What's Included" />
              <h2 className="text-4xl md:text-5xl font-bold text-white">Everything in your report</h2>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                Completely free. Scan your repo and get the full migration plan instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature, i) => (
                <Card key={i} className="p-6 bg-slate-900/80">
                  <div className="w-12 h-12 mb-4 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#73e28a]">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* CTA - only show when idle */}
      {scanState === 'idle' && (
        <Section className="py-24 relative overflow-hidden">
          <GlowingOrb position="center" size="500px" opacity={0.08} />
          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to migrate?</h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Paste your repo URL above and get your complete migration plan instantly — free.
            </p>
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-10 text-lg"
            >
              Scan Your Repo
            </Button>
          </div>
        </Section>
      )}
    </div>
  );
}