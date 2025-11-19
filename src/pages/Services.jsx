import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import { ArrowRight, Check, Code, Database, Layout, Zap, Shield, Smartphone, Globe, Settings } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div>
      <Section className="bg-slate-900/50 pt-32 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Services</h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          We combine the speed of modern low-code platforms with the power of custom engineering to build software that scales.
        </p>
      </Section>

      <Section>
        <div className="space-y-24">
          {/* Service 1 */}
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Platform Builds</h2>
              <p className="text-slate-400 mb-6 text-lg">
                Rapid application development using Base44, Lovable, and Replit. Perfect for MVPs, internal tools, and dashboards.
              </p>
              <ul className="space-y-3 mb-8">
                {["App design & data modeling", "Automation & workflows", "Role-based permissions", "Instant deployment"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <Check className="w-5 h-5 text-indigo-500" /> {item}
                  </li>
                ))}
              </ul>
              <Link to={createPageUrl('Platforms')}>
                <Button variant="outline" className="border-slate-700 text-slate-300">
                  See supported platforms
                </Button>
              </Link>
            </div>
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 flex items-center justify-center">
               {/* Placeholder for graphic */}
               <Layout className="w-32 h-32 text-slate-800" />
            </div>
          </div>

          {/* Service 2 */}
          <div className="grid md:grid-cols-2 gap-12 md:flex-row-reverse">
            <div className="md:order-2">
              <div className="w-12 h-12 bg-violet-600/20 text-violet-400 rounded-lg flex items-center justify-center mb-6">
                <Code className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Custom Engineering</h2>
              <p className="text-slate-400 mb-6 text-lg">
                Full-stack custom development for complex requirements, mobile apps, and high-performance systems.
              </p>
              <ul className="space-y-3 mb-8">
                {["React / Next.js / TypeScript", "Native Mobile Apps", "Complex Backend Logic", "Scalable Infrastructure"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <Check className="w-5 h-5 text-violet-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:order-1 bg-slate-900 rounded-xl border border-slate-800 p-8 flex items-center justify-center">
               <Smartphone className="w-32 h-32 text-slate-800" />
            </div>
          </div>

          {/* Service 3 */}
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center mb-6">
                <Database className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Integrations & Automation</h2>
              <p className="text-slate-400 mb-6 text-lg">
                Connect your tools and automate repetitive tasks. We act as the "glue" between your favorite SaaS platforms.
              </p>
              <ul className="space-y-3 mb-8">
                {["API Integration", "Data Sync & Migration", "Payment Gateways (Stripe)", "Email & SMS Automation"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <Check className="w-5 h-5 text-blue-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 flex items-center justify-center">
               <Settings className="w-32 h-32 text-slate-800" />
            </div>
          </div>
        </div>
      </Section>
      
      <Section className="bg-indigo-950/20 py-24 text-center">
         <h2 className="text-3xl font-bold text-white mb-8">Engagement Models</h2>
         <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-left">
              <h3 className="text-xl font-bold text-white mb-2">Fixed Scope</h3>
              <p className="text-slate-400 text-sm mb-4">Best for defined projects.</p>
              <ul className="space-y-2 text-sm text-slate-300 mb-6">
                 <li>• Clear deliverables</li>
                 <li>• Fixed timeline</li>
                 <li>• One-time cost</li>
              </ul>
            </Card>
            <Card className="text-left border-indigo-500/50 bg-indigo-900/10">
              <h3 className="text-xl font-bold text-white mb-2">Product Partner</h3>
              <p className="text-slate-400 text-sm mb-4">Best for ongoing growth.</p>
              <ul className="space-y-2 text-sm text-slate-300 mb-6">
                 <li>• Monthly retainer</li>
                 <li>• Flexible roadmap</li>
                 <li>• Continuous shipping</li>
              </ul>
            </Card>
            <Card className="text-left">
              <h3 className="text-xl font-bold text-white mb-2">Quick Launch</h3>
              <p className="text-slate-400 text-sm mb-4">Best for simple MVPs.</p>
              <ul className="space-y-2 text-sm text-slate-300 mb-6">
                 <li>• 2-4 week timeline</li>
                 <li>• Core features only</li>
                 <li>• Budget friendly</li>
              </ul>
            </Card>
         </div>
         <div className="mt-12">
            <Link to={createPageUrl('Pricing')}>
               <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">View Pricing Details</Button>
            </Link>
         </div>
      </Section>
    </div>
  );
}