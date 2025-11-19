import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import { Search, PenTool, Hammer, Rocket, RefreshCw } from 'lucide-react';

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
    <div>
      <Section className="pt-32 pb-16 text-center">
        <div className="inline-block px-4 py-2 bg-[#73e28a]/10 border border-[#73e28a]/30 rounded-full text-[#73e28a] text-sm font-semibold mb-6">
          Our Process
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Idea → Scope → Sprint<br />
          → Launch → <span className="text-[#73e28a]">Grow</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          No black boxes. No endless hourly billing. Just a clear, proven workflow designed to ship software fast.
        </p>
      </Section>

      <Section>
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-[28px] top-0 bottom-0 w-0.5 bg-slate-800 hidden md:block"></div>
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0 z-10">
                  <div className="w-16 h-16 bg-slate-900 border-2 border-[#73e28a] rounded-full flex items-center justify-center text-[#73e28a] shadow-xl">
                    <step.icon className="w-7 h-7" />
                  </div>
                </div>
                <Card className="flex-grow relative p-8 border-l-4 border-l-[#73e28a]">
                   {/* Mobile connector */}
                   <div className="absolute left-8 -top-12 w-0.5 h-12 bg-slate-800 md:hidden" style={{ display: index === 0 ? 'none' : 'block' }}></div>

                   <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                     <div>
                       <div className="text-xs text-[#73e28a] font-bold uppercase tracking-wider mb-2">{step.phase} • {step.duration}</div>
                       <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                     </div>
                     <span className="inline-block bg-[#73e28a]/10 text-[#73e28a] text-xs font-bold px-3 py-1.5 rounded-full border border-[#73e28a]/30">
                        {step.output}
                     </span>
                   </div>
                   <p className="text-slate-400 leading-relaxed mb-6">
                     {step.desc}
                   </p>
                   <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-slate-800">
                     <div>
                       <h4 className="text-white font-semibold text-sm mb-2">What you do:</h4>
                       <p className="text-slate-500 text-sm">{step.whatYouDo}</p>
                     </div>
                     <div>
                       <h4 className="text-white font-semibold text-sm mb-2">What we do:</h4>
                       <p className="text-slate-500 text-sm">{step.whatWeDo}</p>
                     </div>
                   </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-slate-900/30 py-20 mt-10">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">Typical Timelines</h2>
          <p className="text-slate-400 mb-12">Real numbers from real projects</p>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
             <Card className="p-8 border-[#73e28a]/30">
                <div className="text-[#73e28a] font-bold text-5xl mb-3">4-8 Weeks</div>
                <h3 className="text-white font-bold text-xl mb-3">MVPs & Internal Tools</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">Simple dashboards, automations, or proof-of-concepts built on Base44 or Lovable.</p>
                <div className="text-slate-500 text-xs">Includes: Scope, design, build, deploy</div>
             </Card>
             <Card className="p-8 border-violet-500/30">
                <div className="text-violet-400 font-bold text-5xl mb-3">6-12 Weeks</div>
                <h3 className="text-white font-bold text-xl mb-3">Production SaaS Apps</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">Customer-facing SaaS, marketplaces, or complex enterprise tools with custom workflows.</p>
                <div className="text-slate-500 text-xs">Includes: Full architecture, integrations, CRO optimization</div>
             </Card>
          </div>
          
          <div className="bg-slate-950 rounded-xl p-8 border border-slate-800 mb-12">
            <h3 className="text-white font-bold text-lg mb-4">When we pick Base44 vs Lovable vs custom:</h3>
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
          </div>
          
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