import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X, ChevronRight, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { HelmetProvider } from 'react-helmet-async';

export default function Layout({ children, currentPageName }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if admin user and redirect
  useEffect(() => {
    const checkAdminRedirect = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const user = await base44.auth.me();
          if (user?.role === 'admin' && currentPageName !== 'Admin') {
            navigate(createPageUrl('Admin'));
          }
        }
      } catch (e) {
        // Not logged in, ignore
      }
    };
    checkAdminRedirect();
  }, []);

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
    { name: 'Contact Us', path: 'Contact', isGreen: true },
  ];

  return (
    <HelmetProvider>
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
                    : link.isGreen
                    ? 'text-[#73e28a] hover:text-[#5dbb72] hover:bg-slate-800/50'
                    : 'text-slate-400 hover:text-[#73e28a] hover:bg-slate-800/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Button 
              onClick={() => base44.auth.redirectToLogin()}
              className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold border-0 rounded-full px-6"
            >
              Login
            </Button>
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
            <div className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col px-6 py-8 lg:hidden" style={{ backgroundColor: '#020617' }}>
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
                <Button 
                  onClick={() => base44.auth.redirectToLogin()}
                  className="w-full bg-[#73e28a] hover:bg-[#5dbb72] text-black h-12 text-lg mt-4"
                >
                  Login
                </Button>
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

            </div>

            <div className="flex flex-col md:flex-row items-start md:items-end gap-8 flex-1 max-w-xl">
              <div className="flex-1 w-full">
                <label className="text-white text-sm font-bold mb-2 block">Your Mail:</label>
                <input 
                  type="email" 
                  placeholder="hello@kodebase.us" 
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
                  <li><Link to={createPageUrl('RefundPolicy')} className="hover:text-[#73e28a] transition-colors">Refund Policy</Link></li>
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

            {/* Follow Us */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-8">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-[#73e28a] hover:text-black hover:border-[#73e28a] transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-[#73e28a] hover:text-black hover:border-[#73e28a] transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-[#73e28a] hover:text-black hover:border-[#73e28a] transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-[#73e28a] hover:text-black hover:border-[#73e28a] transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="container mx-auto px-4 py-6 border-t border-slate-800">
          <p className="text-slate-500 text-sm text-center">© {new Date().getFullYear()} Kode Agency. All rights reserved.</p>
          </div>
          </footer>
          </div>
          </HelmetProvider>
          );
}