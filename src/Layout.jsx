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
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691e276e2117009b68e21c5c/474e850a6_kodeagency-logo.png" alt="KodeAgency" className="h-10 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={createPageUrl(link.path)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPageName === link.path
                    ? 'text-black bg-lime-400'
                    : 'text-slate-400 hover:text-lime-400 hover:bg-slate-800/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link to={createPageUrl('Contact')}>
              <Button className="bg-lime-400 hover:bg-lime-500 text-black font-bold border-0 rounded-full px-6">
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
                  <Button className="w-full bg-lime-400 hover:bg-lime-500 text-black h-12 text-lg">
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
      <footer className="bg-slate-900 border-t border-slate-800 mt-20 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691e276e2117009b68e21c5c/474e850a6_kodeagency-logo.png" alt="KodeAgency" className="h-8 w-auto" />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Accelerating software development with AI and modern platforms. We build serious apps fast.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github size={20} /></a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Services</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to={createPageUrl('Services')} className="hover:text-lime-400 transition-colors">Platform Builds</Link></li>
                <li><Link to={createPageUrl('Services')} className="hover:text-lime-400 transition-colors">Custom Development</Link></li>
                <li><Link to={createPageUrl('Services')} className="hover:text-lime-400 transition-colors">Integrations</Link></li>
                <li><Link to={createPageUrl('Services')} className="hover:text-lime-400 transition-colors">Support & Maintenance</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to={createPageUrl('About')} className="hover:text-lime-400 transition-colors">About Us</Link></li>
                <li><Link to={createPageUrl('Process')} className="hover:text-lime-400 transition-colors">Our Process</Link></li>
                <li><Link to={createPageUrl('Careers')} className="hover:text-lime-400 transition-colors">Careers</Link></li>
                <li><Link to={createPageUrl('Contact')} className="hover:text-lime-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Resources</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to={createPageUrl('Blog')} className="hover:text-lime-400 transition-colors">Blog</Link></li>
                <li><Link to={createPageUrl('Portfolio')} className="hover:text-lime-400 transition-colors">Case Studies</Link></li>
                <li><Link to={createPageUrl('FAQ')} className="hover:text-lime-400 transition-colors">FAQ</Link></li>
                <li><Link to={createPageUrl('Legal')} className="hover:text-lime-400 transition-colors">Privacy & Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© {new Date().getFullYear()} AI Agency. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-slate-500">
              <Link to={createPageUrl('Legal')} className="hover:text-slate-300">Privacy Policy</Link>
              <Link to={createPageUrl('Legal')} className="hover:text-slate-300">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}