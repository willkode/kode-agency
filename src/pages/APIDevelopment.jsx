import React from 'react';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { Link2, Code, Database, Shield, Zap, Plug } from 'lucide-react';

export default function APIDevelopmentPage() {
  return (
    <ServicePageTemplate
      title="API Development & Integrations"
      subtitle="Connect & Extend"
      description="Build robust REST and GraphQL APIs that connect your systems with third-party services. From payment processors to CRMs, we create seamless integrations that power your business operations."
      heroImage="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&auto=format&fit=crop"
      Icon={Link2}
      features={[
        { icon: Code, title: "REST APIs", description: "Clean, well-documented RESTful APIs following industry best practices." },
        { icon: Database, title: "GraphQL", description: "Flexible GraphQL APIs for complex data requirements and efficient queries." },
        { icon: Plug, title: "Third-Party Integrations", description: "Connect to Stripe, QuickBooks, Salesforce, HubSpot, and more." },
        { icon: Zap, title: "AI Model Integration", description: "Integrate OpenAI, Claude, and other AI models into your workflows." },
        { icon: Shield, title: "Secure & Scalable", description: "Authentication, rate limiting, and infrastructure built for growth." },
        { icon: Link2, title: "Webhook Systems", description: "Real-time event handling and notification systems." },
      ]}
      benefits={[
        "Clean, well-documented API design",
        "Secure authentication and authorization",
        "Rate limiting and abuse prevention",
        "Comprehensive error handling",
        "Scalable architecture for high traffic",
        "Ongoing maintenance and support"
      ]}
      process={[
        { title: "Design", description: "Define API structure, endpoints, and data models." },
        { title: "Build", description: "Develop the API with comprehensive testing." },
        { title: "Document", description: "Create clear documentation for developers." },
        { title: "Deploy", description: "Launch with monitoring and version control." }
      ]}
      relatedServices={[
        { slug: "AppDevelopment", title: "App Development", description: "Build apps that consume your APIs." },
        { slug: "AISystems", title: "AI Systems", description: "Integrate AI into your workflows." },
        { slug: "DevOps", title: "DevOps", description: "Scale your API infrastructure." }
      ]}
    />
  );
}