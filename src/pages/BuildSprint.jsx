import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import PageHero from '@/components/ui-custom/PageHero';
import SectionLabel from '@/components/ui-custom/SectionLabel';
import GridBackground from '@/components/ui-custom/GridBackground';
import FloatingPixels from '@/components/ui-custom/FloatingPixels';
import GlowingOrb from '@/components/ui-custom/GlowingOrb';
import SEO, { createServiceSchema, createFAQSchema, createBreadcrumbSchema } from '@/components/SEO';
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Users, 
  Target, 
  Zap, 
  Calendar,
  Monitor,
  FileText,
  Loader2,
  X,
  Plus,
  Minus
} from 'lucide-react';

const HOURLY_RATE = 75;
const MIN_HOURS = 1;

export default function BuildSprintPage() {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    hours: 2,
    base44_app_link: '',
    mvp_goal: '',
    top_3_actions: '',
    integrations_needed: '',
    existing_issues: ''
  });

  const totalAmount = formData.hours * HOURLY_RATE;

  // Handle PayPal return
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const token = urlParams.get('token');
    const reqId = urlParams.get('requestId');
    
    if (success === 'true' && token && reqId) {
      setIsProcessing(true);
      setRequestId(reqId);
      
      // Capture the payment
      base44.functions.invoke('captureBuildSprintOrder', {
        orderId: token,
        requestId: reqId
      }).then(() => {
        setPaymentSuccess(true);
        setIsProcessing(false);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }).catch((error) => {
        console.error('Payment capture failed:', error);
        setIsProcessing(false);
      });
    }
  }, []);

  const createRequestMutation = useMutation({
    mutationFn: async (data) => {
      // Create the request record
      const request = await base44.entities.BuildSprintRequest.create({
        ...data,
        payment_amount: totalAmount,
        payment_status: 'pending'
      });
      
      // Create PayPal order
      const { data: paypalData } = await base44.functions.invoke('createBuildSprintOrder', {
        requestId: request.id,
        hours: data.hours,
        amount: totalAmount
      });
      
      // Redirect to PayPal
      if (paypalData.approvalUrl) {
        window.location.href = paypalData.approvalUrl;
      }
      
      return request;
    }
  });

  const handleSubmit = () => {
    createRequestMutation.mutate(formData);
  };

  const handleHoursChange = (delta) => {
    setFormData(prev => ({
      ...prev,
      hours: Math.max(MIN_HOURS, prev.hours + delta)
    }));
  };

  const accomplishments = [
    { icon: Target, title: "Scope lock", desc: "so the session stays productive" },
    { icon: FileText, title: "Data model setup", desc: "entities, relationships, naming, ownership" },
    { icon: Users, title: "Roles and permissions", desc: "clear access rules that do not break later" },
    { icon: Zap, title: "Core user flow", desc: "onboarding → main action → dashboard" },
    { icon: CheckCircle, title: "Basic guardrails", desc: "empty states, validation, error handling" },
    { icon: Monitor, title: "Maintainability pass", desc: "consistent structure, reusable patterns" }
  ];

  const faqs = [
    {
      q: "Do you take over the build, or do we actually build together?",
      a: "I share my screen and build while you watch. I explain every step so you understand what is happening and can keep building after."
    },
    {
      q: "Can we fix an existing messy app instead of starting fresh?",
      a: "Yes. That is a common use case. We will decide quickly whether to refactor or rebuild the foundation."
    },
    {
      q: "Do I need to be technical?",
      a: "No. You need to be able to describe what the app should do and make decisions during the call."
    },
    {
      q: "Can we do integrations like Stripe or webhooks?",
      a: "Often yes, depending on Base44 constraints and how prepared your accounts/keys are. If you want to focus on integrations, mention it in the pre-call checklist."
    },
    {
      q: "What if we do not finish everything?",
      a: "That is normal. This is timeboxed. We will prioritize the highest-leverage work first and leave you with a clear next-steps plan."
    }
  ];

  // Payment success view
  if (paymentSuccess) {
    return (
      <div className="bg-slate-950 text-white min-h-screen">
        <PageHero title="Payment Successful!" />
        
        <Section className="py-24 relative overflow-hidden">
          <GridBackground />
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[#73e28a]/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-[#73e28a]" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">You're all set!</h2>
            <p className="text-slate-300 text-lg mb-8">
              Your payment has been processed. Now let's schedule your Build Sprint session.
            </p>
            
            <Card className="p-8 bg-slate-900/80 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Next Step: Schedule Your Session</h3>
              <p className="text-slate-400 mb-6">
                Click the button below to pick a time that works for you. You'll receive a calendar invite with the video call link.
              </p>
              
              <a 
                href="https://calendly.com/kodeagency/build-sprint" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-8 text-lg">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Your Build Sprint
                </Button>
              </a>
            </Card>
            
            <p className="text-slate-500 text-sm">
              A confirmation email has been sent to your inbox with these details.
            </p>
          </div>
        </Section>
      </div>
    );
  }

  // Processing payment view
  if (isProcessing) {
    return (
      <div className="bg-slate-950 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#73e28a] animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Processing Payment...</h2>
          <p className="text-slate-400">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Services", url: "/Services" },
        { name: "Build Sprint", url: "/BuildSprint" }
      ]),
      createServiceSchema("Done-With-You Build Sprints", "Live screen-share MVP building sessions at $75/hour. Learn while we build your Base44 app together.", "/BuildSprint"),
      createFAQSchema(faqs)
    ]
  };

  return (
    <div className="bg-slate-950 text-white">
      <SEO 
        title="Build Sprint - Done-With-You MVP Building Sessions"
        description="Live screen-share sessions where I build your Base44 MVP while you watch and learn. $75/hour, 1-hour minimum. Scope lock, data models, user flows, and maintainable code."
        keywords={["MVP building", "Base44 development", "co-building session", "app development help", "Base44 expert", "live coding session"]}
        url="/BuildSprint"
        jsonLd={jsonLd}
      />
      <PageHero title="Done-With-You Build Sprints" />

      {/* Intro Section */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={15} />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel text="Co-Build Sessions" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Build your MVP with me<br />
              <span className="text-[#73e28a]">on a live screen share.</span>
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              We will structure it correctly, ship real progress, and leave you with a foundation you can maintain.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              A timeboxed session where I share my screen and build your Base44 app while you watch. I explain every step so you learn how to structure and maintain a real MVP.
            </p>
            <p className="text-[#73e28a] font-semibold text-lg mb-8">
              You will leave the session with working features and a clear next-steps plan.
            </p>
            
            <Button 
              onClick={() => setShowModal(true)}
              className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-8 text-lg"
            >
              Book a Build Sprint <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          
          <div className="relative">
            <Card className="p-8 bg-slate-900/80 border-[#73e28a]/30">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-[#73e28a] mb-2">$75</div>
                <div className="text-slate-400">per hour</div>
              </div>
              
              <div className="border-t border-slate-800 pt-6 space-y-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <Clock className="w-5 h-5 text-[#73e28a]" />
                  <span>1-hour minimum booking</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Users className="w-5 h-5 text-[#73e28a]" />
                  <span>Most founders book 2–4 hours</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Monitor className="w-5 h-5 text-[#73e28a]" />
                  <span>Live screen share session</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-slate-800/50 rounded-lg text-center">
                <div className="text-slate-400 text-sm">Minimum session cost</div>
                <div className="text-2xl font-bold text-white">$75 <span className="text-slate-500 text-sm font-normal">(1 hour)</span></div>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* What We Accomplish */}
      <Section className="py-24 bg-slate-900/50 relative overflow-hidden">
        <GlowingOrb position="top-right" size="400px" opacity={0.1} />
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <SectionLabel text="Session Focus" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              What we accomplish
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
              We focus on shipping the pieces that prevent Base44 apps from becoming messy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accomplishments.map((item, i) => (
              <Card key={i} className="p-6 bg-slate-900/80">
                <div className="w-12 h-12 mb-4 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#73e28a]">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-slate-300">
              <span className="text-[#73e28a] font-semibold">+ Next steps:</span> a prioritized checklist so you can keep shipping
            </p>
          </div>
        </div>
      </Section>

      {/* Best Use Cases / Not a Fit */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-12">
          <Card className="p-8 bg-slate-900/80 border-[#73e28a]/30">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-[#73e28a]" />
              Best use cases
            </h3>
            <p className="text-slate-400 mb-6">This service is ideal if:</p>
            <ul className="space-y-4">
              {[
                "You are stuck in the \"prompt loop\" and need forward momentum",
                "Your app works \"kind of\" but the structure is falling apart",
                "You need help designing entities and permissions correctly",
                "You want to learn while building (not just outsource it)"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-[#73e28a] mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
          
          <Card className="p-8 bg-slate-900/80 border-red-500/30">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <X className="w-6 h-6 text-red-400" />
              Not a fit
            </h3>
            <p className="text-slate-400 mb-6">To keep this fair and timeboxed, this is not for:</p>
            <ul className="space-y-4">
              {[
                "\"Build my entire SaaS in one call\"",
                "Complex custom design systems or heavy branding work",
                "Large multi-tenant billing platforms end-to-end in a single sprint",
                "Long-term, open-ended consulting without clear deliverables"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-400">
                  <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-slate-500 text-sm mt-6">
              If you are unsure, book 2 hours and we will scope realistically on the call.
            </p>
          </Card>
        </div>
      </Section>

      {/* How It Works */}
      <Section className="py-24 bg-slate-900/50 relative overflow-hidden">
        <FloatingPixels count={10} />
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <SectionLabel text="The Process" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">How it works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Book your time", desc: "Pick a start time and pay for at least 2 hours. You can extend during the session if you want." },
              { num: "02", title: "Pre-call checklist", desc: "Provide your Base44 app link, MVP goal, top 3 user actions, and any integrations needed." },
              { num: "03", title: "Live build sprint", desc: "I share my screen and build in your project while explaining every step—scope lock, setup, build, and confirm." },
              { num: "04", title: "Wrap-up", desc: "Leave with a working build, prioritized next-steps checklist, and clear guidance." }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-slate-800 mb-4">{step.num}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel text="Questions" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">FAQ</h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <Card key={i} className="p-6 bg-slate-900/80">
                <h3 className="text-lg font-bold text-white mb-3">{faq.q}</h3>
                <p className="text-slate-400 leading-relaxed">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-24 relative overflow-hidden">
        <GlowingOrb position="center" size="500px" opacity={0.1} />
        
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to build?
          </h2>
          <p className="text-slate-300 text-lg mb-4 max-w-2xl mx-auto">
            Rate: $75/hour • Minimum: 1 hour
          </p>
          <p className="text-slate-400 mb-10 max-w-2xl mx-auto">
            If you are ready, book a session and include your Base44 link and MVP goal.
          </p>
          <Button 
            onClick={() => setShowModal(true)}
            className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-10 text-lg"
          >
            Book a Build Sprint
          </Button>
        </div>
      </Section>

      {/* Booking Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {step === 1 ? 'Book Your Build Sprint' : 'Pre-Call Checklist'}
            </DialogTitle>
          </DialogHeader>
          
          {step === 1 && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Your Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Session Length</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => handleHoursChange(-1)}
                    disabled={formData.hours <= MIN_HOURS}
                    className="bg-slate-600 hover:bg-slate-500 text-black disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="text-center flex-1">
                    <div className="text-3xl font-bold text-white">{formData.hours} hours</div>
                    <div className="text-slate-400 text-sm">${totalAmount} total</div>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => handleHoursChange(1)}
                    className="bg-slate-600 hover:bg-slate-500 text-black"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.email}
                className="w-full bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-12"
              >
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Base44 App Link <span className="text-slate-500">(or "new project")</span></Label>
                <Input
                  value={formData.base44_app_link}
                  onChange={(e) => setFormData({...formData, base44_app_link: e.target.value})}
                  className="bg-slate-800 border-slate-700"
                  placeholder="https://base44.com/app/..."
                />
              </div>
              
              <div className="space-y-2">
                <Label>1–2 Sentence MVP Goal *</Label>
                <Textarea
                  value={formData.mvp_goal}
                  onChange={(e) => setFormData({...formData, mvp_goal: e.target.value})}
                  className="bg-slate-800 border-slate-700 h-20"
                  placeholder="I want to build a simple booking system where customers can..."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Top 3 User Actions <span className="text-slate-500">(what the user must be able to do)</span></Label>
                <Textarea
                  value={formData.top_3_actions}
                  onChange={(e) => setFormData({...formData, top_3_actions: e.target.value})}
                  className="bg-slate-800 border-slate-700 h-20"
                  placeholder="1. Sign up and create a profile&#10;2. Book an appointment&#10;3. View their booking history"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Required Integrations <span className="text-slate-500">(if any)</span></Label>
                <Input
                  value={formData.integrations_needed}
                  onChange={(e) => setFormData({...formData, integrations_needed: e.target.value})}
                  className="bg-slate-800 border-slate-700"
                  placeholder="Stripe, email, webhooks..."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Existing Issues to Fix <span className="text-slate-500">(if any)</span></Label>
                <Textarea
                  value={formData.existing_issues}
                  onChange={(e) => setFormData({...formData, existing_issues: e.target.value})}
                  className="bg-slate-800 border-slate-700 h-20"
                  placeholder="The permissions aren't working correctly, users can see each other's data..."
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-slate-600 hover:bg-slate-700 text-white"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!formData.mvp_goal}
                  className="flex-1 bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold"
                >
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6 py-4">
              <div className="p-4 bg-slate-800 rounded-lg border border-[#73e28a]/30">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#73e28a]" />
                  Grant Admin Access
                </h3>
                <p className="text-slate-300 mb-4">
                  Before we can start, please add me as an admin to your Base44 app:
                </p>
                <ol className="space-y-3 text-slate-400">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#73e28a] text-black text-sm font-bold flex items-center justify-center flex-shrink-0">1</span>
                    <span>Open your Base44 app</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#73e28a] text-black text-sm font-bold flex items-center justify-center flex-shrink-0">2</span>
                    <span>Click the <strong className="text-white">Share</strong> button (to the left of the Publish button)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#73e28a] text-black text-sm font-bold flex items-center justify-center flex-shrink-0">3</span>
                    <span>Invite <strong className="text-[#73e28a]">iamwillkode@gmail.com</strong> with <strong className="text-white">Admin</strong> access level</span>
                  </li>
                </ol>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 border-slate-600 hover:bg-slate-700 text-white"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={createRequestMutation.isPending}
                  className="flex-1 bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold"
                >
                  {createRequestMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Pay ${totalAmount} with PayPal</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}