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
import { Check, ArrowRight } from 'lucide-react';

export default function PlatformsPage() {
  const platforms = [
    {
      name: "Base44",
      tagline: "Best for SaaS & Internal Tools",
      tagColor: "bg-[#73e28a]/20 text-[#73e28a]",
      borderColor: "border-[#73e28a]/30",
      bgColor: "bg-[#73e28a]/5",
      description: "Our go-to platform for building robust, scalable web applications with built-in backend, database, and authentication.",
      handles: ["Data Modeling & Schema", "Frontend Logic & UI", "Integrations & Functions"],
      whyLove: "Base44 provides an incredible balance of speed and flexibility. It handles the boring infrastructure stuff so we can focus on your unique business logic.",
      perfectFor: ["Full-featured SaaS apps", "Complex internal dashboards", "Data-heavy applications"]
    },
    {
      name: "Lovable",
      tagline: "Best for Rapid Prototyping",
      tagColor: "bg-pink-600/20 text-pink-300",
      borderColor: "border-pink-500/30",
      bgColor: "bg-pink-500/5",
      description: "The fastest way to go from idea to a working web app using natural language and AI.",
      handles: ["Prompt Engineering", "Code Cleanup & Refinement", "Migration to Production"],
      whyLove: "It allows us to visualize ideas instantly. We often use Lovable for the initial V0 to get feedback before building the scalable V1.",
      perfectFor: ["Validating ideas overnight", "Simple tools & utilities", "Visual concepting"]
    },
    {
      name: "Replit",
      tagline: "Best for Cloud-Native Code",
      tagColor: "bg-orange-600/20 text-orange-300",
      borderColor: "border-orange-500/30",
      bgColor: "bg-orange-500/5",
      description: "A powerful collaborative IDE and deployment platform that speeds up coding and hosting.",
      handles: ["Project Architecture", "Backend Development", "Deployment & Scaling"],
      whyLove: "It removes the headache of local environments and deployment pipelines. We can code, ship, and iterate faster.",
      perfectFor: ["Python/Node.js scripts", "Bots & Automation", "Microservices"]
    }
  ];

  return (
    <div className="bg-slate-950 text-white">
      {/* Hero */}
      <PageHero 
        title="Platforms" 
        backgroundImage="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop"
      />

      {/* Philosophy */}
      <Section className="py-24 relative overflow-hidden">
        <GlowingOrb position="top-right" size="400px" opacity={0.1} />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto mb-20">
          <SectionLabel text="Our Philosophy" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            We Pick the Right Tool<br />
            <span className="text-[#73e28a]">For the Job</span>
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            AI tools are power tools. We use them to move faster, not to ship junk. Every build still goes through human review, UX thinking, strategic clarity, and thorough QA. We pick the right tool for the job — not force everything into one platform.
          </p>
        </div>
      </Section>

      {/* Platforms Grid */}
      <Section className="py-12 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={20} />
        
        <div className="relative z-10 space-y-12">
          {platforms.map((platform, i) => (
            <Card key={i} className={`p-8 ${platform.borderColor} ${platform.bgColor}`}>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                  <div className="text-4xl font-bold text-white mb-4">{platform.name}</div>
                  <div className={`inline-block ${platform.tagColor} px-3 py-1 rounded-full text-sm font-medium mb-6`}>
                    {platform.tagline}
                  </div>
                  <p className="text-slate-300 mb-6">
                    {platform.description}
                  </p>
                  <div className="space-y-2">
                     <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">We Handle:</div>
                     <ul className="space-y-1 text-slate-400">
                       {platform.handles.map((item, j) => (
                         <li key={j}>• {item}</li>
                       ))}
                     </ul>
                  </div>
                </div>
                <div className="lg:w-2/3 grid md:grid-cols-2 gap-6">
                   <Card className="p-6 bg-slate-900/80 border-slate-800">
                      <h4 className="text-white font-bold mb-3">Why we love it</h4>
                      <p className="text-slate-400 text-sm">{platform.whyLove}</p>
                   </Card>
                   <Card className="p-6 bg-slate-900/80 border-slate-800">
                      <h4 className="text-white font-bold mb-3">Perfect for</h4>
                      <ul className="text-slate-400 text-sm space-y-2">
                        {platform.perfectFor.map((item, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[#73e28a] mt-0.5 flex-shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                   </Card>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-24 relative overflow-hidden">
        <GlowingOrb position="center" size="500px" opacity={0.1} />
        
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Not sure which one you need?
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            That's our job. We'll analyze your requirements and recommend the best path forward.
          </p>
          <Link to={createPageUrl('Contact')}>
            <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-white font-bold h-14 px-10 text-lg">
              Schedule a Platform Fit Call <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}