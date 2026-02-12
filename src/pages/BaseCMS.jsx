import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import GridBackground from '@/components/ui-custom/GridBackground';
import FloatingPixels from '@/components/ui-custom/FloatingPixels';
import GlowingOrb from '@/components/ui-custom/GlowingOrb';
import SEO, { createServiceSchema, createBreadcrumbSchema } from '@/components/SEO';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  ArrowRight, 
  CheckCircle, 
  Layout, 
  Settings, 
  Bug, 
  Paintbrush,
  Zap,
  Clock,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

export default function BaseCMSPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  });

  // Handle return from Stripe
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');
    const serviceType = urlParams.get('serviceType');
    
    if (success === 'true' && sessionId) {
      base44.functions.invoke('handleStripeSuccess', { sessionId })
        .then(res => {
          if (res.data.success) {
            setPaymentSuccess(true);
            const service = services.find(s => s.key === serviceType);
            if (typeof window !== 'undefined' && window.gtag && service) {
              window.gtag('event', 'purchase', {
                transaction_id: sessionId,
                value: service.amount,
                currency: 'USD',
                items: [{
                  item_name: `BaseCMS - ${service.title}`,
                  price: service.amount,
                  quantity: 1
                }]
              });
            }
          }
        })
        .catch(err => console.error('Payment handling failed:', err));
      
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const services = [
    {
      key: "setup",
      icon: Settings,
      title: "CMS Setup & Configuration",
      price: "$150",
      amount: 150,
      description: "Complete BaseCMS setup including content types, media management, and user roles configured for your needs.",
      items: ["Content model design", "User roles & permissions", "Media library setup", "Initial content migration"]
    },
    {
      key: "integration",
      icon: Layout,
      title: "Website Integration",
      price: "$250",
      amount: 250,
      description: "Connect BaseCMS to your frontend and build dynamic pages that pull content from your CMS.",
      items: ["API integration", "Dynamic page templates", "Content rendering", "SEO optimization"]
    },
    {
      key: "theming",
      icon: Paintbrush,
      title: "Custom Theming",
      price: "$500",
      priceSubtext: "starting at",
      amount: 500,
      description: "Customize the look and feel of your BaseCMS dashboard and public-facing content.",
      items: ["Admin dashboard styling", "Custom components", "Brand alignment", "Responsive design"]
    },
    {
      key: "debugging",
      icon: Bug,
      title: "Debugging Session",
      price: "$75/hr",
      amount: 75,
      description: "Having issues with your BaseCMS setup? Book a debugging session and I'll help you fix it live.",
      items: ["Screen-share session", "Live troubleshooting", "Root cause analysis", "Implementation guidance"]
    }
  ];

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      // Create BaseCMS request
      const created = await base44.entities.BaseCMSRequest.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        service_type: selectedService.key,
        description: data.description,
        payment_amount: selectedService.amount
      });

      // Create lead for CRM
      await base44.entities.Lead.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        source: 'Website',
        status: 'New',
        service_sku: 'basecms_' + selectedService.key,
        description: `BaseCMS Service: ${selectedService.title}\n\n${data.description}`,
        amount: selectedService.amount,
        payment_status: 'pending'
      });

      // Send lead notification
      base44.functions.invoke('notifyNewLead', {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        payment_status: 'pending',
        service: `BaseCMS - ${selectedService.title}`,
        amount: selectedService.amount
      }).catch(err => console.error('Lead notification failed:', err));

      // Create Stripe checkout
      const response = await base44.functions.invoke('createStripeCheckout', {
        service: 'BaseCMS',
        requestId: created.id,
        amount: selectedService.amount,
        description: `BaseCMS - ${selectedService.title}`,
        customerEmail: data.email,
        customerName: data.name,
        metadata: { serviceType: selectedService.key }
      });

      return { created, stripeUrl: response.data.url };
    },
    onSuccess: ({ stripeUrl }) => {
      if (stripeUrl) {
        window.location.href = stripeUrl;
      }
    }
  });

  const useCases = [
    "Blog or news website",
    "Portfolio or agency site",
    "E-commerce product catalog",
    "Documentation site",
    "Multi-language content",
    "Client content management"
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Services", url: "/Services" },
        { name: "BaseCMS Services", url: "/BaseCMS" }
      ]),
      createServiceSchema("BaseCMS Services", "Professional BaseCMS setup, customization, and support services. From simple debugging to complete website integrations.", "/BaseCMS")
    ]
  };

  return (
    <div className="flex flex-col bg-slate-950 text-white overflow-hidden">
      <SEO 
        title="BaseCMS Services - Setup, Customization & Support"
        description="Get professional help with your BaseCMS project. CMS setup, website integration, custom theming, and debugging sessions. Expert Base44 developer since 1997."
        keywords={["BaseCMS", "Base44 CMS", "headless CMS", "CMS setup", "CMS customization", "Base44 developer"]}
        url="/BaseCMS"
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
        <GridBackground />
        <FloatingPixels count={20} />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#73e28a]/10 border border-[#73e28a]/30 rounded-full px-4 py-2 mb-6">
            <Layout className="w-4 h-4 text-[#73e28a]" />
            <span className="text-[#73e28a] text-sm font-medium">BaseCMS Services</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Base<span className="text-[#73e28a]">CMS</span> Services
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-4">
            Professional Setup, Customization & Support
          </p>
          <p className="text-slate-500 max-w-2xl mx-auto mb-8">
            Get your BaseCMS project up and running fast. From initial setup to complete website integrations, 
            I'll help you build exactly what you need.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={createPageUrl('Contact')}>
              <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold text-lg h-14 px-10 rounded-full">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a 
              href="https://basecms.base44.app" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 h-14 px-8 rounded-full">
                View BaseCMS <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </a>
          </div>

          <p className="text-slate-500 text-sm mt-6">
            Expert Base44 developer • Full-stack since 1997 • Fast turnaround
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <Section className="py-24 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Services & Pricing
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Choose the service that fits your needs. All services include direct communication and support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="p-8 bg-slate-900/50 border-slate-800 hover:border-[#73e28a]/50 transition-colors cursor-pointer"
              onClick={() => handleServiceClick(service)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#73e28a]/10 flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-[#73e28a]" />
                </div>
                <div className="text-right">
                  {service.priceSubtext && (
                    <span className="text-xs text-slate-500 block">{service.priceSubtext}</span>
                  )}
                  <span className="text-2xl font-bold text-[#73e28a]">{service.price}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-slate-400 text-sm mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-[#73e28a] mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      {/* Use Cases */}
      <Section className="py-24 bg-slate-900/50 relative">
        <GridBackground />
        <div className="relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Perfect For
              </h2>
              <p className="text-slate-400 mb-8">
                BaseCMS is a flexible headless CMS built on Base44. Whether you're building a simple blog 
                or a complex multi-site setup, I can help you get it running.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {useCases.map((useCase, index) => (
                  <div key={index} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-[#73e28a] flex-shrink-0" />
                    <span className="text-sm">{useCase}</span>
                  </div>
                ))}
              </div>
            </div>
            <Card className="p-8 bg-slate-800/50 border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Why Work With Me?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-[#73e28a] mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-white">Fast Turnaround</span>
                    <p className="text-sm text-slate-400">Most projects completed within 1-3 days</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-[#73e28a] mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-white">Direct Communication</span>
                    <p className="text-sm text-slate-400">Work directly with me, no middlemen</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#73e28a] mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-white">27+ Years Experience</span>
                    <p className="text-sm text-slate-400">Full-stack developer since 1997</p>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </Section>

      {/* Process */}
      <Section className="py-24 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          {[
            { num: "01", title: "Contact", desc: "Tell me what you need" },
            { num: "02", title: "Scope", desc: "Get a clear quote" },
            { num: "03", title: "Build", desc: "I do the work" },
            { num: "04", title: "Deliver", desc: "You get results" }
          ].map((step, i) => (
            <div key={i} className="text-center group">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-[#73e28a] flex items-center justify-center text-[#73e28a] font-bold text-xl group-hover:bg-[#73e28a] group-hover:text-black transition-all">
                {step.num}
              </div>
              <h4 className="text-white font-bold mb-2">{step.title}</h4>
              <p className="text-slate-400 text-sm max-w-[140px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Already Own BaseCMS? */}
      <Section className="py-16 relative">
        <Card className="p-8 bg-slate-800/30 border-slate-700 max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#73e28a]/10 flex items-center justify-center">
            <Layout className="w-7 h-7 text-[#73e28a]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Already Own BaseCMS?</h3>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            If you've already purchased BaseCMS from the Base44 marketplace and need support, access your app dashboard for help and documentation.
          </p>
          <a 
            href="https://basecms.base44.app" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-12 px-8 rounded-full">
              Go to BaseCMS Dashboard <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          </a>
        </Card>
      </Section>

      {/* CTA */}
      <Section className="py-24 bg-slate-900/30 relative">
        <GlowingOrb position="center" size="500px" opacity={0.1} />
        
        <div className="relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Tell me about your BaseCMS project and I'll get back to you within 24 hours with a plan.
          </p>
          <Link to={createPageUrl('Contact')}>
            <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold text-lg h-14 px-10 rounded-full">
              Contact Me <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </Section>

      {/* Service Request Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedService?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="p-4 bg-slate-800/50 rounded-lg flex items-center justify-between">
              <span className="text-slate-400">Service Price:</span>
              <div className="text-right">
                {selectedService?.priceSubtext && (
                  <span className="text-xs text-slate-500 block">{selectedService.priceSubtext}</span>
                )}
                <span className="text-xl font-bold text-[#73e28a]">{selectedService?.price}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">Your Name *</Label>
                <Input
                  placeholder="John Doe"
                  className="bg-slate-800 border-slate-700 text-white"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Phone (optional)</Label>
                <Input
                  type="tel"
                  placeholder="+1 555-123-4567"
                  className="bg-slate-800 border-slate-700 text-white"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400">Email *</Label>
              <Input
                type="email"
                placeholder="john@example.com"
                className="bg-slate-800 border-slate-700 text-white"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400">Project Details *</Label>
              <Textarea
                placeholder="Tell me about your project and what you need help with..."
                className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            <Button 
              onClick={() => submitMutation.mutate(formData)}
              disabled={!formData.name || !formData.email || !formData.description || submitMutation.isPending}
              className="w-full bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-12"
            >
              {submitMutation.isPending ? 'Processing...' : `Pay ${selectedService?.price} & Submit`}
            </Button>

            {submitMutation.isError && (
              <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Success Dialog */}
      <Dialog open={paymentSuccess} onOpenChange={setPaymentSuccess}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-[#73e28a]/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-[#73e28a]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Thank You for Your Order!</h3>
              <p className="text-slate-400">
                Your BaseCMS service request has been received. I'll reach out to you within 24 hours to get started.
              </p>
            </div>
            <Button 
              onClick={() => setPaymentSuccess(false)}
              className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}