import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import GridBackground from '@/components/ui-custom/GridBackground';
import FloatingPixels from '@/components/ui-custom/FloatingPixels';
import GlowingOrb from '@/components/ui-custom/GlowingOrb';

import SectionLabel from '@/components/ui-custom/SectionLabel';
import { ArrowRight, ArrowUpRight, Rocket, Bot, Search, Target, TrendingUp, CheckCircle, Play, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
  {
    headline: "30 Years of Expertise. AI-Powered Speed.",
    subhead: "We've generated $100M+ in client revenue. Now we build 10x faster with AI. Your unfair advantage starts here.",
    bullets: ["Battle-Tested Marketing + Cutting-Edge Dev", "From Zero to Revenue in Weeks, Not Months", "Fixed Pricing. No Surprises. Real Results."]
  },
  {
    headline: "Your MVP. Live in 4 Weeks.",
    subhead: "Stop burning runway on slow agencies. We've launched 200+ products. Yours could be next.",
    bullets: ["Production-Ready, Not Just Prototypes", "Built to Scale From Day One", "AI-Accelerated Without Cutting Corners"]
  },
  {
    headline: "Traffic is Vanity. Revenue is Sanity.",
    subhead: "We don't chase rankings—we engineer profitable customer acquisition systems. 30 years of conversion science meets AI.",
    bullets: ["SEO That Drives Revenue, Not Just Traffic", "Paid Ads with 3-10x ROAS Track Record", "Conversion Funnels That Actually Convert"]
  },
  {
    headline: "Automate Everything. Outpace Everyone.",
    subhead: "Your competitors are using AI wrong. We build systems that compound your advantage while you sleep.",
    bullets: ["Custom AI Agents That Work 24/7", "Workflow Automations That Save 40+ Hours/Week", "Integrations That Eliminate Busywork"]
  },
  {
    headline: "Design That Sells. Not Just Looks Pretty.",
    subhead: "Every pixel is a persuasion trigger. We've optimized thousands of interfaces. We know what converts.",
    bullets: ["Psychology-Driven UI/UX Design", "Brands That Command Premium Prices", "Websites That Turn Visitors Into Buyers"]
  }];


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const services = [
  { icon: Rocket, title: "MVP Development", desc: "Ship in weeks, not months. 200+ products launched. Yours is next." },
  { icon: Bot, title: "AI Systems", desc: "Automate the repetitive. Amplify the profitable. Work smarter." },
  { icon: Search, title: "SEO & Content", desc: "Page 1 rankings that drive revenue, not just vanity metrics." },
  { icon: Target, title: "Paid Ads & CRO", desc: "Turn ad spend into predictable profit. 3-10x ROAS guaranteed." }];


  const clients = [
  "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=50&fit=crop&q=80"];


  return (
    <div className="bg-slate-950 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <GridBackground />
          <FloatingPixels count={30} />
        </div>

        {/* Decorative Globe */}
        <div className="absolute top-32 left-20 hidden lg:block">
          <div className="w-28 h-28 rounded-full border border-slate-700/50" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '10px 10px'
          }}></div>
        </div>



        {/* Diagonal Lines */}
        <div className="absolute top-1/2 -translate-y-1/2 right-10 hidden lg:flex gap-1">
          {[...Array(15)].map((_, i) =>
          <div
            key={i}
            className="w-0.5 bg-gradient-to-b from-[#73e28a] to-transparent transform -skew-x-12"
            style={{ height: `${100 + i * 8}px`, opacity: 0.7 - i * 0.04 }}>
          </div>
          )}
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mb-16">
            <div className="min-h-[320px] md:min-h-[280px]">
              <h1 className="text-white mr-40 mb-6 ml-1 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl transition-all duration-500">
                {heroSlides[currentSlide].headline}
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl transition-all duration-500">
                {heroSlides[currentSlide].subhead}
              </p>
              
              <div className="flex flex-col gap-3 mb-10">
                {heroSlides[currentSlide].bullets.map((bullet, i) =>
                <div key={i} className="flex items-center gap-3 text-slate-200">
                    <ArrowRight className="w-4 h-4 text-[#73e28a] flex-shrink-0" />
                    <span>{bullet}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <Link to={createPageUrl('Contact')}>
                <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-8 text-lg rounded-lg">
                  Let's Build Together
                </Button>
              </Link>
              <span className="text-slate-400 text-sm">Your idea. Our speed. Real results.</span>
            </div>

            {/* Slider Arrows */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                className="w-12 h-12 rounded-full border border-slate-600 flex items-center justify-center text-slate-400 hover:border-[#73e28a] hover:text-[#73e28a] transition-colors">

                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                className="w-12 h-12 rounded-full border border-slate-600 flex items-center justify-center text-slate-400 hover:border-[#73e28a] hover:text-[#73e28a] transition-colors">

                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="text-slate-500 text-sm ml-2">0{currentSlide + 1} / 05</span>
            </div>
          </div>
        </div>



        {/* Slide indicators with text */}
        <div className="absolute left-8 top-1/3 hidden lg:flex flex-col items-center gap-4">
          <span className="text-slate-500 text-sm">0{currentSlide + 1}</span>
          <div className="flex flex-col gap-2">
            {heroSlides.map((_, i) =>
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-[#73e28a] scale-125' : 'border border-slate-600 hover:border-[#73e28a]'}`} />

            )}
          </div>
          <span className="text-slate-500 text-sm">05</span>
        </div>

        {/* Next Slide Preview */}
        <div className="absolute right-[15%] top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center text-center max-w-[220px]">
          <h4 className="text-[#73e28a] font-bold text-lg mb-2 transition-all duration-500">
            {heroSlides[(currentSlide + 1) % heroSlides.length].headline.split(' ').slice(0, 3).join(' ')}
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed transition-all duration-500">
            {heroSlides[(currentSlide + 1) % heroSlides.length].subhead.slice(0, 80)}...
          </p>
        </div>
      </section>



      {/* About Section */}
      <Section className="py-24 relative overflow-hidden">
        <GlowingOrb position="top-right" size="400px" opacity={0.1} />
        
        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=500&fit=crop"
                  alt="Team"
                  className="rounded-2xl w-full h-64 object-cover" />

                <img
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop"
                  alt="Work"
                  className="rounded-2xl w-full h-48 object-cover" />

              </div>
              <div className="pt-12">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=600&fit=crop"
                  alt="Collaboration"
                  className="rounded-2xl w-full h-80 object-cover" />

              </div>
            </div>
            {/* Play button overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-20 h-20 rounded-full bg-[#73e28a] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-[#73e28a]/30">
                <Play className="w-8 h-8 text-black ml-1" fill="black" />
              </div>
            </div>
          </div>

          <div>
            <SectionLabel text="Why We're Different" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              30 Years of Wins.<br />
              <span className="text-[#73e28a]">Now Supercharged by AI.</span>
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              Most agencies are either old-school marketers who can't code, or young devs who don't understand business. We're the rare breed that's mastered both—and now we move 10x faster with AI.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              $100M+ in revenue generated. 200+ products launched. We've seen what works, what fails, and exactly how to shortcut your path to success. Stop gambling. Start scaling.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {['App Development', 'AI Systems', 'SEO Services', 'Paid Ads', 'UI/UX Design', 'SaaS Platforms'].map((skill, i) =>
              <span key={i} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-300 hover:border-[#73e28a]/50 hover:text-[#73e28a] transition-colors cursor-default">
                  {skill}
                </span>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Services Section */}
      <Section className="py-24 bg-slate-900/30 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={15} />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
            <div>
              <SectionLabel text="Best Of Service" />
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                All Professional<br />
                Solutions & Services
              </h2>
            </div>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) =>
            <Card key={i} className="p-8 text-center group hover:border-[#73e28a]/50 bg-slate-900/80">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#73e28a] group-hover:bg-[#73e28a] group-hover:text-black transition-all duration-300">
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{service.desc}</p>
              </Card>
            )}
          </div>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section className="py-24 relative overflow-hidden">
        <GlowingOrb position="bottom-left" size="350px" color="#5dbb72" opacity={0.1} />
        
        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <SectionLabel text="The Kode Advantage" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why the Smart Money<br />
              <span className="text-[#73e28a]">Chooses Us</span>
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8">
              You could hire a dev shop that doesn't understand marketing. Or a marketing agency that can't build. Or waste months managing both. Or you could just win.
            </p>

            <div className="space-y-6">
              {[
              { num: "01", title: "Speed That Compounds", desc: "Ship in weeks while competitors take months. First-mover advantage is real." },
              { num: "02", title: "30 Years of Conversion Science", desc: "Every feature we build is designed to drive revenue. We know what sells." },
              { num: "03", title: "Fixed Price. Fixed Timeline.", desc: "Know exactly what you'll pay and when you'll launch. Zero surprises." }].
              map((item, i) =>
              <div key={i} className="flex gap-6 p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-[#73e28a]/30 transition-colors">
                  <div className="text-[#73e28a] font-bold text-xl">{item.num}</div>
                  <div>
                    <h4 className="text-white font-bold mb-2">{item.title}</h4>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=700&fit=crop"
              alt="Team working"
              className="rounded-2xl w-full" />

            <div className="absolute -bottom-6 -left-6 bg-[#73e28a] text-black p-6 rounded-xl">
              <div className="text-4xl font-bold">30+</div>
              <div className="text-sm font-medium">Years Experience</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Process Section */}
      <Section className="py-24 bg-slate-900/30 relative overflow-hidden">
        <GridBackground />
        
        <div className="relative z-10 text-center mb-16">
          <SectionLabel text="Proven Process" />
          <h2 className="text-4xl md:text-5xl font-bold text-white">From Zero to Revenue. Fast.</h2>
          <p className="text-slate-300 mt-4">The same system that's launched 200+ successful products.</p>
        </div>

        <div className="relative z-10 flex flex-wrap justify-center gap-8">
          {[
          { num: "01", title: "Discover", desc: "Find the fastest path to revenue" },
          { num: "02", title: "Scope", desc: "Lock in features, timeline & price" },
          { num: "03", title: "Sprint", desc: "Build at 10x speed with AI" },
          { num: "04", title: "Launch", desc: "Go live with marketing ready" },
          { num: "05", title: "Scale", desc: "Compound your wins" }].
          map((step, i) =>
          <div key={i} className="text-center group">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-[#73e28a] flex items-center justify-center text-[#73e28a] font-bold text-xl group-hover:bg-[#73e28a] group-hover:text-black transition-all">
                {step.num}
              </div>
              <h4 className="text-white font-bold mb-2">{step.title}</h4>
              <p className="text-slate-400 text-sm max-w-[140px]">{step.desc}</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12 relative z-10">
          <Link to={createPageUrl('Process')}>
            <Button variant="outline" className="border-slate-600 bg-slate-900/80 text-white hover:bg-slate-800 hover:border-slate-500">
              See Full Process <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="py-24 relative overflow-hidden">
        <GlowingOrb position="center" size="500px" opacity={0.1} />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your Competitors Won't Wait.<br />Neither Should You.
          </h2>
          <p className="text-slate-300 text-lg mb-10">
            Every day you delay is a day they're gaining ground. Let's change that. Free strategy call—no pitch, just answers.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link to={createPageUrl('Contact')} className="block">
              <Card className="p-8 hover:border-[#73e28a]/50 group cursor-pointer h-full bg-slate-900/80">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#73e28a] transition-colors">I have an idea</h3>
                <p className="text-slate-300 text-sm mb-4">Let's validate it and ship in weeks</p>
                <ArrowRight className="w-5 h-5 text-[#73e28a] group-hover:translate-x-1 transition-transform" />
              </Card>
            </Link>
            <Link to={createPageUrl('Contact')} className="block">
              <Card className="p-8 hover:border-[#73e28a]/50 group cursor-pointer h-full bg-slate-900/80">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#73e28a] transition-colors">I need to scale</h3>
                <p className="text-slate-300 text-sm mb-4">Let's 10x your growth engine</p>
                <ArrowRight className="w-5 h-5 text-[#73e28a] group-hover:translate-x-1 transition-transform" />
              </Card>
            </Link>
          </div>
        </div>
      </Section>


    </div>);

}