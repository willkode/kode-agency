import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2, Wrench } from 'lucide-react';
import Card from '@/components/ui-custom/Card';

export default function MigrationQuoteForm({ scan, user }) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: user?.full_name || '',
    email: user?.email || '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setIsSubmitting(true);
    await base44.entities.MigrationQuoteRequest.create({
      name: form.name,
      email: form.email,
      message: form.message,
      github_url: scan?.github_url || '',
      scan_id: scan?.id || '',
      complexity: scan?.complexity || '',
      can_migrate: scan?.can_migrate || ''
    });
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <Card className="p-6 bg-slate-900/80 border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <Wrench className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-white font-bold">Need help with the migration?</h3>
          <p className="text-slate-400 text-sm">Submit your details and we'll send you a custom quote.</p>
        </div>
      </div>

      {submitted ? (
        <div className="flex items-center gap-3 py-4 text-[#73e28a]">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">Request received! We'll be in touch shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-slate-400 text-xs">Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-9 text-sm"
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-slate-400 text-xs">Email *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-9 text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-slate-400 text-xs">Anything specific you need help with?</Label>
            <Textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 text-sm h-20"
              placeholder="e.g. Need help setting up Cloudflare Pages and updating auth redirect URLs..."
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !form.name || !form.email}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 w-full"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Request a Quote'}
          </Button>
        </form>
      )}
    </Card>
  );
}