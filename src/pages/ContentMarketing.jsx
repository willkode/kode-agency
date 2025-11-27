import React from 'react';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { FileText, Bot, Mail, Share2, PenTool, TrendingUp } from 'lucide-react';

export default function ContentMarketingPage() {
  return (
    <ServicePageTemplate
      title="Content Marketing & AI Content"
      subtitle="Create & Distribute"
      description="Strategic content creation powered by AI for blogs, newsletters, and social media. We create content that ranks, engages, and converts — at scale."
      heroImage="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&auto=format&fit=crop"
      Icon={FileText}
      features={[
        { icon: PenTool, title: "Blog Writing", description: "SEO-optimized articles that drive organic traffic." },
        { icon: Mail, title: "Email Newsletters", description: "Engaging newsletters that nurture and convert." },
        { icon: Share2, title: "Social Content", description: "Platform-native content for LinkedIn, Twitter, and more." },
        { icon: Bot, title: "AI-Generated Content", description: "Scale content production with AI assistance." },
        { icon: TrendingUp, title: "Content Strategy", description: "Editorial calendars aligned with business goals." },
        { icon: FileText, title: "Content Optimization", description: "Improve existing content for better performance." },
      ]}
      benefits={[
        "AI-assisted content at scale",
        "SEO-optimized for organic growth",
        "Consistent brand voice across channels",
        "Data-driven content strategy",
        "Repurposing for maximum reach",
        "Performance tracking and iteration"
      ]}
      process={[
        { title: "Strategy", description: "Define audience, topics, and content goals." },
        { title: "Create", description: "Produce high-quality, AI-enhanced content." },
        { title: "Distribute", description: "Publish and promote across channels." },
        { title: "Analyze", description: "Track performance and optimize." }
      ]}
      relatedServices={[
        { slug: "SEOServices", title: "SEO Services", description: "Optimize content for search." },
        { slug: "EmailMarketing", title: "Email Marketing", description: "Distribute content via email." },
        { slug: "Branding", title: "Branding", description: "Define your content voice." }
      ]}
    />
  );
}