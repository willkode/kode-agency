import React from 'react';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { Globe, Zap, ShoppingCart, Layout, Search, Gauge } from 'lucide-react';

export default function WebsiteDevelopmentPage() {
  return (
    <ServicePageTemplate
      title="Website Development"
      subtitle="Build & Launch"
      description="High-performance websites, landing pages, and e-commerce stores built to convert. We use modern frameworks and CMS platforms to create fast, SEO-friendly sites that drive results."
      heroImage="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1600&auto=format&fit=crop"
      Icon={Globe}
      features={[
        { icon: Zap, title: "High Performance", description: "Lightning-fast sites optimized for Core Web Vitals and SEO." },
        { icon: Layout, title: "Landing Pages", description: "Conversion-optimized pages designed to capture leads." },
        { icon: ShoppingCart, title: "E-Commerce", description: "Shopify, WooCommerce, and custom e-commerce solutions." },
        { icon: Globe, title: "CMS Builds", description: "KodeCMS, Webflow, WordPress, and headless CMS setups." },
        { icon: Search, title: "SEO Optimized", description: "Built-in SEO best practices for organic visibility." },
        { icon: Gauge, title: "Analytics Ready", description: "GA4, GTM, and conversion tracking configured." },
      ]}
      benefits={[
        "Core Web Vitals optimized from day one",
        "Mobile-first responsive design",
        "SEO best practices built-in",
        "Easy content management",
        "Fast load times globally",
        "Ongoing maintenance available"
      ]}
      process={[
        { title: "Strategy", description: "Define goals, structure, and content requirements." },
        { title: "Design", description: "Create mockups aligned with your brand." },
        { title: "Build", description: "Develop with performance and SEO in mind." },
        { title: "Launch", description: "Deploy with analytics and monitoring." }
      ]}
      relatedServices={[
        { slug: "UIUXDesign", title: "UI/UX Design", description: "Custom design for your site." },
        { slug: "SEOServices", title: "SEO Services", description: "Drive organic traffic." },
        { slug: "CROServices", title: "CRO Services", description: "Optimize for conversions." }
      ]}
    />
  );
}