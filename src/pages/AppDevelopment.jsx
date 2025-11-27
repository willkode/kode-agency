import React from 'react';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { Code, Smartphone, Monitor, Layers, Zap, Shield } from 'lucide-react';

export default function AppDevelopmentPage() {
  return (
    <ServicePageTemplate
      title="App Development"
      subtitle="Build & Ship"
      description="We build native iOS, Android, web, and desktop applications using AI-enhanced development workflows. Our approach delivers production-ready apps 80% faster than traditional development, without sacrificing quality or scalability."
      heroImage="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1600&auto=format&fit=crop"
      Icon={Code}
      features={[
        { icon: Smartphone, title: "Native Apps", description: "iOS and Android apps built with Swift, Kotlin, or React Native for optimal performance." },
        { icon: Monitor, title: "Web Apps", description: "Progressive web apps and SPAs using React, Vue, or Next.js with modern UI/UX." },
        { icon: Layers, title: "Cross-Platform", description: "Build once, deploy everywhere with Flutter or React Native frameworks." },
        { icon: Code, title: "Desktop Apps", description: "Electron-based desktop applications for Windows, Mac, and Linux." },
        { icon: Zap, title: "AI-Enhanced Dev", description: "80% faster development using AI-assisted coding and automation tools." },
        { icon: Shield, title: "Enterprise Ready", description: "Scalable architecture with security, authentication, and compliance built-in." },
      ]}
      benefits={[
        "AI-accelerated development — ship 80% faster",
        "Full-stack expertise across all major platforms",
        "Conversion-focused design from day one",
        "Fixed pricing with no hidden costs",
        "30-day warranty on all builds",
        "Ongoing support and maintenance available"
      ]}
      process={[
        { title: "Discovery", description: "We analyze your requirements, user needs, and technical constraints." },
        { title: "Architecture", description: "Design the system architecture, tech stack, and development roadmap." },
        { title: "Build", description: "AI-accelerated development with continuous testing and iteration." },
        { title: "Launch", description: "Deployment, monitoring setup, and handover with full documentation." }
      ]}
      relatedServices={[
        { slug: "MVPDevelopment", title: "MVP Development", description: "Launch your idea fast with a focused MVP." },
        { slug: "UIUXDesign", title: "UI/UX Design", description: "Beautiful, conversion-focused interfaces." },
        { slug: "APIDevelopment", title: "API Development", description: "Connect your app to any service." }
      ]}
    />
  );
}