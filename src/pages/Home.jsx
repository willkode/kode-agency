import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Zap, Code2, Layers, Cpu, Rocket } from 'lucide-react';
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 opacity-50" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-600/10 rounded-full blur-[100px] -z-10 opacity-30" />

        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Accepting new projects for Q4
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 max-w-5xl mx-auto leading-tight">
            We build real products <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">fast</span> using AI & Modern Platforms.
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Accelerate your roadmap. We specialize in Base44, Lovable, Replit, and custom stacks to deliver scalable software for agencies, founders, and teams.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={createPageUrl('Contact')}>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-8 text-lg rounded-full w-full sm:w-auto">
                Start a Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to={createPageUrl('Portfolio')}>
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-14 px-8 text-lg rounded-full w-full sm:w-auto">
                View Case Studies
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Build For */}
      <Section className="bg-slate-950">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built for Speed & Scale</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">We partner with ambitious teams to ship software without the bloat.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <Rocket className="w-10 h-10 text-indigo-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Startup Founders</h3>
            <p className="text-slate-400">Launch your MVP in weeks, not months. Validate ideas fast with production-grade infrastructure.</p>
          </Card>
          <Card>
            <Layers className="w-10 h-10 text-violet-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Agencies</h3>
            <p className="text-slate-400">Expand your capacity. We act as your white-label tech partner for complex client builds.</p>
          </Card>
          <Card>
            <Cpu className="w-10 h-10 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Established Teams</h3>
            <p className="text-slate-400">Modernize internal tools and dashboards to automate workflows and reduce manual overhead.</p>
          </Card>
        </div>
      </Section>

      {/* What We Build */}
      <Section className="bg-slate-900/50 border-y border-slate-800">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Everything you need to launch</h2>
            <p className="text-slate-400 mb-8 text-lg">From internal dashboards to customer-facing SaaS apps, we handle the full stack.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Internal Tools & Dashboards",
                "Client Portals",
                "AI Agents & Chatbots",
                "SaaS Applications",
                "Mobile & Desktop Apps",
                "Custom Integrations"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-10">
               <Link to={createPageUrl('Services')}>
                <Button variant="link" className="text-indigo-400 hover:text-indigo-300 p-0 h-auto text-lg">
                  Explore our services <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-transparent rounded-2xl transform rotate-3"></div>
             <img 
               src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
               alt="Dashboard Preview" 
               className="relative rounded-2xl border border-slate-700 shadow-2xl"
             />
          </div>
        </div>
      </Section>

      {/* Platforms */}
      <Section>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Our Tech Stack</h2>
          <p className="text-slate-400">We choose the right tool for the job.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <Card className="flex flex-col items-center text-center p-8">
             <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 text-white font-bold text-xl">B</div>
             <h3 className="text-white font-bold mb-1">Base44</h3>
             <p className="text-sm text-slate-500">AI-first app building</p>
          </Card>
          <Card className="flex flex-col items-center text-center p-8">
             <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 text-white font-bold text-xl">L</div>
             <h3 className="text-white font-bold mb-1">Lovable</h3>
             <p className="text-sm text-slate-500">Idea to app fast</p>
          </Card>
          <Card className="flex flex-col items-center text-center p-8">
             <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 text-white font-bold text-xl">R</div>
             <h3 className="text-white font-bold mb-1">Replit</h3>
             <p className="text-sm text-slate-500">Cloud-native code</p>
          </Card>
          <Card className="flex flex-col items-center text-center p-8">
             <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 text-white font-bold text-xl"><Code2 /></div>
             <h3 className="text-white font-bold mb-1">Custom</h3>
             <p className="text-sm text-slate-500">React, Node, Python</p>
          </Card>
        </div>
        
        <div className="text-center mt-12">
          <Link to={createPageUrl('Platforms')}>
            <Button variant="outline" className="border-slate-700 text-slate-300">
              Learn why we use these platforms <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="bg-slate-950 border-t border-slate-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Trusted by Founders & Teams</h2>
          <p className="text-slate-400">Don't just take our word for it.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
           {[
             {
               quote: "We launched our MVP in 3 weeks. The speed was incredible, and the code quality was top-notch.",
               author: "Sarah Jenkins",
               role: "Founder, TechFlow",
               image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
             },
             {
               quote: "They helped us automate our entire onboarding process. Saved us 20+ hours a week.",
               author: "David Chen",
               role: "COO, AgencyScale",
               image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
             },
             {
               quote: "Finally an agency that understands product, not just code. They acted like true partners.",
               author: "Elena Rodriguez",
               role: "Product Lead, SaaSy",
               image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
             }
           ].map((t, i) => (
             <Card key={i} className="p-8">
               <div className="flex items-center gap-4 mb-6">
                 <img src={t.image} alt={t.author} className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30" />
                 <div>
                   <div className="text-white font-bold">{t.author}</div>
                   <div className="text-slate-500 text-sm">{t.role}</div>
                 </div>
               </div>
               <p className="text-slate-300 italic">"{t.quote}"</p>
             </Card>
           ))}
        </div>
      </Section>

      {/* Process Summary */}
      <Section className="bg-indigo-950/10 border-y border-slate-800/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">How We Work</h2>
          <p className="text-slate-400">Transparent. Fast. Iterative.</p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
          
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
             {[
               { step: "01", title: "Strategy Call", desc: "We align on goals & scope." },
               { step: "02", title: "Blueprint", desc: "We map out the architecture." },
               { step: "03", title: "Build Sprints", desc: "Weekly demos & updates." },
               { step: "04", title: "Launch", desc: "Deploy & ongoing support." },
             ].map((item) => (
               <div key={item.step} className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center">
                 <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                   {item.step}
                 </div>
                 <h3 className="text-white font-bold mb-2">{item.title}</h3>
                 <p className="text-slate-500 text-sm">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to build something great?</h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Whether you have a full spec or just an idea, we can help you move forward.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={createPageUrl('Contact')}>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-8 text-lg rounded-full shadow-lg shadow-indigo-600/20">
                Book a Free Discovery Call
              </Button>
            </Link>
            <Link to={createPageUrl('Contact')}>
               <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800 h-14 px-8 text-lg rounded-full">
                 Send Project Details
               </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}