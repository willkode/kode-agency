import React from 'react';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { TrendingUp, Target, BarChart3, MousePointer, Eye, Zap } from 'lucide-react';

export default function CROServicesPage() {
  return (
    <ServicePageTemplate
      title="Conversion Rate Optimization"
      subtitle="Test & Convert"
      description="Turn more visitors into customers with data-driven CRO strategies. We use A/B testing, heatmaps, and user behavior analysis to optimize every step of your funnel."
      heroImage="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&auto=format&fit=crop"
      Icon={TrendingUp}
      features={[
        { icon: Target, title: "Funnel Optimization", description: "Identify and fix conversion bottlenecks in your funnel." },
        { icon: BarChart3, title: "A/B Testing", description: "Data-driven experiments to improve conversion rates." },
        { icon: MousePointer, title: "UX Improvements", description: "User experience enhancements based on real behavior." },
        { icon: Eye, title: "Heatmaps & Recordings", description: "See exactly how users interact with your site." },
        { icon: TrendingUp, title: "Behavior Tracking", description: "Understand user journeys and drop-off points." },
        { icon: Zap, title: "Quick Wins", description: "High-impact changes that deliver fast results." },
      ]}
      benefits={[
        "Data-driven decision making",
        "Measurable ROI improvements",
        "Continuous testing and optimization",
        "User behavior insights",
        "Reduced customer acquisition costs",
        "Higher lifetime customer value"
      ]}
      process={[
        { title: "Analyze", description: "Review analytics, heatmaps, and user recordings." },
        { title: "Hypothesize", description: "Develop test ideas based on data insights." },
        { title: "Test", description: "Run A/B tests with statistical significance." },
        { title: "Implement", description: "Roll out winning variations site-wide." }
      ]}
      relatedServices={[
        { slug: "SEOServices", title: "SEO Services", description: "Drive more traffic to convert." },
        { slug: "PaidAds", title: "Paid Ads", description: "Optimize ad landing pages." },
        { slug: "UIUXDesign", title: "UI/UX Design", description: "Design for conversion." }
      ]}
    />
  );
}