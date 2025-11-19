import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import { ArrowRight, Sparkles, Target, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-slate-950 text-white">
      {/* Hero */}
      <Section className="pt-32 pb-16 text-center">
        <div className="inline-block px-4 py-2 bg-[#73e28a]/10 border border-[#73e28a]/30 rounded-full text-[#73e28a] text-sm font-semibold mb-6">
          About Kode Agency
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          The marketer who<br />
          <span className="text-[#73e28a]">learned to code</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          30 years of marketing + full-stack development + AI = a product studio that thinks like a CMO and builds like a dev.
        </p>
      </Section>

      {/* Will Kode Story */}
      <Section className="py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border-4 border-[#73e28a]/20">
                <img 
                  src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop" 
                  alt="Will Kode" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#73e28a] text-black px-8 py-4 rounded-lg font-bold shadow-lg text-xl">
                30+ Years
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Hi, I'm Will Kode
              </h2>
              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>
                  I've spent three decades in the trenches of marketing, SEO, and conversion optimization — helping brands across restoration, mobility, home services, and SaaS grow their revenue.
                </p>
                <p>
                  But I kept hitting the same wall: <strong className="text-white">traditional dev was too slow, too expensive, and often misaligned with growth.</strong>
                </p>
                <p>
                  So I went back to full-stack development. Then, over the past year, I dove deep into AI-native product building — using tools like Base44, Lovable, and custom AI agents to accelerate every part of the process.
                </p>
                <p>
                  Now I build the software myself, combining my marketing brain with modern development workflows to ship apps that don't just work — <strong className="text-[#73e28a]">they convert and grow</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* What I Learned */}
          <div className="bg-slate-900 rounded-2xl p-12 border border-slate-800 mb-20">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">What I learned along the way</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#73e28a]/10 flex items-center justify-center text-[#73e28a] mx-auto mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white mb-3">Traditional dev is broken</h4>
                <p className="text-slate-400 text-sm">
                  6-month timelines, hourly billing, and endless revisions are a terrible model for founders who need to move fast.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 mx-auto mb-4">
                  <Zap className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white mb-3">AI changes the economics</h4>
                <p className="text-slate-400 text-sm">
                  AI tools like Base44 and Lovable let us generate scaffolds, test ideas, and iterate at a pace that was impossible before.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mx-auto mb-4">
                  <Target className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white mb-3">Strategy matters more than code</h4>
                <p className="text-slate-400 text-sm">
                  Most dev shops don't understand funnels, CAC, LTV, or SEO. I do. Every build starts with strategy, not just features.
                </p>
              </div>
            </div>
          </div>

          {/* Why Kode Agency Exists */}
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Why Kode Agency exists
            </h3>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
              To give founders, agencies, and teams <strong className="text-white">"a product studio that thinks like a CMO and builds like a dev."</strong> Fast, focused, and built to convert — not just to exist.
            </p>
          </div>

          <Card className="p-12 bg-gradient-to-br from-slate-900 to-slate-800 border-[#73e28a]/30">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#73e28a] mb-2">80%</div>
                <p className="text-slate-300 font-medium">Faster builds</p>
                <p className="text-slate-500 text-sm mt-2">Using AI + modern platforms</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#73e28a] mb-2">70%</div>
                <p className="text-slate-300 font-medium">Lower costs</p>
                <p className="text-slate-500 text-sm mt-2">Compared to traditional dev</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#73e28a] mb-2">4–8</div>
                <p className="text-slate-300 font-medium">Weeks to MVP</p>
                <p className="text-slate-500 text-sm mt-2">From idea to production</p>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* Philosophy */}
      <Section className="py-20 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            My philosophy
          </h3>
          <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
            <p>
              Software should be built <strong className="text-white">fast, lean, and conversion-first</strong>. 
            </p>
            <p>
              AI tools are power tools — they help us move faster, but they don't replace human judgment, UX thinking, or strategic clarity.
            </p>
            <p>
              Every project should have a clear goal: sign-ups, demos, revenue, automation. If we can't measure it, we shouldn't build it.
            </p>
            <p className="text-[#73e28a] font-semibold text-xl">
              "Ship fast. Measure everything. Optimize relentlessly."
            </p>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Want to work together?
        </h2>
        <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
          Whether you have an idea or an existing app, let's talk about how we can move faster.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={createPageUrl('Contact')}>
            <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-10 text-lg">
              Start a project <ArrowRight className="ml-2" />
            </Button>
          </Link>
          <Link to={createPageUrl('Services')}>
            <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 h-14 px-10 text-lg">
              See what we build
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}