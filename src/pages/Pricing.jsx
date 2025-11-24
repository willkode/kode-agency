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

export default function PricingPage() {
  const pricingFactors = [
    { title: "Complexity", desc: "Simple CRUD vs. complex algorithms, workflows, and business logic." },
    { title: "User Roles", desc: "Single user type vs. multi-tenant with admin/manager/user roles." },
    { title: "Integrations", desc: "Standalone app vs. connecting to multiple external APIs and services." },
    { title: "Design", desc: "Standard UI components vs. fully custom bespoke design system." },
  ];

  const faqs = [
    { q: "Can you work with my existing app?", a: "Yes, if it's built on modern tech stacks or one of our supported platforms. We'll do a quick audit first." },
    { q: "Do you offer white-label services for agencies?", a: "Absolutely. We work behind the scenes for several design and marketing agencies." },
    { q: "What if I don't have clear specs yet?", a: "That's fine! Our Discovery & Scoping phase is designed exactly for that." },
  ];

  return (
    <div className="bg-slate-950 text-white">
      {/* Hero */}
      <PageHero 
        title="Pricing" 
        backgroundImage="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&auto=format&fit=crop"
      />

      {/* Pricing Cards */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={20} />
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <SectionLabel text="Pricing Plans" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              No Hidden Fees.<br />
              No <span className="text-[#73e28a]">Endless Hourly Billing</span>.
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Choose the engagement model that fits your stage and budget. All prices reflect our AI-accelerated efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* MVP Sprint */}
            <Card className="flex flex-col p-8 border-t-4 border-t-[#73e28a] bg-slate-900/80">
              <h3 className="text-2xl font-bold text-white mb-2">MVP Sprint</h3>
              <p className="text-slate-400 text-sm mb-6">For founders validating an idea fast.</p>
              <div className="mb-6">
                <div className="text-4xl font-bold text-white mb-1">From $1k</div>
                <div className="text-slate-500 text-sm">Fixed price, 4-8 weeks</div>
              </div>

              <ul className="space-y-4 mb-8 flex-grow text-slate-300 text-sm">
                <li className="flex gap-3"><Check className="w-5 h-5 text-[#73e28a] flex-shrink-0" /> Full scope workshop</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-[#73e28a] flex-shrink-0" /> Core MVP features</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-[#73e28a] flex-shrink-0" /> Base44 or Lovable build</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-[#73e28a] flex-shrink-0" /> Production deployment</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-[#73e28a] flex-shrink-0" /> 30-day warranty</li>
              </ul>

              <Link to={createPageUrl('Contact')} className="w-full">
                <Button className="w-full bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold">Get Started</Button>
              </Link>
            </Card>

            {/* Launch Package */}
            <Card className="flex flex-col p-8 border-t-4 border-t-[#73e28a] relative bg-slate-800/80 transform md:-translate-y-4 shadow-2xl shadow-[#73e28a]/10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#73e28a] text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Launch Package</h3>
              <p className="text-slate-400 text-sm mb-6">For production-ready SaaS apps.</p>
              <div className="mb-6">
                <div className="text-4xl font-bold text-white mb-1">$3k-$5k</div>
                <div className="text-slate-500 text-sm">Custom quote, 6-12 weeks</div>
              </div>

              <ul className="space-y-4 mb-8 flex-grow text-slate-300 text-sm">
                <li className="flex gap-3"><Check className="w-5 h-5 text-[#73e28a] flex-shrink-0" /> Full architecture & design</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-[#73e28a] flex-shrink-0" /> Production-ready code</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-[#73e28a] flex-shrink-0" /> Admin dashboards</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-[#73e28a] flex-shrink-0" /> CRO optimization</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-[#73e28a] flex-shrink-0" /> Analytics & tracking</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-[#73e28a] flex-shrink-0" /> 60-day support</li>
              </ul>

              <Link to={createPageUrl('Contact')} className="w-full">
                <Button className="w-full bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold">Request Quote</Button>
              </Link>
            </Card>

            {/* Product Partner */}
            <Card className="flex flex-col p-8 border-t-4 border-t-violet-500 bg-slate-900/80">
              <h3 className="text-2xl font-bold text-white mb-2">Product Partner</h3>
              <p className="text-slate-400 text-sm mb-6">For ongoing evolution & growth.</p>
              <div className="mb-6">
                <div className="text-4xl font-bold text-white mb-1">$2k-$5k<span className="text-xl text-slate-500 font-normal">/mo</span></div>
                <div className="text-slate-500 text-sm">Month-to-month, cancel anytime</div>
              </div>

              <ul className="space-y-4 mb-8 flex-grow text-slate-300 text-sm">
                <li className="flex gap-3"><Check className="w-5 h-5 text-violet-400 flex-shrink-0" /> Dedicated monthly hours</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-violet-400 flex-shrink-0" /> Roadmap planning</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-violet-400 flex-shrink-0" /> Priority bug fixes</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-violet-400 flex-shrink-0" /> A/B testing & CRO</li>
                <li className="flex gap-3"><Check className="w-5 h-5 text-violet-400 flex-shrink-0" /> Performance monitoring</li>
              </ul>

              <Link to={createPageUrl('Contact')} className="w-full">
                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold">Let's Talk</Button>
              </Link>
            </Card>
          </div>
        </div>
      </Section>
      
      {/* Pricing Factors */}
      <Section className="py-24 bg-slate-900/30 relative overflow-hidden">
        <GlowingOrb position="center" size="500px" opacity={0.1} />
        
        <div className="relative z-10 text-center">
          <SectionLabel text="What Affects Pricing" />
          <h2 className="text-4xl font-bold text-white mb-4">Every Project is Different</h2>
          <p className="text-slate-300 mb-12 max-w-2xl mx-auto">Here's what moves the needle on your quote:</p>
          
          <div className="grid md:grid-cols-4 gap-6 text-left max-w-6xl mx-auto mb-16">
             {pricingFactors.map((factor, i) => (
               <Card key={i} className="p-6 bg-slate-900/80">
                 <div className="text-[#73e28a] font-bold text-lg mb-3">{factor.title}</div>
                 <p className="text-sm text-slate-400">{factor.desc}</p>
               </Card>
             ))}
          </div>
          
          <Card className="bg-[#73e28a]/10 border border-[#73e28a]/30 p-8 max-w-3xl mx-auto">
            <h3 className="text-white font-bold text-xl mb-3">Why our pricing is lower than traditional dev shops</h3>
            <p className="text-slate-300 leading-relaxed">
              We use AI + modern platforms to accelerate every phase: scaffolding, testing, deployment. 
              You get senior-level brains at AI-accelerated speed, with clear pricing and no hourly billing drama.
            </p>
          </Card>
        </div>
      </Section>

      {/* FAQs */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={15} />
        
        <div className="relative z-10">
          <div className="text-center mb-12">
            <SectionLabel text="FAQ" />
            <h2 className="text-4xl font-bold text-white mb-4">Common Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
             {faqs.map((faq, i) => (
               <Card key={i} className="p-6 bg-slate-900/80 border-b border-slate-800">
                 <h4 className="text-lg font-semibold text-white mb-2">{faq.q}</h4>
                 <p className="text-slate-400">{faq.a}</p>
               </Card>
             ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-24 bg-slate-900/30 relative overflow-hidden">
        <GlowingOrb position="center" size="500px" opacity={0.1} />
        
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            Let's discuss your project and find the right plan for you.
          </p>
          <Link to={createPageUrl('Contact')}>
            <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-10 text-lg">
              Get Your Quote <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}