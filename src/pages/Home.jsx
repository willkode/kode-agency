import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import GridBackground from '@/components/ui-custom/GridBackground';
import FloatingPixels from '@/components/ui-custom/FloatingPixels';
import GlowingOrb from '@/components/ui-custom/GlowingOrb';
import RotatingBadge from '@/components/ui-custom/RotatingBadge';
import SectionLabel from '@/components/ui-custom/SectionLabel';
import { ArrowRight, ArrowUpRight, Zap, Target, Sparkles, Layers, Code, TrendingUp, CheckCircle, Play } from 'lucide-react';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    { 
      headline: "We Build Apps 80% Faster With AI",
      subhead: "Beautiful, production-ready software. Built on platforms like Base44, Lovable, Replit, and full custom stacks.",
      bullets: ["Production-Ready MVPs in Weeks", "Conversion-First Design", "Native, Web, and Mobile Apps"],
    },
    { 
      headline: "Your Product. Built Faster With AI.",
      subhead: "Turn your idea into a polished, market-ready product without waiting months.",
      bullets: ["AI-Accelerated Development", "Modern UI/UX + Conversion Focus", "MVPs, SaaS Platforms, and Custom Tools"],
    },
    { 
      headline: "Launch a Complete MVP in 1–4 Weeks",
      subhead: "We combine design, development, and AI automation to build at incredible speed.",
      bullets: ["Fixed Pricing. Clear Scope.", "Cross-Platform Apps & SaaS Systems", "Built With Base44, Lovable, Replit & Custom Code"],
    },
    { 
      headline: "A Modern Agency for Modern Products",
      subhead: "AI-native workflows let us deliver higher quality software with less friction.",
      bullets: ["Clean Architecture & Scalable Code", "Pixel-Perfect UI with Conversion Insights", "AI Integration for Any App"],
    },
    { 
      headline: "Get Custom Software Without the Slowdowns",
      subhead: "We handle everything—design, development, AI systems, and integrations.",
      bullets: ["Native, Web, and Mobile Development", "Enterprise-Ready Features", "Reliable Support After Launch"],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    { icon: Zap, title: "AI MVP Sprints", desc: "From zero to live MVP in 4-8 weeks using AI-accelerated workflows." },
    { icon: Layers, title: "SaaS Development", desc: "Production-ready apps with auth, billing, and admin dashboards." },
    { icon: TrendingUp, title: "CRO Sites", desc: "Landing pages designed to convert visitors into customers." },
    { icon: Code, title: "Custom Integrations", desc: "Connect your app to any API, CRM, or third-party service." },
  ];

  const clients = [
    "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=50&fit=crop&q=80",
  ];

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

        {/* Rotating Badge */}
        <div className="absolute top-32 right-32 hidden lg:block">
          <RotatingBadge text="AI Product Studio" size={140} />
        </div>

        {/* Diagonal Lines */}
        <div className="absolute top-48 right-10 hidden lg:flex gap-1">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className="w-0.5 bg-gradient-to-b from-[#73e28a] to-transparent transform -skew-x-12"
              style={{ height: `${100 + i * 8}px`, opacity: 0.7 - i * 0.04 }}
            ></div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mb-16">
            <div className="min-h-[320px] md:min-h-[280px]">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 transition-all duration-500">
                {heroSlides[currentSlide].headline}
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl transition-all duration-500">
                {heroSlides[currentSlide].subhead}
              </p>
              
              <div className="flex flex-col gap-3 mb-10">
                {heroSlides[currentSlide].bullets.map((bullet, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-200">
                    <ArrowRight className="w-4 h-4 text-[#73e28a] flex-shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link to={createPageUrl('Contact')}>
                <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-8 text-lg rounded-lg">
                  Let's Build Together
                </Button>
              </Link>
              <span className="text-slate-400 text-sm">Your idea. Our speed. Real results.</span>
            </div>
          </div>
        </div>

        {/* Bottom Images */}
        <div className="relative h-[300px] md:h-[400px] mt-8">
          <div className="grid grid-cols-2 h-full">
            <div className="relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop" 
                alt="Team working" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            </div>
            <div className="relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop" 
                alt="Discussion" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              {/* Green corner accent */}
              <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-[#73e28a]"></div>
            </div>
          </div>
        </div>

        {/* Slide indicators with text */}
        <div className="absolute left-8 top-1/3 hidden lg:flex flex-col items-center gap-4">
          <span className="text-slate-500 text-sm">0{currentSlide + 1}</span>
          <div className="flex flex-col gap-2">
            {heroSlides.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-[#73e28a] scale-125' : 'border border-slate-600 hover:border-[#73e28a]'}`}
              />
            ))}
          </div>
          <span className="text-slate-500 text-sm">05</span>
        </div>

        {/* Side rotating text */}
        <div className="absolute left-4 top-1/3 -rotate-90 origin-left hidden xl:block">
          <span className="text-slate-600 text-xs tracking-[0.3em] uppercase transition-all duration-500">
            Slide {currentSlide + 1} of 5
          </span>
        </div>
      </section>

      {/* Client Logos Marquee */}
      <Section className="py-12 border-y border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-center gap-16 opacity-60">
          {['Base44', 'Lovable', 'React', 'Tailwind', 'Vercel', 'Supabase'].map((name, i) => (
            <div key={i} className="text-slate-400 font-bold text-xl tracking-wider">{name}</div>
          ))}
        </div>
      </Section>

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
                  className="rounded-2xl w-full h-64 object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop" 
                  alt="Work" 
                  className="rounded-2xl w-full h-48 object-cover"
                />
              </div>
              <div className="pt-12">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=600&fit=crop" 
                  alt="Collaboration" 
                  className="rounded-2xl w-full h-80 object-cover"
                />
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
            <SectionLabel text="About Company" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              We Do Work Smart<br />
              <span className="text-[#73e28a]">AI-Native Agency</span>
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              We're a team of creatives who are excited about unique ideas and help companies create amazing products by crafting top-notch UI/UX with AI-accelerated development.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              This is the main factor that sets us apart from our competition and allows us to deliver specialist product development. Our team applies its wide-ranging experience to determining the best approach for your project.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {['UX/UI Design', 'AI Integration', 'SaaS Development', 'CRO Optimization', 'Custom APIs', 'Rapid MVPs'].map((skill, i) => (
                <span key={i} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-300 hover:border-[#73e28a]/50 hover:text-[#73e28a] transition-colors cursor-default">
                  {skill}
                </span>
              ))}
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
            <div className="mt-6 lg:mt-0">
              <RotatingBadge size={100} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <Card key={i} className="p-8 text-center group hover:border-[#73e28a]/50 bg-slate-900/80">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#73e28a] group-hover:bg-[#73e28a] group-hover:text-black transition-all duration-300">
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{service.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section className="py-24 relative overflow-hidden">
        <GlowingOrb position="bottom-left" size="350px" color="#5dbb72" opacity={0.1} />
        
        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <SectionLabel text="Why Choose Us" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Make Your Product<br />
              <span className="text-[#73e28a]">Stand Out</span>
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8">
              For each project, we take a bespoke approach to developing solutions, often with the common goal of shipping fast without sacrificing quality.
            </p>

            <div className="space-y-6">
              {[
                { num: "01", title: "AI-Accelerated", desc: "80% faster development using modern AI tools and platforms" },
                { num: "02", title: "Conversion-First", desc: "30 years of marketing experience in every build" },
                { num: "03", title: "Fixed Pricing", desc: "No hourly surprises, clear timelines and deliverables" },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-[#73e28a]/30 transition-colors">
                  <div className="text-[#73e28a] font-bold text-xl">{item.num}</div>
                  <div>
                    <h4 className="text-white font-bold mb-2">{item.title}</h4>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=700&fit=crop" 
              alt="Team working" 
              className="rounded-2xl w-full"
            />
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
          <SectionLabel text="Our Process" />
          <h2 className="text-4xl md:text-5xl font-bold text-white">How We Work</h2>
          <p className="text-slate-300 mt-4">Idea → Scope → Sprint → Launch → Grow</p>
        </div>

        <div className="relative z-10 flex flex-wrap justify-center gap-8">
          {[
            { num: "01", title: "Discover", desc: "Map goals and requirements" },
            { num: "02", title: "Scope", desc: "Define features and timeline" },
            { num: "03", title: "Sprint", desc: "Build working MVP" },
            { num: "04", title: "Launch", desc: "Deploy and measure" },
            { num: "05", title: "Grow", desc: "Ongoing partnership" },
          ].map((step, i) => (
            <div key={i} className="text-center group">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-[#73e28a] flex items-center justify-center text-[#73e28a] font-bold text-xl group-hover:bg-[#73e28a] group-hover:text-black transition-all">
                {step.num}
              </div>
              <h4 className="text-white font-bold mb-2">{step.title}</h4>
              <p className="text-slate-400 text-sm max-w-[140px]">{step.desc}</p>
            </div>
          ))}
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
            Ready to build 80% faster?
          </h2>
          <p className="text-slate-300 text-lg mb-10">
            Whether you have an idea or an existing app, we'll help you move fast without sacrificing quality.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link to={createPageUrl('Contact')} className="block">
              <Card className="p-8 hover:border-[#73e28a]/50 group cursor-pointer h-full bg-slate-900/80">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#73e28a] transition-colors">I have an idea</h3>
                <p className="text-slate-300 text-sm mb-4">Let's scope and build your MVP</p>
                <ArrowRight className="w-5 h-5 text-[#73e28a] group-hover:translate-x-1 transition-transform" />
              </Card>
            </Link>
            <Link to={createPageUrl('Contact')} className="block">
              <Card className="p-8 hover:border-[#73e28a]/50 group cursor-pointer h-full bg-slate-900/80">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#73e28a] transition-colors">I have an existing app</h3>
                <p className="text-slate-300 text-sm mb-4">Let's evolve and optimize it</p>
                <ArrowRight className="w-5 h-5 text-[#73e28a] group-hover:translate-x-1 transition-transform" />
              </Card>
            </Link>
          </div>
        </div>
      </Section>

      {/* Newsletter */}
      <Section className="py-16 border-t border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <SectionLabel text="Get In Touch" />
            <h3 className="text-3xl font-bold text-white">Subscribe Now.</h3>
          </div>
          <div className="flex items-center gap-4 w-full max-w-md">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 bg-transparent border-b border-slate-700 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#73e28a]"
            />
            <button className="w-16 h-16 rounded-full bg-[#73e28a] flex items-center justify-center text-black hover:scale-105 transition-transform">
              <ArrowUpRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}