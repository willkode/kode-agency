import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Check, Plus, ArrowUpRight, Quote, Twitter, Linkedin, Facebook, Dribbble } from 'lucide-react';
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';

export default function HomePage() {
  const [activeService, setActiveService] = useState(0);

  const services = [
    { title: "Strategy & Planning", description: "We map out your product's journey from concept to launch.", icon: "01" },
    { title: "Design & Prototype", description: "Visualizing your idea with pixel-perfect designs and prototypes.", icon: "02" },
    { title: "Development", description: "Building scalable, robust applications using modern tech stacks.", icon: "03" },
  ];

  return (
    <div className="flex flex-col bg-slate-950 text-white overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-10 md:pt-32 md:pb-20 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-20 right-10 w-32 h-32 border-2 border-dashed border-slate-700 rounded-full opacity-20 animate-spin-slow" />
        <div className="absolute top-40 left-10 w-24 h-24 bg-[#73e28a]/10 rounded-full blur-xl" />
        <div className="absolute top-10 right-[20%] w-[400px] h-[400px] bg-gradient-to-b from-slate-800/20 to-transparent rounded-full -z-10" />

        <div className="container mx-auto px-4 text-center">
          <div className="relative inline-block mb-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight">
              Creative <br /> 
              Development
            </h1>
             {/* Small image badge next to "Creative" - simulating the screenshot */}
            <div className="hidden md:block absolute top-2 right-[-60px] w-16 h-10 rounded-full border-2 border-[#73e28a] overflow-hidden">
               <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Team" />
            </div>
             {/* Green Ring Icon */}
            <div className="absolute top-0 right-0 md:right-[-100px] text-[#73e28a] animate-spin-slow">
               <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5"/>
               </svg>
            </div>
          </div>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
            We build serious apps fast on Base44, Lovable, Replit, and custom stacks. Accelerate your roadmap with our AI-driven development.
          </p>

          {/* Hero Image */}
          <div className="relative max-w-6xl mx-auto mt-8 group">
             <div className="absolute inset-0 bg-[#73e28a]/20 rounded-2xl transform translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform"></div>
             <div className="relative rounded-2xl overflow-hidden border border-slate-800">
                <img 
                   src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" 
                   alt="Team Meeting" 
                   className="w-full h-[400px] md:h-[600px] object-cover filter brightness-75 hover:brightness-100 transition-all duration-500"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                   <button className="w-20 h-20 bg-[#73e28a] rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform shadow-lg shadow-[#73e28a]/20">
                      <Play fill="black" className="ml-1" />
                   </button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Logo Strip */}
      <div className="bg-slate-950 border-y border-slate-900 py-10">
         <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               {['Base44', 'Lovable', 'Replit', 'OpenAI', 'Vercel', 'Supabase'].map((brand) => (
                  <span key={brand} className="text-2xl font-bold text-slate-400 hover:text-[#73e28a] cursor-default">{brand}</span>
               ))}
            </div>
         </div>
      </div>

      {/* About Section */}
      <Section className="py-24 relative">
         {/* Decoration */}
         <div className="absolute left-0 top-1/4 w-64 h-64 border border-slate-800 rounded-full opacity-20 -translate-x-1/2"></div>
         
         <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
               <div className="relative z-10">
                  <img 
                     src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop" 
                     className="rounded-xl w-4/5 shadow-2xl border border-slate-800"
                     alt="Office" 
                  />
               </div>
               <div className="absolute bottom-[-40px] right-0 z-20 w-3/5">
                  <img 
                     src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop" 
                     className="rounded-xl shadow-2xl border-4 border-slate-950" 
                     alt="Meeting"
                  />
                  <div className="absolute -top-10 -right-10 animate-spin-slow">
                     <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                        <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90C27.9 90 10 72.1 10 50S27.9 10 50 10s40 17.9 40 40-17.9 40-40 40z" fill="#84cc16" fillOpacity="0.2"/>
                        <circle cx="50" cy="50" r="3" fill="#a3e635"/>
                     </svg>
                  </div>
               </div>
            </div>
            
            <div>
               <div className="inline-block text-[#73e28a] font-semibold tracking-wider text-sm mb-2 uppercase">About Us</div>
               <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  We Are More <br />
                  <span className="text-[#73e28a]">Kode</span> Agency
               </h2>
               <p className="text-slate-400 mb-8 leading-relaxed">
                  We combine the speed of modern low-code platforms with the power of custom engineering. 
                  Whether you need a rapid MVP or a scalable enterprise solution, our team delivers pixel-perfect results 
                  faster than traditional agencies.
               </p>
               
               <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                     <h4 className="text-white font-bold text-lg mb-2">Fast Delivery</h4>
                     <p className="text-slate-500 text-sm">Launch in weeks, not months.</p>
                  </div>
                  <div>
                     <h4 className="text-white font-bold text-lg mb-2">Modern Stack</h4>
                     <p className="text-slate-500 text-sm">Base44, React, AI-Native.</p>
                  </div>
               </div>

               <Link to={createPageUrl('About')}>
                  <Button className="bg-white hover:bg-slate-200 text-black rounded-full px-8 h-12">
                     More About Us <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
               </Link>
            </div>
         </div>
      </Section>

      {/* Services Section */}
      <Section className="bg-slate-900/30 py-24 relative">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <div className="text-[#73e28a] text-sm font-bold uppercase tracking-wider mb-2">What We Do</div>
               <h2 className="text-3xl md:text-5xl font-bold">We Offer The Best <br />AI Solutions & Services</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
               <div className="space-y-6">
                  {services.map((service, idx) => (
                     <div 
                        key={idx} 
                        className={`p-6 rounded-xl cursor-pointer transition-all duration-300 border ${
                           activeService === idx 
                           ? 'bg-slate-900 border-[#73e28a]/50' 
                           : 'bg-transparent border-transparent hover:bg-slate-900'
                        }`}
                        onClick={() => setActiveService(idx)}
                     >
                        <div className="flex items-start gap-4">
                           <div className={`text-2xl font-bold ${activeService === idx ? 'text-[#73e28a]' : 'text-slate-600'}`}>
                              {service.icon}
                           </div>
                           <div>
                              <h3 className={`text-xl font-bold mb-2 ${activeService === idx ? 'text-white' : 'text-slate-300'}`}>
                                 {service.title}
                              </h3>
                              <p className={`text-sm leading-relaxed ${activeService === idx ? 'text-slate-400' : 'text-slate-600'}`}>
                                 {service.description}
                              </p>
                           </div>
                           <div className="ml-auto mt-1">
                              {activeService === idx ? (
                                 <div className="w-6 h-6 rounded-full bg-[#73e28a] flex items-center justify-center">
                                    <Check className="w-4 h-4 text-black" />
                                 </div>
                              ) : (
                                 <Plus className="text-slate-600" />
                              )}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden group">
                  <img 
                     src={[
                        "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop"
                     ][activeService]} 
                     alt="Service" 
                     className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                  />
                  {/* Floating Badge */}
                  <div className="absolute bottom-8 right-8 bg-[#73e28a] p-6 rounded-full animate-spin-slow">
                     <ArrowUpRight className="w-8 h-8 text-black" />
                  </div>
               </div>
            </div>

            {/* Icons Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-10 border-t border-slate-800">
               {[
                  { title: "Research", icon: "🔍" },
                  { title: "Prototype", icon: "✏️" },
                  { title: "Design", icon: "🎨" },
                  { title: "Build", icon: "🚀" },
               ].map((item, i) => (
                  <div key={i} className="text-center group">
                     <div className="text-4xl mb-4 bg-slate-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto group-hover:bg-[#73e28a] transition-colors">
                        {item.icon}
                     </div>
                     <h4 className="font-bold text-white">{item.title}</h4>
                     <p className="text-xs text-slate-500 mt-2">Step {i + 1} of our process</p>
                  </div>
               ))}
            </div>
         </div>
      </Section>

      {/* Portfolio Section */}
      <Section className="py-24">
         <div className="text-center mb-16">
            <div className="text-[#73e28a] text-sm font-bold uppercase tracking-wider mb-2">Our Portfolio</div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Let's Look Our <br/> Recent Project House</h2>
            
            <div className="flex justify-center gap-4 mt-8">
               {['All', 'Web Design', 'Mobile App', 'Branding'].map(cat => (
                  <button key={cat} className="px-6 py-2 rounded-full border border-slate-800 hover:bg-[#73e28a] hover:text-black hover:border-[#73e28a] transition-all text-sm font-medium text-slate-300">
                     {cat}
                  </button>
               ))}
            </div>
         </div>

         <div className="grid md:grid-cols-2 gap-8 container mx-auto px-4">
            {[
               { title: "Fintech Dashboard", cat: "Web Design", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", large: false },
               { title: "Travel App", cat: "Mobile App", img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop", large: false },
               { title: "SaaS Platform", cat: "Development", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop", large: true },
            ].map((item, i) => (
               <div key={i} className={`group relative rounded-2xl overflow-hidden ${item.large ? 'md:col-span-2 h-[500px]' : 'h-[400px]'}`}>
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                     <span className="text-[#73e28a] text-sm font-bold mb-2">{item.cat}</span>
                     <h3 className="text-3xl font-bold text-white">{item.title}</h3>
                     <div className="mt-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <Button variant="link" className="text-white p-0 h-auto hover:text-[#73e28a]">View Case Study <ArrowRight className="ml-2 w-4 h-4" /></Button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
         
         <div className="flex justify-center mt-12 gap-2">
            <div className="w-3 h-3 rounded-full bg-[#73e28a]"></div>
            <div className="w-3 h-3 rounded-full bg-slate-800"></div>
            <div className="w-3 h-3 rounded-full bg-slate-800"></div>
         </div>
      </Section>

      {/* Team Section */}
      <Section className="bg-slate-900/20 py-24">
         <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12">
               <div className="md:w-1/4">
                  <div className="text-[#73e28a] text-sm font-bold uppercase tracking-wider mb-2">Our Team</div>
                  <h2 className="text-4xl font-bold mb-6">Meet Our <br/> Experts</h2>
                  <p className="text-slate-400 mb-8">We are a group of passionate designers and developers.</p>
                  <Button variant="outline" className="border-slate-700 text-white hover:bg-[#73e28a] hover:text-black hover:border-[#73e28a]">View All Members</Button>
               </div>
               
               <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                     { name: "Alex Tech", role: "Lead Dev", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop" },
                     { name: "Sarah Des", role: "UI/UX", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop" },
                     { name: "Mike Prod", role: "Manager", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop" },
                  ].map((member, i) => (
                     <div key={i} className="group relative overflow-hidden rounded-xl">
                        <img src={member.img} alt={member.name} className="w-full aspect-[3/4] object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                           <h4 className="text-white font-bold">{member.name}</h4>
                           <p className="text-[#73e28a] text-xs">{member.role}</p>
                           <div className="flex gap-3 mt-3">
                              <Twitter className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                              <Linkedin className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                              <Dribbble className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </Section>

      {/* Testimonials Section */}
      <Section className="py-24">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <div className="text-[#73e28a] text-sm font-bold uppercase tracking-wider mb-2">Testimonials</div>
               <h2 className="text-3xl md:text-5xl font-bold">Best Of Our Client's <br/> Latest Testimonials</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
               {[
                  { name: "James Bond", role: "CEO, Tech", quote: "The team understood our vision perfectly. The final product exceeded expectations.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" },
                  { name: "Alina Stark", role: "Founder, Art", quote: "Fast, reliable, and creative. Base44 allowed us to scale without worry.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop" }
               ].map((t, i) => (
                  <Card key={i} className="bg-slate-900 border-slate-800 p-8 relative group hover:border-[#73e28a]/30 transition-colors">
                     <div className="absolute top-8 right-8 text-slate-700 group-hover:text-[#73e28a] transition-colors">
                        <Quote className="w-10 h-10 fill-current opacity-20" />
                     </div>
                     <p className="text-slate-300 mb-8 italic text-lg relative z-10">"{t.quote}"</p>
                     <div className="flex items-center gap-4">
                        <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-700 group-hover:border-[#73e28a] transition-colors" />
                        <div>
                           <h4 className="text-white font-bold">{t.name}</h4>
                           <p className="text-[#73e28a] text-xs">{t.role}</p>
                        </div>
                     </div>
                  </Card>
               ))}
            </div>
         </div>
      </Section>

      {/* CTA / Video Section */}
      <Section className="py-20 bg-slate-900/50 border-y border-slate-900">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
               <div className="grid grid-cols-2 gap-4">
                  <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" className="rounded-xl w-full h-64 object-cover" alt="Work" />
                  <div className="relative">
                     <img src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?q=80&w=1974&auto=format&fit=crop" className="rounded-xl w-full h-64 object-cover" alt="Work" />
                     <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                         <div className="w-12 h-12 bg-[#73e28a] rounded-full flex items-center justify-center animate-pulse">
                           <Play fill="black" className="w-4 h-4 text-black ml-1" />
                         </div>
                     </div>
                  </div>
               </div>
               <div>
                  <div className="text-[#73e28a] text-sm font-bold uppercase tracking-wider mb-2">Get Started</div>
                  <h2 className="text-4xl font-bold mb-6">We Create Website <br/> Create And Solution</h2>
                  <p className="text-slate-400 mb-8">
                     Every project is an opportunity to create something new and better. Let's build your future together.
                  </p>
                  <div className="flex gap-8 border-t border-slate-800 pt-8">
                     <div>
                        <h3 className="text-3xl font-bold text-white">150+</h3>
                        <p className="text-slate-500 text-sm">Projects Done</p>
                     </div>
                     <div>
                        <h3 className="text-3xl font-bold text-white">98%</h3>
                        <p className="text-slate-500 text-sm">Client Satisfaction</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </Section>

      {/* Blog Section */}
      <Section className="py-24">
         <div className="text-center mb-16">
            <div className="text-[#73e28a] text-sm font-bold uppercase tracking-wider mb-2">Our Blog</div>
            <h2 className="text-3xl md:text-5xl font-bold">We Provide Advanced <br/> News And Updates</h2>
         </div>

         <div className="grid md:grid-cols-3 gap-8 container mx-auto px-4">
            {[
               { title: "The Future of AI Development", date: "Oct 24, 2023", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop" },
               { title: "Why Low-Code is Scaling", date: "Nov 02, 2023", img: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop" },
               { title: "Design Systems for Teams", date: "Nov 15, 2023", img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop" }
            ].map((post, i) => (
               <div key={i} className="group cursor-pointer">
                  <div className="overflow-hidden rounded-xl mb-4 relative">
                     <img src={post.img} alt={post.title} className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500" />
                     <div className="absolute top-4 left-4 bg-[#73e28a] text-black text-xs font-bold px-3 py-1 rounded">
                        {post.date}
                     </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#73e28a] transition-colors">{post.title}</h3>
                  <div className="flex items-center text-slate-500 text-sm group-hover:text-white transition-colors">
                     Read More <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
               </div>
            ))}
         </div>
      </Section>

      {/* Newsletter / Footer CTA */}
      <div className="container mx-auto px-4 mb-20">
         <div className="bg-slate-900 rounded-3xl p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
            {/* Deco */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#73e28a]/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
               <h2 className="text-3xl font-bold text-white mb-2">Subscribe Now</h2>
               <p className="text-slate-400">Get the latest updates and news directly to your inbox.</p>
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