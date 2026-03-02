import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import PageHero from '@/components/ui-custom/PageHero';
import SectionLabel from '@/components/ui-custom/SectionLabel';
import GridBackground from '@/components/ui-custom/GridBackground';
import FloatingPixels from '@/components/ui-custom/FloatingPixels';
import GlowingOrb from '@/components/ui-custom/GlowingOrb';
import SEO, { createServiceSchema, createBreadcrumbSchema } from '@/components/SEO';
import { usePageView, useScrollDepth, useTimeOnPage, track } from '@/components/analytics/useAnalytics';
import { 
  ArrowRight, CheckCircle, Server, FileCode, Shield, Zap, 
  Settings, Download, ClipboardCheck, AlertTriangle, ArrowRightLeft
} from 'lucide-react';

export default function MigrationAssistantLanding() {
  usePageView('migration_assistant_landing');
  useScrollDepth('migration_assistant_landing');
  useTimeOnPage('migration_assistant_landing');

  const features = [
    {
      icon: Server,
      title: "Multi-Platform Support",
      desc: "Generate configs for Nginx, Vercel, Netlify, and Cloudflare Pages."
    },
    {
      icon: FileCode,
      title: "Environment Variables",
      desc: "Auto-generate .env files with all required Base44 variables."
    },
    {
      icon: Shield,
      title: "Health Monitoring",
      desc: "Built-in health ping functions and outage banner components."
    },
    {
      icon: Zap,
      title: "Edge Workers",
      desc: "Cloudflare Worker templates for HTML injection and fallbacks."
    },
    {
      icon: ClipboardCheck,
      title: "Verification Checklists",
      desc: "Step-by-step verification plans to ensure successful deployment."
    },
    {
      icon: AlertTriangle,
      title: "Failure Mode Guides",
      desc: "Common issues and fixes documented before you hit them."
    }
  ];

  const steps = [
    { num: "01", title: "Enter Project Details", desc: "Provide your app name, Base44 API URL, and frontend domain." },
    { num: "02", title: "Select Hosting Target", desc: "Choose from Nginx, Vercel, Netlify, or Cloudflare Pages." },
    { num: "03", title: "Configure Options", desc: "Enable auth callbacks, Stripe vars, and health monitoring." },
    { num: "04", title: "Generate & Download", desc: "Get all configs, env files, and deployment checklists." }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Services", url: "/Services" },
        { name: "Migration Assistant", url: "/MigrationAssistantLanding" }
      ]),
      createServiceSchema(
        "Migration Assistant",
        "Free self-serve wizard to generate hosting configs, environment variables, and deployment checklists for migrating Base44 frontends to external hosting.",
        "/MigrationAssistantLanding"
      )
    ]
  };

  return (
    <div className="bg-slate-950 text-white">
      <SEO 
        title="Migration Assistant - Self-Hosted Frontend Config Generator"
        description="Free tool to generate hosting configs, environment variables, health endpoints, and deployment checklists for migrating your Base44 frontend to external hosting."
        keywords={["Base44 migration", "self-hosted frontend", "Vercel deployment", "Netlify config", "Nginx SPA", "Cloudflare Pages"]}
        url="/MigrationAssistantLanding"
        jsonLd={jsonLd}
      />

      <PageHero 
        title="Migration Assistant" 
        backgroundImage="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&auto=format&fit=crop"
      />

      {/* Hero Section */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={20} />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel text="Free Tool" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Deploy Your Base44 Frontend<br />
              <span className="text-[#73e28a]">Anywhere You Want</span>
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Self-serve wizard that generates all the configs, environment variables, and deployment checklists you need to host your Base44 frontend on Vercel, Netlify, Cloudflare, or your own Nginx server.
            </p>

            <div className="space-y-3 mb-8">
              {[
                "Platform-specific SPA configs generated instantly",
                "Complete .env templates with all required variables",
                "Health monitoring endpoints and outage banners",
                "Step-by-step verification checklists"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#73e28a] mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to={createPageUrl('MigrationAssistant')} onClick={() => track('migration_assistant_cta_clicked', { cta: 'launch_wizard' })}>
                <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-12 px-6">
                  Launch Migration Wizard <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to={createPageUrl('KnowledgeBase')}>
                <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800 bg-slate-800 h-12 px-6">
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <Card className="p-8 bg-slate-900/90 border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#73e28a]/10 border border-[#73e28a]/30 flex items-center justify-center">
                  <ArrowRightLeft className="w-6 h-6 text-[#73e28a]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Migration Assistant</h3>
                  <p className="text-slate-400 text-sm">Config Generator</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="text-xs text-slate-500 mb-1">Hosting Target</div>
                  <div className="text-white font-mono">vercel</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="text-xs text-slate-500 mb-1">Generated Files</div>
                  <div className="space-y-1 text-sm font-mono text-[#73e28a]">
                    <div>✓ vercel.json</div>
                    <div>✓ .env.example</div>
                    <div>✓ healthPing.js</div>
                    <div>✓ verification-checklist.md</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* Features Grid */}
      <Section className="py-24 bg-slate-900/50 relative overflow-hidden">
        <GlowingOrb position="top-left" size="300px" opacity={0.1} />
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <SectionLabel text="What You Get" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Everything for a Smooth Migration
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
              The wizard generates all the files and documentation you need to successfully deploy your frontend externally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="p-6 bg-slate-900/80 hover:border-[#73e28a]/50 transition-colors">
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

      {/* How It Works */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <SectionLabel text="How It Works" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Four Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-black text-slate-800 mb-4">{step.num}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2">
                    <ArrowRight className="w-6 h-6 text-slate-700" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Supported Platforms */}
      <Section className="py-24 bg-slate-900/50 relative overflow-hidden">
        <GlowingOrb position="top-right" size="400px" opacity={0.1} />
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <SectionLabel text="Supported Platforms" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Deploy Anywhere
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Vercel", desc: "vercel.json + rewrites" },
              { name: "Netlify", desc: "netlify.toml + redirects" },
              { name: "Cloudflare", desc: "Pages + Workers" },
              { name: "Nginx", desc: "Server block config" }
            ].map((platform, i) => (
              <Card key={i} className="p-6 bg-slate-900/80 text-center hover:border-[#73e28a]/50 transition-colors">
                <h3 className="text-lg font-bold text-white mb-1">{platform.name}</h3>
                <p className="text-slate-500 text-sm">{platform.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-24 relative overflow-hidden">
        <GlowingOrb position="center" size="500px" opacity={0.1} />
        
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to migrate your frontend?
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            Launch the wizard and generate all your deployment configs in minutes. Completely free.
          </p>
          <Link to={createPageUrl('MigrationAssistant')} onClick={() => track('migration_assistant_cta_clicked', { cta: 'bottom_cta' })}>
            <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-10 text-lg">
              Launch Migration Wizard <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}