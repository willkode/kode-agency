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
import ScanForm from '@/components/frontend-exporter/ScanForm';
import ScanProgress from '@/components/frontend-exporter/ScanProgress';
import ScanPreview from '@/components/frontend-exporter/ScanPreview';
import FullReport from '@/components/frontend-exporter/FullReport';

const FEATURES = [
  { icon: GitBranch, title: 'Repo Structure Analysis', desc: 'Maps all Base44 SDK usages, config files, entities, and backend function calls.' },
  { icon: Code, title: 'Exact Change Instructions', desc: 'File-by-file patch instructions — no guessing, no rewrites.' },
  { icon: Zap, title: 'Hosting Checklists', desc: 'Copy-paste setup for Cloudflare Pages, Vercel, and Netlify.' },
  { icon: Shield, title: 'Auth & CORS Audit', desc: 'Identifies redirect URLs, cookie assumptions, and origin issues.' },
  { icon: FileText, title: 'AI Agent Action List', desc: 'Sequential tasks another AI agent can execute safely.' },
  { icon: CheckCircle, title: 'Risk Register', desc: 'Every migration risk mapped with mitigation and rollback plans.' },
];

export default function FrontendExporterPage() {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [scanState, setScanState] = useState('idle'); // idle | scanning | preview | unlocked | error
  const [currentScan, setCurrentScan] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [scanningUrl, setScanningUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Load user
  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null)).finally(() => setUserLoading(false));
  }, []);

  // Handle Stripe return
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');
    const scanId = urlParams.get('scan_id');

    if (success === 'true' && sessionId && scanId) {
      // Unlock the scan
      base44.functions.invoke('unlockFrontendExporterScan', { session_id: sessionId, scan_id: scanId })
        .then(() => base44.entities.FrontendExporterScan.filter({ id: scanId }))
        .then((scans) => {
          if (scans && scans.length > 0) {
            setCurrentScan(scans[0]);
            setScanState('unlocked');
          }
        })
        .catch((err) => {
          setErrorMsg(err.message);
          setScanState('error');
        });
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    // Resume from cancelled payment
    const cancelledScanId = urlParams.get('scan_id');
    if (cancelledScanId) {
      base44.entities.FrontendExporterScan.filter({ id: cancelledScanId })
        .then((scans) => {
          if (scans && scans.length > 0) {
            setCurrentScan(scans[0]);
            setScanState(scans[0].status === 'completed' ? 'unlocked' : 'preview');
          }
        })
        .catch(() => {});
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleScanStart = async (githubUrl) => {
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
        setScanState(updated[0].status === 'completed' ? 'unlocked' : 'preview');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Scan failed. Please try again.');
      setScanState('error');
    } finally {
      setIsScanning(false);
    }
  };

  const handlePay = async () => {
    if (!currentScan) return;
    setIsPaying(true);
    try {
      const { data } = await base44.functions.invoke('createFrontendExporterCheckout', {
        scan_id: currentScan.id
      });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setErrorMsg(err.message);
      setIsPaying(false);
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
                    Free scan
                  </div>
                  <div className="flex items-center gap-2 text-[#73e28a] text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    $25 to unlock full plan
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

          {scanState === 'preview' && currentScan && (
            <ScanPreview
              scan={currentScan}
              onPay={handlePay}
              isPaying={isPaying}
              onNewScan={handleNewScan}
            />
          )}

          {scanState === 'unlocked' && currentScan && (
            <FullReport
              scan={currentScan}
              onNewScan={handleNewScan}
            />
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
                A full $25 migration plan. Run the scan free, pay once to unlock.
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
              Paste your repo URL above and get your executive summary free. Unlock the full plan for $25.
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