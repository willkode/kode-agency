import React from 'react';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { Layers, Users, CreditCard, LayoutDashboard, Shield, Settings } from 'lucide-react';

export default function SaaSDevelopmentPage() {
  return (
    <ServicePageTemplate
      title="Custom SaaS Development"
      subtitle="Build & Scale"
      description="Build production-ready SaaS platforms with multi-tenant architecture, subscription billing, admin dashboards, and role-based access. We create scalable software that grows with your business."
      heroImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&auto=format&fit=crop"
      Icon={Layers}
      features={[
        { icon: Users, title: "Multi-Tenant Architecture", description: "Securely serve multiple customers from a single codebase." },
        { icon: CreditCard, title: "Subscription Billing", description: "Stripe integration with plans, trials, and usage-based pricing." },
        { icon: LayoutDashboard, title: "Admin Dashboards", description: "Powerful admin interfaces for managing users and data." },
        { icon: Shield, title: "Role-Based Access", description: "Granular permissions and access control for teams." },
        { icon: Settings, title: "White-Label Ready", description: "Custom branding and domain support for enterprise clients." },
        { icon: Layers, title: "API-First Design", description: "Extensible APIs for integrations and mobile apps." },
      ]}
      benefits={[
        "Production-ready architecture from day one",
        "Stripe billing integration included",
        "Scalable multi-tenant design",
        "Enterprise security features built-in",
        "White-label and customization options",
        "Ongoing support and feature development"
      ]}
      process={[
        { title: "Strategy", description: "Define your SaaS model, pricing, and core features." },
        { title: "Architecture", description: "Design the multi-tenant system and data model." },
        { title: "Build", description: "Develop core features with billing and auth." },
        { title: "Scale", description: "Launch, monitor, and iterate based on usage." }
      ]}
      relatedServices={[
        { slug: "AppDevelopment", title: "App Development", description: "Extend with mobile apps." },
        { slug: "UIUXDesign", title: "UI/UX Design", description: "Create intuitive interfaces." },
        { slug: "DevOps", title: "DevOps", description: "Scale your infrastructure." }
      ]}
    />
  );
}