import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import GridBackground from '@/components/ui-custom/GridBackground';
import FloatingPixels from '@/components/ui-custom/FloatingPixels';
import GlowingOrb from '@/components/ui-custom/GlowingOrb';
import { Check, Zap, RefreshCw, TrendingUp, Gauge, ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="bg-slate-950 text-white">
      {/* Hero */}
      <Section className="pt-32 pb-16 text-center relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={25} />
        <GlowingOrb position="top-right" size="400px" opacity={0.15} />
        <GlowingOrb position="bottom-left" size="300px" color="#5dbb72" opacity={0.1} />
        
        <div className="relative z-10">
          <div className="inline-block px-4 py-2 bg-[#73e28a]/10 border border-[#73e28a]/30 rounded-full text-[#73e28a] text-sm font-semibold mb-6">
            Services
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            We do a small number of things<br />
            <span className="text-[#73e28a]">extremely well</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Kode Agency is a focused studio, not a 100-service agency. Every service is built around speed, conversion, and ROI.
          </p>
        </div>
      </Section>

      {/* Service 1: AI MVP Sprints */}
      <Section className="py-16">
        <Card className="p-12 max-w-5xl mx-auto border-[#73e28a]/30">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="w-16 h-16 rounded-full bg-[#73e28a]/10 flex items-center justify-center text-[#73e28a] mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">AI MVP Sprints</h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                From zero to live MVP in 4–8 weeks. We use AI-accelerated workflows with Base44, Lovable, or custom stacks to ship production-ready apps fast.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#73e28a] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Who it's for: Founders validating ideas, agencies needing dev, creators building SaaS</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#73e28a] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">What you get: Scoping, design, development, deployment, handover docs</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#73e28a] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Timeline: 4–8 weeks from kickoff to live</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#73e28a] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Stacks: Base44, Lovable, React, Node.js, whatever fits best</span>
                </div>
              </div>
              <Link to={createPageUrl('Pricing')}>
                <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold">
                  See pricing <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="bg-slate-900 rounded-xl p-8 border border-slate-800">
              <h3 className="text-white font-bold mb-4">Typical MVP includes:</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#73e28a] font-bold">→</span>
                  User authentication & roles
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#73e28a] font-bold">→</span>
                  Core feature workflows
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#73e28a] font-bold">→</span>
                  Database & API setup
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#73e28a] font-bold">→</span>
                  Responsive UI/UX
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#73e28a] font-bold">→</span>
                  Production deployment
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#73e28a] font-bold">→</span>
                  30-day warranty period
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </Section>

      {/* Service 2: Ongoing Product Partner */}
      <Section className="py-16 bg-slate-900/30">
        <Card className="p-12 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="order-2 md:order-1 bg-slate-950 rounded-xl p-8 border border-slate-800">
              <h3 className="text-white font-bold mb-4">Monthly partnership includes:</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#73e28a] font-bold">→</span>
                  Dedicated monthly hours
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#73e28a] font-bold">→</span>
                  Feature roadmap planning
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#73e28a] font-bold">→</span>
                  Priority bug fixes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#73e28a] font-bold">→</span>
                  A/B testing & optimization
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#73e28a] font-bold">→</span>
                  Performance monitoring
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#73e28a] font-bold">→</span>
                  Cancel anytime, no contract
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2">
              <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 mb-6">
                <RefreshCw className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Ongoing Product Partner</h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Retainer-style partnership for continuous improvements, new features, growth experiments, and technical support. Think of us as your product team.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Who it's for: Growing SaaS, apps needing ongoing dev, teams without in-house developers</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">What you get: Monthly hours, priority support, roadmap alignment, proactive optimization</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Timeline: Ongoing, month-to-month</span>
                </div>
              </div>
              <Link to={createPageUrl('Pricing')}>
                <Button className="bg-violet-600 hover:bg-violet-700 text-white font-bold">
                  See pricing <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </Section>

      {/* Service 3: CRO-Driven Marketing Sites */}
      <Section className="py-16">
        <Card className="p-12 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">CRO-Driven Marketing Sites</h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Landing pages, product sites, and funnels designed to convert. Every pixel is informed by 30 years of marketing, SEO, and conversion optimization experience.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Who it's for: SaaS launches, product marketing, agencies, high-converting funnels</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">What you get: Strategy, copywriting, design, development, analytics setup</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Built with: React, Next.js, Tailwind, optimized for Core Web Vitals</span>
                </div>
              </div>
              <Link to={createPageUrl('Contact')}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  Get a quote <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="bg-slate-900 rounded-xl p-8 border border-slate-800">
              <h3 className="text-white font-bold mb-4">We optimize for:</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">→</span>
                  Conversion rate (sign-ups, demos, sales)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">→</span>
                  Page speed & Core Web Vitals
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">→</span>
                  SEO & technical structure
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">→</span>
                  Mobile responsiveness
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">→</span>
                  Clear CTAs & user flows
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">→</span>
                  Analytics & tracking setup
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </Section>

      {/* Service 4: Technical SEO + Performance */}
      <Section className="py-16 bg-slate-900/30">
        <Card className="p-12 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="order-2 md:order-1 bg-slate-950 rounded-xl p-8 border border-slate-800">
              <h3 className="text-white font-bold mb-4">Common fixes we handle:</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">→</span>
                  Core Web Vitals (LCP, CLS, FID)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">→</span>
                  JavaScript rendering issues
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">→</span>
                  Schema markup & structured data
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">→</span>
                  Sitemap & indexing optimization
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">→</span>
                  Image & asset optimization
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">→</span>
                  Mobile-first indexing prep
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2">
              <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 mb-6">
                <Gauge className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Technical SEO + Performance</h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Fix Core Web Vitals, optimize for search engines, and eliminate technical debt that's killing your rankings and conversions.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Who it's for: Apps with SEO issues, slow sites, teams needing technical audits</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">What you get: Full technical audit, prioritized fixes, implementation, monitoring</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Timeline: 2–4 weeks depending on complexity</span>
                </div>
              </div>
              <Link to={createPageUrl('Contact')}>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold">
                  Request audit <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </Section>

      {/* CTA */}
      <Section className="py-20 text-center relative overflow-hidden">
        <GridBackground />
        <GlowingOrb position="center" size="500px" opacity={0.1} />
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Which service is right for you?
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            Not sure? Book a quick call and we'll help you figure out the best path forward.
          </p>
          <Link to={createPageUrl('Contact')}>
            <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-10 text-lg">
              Let's talk about your project
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}