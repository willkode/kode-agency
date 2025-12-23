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
import { 
  Code, Rocket, Bot, Link2, Layers, Palette, Globe, Server,
  Search, TrendingUp, Target, FileText, Brush, Mail, BarChart3,
  ArrowRight, CheckCircle, Phone, Zap, Stethoscope
} from 'lucide-react';

export default function ServicesPage() {
  const developmentServices = [
    { icon: Code, title: "App Development", slug: "AppDevelopment", desc: "Native, web, and cross-platform apps with AI-enhanced workflows." },
    { icon: Rocket, title: "MVP Development", slug: "MVPDevelopment", desc: "Rapid MVPs using Base44, Lovable, Replit — launch in weeks." },
    { icon: Bot, title: "AI Systems & Automations", slug: "AISystems", desc: "Custom AI agents, workflow automation, and LLM integrations." },
    { icon: Link2, title: "API Development", slug: "APIDevelopment", desc: "REST & GraphQL APIs with third-party integrations." },
    { icon: Layers, title: "Custom SaaS", slug: "SaaSDevelopment", desc: "Multi-tenant platforms with billing, auth, and dashboards." },
    { icon: Palette, title: "UI/UX Design", slug: "UIUXDesign", desc: "Conversion-focused interfaces and full design systems." },
    { icon: Globe, title: "Website Development", slug: "WebsiteDevelopment", desc: "High-performance sites, landing pages, and e-commerce." },
    { icon: Server, title: "DevOps & Infrastructure", slug: "DevOps", desc: "Cloud setup, monitoring, scaling, and deployment." },
  ];

  const specialtyServices = [
    { icon: Zap, title: "Build Sprint", slug: "BuildSprint", desc: "Live screen-share session where I build your MVP while you watch and learn. $75/hr." },
    { icon: Stethoscope, title: "Base44 Emergency Room", slug: "Base44ER", desc: "Expert app review + optional $100 fix service. Get your Base44 app unstuck." },
  ];

  const marketingServices = [
    { icon: Search, title: "SEO Services", slug: "SEOServices", desc: "Technical SEO, on-page optimization, and AI-powered audits." },
    { icon: TrendingUp, title: "Conversion Rate Optimization", slug: "CROServices", desc: "Funnel optimization, A/B testing, and UX improvements." },
    { icon: Target, title: "Paid Ads Management", slug: "PaidAds", desc: "Google Ads, Facebook/Instagram Ads, and retargeting." },
    { icon: FileText, title: "Content Marketing", slug: "ContentMarketing", desc: "Blog writing, AI-generated content, and social media." },
    { icon: Brush, title: "Branding & Creative", slug: "Branding", desc: "Logo design, brand identity, and messaging strategy." },
    { icon: Mail, title: "Email Marketing", slug: "EmailMarketing", desc: "Automation, lead nurturing, and list growth strategy." },
    { icon: BarChart3, title: "Full Funnel Marketing", slug: "FullFunnelMarketing", desc: "End-to-end strategy, lead gen, and multi-channel campaigns." },
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

  const ServiceCard = ({ service }) => (
    <Link to={createPageUrl(service.slug)}>
      <Card className="p-6 group hover:border-[#73e28a]/50 bg-slate-900/80 h-full cursor-pointer">
        <div className="w-14 h-14 mb-4 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#73e28a] group-hover:bg-[#73e28a] group-hover:text-black transition-all duration-300">
          <service.icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#73e28a] transition-colors">{service.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">{service.desc}</p>
        <div className="flex items-center text-[#73e28a] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Learn More <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </Card>
    </Link>
  );

  return (
    <div className="bg-slate-950 text-white">
      <PageHero 
        title="Services" 
        backgroundImage="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1600&auto=format&fit=crop"
      />

      {/* Development Services */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={20} />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
            <div>
              <SectionLabel text="Build & Ship" />
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Development Services
              </h2>
              <p className="text-slate-400 mt-4 max-w-2xl">
                Everything related to building software, apps, automations, AI systems, and dev consulting — delivered 80% faster with our AI-enhanced workflow.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {developmentServices.map((service, i) => (
              <ServiceCard key={i} service={service} />
            ))}
          </div>
        </div>
      </Section>

      {/* Specialty Services */}
      <Section className="py-24 bg-slate-900/50 relative overflow-hidden">
        <GlowingOrb position="top-left" size="300px" opacity={0.1} />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
            <div>
              <SectionLabel text="Quick & Focused" />
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Specialty Services
              </h2>
              <p className="text-slate-400 mt-4 max-w-2xl">
                Targeted sessions for Base44 builders — get expert help fast without a full project engagement.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            {specialtyServices.map((service, i) => (
              <ServiceCard key={i} service={service} />
            ))}
          </div>
        </div>
      </Section>

      {/* Marketing Services */}
      <Section className="py-24 relative overflow-hidden">
        <GlowingOrb position="top-right" size="400px" opacity={0.1} />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
            <div>
              <SectionLabel text="Grow & Scale" />
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Marketing Services
              </h2>
              <p className="text-slate-400 mt-4 max-w-2xl">
                Everything tied to growth, visibility, conversion, traffic, and brand — powered by data-driven strategies and AI optimization.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketingServices.map((service, i) => (
              <ServiceCard key={i} service={service} />
            ))}
          </div>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&auto=format&fit=crop" 
                alt="Team working" 
                className="rounded-2xl w-full max-w-lg"
              />
              <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-xl overflow-hidden border-4 border-slate-950 shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=200&auto=format&fit=crop" 
                  alt="Discussion" 
                  className="w-full h-full object-cover"
                />
              </div>
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
              Development + Marketing<br />
              <span className="text-[#73e28a]">Under One Roof</span>
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8">
              Most agencies do one or the other. We do both — which means your product is built for conversion from day one, not retrofitted later.
            </p>

            <div className="space-y-4 mb-8">
              {[
                "AI-accelerated development — 80% faster than traditional agencies",
                "Conversion-first design and marketing baked into every build",
                "Fixed pricing with no surprises — know your costs upfront",
                "Full-stack team: developers, designers, and marketers"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#73e28a] mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{item}</span>
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
      <Section className="py-24 bg-slate-900/50 relative overflow-hidden">
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
      <Section className="py-24 relative overflow-hidden">
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