import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import { 
  Layers, Target, Rocket, Code, 
  Maximize, Grid, CircleDashed, Shapes, 
  ArrowUpRight, Phone, Star, Quote,
  Twitter, Linkedin, Facebook
} from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="flex flex-col bg-slate-950 text-white overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 right-10 w-32 h-32 border-2 border-dashed border-slate-700 rounded-full opacity-20 animate-spin-slow" />
        <div className="absolute top-10 right-[15%] text-[#73e28a] animate-spin-slow hidden md:block">
           <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
              <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90C27.9 90 10 72.1 10 50S27.9 10 50 10s40 17.9 40 40-17.9 40-40 40z" fill="currentColor" fillOpacity="0.1"/>
              <path id="textPath" d="M 0,50 a 50,50 0 1,1 0,1 z" fill="none" />
              <text fill="currentColor" fontSize="10" fontWeight="bold" letterSpacing="2">
                <textPath href="#textPath" startOffset="0%">AGENCY CREATIVE DEVELOPMENT</textPath>
              </text>
           </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-start">
             <div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6">Services</h1>
                <div className="inline-flex items-center gap-2 px-6 py-2 border border-[#73e28a]/30 rounded text-sm font-medium bg-[#73e28a]/5">
                   <span className="text-[#73e28a]">Home</span>
                   <span className="text-slate-600">/</span>
                   <span className="text-white">Services</span>
                </div>
             </div>
             
             {/* Floating Images/Badges */}
             <div className="hidden md:block relative">
                <div className="absolute top-0 right-40 w-12 h-20 rounded-full overflow-hidden border-2 border-slate-800 transform -rotate-12">
                   <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=150&auto=format&fit=crop" className="w-full h-full object-cover" alt="Team" />
                </div>
             </div>
          </div>
        </div>
        
        {/* Background Overlay Image */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop" 
                className="w-full h-full object-cover"
                alt="Background"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>
      </section>

      {/* Services Grid Section */}
      <Section className="py-24">
         <div className="text-center mb-16">
            <div className="text-[#73e28a] text-sm font-bold uppercase tracking-wider mb-2">Best Of Service</div>
            <h2 className="text-3xl md:text-5xl font-bold">All Professional We're Offering Best <br/> Solutions & Services</h2>
         </div>

         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                  { icon: <Layers />, title: "Creative Solution", desc: "Strategy, Design, and Development across all platforms." },
                  { icon: <Target />, title: "Digital Design", desc: "Pixel perfect web and mobile design services." },
                  { icon: <Rocket />, title: "Marketing", desc: "Grow your audience with data-driven marketing." },
                  { icon: <Code />, title: "Prototyping", desc: "Rapid prototyping to validate your ideas fast." },
                  { icon: <Maximize />, title: "Web Solution", desc: "Robust and scalable web application development." },
                  { icon: <Grid />, title: "UI/UX Service", desc: "User-centric design that drives engagement." },
                  { icon: <CircleDashed />, title: "Branding Solution", desc: "Build a brand that stands out in the market." },
                  { icon: <Shapes />, title: "Design Service", desc: "Comprehensive design services for your business." },
               ].map((item, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center hover:border-[#73e28a] transition-all duration-300 group">
                     <div className="w-12 h-12 mx-auto mb-6 text-slate-400 group-hover:text-[#73e28a] transition-colors">
                        {React.cloneElement(item.icon, { strokeWidth: 1.5, width: 48, height: 48 })}
                     </div>
                     <h3 className="text-white font-bold text-lg mb-4">{item.title}</h3>
                     <p className="text-slate-500 text-sm mb-6 line-clamp-2">{item.desc}</p>
                     <button className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center mx-auto text-slate-400 hover:bg-[#73e28a] hover:border-[#73e28a] hover:text-black transition-all">
                        <ArrowUpRight className="w-4 h-4" />
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </Section>

      {/* Work Smart Section */}
      <Section className="py-16 relative overflow-hidden">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
               {/* Left: Image Composition */}
               <div className="relative">
                  <div className="relative z-10 grid grid-cols-2 gap-4">
                     <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop" className="rounded-xl w-full h-48 object-cover mt-12" alt="Office" />
                     <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop" className="rounded-xl w-full h-64 object-cover" alt="Meeting" />
                  </div>
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-24 h-24 border-2 border-dashed border-slate-700 rounded-full animate-spin-slow"></div>
                  {/* Green Triangle Decoration */}
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[50px] border-b-[#73e28a] transform rotate-12"></div>
               </div>

               {/* Right: Text Content */}
               <div>
                  <div className="flex items-center gap-2 text-[#73e28a] text-sm font-bold uppercase tracking-wider mb-2">
                     <span className="w-2 h-2 bg-[#73e28a] rounded-full"></span> Team Member
                  </div>
                  <h2 className="text-4xl font-bold mb-6">
                     We Do Work smart <br/> Digital agency
                  </h2>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                     Our agency is about people. We bring together the best talent to create teams that are greater than the sum of their parts.
                  </p>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                     From strategy to execution, we focus on delivering value at every step. Our process is transparent, efficient, and results-driven.
                  </p>

                  <div className="flex items-center gap-4 p-4 border border-slate-800 rounded-lg bg-slate-900/50 w-fit">
                     <div className="w-10 h-10 rounded-full bg-[#73e28a]/10 text-[#73e28a] flex items-center justify-center">
                        <Phone className="w-5 h-5" />
                     </div>
                     <div>
                        <span className="text-xs text-slate-500 block">Contact Number</span>
                        <span className="text-[#73e28a] font-bold">+00 (9900) 666 22</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </Section>

      {/* Team Section */}
      <Section className="py-24 bg-slate-900/20">
         <div className="text-center mb-16">
            <div className="text-[#73e28a] text-sm font-bold uppercase tracking-wider mb-2">Team Member</div>
            <h2 className="text-3xl md:text-5xl font-bold">All Professional Let's Look Our <br/> Recent Team Member</h2>
         </div>

         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
               {[
                  { name: "Henry Lucas", role: "Manager", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop" },
                  { name: "Elijah William", role: "Developer", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop" },
                  { name: "Kelly Jeffery", role: "Designer", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop" },
                  { name: "Rioben Dara", role: "Marketer", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" },
               ].map((member, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-xl">
                     <img src={member.img} alt={member.name} className="w-full h-[350px] object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 pt-20 flex justify-between items-end">
                        <div>
                           <h4 className="text-white font-bold text-lg">{member.name}</h4>
                           <p className="text-[#73e28a] text-sm">{member.role}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
                           <button className="bg-[#73e28a] p-1.5 rounded hover:bg-white transition-colors"><Twitter className="w-3 h-3 text-black" /></button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </Section>

      {/* Logo Strip */}
      <div className="bg-slate-900 py-12 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               {['SHAN IT', 'creativa it', 'innovate', 'smart', 'Canva', 'count.it'].map((brand, i) => (
                  <span key={i} className="text-2xl md:text-3xl font-bold text-slate-400 hover:text-white cursor-default">{brand}</span>
               ))}
            </div>
         </div>
      </div>

      {/* Testimonials Section */}
      <Section className="py-24">
         <div className="text-center mb-16">
            <div className="text-[#73e28a] text-sm font-bold uppercase tracking-wider mb-2">What's Clients Say</div>
            <h2 className="text-3xl md:text-5xl font-bold">Best Of Our Lat's Look Clients Latest <br/> Testimonials</h2>
         </div>

         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
               {[
                  { name: "Henry Lucas", role: "CEO, Tech", quote: "Maecenas cursus eget nunc ullamcorper amet. Sed id lacus quis tortor elementum.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop" },
                  { name: "Elijah William", role: "Founder, Art", quote: "Fusce eget accumsan urna. Id rhoncus tortor. Integer arc leo non orci fringilla suscipit.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop" },
                  { name: "Oliver Noah", role: "Manager, Biz", quote: "Maecenas cursus eget nunc ullamcorper amet. Sed id lacus quis tortor elementum.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" }
               ].map((t, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-xl relative group hover:border-[#73e28a]/30 transition-colors">
                     {/* Stars */}
                     <div className="flex gap-1 text-[#73e28a] mb-6">
                        {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-current" />)}
                     </div>
                     
                     <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                        "{t.quote}"
                     </p>
                     
                     <div className="flex items-center justify-between border-t border-slate-800 pt-6">
                        <div className="flex items-center gap-3">
                           <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                           <div>
                              <h4 className="text-white font-bold text-sm">{t.name}</h4>
                              <p className="text-slate-500 text-xs">{t.role}</p>
                           </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-[#73e28a] group-hover:text-black transition-colors">
                           <Quote className="w-3 h-3 fill-current" />
                        </div>
                     </div>
                     
                     {/* Green Quote Icon Top Right */}
                     <div className="absolute top-8 right-8 text-[#73e28a] opacity-20">
                        <Quote className="w-8 h-8 fill-current" />
                     </div>
                  </div>
               ))}
            </div>
            
            {/* Dots Pagination */}
            <div className="flex justify-center mt-12 gap-2">
               <div className="w-2 h-2 rounded-full bg-[#73e28a]"></div>
               <div className="w-2 h-2 rounded-full bg-slate-800"></div>
               <div className="w-2 h-2 rounded-full bg-slate-800"></div>
            </div>
         </div>
      </Section>

      {/* Newsletter Section */}
      <div className="container mx-auto px-4 mb-20 mt-10">
         <div className="bg-slate-900 rounded-3xl p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#73e28a]/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
               <div className="text-[#73e28a] text-xs font-bold uppercase tracking-wider mb-2">Get News</div>
               <h2 className="text-3xl font-bold text-white mb-2">Subscribe Now.</h2>
               <p className="text-slate-400 text-sm max-w-md">We will send you the latest news and updates. We don't spam.</p>
            </div>

            <div className="relative z-10 w-full md:w-auto flex gap-2">
               <div className="relative w-full md:w-80">
                  <input 
                     type="email" 
                     placeholder="Your Mail" 
                     className="bg-slate-950 border-b border-slate-800 w-full px-0 py-4 text-white focus:outline-none focus:border-[#73e28a] bg-transparent"
                  />
               </div>
               <button className="w-20 h-20 bg-[#73e28a] rounded-full flex flex-col items-center justify-center text-black font-bold text-xs hover:scale-105 transition-transform shadow-lg shadow-[#73e28a]/20">
                  <ArrowUpRight className="w-6 h-6 mb-1" />
                  Subscribe
               </button>
            </div>
         </div>
      </div>

    </div>
  );
}