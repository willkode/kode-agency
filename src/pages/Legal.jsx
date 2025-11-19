import React from 'react';
import Section from '@/components/ui-custom/Section';

export default function LegalPage() {
  return (
    <div>
      <Section className="pt-32 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Legal</h1>
      </Section>

      <Section>
        <div className="max-w-3xl mx-auto text-slate-400 space-y-8">
           <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
              <h2 className="text-2xl font-bold text-white mb-4">Privacy Policy</h2>
              <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
              <p className="mb-4">
                 Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect from you across our website.
              </p>
              <p className="mb-4">
                 We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.
              </p>
           </div>

           <div className="bg-slate-900 p-8 rounded-xl border border-slate-800">
              <h2 className="text-2xl font-bold text-white mb-4">Terms of Service</h2>
              <p className="mb-4">
                 By accessing our website, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
              </p>
              <p className="mb-4">
                 Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only.
              </p>
           </div>
        </div>
      </Section>
    </div>
  );
}