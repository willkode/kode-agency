import React from 'react';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { Rocket, Zap, Target, Map, Clock, Sparkles } from 'lucide-react';

export default function MVPDevelopmentPage() {
  return (
    <ServicePageTemplate
      title="MVP Development"
      subtitle="Launch Fast"
      description="Go from zero to live MVP in 4-8 weeks using AI-accelerated workflows. We use modern low-code platforms like Base44, Lovable, and Replit to build and validate your product idea quickly, so you can start getting real user feedback faster."
      heroImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&auto=format&fit=crop"
      Icon={Rocket}
      features={[
        { icon: Zap, title: "Rapid Development", description: "AI-powered tools accelerate development by 80% compared to traditional methods." },
        { icon: Target, title: "Feature Mapping", description: "We prioritize the core features that matter most for validating your idea." },
        { icon: Map, title: "Prototype First", description: "Interactive prototypes to validate UX before writing production code." },
        { icon: Sparkles, title: "Modern Platforms", description: "Built on Base44, Lovable, or Replit for speed without sacrificing quality." },
        { icon: Clock, title: "4-8 Week Launch", description: "From kickoff to production in weeks, not months." },
        { icon: Rocket, title: "Scale Ready", description: "Architecture designed to scale when you're ready to grow." },
      ]}
      benefits={[
        "Launch in weeks, not months",
        "Validate your idea with real users quickly",
        "Fixed pricing — know your costs upfront",
        "AI-assisted architecture and scoping",
        "Built for conversion from day one",
        "Easy to iterate based on user feedback"
      ]}
      process={[
        { title: "Scope", description: "Define core features, user flows, and success metrics." },
        { title: "Prototype", description: "Create interactive designs and validate with stakeholders." },
        { title: "Sprint", description: "AI-accelerated build with daily progress updates." },
        { title: "Launch", description: "Deploy to production with analytics and monitoring." }
      ]}
      relatedServices={[
        { slug: "AppDevelopment", title: "App Development", description: "Full-scale native and web apps." },
        { slug: "UIUXDesign", title: "UI/UX Design", description: "Conversion-focused interface design." },
        { slug: "SaaSDevelopment", title: "Custom SaaS", description: "Multi-tenant SaaS platforms." }
      ]}
    />
  );
}