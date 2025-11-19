import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Check, Plus, ArrowUpRight, Quote, Twitter, Linkedin, Facebook, Dribbble } from 'lucide-react';
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';

export default function HomePage() {
  const [activeService, setActiveService] = useState(0);

  const services = [
    { title: "Strategy & Planning", description: "We map out your product's journey from concept to launch.", icon: "01" },
    { title: "Design & Prototype", description: "Visualizing your idea with pixel-perfect designs and prototypes.", icon: "02" },
    { title: "Development", description: "Building scalable, robust applications using modern tech stacks.", icon: "03" },
  ];

  return (
    <div className="flex flex-col bg-slate-950 text-white overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-10 md:pt-32 md:pb-20 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-20 right-10 w-32 h-32 border-2 border-dashed border-slate-700 rounded-full opacity-20 animate-spin-slow" />
        <div className="absolute top-40 left-10 w-24 h-24 bg-[#73e28a]/10 rounded-full blur-xl" />
        <div className="absolute top-10 right-[20%] w-[400px] h-[400px] bg-gradient-to-b from-slate-800/20 to-transparent rounded-full -z-10" />

        <div className="container mx-auto px-4 text-center">
          <div className="inline-block px-4 py-2 bg-[#73e28a]/10 border border-[#73e28a]/30 rounded-full text-[#73e28a] text-sm font-semibold mb-6">
            AI-Native Product Studio
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-6">
            Build 80% faster.<br />
            Ship production-ready<br />
            apps in <span className="text-[#73e28a]">weeks</span>, not months.
          </h1>

          <p className="text-slate-400 text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Kode Agency uses AI + modern platforms like Base44 and Lovable to build web, desktop, and mobile apps at 70% lower cost — without sacrificing UX, performance, or conversion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
             <Link to={createPageUrl('Contact')}>
                <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-8 text-lg rounded-full shadow-lg shadow-[#73e28a]/20">
                   Plan your MVP sprint <ArrowRight className="ml-2" />
                </Button>
             </Link>
             <Link to={createPageUrl('Process')}>
                <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 h-14 px-8 text-lg rounded-full">
                   See how we build 80% faster
                </Button>
             </Link>
          </div>

          <div className="text-slate-500 text-sm">
             Built with Base44, Lovable, Replit + custom stacks
          </div>
        </div>
      </section>

      {/* Who We Build For */}
      <Section className="py-20 border-y border-slate-900">
         <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Who we build for</h2>
         </div>
         <div className="grid md:grid-cols-4 gap-8">
            {[
               { title: "Founders", pain: "You have an idea but traditional dev is slow and expensive.", solution: "We scope and ship your MVP in 4–8 weeks with clear pricing." },
               { title: "Agencies", pain: "Your clients need apps but you don't have a dev team.", solution: "We work as your white-label product studio behind the scenes." },
               { title: "Creators", pain: "You want a SaaS around your audience but don't know where to start.", solution: "We build course platforms, membership sites, and community tools fast." },
               { title: "Companies", pain: "You're drowning in spreadsheets and manual workflows.", solution: "We automate with custom dashboards and internal tools in weeks." },
            ].map((item, i) => (
               <Card key={i} className="p-6 text-center">
                  <h3 className="text-xl font-bold text-[#73e28a] mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-sm mb-3">{item.pain}</p>
                  <p className="text-slate-300 text-sm">{item.solution}</p>
               </Card>
            ))}
         </div>
      </Section>

      {/* What We Build */}
      <Section className="py-24">
         <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">What we actually build</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Fast, focused, and built to convert</p>
         </div>
         <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
               { 
                  title: "MVPs & SaaS products", 
                  desc: "From zero to live MVP in 4–8 weeks using AI-accelerated sprints. We handle strategy, design, development, and deployment.",
                  link: "Portfolio"
               },
               { 
                  title: "Internal tools & automations", 
                  desc: "Dashboards, workflows, AI agents, and integrations that clean up back-office processes and eliminate spreadsheet chaos.",
                  link: "Services"
               },
               { 
                  title: "Marketing sites that convert", 
                  desc: "CRO-optimized landing pages and product sites with SEO, performance, and analytics baked in from day one.",
                  link: "Services"
               },
               { 
                  title: "AI integrations & copilots", 
                  desc: "Custom LLM flows, AI agents, and intelligent features to augment your existing products and workflows.",
                  link: "Services"
               },
            ].map((item, i) => (
               <Card key={i} className="p-8 group hover:border-[#73e28a]/50">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#73e28a] transition-colors">{item.title}</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">{item.desc}</p>
                  <Link to={createPageUrl(item.link)} className="text-[#73e28a] font-medium flex items-center gap-2 hover:gap-3 transition-all">
                     See examples <ArrowRight className="w-4 h-4" />
                  </Link>
               </Card>
            ))}
         </div>
      </Section>

      {/* Why We're Different */}
      <Section className="bg-slate-900/30 py-24">
         <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Why Kode Agency is different</h2>
            <p className="text-slate-400 text-lg">Our unfair advantages</p>
         </div>
         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
               { 
                  icon: "🧠", 
                  title: "Fused brain", 
                  desc: "30 years of marketing + full-stack dev + AI product building in one brain. We don't just build, we build to convert."
               },
               { 
                  icon: "⚡", 
                  title: "AI-accelerated workflow", 
                  desc: "We use Base44, Lovable, and AI agents to generate scaffolds, then refine with human judgment and CRO thinking."
               },
               { 
                  icon: "🎯", 
                  title: "Speed and clarity", 
                  desc: "We scope, design, and ship in clearly defined sprints. No endless hourly billing, no scope creep."
               },
               { 
                  icon: "📈", 
                  title: "Conversion-first", 
                  desc: "Every screen is designed to convert — sign-ups, demos, upgrades. Not just pretty pixels."
               },
            ].map((item, i) => (
               <div key={i} className="text-center">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
               </div>
            ))}
         </div>
      </Section>

      {/* Process Preview */}
      <Section className="py-24">
         <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How we work</h2>
            <p className="text-slate-400 text-lg">Idea → Scope → Sprint → Launch → Grow</p>
         </div>
         <div className="grid md:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {[
               { num: "01", title: "Discover", desc: "You bring the idea. We map goals, users, and success metrics." },
               { num: "02", title: "Scope", desc: "We define features, tech stack, and timelines." },
               { num: "03", title: "Sprint", desc: "We ship a working MVP with real data and workflows." },
               { num: "04", title: "Launch", desc: "We deploy, measure, and fix friction." },
               { num: "05", title: "Grow", desc: "Optional ongoing product and growth partnership." },
            ].map((step, i) => (
               <div key={i} className="text-center relative">
                  <div className="w-16 h-16 rounded-full border-2 border-[#73e28a] flex items-center justify-center text-[#73e28a] font-bold text-xl mx-auto mb-4 bg-slate-950">
                     {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.desc}</p>
                  {i < 4 && (
                     <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-slate-800"></div>
                  )}
               </div>
            ))}
         </div>
         <div className="text-center mt-12">
            <Link to={createPageUrl('Process')}>
               <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
                  See process in detail <ArrowRight className="ml-2" />
               </Button>
            </Link>
         </div>
      </Section>

      {/* Featured Builds */}
      <Section className="bg-slate-900/30 py-24">
         <div className="text-center mb-16">
            <div className="text-[#73e28a] text-sm font-bold uppercase tracking-wider mb-2">Portfolio</div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Featured builds</h2>
         </div>
         <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
               { 
                  title: "Investment Club Portal", 
                  desc: "Base44 + AI agents. Replaced 8 spreadsheets.",
                  metric: "Launched in 6 weeks",
                  platform: "Base44"
               },
               { 
                  title: "Course Platform MVP", 
                  desc: "Lovable + custom functions for creator economy.",
                  metric: "Built in 3 weeks",
                  platform: "Lovable"
               },
               { 
                  title: "Workflow Automation", 
                  desc: "Custom Node.js + AI. Saved 20 hrs/week.",
                  metric: "ROI in 2 months",
                  platform: "Custom"
               },
            ].map((project, i) => (
               <Card key={i} className="p-8 group hover:border-[#73e28a]/50">
                  <div className="text-xs font-bold text-[#73e28a] uppercase tracking-wider mb-4">{project.platform}</div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#73e28a] transition-colors">{project.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{project.desc}</p>
                  <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-6">
                     <Check className="w-4 h-4" />
                     {project.metric}
                  </div>
                  <Link to={createPageUrl('Portfolio')} className="text-[#73e28a] text-sm font-medium flex items-center gap-2 hover:gap-3 transition-all">
                     Read case study <ArrowRight className="w-3 h-3" />
                  </Link>
               </Card>
            ))}
         </div>
         <div className="text-center mt-12">
            <Link to={createPageUrl('Portfolio')}>
               <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold">
                  View all projects <ArrowRight className="ml-2" />
               </Button>
            </Link>
         </div>
      </Section>

      {/* Will Kode Authority Section */}
      <Section className="py-24">
         <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
               <div className="relative">
                  <div className="aspect-square rounded-2xl overflow-hidden border-4 border-[#73e28a]/20">
                     <img 
                        src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop" 
                        alt="Will Kode" 
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                     />
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-[#73e28a] text-black px-6 py-3 rounded-lg font-bold shadow-lg">
                     30+ Years Experience
                  </div>
               </div>
               <div>
                  <div className="text-[#73e28a] text-sm font-bold uppercase tracking-wider mb-2">Led by Will Kode</div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                     Marketer, SEO, CRO specialist & AI-native product builder
                  </h2>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                     I've spent decades in marketing, SEO, and conversion optimization — working with brands across restoration, mobility, home services, and SaaS.
                  </p>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                     Now I build the software. Kode Agency combines my marketing brain with full-stack development and AI-accelerated workflows to ship apps that don't just work — they convert and grow.
                  </p>
                  <Link to={createPageUrl('About')}>
                     <Button className="bg-white hover:bg-slate-200 text-black rounded-full px-8">
                        My story <ArrowRight className="ml-2" />
                     </Button>
                  </Link>
               </div>
            </div>
         </div>
      </Section>

      {/* Final CTA */}
      <Section className="py-24 bg-gradient-to-b from-slate-900/50 to-slate-950">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
               Ready to build 80% faster?
            </h2>
            <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto">
               Whether you have an idea or an existing app, we'll help you move fast without sacrificing quality.
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
               <Link to={createPageUrl('Contact')} className="block">
                  <Card className="p-8 hover:border-[#73e28a]/50 group cursor-pointer h-full">
                     <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#73e28a] transition-colors">I have an idea</h3>
                     <p className="text-slate-400 text-sm mb-4">Let's scope and build your MVP</p>
                     <ArrowRight className="w-5 h-5 text-[#73e28a] group-hover:translate-x-1 transition-transform" />
                  </Card>
               </Link>
               <Link to={createPageUrl('Contact')} className="block">
                  <Card className="p-8 hover:border-[#73e28a]/50 group cursor-pointer h-full">
                     <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#73e28a] transition-colors">I have an existing app</h3>
                     <p className="text-slate-400 text-sm mb-4">Let's evolve and optimize it</p>
                     <ArrowRight className="w-5 h-5 text-[#73e28a] group-hover:translate-x-1 transition-transform" />
                  </Card>
               </Link>
            </div>
         </div>
      </Section>

      {/* Newsletter / Footer CTA */}
      <div className="container mx-auto px-4 mb-20">
         <div className="bg-slate-900 rounded-3xl p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
            {/* Deco */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#73e28a]/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
               <h2 className="text-3xl font-bold text-white mb-2">Subscribe Now</h2>
               <p className="text-slate-400">Get the latest updates and news directly to your inbox.</p>
            </div>

            <div className="relative z-10 w-full md:w-auto flex gap-2">
               <input 
                  type="email" 
                  placeholder="Enter email address" 
                  className="bg-slate-950 border border-slate-800 rounded-full px-6 py-4 text-white w-full md:w-80 focus:outline-none focus:border-[#73e28a]"
               />
               <button className="w-14 h-14 bg-[#73e28a] rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform">
                  <ArrowUpRight />
               </button>
            </div>
         </div>
      </div>

    </div>
  );
}