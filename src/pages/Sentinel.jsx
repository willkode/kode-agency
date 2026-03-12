import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Card from "@/components/ui-custom/Card";
import PageHero from "@/components/ui-custom/PageHero";
import Section from "@/components/ui-custom/Section";
import GridBackground from "@/components/ui-custom/GridBackground";
import SectionLabel from "@/components/ui-custom/SectionLabel";
import GlowingOrb from "@/components/ui-custom/GlowingOrb";
import FloatingPixels from "@/components/ui-custom/FloatingPixels";
import { Shield, Copy, CheckCircle, AlertTriangle, Eye, Lock, Bell, Activity, Database, Terminal, ArrowRight, Zap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SEO from "@/components/SEO";
import { createBreadcrumbSchema, createServiceSchema } from "@/components/SEO";

const SENTINEL_PROMPT = `MASTER PROMPT — SENTINEL

You are Sentinel, a Base44 Intrusion Detection System agent.

Your job is to monitor protected Base44 apps for unauthorized, suspicious, abusive, or security-sensitive activity and notify the app owner when immediate review is required.

YOUR ROLE

You are a security monitoring agent for Base44 apps.

You do not wait for approval to evaluate an event.
You do not ask follow-up questions before acting.
You immediately inspect the event payload, compare it against known safe memory, classify severity, log the event, and notify the owner when required.

PRIMARY GOAL

Detect suspicious or unauthorized actions as early as possible and produce fast, useful alerts.

OWNER SETTINGS

Use the configured owner profile for the current app.

Example:

Owner name: App Owner
Owner email: owner@example.com

APPS YOU MONITOR

You maintain memory of protected apps.
Each app contains:

app_id
app_name
monitored entities
allowlisted users
safe patterns
ignore rules
last scan timestamp

THREATS YOU DETECT

Evaluate every event for these patterns:

Unauthorized entity writes
Unknown or suspicious new users
Bulk data creation
Admin entity tampering by non-admin actors
Backend function abuse
Schema probing or junk/test payloads
Privilege escalation attempts
Cross-tenant or cross-scope writes

SEVERITY RULES

CRITICAL = active breach, privilege escalation, cross-tenant access, or sensitive admin/config tampering
HIGH = confirmed unauthorized write or strong abuse signal
MEDIUM = suspicious but not fully confirmed
LOW = anomaly worth logging only

ACTION RULES

For every matched event:

Write a SecurityEvent record
Include app_id, app_name, entity_name, event_type, actor details, payload summary, threat pattern, severity, confidence, detected_at, resolved=false
If severity is HIGH or CRITICAL, send an immediate email alert to the owner
If severity is MEDIUM, include it in the next daily digest
If severity is LOW, log only

ALLOWLIST RULES

An actor is trusted if:

their email is on the app allowlist
or their role is admin
or they match a safe system pattern
or they match an approved safe IP/source rule

An actor is suspicious if:

they are unauthenticated
unknown
malformed
outside expected scope
changing security-sensitive fields without permission

SENSITIVE ENTITIES

Treat these as high-risk by default:
User, Settings, Config, Permissions, Roles, Admins, APIKeys, Integrations, Billing, FeatureFlags

SENSITIVE FIELDS

Treat edits to these fields as escalation indicators:
role, is_admin, permissions, tenant_id, company_id, owner_id, created_by, access_level, plan, billing_status

BULK ACTIVITY THRESHOLDS

Flag suspicious volume when:

one actor creates more than 10 records in 5 minutes in one entity
or more than 20 records in 5 minutes across the app
or repeatedly calls a sensitive backend function in a short burst

SCHEMA PROBING RULES

Flag records that contain obvious junk or test values such as:
test, asdf, 123, null, undefined, xxx, qwe, sample

Also flag:

many blank required fields
malformed types
repeated placeholder content
obvious exploratory payloads

EMAIL ALERT FORMAT

Use this exact structure:

🚨 [SEVERITY] Intrusion Detected — [App Name]

Entity: [entity_name]
Actor: [email or "unauthenticated"]
Event: [create/update/delete/function_call]
Time: [timestamp]
App: [app_name]
Payload: [key fields]

Threat Pattern: [pattern]
Confidence: [0-100]
Recommended Action: [specific next step]

— Sentinel

DAILY DIGEST

Every day at 8:00 AM Central, send a summary with:

total events in last 24h by severity
unresolved HIGH and CRITICAL events
notable MEDIUM events
overall health status: CLEAN / WATCH / ALERT

MEMORY RULES

Maintain:

allowlist per app
safe IPs and safe patterns
ignore rules for false positives
monitored app registry
last scan timestamps

When the owner says to trust or ignore something, remember it for future evaluations.

RESPONSE STYLE

Be terse.
Be decisive.
Do not ask questions before classifying an event.
Optimize for a 10-second read by the owner.`;

export default function Sentinel() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SENTINEL_PROMPT);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Sentinel prompt copied to clipboard",
    });
    setTimeout(() => setCopied(false), 3000);
  };

  const features = [
    {
      icon: Eye,
      title: "24/7 Surveillance",
      desc: "Continuous monitoring for unauthorized writes, suspicious signups, and bulk record abuse"
    },
    {
      icon: AlertTriangle,
      title: "Instant Threat Detection",
      desc: "Real-time classification of security events with severity scoring (LOW → CRITICAL)"
    },
    {
      icon: Shield,
      title: "Intrusion Prevention",
      desc: "Detects privilege escalation, admin tampering, and cross-tenant access attempts"
    },
    {
      icon: Lock,
      title: "Access Monitoring",
      desc: "Tracks permission changes, role modifications, and sensitive field updates"
    },
    {
      icon: Activity,
      title: "Behavioral Analysis",
      desc: "Pattern recognition for bulk creation, backend function abuse, and schema probing"
    },
    {
      icon: Bell,
      title: "Smart Alerting",
      desc: "Immediate email for HIGH/CRITICAL events, daily digests for MEDIUM, silent logging for LOW"
    }
  ];

  const threatPatterns = [
    "Unauthorized entity writes by non-admin or unauthenticated actors",
    "Suspicious new user signups with disposable emails or fake patterns",
    "Bulk data creation exceeding normal thresholds",
    "Admin entity tampering by standard users",
    "Backend function abuse and rate limit violations",
    "Schema probing with test payloads and junk data",
    "Privilege escalation attempts (role changes, permission edits)",
    "Cross-tenant scope drift and data isolation breaches"
  ];

  const setupSteps = [
    {
      num: "01",
      title: "Copy the Sentinel Prompt",
      desc: "Click the copy button below to get the complete agent specification"
    },
    {
      num: "02",
      title: "Create a Super Agent",
      desc: "In your Base44 app, create a new Super Agent and paste the Sentinel prompt"
    },
    {
      num: "03",
      title: "Answer Configuration Questions",
      desc: "Sentinel will ask about your app, protected entities, and notification preferences"
    },
    {
      num: "04",
      title: "Connect to Automations",
      desc: "Set up entity automations to feed events to Sentinel for real-time monitoring"
    }
  ];

  const requiredEntities = [
    {
      name: "SecurityEvent",
      desc: "Main event log storing every detected threat with severity, confidence, and resolution status"
    },
    {
      name: "SecurityMonitoredApp",
      desc: "Registry of protected apps with monitored entities and owner contact info"
    },
    {
      name: "SecurityAllowlist",
      desc: "Trusted users, roles, and patterns that Sentinel should not flag"
    },
    {
      name: "SecurityIgnoreRule",
      desc: "Approved false positives (e.g., nightly imports, QA test accounts)"
    },
    {
      name: "SecurityScanState",
      desc: "Rolling state tracker for last scan times and health status"
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Services", url: "/Services" },
        { name: "Sentinel", url: "/Sentinel" }
      ]),
      createServiceSchema(
        "Sentinel - Base44 IDS Super Agent",
        "Free AI-powered intrusion detection system for Base44 apps. Monitors for unauthorized access, privilege escalation, bulk abuse, and security threats with real-time alerts.",
        "/Sentinel"
      )
    ]
  };

  return (
    <div className="bg-slate-950 text-white">
      <SEO 
        title="Sentinel - Free Base44 Intrusion Detection System"
        description="Deploy Sentinel, a free AI-powered security monitoring super agent for your Base44 app. Detects unauthorized access, privilege escalation, bulk abuse, and threats in real-time with smart alerting."
        keywords={["Base44 security", "intrusion detection", "super agent", "security monitoring", "IDS", "threat detection", "access control"]}
        url="/Sentinel"
        jsonLd={jsonLd}
      />
      
      <PageHero title="Sentinel" subtitle="Base44 Intrusion Detection Super Agent" />

      {/* Intro Section */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={20} />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel text="Free Super Agent" icon />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Autonomous security<br />
              <span className="text-[#73e28a]">monitoring for Base44.</span>
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              Sentinel is a Super Agent that watches your Base44 app 24/7, detects intrusions instantly, and alerts you the moment something looks wrong.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              No manual configuration. No waiting for alerts. Sentinel evaluates every event immediately, classifies severity, logs security incidents, and notifies you when action is required.
            </p>
            
            <div className="flex items-center gap-4 p-4 bg-[#73e28a]/10 border border-[#73e28a]/30 rounded-lg mb-8">
              <Zap className="w-6 h-6 text-[#73e28a] flex-shrink-0" />
              <p className="text-white font-semibold">100% Free - Deploy in 5 minutes</p>
            </div>
            
            <Button 
              onClick={() => document.getElementById('prompt-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-8 text-lg"
            >
              Get Sentinel Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          
          <div className="relative">
            <Card className="p-8 bg-slate-900/80 border-[#73e28a]/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#73e28a]/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#73e28a]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Active Threat Monitor</h3>
                  <p className="text-slate-400 text-sm">Real-time security analysis</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="p-3 bg-slate-800/50 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-green-400 text-sm font-bold">CLEAN</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-slate-400 text-xs">Normal user activity detected</p>
                </div>
                
                <div className="p-3 bg-slate-800/50 rounded-lg border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-yellow-400 text-sm font-bold">MEDIUM</span>
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  </div>
                  <p className="text-slate-400 text-xs">3 suspicious signups - disposable domains</p>
                </div>
                
                <div className="p-3 bg-red-500/10 rounded-lg border-l-4 border-red-500">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-red-400 text-sm font-bold">CRITICAL</span>
                    <Bell className="w-4 h-4 text-red-400 animate-pulse" />
                  </div>
                  <p className="text-slate-400 text-xs">Unauthorized Permissions update by user@example.com</p>
                </div>
              </div>
              
              <div className="text-center text-slate-500 text-sm">
                <Terminal className="w-4 h-4 inline mr-2" />
                Last scan: 2 seconds ago
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* What Sentinel Monitors */}
      <Section className="py-24 bg-slate-900/50 relative overflow-hidden">
        <GlowingOrb position="top-left" size="400px" opacity={0.1} />
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <SectionLabel text="Threat Detection" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              What Sentinel monitors
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

      {/* Threat Patterns */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel text="8 Core Patterns" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Threats Sentinel detects
            </h2>
          </div>

          <Card className="p-8 bg-slate-900/80">
            <ul className="space-y-4">
              {threatPatterns.map((pattern, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <AlertTriangle className="w-5 h-5 text-[#73e28a] mt-0.5 flex-shrink-0" />
                  <span>{pattern}</span>
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
            <SectionLabel text="4-Step Setup" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">How to deploy Sentinel</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {setupSteps.map((step, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-slate-800 mb-4">{step.num}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Required Entities */}
      <Section className="py-24 relative overflow-hidden">
        <GlowingOrb position="center" size="500px" opacity={0.1} />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel text="Data Model" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Required entities for Sentinel
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Sentinel needs these entities to store security events, manage allowlists, and track app health
            </p>
          </div>

          <div className="grid gap-4">
            {requiredEntities.map((entity, i) => (
              <Card key={i} className="p-6 bg-slate-900/80">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-[#73e28a] flex-shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{entity.name}</h3>
                    <p className="text-slate-400 text-sm">{entity.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Terminal className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-white font-bold mb-2">Sentinel will guide you through entity creation</h4>
                <p className="text-slate-400 text-sm">
                  After pasting the prompt, Sentinel will ask about your app and help you set up the required entities with proper schemas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Prompt Section */}
      <Section id="prompt-section" className="py-24 bg-slate-900/50 relative overflow-hidden">
        <GridBackground />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel text="Copy & Deploy" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The Sentinel prompt
            </h2>
            <p className="text-slate-400">
              Copy this complete specification and paste it into a new Base44 Super Agent
            </p>
          </div>

          <Card className="p-8 bg-slate-900/80 border-[#73e28a]/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#73e28a]" />
                <h3 className="text-lg font-bold text-white">Master Prompt</h3>
              </div>
              <Button
                onClick={handleCopy}
                className={`${copied ? 'bg-green-600 hover:bg-green-700' : 'bg-[#73e28a] hover:bg-[#5dbb72]'} text-black font-bold`}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Prompt
                  </>
                )}
              </Button>
            </div>

            <div className="bg-slate-950 rounded-lg p-6 border border-slate-800 overflow-auto max-h-96">
              <pre className="text-slate-300 text-sm font-mono whitespace-pre-wrap">
                {SENTINEL_PROMPT}
              </pre>
            </div>

            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-bold mb-1">Important</h4>
                  <p className="text-slate-400 text-sm">
                    After pasting this prompt, Sentinel will ask you configuration questions. Answer them to customize monitoring for your specific app and security requirements.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* Alert Examples */}
      <Section className="py-24 relative overflow-hidden">
        <FloatingPixels count={15} />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel text="Real Alerts" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              What Sentinel sends you
            </h2>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-slate-900/80 border-l-4 border-red-500">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-red-400" />
                <h3 className="text-xl font-bold text-white">🚨 [CRITICAL] Intrusion Detected</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-slate-300"><span className="text-slate-500">Entity:</span> Permissions</p>
                <p className="text-slate-300"><span className="text-slate-500">Actor:</span> user@example.com</p>
                <p className="text-slate-300"><span className="text-slate-500">Event:</span> update</p>
                <p className="text-slate-300"><span className="text-slate-500">Payload:</span> attempted change to role=admin for user_id=user_123</p>
                <div className="pt-4 mt-4 border-t border-slate-800">
                  <p className="text-slate-300"><span className="text-slate-500">Threat Pattern:</span> Privilege Escalation</p>
                  <p className="text-slate-300"><span className="text-slate-500">Confidence:</span> 96</p>
                  <p className="text-yellow-400 mt-2"><span className="text-slate-500">Recommended Action:</span> review the actor immediately, verify access rules on Permissions</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-slate-900/80 border-l-4 border-yellow-500">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Daily Security Digest</h3>
              </div>
              <div className="space-y-2 text-sm text-slate-300">
                <p className="font-bold text-white mb-3">Last 24 Hours Summary</p>
                <p>CRITICAL: 1</p>
                <p>HIGH: 2</p>
                <p>MEDIUM: 4</p>
                <p>LOW: 7</p>
                <div className="pt-4 mt-4 border-t border-slate-800">
                  <p className="text-slate-400 mb-2">Medium Events Worth Review:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>3 suspicious new signups using disposable domains</li>
                    <li>repeated test payloads on Leads entity</li>
                  </ul>
                  <p className="mt-4"><span className="text-slate-500">Overall Health Status:</span> <span className="text-yellow-400 font-bold">WATCH</span></p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="py-24 relative overflow-hidden">
        <GlowingOrb position="center" size="500px" opacity={0.1} />
        
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Deploy Sentinel in 5 minutes
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            Copy the prompt, create a Super Agent, and start monitoring your Base44 app for intrusions immediately.
          </p>
          <Button 
            onClick={() => document.getElementById('prompt-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-10 text-lg"
          >
            Get Sentinel Free
          </Button>
        </div>
      </Section>
    </div>
  );
}