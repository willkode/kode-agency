import React from 'react';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { Server, Cloud, Activity, Shield, Zap, Database } from 'lucide-react';

export default function DevOpsPage() {
  return (
    <ServicePageTemplate
      title="DevOps & Infrastructure"
      subtitle="Deploy & Scale"
      description="Modern cloud infrastructure setup, monitoring, and scaling solutions. We use Cloudflare Workers, Supabase, Render, Vercel, and other leading platforms to ensure your applications run reliably at any scale."
      heroImage="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&auto=format&fit=crop"
      Icon={Server}
      features={[
        { icon: Cloud, title: "Cloudflare Workers", description: "Edge computing for low-latency global performance." },
        { icon: Database, title: "Supabase Setup", description: "PostgreSQL database with real-time subscriptions and auth." },
        { icon: Zap, title: "Vercel & Render", description: "Seamless deployments with automatic scaling." },
        { icon: Activity, title: "Monitoring", description: "Real-time alerts, logs, and performance tracking." },
        { icon: Shield, title: "Security", description: "SSL, WAF, DDoS protection, and security best practices." },
        { icon: Server, title: "Scaling", description: "Auto-scaling infrastructure for traffic spikes." },
      ]}
      benefits={[
        "99.9% uptime guarantee",
        "Global edge deployment",
        "Automatic scaling for traffic spikes",
        "Real-time monitoring and alerts",
        "Security best practices",
        "Cost-optimized infrastructure"
      ]}
      process={[
        { title: "Audit", description: "Review current infrastructure and requirements." },
        { title: "Architect", description: "Design the optimal cloud setup for your needs." },
        { title: "Deploy", description: "Set up CI/CD, monitoring, and security." },
        { title: "Maintain", description: "Ongoing monitoring and optimization." }
      ]}
      relatedServices={[
        { slug: "AppDevelopment", title: "App Development", description: "Build apps to deploy." },
        { slug: "SaaSDevelopment", title: "SaaS Development", description: "Scale your SaaS platform." },
        { slug: "APIDevelopment", title: "API Development", description: "Deploy robust APIs." }
      ]}
    />
  );
}