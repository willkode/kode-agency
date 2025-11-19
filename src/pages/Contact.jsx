import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, ArrowUpRight, CheckCircle, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
     name: '',
     email: '',
     phone: '',
     subject: '',
     message: ''
  });

  const submitMutation = useMutation({
    mutationFn: (data) => base44.entities.ContactSubmission.create(data),
    onSuccess: () => {
       setIsSubmitted(true);
    }
  });

  const handleChange = (field, value) => {
     setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
     e.preventDefault();
     submitMutation.mutate(formData);
  };

  if (isSubmitted) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 pt-20">
           <Card className="text-center p-12 max-w-lg mx-auto bg-slate-900 border-slate-800">
              <div className="w-16 h-16 bg-[#73e28a]/20 text-[#73e28a] rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Message Sent!</h2>
              <p className="text-slate-400 mb-8">
                 Thanks for reaching out. We'll get back to you shortly.
              </p>
              <Button onClick={() => setIsSubmitted(false)} className="bg-[#73e28a] text-black hover:bg-[#5dbb72]">
                 Send another message
              </Button>
           </Card>
        </div>
     );
  }

  return (
    <div className="flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="container mx-auto px-4 relative z-10">
           <div className="flex justify-between items-start">
              <div>
                 <h1 className="text-6xl font-bold mb-6">Contact</h1>
                 <div className="inline-flex items-center gap-2 px-6 py-2 border border-[#73e28a]/30 rounded text-sm font-medium bg-[#73e28a]/5">
                    <span className="text-[#73e28a]">Home</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-white">Contact</span>
                 </div>
              </div>
              
              {/* Abstract Graphics */}
              <div className="hidden md:block relative">
                 <div className="absolute -top-10 right-20 w-16 h-16 rounded-full overflow-hidden border-2 border-slate-800">
                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=150&auto=format&fit=crop" className="w-full h-full object-cover" alt="Team" />
                 </div>
                 <div className="relative">
                    <div className="text-[#73e28a] animate-spin-slow mb-4 ml-20">
                       <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5"/>
                          <path d="M10 50a40 40 0 0 0 80 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-50"/>
                       </svg>
                    </div>
                    {/* Diagonal Lines */}
                    <div className="flex gap-1 justify-end">
                       {[...Array(10)].map((_, i) => (
                          <div key={i} className="w-0.5 h-20 bg-gradient-to-b from-[#73e28a] to-transparent opacity-50 transform -skew-x-12"></div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-slate-800/20 rounded-full blur-3xl"></div>
      </section>

      {/* Map Section */}
      <div className="w-full h-[400px] bg-slate-900 relative grayscale contrast-125 brightness-75 border-y border-slate-800">
         <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-50" 
            alt="Dark Map" 
         />
         {/* Map Markers Overlay */}
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-[#73e28a] rounded-full animate-ping absolute"></div>
            <div className="w-4 h-4 bg-[#73e28a] rounded-full relative border-4 border-slate-900"></div>
         </div>
      </div>

      {/* Contact Info Cards */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
               { id: "01", icon: Phone, text: "+55 (9900) 666 22", label: "Call Us" },
               { id: "02", icon: Mail, text: "Info@Exand.Com", label: "Email Us" },
               { id: "03", icon: MapPin, text: "Mirpur 12, Dhaka, BD.", label: "Location" },
               { id: "04", icon: Clock, text: "Office Open 10AM - 17PM", label: "Working Hours" },
            ].map((item) => (
               <div key={item.id} className="bg-slate-950 border border-slate-800 p-8 rounded-xl text-center hover:border-[#73e28a] transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                     <span className="text-xs font-bold text-slate-600 group-hover:text-[#73e28a] transition-colors border border-slate-800 rounded px-2 py-1">{item.id}</span>
                  </div>
                  <div className="w-12 h-12 mx-auto mb-4 text-[#73e28a] group-hover:scale-110 transition-transform">
                     <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-white font-bold text-lg">{item.text}</h3>
               </div>
            ))}
         </div>
      </div>

      {/* Main Form Section */}
      <Section className="py-24">
         <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Your Name*</Label>
                     <Input 
                        required
                        placeholder="Enter Your Name"
                        className="bg-slate-900/50 border-slate-800 text-white h-12 focus:border-[#73e28a] rounded-lg placeholder:text-slate-600"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                     />
                  </div>
                  <div className="space-y-3">
                     <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Your Email*</Label>
                     <Input 
                        required
                        type="email"
                        placeholder="Info@Exand.com"
                        className="bg-slate-900/50 border-slate-800 text-white h-12 focus:border-[#73e28a] rounded-lg placeholder:text-slate-600"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                     />
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Phone</Label>
                     <Input 
                        placeholder="+00 000 000 00"
                        className="bg-slate-900/50 border-slate-800 text-white h-12 focus:border-[#73e28a] rounded-lg placeholder:text-slate-600"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                     />
                  </div>
                  <div className="space-y-3">
                     <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Subject</Label>
                     <Input 
                        placeholder="Enter your subject"
                        className="bg-slate-900/50 border-slate-800 text-white h-12 focus:border-[#73e28a] rounded-lg placeholder:text-slate-600"
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                     />
                  </div>
               </div>

               <div className="space-y-3">
                  <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Message</Label>
                  <Textarea 
                     placeholder="Write your message"
                     className="bg-slate-900/50 border-slate-800 text-white min-h-[150px] focus:border-[#73e28a] rounded-lg placeholder:text-slate-600 resize-none"
                     value={formData.message}
                     onChange={(e) => handleChange('message', e.target.value)}
                  />
               </div>

               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4">
                  <p className="text-slate-500 text-xs max-w-xs">
                     * Call us 24/7 or fill out the form below to receive a free consultation.
                  </p>
                  <Button 
                     type="submit"
                     disabled={submitMutation.isPending}
                     className="bg-[#73e28a] text-black hover:bg-[#5dbb72] font-bold h-12 px-8 rounded-lg"
                  >
                     {submitMutation.isPending ? 'Sending...' : 'Send Request'} 
                     <ArrowUpRight className="ml-2 w-5 h-5" />
                  </Button>
               </div>
            </form>

            {/* Right Side Image */}
            <div className="relative h-full min-h-[500px] rounded-2xl overflow-hidden bg-slate-900 group">
               <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop" 
                  alt="Contact Support" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
               />
               <div className="absolute bottom-10 left-10 right-10">
                  <h2 className="text-4xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                     Have Any Query Feel <br/> Free Contact
                  </h2>
                  <div className="inline-flex items-center gap-3 bg-[#73e28a] px-6 py-3 rounded-full text-black font-bold shadow-lg cursor-pointer hover:scale-105 transition-transform">
                     <Phone className="w-5 h-5" />
                     <span>(+00)9-44578-668</span>
                  </div>
               </div>
            </div>
         </div>
      </Section>

      {/* Newsletter Section */}
      <div className="container mx-auto px-4 mb-20 border-t border-slate-900 pt-16">
         <div className="flex flex-col md:flex-row items-center justify-between gap-12">
             <div className="max-w-md">
                <div className="flex items-center gap-2 mb-4 text-[#73e28a] font-bold text-sm uppercase tracking-wider">
                   <CheckCircle className="w-4 h-4" /> Get In Touch
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">Subscribe Now.</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                   Fusce eget accumsan urna. Id rhoncus tortor. Integer arc leo non orci fringilla suscipit.
                </p>
             </div>
             
             <div className="flex-grow w-full max-w-xl flex items-center gap-8">
                <div className="w-full space-y-2">
                   <Label className="text-slate-400 text-xs uppercase">Your Mail:</Label>
                   <Input 
                      placeholder="Info@Exand.com" 
                      className="bg-transparent border-b border-slate-800 rounded-none px-0 h-12 focus:border-[#73e28a] text-white placeholder:text-slate-600 border-t-0 border-x-0"
                   />
                </div>
                <button className="w-24 h-24 flex-shrink-0 bg-[#73e28a] rounded-full flex flex-col items-center justify-center text-black font-bold text-xs hover:scale-105 transition-transform shadow-lg shadow-[#73e28a]/20">
                   <ArrowUpRight className="w-6 h-6 mb-1" />
                   <span>Subscribe</span>
                </button>
             </div>
         </div>
      </div>
    </div>
  );
}