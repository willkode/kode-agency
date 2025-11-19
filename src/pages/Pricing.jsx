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
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Transparent Engagement Models</h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          We don't do hidden fees. Choose the model that fits your stage and budget.
        </p>
      </Section>

      <Section>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Model 1 */}
          <Card className="flex flex-col p-8 border-t-4 border-t-indigo-500">
             <h3 className="text-2xl font-bold text-white mb-2">Quick Build / MVP</h3>
             <p className="text-slate-400 text-sm mb-6">For founders validating an idea.</p>
             <div className="text-3xl font-bold text-white mb-6">Starts at $5k</div>
             
             <ul className="space-y-4 mb-8 flex-grow text-slate-300 text-sm">
               <li className="flex gap-3"><Check className="w-5 h-5 text-indigo-500 flex-shrink-0" /> Scope workshop</li>
               <li className="flex gap-3"><Check className="w-5 h-5 text-indigo-500 flex-shrink-0" /> Core feature set</li>
               <li className="flex gap-3"><Check className="w-5 h-5 text-indigo-500 flex-shrink-0" /> 2-4 weeks delivery</li>
               <li className="flex gap-3"><Check className="w-5 h-5 text-indigo-500 flex-shrink-0" /> Platform deployment</li>
             </ul>
             
             <Link to={createPageUrl('Contact')} className="w-full">
               <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">Get Started</Button>
             </Link>
          </Card>

          {/* Model 2 */}
          <Card className="flex flex-col p-8 border-t-4 border-t-violet-500 relative bg-slate-800/30 transform md:-translate-y-4 shadow-2xl">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
               Most Popular
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Fixed Project</h3>
             <p className="text-slate-400 text-sm mb-6">For defined apps and tools.</p>
             <div className="text-3xl font-bold text-white mb-6">Custom Quote</div>
             
             <ul className="space-y-4 mb-8 flex-grow text-slate-300 text-sm">
               <li className="flex gap-3"><Check className="w-5 h-5 text-violet-500 flex-shrink-0" /> Full architecture & design</li>
               <li className="flex gap-3"><Check className="w-5 h-5 text-violet-500 flex-shrink-0" /> Production-ready code</li>
               <li className="flex gap-3"><Check className="w-5 h-5 text-violet-500 flex-shrink-0" /> Admin dashboards</li>
               <li className="flex gap-3"><Check className="w-5 h-5 text-violet-500 flex-shrink-0" /> Post-launch support</li>
             </ul>
             
             <Link to={createPageUrl('Contact')} className="w-full">
               <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">Request Quote</Button>
             </Link>
          </Card>

          {/* Model 3 */}
          <Card className="flex flex-col p-8 border-t-4 border-t-blue-500">
             <h3 className="text-2xl font-bold text-white mb-2">Product Partner</h3>
             <p className="text-slate-400 text-sm mb-6">For ongoing development.</p>
             <div className="text-3xl font-bold text-white mb-6">From $3k<span className="text-lg text-slate-500 font-normal">/mo</span></div>
             
             <ul className="space-y-4 mb-8 flex-grow text-slate-300 text-sm">
               <li className="flex gap-3"><Check className="w-5 h-5 text-blue-500 flex-shrink-0" /> Dedicated hours/month</li>
               <li className="flex gap-3"><Check className="w-5 h-5 text-blue-500 flex-shrink-0" /> Roadmap planning</li>
               <li className="flex gap-3"><Check className="w-5 h-5 text-blue-500 flex-shrink-0" /> Priority bug fixes</li>
               <li className="flex gap-3"><Check className="w-5 h-5 text-blue-500 flex-shrink-0" /> Cancel anytime</li>
             </ul>
             
             <Link to={createPageUrl('Contact')} className="w-full">
               <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">Let's Talk</Button>
             </Link>
          </Card>
        </div>
      </Section>
      
      <Section className="bg-slate-900/50 py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-8">What affects pricing?</h2>
        <div className="grid md:grid-cols-4 gap-6 text-left max-w-5xl mx-auto">
           <div className="bg-slate-950 p-5 rounded border border-slate-800">
             <div className="font-bold text-white mb-2">Complexity</div>
             <p className="text-xs text-slate-400">Simple logic vs. complex algorithms and workflows.</p>
           </div>
           <div className="bg-slate-950 p-5 rounded border border-slate-800">
             <div className="font-bold text-white mb-2">User Roles</div>
             <p className="text-xs text-slate-400">Single user type vs. multi-tenant admin/user/manager roles.</p>
           </div>
           <div className="bg-slate-950 p-5 rounded border border-slate-800">
             <div className="font-bold text-white mb-2">Integrations</div>
             <p className="text-xs text-slate-400">Standalone app vs. connecting to 5+ external APIs.</p>
           </div>
           <div className="bg-slate-950 p-5 rounded border border-slate-800">
             <div className="font-bold text-white mb-2">Design</div>
             <p className="text-xs text-slate-400">Standard UI components vs. fully custom bespoke design.</p>
           </div>
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