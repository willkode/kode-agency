import React from 'react';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { BarChart3, Target, Users, TrendingUp, Layers, Zap } from 'lucide-react';

export default function FullFunnelMarketingPage() {
  return (
    <ServicePageTemplate
      title="Full Funnel Marketing"
      subtitle="Strategy & Execution"
      description="End-to-end marketing strategy and execution across all channels. From awareness to retention, we build and optimize complete marketing systems that drive sustainable growth."
      heroImage="https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1600&auto=format&fit=crop"
      Icon={BarChart3}
      features={[
        { icon: Target, title: "Strategy & Execution", description: "Comprehensive marketing plans with hands-on implementation." },
        { icon: Users, title: "Lead Generation", description: "Multi-channel campaigns to fill your pipeline." },
        { icon: Layers, title: "Multi-Channel Campaigns", description: "Coordinated efforts across paid, organic, and email." },
        { icon: BarChart3, title: "Analytics & Optimization", description: "Data-driven decisions and continuous improvement." },
        { icon: TrendingUp, title: "Growth Strategy", description: "Scalable systems for sustainable business growth." },
        { icon: Zap, title: "Marketing Automation", description: "Efficient workflows that scale your efforts." },
      ]}
      benefits={[
        "Complete marketing strategy and execution",
        "Coordinated multi-channel approach",
        "Data-driven optimization",
        "Scalable growth systems",
        "Full visibility into performance",
        "Dedicated marketing partner"
      ]}
      process={[
        { title: "Strategy", description: "Audit, research, and comprehensive planning." },
        { title: "Build", description: "Set up channels, tracking, and automation." },
        { title: "Execute", description: "Launch and manage campaigns across channels." },
        { title: "Grow", description: "Analyze, optimize, and scale what works." }
      ]}
      relatedServices={[
        { slug: "SEOServices", title: "SEO Services", description: "Drive organic traffic." },
        { slug: "PaidAds", title: "Paid Ads", description: "Accelerate with paid channels." },
        { slug: "EmailMarketing", title: "Email Marketing", description: "Nurture and convert leads." }
      ]}
    />
  );
}