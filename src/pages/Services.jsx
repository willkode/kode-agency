import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import PageHero from '@/components/ui-custom/PageHero';
import SectionLabel from '@/components/ui-custom/SectionLabel';
import RotatingBadge from '@/components/ui-custom/RotatingBadge';
import GridBackground from '@/components/ui-custom/GridBackground';
import FloatingPixels from '@/components/ui-custom/FloatingPixels';
import GlowingOrb from '@/components/ui-custom/GlowingOrb';
import { Zap, RefreshCw, TrendingUp, Gauge, Layers, Code, Palette, Rocket, ArrowRight, CheckCircle, Phone } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    { icon: Zap, title: "AI MVP Sprints", desc: "From zero to live MVP in 4-8 weeks using AI-accelerated workflows." },
    { icon: Layers, title: "SaaS Development", desc: "Production-ready SaaS apps with authentication, billing, and dashboards." },
    { icon: RefreshCw, title: "Product Partner", desc: "Ongoing development, A/B testing, and continuous optimization." },
    { icon: TrendingUp, title: "CRO Sites", desc: "Landing pages and funnels designed to convert visitors into customers." },
    { icon: Code, title: "Custom Integrations", desc: "Connect your app to any API, CRM, or third-party service." },
    { icon: Palette, title: "UI/UX Design", desc: "Beautiful, conversion-focused interfaces that users love." },
    { icon: Gauge, title: "Performance Tuning", desc: "Speed optimization, Core Web Vitals, and technical SEO fixes." },
    { icon: Rocket, title: "Launch Support", desc: "Deployment, monitoring, and 30-day warranty on all builds." },
  ];

  const features = [
    { num: "01", title: "Creative Solution", desc: "AI-accelerated development with human refinement for quality output." },
    { num: "02", title: "Modern Stack", desc: "Built on Base44, Lovable, React, and modern cloud infrastructure." },
    { num: "03", title: "Fast Delivery", desc: "4-8 weeks from kickoff to production-ready deployment." },
  ];

  const testimonials = [
    {
      quote: "Kode Agency delivered our MVP in just 5 weeks. The speed was incredible without sacrificing quality.",
      name: "Sarah Chen",
      role: "Founder, TechStart",
      rating: 5
    },
    {
      quote: "Finally, a dev partner who understands marketing. Our conversion rate jumped 40% after their redesign.",
      name: "Marcus Johnson",
      role: "CEO, GrowthLab",
      rating: 5
    },
    {
      quote: "The AI-accelerated approach saved us months and tens of thousands in development costs.",
      name: "Emily Rodriguez",
      role: "Product Lead, ScaleUp",
      rating: 5
    }
  ];

  return (
    <div className="bg-slate-950 text-white">
      {/* Hero */}
      <PageHero 
        title="Services" 
        backgroundImage="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1600&auto=format&fit=crop"
      />

      {/* Services Grid */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={20} />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
            <div>
              <SectionLabel text="Best Of Service" />
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                All Professional Solutions<br />
                & Services
              </h2>
            </div>
            <div className="mt-6 lg:mt-0">
              <RotatingBadge size={100} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <Card key={i} className="p-6 text-center group hover:border-[#73e28a]/50 bg-slate-900/80">
                <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#73e28a] group-hover:bg-[#73e28a] group-hover:text-black transition-all duration-300">
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{service.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Why Choose Us Section */}
      <Section className="py-24 bg-slate-900/50 relative overflow-hidden">
        <GlowingOrb position="top-right" size="400px" opacity={0.1} />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&auto=format&fit=crop" 
                alt="Team working" 
                className="rounded-2xl w-full max-w-lg"
              />
              {/* Floating accent image */}
              <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-xl overflow-hidden border-4 border-slate-950 shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=200&auto=format&fit=crop" 
                  alt="Discussion" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Green accent */}
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 bg-[#73e28a] rounded-tr-3xl rounded-bl-3xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-black" />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <SectionLabel text="Why Choose Us" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Make Your Service<br />
              <span className="text-[#73e28a]">Stand Out</span>
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8">
              For each project, we take a bespoke approach to developing solutions, often with the common goal of shipping fast without sacrificing quality.
            </p>

            <div className="space-y-6 mb-8">
              {features.map((feature, i) => (
                <div key={i} className="flex gap-6 p-5 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-[#73e28a]/30 transition-colors">
                  <div className="text-[#73e28a] font-bold text-xl">{feature.num}</div>
                  <div>
                    <h4 className="text-white font-bold mb-1">{feature.title}</h4>
                    <p className="text-slate-400 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <Link to={createPageUrl('Contact')}>
                <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-12 px-6">
                  Start a Project <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <a href="tel:+1234567890" className="flex items-center gap-3 text-white hover:text-[#73e28a] transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Call Us</span>
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={15} />
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <SectionLabel text="Client Testimonials" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="p-8 bg-slate-900/80">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <span key={j} className="text-[#73e28a]">★</span>
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#73e28a] to-emerald-600 flex items-center justify-center text-black font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
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
            Ready to build something amazing?
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            Let's discuss your project and find the perfect solution for your needs.
          </p>
          <Link to={createPageUrl('Contact')}>
            <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-10 text-lg">
              Get Started Today
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}