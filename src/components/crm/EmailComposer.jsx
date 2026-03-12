import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const EMAIL_TEMPLATES = {
  blank: { name: 'Blank', subject: '', body: '' },
  initial_contact: {
    name: 'Initial Contact',
    subject: 'Following up on your inquiry',
    body: `Hi {name},\n\nThank you for reaching out to Kode Agency. I wanted to personally follow up on your inquiry.\n\nI'd love to learn more about your project and discuss how we can help bring your vision to life.\n\nWould you be available for a quick call this week?\n\nBest regards,\nKode Agency Team`
  },
  follow_up: {
    name: 'Follow-up',
    subject: 'Checking in',
    body: `Hi {name},\n\nI wanted to follow up on our previous conversation about your project.\n\nDo you have any questions I can help answer? I'm here to support you in any way.\n\nLooking forward to hearing from you.\n\nBest regards,\nKode Agency Team`
  },
  proposal_sent: {
    name: 'Proposal Sent',
    subject: 'Your custom proposal is ready',
    body: `Hi {name},\n\nI've prepared a custom proposal for your project based on our discussion.\n\nPlease review it at your convenience and let me know if you have any questions or would like to discuss any details.\n\nI'm excited about the opportunity to work together!\n\nBest regards,\nKode Agency Team`
  },
  won_deal: {
    name: 'Welcome - Deal Won',
    subject: 'Welcome to Kode Agency! 🎉',
    body: `Hi {name},\n\nWelcome to Kode Agency! We're thrilled to start working on your project.\n\nI'll be your main point of contact throughout this journey. Here's what happens next:\n\n1. Project kickoff call (I'll send a calendar invite)\n2. Requirements gathering\n3. Development begins\n\nFeel free to reach out anytime with questions.\n\nLet's build something amazing together!\n\nBest regards,\nKode Agency Team`
  },
  lost_deal: {
    name: 'Lost Deal Follow-up',
    subject: 'Thank you for considering us',
    body: `Hi {name},\n\nThank you for considering Kode Agency for your project.\n\nWhile I understand you've decided to go in a different direction, I want you to know our door is always open.\n\nIf circumstances change or you have future projects, please don't hesitate to reach out.\n\nWishing you all the best!\n\nBest regards,\nKode Agency Team`
  }
};

export default function EmailComposer({ lead, onClose, onEmailSent }) {
  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  const applyTemplate = (templateKey) => {
    const template = EMAIL_TEMPLATES[templateKey];
    if (template) {
      setSubject(template.subject);
      setBody(template.body.replace(/{name}/g, lead.name.split(' ')[0]));
    }
  };

  const handleTemplateChange = (value) => {
    setSelectedTemplate(value);
    applyTemplate(value);
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      alert('Please fill in subject and body');
      return;
    }

    setIsSending(true);
    try {
      const response = await base44.functions.invoke('sendCRMEmail', {
        lead_id: lead.id,
        to_email: lead.email,
        subject,
        body,
        template_used: selectedTemplate !== 'blank' ? selectedTemplate : null
      });

      if (response.data.success) {
        onEmailSent?.();
        onClose();
      } else {
        alert('Failed to send email: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error sending email: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <Mail className="w-4 h-4" />
        <span>To: <span className="text-white">{lead.email}</span></span>
      </div>

      <div>
        <label className="text-sm text-slate-400 mb-2 block">Email Template</label>
        <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
          <SelectTrigger className="bg-slate-800 border-slate-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => (
              <SelectItem key={key} value={key}>{template.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm text-slate-400 mb-2 block">Subject</label>
        <Input
          className="bg-slate-800 border-slate-700"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Email subject..."
        />
      </div>

      <div>
        <label className="text-sm text-slate-400 mb-2 block">Message</label>
        <Textarea
          className="bg-slate-800 border-slate-700 min-h-[200px]"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Email body..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          className="flex-1 border-slate-700 text-slate-300 hover:text-white"
          onClick={onClose}
          disabled={isSending}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 bg-[#73e28a] text-black hover:bg-[#5dbb72]"
          onClick={handleSend}
          disabled={isSending}
        >
          {isSending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Email
            </>
          )}
        </Button>
      </div>
    </div>
  );
}