import React, { useState } from 'react';
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
  Code, 
  Bug, 
  Wrench, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  Copy,
  ExternalLink,
  Stethoscope,
  Hammer
} from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

export default function Base44ERPage() {
  usePageView('base44_er');
  useScrollDepth('base44_er');
  useTimeOnPage('base44_er');

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
    issue_description: '',
    include_fix: false
  });

  // Handle return from Stripe
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');
    const reqId = urlParams.get('requestId');
    const includeFix = urlParams.get('includeFix');
    
    if (success === 'true' && sessionId) {
      // Handle the successful payment
      base44.functions.invoke('handleStripeSuccess', { sessionId })
        .then(res => {
          if (res.data.success) {
            setPaymentSuccess(true);
            const amount = includeFix === 'true' ? 150 : 50;
            const itemName = includeFix === 'true' ? 'Base44 ER Review + Fix' : 'Base44 ER Review';
            track('base44_er_payment_success', { session_id: sessionId, amount, include_fix: includeFix });
            trackPurchase(sessionId, amount, itemName);
          }
        })
        .catch(err => console.error('Payment handling failed:', err));
      
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      // Save to database
      // March Special: Review + Fix is $50 (ends April 1, 2026)
      const marchSpecialEndDate = new Date('2026-04-01T06:00:00Z'); // Midnight CST = 6am UTC
      const isMarchSpecial = new Date() < marchSpecialEndDate;
      const amount = isMarchSpecial ? 50 : (data.include_fix ? 150 : 50);
      
      const created = await base44.entities.AppReviewRequest.create({
        ...data,
        payment_amount: amount
      });
      
      // Send lead notification email
      base44.functions.invoke('notifyNewLead', {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        payment_status: 'pending',
        service: 'Base44 ER',
        amount: amount
      }).catch(err => console.error('Lead notification failed:', err));
      
      // Create Stripe checkout session
      const response = await base44.functions.invoke('createStripeCheckout', { 
        service: 'Base44ER',
        requestId: created.id,
        amount: amount,
        description: data.include_fix 
          ? (isMarchSpecial ? 'Base44 App Review + Fix Service (March Special)' : 'Base44 App Review + Fix Service')
          : 'Base44 App Review Service',
        customerEmail: data.email,
        customerName: data.name,
        metadata: { includeFix: data.include_fix ? 'true' : 'false' }
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
      if (!formData.name || !formData.email || !formData.country || !formData.app_url || !formData.issue_description) {
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
      submitMutation.mutate(formData);
    }
  };

  const BASE44_PROMPT = `You are an expert code reviewer, application auditor, and security analyst analyzing a live Base44 application.

Your job is to perform a **deep static analysis** of the app I provide (pages, functions, entities/schema, access rules, integrations, configuration, and supporting code) and return a **detailed findings report only**.

You must evaluate not only code quality and security, but also whether the app appears to be built correctly to accomplish the creator's intended goals.

Do NOT create any pages, interfaces, or automation workflows.
Do NOT provide build code or implementation code unless a tiny example is necessary to explain a fix.
Do NOT rewrite the app.
Simply analyze what I provide and return findings.

---

## PRIMARY OBJECTIVE

Audit the app across **three dimensions**:

1. **Code Quality & Architecture**
2. **Security & Data Protection**
3. **Product Intent / Functional Alignment** (does the implementation appear to achieve what the app is intended to do?)

You must prioritize **correctness of behavior and business logic**, not just syntax or style.

---

## REQUIRED ANALYSIS METHOD (FOLLOW IN ORDER)

### Phase 1: Inferred Product Intent (Required)
Before listing issues, first infer and summarize:
- What the app appears to do
- Who the likely users are
- Core workflows/use cases
- Key success outcomes the app is likely intended to achieve

Use only the evidence I provide (code, entities, functions, rules, page names, config, UI structure, etc.).
If anything is unclear, state your assumptions explicitly.

### Phase 2: Complete App Surface Review (Required)
Scan and review all provided app surfaces relevant to behavior and risk, including:
- Pages / components / layouts
- Backend functions / actions / triggers
- Entities / schema / field design / relationships
- Access rules / permissions / role logic
- Integrations (APIs, webhooks, auth providers, email/SMS/payment/etc.)
- Environment/config usage
- Client-side state/data-fetching patterns
- Form handling and validation
- Error handling and logging behavior

### Phase 3: Functional Alignment & Workflow Validation (Required)
For each major workflow/page/function:
- State what it appears intended to do
- State what the implementation currently does (based on code evidence)
- Identify gaps that could prevent success (logic flaws, missing steps, partial integrations, broken assumptions, edge cases)
- Note whether the issue is:
  - **Confirmed (code evidence)**
  - **Probable (strong indicators)**
  - **Unverified (requires runtime testing/logs/live env)**

### Phase 4: Deep Logic Review (Required)
Perform line-level or near line-level review for **critical logic**, including:
- Authentication / authorization
- Access rules / permission checks
- Data writes / updates / deletes
- Payment/revenue/subscription flows
- External integrations and secret usage
- User onboarding and role assignment
- Any workflow that changes business-critical data
- Any workflow that affects trust/safety/privacy

Do not assume logic is correct just because syntax is valid.
Check for missing branches, edge cases, race conditions, error paths, and silent failures.

### Phase 5: Risk Prioritization (Required)
Prioritize findings by **real-world impact** on:
- Security / privacy
- Data integrity
- App reliability
- User experience / conversion
- Revenue / operations
- Maintainability / future development speed

Distinguish clearly between:
- Must fix before launch
- Should fix soon
- Nice to improve later

---

## YOUR ANALYSIS TASK

Conduct a comprehensive review across these three dimensions:

### A) PRODUCT INTENT & FUNCTIONAL ALIGNMENT
- **App Goal Understanding**: Infer intended purpose, target users, and primary workflows
- **Workflow Validation**: For each major workflow/page, determine whether implementation supports intended outcome
- **Business Logic Correctness**: Check if logic matches likely expected behavior, including edge cases and failure handling
- **Implementation Coverage**: Identify incomplete flows, placeholders, TODO logic, dead code, disconnected UI/backend paths, missing states, and partial feature implementations
- **Operational Readiness Gaps**: Flag missing observability, admin controls, recovery paths, or validation needed for real-world use
- **Assumption Gaps**: Clearly state what cannot be proven without runtime testing, logs, or production credentials/data

### B) CODE QUALITY ASSESSMENT
- **Backend Function Quality**: Parameter validation, error handling, code patterns, reusability, idempotency where relevant
- **Frontend Quality**: State management, component boundaries, loading/error/empty states, form validation, UX resilience
- **Database Design**: Schema normalization, relationship integrity, field types, naming consistency, auditability
- **Access Rules**: CRUD rule logic, permission enforcement, data safety, least privilege
- **Integration Setup**: Proper configuration, retry/error handling, secret management, failure modes
- **Overall Architecture**: Modularity, separation of concerns, maintainability, scalability risks, coupling

### C) SECURITY ASSESSMENT
- **Authentication & Authorization**: Proper identity verification, role enforcement, access control, privilege boundaries
- **Secrets Management**: API keys, credentials, tokens (secure storage, no hardcoding, no accidental exposure)
- **Data Access**: Access rules prevent unauthorized reads/writes, sensitive fields protected
- **Input Validation**: Validation/sanitization to reduce injection and abuse risk
- **Error Handling**: No sensitive details leaked to clients (stack traces, internal URLs, tokens, schema details)
- **Integration Security**: Third-party services authenticated correctly, webhook verification if applicable, credential leakage risks
- **Common Vulnerabilities**: XSS, CSRF, injection, SSRF (if relevant), insecure direct object references, privilege escalation, unsafe file handling
- **Abuse & Misuse Risks**: Spam, brute force, replay, rate-limit gaps, role misuse, unbounded queries/uploads

---

## REVIEW DEPTH REQUIREMENTS (MANDATORY)

- Review **all provided files** relevant to app behavior.
- Do not stop at high-level summaries.
- Perform a **line-level review for critical logic** and a function/component-level review for non-critical areas.
- Reference exact page names, function names, entities, fields, and rule names whenever possible.
- Flag broken or suspicious patterns even if they might be intentional.
- Do not assume "works" unless supported by code flow evidence.
- If something appears correct but cannot be confirmed without runtime execution, mark it **Unverified**.

---

## EVIDENCE STANDARDS (MANDATORY)

For every finding, include:
- **Severity**: Critical / High / Medium / Low
- **Area**: Product Fit / Code Quality / Security
- **Confidence**: Confirmed / Probable / Unverified
- **Location**: Exact file path(s), function/component/entity/rule name(s), and line number(s) when available
- **What We Found** (plain language)
- **Why It Matters** (security, reliability, UX, business impact, etc.)
- **Risk If Not Fixed** (concrete impact)
- **Recommendation** (specific, actionable)
- **Backend Changes Required**: Yes / No / Maybe
- **Blocks Intended Outcome?**: Yes / No / Partially (for product-fit findings)

If line numbers are not available in the provided material, state that clearly and use the most precise location reference possible.

---

## REPORT FORMAT (RETURN IN THIS EXACT STRUCTURE)

# Deep App Audit Report

## 1) Inferred App Goal & Intended Outcomes
### Inferred Purpose
- [What the app appears to do]

### Likely User Types
- [User type 1]
- [User type 2]

### Core Workflows (Inferred)
1. [Workflow]
2. [Workflow]
3. [Workflow]

### Assumptions / Unknowns
- [Assumption]
- [Missing information preventing stronger validation]

---

## 2) Product Intent & Functional Fit Review

### Workflow Validation Findings
Group findings by workflow/page/feature.

#### Critical Issues
- [Finding title]
  - Severity:
  - Confidence:
  - Location:
  - Intended Outcome:
  - Current Behavior (from code evidence):
  - Gap / Failure Mode:
  - Why It Matters:
  - Risk If Not Fixed:
  - Recommendation:
  - Backend Changes Required:
  - Blocks Intended Outcome?:

#### High Priority Findings
- [Repeat same format]

#### Medium Priority Findings
- [Repeat same format]

#### Low Priority Findings
- [Repeat same format]

### Missing / Incomplete Features Blocking Success
- [Item]: [Why this prevents the app from achieving likely intended outcomes]

### Positive Observations
- [Good practice]: [Brief description]
- [Good practice]: [Brief description]

---

## 3) Code Quality Review

### Critical Issues
- [Finding title]
  - Severity:
  - Confidence:
  - Area:
  - Location:
  - What We Found:
  - Why It Matters:
  - Risk If Not Fixed:
  - Recommendation:
  - Backend Changes Required:

### High Priority Findings
- [Repeat same format]

### Medium Priority Findings
- [Repeat same format]

### Low Priority Findings
- [Repeat same format]

### Positive Observations
- [Good practice 1]: [Brief description]
- [Good practice 2]: [Brief description]

---

## 4) Security Review

### Critical Issues
- [Finding title]
  - Severity:
  - Confidence:
  - Area:
  - Location:
  - What We Found:
  - Why It Matters:
  - Risk If Not Fixed:
  - Recommendation:
  - Backend Changes Required:

### High Priority Findings
- [Repeat same format]

### Medium Priority Findings
- [Repeat same format]

### Low Priority Findings
- [Repeat same format]

### Positive Observations
- [Good practice]: [Brief description]

---

## 5) Cross-Cutting Risks & Architecture Concerns
List issues that impact multiple parts of the app (e.g., role model design, shared validation gaps, duplicated logic, weak observability, fragile integration patterns).

- [Concern 1]: [Description] → [Recommendation]
- [Concern 2]: [Description] → [Recommendation]

---

## 6) Verification Limits (Static Analysis vs Runtime)
Clearly separate:
- **Confirmed by code evidence**
- **Probable issues inferred from patterns**
- **Unverified risks requiring runtime testing / logs / environment access**

Also list what would be needed to fully validate behavior (e.g., test users, API keys, staging URL, logs, sample data).

---

## 7) Summary Scorecard

**Product Fit Score**: [1-10] with brief justification  
**Code Quality Score**: [1-10] with brief justification  
**Security Score**: [1-10] with brief justification  

### Total Findings by Severity
- Critical: [count]
- High: [count]
- Medium: [count]
- Low: [count]

### Total Findings by Confidence
- Confirmed: [count]
- Probable: [count]
- Unverified: [count]

### Top 5 Action Items (Highest Impact First)
1. [Action 1]
2. [Action 2]
3. [Action 3]
4. [Action 4]
5. [Action 5]

### Must-Fix Before Launch
- [Item 1]
- [Item 2]

### Estimated Effort to Remediate Critical/High Issues
- [Rough estimate with assumptions]

---

## ANALYSIS GUIDELINES

- Be specific: Reference exact function names, entity names, page names, and field names when possible
- Be actionable: Every finding must include a concrete recommendation
- Be thorough: Check business logic correctness, edge cases, and failure modes
- Be realistic: Distinguish between launch-blocking issues and improvements
- Flag assumptions: If information is missing, say so explicitly
- Context matters: Evaluate severity relative to the app's likely purpose and users
- Do not provide implementation code unless a tiny snippet is necessary to explain a fix
- Return findings only (no app creation, no workflow generation)

---

## NOW ANALYZE MY APP

Provide the full analysis in the exact report format above based on the data I share next.`;

  const copyEmail = () => {
    navigator.clipboard.writeText('iamwillkode@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const services = [
    {
      icon: Shield,
      title: "Security Check",
      items: ["Common vulnerabilities", "Unsafe patterns", "Data exposure risks", "Auth and permission issues"]
    },
    {
      icon: Code,
      title: "Code Quality Check",
      items: ["Structural problems", "Maintainability issues", "Anti-patterns", "Scalability concerns"]
    },
    {
      icon: Bug,
      title: "Debugging & Issue Review",
      items: ["Review all reported issues", "Identify additional issues", "Root cause analysis", "Performance bottlenecks"]
    },
    {
      icon: Wrench,
      title: "Actionable Fixes",
      items: ["Clear explanations", "Step-by-step prompts", "Copy-paste solutions", "No vague advice"]
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Services", url: "/Services" },
        { name: "Base44 ER", url: "/Base44ER" }
      ]),
      createServiceSchema("Base44 Emergency Room", "Professional Base44 app reviews and debugging. $50 review only or $50 with fixes (March Special - ends April 1st).", "/Base44ER")
    ]
  };

  return (
    <div className="flex flex-col bg-slate-950 text-white overflow-hidden">
      <SEO 
        title="Base44 ER - Professional App Reviews & Debugging"
        description="Expert Base44 app reviews by a full-stack developer since 1997. $50 review only or $50 with fixes (March Special - ends April 1st). Security checks, code quality review, debugging, and actionable solutions."
        keywords={["Base44 app review", "Base44 debugging", "Base44 help", "app code review", "Base44 expert", "Base44 developer"]}
        url="/Base44ER"
        jsonLd={jsonLd}
      />
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
        <GridBackground />
        <FloatingPixels count={20} />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#73e28a]/10 border border-[#73e28a]/30 rounded-full px-4 py-2 mb-6">
            <Stethoscope className="w-4 h-4 text-[#73e28a]" />
            <span className="text-[#73e28a] text-sm font-medium">Base44 App Reviews</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Base44 <span className="text-[#73e28a]">ER</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-4">
            Professional App Reviews & Debugging
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-[#73e28a]">$50</p>
              <p className="text-slate-500 text-sm">Review Only</p>
            </div>
            <div className="text-slate-600 text-2xl">or</div>
            <div className="text-center relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                MARCH SPECIAL
              </div>
              <p className="text-4xl md:text-5xl font-bold text-[#73e28a]">$50</p>
              <p className="text-slate-400 text-sm">Review + Fix <span className="line-through text-slate-600">$150</span></p>
              <p className="text-amber-400 text-xs mt-1">Ends April 1st</p>
            </div>
          </div>
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold text-lg h-14 px-10 rounded-full"
          >
            Get Your App Reviewed <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <p className="text-slate-500 text-sm mt-6">
            Real human review • Not an AI audit • Full-stack developer since 1997
          </p>
        </div>
      </section>

      {/* What's Included */}
      <Section className="py-24 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What's Included in Every Review
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Each review is a comprehensive look at your Base44 app, covering security, code quality, and actionable fixes.
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

      {/* About Me */}
      <Section className="py-24 bg-slate-900/50 relative">
        <GridBackground />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Why Me?</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#73e28a] mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Moderator for Base44 subreddit and Discord</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#73e28a] mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Full-stack developer since 1997</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#73e28a] mt-1 flex-shrink-0" />
                  <span className="text-slate-300">27+ years building, shipping, breaking, and fixing production systems</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#73e28a] mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Tested with 150+ Base44 users</span>
                </li>
              </ul>
            </div>
            <Card className="p-8 bg-slate-800/50 border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">What This Is</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-[#73e28a] mt-0.5" />
                  A fast, affordable way to sanity-check your app
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-[#73e28a] mt-0.5" />
                  A second set of experienced eyes
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-[#73e28a] mt-0.5" />
                  Useful when something "feels off" but you can't pinpoint why
                </li>
              </ul>
              
              <h3 className="text-xl font-bold text-white mb-4">What This Isn't</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-slate-400">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                  Not a replacement for long-term consulting
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-400">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                  Not a promise your app is "perfect" afterward
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-400">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                  Not an upsell funnel — no hidden tiers
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
            Ready to Get Your App Reviewed?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Catch problems early. Save hours of frustration. Ship better, safer apps.
          </p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold text-lg h-14 px-10 rounded-full"
          >
            Start Review Request <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </Section>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
          {!paymentSuccess && (
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {step === 1 && "App Review Request"}
              {step === 2 && "Invite Admin Access"}
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
                  <Label className="text-slate-400">Country</Label>
                  <Input
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
                <Label className="text-slate-400">Describe Your Issue *</Label>
                <Textarea
                  required
                  placeholder="Tell me about the issues you're experiencing or what you'd like reviewed..."
                  className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                  value={formData.issue_description}
                  onChange={(e) => handleChange('issue_description', e.target.value)}
                />
              </div>

              <div 
                className={`p-4 rounded-lg border cursor-pointer transition-all ${formData.include_fix ? 'bg-[#73e28a]/10 border-[#73e28a]' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
                onClick={() => handleChange('include_fix', !formData.include_fix)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox 
                    checked={formData.include_fix}
                    onCheckedChange={(checked) => handleChange('include_fix', checked)}
                    className="mt-1 border-slate-600 data-[state=checked]:bg-[#73e28a] data-[state=checked]:border-[#73e28a]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Hammer className="w-4 h-4 text-[#73e28a]" />
                      <span className="font-bold text-white">Add Fix Service</span>
                      <span className="text-[#73e28a] text-sm">FREE</span>
                      <span className="text-amber-400 text-xs bg-amber-500/20 px-2 py-0.5 rounded-full">March Special</span>
                    </div>
                    <p className="text-sm text-slate-400">
                      I'll implement the fixes myself after the review. You get a working solution, not just advice.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                <span className="text-slate-400">Total: </span>
                <span className="text-xl font-bold text-[#73e28a]">$50</span>
                {formData.include_fix && <span className="text-amber-400 text-sm ml-2">(March Special - Fix included FREE!)</span>}
              </div>

              <Button 
                onClick={handleNextStep}
                disabled={!formData.name || !formData.email || !formData.app_url || !formData.issue_description}
                className="w-full bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-12"
              >
                Next: Grant Admin Access <ArrowRight className="ml-2 w-4 h-4" />
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
                      Send an invite with <strong>Admin</strong> access to:
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
                  Complete your $50 payment to finalize the review request.
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
                Your app review request has been received. We will reach out to you within 24 hours (excluding weekends).
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