import React from 'react';
import Section from '@/components/ui-custom/Section';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQPage() {
  const faqs = [
    {
      q: "Can you fix or extend an existing app on Base44 / Lovable / Replit?",
      a: "Yes! We often take over projects that were started by founders or other agencies. We'll do a quick audit of the current state and propose a plan to stabilize or extend it."
    },
    {
      q: "Do I own the code and app?",
      a: "Absolutely. Once the project is paid for and handed over, you own 100% of the intellectual property, code, and accounts."
    },
    {
      q: "Can we host it under our own accounts?",
      a: "Yes. We prefer to build directly in your platform accounts (Base44, Replit, AWS, etc.) so you have full control from day one."
    },
    {
      q: "What happens after launch?",
      a: "We offer a 30-day warranty period for bug fixes. After that, you can choose one of our support packages or manage it yourself. We provide a full handover document."
    },
    {
      q: "Do you white-label for other agencies?",
      a: "Yes, we act as the 'secret development arm' for several design and marketing agencies. We can work under your brand or as a partner."
    }
  ];

  return (
    <div>
      <Section className="pt-32 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Frequently Asked Questions</h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          Everything you need to know about working with us.
        </p>
      </Section>

      <Section>
        <div className="max-w-3xl mx-auto">
           <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                 <AccordionItem key={index} value={`item-${index}`} className="border border-slate-800 rounded-lg bg-slate-900 px-6">
                    <AccordionTrigger className="text-white hover:text-[#73e28a] hover:no-underline text-left font-semibold text-lg py-6">
                       {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-400 text-base pb-6 leading-relaxed">
                       {faq.a}
                    </AccordionContent>
                 </AccordionItem>
              ))}
           </Accordion>
        </div>
      </Section>
    </div>
  );
}