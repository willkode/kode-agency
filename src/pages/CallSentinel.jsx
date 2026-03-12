import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Card from "@/components/ui-custom/Card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PageHero from "@/components/ui-custom/PageHero";
import Section from "@/components/ui-custom/Section";
import GridBackground from "@/components/ui-custom/GridBackground";
import SectionLabel from "@/components/ui-custom/SectionLabel";
import GlowingOrb from "@/components/ui-custom/GlowingOrb";
import FloatingPixels from "@/components/ui-custom/FloatingPixels";
import { Shield, Eye, AlertTriangle, Lock, Bell, Activity, Zap, CheckCircle, ArrowRight, Terminal, Server, Database } from "lucide-react";
import { base44 } from '@/api/base44Client';
import { useToast } from "@/components/ui/use-toast";
import SEO from "@/components/SEO";
import { createBreadcrumbSchema, createServiceSchema } from "@/components/SEO";

export default function CallSentinel() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    app_description: '',
    monitoring_requirements: '',
    alert_preferences: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create or update lead
      await base44.functions.invoke('createOrUpdateLead', {
        name: formData.name,
        email: formData.email,
        source: 'Call Sentinel',
        description: `App: ${formData.app_description}\n\nMonitoring: ${formData.monitoring_requirements}\n\nAlerts: ${formData.alert_preferences}`,
      });

      // Send notification
      base44.functions.invoke('notifyNewLead', {
        name: formData.name,
        email: formData.email,
        phone: '',
        payment_status: 'N/A',
        service: 'Call Sentinel - Free Security Agent',
        amount: 0
      }).catch(err => console.error('Lead notification failed:', err));

      setSubmitted(true);
      toast({
        title: "Request Submitted!",
        description: "We'll set up your Call Sentinel agent and send you the details within 24 hours.",
      });
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: Eye,
      title: "24/7 Surveillance",
      desc: "Continuous monitoring of your Base44 app for suspicious patterns and unauthorized access attempts"
    },
    {
      icon: AlertTriangle,
      title: "Real-Time Alerts",
      desc: "Instant notifications when anomalies are detected - via email, SMS, or webhook endpoints"
    },
    {
      icon: Shield,
      title: "Intrusion Detection",
      desc: "AI-powered analysis of user behavior to identify potential security breaches before they escalate"
    },
    {
      icon: Lock,
      title: "Access Control Monitoring",
      desc: "Track permission changes, role escalations, and unauthorized data access across all entities"
    },
    {
      icon: Activity,
      title: "Activity Logging",
      desc: "Comprehensive audit trails of every action taken in your application with smart pattern recognition"
    },
    {
      icon: Database,
      title: "Data Integrity Checks",
      desc: "Automatic validation of critical data changes and detection of bulk modifications or deletions"
    }
  ];

  const useCases = [
    "Multi-tenant SaaS platforms with sensitive customer data",
    "Healthcare or financial apps requiring compliance monitoring",
    "Apps with admin panels that need breach detection",
    "Production systems where unauthorized changes must be caught immediately",
    "Any Base44 app handling PII or confidential business data"
  ];

  const howItWorks = [
    {
      num: "01",
      title: "Submit Your Requirements",
      desc: "Tell us about your app, what you want monitored, and how you want to be alerted"
    },
    {
      num: "02",
      title: "We Configure Call Sentinel",
      desc: "Our team sets up a custom AI agent tailored to your security needs and data model"
    },
    {
      num: "03",
      title: "Integration & Testing",
      desc: "We deploy the agent to your Base44 app and run test scenarios to ensure it works perfectly"
    },
    {
      num: "04",
      title: "Go Live",
      desc: "Your security monitoring starts immediately - you'll receive alerts based on your preferences"
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Services", url: "/Services" },
        { name: "Call Sentinel", url: "/CallSentinel" }
      ]),
      createServiceSchema(
        "Call Sentinel - Base44 Security Agent",
        "Free AI-powered intrusion detection and security monitoring system for Base44 applications. 24/7 surveillance, real-time alerts, and comprehensive audit trails.",
        "/CallSentinel"
      )
    ]
  };

  if (submitted) {
    return (
      <div className="bg-slate-950 text-white min-h-screen">
        <SEO 
          title="Call Sentinel - Request Submitted"
          description="Your Call Sentinel security monitoring request has been received."
          url="/CallSentinel"
        />
        <PageHero title="Request Received!" />
        
        <Section className="py-24 relative overflow-hidden">
          <GridBackground />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#73e28a]/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-[#73e28a]" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">We're Setting Up Your Security Agent</h2>
            <p className="text-slate-300 text-lg mb-8">
              Our team will configure Call Sentinel based on your requirements and have it running within 24 hours.
            </p>
            
            <Card className="p-6 bg-slate-900/80 text-left mb-8">
              <h3 className="text-lg font-bold text-white mb-4">What Happens Next:</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#73e28a] mt-0.5 flex-shrink-0" />
                  <span>We'll analyze your monitoring requirements and configure the AI agent</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#73e28a] mt-0.5 flex-shrink-0" />
                  <span>You'll receive an email with setup details and access instructions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#73e28a] mt-0.5 flex-shrink-0" />
                  <span>Call Sentinel will begin monitoring your app immediately after deployment</span>
                </li>
              </ul>
            </Card>
            
            <p className="text-slate-400 text-sm">
              A confirmation email has been sent to <strong className="text-white">{formData.email}</strong>
            </p>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-white">
      <SEO 
        title="Call Sentinel - AI Security Monitoring for Base44 Apps"
        description="Free AI-powered intrusion detection and security monitoring system. 24/7 surveillance, real-time alerts, access control monitoring, and comprehensive audit trails for your Base44 application."
        keywords={["security monitoring", "intrusion detection", "Base44 security", "AI security agent", "app monitoring", "access control"]}
        url="/CallSentinel"
        jsonLd={jsonLd}
      />
      
      <PageHero title="Call Sentinel" subtitle="AI-Powered Security Monitoring for Base44" />

      {/* Intro Section */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={20} />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel text="Free Security Agent" icon />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Your Base44 app's<br />
              <span className="text-[#73e28a]">24/7 security guardian.</span>
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              Call Sentinel is an AI-powered super agent that monitors your application for intrusions, unauthorized access, and suspicious behavior patterns.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              Get real-time alerts when something doesn't look right. From unusual permission changes to bulk data deletions, Call Sentinel watches everything and notifies you instantly.
            </p>
            
            <div className="flex items-center gap-4 p-4 bg-[#73e28a]/10 border border-[#73e28a]/30 rounded-lg mb-8">
              <Zap className="w-6 h-6 text-[#73e28a] flex-shrink-0" />
              <p className="text-white font-semibold">100% Free - No credit card required</p>
            </div>
            
            <Button 
              onClick={() => document.getElementById('request-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-8 text-lg"
            >
              Get Call Sentinel Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          
          <div className="relative">
            <Card className="p-8 bg-slate-900/80 border-[#73e28a]/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#73e28a]/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#73e28a]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Active Monitoring</h3>
                  <p className="text-slate-400 text-sm">Continuous surveillance</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-300">User Access Patterns</span>
                  <Activity className="w-5 h-5 text-[#73e28a]" />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-300">Permission Changes</span>
                  <Lock className="w-5 h-5 text-[#73e28a]" />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-300">Data Modifications</span>
                  <Database className="w-5 h-5 text-[#73e28a]" />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-300">API Request Anomalies</span>
                  <Server className="w-5 h-5 text-[#73e28a]" />
                </div>
              </div>
              
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-bold text-sm">ALERT TRIGGERED</span>
                </div>
                <p className="text-slate-300 text-sm">
                  Unusual admin permission granted to user@example.com at 2:34 AM
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* Features Grid */}
      <Section className="py-24 bg-slate-900/50 relative overflow-hidden">
        <GlowingOrb position="top-left" size="400px" opacity={0.1} />
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <SectionLabel text="Capabilities" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              What Call Sentinel monitors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="p-6 bg-slate-900/80">
                <div className="w-12 h-12 mb-4 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#73e28a]">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Use Cases */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel text="Perfect For" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Who needs Call Sentinel?
            </h2>
          </div>

          <Card className="p-8 bg-slate-900/80">
            <ul className="space-y-4">
              {useCases.map((useCase, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-[#73e28a] mt-0.5 flex-shrink-0" />
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      {/* How It Works */}
      <Section className="py-24 bg-slate-900/50 relative overflow-hidden">
        <FloatingPixels count={10} />
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <SectionLabel text="Simple Setup" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">How it works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-slate-800 mb-4">{step.num}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Request Form */}
      <Section id="request-form" className="py-24 relative overflow-hidden">
        <GlowingOrb position="center" size="500px" opacity={0.1} />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel text="Get Started" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Request Your Free Security Agent
            </h2>
            <p className="text-slate-400">
              Tell us about your app and we'll configure Call Sentinel for you
            </p>
          </div>

          <Card className="p-8 bg-slate-900/80">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Your Name *</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Describe Your Base44 App *</Label>
                <Textarea
                  required
                  value={formData.app_description}
                  onChange={(e) => setFormData({...formData, app_description: e.target.value})}
                  className="bg-slate-800 border-slate-700 text-white h-24"
                  placeholder="E.g., A multi-tenant SaaS for project management with admin panels and customer data..."
                />
              </div>

              <div className="space-y-2">
                <Label>What Do You Want Monitored? *</Label>
                <Textarea
                  required
                  value={formData.monitoring_requirements}
                  onChange={(e) => setFormData({...formData, monitoring_requirements: e.target.value})}
                  className="bg-slate-800 border-slate-700 text-white h-24"
                  placeholder="E.g., Admin permission changes, bulk user deletions, unusual login patterns, access to sensitive customer records..."
                />
              </div>

              <div className="space-y-2">
                <Label>Alert Preferences</Label>
                <Textarea
                  value={formData.alert_preferences}
                  onChange={(e) => setFormData({...formData, alert_preferences: e.target.value})}
                  className="bg-slate-800 border-slate-700 text-white h-20"
                  placeholder="E.g., Email alerts for critical events, daily digest for minor anomalies, Slack webhook for immediate threats..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-12"
              >
                {isSubmitting ? 'Submitting...' : 'Get Call Sentinel Free'}
              </Button>

              <p className="text-slate-500 text-xs text-center">
                By submitting, you agree to receive security monitoring setup instructions via email.
              </p>
            </form>
          </Card>
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="py-24 bg-slate-900/50 relative overflow-hidden">
        <GridBackground />
        
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Don't wait for a breach to happen
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            Set up Call Sentinel today and get peace of mind knowing your Base44 app is being monitored 24/7.
          </p>
          <Button 
            onClick={() => document.getElementById('request-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-10 text-lg"
          >
            Get Started - It's Free
          </Button>
        </div>
      </Section>
    </div>
  );
}