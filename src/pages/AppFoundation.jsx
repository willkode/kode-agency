import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { track, trackPurchase, usePageView, useScrollDepth, useTimeOnPage } from '@/components/analytics/useAnalytics';
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import GridBackground from '@/components/ui-custom/GridBackground';
import FloatingPixels from '@/components/ui-custom/FloatingPixels';
import SEO, { createServiceSchema, createFAQSchema, createBreadcrumbSchema } from '@/components/SEO';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  ArrowRight, 
  CheckCircle, 
  X,
  Layers,
  Database,
  Plug,
  Rocket,
  FileText,
  Users,
  Settings,
  ExternalLink,
  Zap
} from 'lucide-react';

export default function AppFoundationPage() {
  usePageView('app_foundation');
  useScrollDepth('app_foundation');
  useTimeOnPage('app_foundation');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    app_name: '',
    app_description: '',
    target_users: '',
    core_features: '',
    integrations: [],
    other_integrations: '',
    auth_requirements: '',
    database_needs: '',
    preferred_platform: '',
    deadline: '',
    reference_links: '',
    addons: [],
    confirm_foundation_only: false,
    confirm_no_ui_design: false,
    confirm_no_ongoing_dev: false,
    confirm_own_secrets: false
  });

  const addonOptions = [
    { id: 'ui_starter', name: 'UI Starter Pack', price: 200, desc: 'Basic layout system + reusable components (not custom design)' },
    { id: 'phase2_roadmap', name: 'Phase 2 Roadmap', price: 99, desc: 'Prioritized build plan + backlog + milestones' },
    { id: 'integration_deep', name: 'Integration Deep Setup', price: 150, desc: 'Fully configured integration beyond baseline wiring (per integration)' },
  ];

  const calculateTotal = () => {
    const base = 500;
    const addonsTotal = formData.addons.reduce((sum, addonId) => {
      const addon = addonOptions.find(a => a.id === addonId);
      return sum + (addon ? addon.price : 0);
    }, 0);
    return base + addonsTotal;
  };

  const handleAddonToggle = (addonId) => {
    setFormData(prev => ({
      ...prev,
      addons: prev.addons.includes(addonId)
        ? prev.addons.filter(id => id !== addonId)
        : [...prev.addons, addonId]
    }));
  };

  // Handle return from Stripe
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');
    
    if (success === 'true' && sessionId) {
      // Read total from URL param since calculateTotal() uses state which resets on page reload
      const totalParam = urlParams.get('total');
      const amount = totalParam ? parseInt(totalParam) : 500;
      base44.functions.invoke('handleStripeSuccess', { sessionId })
        .then(res => {
          if (res.data.success) {
            setPaymentSuccess(true);
            track('app_foundation_payment_success', { session_id: sessionId, amount });
            trackPurchase(sessionId, amount, 'App Foundation');
          }
        })
        .catch(err => console.error('Payment handling failed:', err));
      
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      const created = await base44.entities.AppFoundationRequest.create({
        ...data,
        integrations: data.integrations.join(', '),
        total_amount: calculateTotal(),
        payment_status: 'pending'
      });
      
      // Send lead notification email
      base44.functions.invoke('notifyNewLead', {
        name: data.name,
        email: data.email,
        phone: '',
        payment_status: 'pending',
        service: 'App Foundation',
        amount: calculateTotal()
      }).catch(err => console.error('Lead notification failed:', err));
      
      return created;
    },
    onSuccess: async (created) => {
      const total = calculateTotal();
      const response = await base44.functions.invoke('createStripeCheckout', { 
        service: 'AppFoundation',
        requestId: created.id,
        amount: total,
        description: 'Done-For-You App Foundation - Core scaffolding & integrations',
        customerEmail: formData.email,
        customerName: formData.name,
        metadata: { 
          appName: formData.app_name,
          platform: formData.preferred_platform,
          total_amount: String(total)
        }
      });
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    }
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleIntegrationToggle = (integration) => {
    setFormData(prev => ({
      ...prev,
      integrations: prev.integrations.includes(integration)
        ? prev.integrations.filter(i => i !== integration)
        : [...prev.integrations, integration]
    }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.app_name || !formData.app_description) return;
      setStep(2);
    } else if (step === 2) {
      if (!formData.core_features || !formData.preferred_platform) return;
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      if (!formData.confirm_foundation_only || !formData.confirm_no_ui_design || 
          !formData.confirm_no_ongoing_dev || !formData.confirm_own_secrets) return;
      setStep(5);
      submitMutation.mutate({ ...formData, total_amount: calculateTotal() });
    }
  };

  const deliverables = [
    {
      icon: Layers,
      title: "Complete App Scaffolding",
      items: ["Project structure organized by features/modules", "Core routing / navigation structure", "Standard error handling + environment configuration patterns"]
    },
    {
      icon: Database,
      title: "Data & Core Logic Foundation",
      items: ["Baseline database entities aligned to your app concept", "Core relationships (users, organizations, roles, key records)", "Basic create/read/update/delete flows where appropriate"]
    },
    {
      icon: Plug,
      title: "Basic API Integrations (Wired and Ready)",
      items: ["Authentication setup (platform-dependent)", "Payment provider baseline wiring (if applicable)", "Email provider baseline wiring (if applicable)", "Third-party API connector pattern"]
    },
    {
      icon: Rocket,
      title: "Deployment-Ready Project",
      items: ["Your app foundation will run, build, and deploy", "Clear handoff notes on where to plug in secrets", "Recommended expansion roadmap"]
    }
  ];

  const notIncluded = [
    "Ongoing or continuous app development",
    "Advanced features, custom workflows, or deep business logic",
    "UI design, custom branding, or high-polish interface work",
    "Copywriting, content entry, or marketing pages",
    "Complex third-party integrations requiring extensive configuration",
    "Data migration, large imports, or advanced analytics setups"
  ];

  const steps = [
    { num: 1, title: "Submit Your App Concept", desc: "Complete a short intake form describing what you're building (5-10 minutes)" },
    { num: 2, title: "I Build the Foundation", desc: "I scaffold the project, structure core entities, and wire baseline integrations" },
    { num: 3, title: "Delivery + Handoff", desc: "You receive the working project foundation, setup notes, and expansion roadmap" }
  ];

  const idealFor = [
    "You have an app idea and want a real starting point (not a blank canvas)",
    "You want clean architecture and integrations set up the right way",
    "You plan to expand the app yourself, with a contractor, or with Kode Agency later",
    "You want to reduce risk and avoid rebuilding from scratch"
  ];

  const notIdealFor = [
    "You need a pixel-perfect design or custom UI system",
    "You need complex logic and many edge cases handled immediately",
    "You want full product build and ongoing feature development for $500"
  ];

  const faqs = [
    { q: "What exactly does \"app scaffolding\" mean?", a: "It means the core structure: organized project, baseline data models, foundational pages/routes, and integration wiring so you can build features on top without redoing the architecture." },
    { q: "Will the app be \"complete\"?", a: "It will be complete as a foundation: deployable and structured, with baseline integrations. It is not a finished product with full features and polished design." },
    { q: "Do you add my API keys?", a: "I can wire everything to accept keys, but you will add your own secrets. If you prefer, you can provide them securely and I'll place them where required." },
    { q: "What platforms do you support?", a: "Base44, Lovable, Replit, and custom stacks depending on your needs. The intake form will determine the best fit." },
    { q: "Can I upgrade to ongoing development after this?", a: "Yes. This offer is intentionally designed as Phase 1. If you want to keep going, we'll scope Phase 2 based on your priorities." },
    { q: "What if I need UI design too?", a: "UI design is not included. If you want professional UI/UX, we can add a separate design sprint or conversion-focused UI package." }
  ];

  const integrationOptions = ["Stripe", "PayPal", "SendGrid", "Mailchimp", "Twilio", "OpenAI", "Google APIs", "Supabase", "Firebase"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Services", url: "/Services" },
        { name: "App Foundation", url: "/AppFoundation" }
      ]),
      createServiceSchema("Done-For-You App Foundation", "Complete app scaffolding with data models and integrations for $500.", "/AppFoundation"),
      createFAQSchema(faqs)
    ]
  };

  return (
    <div className="flex flex-col bg-slate-950 text-white overflow-hidden">
      <SEO 
        title="App Foundation - Done-For-You Scaffolding for $500"
        description="Get a complete app foundation with organized structure, core data models, API integrations wired in, and deployment-ready project. $500 flat rate, one-time setup."
        keywords={["app scaffolding", "app foundation", "Base44 setup", "MVP foundation", "app architecture", "startup app development"]}
        url="/AppFoundation"
        jsonLd={jsonLd}
      />
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
        <GridBackground />
        <FloatingPixels count={20} />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#73e28a]/10 border border-[#73e28a]/30 rounded-full px-4 py-2 mb-6">
            <Layers className="w-4 h-4 text-[#73e28a]" />
            <span className="text-[#73e28a] text-sm font-medium">Fixed-Scope Foundation Build</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Done-For-You <span className="text-[#73e28a]">App Foundation</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-4">
            Build the core scaffolding and working foundation of your app so you can launch faster and expand confidently.
          </p>
          
          <div className="mb-8">
            <p className="text-5xl md:text-6xl font-bold text-[#73e28a]">$500</p>
            <p className="text-slate-500">Flat Rate • One-Time Setup</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400 mb-8 max-w-2xl mx-auto">
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#73e28a]" /> Clean, organized app structure</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#73e28a]" /> Core data models & baseline logic</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#73e28a]" /> Common API integrations wired in</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#73e28a]" /> Built to scale</span>
          </div>
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold text-lg h-14 px-10 rounded-full"
          >
            Get the $500 App Foundation <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <p className="text-slate-500 text-sm mt-6">
            One-time setup • Clear scope • Built fast
          </p>
        </div>
      </section>

      {/* What You Get */}
      <Section className="py-24 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What You Get
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            This is the "core skeleton" of your app—ready to extend.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {deliverables.map((item, index) => (
            <Card key={index} className="p-6 bg-slate-900/50 border-slate-800 hover:border-[#73e28a]/50">
              <div className="w-12 h-12 rounded-xl bg-[#73e28a]/10 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-[#73e28a]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-4">{item.title}</h3>
              <ul className="space-y-2">
                {item.items.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <CheckCircle className="w-4 h-4 text-[#73e28a] mt-0.5 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          Note: You will add your own API keys/secrets in your environment settings.
        </p>
      </Section>

      {/* What's Not Included */}
      <Section className="py-24 bg-slate-900/50 relative">
        <GridBackground />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What's Not Included
            </h2>
            <p className="text-slate-400">
              To keep this $500 offer fast, predictable, and profitable:
            </p>
          </div>

          <Card className="p-8 bg-slate-800/50 border-slate-700">
            <ul className="space-y-4">
              {notIncluded.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-300">
                  <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-slate-500 text-sm mt-6 pt-6 border-t border-slate-700">
              If you want those, we can quote Phase 2 after the foundation is delivered.
            </p>
          </Card>
        </div>
      </Section>

      {/* How It Works */}
      <Section className="py-24 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#73e28a] text-black font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Who This Is For */}
      <Section className="py-24 bg-slate-900/50 relative">
        <GridBackground />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Who This Is For
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <h3 className="text-lg font-bold text-[#73e28a] mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Ideal If...
              </h3>
              <ul className="space-y-3">
                {idealFor.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-[#73e28a] mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                <X className="w-5 h-5" /> Not Ideal If...
              </h3>
              <ul className="space-y-3">
                {notIdealFor.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-400">
                    <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="py-24 relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-slate-900/50 border border-slate-800 rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-[#73e28a] text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-400">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-24 bg-slate-900/50 relative">
        <GridBackground />
        <div className="relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get the $500 App Foundation
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Start with a solid base you can grow—without wasting time or rebuilding later.
          </p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold text-lg h-14 px-10 rounded-full"
          >
            Purchase & Start Intake <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-slate-500 text-sm mt-4">
            Fixed scope • Foundation only • Expansion is optional
          </p>
        </div>
      </Section>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          {!paymentSuccess && (
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {step === 1 && "Step 1: Basic Info"}
                {step === 2 && "Step 2: App Details"}
                {step === 3 && "Step 3: Add-Ons"}
                {step === 4 && "Step 4: Confirm Scope"}
                {step === 5 && "Processing Payment..."}
              </DialogTitle>
              <div className="flex gap-2 mt-2">
                {[1,2,3,4].map(s => (
                  <div key={s} className={`h-1 flex-1 rounded ${s <= step ? 'bg-[#73e28a]' : 'bg-slate-700'}`} />
                ))}
              </div>
            </DialogHeader>
          )}

          {step === 1 && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-400">Your Name *</Label>
                  <Input
                    required
                    placeholder="John Doe"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Email *</Label>
                  <Input
                    required
                    type="email"
                    placeholder="john@example.com"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-400">App Name *</Label>
                <Input
                  required
                  placeholder="My Awesome App"
                  className="bg-slate-800 border-slate-700 text-white"
                  value={formData.app_name}
                  onChange={(e) => handleChange('app_name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-400">One-Sentence Description *</Label>
                <Textarea
                  required
                  placeholder="A brief description of what your app does..."
                  className="bg-slate-800 border-slate-700 text-white min-h-[80px]"
                  value={formData.app_description}
                  onChange={(e) => handleChange('app_description', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-400">Target Users (who uses it)</Label>
                <Input
                  placeholder="Small business owners, freelancers, etc."
                  className="bg-slate-800 border-slate-700 text-white"
                  value={formData.target_users}
                  onChange={(e) => handleChange('target_users', e.target.value)}
                />
              </div>

              <Button 
                onClick={handleNextStep}
                disabled={!formData.name || !formData.email || !formData.app_name || !formData.app_description}
                className="w-full bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-12"
              >
                Next: App Details <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-slate-400">Core Features to Scaffold (3-8 bullets) *</Label>
                <Textarea
                  required
                  placeholder="- User authentication&#10;- Dashboard with analytics&#10;- Payment processing&#10;- Email notifications"
                  className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                  value={formData.core_features}
                  onChange={(e) => handleChange('core_features', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-400">Required Integrations</Label>
                <div className="grid grid-cols-3 gap-2">
                  {integrationOptions.map(integration => (
                    <button
                      key={integration}
                      type="button"
                      onClick={() => handleIntegrationToggle(integration)}
                      className={`px-3 py-2 rounded text-sm border transition-colors ${
                        formData.integrations.includes(integration)
                          ? 'bg-[#73e28a]/20 border-[#73e28a] text-[#73e28a]'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {integration}
                    </button>
                  ))}
                </div>
                <Input
                  placeholder="Other integrations..."
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                  value={formData.other_integrations}
                  onChange={(e) => handleChange('other_integrations', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-400">Auth Requirements</Label>
                  <Select value={formData.auth_requirements} onValueChange={(v) => handleChange('auth_requirements', v)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="users_only">Users Only</SelectItem>
                      <SelectItem value="users_and_orgs">Users + Organizations</SelectItem>
                      <SelectItem value="users_orgs_roles">Users + Orgs + Roles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Database Needs</Label>
                  <Select value={formData.database_needs} onValueChange={(v) => handleChange('database_needs', v)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="complex">Complex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-400">Deadline (optional)</Label>
                  <Input
                    type="date"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={formData.deadline}
                    onChange={(e) => handleChange('deadline', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Reference Links</Label>
                  <Input
                    placeholder="https://..."
                    className="bg-slate-800 border-slate-700 text-white"
                    value={formData.reference_links}
                    onChange={(e) => handleChange('reference_links', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-slate-700 text-slate-400 hover:text-white"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNextStep}
                  disabled={!formData.core_features}
                  className="flex-1 bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold"
                >
                  Next: Add-Ons
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 mt-4">
              <p className="text-slate-400 text-sm">
                Optional add-ons to enhance your foundation:
              </p>

              <div className="space-y-3">
                {addonOptions.map((addon) => (
                  <label 
                    key={addon.id}
                    className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-colors ${
                      formData.addons.includes(addon.id) 
                        ? 'bg-[#73e28a]/10 border border-[#73e28a]/50' 
                        : 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <Checkbox 
                      checked={formData.addons.includes(addon.id)}
                      onCheckedChange={() => handleAddonToggle(addon.id)}
                      className="mt-0.5 border-slate-600 data-[state=checked]:bg-[#73e28a] data-[state=checked]:border-[#73e28a]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{addon.name}</span>
                        <span className="text-[#73e28a] font-bold">+${addon.price}</span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">{addon.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Base Foundation</span>
                  <span>$500</span>
                </div>
                {formData.addons.map(addonId => {
                  const addon = addonOptions.find(a => a.id === addonId);
                  return addon ? (
                    <div key={addonId} className="flex justify-between text-sm text-slate-400 mb-2">
                      <span>{addon.name}</span>
                      <span>+${addon.price}</span>
                    </div>
                  ) : null;
                })}
                <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-slate-700 mt-2">
                  <span>Total</span>
                  <span className="text-[#73e28a]">${calculateTotal()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 border-slate-700 text-slate-400 hover:text-white"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNextStep}
                  className="flex-1 bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold"
                >
                  Next: Confirm Scope
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 mt-4">
              <p className="text-slate-400 text-sm">
                Please confirm you understand the scope of this offer:
              </p>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-800/80">
                  <Checkbox 
                    checked={formData.confirm_foundation_only}
                    onCheckedChange={(checked) => handleChange('confirm_foundation_only', checked)}
                    className="mt-0.5 border-slate-600 data-[state=checked]:bg-[#73e28a] data-[state=checked]:border-[#73e28a]"
                  />
                  <span className="text-sm text-slate-300">I understand this is foundation/scaffolding only.</span>
                </label>

                <label className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-800/80">
                  <Checkbox 
                    checked={formData.confirm_no_ui_design}
                    onCheckedChange={(checked) => handleChange('confirm_no_ui_design', checked)}
                    className="mt-0.5 border-slate-600 data-[state=checked]:bg-[#73e28a] data-[state=checked]:border-[#73e28a]"
                  />
                  <span className="text-sm text-slate-300">I understand UI design is not included.</span>
                </label>

                <label className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-800/80">
                  <Checkbox 
                    checked={formData.confirm_no_ongoing_dev}
                    onCheckedChange={(checked) => handleChange('confirm_no_ongoing_dev', checked)}
                    className="mt-0.5 border-slate-600 data-[state=checked]:bg-[#73e28a] data-[state=checked]:border-[#73e28a]"
                  />
                  <span className="text-sm text-slate-300">I understand ongoing development is not included.</span>
                </label>

                <label className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-800/80">
                  <Checkbox 
                    checked={formData.confirm_own_secrets}
                    onCheckedChange={(checked) => handleChange('confirm_own_secrets', checked)}
                    className="mt-0.5 border-slate-600 data-[state=checked]:bg-[#73e28a] data-[state=checked]:border-[#73e28a]"
                  />
                  <span className="text-sm text-slate-300">I will provide my own API secrets.</span>
                </label>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                <span className="text-slate-400">Total: </span>
                <span className="text-2xl font-bold text-[#73e28a]">${calculateTotal()}</span>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setStep(3)}
                  className="flex-1 border-slate-700 text-slate-400 hover:text-white"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNextStep}
                  disabled={!formData.confirm_foundation_only || !formData.confirm_no_ui_design || !formData.confirm_no_ongoing_dev || !formData.confirm_own_secrets || submitMutation.isPending}
                  className="flex-1 bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold"
                >
                  {submitMutation.isPending ? 'Processing...' : `Pay $${calculateTotal()}`}
                </Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 mt-4 text-center">
              <div className="w-16 h-16 bg-[#73e28a]/20 rounded-full flex items-center justify-center mx-auto">
                <ExternalLink className="w-8 h-8 text-[#73e28a]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Redirecting to Checkout...</h3>
                <p className="text-slate-400">
                  Complete your ${calculateTotal()} payment to finalize your App Foundation request.
                </p>
              </div>
              <p className="text-sm text-slate-500">
                Please wait while we redirect you to secure checkout...
              </p>
            </div>
          )}
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
              <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
              <p className="text-slate-400">
                Thank you! Your App Foundation request has been submitted. I'll start building your foundation and reach out via email with updates.
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