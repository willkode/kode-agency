import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import PageHero from '@/components/ui-custom/PageHero';
import SectionLabel from '@/components/ui-custom/SectionLabel';
import RotatingBadge from '@/components/ui-custom/RotatingBadge';
import GridBackground from '@/components/ui-custom/GridBackground';
import FloatingPixels from '@/components/ui-custom/FloatingPixels';
import GlowingOrb from '@/components/ui-custom/GlowingOrb';
import { Search, PenTool, Hammer, Rocket, RefreshCw, ArrowRight } from 'lucide-react';

export default function ProcessPage() {
  const steps = [
    {
      icon: Search,
      title: "Discover",
      phase: "Phase 1",
      desc: "You bring the idea or current app. We map out goals, target users, success metrics, and business requirements.",
      whatYouDo: "Share your vision, pain points, and desired outcomes",
      whatWeDo: "Ask the right questions and document everything clearly",
      output: "Goals doc + success metrics",
      duration: "1-2 days"
    },
    {
      icon: PenTool,
      title: "Scope + Architecture",
      phase: "Phase 2",
      desc: "We define features, tech stack (Base44 vs Lovable vs custom), user roles, data models, and timelines.",
      whatYouDo: "Review and prioritize features",
      whatWeDo: "Create wireframes, data architecture, and project timeline",
      output: "Scope doc + wireframes + budget",
      duration: "3-5 days"
    },
    {
      icon: Hammer,
      title: "Sprint + Build",
      phase: "Phase 3",
      desc: "We ship a working MVP with real data, workflows, and UI. We use AI to generate scaffolds, then refine with human judgment.",
      whatYouDo: "Provide feedback during weekly demos",
      whatWeDo: "Build, test, iterate, and keep you updated",
      output: "Working MVP",
      duration: "3-6 weeks"
    },
    {
      icon: Rocket,
      title: "Launch + Handover",
      phase: "Phase 4",
      desc: "We deploy to production, set up domains/DNS, provide training, and hand over full documentation and code access.",
      whatYouDo: "Test in production and report any issues",
      whatWeDo: "Deploy, monitor, fix launch bugs, train your team",
      output: "Live app + docs + training",
      duration: "1 week"
    },
    {
      icon: RefreshCw,
      title: "Grow (Optional)",
      phase: "Phase 5",
      desc: "Optional ongoing partnership for new features, A/B tests, performance tuning, and strategic optimization.",
      whatYouDo: "Decide if you want ongoing support",
      whatWeDo: "Monthly improvements, priority bug fixes, growth experiments",
      output: "Continuous evolution",
      duration: "Monthly"
    }
  ];

  return (
    <div className="bg-slate-950 text-white">
      {/* Hero */}
      <PageHero 
        title="Process" 
        backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop"
      />

      {/* Process Intro */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={20} />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto mb-20">
          <SectionLabel text="Our Process" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Idea → Scope → Sprint<br />
            → Launch → <span className="text-[#73e28a]">Grow</span>
          </h2>
          <p className="text-slate-300 text-lg">
            No black boxes. No endless hourly billing. Just a clear, proven workflow designed to ship software fast.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#73e28a] via-[#73e28a]/50 to-slate-800 hidden md:block"></div>
          
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0 z-10">
                  <div className="w-16 h-16 bg-slate-900 border-2 border-[#73e28a] rounded-full flex items-center justify-center text-[#73e28a] shadow-lg shadow-[#73e28a]/20">
                    <step.icon className="w-7 h-7" />
                  </div>
                </div>
                <Card className="flex-grow relative p-8 border-l-4 border-l-[#73e28a] bg-slate-900/80 hover:border-[#73e28a]/80">
                   <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                     <div>
                       <div className="text-xs text-[#73e28a] font-bold uppercase tracking-wider mb-2">{step.phase} • {step.duration}</div>
                       <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                     </div>
                     <span className="inline-block bg-[#73e28a]/10 text-[#73e28a] text-xs font-bold px-3 py-1.5 rounded-full border border-[#73e28a]/30">
                        {step.output}
                     </span>
                   </div>
                   <p className="text-slate-300 leading-relaxed mb-6">
                     {step.desc}
                   </p>
                   <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-slate-800">
                     <div>
                       <h4 className="text-white font-semibold text-sm mb-2">What you do:</h4>
                       <p className="text-slate-400 text-sm">{step.whatYouDo}</p>
                     </div>
                     <div>
                       <h4 className="text-white font-semibold text-sm mb-2">What we do:</h4>
                       <p className="text-slate-400 text-sm">{step.whatWeDo}</p>
                     </div>
                   </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Timelines */}
      <Section className="py-24 bg-slate-900/30 relative overflow-hidden">
        <GlowingOrb position="center" size="500px" opacity={0.1} />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <SectionLabel text="Typical Timelines" />
          <h2 className="text-4xl font-bold text-white mb-4">Real Numbers From Real Projects</h2>
          <p className="text-slate-300 mb-12">What you can expect when working with us</p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
             <Card className="p-8 border-[#73e28a]/30 bg-slate-900/80">
                <div className="text-[#73e28a] font-bold text-5xl mb-3">4-8 Weeks</div>
                <h3 className="text-white font-bold text-xl mb-3">MVPs & Internal Tools</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">Simple dashboards, automations, or proof-of-concepts built on Base44 or Lovable.</p>
                <div className="text-slate-500 text-xs">Includes: Scope, design, build, deploy</div>
             </Card>
             <Card className="p-8 border-violet-500/30 bg-slate-900/80">
                <div className="text-violet-400 font-bold text-5xl mb-3">6-12 Weeks</div>
                <h3 className="text-white font-bold text-xl mb-3">Production SaaS Apps</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">Customer-facing SaaS, marketplaces, or complex enterprise tools with custom workflows.</p>
                <div className="text-slate-500 text-xs">Includes: Full architecture, integrations, CRO optimization</div>
             </Card>
          </div>
          
          <Card className="p-8 border-slate-700 bg-slate-900/80 mb-12">
            <h3 className="text-white font-bold text-lg mb-6">When we pick Base44 vs Lovable vs custom:</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-[#73e28a] font-bold mb-2">Base44</div>
                <p className="text-slate-400 text-sm">Multi-page apps, dashboards, role-based systems, AI agents, integrations</p>
              </div>
              <div>
                <div className="text-pink-400 font-bold mb-2">Lovable</div>
                <p className="text-slate-400 text-sm">Rapid prototypes, simple tools, visual concepting, overnight MVPs</p>
              </div>
              <div>
                <div className="text-blue-400 font-bold mb-2">Custom</div>
                <p className="text-slate-400 text-sm">Complex algorithms, native desktop/mobile, specific infrastructure needs</p>
              </div>
            </div>
          </Card>
          
          <Link to={createPageUrl('Contact')}>
            <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-10 text-lg">
               See if your idea fits our process
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}