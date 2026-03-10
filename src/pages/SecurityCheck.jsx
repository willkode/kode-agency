import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { track, trackPurchase, usePageView, useScrollDepth, useTimeOnPage } from '@/components/analytics/useAnalytics';
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import GridBackground from '@/components/ui-custom/GridBackground';
import FloatingPixels from '@/components/ui-custom/FloatingPixels';
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
  Shield, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  Copy,
  ExternalLink,
  Eye,
  Database,
  Code
} from 'lucide-react';

export default function SecurityCheckPage() {
  usePageView('security_check');
  useScrollDepth('security_check');
  useTimeOnPage('security_check');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    app_url: '',
    description: ''
  });

  // Handle return from Stripe
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');
    
    if (success === 'true' && sessionId) {
      base44.functions.invoke('handleStripeSuccess', { sessionId })
        .then(res => {
          if (res.data.success) {
            setPaymentSuccess(true);
            track('security_check_payment_success', { session_id: sessionId, amount: 20 });
            trackPurchase(sessionId, 20, 'Security Check');
          }
        })
        .catch(err => console.error('Payment handling failed:', err));
      
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      const created = await base44.entities.SecurityCheckRequest.create({
        ...data,
        payment_amount: 20
      });
      
      base44.functions.invoke('notifyNewLead', {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        payment_status: 'pending',
        service: 'Security Check',
        amount: 20
      }).catch(err => console.error('Lead notification failed:', err));
      
      const response = await base44.functions.invoke('createStripeCheckout', { 
        service: 'SecurityCheck',
        requestId: created.id,
        amount: 20,
        description: 'Base44 Security Check Service',
        customerEmail: data.email,
        customerName: data.name
      });
      
      return { created, stripeUrl: response.data.url };
    },
    onSuccess: ({ created, stripeUrl }) => {
      setRequestId(created.id);
      setStep(3);
      
      if (stripeUrl) {
        window.location.href = stripeUrl;
      }
    }
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.country || !formData.app_url || !formData.description) {
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
      submitMutation.mutate(formData);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('iamwillkode@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const services = [
    {
      icon: Shield,
      title: "Entity Security Audit",
      items: ["RLS policy review", "Permission checks", "Access control gaps", "Data exposure risks"]
    },
    {
      icon: Code,
      title: "Backend Function Security",
      items: ["Service role abuse", "Missing auth checks", "Input validation", "Error handling"]
    },
    {
      icon: Database,
      title: "Data Protection Review",
      items: ["Sensitive field protection", "Cross-tenant isolation", "Payment field security", "User data safety"]
    },
    {
      icon: Eye,
      title: "Detailed Report",
      items: ["Severity ratings", "Exact locations", "Fix recommendations", "Priority actions"]
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Services", url: "/Services" },
        { name: "Security Check", url: "/SecurityCheck" }
      ]),
      createServiceSchema("Base44 Security Check", "Professional security audit for Base44 apps. $20 one-time comprehensive security review.", "/SecurityCheck")
    ]
  };

  return (
    <div className="flex flex-col bg-slate-950 text-white overflow-hidden">
      <SEO 
        title="Security Check - Base44 App Security Audit"
        description="Professional security audit for Base44 apps. $20 comprehensive review covering entity security, backend functions, data protection, and access control."
        keywords={["Base44 security", "app security audit", "Base44 security check", "security review", "vulnerability scan"]}
        url="/SecurityCheck"
        jsonLd={jsonLd}
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
        <GridBackground />
        <FloatingPixels count={20} />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#73e28a]/10 border border-[#73e28a]/30 rounded-full px-4 py-2 mb-6">
            <Shield className="w-4 h-4 text-[#73e28a]" />
            <span className="text-[#73e28a] text-sm font-medium">Security Audit Service</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Security <span className="text-[#73e28a]">Check</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-4">
            Comprehensive Security Audit for Your Base44 App
          </p>
          <div className="text-center mb-8">
            <p className="text-4xl md:text-5xl font-bold text-[#73e28a]">$20</p>
            <p className="text-slate-500 text-sm">One-Time Security Audit</p>
          </div>
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold text-lg h-14 px-10 rounded-full"
          >
            Get Security Audit <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <p className="text-slate-500 text-sm mt-6">
            Expert security review • Full coverage • Actionable recommendations
          </p>
        </div>
      </section>

      {/* What's Included */}
      <Section className="py-24 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What's Included in the Security Check
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A complete security audit covering entities, backend functions, access control, and data protection.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="p-6 bg-slate-900/50 border-slate-800 hover:border-[#73e28a]/50">
              <div className="w-12 h-12 rounded-xl bg-[#73e28a]/10 flex items-center justify-center mb-4">
                <service.icon className="w-6 h-6 text-[#73e28a]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-4">{service.title}</h3>
              <ul className="space-y-2">
                {service.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <CheckCircle className="w-4 h-4 text-[#73e28a] mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      {/* Why This Matters */}
      <Section className="py-24 bg-slate-900/50 relative">
        <GridBackground />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Why Security Matters</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Unsecured apps can leak customer data</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Users can access or modify data they shouldn't</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Payment manipulation can cost you money</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Backend functions may have privilege escalation risks</span>
                </li>
              </ul>
            </div>
            <Card className="p-8 bg-slate-800/50 border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">What You Get</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-[#73e28a] mt-0.5" />
                  Complete entity RLS policy audit
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-[#73e28a] mt-0.5" />
                  Backend function security review
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-[#73e28a] mt-0.5" />
                  Data access and protection analysis
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-[#73e28a] mt-0.5" />
                  Detailed report with fix instructions
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-[#73e28a] mt-0.5" />
                  Priority ranking of issues
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-24 relative">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Secure Your App Today
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Get peace of mind with a professional security audit for just $20.
          </p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold text-lg h-14 px-10 rounded-full"
          >
            Start Security Check <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </Section>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
          {!paymentSuccess && (
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {step === 1 && "Security Check Request"}
              {step === 2 && "Grant Collaborator Access"}
              {step === 3 && "Complete Payment"}
            </DialogTitle>
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
                  <Label className="text-slate-400">Country *</Label>
                  <Input
                    required
                    placeholder="United States"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                <Label className="text-slate-400">Base44 App URL *</Label>
                <Input
                  required
                  placeholder="https://yourapp.base44.app"
                  className="bg-slate-800 border-slate-700 text-white"
                  value={formData.app_url}
                  onChange={(e) => handleChange('app_url', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-400">What should we focus on? *</Label>
                <Textarea
                  required
                  placeholder="Tell us about any specific security concerns or areas you'd like us to review..."
                  className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>

              <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                <span className="text-slate-400">Total: </span>
                <span className="text-xl font-bold text-[#73e28a]">$20</span>
              </div>

              <Button 
                onClick={handleNextStep}
                disabled={!formData.name || !formData.email || !formData.country || !formData.app_url || !formData.description}
                className="w-full bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-12"
              >
                Next: Grant Access <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 mt-4">
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="font-bold text-white mb-4">Follow these steps:</h3>
                <ol className="space-y-4 text-sm">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#73e28a] text-black font-bold flex items-center justify-center flex-shrink-0">1</span>
                    <span className="text-slate-300">Open your Base44 app editor</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#73e28a] text-black font-bold flex items-center justify-center flex-shrink-0">2</span>
                    <span className="text-slate-300">Click the <strong>Share</strong> button (next to Publish)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#73e28a] text-black font-bold flex items-center justify-center flex-shrink-0">3</span>
                    <div className="text-slate-300">
                      Send an invite with <strong>Collaborator</strong> access to:
                      <div className="flex items-center gap-2 mt-2">
                        <code className="bg-slate-900 px-3 py-1 rounded text-[#73e28a]">iamwillkode@gmail.com</code>
                        <button 
                          onClick={copyEmail}
                          className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                        >
                          {copied ? <CheckCircle className="w-4 h-4 text-[#73e28a]" /> : <Copy className="w-4 h-4 text-slate-400" />}
                        </button>
                      </div>
                    </div>
                  </li>
                </ol>
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
                  disabled={submitMutation.isPending}
                  className="flex-1 bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold"
                >
                  {submitMutation.isPending ? 'Processing...' : 'I\'ve Sent the Invite'}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 mt-4 text-center">
              <div className="w-16 h-16 bg-[#73e28a]/20 rounded-full flex items-center justify-center mx-auto">
                <ExternalLink className="w-8 h-8 text-[#73e28a]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Redirecting to Checkout...</h3>
                <p className="text-slate-400">
                  Complete your $20 payment to finalize the security check request.
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
              <h3 className="text-xl font-bold text-white mb-2">Thank You for Your Order!</h3>
              <p className="text-slate-400">
                Your security check request has been received. We will complete the audit within 24-48 hours (excluding weekends).
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