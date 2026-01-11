import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import GridBackground from '@/components/ui-custom/GridBackground';

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-slate-950 relative flex items-center justify-center px-4">
      <GridBackground />
      
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 bg-[#73e28a]/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-10 h-10 text-[#73e28a]" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Thank You!
        </h1>
        
        <p className="text-xl text-slate-400 mb-8">
          We've received your message and will get back to you soon. In the meantime, let's schedule a time to chat about your project.
        </p>
        
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-[#73e28a]" />
            <h2 className="text-2xl font-bold text-white">Book a Call</h2>
          </div>
          <p className="text-slate-400 mb-6">
            Pick a time that works best for you and let's discuss how we can bring your vision to life.
          </p>
          <a 
            href="https://calendar.app.google/Cdphr9Rhn1QEURLz6" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black text-lg px-8 py-6 h-auto">
              Schedule Your Call
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
        
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" className="text-slate-400 hover:text-white">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}