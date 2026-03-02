import React, { useState } from 'react';
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import PageHero from '@/components/ui-custom/PageHero';
import SectionLabel from '@/components/ui-custom/SectionLabel';
import GridBackground from '@/components/ui-custom/GridBackground';
import GlowingOrb from '@/components/ui-custom/GlowingOrb';
import SEO from '@/components/SEO';
import { usePageView, useScrollDepth } from '@/components/analytics/useAnalytics';
import MigrationWizard from '@/components/migration-assistant/MigrationWizard';
import { Server, Globe, Zap, CheckCircle, Shield, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FEATURES = [
  { icon: Server, title: 'Hosting Config Generator', desc: 'Generates Nginx, Cloudflare Pages, Vercel, and Netlify configs for your SPA.' },
  { icon: Globe, title: 'Cloudflare Worker Proxy', desc: 'DOM-inject proxy template that keeps Base44 as your backend — SSR-safe.' },
  { icon: Zap, title: 'Health Endpoint Templates', desc: 'Copy-paste /api/platform-health endpoint and Base44 health_ping function.' },
  { icon: Shield, title: 'Env Var Checklist', desc: 'Every environment variable your self-hosted app needs, labeled and explained.' },
  { icon: FileText, title: 'Exportable Migration Profile', desc: 'Download a JSON profile with your full config for future reference.' },
  { icon: CheckCircle, title: 'Verification & Failure Guide', desc: 'Step-by-step test plan and common failure modes to avoid.' },
];

export default function MigrationAssistantPage() {
  usePageView('migration_assistant');
  useScrollDepth('migration_assistant');

  const [wizardStarted, setWizardStarted] = useState(false);

  return (
    <div className="bg-slate-950 text-white">
      <SEO
        title="Frontend Migration Assistant - Self-Host Your Base44 App"
        description="Wizard-driven generator that creates hosting configs, health endpoints, and migration profiles so you can self-host your Base44 frontend while keeping Base44 as your backend."
        keywords={["Base44 migration", "self-host Base44", "Cloudflare Pages", "Vercel", "Netlify", "Nginx", "frontend export"]}
        url="/MigrationAssistant"
      />
      <PageHero title="Frontend Migration Assistant" />

      {!wizardStarted ? (
        <>
          {/* Hero */}
          <Section className="py-24 relative overflow-hidden">
            <GridBackground />
            <GlowingOrb position="top-right" size="400px" opacity={0.08} />
            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <SectionLabel text="Base44 Self-Hosting Tool" />
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Self-host your frontend.<br />
                  <span className="text-[#73e28a]">Keep Base44 as your backend.</span>
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-4">
                  Answer a few questions about your hosting target and your Base44 app — and we'll generate production-ready configs, health endpoints, and a complete verification checklist.
                </p>
                <p className="text-slate-400 leading-relaxed mb-8">
                  No CLI commands invented. No handwaving. Every output is copy-paste ready.
                </p>
                <div className="flex items-center gap-4 flex-wrap mb-8">
                  {['Nginx', 'Cloudflare Pages', 'Vercel', 'Netlify'].map(h => (
                    <span key={h} className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm">{h}</span>
                  ))}
                </div>
                <Button
                  onClick={() => setWizardStarted(true)}
                  className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-10 text-lg"
                >
                  Start the Wizard
                </Button>
              </div>

              <div>
                <Card className="p-8 bg-slate-900/80 border-slate-700">
                  <p className="text-slate-400 text-sm font-mono mb-4 text-[#73e28a]">// What you'll get</p>
                  {[
                    '✓ SPA rewrite rules (platform-specific)',
                    '✓ Environment variable checklist',
                    '✓ /api/platform-health endpoint template',
                    '✓ Base44 health_ping function template',
                    '✓ Cloudflare Worker DOM-inject proxy',
                    '✓ Verification & test plan',
                    '✓ Common failure modes guide',
                    '✓ Exportable Migration Profile JSON',
                  ].map((item, i) => (
                    <p key={i} className="text-slate-300 text-sm py-2 border-b border-slate-800 last:border-0">{item}</p>
                  ))}
                </Card>
              </div>
            </div>
          </Section>

          {/* Features */}
          <Section className="py-24 bg-slate-900/50 relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-center mb-16">
                <SectionLabel text="What's Included" />
                <h2 className="text-4xl md:text-5xl font-bold text-white">Everything you need to migrate</h2>
                <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                  Production-ready outputs for every major self-hosting platform.
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

          {/* CTA */}
          <Section className="py-24 relative overflow-hidden">
            <GlowingOrb position="center" size="500px" opacity={0.08} />
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to self-host?</h2>
              <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                Takes about 3 minutes. Walk through the wizard and download your complete migration profile.
              </p>
              <Button
                onClick={() => setWizardStarted(true)}
                className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-10 text-lg"
              >
                Start the Wizard
              </Button>
            </div>
          </Section>
        </>
      ) : (
        <Section className="py-16 relative overflow-hidden">
          <GridBackground />
          <div className="relative z-10">
            <MigrationWizard onReset={() => setWizardStarted(false)} />
          </div>
        </Section>
      )}
    </div>
  );
}