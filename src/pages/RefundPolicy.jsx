import React from 'react';
import PageHero from '@/components/ui-custom/PageHero';
import Section from '@/components/ui-custom/Section';
import GridBackground from '@/components/ui-custom/GridBackground';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-slate-950">
      <PageHero title="Refund Policy" />
      
      <Section className="py-16">
        <GridBackground />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12">
            <p className="text-slate-400 mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Our Refund Policy</h2>
                <p className="text-slate-300 leading-relaxed">
                  At Kode Agency, we are committed to delivering high-quality services and ensuring customer satisfaction. 
                  Please review our refund policy below before purchasing any of our services.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-3">Hourly-Based Services</h3>
                <p className="text-slate-300 leading-relaxed">
                  All of our services are billed on an hourly basis. This includes but is not limited to development work, 
                  consulting, app reviews, build sprints, and any custom projects.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-3">Refund Eligibility</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                  <strong className="text-white">Refunds are only provided for unused hours.</strong>
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>If you have purchased a package of hours and have not used all of them, you may request a refund for the remaining unused hours.</li>
                  <li>Hours that have already been worked or allocated to your project are non-refundable.</li>
                  <li>Partial hour usage will be rounded up to the nearest full hour for billing purposes.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-3">How to Request a Refund</h3>
                <p className="text-slate-300 leading-relaxed">
                  To request a refund for unused hours, please contact us at{' '}
                  <a href="mailto:hello@kodebase.us" className="text-[#73e28a] hover:underline">
                    hello@kodebase.us
                  </a>{' '}
                  with your order details and the number of unused hours you wish to be refunded for.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-3">Processing Time</h3>
                <p className="text-slate-300 leading-relaxed">
                  Approved refunds will be processed within 5-10 business days. The refund will be issued to the original 
                  payment method used for the purchase.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-3">Questions?</h3>
                <p className="text-slate-300 leading-relaxed">
                  If you have any questions about our refund policy, please don't hesitate to reach out to us at{' '}
                  <a href="mailto:hello@kodebase.us" className="text-[#73e28a] hover:underline">
                    hello@kodebase.us
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}