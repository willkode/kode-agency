import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X, ChevronRight, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Services', path: 'Services' },
    { name: 'Platforms', path: 'Platforms' },
    { name: 'Process', path: 'Process' },
    { name: 'Portfolio', path: 'Portfolio' },
    { name: 'Pricing', path: 'Pricing' },
    { name: 'About', path: 'About' },
    { name: 'Blog', path: 'Blog' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2 z-50">
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691e276e2117009b68e21c5c/3e54475dc_KA-Logo.png" alt="KodeAgency" className="h-10 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={createPageUrl(link.path)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPageName === link.path
                    ? 'text-black bg-[#73e28a]'
                    : 'text-slate-400 hover:text-[#73e28a] hover:bg-slate-800/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link to={createPageUrl('Contact')}>
              <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold border-0 rounded-full px-6">
                Let's Talk
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-slate-400 hover:text-white z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>

          {/* Mobile Nav Overlay */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-slate-950 z-40 flex flex-col pt-24 px-6 lg:hidden">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={createPageUrl(link.path)}
                    className={`text-lg font-medium py-2 border-b border-slate-900 ${
                       currentPageName === link.path ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link to={createPageUrl('Contact')} className="mt-4">
                  <Button className="w-full bg-[#73e28a] hover:bg-[#5dbb72] text-black h-12 text-lg">
                    Let's Talk
                  </Button>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#0a1018] mt-20">
        {/* Subscribe Section */}
        <div className="container mx-auto px-4 py-16 border-b border-slate-800">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-md">
              <div className="flex items-center gap-2 text-[#73e28a] text-sm font-medium mb-4">
                <span className="text-lg">✦</span>
                <span className="uppercase tracking-wider">Get InTouch</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Subscribe Now.</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Fusce eget accumsan urna, id rhoncus tortor.<br />
                Interdum leo non orci fringilla suscipit.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-end gap-8 flex-1 max-w-xl">
              <div className="flex-1 w-full">
                <label className="text-white text-sm font-bold mb-2 block">Your Mail:</label>
                <input 
                  type="email" 
                  placeholder="info@exand.com" 
                  className="w-full bg-transparent border-b border-slate-700 py-3 text-slate-400 placeholder:text-slate-500 focus:outline-none focus:border-[#73e28a]"
                />
              </div>
              <button className="w-24 h-24 rounded-full border-2 border-[#73e28a] flex flex-col items-center justify-center text-[#73e28a] hover:bg-[#73e28a] hover:text-black transition-all group flex-shrink-0">
                <span className="text-xs font-medium">Now</span>
                <ChevronRight className="w-5 h-5 -rotate-45" />
                <span className="text-xs font-bold">Subscribe</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* More Service Column */}
            <div className="lg:col-span-2">
              <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-8">More Service</h4>
              <div className="grid grid-cols-2 gap-x-16 gap-y-4">
                <ul className="space-y-4 text-sm text-slate-400">
                  <li><Link to={createPageUrl('Services')} className="hover:text-[#73e28a] transition-colors">Corporate Business</Link></li>
                  <li><Link to={createPageUrl('Services')} className="hover:text-[#73e28a] transition-colors">SEO Agency</Link></li>
                  <li><Link to={createPageUrl('Services')} className="hover:text-[#73e28a] transition-colors">Company Report</Link></li>
                  <li><Link to={createPageUrl('Services')} className="hover:text-[#73e28a] transition-colors">Marketing</Link></li>
                </ul>
                <ul className="space-y-4 text-sm text-slate-400">
                  <li><Link to={createPageUrl('About')} className="hover:text-[#73e28a] transition-colors">About us</Link></li>
                  <li><Link to={createPageUrl('Portfolio')} className="hover:text-[#73e28a] transition-colors">Case Studies</Link></li>
                  <li><Link to={createPageUrl('Legal')} className="hover:text-[#73e28a] transition-colors">Privacy Policy</Link></li>
                  <li><Link to={createPageUrl('Contact')} className="hover:text-[#73e28a] transition-colors">Contact us</Link></li>
                </ul>
              </div>
            </div>

            {/* Working Hours */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-8">Working Hours</h4>
              <div className="space-y-6 text-sm">
                <div>
                  <p className="text-slate-500 mb-1">Our Office are open 07AM – 22PM</p>
                  <p className="text-white font-bold">MONDAY – FRIDAY</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Our Office are open 10AM – 17PM</p>
                  <p className="text-white font-bold">WEEKENDS</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-8">Address</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                785 15h Street – Sydney Harbor<br />
                Bridge Circular City of Sydney,<br />
                <span className="text-[#73e28a]">#Australia.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="container mx-auto px-4 py-6 border-t border-slate-800">
          <p className="text-slate-500 text-sm text-center">© {new Date().getFullYear()} Kode Agency. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}