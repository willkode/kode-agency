import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import PageHero from '@/components/ui-custom/PageHero';
import SectionLabel from '@/components/ui-custom/SectionLabel';
import SEO, { createOrganizationSchema, createBreadcrumbSchema } from '@/components/SEO';

import GridBackground from '@/components/ui-custom/GridBackground';
import FloatingPixels from '@/components/ui-custom/FloatingPixels';
import GlowingOrb from '@/components/ui-custom/GlowingOrb';
import { ArrowRight, Play, CheckCircle, Sparkles, Target, Zap, Award, Users, Clock } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { value: "30+", label: "Years Experience" },
    { value: "80%", label: "Faster Development" },
    { value: "70%", label: "Cost Savings" },
    { value: "4-8", label: "Weeks to MVP" },
  ];

  const values = [
    { icon: Sparkles, title: "AI-First Approach", desc: "We leverage cutting-edge AI tools to accelerate every phase of development without sacrificing quality." },
    { icon: Target, title: "Conversion Focus", desc: "Every screen is designed to convert — sign-ups, demos, purchases. Not just pretty pixels." },
    { icon: Zap, title: "Speed & Clarity", desc: "Fixed pricing, clear timelines, no hourly billing surprises. Ship fast and iterate." },
  ];

  return (
    <div className="bg-slate-950 text-white">
      {/* Hero */}
      <PageHero 
        title="About" 
        backgroundImage="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&auto=format&fit=crop"
      />

      {/* Achievement Counters */}
      <Section className="py-20 bg-slate-900/50 border-y border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "50+", label: "Apps Built" },
            { value: "25+", label: "Mobile Apps" },
            { value: "100+", label: "Websites" },
            { value: "75+", label: "Marketing Campaigns" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#73e28a] mb-2">{item.value}</div>
              <div className="text-slate-400">{item.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* About Content */}
      <Section className="py-24 relative overflow-hidden">
        <GlowingOrb position="top-right" size="400px" opacity={0.1} />
        
        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="relative flex flex-col items-center">
            {/* Will Kode Photo */}
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691e276e2117009b68e21c5c/9529b1fac_Gemini_Generated_Image_2bff3r2bff3r2bff1.png" 
              alt="Will Kode" 
              className="w-full max-w-md h-auto object-contain"
            />
            {/* Name and Title */}
            <div className="text-center mt-6">
              <h3 className="text-2xl font-bold text-white">Will Kode</h3>
              <p className="text-[#73e28a] font-medium">Founder and CEO</p>
            </div>
            {/* Green accent */}
            <div className="absolute top-1/3 right-0 transform translate-x-1/2 z-30">
              <div className="w-16 h-16 bg-[#73e28a] rounded-tr-3xl rounded-bl-3xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-black" />
              </div>
            </div>
          </div>

          <div>
            <SectionLabel text="About Company" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              The Marketer Who<br />
              <span className="text-[#73e28a]">Learned to Code</span>
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              I'm Will Kode. I've spent three decades in the trenches of marketing, SEO, and conversion optimization — helping brands grow their revenue.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              But I kept hitting the same wall: traditional dev was too slow, too expensive, and often misaligned with growth. So I went back to full-stack development. Then I dove deep into AI-native product building — using tools like Base44, Lovable, and custom AI agents to accelerate every part of the process.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {['Marketing Strategy', 'Full-Stack Dev', 'AI Integration', 'CRO Optimization', 'SaaS Building'].map((skill, i) => (
                <span key={i} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-300 hover:border-[#73e28a]/50 hover:text-[#73e28a] transition-colors cursor-default">
                  {skill}
                </span>
              ))}
            </div>

            <Link to={createPageUrl('Contact')}>
              <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-12 px-6">
                Work With Me <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Section>



      {/* Values */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={20} />
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <SectionLabel text="Our Values" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">What Sets Us Apart</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <Card key={i} className="p-8 text-center group hover:border-[#73e28a]/50 bg-slate-900/80">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#73e28a] group-hover:bg-[#73e28a] group-hover:text-black transition-all duration-300">
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{value.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Philosophy */}
      <Section className="py-24 bg-slate-900/30 relative overflow-hidden">
        <GlowingOrb position="center" size="500px" opacity={0.1} />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <SectionLabel text="My Philosophy" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            How I Think About Building
          </h2>
          
          <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
            <p>
              Software should be built <strong className="text-white">fast, lean, and conversion-first</strong>.
            </p>
            <p>
              AI tools are power tools — they help us move faster, but they don't replace human judgment, UX thinking, or strategic clarity.
            </p>
            <p>
              Every project should have a clear goal: sign-ups, demos, revenue, automation. If we can't measure it, we shouldn't build it.
            </p>
            <p className="text-[#73e28a] font-semibold text-xl mt-8">
              "Ship fast. Measure everything. Optimize relentlessly."
            </p>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={15} />
        
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Want to work together?
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            Whether you have an idea or an existing app, let's talk about how we can move faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Contact')}>
              <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-10 text-lg">
                Start a project <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl('Services')}>
              <Button variant="outline" className="border-slate-600 bg-slate-900/50 text-white hover:bg-slate-800 hover:border-slate-500 h-14 px-10 text-lg">
                See what we build
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}