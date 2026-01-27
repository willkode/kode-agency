import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Users } from 'lucide-react';

export default function MassEmailModal({ open, onClose }) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const { data: leads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list(),
    enabled: open
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => base44.entities.ContactSubmission.list(),
    enabled: open
  });

  // Get unique emails from leads and contacts
  const allEmails = [...new Set([
    ...leads.map(l => l.email).filter(Boolean),
    ...contacts.map(c => c.email).filter(Boolean)
  ])];

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      setResult({ error: 'Please fill in subject and message' });
      return;
    }

    setSending(true);
    setResult(null);

    let successCount = 0;
    let failCount = 0;

    for (const email of allEmails) {
      try {
        await base44.integrations.Core.SendEmail({
          to: email,
          subject: subject,
          body: body
        });
        successCount++;
      } catch (err) {
        failCount++;
      }
    }

    setSending(false);
    setResult({ success: successCount, failed: failCount });
  };

  const handleClose = () => {
    setSubject('');
    setBody('');
    setResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Send Mass Email
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-slate-400">
            This will send an email to <span className="text-indigo-400 font-medium">{allEmails.length}</span> unique recipients from your leads and contacts.
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-1 block">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-1 block">Message</label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message here..."
              rows={6}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          {result && (
            <div className={`p-3 rounded-lg text-sm ${result.error ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
              {result.error ? result.error : `Sent ${result.success} emails successfully. ${result.failed > 0 ? `${result.failed} failed.` : ''}`}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} className="border-slate-700 text-slate-300">
              Cancel
            </Button>
            <Button 
              onClick={handleSend} 
              disabled={sending || allEmails.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send to {allEmails.length} Recipients
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}