import React from 'react';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { Mail, Workflow, Users, TrendingUp, Target, BarChart3 } from 'lucide-react';

export default function EmailMarketingPage() {
  return (
    <ServicePageTemplate
      title="Email Marketing & Automation"
      subtitle="Nurture & Convert"
      description="Strategic email marketing and automation that nurtures leads and drives conversions. We set up and manage campaigns on Mailchimp, Klaviyo, ConvertKit, and other leading platforms."
      heroImage="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1600&auto=format&fit=crop"
      Icon={Mail}
      features={[
        { icon: Mail, title: "Platform Setup", description: "Mailchimp, Klaviyo, ConvertKit configuration and migration." },
        { icon: Workflow, title: "Lead Nurturing", description: "Automated sequences that guide leads to purchase." },
        { icon: Target, title: "Behavioral Automations", description: "Triggered emails based on user actions." },
        { icon: Users, title: "List Growth Strategy", description: "Grow your subscriber base with proven tactics." },
        { icon: TrendingUp, title: "Campaign Management", description: "Regular newsletters and promotional campaigns." },
        { icon: BarChart3, title: "Analytics & Optimization", description: "A/B testing and performance tracking." },
      ]}
      benefits={[
        "Higher open and click rates",
        "Automated lead nurturing",
        "Personalized customer journeys",
        "List segmentation for relevance",
        "Revenue attribution tracking",
        "Continuous optimization"
      ]}
      process={[
        { title: "Audit", description: "Review current email performance and setup." },
        { title: "Strategy", description: "Define automation flows and campaign calendar." },
        { title: "Build", description: "Create templates, sequences, and automations." },
        { title: "Optimize", description: "Test, analyze, and improve performance." }
      ]}
      relatedServices={[
        { slug: "ContentMarketing", title: "Content Marketing", description: "Create email content." },
        { slug: "CROServices", title: "CRO Services", description: "Optimize email conversions." },
        { slug: "FullFunnelMarketing", title: "Full Funnel Marketing", description: "Complete marketing strategy." }
      ]}
    />
  );
}