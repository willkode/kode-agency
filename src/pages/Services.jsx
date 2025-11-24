import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
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
      {/* Hero with Image */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
            alt="Team collaboration" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">Services</h1>
            <div className="flex items-center gap-2 text-sm">
              <Link to={createPageUrl('Home')} className="text-[#73e28a] hover:underline">Home</Link>
              <span className="text-slate-500">/</span>
              <span className="text-slate-300">Services</span>
            </div>
          </div>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 hidden md:block">
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#73e28a]/30 animate-spin-slow"></div>
        </div>
        <div className="absolute top-20 right-32 hidden md:block">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <Section className="py-20 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={20} />
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#73e28a]/10 border border-[#73e28a]/30 rounded-full text-[#73e28a] text-sm font-semibold mb-6">
              What We Offer
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              All Professional Solutions &<br />Services
            </h2>
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

      {/* We Do Work Smart Section */}
      <Section className="py-20 bg-slate-900/50 relative overflow-hidden">
        <GlowingOrb position="top-right" size="400px" opacity={0.1} />
        
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=500&auto=format&fit=crop" 
                alt="Team working" 
                className="rounded-2xl w-full max-w-md"
              />
              {/* Floating accent image */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-xl overflow-hidden border-4 border-slate-950 shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=200&auto=format&fit=crop" 
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
            <div className="inline-block px-4 py-2 bg-[#73e28a]/10 border border-[#73e28a]/30 rounded-full text-[#73e28a] text-sm font-semibold mb-6">
              Why Choose Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              We Work Smart<br />
              <span className="text-[#73e28a]">AI-Native Agency</span>
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              30 years of marketing experience combined with cutting-edge AI development tools. We don't just build apps — we build products designed to grow your business.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#73e28a] flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">80% faster development with AI-accelerated workflows</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#73e28a] flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">Conversion-first design backed by 30 years of marketing</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#73e28a] flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">Fixed pricing with no hourly billing surprises</span>
              </li>
            </ul>
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
      <Section className="py-20 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={15} />
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#73e28a]/10 border border-[#73e28a]/30 rounded-full text-[#73e28a] text-sm font-semibold mb-6">
              Client Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
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
      <Section className="py-20 relative overflow-hidden">
        <GlowingOrb position="center" size="500px" opacity={0.1} />
        
        <div className="relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
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