import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import { Play, Check, ArrowRight, Users, Layers, Rocket, Target, ArrowUpRight, Quote, Twitter, Linkedin, Dribbble } from 'lucide-react';

export default function AboutPage() {
  const [activeService, setActiveService] = useState(1);

  return (
    <div className="flex flex-col bg-slate-950 text-white overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 right-10 w-32 h-32 border-2 border-dashed border-slate-700 rounded-full opacity-20 animate-spin-slow" />
        <div className="absolute top-10 right-[10%] text-[#73e28a] animate-spin-slow">
           <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5"/>
           </svg>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
             <div>
                <h1 className="text-5xl md:text-7xl font-bold mb-2">About</h1>
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                   <span className="text-[#73e28a]">Home</span> / <span>About</span>
                </div>
             </div>
             <div className="hidden md:block w-32 h-32 bg-pattern-dots opacity-20"></div>
          </div>

          {/* Hero Image */}
          <div className="relative rounded-2xl overflow-hidden group">
             <img 
               src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" 
               className="w-full h-[400px] md:h-[500px] object-cover filter brightness-75 hover:brightness-100 transition-all duration-500" 
               alt="About Hero" 
             />
             <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-[#73e28a] rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform shadow-lg shadow-[#73e28a]/20">
                   <Play fill="black" className="ml-1" />
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Logo Strip */}
      <div className="bg-slate-950 border-b border-slate-900 py-10">
         <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               {['Burner', 'Creative', 'Base44', 'Smart', 'Canva', 'Count.it'].map((brand) => (
                  <span key={brand} className="text-xl md:text-2xl font-bold text-slate-400 hover:text-[#73e28a] cursor-default">{brand}</span>
               ))}
            </div>
         </div>
      </div>

      {/* Features Grid */}
      <Section className="py-20">
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
               { icon: <Users />, title: "Secret Project", desc: "We build stealth mode MVPs." },
               { icon: <Layers />, title: "Featured App", desc: "Award-winning mobile apps." },
               { icon: <Rocket />, title: "Marketing", desc: "Growth strategies that work." },
               { icon: <Target />, title: "Web Design", desc: "Pixel perfect interfaces." },
            ].map((item, i) => (
               <Card key={i} className="bg-slate-900 border-slate-800 text-center p-8 hover:border-[#73e28a]/50 transition-colors group">
                  <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400 group-hover:bg-[#73e28a] group-hover:text-black transition-colors">
                     {item.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
               </Card>
            ))}
         </div>
      </Section>

      {/* "We Do Work Smart" Section */}
      <Section className="py-10 relative">
         {/* Background Wave */}
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-radial from-[#73e28a]/5 to-transparent opacity-50 pointer-events-none" />
         
         <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
               <div className="text-[#73e28a] text-sm font-bold uppercase tracking-wider mb-2">Who We Are</div>
               <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                  We Do Work <br />
                  Kode Digital <br />
                  agency
               </h2>

               <div className="relative h-[400px]">
                  {/* Circular Badge */}
                  <div className="absolute top-0 left-0 z-20 w-24 h-24 bg-slate-900 border border-slate-800 rounded-full flex flex-col items-center justify-center text-center p-2 shadow-xl">
                     <span className="text-[#73e28a] font-bold text-xl">Since</span>
                     <span className="text-white text-xs">2023</span>
                  </div>

                  {/* Image Composition */}
                  <div className="absolute top-10 left-10 w-48 h-48 rounded-full overflow-hidden border-4 border-slate-950 z-10">
                     <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Team 1" />
                  </div>
                  <div className="absolute bottom-0 left-20 w-56 h-56 rounded-full overflow-hidden border-4 border-slate-950 z-0">
                     <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Team 2" />
                  </div>
                  <div className="absolute top-20 right-10 w-40 h-40 rounded-full overflow-hidden border-4 border-slate-950 z-10">
                     <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Team 3" />
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <p className="text-slate-400 leading-relaxed">
                  The best agencies are not just vendors, they are partners. We work alongside you to build products that matter. 
                  We combine strategic thinking with expert engineering to deliver software that scales.
               </p>
               <p className="text-slate-400 leading-relaxed">
                  From simple MVPs to complex enterprise systems, our team handles the entire lifecycle of product development.
               </p>
               
               <div className="grid grid-cols-2 gap-4">
                  {['UI/UX Design', 'Photography', 'Web Development', 'Video Editing', 'Mobile Apps', 'Digital Marketing'].map(tag => (
                     <div key={tag} className="bg-slate-900 border border-slate-800 rounded px-4 py-2 text-sm text-slate-300 hover:border-[#73e28a] transition-colors text-center">
                        {tag}
                     </div>
                  ))}
               </div>

               <div className="pt-4">
                  <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black rounded-full px-8 h-12">
                     More About Us <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
               </div>
            </div>
         </div>
      </Section>

      {/* Services Accordion Section */}
      <Section className="bg-slate-900/30 py-24">
         <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
               <div className="text-[#73e28a] text-sm font-bold uppercase tracking-wider mb-2">What We Do</div>
               <h2 className="text-4xl font-bold mb-8">Make your Service.</h2>
               <p className="text-slate-400 mb-8">
                  We provide a comprehensive suite of services to help you build, launch, and grow your digital product.
               </p>

               <div className="space-y-4">
                  {[
                     { title: "Creative Solution", desc: "Branding, UI/UX Design, and interactive prototypes.", icon: <Layers /> },
                     { title: "Digital Design", desc: "Websites, mobile apps, and digital products.", icon: <Target /> },
                     { title: "Marketing", desc: "SEO, Content Marketing, and Growth hacking.", icon: <Rocket /> },
                  ].map((service, idx) => (
                     <div 
                        key={idx} 
                        className={`p-6 rounded-xl cursor-pointer border transition-all duration-300 ${
                           activeService === idx 
                           ? 'bg-slate-900 border-[#73e28a]' 
                           : 'border-slate-800 hover:bg-slate-900'
                        }`}
                        onClick={() => setActiveService(idx)}
                     >
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className={`text-xl ${activeService === idx ? 'text-[#73e28a]' : 'text-slate-500'}`}>
                                 {service.icon}
                              </div>
                              <h3 className="font-bold text-white text-lg">{service.title}</h3>
                           </div>
                           <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${activeService === idx ? 'bg-[#73e28a] border-[#73e28a] text-black' : 'border-slate-600 text-slate-600'}`}>
                              {activeService === idx ? <Check className="w-3 h-3" /> : <span className="text-xs">+</span>}
                           </div>
                        </div>
                        {activeService === idx && (
                           <p className="text-slate-400 mt-4 text-sm pl-10">
                              {service.desc}
                           </p>
                        )}
                     </div>
                  ))}
               </div>
            </div>

            <div className="relative">
               <img 
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop" 
                  alt="Service Team" 
                  className="rounded-2xl w-full h-[500px] object-cover"
               />
               <div className="absolute top-10 right-[-20px] bg-[#73e28a] p-4 rounded-full animate-bounce-slow shadow-lg">
                  <ArrowUpRight className="w-8 h-8 text-black" />
               </div>
            </div>
         </div>
      </Section>

      {/* Pricing Section */}
      <Section className="py-24">
         <div className="text-center mb-16">
            <div className="text-[#73e28a] text-sm font-bold uppercase tracking-wider mb-2">Pricing Plans</div>
            <h2 className="text-3xl md:text-5xl font-bold">All Professional Let's Look Our <br/> Recent Pricing Table</h2>
         </div>

         <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {/* Basic */}
            <Card className="bg-slate-900 border-slate-800 p-8 relative group hover:border-[#73e28a]/30 transition-colors">
               <h3 className="text-2xl font-bold text-white mb-2">$19.99</h3>
               <p className="text-white font-bold mb-6">Basic Plan</p>
               <ul className="space-y-4 mb-8 text-sm text-slate-400">
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[#73e28a]" /> 1 Website</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[#73e28a]" /> 5 GB Storage</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[#73e28a]" /> Basic Support</li>
                  <li className="flex items-center gap-3 opacity-50"><Check className="w-4 h-4" /> SEO Optimization</li>
                  <li className="flex items-center gap-3 opacity-50"><Check className="w-4 h-4" /> Advanced Analytics</li>
               </ul>
               <Button variant="outline" className="w-full border-slate-700 text-white hover:bg-[#73e28a] hover:text-black hover:border-[#73e28a]">Purchase Now <ArrowRight className="ml-2 w-4 h-4" /></Button>
            </Card>

            {/* Standard - Highlighted */}
            <Card className="bg-slate-900 border-[#73e28a] p-8 relative transform md:-translate-y-4 shadow-2xl shadow-[#73e28a]/10">
               <div className="absolute top-0 right-0 bg-[#73e28a] text-black text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
               <h3 className="text-2xl font-bold text-white mb-2">$29.99</h3>
               <p className="text-white font-bold mb-6">Standard Plan</p>
               <ul className="space-y-4 mb-8 text-sm text-slate-300">
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[#73e28a]" /> 5 Websites</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[#73e28a]" /> 20 GB Storage</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[#73e28a]" /> Priority Support</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[#73e28a]" /> SEO Optimization</li>
                  <li className="flex items-center gap-3 opacity-50"><Check className="w-4 h-4" /> Advanced Analytics</li>
               </ul>
               <Button className="w-full bg-[#73e28a] text-black hover:bg-[#5dbb72] font-bold">Purchase Now <ArrowRight className="ml-2 w-4 h-4" /></Button>
            </Card>

            {/* Premium */}
            <Card className="bg-slate-900 border-slate-800 p-8 relative group hover:border-[#73e28a]/30 transition-colors">
               <h3 className="text-2xl font-bold text-white mb-2">$59.99</h3>
               <p className="text-white font-bold mb-6">Premium Plan</p>
               <ul className="space-y-4 mb-8 text-sm text-slate-400">
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[#73e28a]" /> Unlimited Websites</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[#73e28a]" /> 100 GB Storage</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[#73e28a]" /> 24/7 Support</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[#73e28a]" /> SEO Optimization</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[#73e28a]" /> Advanced Analytics</li>
               </ul>
               <Button variant="outline" className="w-full border-slate-700 text-white hover:bg-[#73e28a] hover:text-black hover:border-[#73e28a]">Purchase Now <ArrowRight className="ml-2 w-4 h-4" /></Button>
            </Card>
         </div>
      </Section>

      {/* Team Section */}
      <Section className="py-24 relative">
         <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12">
               <div>
                  <div className="text-[#73e28a] text-sm font-bold uppercase tracking-wider mb-2">Our Team</div>
                  <h2 className="text-4xl font-bold">Our Team <br/> Member</h2>
               </div>
               <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-[#73e28a] hover:border-[#73e28a] hover:text-black transition-colors">
                     <ArrowRight className="rotate-180 w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-[#73e28a] hover:border-[#73e28a] hover:text-black transition-colors">
                     <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
               {[
                  { name: "Gary James", role: "Founder", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop" },
                  { name: "Mike Ross", role: "Developer", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop" },
                  { name: "Celia Olive", role: "Designer", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop" },
                  { name: "John Doe", role: "Manager", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" },
               ].map((member, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-xl">
                     <img src={member.img} alt={member.name} className="w-full h-[350px] object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 pt-20">
                        <h4 className="text-white font-bold text-lg">{member.name}</h4>
                        <div className="flex justify-between items-center">
                           <p className="text-[#73e28a] text-sm">{member.role}</p>
                           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                              <Twitter className="w-4 h-4 text-white cursor-pointer" />
                              <Linkedin className="w-4 h-4 text-white cursor-pointer" />
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         
         {/* Background Text Decoration */}
         <div className="absolute bottom-0 right-0 text-[100px] font-bold text-slate-800/20 pointer-events-none select-none leading-none">
            UX/UI - Web Design
         </div>
      </Section>

      {/* Testimonials Section */}
      <Section className="bg-slate-900/30 py-24">
         <div className="text-center mb-16">
            <div className="text-[#73e28a] text-sm font-bold uppercase tracking-wider mb-2">Testimonials</div>
            <h2 className="text-3xl md:text-5xl font-bold">Best Of Our Lat's Look Clients <br/> Latest Testimonials</h2>
         </div>

         <div className="grid md:grid-cols-3 gap-8 container mx-auto px-4">
            {[1, 2, 3].map((_, i) => (
               <Card key={i} className="bg-slate-900 border-slate-800 p-8 relative group hover:border-[#73e28a]/30 transition-colors">
                  <div className="absolute top-6 right-6 text-[#73e28a]">
                     <Quote className="w-8 h-8 fill-current opacity-100" />
                  </div>
                  <p className="text-slate-400 mb-8 mt-4 text-sm leading-relaxed">
                     "The team at Kode Agency is simply amazing. They delivered our project on time and with exceptional quality. Highly recommended!"
                  </p>
                  <div className="flex items-center gap-4">
                     <img src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000}?q=80&w=100&auto=format&fit=crop`} className="w-12 h-12 rounded-full object-cover" alt="User" />
                     <div>
                        <h4 className="text-white font-bold text-sm">Happy Client</h4>
                        <p className="text-slate-500 text-xs">CEO, Company</p>
                     </div>
                  </div>
               </Card>
            ))}
         </div>
      </Section>

      {/* Newsletter Section */}
      <div className="container mx-auto px-4 mb-20 mt-20">
         <div className="bg-slate-900 rounded-3xl p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#73e28a]/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
               <div className="text-[#73e28a] text-xs font-bold uppercase tracking-wider mb-2">Get News</div>
               <h2 className="text-3xl font-bold text-white mb-2">Subscribe Now.</h2>
               <p className="text-slate-400 text-sm max-w-md">We will send you the latest news and updates. We don't spam.</p>
            </div>

            <div className="relative z-10 w-full md:w-auto flex gap-2">
               <input 
                  type="email" 
                  placeholder="Enter email address" 
                  className="bg-slate-950 border border-slate-800 rounded-full px-6 py-4 text-white w-full md:w-80 focus:outline-none focus:border-[#73e28a]"
               />
               <button className="w-14 h-14 bg-[#73e28a] rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform">
                  <ArrowUpRight />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}