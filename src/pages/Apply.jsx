import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import PageHero from '@/components/ui-custom/PageHero';
import SectionLabel from '@/components/ui-custom/SectionLabel';
import GridBackground from '@/components/ui-custom/GridBackground';
import FloatingPixels from '@/components/ui-custom/FloatingPixels';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { CheckCircle, Upload, Loader2 } from 'lucide-react';

export default function ApplyPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    skills: '',
    portfolio_url: '',
    linkedin_url: '',
    resume_url: '',
    rate_type: '',
    hourly_rate: '',

    message: ''
  });

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      const applicationData = {
        ...data,
        skills: data.skills ? data.skills.split(',').map(s => s.trim()) : []
      };
      await base44.entities.SubcontractorApplication.create(applicationData);
      // Send notification email
      await base44.integrations.Core.SendEmail({
        to: 'will@kodeagency.us',
        subject: `New Subcontractor Application from ${data.full_name}`,
        body: `
New Subcontractor Application

Name: ${data.full_name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Location: ${data.location || 'Not provided'}

Skills: ${data.skills || 'Not provided'}
Rate Type: ${data.rate_type || 'Not provided'}
Hourly Rate: ${data.hourly_rate || 'N/A'}

Portfolio: ${data.portfolio_url || 'Not provided'}
LinkedIn: ${data.linkedin_url || 'Not provided'}
Resume: ${data.resume_url || 'Not uploaded'}

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData(prev => ({ ...prev, resume_url: file_url }));
    setIsUploading(false);
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
          <h2 className="text-3xl font-bold text-white mb-4">Application Received!</h2>
          <p className="text-slate-400 mb-8">
            Thanks for your interest. We'll review your application and get back to you soon.
          </p>
          <Button onClick={() => setIsSubmitted(false)} className="bg-[#73e28a] text-black hover:bg-[#5dbb72]">
            Submit Another Application
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-slate-950 text-white overflow-hidden">
      <PageHero 
        title="Join Our Team" 
        backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop"
      />

      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={15} />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel text="Subcontractor Application" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Work With Us
            </h2>
            <p className="text-slate-400">
              We're always looking for talented developers, designers, and creators to collaborate with.
            </p>
          </div>

          <Card className="p-8 bg-slate-900/80 border-slate-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Full Name *</Label>
                  <Input 
                    required
                    placeholder="John Doe"
                    className="bg-slate-800/50 border-slate-700 text-white h-12 focus:border-[#73e28a] rounded-lg placeholder:text-slate-600"
                    value={formData.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Email *</Label>
                  <Input 
                    required
                    type="email"
                    placeholder="john@example.com"
                    className="bg-slate-800/50 border-slate-700 text-white h-12 focus:border-[#73e28a] rounded-lg placeholder:text-slate-600"
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
                    className="bg-slate-800/50 border-slate-700 text-white h-12 focus:border-[#73e28a] rounded-lg placeholder:text-slate-600"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Location</Label>
                  <Input 
                    placeholder="City, Country"
                    className="bg-slate-800/50 border-slate-700 text-white h-12 focus:border-[#73e28a] rounded-lg placeholder:text-slate-600"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                  />
                </div>
              </div>

              {/* Skills & Rate */}
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Skills (comma separated) *</Label>
                <Input 
                  required
                  placeholder="React, Node.js, UI/UX Design, etc."
                  className="bg-slate-800/50 border-slate-700 text-white h-12 focus:border-[#73e28a] rounded-lg placeholder:text-slate-600"
                  value={formData.skills}
                  onChange={(e) => handleChange('skills', e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Rate *</Label>
                  <Select value={formData.rate_type} onValueChange={(value) => handleChange('rate_type', value)} required>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-12 focus:border-[#73e28a] rounded-lg">
                      <SelectValue placeholder="Select rate type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hourly">Hourly</SelectItem>
                      <SelectItem value="Project-based">Project-based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.rate_type === 'Hourly' && (
                  <div className="space-y-2">
                    <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Hourly Rate *</Label>
                    <Input 
                      required
                      placeholder="$50/hr"
                      className="bg-slate-800/50 border-slate-700 text-white h-12 focus:border-[#73e28a] rounded-lg placeholder:text-slate-600"
                      value={formData.hourly_rate}
                      onChange={(e) => handleChange('hourly_rate', e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Portfolio */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Portfolio URL</Label>
                  <Input 
                    placeholder="https://yourportfolio.com"
                    className="bg-slate-800/50 border-slate-700 text-white h-12 focus:border-[#73e28a] rounded-lg placeholder:text-slate-600"
                    value={formData.portfolio_url}
                    onChange={(e) => handleChange('portfolio_url', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">LinkedIn URL</Label>
                  <Input 
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="bg-slate-800/50 border-slate-700 text-white h-12 focus:border-[#73e28a] rounded-lg placeholder:text-slate-600"
                    value={formData.linkedin_url}
                    onChange={(e) => handleChange('linkedin_url', e.target.value)}
                  />
                </div>
              </div>

              {/* Resume Upload */}
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Resume (PDF) *</Label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="flex items-center justify-center gap-3 w-full h-24 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-[#73e28a]/50 transition-colors bg-slate-800/30"
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Uploading...
                      </div>
                    ) : formData.resume_url ? (
                      <div className="flex items-center gap-2 text-[#73e28a]">
                        <CheckCircle className="w-5 h-5" />
                        Resume uploaded
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Upload className="w-5 h-5" />
                        Click to upload PDF
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs uppercase tracking-wider font-bold">Tell us about yourself</Label>
                <Textarea 
                  placeholder="Share your experience, what you're looking for, and why you'd be a great fit..."
                  className="bg-slate-800/50 border-slate-700 text-white min-h-[120px] focus:border-[#73e28a] rounded-lg placeholder:text-slate-600 resize-none"
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                />
              </div>

              <Button 
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-[#73e28a] text-black hover:bg-[#5dbb72] font-bold h-14 text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitMutation.isPending ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </Card>
        </div>
      </Section>
    </div>
  );
}