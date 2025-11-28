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
import { ArrowRight, CheckCircle, Phone } from 'lucide-react';

export default function ServicePageTemplate({ 
  title, 
  subtitle,
  description, 
  heroImage,
  Icon,
  features,
  benefits,
  process,
  relatedServices
}) {
  return (
    <div className="bg-slate-950 text-white">
      <PageHero 
        title={title} 
        backgroundImage={heroImage}
      />

      {/* Overview */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={15} />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel text={subtitle} />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {title}
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              {description}
            </p>
            
            <div className="flex items-center gap-6">
              <Link to={createPageUrl('Contact')}>
                <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-12 px-6">
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
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
          
          <div className="relative">
            <div className="w-32 h-32 mx-auto mb-8 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#73e28a]">
              {Icon && <Icon className="w-16 h-16" />}
            </div>
          </div>
        </div>
      </Section>

      {/* Features/What We Offer */}
      <Section className="py-24 bg-slate-900/50 relative overflow-hidden">
        <GlowingOrb position="top-right" size="400px" opacity={0.1} />
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <SectionLabel text="What We Offer" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Our Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="p-6 bg-slate-900/80">
                <div className="w-12 h-12 mb-4 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#73e28a]">
                  {feature.icon && <feature.icon className="w-6 h-6" />}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Benefits */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel text="Why Choose Us" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              The Kode Agency<br />
              <span className="text-[#73e28a]">Advantage</span>
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8">
              We combine AI-powered efficiency with human expertise to deliver exceptional results faster and at lower cost than traditional agencies.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#73e28a] mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&auto=format&fit=crop" 
              alt="Team working" 
              className="rounded-2xl w-full"
            />
          </div>
        </div>
      </Section>

      {/* Process */}
      {process && process.length > 0 && (
        <Section className="py-24 bg-slate-900/50 relative overflow-hidden">
          <FloatingPixels count={10} />
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <SectionLabel text="Our Process" />
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                How We Work
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((step, i) => (
                <div key={i} className="relative">
                  <div className="text-6xl font-bold text-slate-800 mb-4">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Related Services */}
      {relatedServices && relatedServices.length > 0 && (
        <Section className="py-24 relative overflow-hidden">
          <GridBackground />
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <SectionLabel text="Explore More" />
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Related Services
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((service, i) => (
                <Link key={i} to={createPageUrl(service.slug)}>
                  <Card className="p-6 group hover:border-[#73e28a]/50 bg-slate-900/80 cursor-pointer">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#73e28a] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-slate-400 text-sm">{service.description}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* CTA */}
      <Section className="py-24 relative overflow-hidden">
        <GlowingOrb position="center" size="500px" opacity={0.1} />
        
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            Let's discuss your project and create something amazing together.
          </p>
          <Link to={createPageUrl('Contact')}>
            <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-10 text-lg">
              Start Your Project
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}