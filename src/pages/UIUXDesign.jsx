import React from 'react';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { Palette, Layout, Smartphone, TrendingUp, Layers, Eye } from 'lucide-react';

export default function UIUXDesignPage() {
  return (
    <ServicePageTemplate
      title="UI/UX Design"
      subtitle="Design & Convert"
      description="Create beautiful, conversion-focused interfaces that users love. From app dashboards to product prototypes, we design experiences that look great and drive results."
      heroImage="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600&auto=format&fit=crop"
      Icon={Palette}
      features={[
        { icon: TrendingUp, title: "Conversion-Focused", description: "Every design decision optimized for user action and conversion." },
        { icon: Layout, title: "App Dashboards", description: "Clean, intuitive dashboards that surface the right data." },
        { icon: Smartphone, title: "Product Prototypes", description: "Interactive prototypes to validate ideas before building." },
        { icon: Layers, title: "Design Systems", description: "Complete component libraries for consistent branding." },
        { icon: Eye, title: "Brand Identity", description: "Logo, colors, typography, and visual guidelines." },
        { icon: Palette, title: "Responsive Design", description: "Pixel-perfect designs for every screen size." },
      ]}
      benefits={[
        "Conversion-first design philosophy",
        "Interactive prototypes for validation",
        "Complete design system handoff",
        "Mobile-first responsive approach",
        "Accessibility best practices",
        "Developer-ready specifications"
      ]}
      process={[
        { title: "Research", description: "Understand your users, goals, and competitive landscape." },
        { title: "Wireframe", description: "Create low-fidelity layouts and user flows." },
        { title: "Design", description: "High-fidelity mockups with full interactions." },
        { title: "Handoff", description: "Developer specs, assets, and design system." }
      ]}
      relatedServices={[
        { slug: "AppDevelopment", title: "App Development", description: "Bring your designs to life." },
        { slug: "WebsiteDevelopment", title: "Website Development", description: "Convert designs to code." },
        { slug: "Branding", title: "Branding & Creative", description: "Full brand identity services." }
      ]}
    />
  );
}