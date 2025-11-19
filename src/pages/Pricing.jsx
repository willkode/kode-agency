import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import { Check } from 'lucide-react';

export default function PricingPage() {
  return (
    <div>
      <Section className="pt-32 pb-16 text-center">
        <div className="inline-block px-4 py-2 bg-[#73e28a]/10 border border-[#73e28a]/30 rounded-full text-[#73e28a] text-sm font-semibold mb-6">
          Pricing
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          No hidden fees.<br />
          No <span className="text-[#73e28a]">endless hourly billing</span>.
        </h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          Choose the engagement model that fits your stage and budget. All prices reflect our AI-accelerated efficiency.
        </p>
      </Section>

      <Section>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Model 1 */}
          <Card className="flex flex-col p-8 border-t-4 border-t-[#73e28a]">
            <h3 className="text-2xl font-bold text-white mb-2">MVP Sprint</h3>
            <p className="text-slate-400 text-sm mb-6">For founders validating an idea fast.</p>
            <div className="mb-6">
              <div className="text-4xl font-bold text-white mb-1">$8k-$15k</div>
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

          {/* Model 2 */}
          <Card className="flex flex-col p-8 border-t-4 border-t-[#73e28a] relative bg-slate-800/50 transform md:-translate-y-4 shadow-2xl shadow-[#73e28a]/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#73e28a] text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Launch Package</h3>
            <p className="text-slate-400 text-sm mb-6">For production-ready SaaS apps.</p>
            <div className="mb-6">
              <div className="text-4xl font-bold text-white mb-1">$20k-$50k</div>
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

          {/* Model 3 */}
          <Card className="flex flex-col p-8 border-t-4 border-t-violet-500">
            <h3 className="text-2xl font-bold text-white mb-2">Product Partner</h3>
            <p className="text-slate-400 text-sm mb-6">For ongoing evolution & growth.</p>
            <div className="mb-6">
              <div className="text-4xl font-bold text-white mb-1">$5k-$15k<span className="text-xl text-slate-500 font-normal">/mo</span></div>
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
      </Section>
      
      <Section className="bg-slate-900/30 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">What affects pricing?</h2>
        <p className="text-slate-400 mb-12 max-w-2xl mx-auto">Every project is different. Here's what moves the needle:</p>
        <div className="grid md:grid-cols-4 gap-6 text-left max-w-6xl mx-auto">
           <Card className="p-6">
             <div className="text-[#73e28a] font-bold text-lg mb-3">Complexity</div>
             <p className="text-sm text-slate-400">Simple CRUD vs. complex algorithms, workflows, and business logic.</p>
           </Card>
           <Card className="p-6">
             <div className="text-[#73e28a] font-bold text-lg mb-3">User Roles</div>
             <p className="text-sm text-slate-400">Single user type vs. multi-tenant with admin/manager/user roles.</p>
           </Card>
           <Card className="p-6">
             <div className="text-[#73e28a] font-bold text-lg mb-3">Integrations</div>
             <p className="text-sm text-slate-400">Standalone app vs. connecting to multiple external APIs and services.</p>
           </Card>
           <Card className="p-6">
             <div className="text-[#73e28a] font-bold text-lg mb-3">Design</div>
             <p className="text-sm text-slate-400">Standard UI components vs. fully custom bespoke design system.</p>
           </Card>
        </div>
        
        <div className="mt-16 bg-[#73e28a]/10 border border-[#73e28a]/30 rounded-xl p-8 max-w-3xl mx-auto">
          <h3 className="text-white font-bold text-xl mb-3">Why our pricing is lower than traditional dev shops</h3>
          <p className="text-slate-300 leading-relaxed">
            We use AI + modern platforms to accelerate every phase: scaffolding, testing, deployment. 
            You get senior-level brains at AI-accelerated speed, with clear pricing and no hourly billing drama.
          </p>
        </div>
      </Section>

      <Section>
         <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Common Questions</h2>
         </div>
         <div className="max-w-3xl mx-auto space-y-6">
            <div className="border-b border-slate-800 pb-6">
               <h4 className="text-lg font-semibold text-white mb-2">Can you work with my existing app?</h4>
               <p className="text-slate-400">Yes, if it's built on modern tech stacks or one of our supported platforms. We'll do a quick audit first.</p>
            </div>
            <div className="border-b border-slate-800 pb-6">
               <h4 className="text-lg font-semibold text-white mb-2">Do you offer white-label services for agencies?</h4>
               <p className="text-slate-400">Absolutely. We work behind the scenes for several design and marketing agencies.</p>
            </div>
            <div className="border-b border-slate-800 pb-6">
               <h4 className="text-lg font-semibold text-white mb-2">What if I don't have clear specs yet?</h4>
               <p className="text-slate-400">That's fine! Our Discovery & Scoping phase is designed exactly for that.</p>
            </div>
         </div>
      </Section>
    </div>
  );
}