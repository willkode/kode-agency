import React from 'react';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { Search, Code, FileText, BarChart3, Bot, Settings } from 'lucide-react';

export default function SEOServicesPage() {
  return (
    <ServicePageTemplate
      title="SEO Services"
      subtitle="SaaS & App SEO Experts"
      description="We specialize in SEO for SaaS platforms, web apps, and mobile applications. Our data-driven strategies help software companies rank for high-intent keywords, drive qualified signups, and reduce customer acquisition costs through organic search."
      heroImage="https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1600&auto=format&fit=crop"
      Icon={Search}
      features={[
        { icon: Code, title: "Technical SEO for Apps", description: "SPA/PWA optimization, JavaScript rendering, app indexing, and Core Web Vitals for complex web applications." },
        { icon: FileText, title: "SaaS Content Strategy", description: "Bottom-of-funnel keyword targeting, feature pages, comparison content, and integration pages that convert." },
        { icon: BarChart3, title: "Product-Led SEO", description: "Programmatic pages, user-generated content optimization, and scalable SEO for growing platforms." },
        { icon: Settings, title: "Analytics & Attribution", description: "GA4, Mixpanel, Amplitude integration to track organic signups, trials, and conversions." },
        { icon: Bot, title: "AI-Powered Audits", description: "Comprehensive technical audits tailored for modern JavaScript frameworks and SaaS architecture." },
        { icon: Search, title: "Competitor Intelligence", description: "SaaS competitor keyword gaps, backlink analysis, and content opportunity mapping." },
      ]}
      benefits={[
        "Deep expertise in SaaS and app SEO challenges",
        "Focus on keywords that drive trials and signups",
        "Technical SEO for React, Next.js, and modern stacks",
        "Integration with your product analytics",
        "Scalable strategies that grow with your platform",
        "Monthly reporting tied to business metrics, not just rankings"
      ]}
      process={[
        { title: "Audit", description: "Deep-dive into your app's technical SEO, content gaps, and competitor landscape." },
        { title: "Strategy", description: "Prioritized roadmap targeting high-intent SaaS keywords and quick wins." },
        { title: "Execute", description: "Technical fixes, content optimization, and programmatic SEO implementation." },
        { title: "Scale", description: "Ongoing optimization, A/B testing, and expansion to new keyword territories." }
      ]}
      relatedServices={[
        { slug: "ContentMarketing", title: "Content Marketing", description: "SaaS content that ranks and converts." },
        { slug: "SaaSDevelopment", title: "SaaS Development", description: "Build SEO-friendly SaaS platforms." },
        { slug: "CROServices", title: "CRO Services", description: "Convert organic traffic into paying users." }
      ]}
    />
  );
}