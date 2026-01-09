import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, Smartphone, Zap, Shield, Globe, ArrowRight, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';

export default function MobileAppConversionPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    web_app_url: '',
    description: '',
    has_auth: '',
    platforms_needed: [],
    add_ons: [],
    questions: ''
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data) => {
      const response = await base44.functions.invoke('createMobileAppConversionOrder', data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      }
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    createOrderMutation.mutate(formData);
  };

  return (
    <div className="bg-slate-950 text-white">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#73e28a]/5 to-indigo-500/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Smartphone className="w-10 h-10 text-[#73e28a]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Turn Your Web App Into a Real Mobile App
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Launch a clean, installable mobile app from your existing web application—without rebuilding everything from scratch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-[#73e28a] mb-2">$750</div>
                <p className="text-slate-400">One-time conversion service</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="bg-[#73e28a] text-black hover:bg-[#5dbb72] text-lg px-8 py-6 h-auto"
              >
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                onClick={() => window.location.href = 'mailto:support@kodebase.us'}
                variant="outline"
                className="border-slate-700 text-white hover:bg-slate-800 text-lg px-8 py-6 h-auto"
              >
                Ask a Question
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Trust Bullets */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <Shield className="w-10 h-10 text-[#73e28a] mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Keep Your Existing Logic</h3>
              <p className="text-slate-400">Your web app stays the core—we wrap it in a mobile shell</p>
            </Card>
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <Globe className="w-10 h-10 text-[#73e28a] mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Store Ready</h3>
              <p className="text-slate-400">App Store / Google Play ready packaging or private distribution</p>
            </Card>
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <Zap className="w-10 h-10 text-[#73e28a] mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Mobile Features Available</h3>
              <p className="text-slate-400">Push notifications, deep links, and device features as add-ons</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Who This Is For</h2>
          <p className="text-xl text-slate-300 mb-6">If you already have a working web app and you want:</p>
          <div className="space-y-4">
            {[
              'An installable app icon on your customer\'s phone',
              'Better mobile experience than browser-only',
              'Access to mobile capabilities (notifications, camera, files, etc.)',
              'A path to App Store / Google Play distribution'
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Check className="w-6 h-6 text-[#73e28a] flex-shrink-0 mt-1" />
                <p className="text-slate-300 text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">What You Get for $750</h2>
          
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">Included</h3>
            <div className="space-y-4">
              {[
                'App wrapper conversion using a modern mobile shell (Capacitor or React Native WebView)',
                'Android build (APK/AAB) and iOS build (IPA via standard iOS signing)',
                'Responsive/mobile UX pass (basic layout fixes for mobile screens)',
                'Navigation + session handling improvements (auth persistence, safe redirects)',
                'Build & deployment guidance for Google Play, Apple App Store, or private distribution'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#73e28a] flex-shrink-0 mt-1" />
                  <p className="text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Deliverables</h3>
            <div className="space-y-4">
              {[
                'A mobile app project repo (or exported project zip)',
                'Build artifacts (Android + iOS)',
                'A short handoff doc with install steps, settings, and next actions'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#73e28a] flex-shrink-0 mt-1" />
                  <p className="text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Convert Means */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">What "Convert" Means</h2>
          <p className="text-xl text-slate-300 mb-6">This service wraps your web app inside a mobile container so it installs like a native app. That means:</p>
          <div className="space-y-4">
            {[
              'Your existing web app is still the "core"',
              'The app runs inside a secure mobile WebView (or hybrid shell)',
              'You can still iterate your web app and the mobile app reflects updates',
              'If you need fully native screens (pure Swift/Kotlin), that\'s a separate scope—but this is the fastest path'
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#73e28a] rounded-full mt-2.5 flex-shrink-0" />
                <p className="text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Common Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'SaaS dashboards and client portals',
              'Internal tools and field apps',
              'Booking, quoting, or CRM-style apps',
              'Communities, member areas, or course platforms',
              'MVPs that need a "real app" presence quickly'
            ].map((item, idx) => (
              <Card key={idx} className="p-4 bg-slate-800/50 border-slate-700">
                <p className="text-slate-300">{item}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Add-Ons (Optional)</h2>
          <p className="text-xl text-slate-300 mb-6">If you want more than a basic conversion:</p>
          <div className="space-y-3">
            {[
              'Push notifications (FCM/APNs + integration)',
              'Deep linking (open the app from links, email, QR codes)',
              'Camera / file upload optimization',
              'Offline mode / caching',
              'App Store submission support (screenshots, listings, compliance checks)'
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Check className="w-6 h-6 text-[#73e28a] flex-shrink-0 mt-1" />
                <p className="text-slate-300">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-400 mt-4 italic">(Add-ons can be quoted after a quick review.)</p>
        </div>
      </section>

      {/* What We Need */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">What I Need From You</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">To start, you provide:</h3>
              <div className="space-y-3">
                {[
                  'Your web app URL (staging or production)',
                  'Login credentials for a test account',
                  'If applicable: API base URL + environment variables',
                  'Brand assets (logo, app name, accent color)'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-[#73e28a] flex-shrink-0 mt-1" />
                    <p className="text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">For iOS App Store builds:</h3>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-[#73e28a] flex-shrink-0 mt-1" />
                <p className="text-slate-300">An Apple Developer account (I can guide you through this)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Submission Support */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">App Submission Support</h2>
          <p className="text-xl text-slate-300 mb-6">We manage the submission process end-to-end inside your accounts, including:</p>
          <div className="space-y-3">
            {[
              'Store listing setup (basic)',
              'Build upload and release configuration',
              'Compliance fields guidance (privacy, permissions, age rating)',
              'Responding to routine review questions with your approval'
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-[#73e28a] flex-shrink-0 mt-1" />
                <p className="text-slate-300">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-400 mt-6 italic">Note: Final approval is always at the discretion of Apple/Google.</p>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">Process</h2>
          <div className="space-y-8">
            {[
              { title: 'Quick review (same day)', desc: 'I verify your web app is compatible and flag any blockers early.' },
              { title: 'Build the mobile shell', desc: 'App structure, navigation handling, and mobile configuration.' },
              { title: 'Mobile UX pass', desc: 'Fix obvious layout issues on mobile screens.' },
              { title: 'Deliver + handoff', desc: 'You get the project, builds, and deployment steps.' }
            ].map((step, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#73e28a] rounded-full flex items-center justify-center text-black font-bold text-xl">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-300">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Known Limitations (Transparency)</h2>
          <p className="text-xl text-slate-300 mb-6">Some web apps need extra work due to:</p>
          <div className="space-y-3">
            {[
              'Heavy desktop-only UI layouts',
              'Third-party auth flows that block WebViews',
              'Complex file handling',
              'Safari/iOS-specific constraints'
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2.5 flex-shrink-0" />
                <p className="text-slate-300">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-400 mt-6">If your app has a blocker, you'll know right away and you can decide whether to proceed.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">FAQ</h2>
          <div className="space-y-8">
            {[
              {
                q: 'How long does it take?',
                a: 'Most conversions are fast once access is provided. Complexity depends on auth, responsiveness, and any native features requested.'
              },
              {
                q: 'Will my app be approved?',
                a: 'We build to platform guidelines and handle submissions, but Apple/Google make the final decision. If we foresee approval risk, we flag it early.'
              },
              {
                q: 'Do I need my own developer accounts?',
                a: 'Yes. We submit to your accounts. If you do not have them yet, we will guide setup.'
              },
              {
                q: 'Are the Apple/Google fees included?',
                a: 'No. Those fees are paid directly to Apple/Google: $25 Google, $100 Apple.'
              },
              {
                q: 'Can you add push notifications?',
                a: 'Yes—quoted as an add-on depending on your backend and notification requirements.'
              }
            ].map((faq, idx) => (
              <div key={idx}>
                <h3 className="text-xl font-bold text-white mb-3">{faq.q}</h3>
                <p className="text-slate-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-[#73e28a]/10 to-indigo-500/10">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to put your web app in someone's pocket?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Convert your web app into a real mobile app for $750.
          </p>
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="bg-[#73e28a] text-black hover:bg-[#5dbb72] text-lg px-8 py-6 h-auto"
          >
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-slate-400 mt-4">Send your link and I'll confirm compatibility.</p>
        </div>
      </section>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Mobile App Conversion Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Name *</Label>
                <Input 
                  required
                  className="bg-slate-800 border-slate-700"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <Label className="text-slate-300">Email *</Label>
                <Input 
                  required
                  type="email"
                  className="bg-slate-800 border-slate-700"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label className="text-slate-300">Company</Label>
              <Input 
                className="bg-slate-800 border-slate-700"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-slate-300">Web App URL *</Label>
              <Input 
                required
                type="url"
                placeholder="https://your-app.com"
                className="bg-slate-800 border-slate-700"
                value={formData.web_app_url}
                onChange={(e) => setFormData({...formData, web_app_url: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-slate-300">Brief Description of Your Web App *</Label>
              <Textarea 
                required
                placeholder="What does your web app do? Who uses it?"
                className="bg-slate-800 border-slate-700 h-24"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-slate-300">Does your app require authentication/login?</Label>
              <Input 
                placeholder="Yes/No and describe briefly"
                className="bg-slate-800 border-slate-700"
                value={formData.has_auth}
                onChange={(e) => setFormData({...formData, has_auth: e.target.value})}
              />
            </div>

            <div>
              <Label className="text-slate-300">Platforms Needed</Label>
              <div className="space-y-2 mt-2">
                {['Android', 'iOS', 'Both'].map(platform => (
                  <label key={platform} className="flex items-center gap-2 text-slate-300">
                    <input 
                      type="checkbox"
                      className="w-4 h-4"
                      checked={formData.platforms_needed.includes(platform)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, platforms_needed: [...formData.platforms_needed, platform]});
                        } else {
                          setFormData({...formData, platforms_needed: formData.platforms_needed.filter(p => p !== platform)});
                        }
                      }}
                    />
                    {platform}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-slate-300">Add-Ons Interested In (optional)</Label>
              <div className="space-y-2 mt-2">
                {[
                  'Push Notifications',
                  'Deep Linking',
                  'Camera/File Upload Optimization',
                  'Offline Mode',
                  'App Store Submission Support'
                ].map(addon => (
                  <label key={addon} className="flex items-center gap-2 text-slate-300">
                    <input 
                      type="checkbox"
                      className="w-4 h-4"
                      checked={formData.add_ons.includes(addon)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, add_ons: [...formData.add_ons, addon]});
                        } else {
                          setFormData({...formData, add_ons: formData.add_ons.filter(a => a !== addon)});
                        }
                      }}
                    />
                    {addon}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-slate-300">Questions or Special Requirements</Label>
              <Textarea 
                placeholder="Anything else we should know?"
                className="bg-slate-800 border-slate-700 h-24"
                value={formData.questions}
                onChange={(e) => setFormData({...formData, questions: e.target.value})}
              />
            </div>

            <Button 
              type="submit"
              disabled={createOrderMutation.isPending}
              className="w-full bg-[#73e28a] text-black hover:bg-[#5dbb72] h-12 text-lg"
            >
              {createOrderMutation.isPending ? 'Processing...' : 'Submit & Pay $750'}
            </Button>

            {createOrderMutation.isError && (
              <p className="text-red-400 text-sm">{createOrderMutation.error.message}</p>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}