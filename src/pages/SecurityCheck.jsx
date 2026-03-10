import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { track, trackPurchase, usePageView, useScrollDepth, useTimeOnPage } from '@/components/analytics/useAnalytics';
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import SectionLabel from '@/components/ui-custom/SectionLabel';
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
  Code,
  X,
  Check,
  Zap,
  Users,
  Settings,
  Key,
  List,
  Clock,
  FileText
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Services", url: "/Services" },
        { name: "Security Check", url: "/SecurityCheck" }
      ]),
      createServiceSchema("Base44 Security Scan", "Manual security audit for Base44 apps covering vulnerabilities the built-in scanner can't see. $20 comprehensive review.", "/SecurityCheck")
    ]
  };

  return (
    <div className="flex flex-col bg-slate-950 text-white overflow-hidden">
      <SEO 
        title="Base44 Security Scan - Manual Security Audit for Base44 Apps"
        description="We manually audit your Base44 app for vulnerabilities the built-in security tab can't see. Get exact fix prompts for every issue. $20 delivered within 48 hours."
        keywords={["Base44 security", "app security audit", "Base44 security check", "security review", "vulnerability scan", "RLS audit", "backend function security"]}
        url="/SecurityCheck"
        jsonLd={jsonLd}
      />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <GridBackground />
        <FloatingPixels count={30} />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-6">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm font-medium">Critical Security Gap</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Base44 Security Scan
            </h1>
            
            <div className="mb-8 space-y-2">
              <p className="text-2xl text-white font-semibold">
                Your Base44 app passed the built-in RLS scanner.
              </p>
              <p className="text-2xl text-slate-300 font-semibold">
                That doesn't mean it's secure.
              </p>
            </div>

            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              We manually audit your Base44 app for the vulnerabilities the built-in security tab can't see. We pull all your entities and run over 100+ attack simulations on each one to ensure they're truly secure — then give you the exact prompts to fix every issue we find.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-8 text-lg group"
              >
                Get My App Scanned — $20
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <p className="text-sm text-slate-400 mb-12">
              Delivered within 48 hours · Fix prompts included · No code knowledge needed
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { icon: Shield, label: "Manual Audit" },
                { icon: FileText, label: "Full Report" },
                { icon: Code, label: "Fix Prompts" },
                { icon: Clock, label: "48hr Delivery" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                  <item.icon className="w-6 h-6 text-[#73e28a]" />
                  <span className="text-sm text-slate-300 text-center">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why We Built This */}
      <Section className="py-24">
        <div className="max-w-4xl mx-auto">
          <SectionLabel text="Origin Story" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Why we built this</h2>
          <p className="text-2xl text-slate-300 mb-8 font-semibold">
            We found these vulnerabilities in our own Base44 apps.
          </p>
          <p className="text-xl text-slate-300 mb-8">
            Then we looked at how other Base44 apps were built and realised the same issues were everywhere.
          </p>

          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-8 mb-8">
            <p className="text-slate-300 leading-relaxed mb-6">
              While auditing two of our own production Base44 apps, we discovered that:
            </p>
            <ul className="space-y-3 mb-6 ml-4">
              <li className="flex items-start gap-3 text-slate-300">
                <span className="text-red-400 mt-1">•</span>
                <span><strong className="text-white">Authenticated users could permanently delete their own accounts with a single API call</strong></span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <span className="text-red-400 mt-1">•</span>
                <span><strong className="text-white">Unauthenticated visitors could write records directly to open entity endpoints</strong></span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <span className="text-red-400 mt-1">•</span>
                <span><strong className="text-white">The invite system had a privilege escalation path that let regular users grant themselves admin access</strong></span>
              </li>
            </ul>
            <p className="text-slate-300 leading-relaxed">
              None of these were flagged by Base44's Dashboard Security Tab. The scanner showed green across the board. The issues came from how the AI builder creates entities by default — public, writable, and without rate limiting — and from attack surfaces the scanner simply doesn't check.
            </p>
          </div>

          <p className="text-slate-300 leading-relaxed">
            We documented every finding, tested every fix, and built a manual review process around what we learned. This service is that process — applied to your app.
          </p>
        </div>
      </Section>

      {/* The Problem */}
      <Section className="py-24 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <SectionLabel text="The Gap" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">The problem</h2>
          <p className="text-2xl text-slate-300 mb-12">
            Base44's security scanner only covers one of seven attack surfaces.
          </p>
          <p className="text-lg text-slate-400 mb-12">
            Running the built-in scan is a good start. But it leaves most of your app unchecked.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* What it checks */}
            <Card className="p-8 bg-green-500/5 border-green-500/30">
              <div className="flex items-center gap-3 mb-6">
                <Check className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-white">What the Dashboard Security Tab checks</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Entity RLS rules for missing access controls",
                  "Overly permissive read/write policies",
                  "Public entity exposure",
                  "Admin-only restriction flags",
                  "Visual CRUD permission summary"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* What it doesn't check */}
            <Card className="p-8 bg-red-500/5 border-red-500/30">
              <div className="flex items-center gap-3 mb-6">
                <X className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-bold text-white">What it does not check</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Backend functions (service role abuse, missing auth checks)",
                  "Rate limiting on public-facing endpoints",
                  "Privilege escalation via invite or bulk endpoints",
                  "Storage exhaustion / database flooding attacks",
                  "Webhook signature validation",
                  "Automation and scheduled function security",
                  "Secrets and integration credential exposure",
                  "API endpoint abuse patterns"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300">
                    <X className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-yellow-400">AI-generated apps are especially at risk</strong> because the builder creates entities with open access rules by default — it prioritises getting your app working over locking it down. Developers who aren't security specialists see a passing scan and ship. The attack surface grows silently every time the AI adds a new entity.
            </p>
          </div>
        </div>
      </Section>

      {/* What We Audit */}
      <Section className="py-24">
        <div className="max-w-5xl mx-auto">
          <SectionLabel text="8 Check Categories" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">What we audit</h2>
          <p className="text-xl text-slate-300 mb-12">
            A manual review of every layer the scanner skips.
          </p>
          <p className="text-lg text-slate-400 mb-12">
            We go through your app the same way an attacker would — methodically, endpoint by endpoint.
          </p>

          <div className="space-y-6">
            {[
              {
                severity: "High",
                severityColor: "bg-orange-500/10 border-orange-500/30 text-orange-400",
                icon: Lock,
                title: "Unauthenticated Entity Access",
                desc: "Can visitors read or write your entities without logging in? We pull all your entities and run 100+ attack simulations on each — testing every endpoint for open GET and POST access, bulk operations, and bypass attempts."
              },
              {
                severity: "Critical",
                severityColor: "bg-red-500/10 border-red-500/30 text-red-400",
                icon: Users,
                title: "Privilege Escalation",
                desc: "Can a regular user grant themselves admin or owner access via the invite endpoint, bulk create, or role update paths?"
              },
              {
                severity: "High",
                severityColor: "bg-orange-500/10 border-orange-500/30 text-orange-400",
                icon: AlertTriangle,
                title: "Destructive Self-Actions",
                desc: "Can authenticated users delete their own account, corrupt their profile, or trigger irreversible actions without confirmation?"
              },
              {
                severity: "Medium",
                severityColor: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
                icon: Zap,
                title: "Rate Limiting on Functions",
                desc: "Are your public-facing backend functions — contact forms, waitlist signups, submissions — throttled? We test for unbounded call loops."
              },
              {
                severity: "High",
                severityColor: "bg-orange-500/10 border-orange-500/30 text-orange-400",
                icon: Database,
                title: "Storage Exhaustion (DoS)",
                desc: "Can an attacker flood your open entity endpoints to bloat your database, hit your Base44 storage quota, and force an unplanned upgrade?"
              },
              {
                severity: "Medium",
                severityColor: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
                icon: Settings,
                title: "Backend Function Auth",
                desc: "Do your functions using asServiceRole have proper authentication checks? We look for service role abuse patterns that bypass all RLS rules."
              },
              {
                severity: "Low",
                severityColor: "bg-blue-500/10 border-blue-500/30 text-blue-400",
                icon: Key,
                title: "IDOR & Cross-User Access",
                desc: "Can users access or modify other users' records by guessing or enumerating IDs? We check read, update, and delete paths."
              },
              {
                severity: "Medium",
                severityColor: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
                icon: List,
                title: "Bulk Endpoint Abuse",
                desc: "Do your bulk create and update endpoints enforce the same restrictions as individual endpoints? We test for bypasses that slip through."
              }
            ].map((item, i) => (
              <Card key={i} className="p-6 bg-slate-900/80 border-slate-800 hover:border-[#73e28a]/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-[#73e28a]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${item.severityColor}`}>
                        {item.severity}
                      </span>
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    </div>
                    <p className="text-slate-400">{item.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* What You Get */}
      <Section className="py-24 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <SectionLabel text="Deliverables" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">What you get</h2>
          <p className="text-xl text-slate-300 mb-12">
            A full findings report with ready-to-paste fix prompts.
          </p>
          <p className="text-lg text-slate-400 mb-12">
            Not just a list of problems — everything you need to fix them in Base44 without writing a line of code.
          </p>

          <div className="space-y-6">
            {[
              {
                num: "1",
                title: "Findings summary with severity ratings",
                desc: "Every issue we find, classified as Critical / High / Medium / Low with a plain-English explanation of what it means and what an attacker could do with it."
              },
              {
                num: "2",
                title: "Affected endpoint and reproduction steps",
                desc: "The exact API endpoint, the request that triggers it, and what response confirms the vulnerability — so you can verify it yourself before fixing."
              },
              {
                num: "3",
                title: "Copy-paste fix prompts for the Base44 AI builder",
                desc: "For every finding, a ready-to-use prompt you paste directly into your Base44 builder to generate the fix. No security knowledge required."
              },
              {
                num: "4",
                title: "Confirmed safe controls",
                desc: "A list of everything we tested that is working correctly — so you know what doesn't need attention and can focus your effort where it matters."
              },
              {
                num: "5",
                title: "Remediation priority table",
                desc: "A ranked action list — what to fix immediately, what to fix this sprint, and what can wait — so you know where to start."
              }
            ].map((item, i) => (
              <Card key={i} className="p-6 bg-slate-900/80 border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#73e28a] text-black font-bold text-xl flex items-center justify-center flex-shrink-0">
                    {item.num}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400">{item.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Pricing */}
      <Section className="py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel text="Pricing" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Simple, flat-rate pricing.</h2>
            <p className="text-xl text-slate-400">
              No hourly billing. No retainer. Pay once, get your report.
            </p>
          </div>

          <p className="text-lg text-slate-300 text-center mb-12">
            Start with the scan. Add implementation if you want us to handle the fixes.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Security Scan */}
            <Card className="p-8 bg-slate-900/80 border-slate-800 hover:border-[#73e28a]/50 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-2">Security Scan + Report</h3>
              <p className="text-slate-400 mb-6">
                Manual audit of your Base44 app with a full findings report and fix prompts for every issue found.
              </p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-[#73e28a]">$20</span>
                <p className="text-slate-500 text-sm mt-1">one-time · delivered within 48 hours</p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Manual audit across all 8 check categories",
                  "Full findings report (PDF + Word)",
                  "Severity rating for each issue",
                  "Copy-paste Base44 builder fix prompts",
                  "Remediation priority table",
                  "List of confirmed safe controls"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-[#73e28a] mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-12"
              >
                Get My App Scanned
              </Button>
            </Card>

            {/* Scan + Implementation */}
            <Card className="p-8 bg-slate-900/80 border-[#73e28a] relative">
              <div className="absolute -top-3 right-8 bg-[#73e28a] text-black text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Scan + We Fix It</h3>
              <p className="text-slate-400 mb-6">
                Everything in the report, plus we implement all the fixes in your Base44 app directly.
              </p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-[#73e28a]">$70</span>
                <p className="text-slate-500 text-sm mt-1">$20 scan + $50 implementation · delivered within 48 hours</p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in the Security Scan",
                  "We apply every fix inside your Base44 builder",
                  "RLS rules locked down",
                  "Backend function auth hardened",
                  "Rate limiting added to public functions",
                  "Post-fix verification pass included"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-[#73e28a] mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-12"
              >
                Get My App Fixed
              </Button>
            </Card>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="py-24 bg-slate-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your app is live. Is it secure?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Most Base44 apps have at least one high-severity issue that the built-in scanner never flags. Find out what's in yours before someone else does.
          </p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-10 text-lg"
          >
            Get My App Scanned — $20
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