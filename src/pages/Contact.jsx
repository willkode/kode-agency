import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import PageHero from '@/components/ui-custom/PageHero';
import SectionLabel from '@/components/ui-custom/SectionLabel';
import GridBackground from '@/components/ui-custom/GridBackground';
import FloatingPixels from '@/components/ui-custom/FloatingPixels';
import GlowingOrb from '@/components/ui-custom/GlowingOrb';
import SEO, { createLocalBusinessSchema, createBreadcrumbSchema } from '@/components/SEO';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, ArrowUpRight, CheckCircle } from 'lucide-react';

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
    mutationFn: async (data) => {
      // Save to ContactSubmission
      await base44.entities.ContactSubmission.create(data);
      // Also create a Lead in CRM
      await base44.entities.Lead.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        description: data.message,
        source: 'Contact Form',
        status: 'New'
      });
      // Send lead notification email
      base44.functions.invoke('notifyNewLead', {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        payment_status: 'N/A',
        service: 'Contact Form',
        amount: 0
      }).catch(err => console.error('Lead notification failed:', err));
      // Send notification email
      await base44.integrations.Core.SendEmail({
        to: 'will@kodeagency.us',
        subject: `New Contact Form Submission from ${data.name}`,
        body: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Subject: ${data.subject || 'Not provided'}

Message:
${data.message || 'No message provided'}
        `
      });
    },
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

  const contactInfo = [
    { id: "01", icon: Mail, text: "hello@kodeagency.com", label: "Email Us" },
    { id: "02", icon: MapPin, text: "Remote-First Agency", label: "Location" },
    { id: "03", icon: Clock, text: "Mon - Fri, 9AM - 6PM", label: "Working Hours" },
  ];

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      createLocalBusinessSchema(),
      createBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Contact", url: "/Contact" }
      ])
    ]
  };

  return (
    <div className="flex flex-col bg-slate-950 text-white overflow-hidden">
      <SEO 
        title="Contact Us - Start Your Project Today"
        description="Ready to build something amazing? Contact Kode Agency for web development, AI systems, or digital marketing. We typically respond within 24 hours."
        keywords={["contact Kode Agency", "hire web developer", "project inquiry", "free consultation", "web development quote"]}
        url="/Contact"
        jsonLd={jsonLd}
      />
      {/* Hero */}
      <PageHero 
        title="Contact" 
        backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop"
      />

      {/* Map Section */}
      <div className="w-full h-[400px] bg-slate-900 relative border-y border-slate-800">
         <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30 grayscale" 
            alt="Map" 
         />
         {/* Map Markers Overlay */}
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-[#73e28a] rounded-full animate-ping absolute"></div>
            <div className="w-4 h-4 bg-[#73e28a] rounded-full relative border-4 border-slate-900"></div>
         </div>
      </div>

      {/* Contact Info Cards */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {contactInfo.map((item) => (
               <Card key={item.id} className="bg-slate-900/95 backdrop-blur-sm border-slate-800 p-8 text-center hover:border-[#73e28a]/50 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                     <span className="text-xs font-bold text-slate-600 group-hover:text-[#73e28a] transition-colors border border-slate-700 rounded px-2 py-1">{item.id}</span>
                  </div>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#73e28a] group-hover:bg-[#73e28a] group-hover:text-black transition-all">
                     <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-bold text-lg">{item.text}</h3>
                  <p className="text-slate-500 text-sm mt-1">{item.label}</p>
               </Card>
            ))}
         </div>
      </div>

      {/* Main Form Section */}
      <Section className="py-24 relative overflow-hidden">
         <GridBackground />
         <FloatingPixels count={15} />
         
         <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-start">
            {/* Form */}
            <div>
               <SectionLabel text="Get In Touch" />
               <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  Let's Start Your<br />
                  <span className="text-[#73e28a]">Project Today</span>
               </h2>
               
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Your Name*</Label>
                        <Input 
                           required
                           placeholder="John Doe"
                           className="bg-slate-900/50 border-slate-700 text-white h-12 focus:border-[#73e28a] rounded-lg placeholder:text-slate-600"
                           value={formData.name}
                           onChange={(e) => handleChange('name', e.target.value)}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Your Email*</Label>
                        <Input 
                           required
                           type="email"
                           placeholder="john@company.com"
                           className="bg-slate-900/50 border-slate-700 text-white h-12 focus:border-[#73e28a] rounded-lg placeholder:text-slate-600"
                           value={formData.email}
                           onChange={(e) => handleChange('email', e.target.value)}
                        />
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Phone</Label>
                        <Input 
                           placeholder="+1 (555) 123-4567"
                           className="bg-slate-900/50 border-slate-700 text-white h-12 focus:border-[#73e28a] rounded-lg placeholder:text-slate-600"
                           value={formData.phone}
                           onChange={(e) => handleChange('phone', e.target.value)}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Subject</Label>
                        <Input 
                           placeholder="Project inquiry"
                           className="bg-slate-900/50 border-slate-700 text-white h-12 focus:border-[#73e28a] rounded-lg placeholder:text-slate-600"
                           value={formData.subject}
                           onChange={(e) => handleChange('subject', e.target.value)}
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Message</Label>
                     <Textarea 
                        placeholder="Tell us about your project..."
                        className="bg-slate-900/50 border-slate-700 text-white min-h-[150px] focus:border-[#73e28a] rounded-lg placeholder:text-slate-600 resize-none"
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                     />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4">
                     <p className="text-slate-500 text-sm max-w-xs">
                        * We typically respond within 24 hours
                     </p>
                     <Button 
                        type="submit"
                        disabled={submitMutation.isPending}
                        className="bg-[#73e28a] text-black hover:bg-[#5dbb72] font-bold h-12 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        {submitMutation.isPending ? 'Sending...' : 'Send Request'} 
                        <ArrowUpRight className="ml-2 w-5 h-5" />
                     </Button>
                  </div>
               </form>
            </div>

            {/* Right Side Image */}
            <div className="relative h-full min-h-[600px] rounded-2xl overflow-hidden bg-slate-900 group">
               <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" 
                  alt="Contact Support" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
               <div className="absolute bottom-10 left-10 right-10">
                  <h2 className="text-4xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                     Have Any Query?<br/> Feel Free to Contact
                  </h2>
                  <div className="inline-flex items-center gap-3 bg-[#73e28a] px-6 py-3 rounded-full text-black font-bold shadow-lg cursor-pointer hover:scale-105 transition-transform">
                     <Mail className="w-5 h-5" />
                     <span>hello@kodeagency.com</span>
                  </div>
               </div>
            </div>
         </div>
      </Section>


    </div>
  );
}