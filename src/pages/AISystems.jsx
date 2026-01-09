import React from 'react';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';
import { Bot, Workflow, Brain, Plug, Sparkles, Cog } from 'lucide-react';
import SEO, { createServiceSchema, createBreadcrumbSchema } from '@/components/SEO';

export default function AISystemsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Services", url: "/Services" },
        { name: "AI Systems", url: "/AISystems" }
      ]),
      createServiceSchema("AI Systems & Automations", "Build custom AI agents, workflow automation, and intelligent systems with OpenAI, Anthropic, and other AI providers.", "/AISystems")
    ]
  };
  return (
    <>
      <SEO 
        title="AI Systems & Automations - Custom AI Agents & Workflow Automation"
        description="Build custom AI agents, internal automations, and intelligent workflows. Integration with OpenAI, Anthropic, Google AI. Reduce manual work by 90% with 24/7 automation."
        keywords={["AI automation", "custom AI agents", "workflow automation", "OpenAI integration", "LLM integration", "business automation", "AI development"]}
        url="/AISystems"
        jsonLd={jsonLd}
      />
      <ServicePageTemplate
      title="AI Systems & Automations"
      subtitle="Automate & Scale"
      description="Build custom AI agents, internal automations, and intelligent workflows that save time and reduce costs. We integrate with OpenAI, Anthropic, Google, and other leading AI providers to create systems that work for your business."
      heroImage="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&auto=format&fit=crop"
      Icon={Bot}
      features={[
        { icon: Bot, title: "Custom AI Agents", description: "Build intelligent agents that automate complex tasks and decision-making." },
        { icon: Workflow, title: "Workflow Automation", description: "Zapier, n8n, and Make integrations for seamless process automation." },
        { icon: Brain, title: "LLM Integrations", description: "Connect to OpenAI, Anthropic, Google, and other leading AI models." },
        { icon: Plug, title: "API Connections", description: "Integrate AI with your existing tools and data sources." },
        { icon: Sparkles, title: "Smart Assistants", description: "Customer support bots, content generators, and data analyzers." },
        { icon: Cog, title: "Process Optimization", description: "Identify and automate repetitive tasks across your organization." },
      ]}
      benefits={[
        "Reduce manual work by up to 90%",
        "24/7 automation that never sleeps",
        "Custom solutions tailored to your workflows",
        "Integration with your existing tech stack",
        "Scalable architecture for growing needs",
        "Ongoing optimization and support"
      ]}
      process={[
        { title: "Audit", description: "Analyze your current processes and identify automation opportunities." },
        { title: "Design", description: "Architect the AI system and integration points." },
        { title: "Build", description: "Develop and test the automation with your data." },
        { title: "Deploy", description: "Launch, monitor, and continuously improve." }
      ]}
      relatedServices={[
        { slug: "APIDevelopment", title: "API Development", description: "Connect systems with custom APIs." },
        { slug: "SaaSDevelopment", title: "Custom SaaS", description: "Build AI-powered SaaS platforms." },
        { slug: "DevOps", title: "DevOps & Infrastructure", description: "Scale your AI systems reliably." }
      ]}
    />
    </>
  );
}