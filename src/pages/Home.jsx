import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import SEO, { createOrganizationSchema, createLocalBusinessSchema } from '@/components/SEO';
import { ArrowRight, ArrowUpRight, Rocket, Bot, Search, Target, ChevronLeft, ChevronRight, Zap, Stethoscope, Package, Smartphone, Play, Plus, Minus } from 'lucide-react';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const heroSlides = [
    {
      headline: "30 Years of Expertise. AI-Powered Speed.",
      subhead: "We've generated $100M+ in client revenue. Now we build 10x faster with AI. Your unfair advantage starts here.",
      bullets: ["Battle-Tested Marketing + Cutting-Edge Dev", "From Zero to Revenue in Weeks, Not Months", "Fixed Pricing. No Surprises. Real Results."]
    },
    {
      headline: "Your MVP. Live in 4 Weeks.",
      subhead: "Stop burning runway on slow agencies. We've launched 200+ products. Yours could be next.",
      bullets: ["Production-Ready, Not Just Prototypes", "Built to Scale From Day One", "AI-Accelerated Without Cutting Corners"]
    },
    {
      headline: "Traffic is Vanity. Revenue is Sanity.",
      subhead: "We don't chase rankings—we engineer profitable customer acquisition systems. 30 years of conversion science meets AI.",
      bullets: ["SEO That Drives Revenue, Not Just Traffic", "Paid Ads with 3-10x ROAS Track Record", "Conversion Funnels That Actually Convert"]
    },
    {
      headline: "Automate Everything. Outpace Everyone.",
      subhead: "Your competitors are using AI wrong. We build systems that compound your advantage while you sleep.",
      bullets: ["Custom AI Agents That Work 24/7", "Workflow Automations That Save 40+ Hours/Week", "Integrations That Eliminate Busywork"]
    },
    {
      headline: "Design That Sells. Not Just Looks Pretty.",
      subhead: "Every pixel is a persuasion trigger. We've optimized thousands of interfaces. We know what converts.",
      bullets: ["Psychology-Driven UI/UX Design", "Brands That Command Premium Prices", "Websites That Turn Visitors Into Buyers"]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    { icon: Rocket, title: "MVP Development", desc: "Ship in weeks, not months. 200+ products launched. Yours is next." },
    { icon: Bot, title: "AI Systems", desc: "Automate the repetitive. Amplify the profitable. Work smarter." },
    { icon: Search, title: "SEO & Content", desc: "Page 1 rankings that drive revenue, not just vanity metrics." },
    { icon: Target, title: "Paid Ads & CRO", desc: "Turn ad spend into predictable profit. 3-10x ROAS guaranteed." }
  ];

  const specialtyServices = [
    { icon: Zap, title: "Build Sprint", slug: "BuildSprint", price: "$75/hr", desc: "Live screen-share session where I build your MVP while you watch and learn." },
    { icon: Stethoscope, title: "Base44 Emergency Room", slug: "Base44ER", price: "$50-$150", desc: "Expert app review + optional fix service. Get your Base44 app unstuck." },
    { icon: Package, title: "App Foundation", slug: "AppFoundation", price: "$250", desc: "Done-for-you app scaffolding with core data models and integrations." },
    { icon: Smartphone, title: "Mobile App Conversion", slug: "MobileAppConversion", price: "$750", desc: "Turn your web app into a real mobile app for Android and iOS." },
  ];

  const faqs = [
    { q: "How fast can you deliver an MVP?", a: "Most MVPs are delivered in 4-8 weeks depending on complexity. We've shipped over 200 products, so we know exactly how to scope and execute efficiently." },
    { q: "What's included in the fixed pricing?", a: "Everything needed to launch: design, development, testing, and deployment. No hidden fees, no surprise invoices. You know exactly what you're paying before we start." },
    { q: "Do you work with early-stage startups?", a: "Absolutely. Many of our clients are founders with an idea and limited runway. We help them validate fast and ship faster." },
    { q: "What technologies do you use?", a: "We're platform-agnostic but specialize in modern stacks: React, Next.js, Base44, and AI-powered tools that let us build 10x faster." },
  ];

  const teamMembers = [
    { name: "Strategy Lead", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" },
    { name: "Lead Developer", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop" },
    { name: "Design Director", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop" },
    { name: "Growth Expert", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      createOrganizationSchema(),
      createLocalBusinessSchema(),
      {
        "@type": "WebSite",
        "name": "Kode Agency",
        "url": "https://kodeagency.us",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://kodeagency.us/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <div className="bg-slate-950 text-white">
      <SEO 
        title="AI-Powered Web Development & Digital Marketing Agency"
        description="30+ years of expertise meets AI-powered speed. We build MVPs in 4-8 weeks, create AI systems, and drive revenue through SEO & paid ads. $100M+ in client revenue generated."
        keywords={["web development agency", "AI development", "MVP development", "digital marketing", "SEO services", "SaaS development", "Base44 developer", "app development"]}
        url="/"
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen">
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[#73e28a] text-sm font-medium">✦</span>
                <span className="text-slate-400 text-sm uppercase tracking-wider">Web Design Agency</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]">
                {heroSlides[currentSlide].headline.split('.')[0]}
                <span className="text-[#73e28a]">.</span>
              </h1>
              
              <p className="text-slate-400 text-lg mb-8 max-w-lg">
                {heroSlides[currentSlide].subhead}
              </p>

              <div className="flex flex-col gap-3 mb-10">
                {heroSlides[currentSlide].bullets.map((bullet, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300">
                    <ArrowRight className="w-4 h-4 text-[#73e28a] flex-shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6 mb-10">
                <Link to={createPageUrl('Contact')}>
                  <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-8 text-base rounded-full">
                    Let's Build Together
                  </Button>
                </Link>
                <button className="flex items-center gap-3 text-white hover:text-[#73e28a] transition-colors">
                  <div className="w-12 h-12 rounded-full border border-slate-600 flex items-center justify-center">
                    <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                  </div>
                  <span className="text-sm font-medium">Watch Demo</span>
                </button>
              </div>

              {/* Slider Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                  className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:border-[#73e28a] hover:text-[#73e28a] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                  className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:border-[#73e28a] hover:text-[#73e28a] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="text-slate-500 text-sm ml-2">0{currentSlide + 1} / 05</span>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=700&fit=crop" 
                  alt="Team collaboration"
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-[200px]">
                <div className="text-4xl font-bold text-white mb-1">200+</div>
                <div className="text-slate-400 text-sm">Products Launched</div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-10 -right-4 w-24 h-24 border border-[#73e28a]/30 rounded-full" />
              <div className="absolute top-20 -right-8 w-16 h-16 bg-[#73e28a]/10 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#73e28a] text-sm font-medium">✦</span>
                <span className="text-slate-400 text-sm uppercase tracking-wider">Best Of Service</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                All Professional Web Offering Best Solutions & Services
              </h2>
              <p className="text-slate-400 mb-8">
                Most agencies are either old-school marketers who can't code, or young devs who don't understand business. We're the rare breed that's mastered both—and now we move 10x faster with AI.
              </p>
              <Link to={createPageUrl('Services')}>
                <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold rounded-full px-8">
                  View All Services <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=500&fit=crop" 
                alt="Digital workspace"
                className="rounded-3xl w-full h-[400px] object-cover"
              />
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-[#73e28a] rounded-2xl p-4">
                <ArrowUpRight className="w-6 h-6 text-black" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Different Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-[#73e28a] text-sm font-medium">✦</span>
              <span className="text-slate-400 text-sm uppercase tracking-wider">World Wide Smart Digital Agency</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              30 Years of Wins.<br />
              <span className="text-[#73e28a]">Now Supercharged by AI.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Large Card */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop" 
                alt="Team working"
                className="w-full h-64 object-cover"
              />
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">$100M+ in revenue generated. 200+ products launched.</h3>
                <p className="text-slate-400">We've seen what works, what fails, and exactly how to shortcut your path to success. Stop gambling. Start scaling.</p>
              </div>
            </div>

            {/* Small Cards */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-[calc(50%-12px)]">
                <div className="w-12 h-12 bg-[#73e28a]/10 rounded-xl flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-[#73e28a]" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">10x Faster Delivery</h4>
                <p className="text-slate-400 text-sm">AI-accelerated without cutting corners.</p>
              </div>
              <div className="bg-[#73e28a] rounded-3xl p-6 h-[calc(50%-12px)]">
                <div className="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-black" />
                </div>
                <h4 className="text-lg font-bold text-black mb-2">Fixed Pricing</h4>
                <p className="text-black/70 text-sm">No surprises. Real results.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-[#73e28a] text-sm font-medium">✦</span>
            <span className="text-slate-400 text-sm uppercase tracking-wider">The Kode Advantage</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            All Professional Web Quality<br />Best Print Mockups
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-[#73e28a] mb-2">30+</div>
              <div className="text-slate-400">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-[#73e28a] mb-2">$100M</div>
              <div className="text-slate-400">Revenue Generated</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-[#73e28a] mb-2">200+</div>
              <div className="text-slate-400">Products Launched</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop" 
              alt="Team working"
              className="rounded-3xl w-full h-[300px] object-cover"
            />
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white mb-4">Stop Hiring. Start Winning.</h3>
              <p className="text-slate-400 mb-6">
                You could hire a dev shop that doesn't understand marketing. Or a marketing agency that can't build. Or waste months managing both. Or you could just win.
              </p>
              <div className="space-y-4">
                {[
                  { num: "01", title: "Speed That Compounds", desc: "Ship in weeks while competitors take months." },
                  { num: "02", title: "30 Years of Conversion Science", desc: "Every feature we build is designed to drive revenue." },
                  { num: "03", title: "Fixed Price. Fixed Timeline.", desc: "Know exactly what you'll pay and when you'll launch." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="text-[#73e28a] font-bold">{item.num}</span>
                    <div>
                      <h4 className="text-white font-semibold">{item.title}</h4>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-[#73e28a] text-sm font-medium">✦</span>
            <span className="text-slate-400 text-sm uppercase tracking-wider">Our Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            All Professional Web Quality<br />Business & Marketplace
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-[#73e28a]/50 transition-colors group">
                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#73e28a] transition-colors">
                  <service.icon className="w-6 h-6 text-[#73e28a] group-hover:text-black transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-[#73e28a] text-sm font-medium">✦</span>
            <span className="text-slate-400 text-sm uppercase tracking-wider">Our Team</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Meet The Experts Behind<br />Your Success
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <div key={i} className="group">
                <div className="relative rounded-3xl overflow-hidden mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="text-white font-bold text-center">{member.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialty Services */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-[#73e28a] text-sm font-medium">✦</span>
            <span className="text-slate-400 text-sm uppercase tracking-wider">Quick & Focused</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Specialty Services
          </h2>
          <p className="text-slate-400 text-center mb-16 max-w-2xl mx-auto">
            Targeted sessions for builders — get expert help fast without a full project engagement.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialtyServices.map((service, i) => (
              <Link key={i} to={createPageUrl(service.slug)}>
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-[#73e28a]/50 transition-colors group h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-[#73e28a] transition-colors">
                      <service.icon className="w-6 h-6 text-[#73e28a] group-hover:text-black transition-colors" />
                    </div>
                    <span className="text-[#73e28a] font-bold">{service.price}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#73e28a] transition-colors">{service.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{service.desc}</p>
                  <div className="flex items-center text-[#73e28a] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn More <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#73e28a] text-sm font-medium">✦</span>
                <span className="text-slate-400 text-sm uppercase tracking-wider">We Answer Best</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Frequently Ask Questions
              </h2>
              <img 
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=500&h=400&fit=crop" 
                alt="FAQ"
                className="rounded-3xl w-full h-[300px] object-cover"
              />
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="text-white font-semibold pr-4">{faq.q}</span>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${openFaq === i ? 'bg-[#73e28a]' : 'bg-slate-800'}`}>
                      {openFaq === i ? (
                        <Minus className={`w-5 h-5 ${openFaq === i ? 'text-black' : 'text-white'}`} />
                      ) : (
                        <Plus className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6">
                      <p className="text-slate-400">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-[#73e28a] text-sm font-medium">✦</span>
              <span className="text-slate-400 text-sm uppercase tracking-wider">Proven Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">From Zero to Revenue. Fast.</h2>
            <p className="text-slate-400 mt-4">The same system that's launched 200+ successful products.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
            {[
              { num: "01", title: "Discover", desc: "Find the fastest path to revenue" },
              { num: "02", title: "Scope", desc: "Lock in features, timeline & price" },
              { num: "03", title: "Sprint", desc: "Build at 10x speed with AI" },
              { num: "04", title: "Launch", desc: "Go live with marketing ready" },
              { num: "05", title: "Scale", desc: "Compound your wins" }
            ].map((step, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-[#73e28a] flex items-center justify-center text-[#73e28a] font-bold text-xl group-hover:bg-[#73e28a] group-hover:text-black transition-all">
                  {step.num}
                </div>
                <h4 className="text-white font-bold mb-2">{step.title}</h4>
                <p className="text-slate-400 text-sm max-w-[140px]">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to={createPageUrl('Process')}>
              <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600 rounded-full">
                See Full Process <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&h=400&fit=crop" 
                alt="Work"
                className="rounded-3xl w-full h-[250px] object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=300&h=400&fit=crop" 
                alt="Team"
                className="rounded-3xl w-full h-[250px] object-cover mt-8"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#73e28a] text-sm font-medium">✦</span>
                <span className="text-slate-400 text-sm uppercase tracking-wider">Have Any Project</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Your Competitors Won't Wait. Neither Should You.
              </h2>
              <p className="text-slate-400 mb-8">
                Every day you delay is a day they're gaining ground. Let's change that. Free strategy call—no pitch, just answers.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={createPageUrl('Contact')}>
                  <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold rounded-full px-8">
                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to={createPageUrl('Portfolio')}>
                  <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 rounded-full px-8">
                    View Our Work
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}