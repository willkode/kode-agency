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
      title: "Discovery & Scoping",
      desc: "We dig deep into your business problem. We define must-haves, choose the right platform (Base44, Lovable, Custom), and give you a clear scope and budget.",
      output: "Scope Document & Budget Range"
    },
    {
      icon: PenTool,
      title: "Product Blueprint",
      desc: "We architect the solution. We map out user roles, data entities, and key user flows to ensure we build the right thing.",
      output: "Architecture & Wireframes"
    },
    {
      icon: Hammer,
      title: "Build Sprints",
      desc: "We build in weekly or bi-weekly cycles. You get regular demos and progress updates so there are no surprises.",
      output: "Weekly Demos"
    },
    {
      icon: Rocket,
      title: "Launch & Handover",
      desc: "We deploy your app to production, set up domains, and provide training on how to use and manage it.",
      output: "Live App & Documentation"
    },
    {
      icon: RefreshCw,
      title: "Ongoing Support",
      desc: "Software is never 'done'. We offer support packages for bug fixes, new features, and performance tuning.",
      output: "Peace of Mind"
    }
  ];

  return (
    <div>
      <Section className="pt-32 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">How We Work</h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          No black boxes. No jargon. Just a transparent process designed to ship software fast.
        </p>
      </Section>

      <Section>
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-[28px] top-0 bottom-0 w-0.5 bg-slate-800 hidden md:block"></div>
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0 z-10">
                  <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center text-indigo-500 shadow-xl">
                    <step.icon className="w-6 h-6" />
                  </div>
                </div>
                <Card className="flex-grow relative p-8">
                   {/* Mobile connector */}
                   <div className="absolute left-7 -top-12 w-0.5 h-12 bg-slate-800 md:hidden" style={{ display: index === 0 ? 'none' : 'block' }}></div>
                   
                   <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
                     <h3 className="text-2xl font-bold text-white">Step {index + 1}: {step.title}</h3>
                     <span className="inline-block bg-slate-800 text-slate-300 text-xs font-medium px-2 py-1 rounded">
                        Output: {step.output}
                     </span>
                   </div>
                   <p className="text-slate-400 leading-relaxed">
                     {step.desc}
                   </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-indigo-950/10 py-20 mt-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">Typical Timelines</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
             <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <div className="text-indigo-400 font-bold text-4xl mb-2">2-4 Weeks</div>
                <h3 className="text-white font-semibold mb-2">Internal Tools & MVPs</h3>
                <p className="text-slate-500 text-sm">Simple dashboards, automations, or proof-of-concepts.</p>
             </div>
             <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <div className="text-violet-400 font-bold text-4xl mb-2">6-12 Weeks</div>
                <h3 className="text-white font-semibold mb-2">Full Production Apps</h3>
                <p className="text-slate-500 text-sm">Customer-facing SaaS, complex marketplaces, or enterprise apps.</p>
             </div>
          </div>
          <Link to={createPageUrl('Contact')}>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-8">
               See if your idea fits our process
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}