import React from 'react';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { Search, Code, FileText, BarChart3, Bot, Settings } from 'lucide-react';

export default function SEOServicesPage() {
  return (
    <ServicePageTemplate
      title="SEO Services"
      subtitle="Rank & Grow"
      description="Data-driven SEO strategies powered by AI to improve your organic visibility. From technical audits to on-page optimization, we help you rank higher and drive more qualified traffic."
      heroImage="https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1600&auto=format&fit=crop"
      Icon={Search}
      features={[
        { icon: Code, title: "Technical SEO", description: "Site structure, speed, mobile optimization, and Core Web Vitals." },
        { icon: FileText, title: "On-Page Optimization", description: "Content, meta tags, headers, and keyword strategy." },
        { icon: BarChart3, title: "Rank Tracking", description: "Monitor keyword positions and organic traffic growth." },
        { icon: Settings, title: "GSC/GTM/GA4 Setup", description: "Complete analytics and tracking configuration." },
        { icon: Bot, title: "AI-Powered Audits", description: "Comprehensive site audits using AI analysis tools." },
        { icon: Search, title: "Competitor Analysis", description: "Understand and outrank your competition." },
      ]}
      benefits={[
        "AI-powered SEO audits and recommendations",
        "Focus on high-intent keywords that convert",
        "Technical fixes that improve performance",
        "Monthly reporting with clear metrics",
        "White-hat strategies for long-term results",
        "Integration with your content strategy"
      ]}
      process={[
        { title: "Audit", description: "Comprehensive technical and content analysis." },
        { title: "Strategy", description: "Keyword research and prioritization plan." },
        { title: "Optimize", description: "Implement on-page and technical fixes." },
        { title: "Monitor", description: "Track rankings and refine strategy." }
      ]}
      relatedServices={[
        { slug: "ContentMarketing", title: "Content Marketing", description: "Create SEO-optimized content." },
        { slug: "WebsiteDevelopment", title: "Website Development", description: "Build SEO-friendly sites." },
        { slug: "CROServices", title: "CRO Services", description: "Convert your organic traffic." }
      ]}
    />
  );
}