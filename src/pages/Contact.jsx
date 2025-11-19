import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
     name: '',
     email: '',
     company: '',
     budget: '',
     timeline: '',
     preferred_platform: 'Not sure',
     description: ''
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
        <div className="min-h-screen flex items-center justify-center pt-20">
           <Card className="text-center p-12 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Message Sent!</h2>
              <p className="text-slate-400 mb-8">
                 Thanks for reaching out. We'll review your project details and get back to you within 24 hours to schedule a discovery call.
              </p>
              <Button onClick={() => setIsSubmitted(false)} variant="outline" className="border-slate-700 text-slate-300">
                 Send another message
              </Button>
           </Card>
        </div>
     );
  }

  return (
    <div>
      <Section className="pt-32 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Start a Project</h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          Tell us about your idea. We'll help you build it.
        </p>
      </Section>

      <Section>
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div>
             <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
             <p className="text-slate-400 mb-8 leading-relaxed">
                Whether you have a complete specification or just a napkin sketch, we'd love to hear from you. Fill out the form to book a free 30-minute discovery call.
             </p>
             
             <div className="space-y-6">
                <div className="flex items-start gap-4">
                   <div className="bg-slate-800 p-3 rounded-lg text-indigo-400">
                      <Mail className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-white font-medium">Email</h4>
                      <p className="text-slate-400">hello@aiagency.com</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="bg-slate-800 p-3 rounded-lg text-indigo-400">
                      <Phone className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-white font-medium">Phone</h4>
                      <p className="text-slate-400">+1 (555) 123-4567</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="bg-slate-800 p-3 rounded-lg text-indigo-400">
                      <MapPin className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-white font-medium">Office</h4>
                      <p className="text-slate-400">San Francisco, CA<br/>(Remote Global Team)</p>
                   </div>
                </div>
             </div>

             <div className="mt-12 bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h4 className="text-white font-bold mb-2">FAQ</h4>
                <p className="text-slate-400 text-sm mb-4">Have simple questions about pricing or process?</p>
                <Button variant="link" className="text-indigo-400 p-0">Check our FAQ page &rarr;</Button>
             </div>
          </div>

          {/* Form */}
          <Card className="p-8 bg-slate-900/80">
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-300">Name</Label>
                      <Input 
                         id="name" 
                         required 
                         className="bg-slate-950 border-slate-800 text-white focus:border-indigo-500" 
                         value={formData.name}
                         onChange={(e) => handleChange('name', e.target.value)}
                      />
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">Email</Label>
                      <Input 
                         id="email" 
                         type="email" 
                         required 
                         className="bg-slate-950 border-slate-800 text-white focus:border-indigo-500" 
                         value={formData.email}
                         onChange={(e) => handleChange('email', e.target.value)}
                      />
                   </div>
                </div>
                
                <div className="space-y-2">
                   <Label htmlFor="company" className="text-slate-300">Company (Optional)</Label>
                   <Input 
                      id="company" 
                      className="bg-slate-950 border-slate-800 text-white focus:border-indigo-500" 
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label htmlFor="budget" className="text-slate-300">Budget Range</Label>
                      <Select onValueChange={(val) => handleChange('budget', val)}>
                         <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                            <SelectValue placeholder="Select..." />
                         </SelectTrigger>
                         <SelectContent>
                            <SelectItem value="<5k">Under $5k</SelectItem>
                            <SelectItem value="5k-10k">$5k - $10k</SelectItem>
                            <SelectItem value="10k-25k">$10k - $25k</SelectItem>
                            <SelectItem value="25k+">$25k+</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="timeline" className="text-slate-300">Timeline</Label>
                      <Select onValueChange={(val) => handleChange('timeline', val)}>
                         <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                            <SelectValue placeholder="Select..." />
                         </SelectTrigger>
                         <SelectContent>
                            <SelectItem value="asap">ASAP (1-2 weeks)</SelectItem>
                            <SelectItem value="1month">Within 1 month</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>
                </div>

                <div className="space-y-2">
                   <Label htmlFor="platform" className="text-slate-300">Preferred Platform</Label>
                   <Select onValueChange={(val) => handleChange('preferred_platform', val)} defaultValue="Not sure">
                      <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                         <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="Not sure">Not sure (Recommend one)</SelectItem>
                         <SelectItem value="Base44">Base44</SelectItem>
                         <SelectItem value="Lovable">Lovable</SelectItem>
                         <SelectItem value="Replit">Replit</SelectItem>
                         <SelectItem value="Custom">Custom Code</SelectItem>
                      </SelectContent>
                   </Select>
                </div>

                <div className="space-y-2">
                   <Label htmlFor="description" className="text-slate-300">Project Description</Label>
                   <Textarea 
                      id="description" 
                      placeholder="Tell us what you want to build..." 
                      className="bg-slate-950 border-slate-800 text-white min-h-[120px] focus:border-indigo-500" 
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                   />
                </div>

                <Button 
                   type="submit" 
                   disabled={submitMutation.isPending} 
                   className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg"
                >
                   {submitMutation.isPending ? 'Sending...' : 'Send Project Details'}
                </Button>
             </form>
          </Card>
        </div>
      </Section>
    </div>
  );
}