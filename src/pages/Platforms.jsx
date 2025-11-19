import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import { Check, ExternalLink } from 'lucide-react';

export default function PlatformsPage() {
  return (
    <div>
      <Section className="pt-32 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Platforms We Build On</h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          We don't just write code; we architect solutions using the best tools for your specific needs.
        </p>
      </Section>

      <Section>
        <div className="space-y-12">
          {/* Base44 */}
          <Card className="p-8 border-indigo-500/30 bg-indigo-950/10">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="text-4xl font-bold text-white mb-4">Base44</div>
                <div className="inline-block bg-indigo-600/20 text-indigo-300 px-3 py-1 rounded-full text-sm font-medium mb-6">
                  Best for SaaS & Internal Tools
                </div>
                <p className="text-slate-300 mb-6">
                  Our go-to platform for building robust, scalable web applications with built-in backend, database, and authentication.
                </p>
                <div className="space-y-2">
                   <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">We Handle:</div>
                   <ul className="space-y-1 text-slate-400">
                     <li>• Data Modeling & Schema</li>
                     <li>• Frontend Logic & UI</li>
                     <li>• Integrations & Functions</li>
                   </ul>
                </div>
              </div>
              <div className="md:w-2/3 grid md:grid-cols-2 gap-6">
                 <div className="bg-slate-950 p-6 rounded-lg border border-slate-800">
                    <h4 className="text-white font-bold mb-3">Why we love it</h4>
                    <p className="text-slate-400 text-sm">Base44 provides an incredible balance of speed and flexibility. It handles the boring infrastructure stuff so we can focus on your unique business logic.</p>
                 </div>
                 <div className="bg-slate-950 p-6 rounded-lg border border-slate-800">
                    <h4 className="text-white font-bold mb-3">Perfect for</h4>
                    <ul className="text-slate-400 text-sm space-y-2">
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5" /> Full-featured SaaS apps</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5" /> Complex internal dashboards</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5" /> Data-heavy applications</li>
                    </ul>
                 </div>
              </div>
            </div>
          </Card>

          {/* Lovable */}
          <Card className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="text-4xl font-bold text-white mb-4">Lovable</div>
                <div className="inline-block bg-pink-600/20 text-pink-300 px-3 py-1 rounded-full text-sm font-medium mb-6">
                  Best for Rapid Prototyping
                </div>
                <p className="text-slate-300 mb-6">
                  The fastest way to go from idea to a working web app using natural language and AI.
                </p>
                <div className="space-y-2">
                   <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">We Handle:</div>
                   <ul className="space-y-1 text-slate-400">
                     <li>• Prompt Engineering</li>
                     <li>• Code Cleanup & Refinement</li>
                     <li>• Migration to Production</li>
                   </ul>
                </div>
              </div>
              <div className="md:w-2/3 grid md:grid-cols-2 gap-6">
                 <div className="bg-slate-950 p-6 rounded-lg border border-slate-800">
                    <h4 className="text-white font-bold mb-3">Why we love it</h4>
                    <p className="text-slate-400 text-sm">It allows us to visualize ideas instantly. We often use Lovable for the initial V0 to get feedback before building the scalable V1.</p>
                 </div>
                 <div className="bg-slate-950 p-6 rounded-lg border border-slate-800">
                    <h4 className="text-white font-bold mb-3">Perfect for</h4>
                    <ul className="text-slate-400 text-sm space-y-2">
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5" /> Validating ideas overnight</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5" /> Simple tools & utilities</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5" /> Visual concepting</li>
                    </ul>
                 </div>
              </div>
            </div>
          </Card>

          {/* Replit */}
          <Card className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="text-4xl font-bold text-white mb-4">Replit</div>
                <div className="inline-block bg-orange-600/20 text-orange-300 px-3 py-1 rounded-full text-sm font-medium mb-6">
                  Best for Cloud-Native Code
                </div>
                <p className="text-slate-300 mb-6">
                  A powerful collaborative IDE and deployment platform that speeds up coding and hosting.
                </p>
                <div className="space-y-2">
                   <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">We Handle:</div>
                   <ul className="space-y-1 text-slate-400">
                     <li>• Project Architecture</li>
                     <li>• Backend Development</li>
                     <li>• Deployment & Scaling</li>
                   </ul>
                </div>
              </div>
              <div className="md:w-2/3 grid md:grid-cols-2 gap-6">
                 <div className="bg-slate-950 p-6 rounded-lg border border-slate-800">
                    <h4 className="text-white font-bold mb-3">Why we love it</h4>
                    <p className="text-slate-400 text-sm">It removes the headache of local environments and deployment pipelines. We can code, ship, and iterate faster.</p>
                 </div>
                 <div className="bg-slate-950 p-6 rounded-lg border border-slate-800">
                    <h4 className="text-white font-bold mb-3">Perfect for</h4>
                    <ul className="text-slate-400 text-sm space-y-2">
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5" /> Python/Node.js scripts</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5" /> Bots & Automation</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5" /> Microservices</li>
                    </ul>
                 </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-20 text-center">
           <h3 className="text-2xl font-bold text-white mb-6">Not sure which one you need?</h3>
           <p className="text-slate-400 mb-8">That's our job. We'll analyze your requirements and recommend the best path.</p>
           <Link to={createPageUrl('Contact')}>
             <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-8">
               Schedule a Platform Fit Call
             </Button>
           </Link>
        </div>
      </Section>
    </div>
  );
}