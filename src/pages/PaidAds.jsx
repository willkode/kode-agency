import React from 'react';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { Target, DollarSign, BarChart3, Users, Layout, TrendingUp } from 'lucide-react';

export default function PaidAdsPage() {
  return (
    <ServicePageTemplate
      title="Paid Ads Management"
      subtitle="Target & Scale"
      description="Strategic paid advertising across Google, Facebook, and Instagram to drive qualified leads and sales. We manage campaigns from strategy to execution with full tracking and reporting."
      heroImage="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1600&auto=format&fit=crop"
      Icon={Target}
      features={[
        { icon: Target, title: "Google Ads", description: "Search, display, and shopping campaigns that convert." },
        { icon: Users, title: "Facebook/Instagram Ads", description: "Social advertising for awareness and conversions." },
        { icon: TrendingUp, title: "Retargeting", description: "Re-engage visitors who didn't convert the first time." },
        { icon: Layout, title: "Landing Page Design", description: "High-converting landing pages for your campaigns." },
        { icon: BarChart3, title: "Tracking & Reporting", description: "Full attribution and performance analytics." },
        { icon: DollarSign, title: "Budget Optimization", description: "Maximize ROAS with smart bidding strategies." },
      ]}
      benefits={[
        "Transparent reporting and attribution",
        "Continuous optimization for ROAS",
        "Landing pages designed for conversion",
        "Cross-platform campaign management",
        "Audience research and targeting",
        "Monthly strategy calls included"
      ]}
      process={[
        { title: "Audit", description: "Review current campaigns and identify opportunities." },
        { title: "Strategy", description: "Develop targeting, messaging, and budget plan." },
        { title: "Launch", description: "Create and launch optimized campaigns." },
        { title: "Optimize", description: "Continuous testing and refinement." }
      ]}
      relatedServices={[
        { slug: "CROServices", title: "CRO Services", description: "Improve landing page conversion." },
        { slug: "ContentMarketing", title: "Content Marketing", description: "Support ads with content." },
        { slug: "FullFunnelMarketing", title: "Full Funnel Marketing", description: "Complete marketing strategy." }
      ]}
    />
  );
}