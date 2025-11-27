import React from 'react';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { Brush, Palette, FileText, Image, MessageSquare, Layers } from 'lucide-react';

export default function BrandingPage() {
  return (
    <ServicePageTemplate
      title="Branding & Creative"
      subtitle="Define & Differentiate"
      description="Build a memorable brand identity that resonates with your audience. From logo design to brand guidelines, we create cohesive visual systems that differentiate you from the competition."
      heroImage="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600&auto=format&fit=crop"
      Icon={Brush}
      features={[
        { icon: Palette, title: "Logo Design", description: "Distinctive logos that capture your brand essence." },
        { icon: Brush, title: "Brand Identity", description: "Colors, typography, and visual elements that define you." },
        { icon: MessageSquare, title: "Messaging & Positioning", description: "Clear value propositions and brand voice." },
        { icon: FileText, title: "Brand Guidelines", description: "Comprehensive style guides for consistency." },
        { icon: Image, title: "Social Media Graphics", description: "Templates and assets for social presence." },
        { icon: Layers, title: "Design Systems", description: "Component libraries for digital products." },
      ]}
      benefits={[
        "Distinctive visual identity",
        "Consistent brand experience",
        "Clear messaging and positioning",
        "Flexible design system",
        "Ready-to-use templates",
        "Comprehensive brand guidelines"
      ]}
      process={[
        { title: "Discover", description: "Understand your values, audience, and competition." },
        { title: "Explore", description: "Develop concepts and visual directions." },
        { title: "Refine", description: "Perfect the chosen direction with feedback." },
        { title: "Deliver", description: "Complete brand package and guidelines." }
      ]}
      relatedServices={[
        { slug: "UIUXDesign", title: "UI/UX Design", description: "Apply your brand to products." },
        { slug: "WebsiteDevelopment", title: "Website Development", description: "Build your branded website." },
        { slug: "ContentMarketing", title: "Content Marketing", description: "Create branded content." }
      ]}
    />
  );
}