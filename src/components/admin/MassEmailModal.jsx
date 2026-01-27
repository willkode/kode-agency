import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Send, Loader2, Users, CheckCircle, AlertCircle } from 'lucide-react';

export default function MassEmailModal({ open, onClose }) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedSources, setSelectedSources] = useState({
    leads: true,
    contacts: true,
    users: false,
  });
  const [sendResult, setSendResult] = useState(null);

  // Fetch all emails from different sources
  const { data: leads = [] } = useQuery({
    queryKey: ['leads-emails'],
    queryFn: () => base44.entities.Lead.list(),
    enabled: open,
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts-emails'],
    queryFn: () => base44.entities.ContactSubmission.list(),
    enabled: open,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users-emails'],
    queryFn: () => base44.entities.User.list(),
    enabled: open,
  });

  // Get unique emails based on selected sources
  const getUniqueEmails = () => {
    const allEmails = [];
    if (selectedSources.leads) {
      allEmails.push(...leads.map(l => l.email).filter(Boolean));
    }
    if (selectedSources.contacts) {
      allEmails.push(...contacts.map(c => c.email).filter(Boolean));
    }
    if (selectedSources.users) {
      allEmails.push(...users.map(u => u.email).filter(Boolean));
    }
    return [...new Set(allEmails)];
  };

  const uniqueEmails = getUniqueEmails();

  const sendEmailsMutation = useMutation({
    mutationFn: async () => {
      const emails = uniqueEmails;
      let sent = 0;
      let failed = 0;

      for (const email of emails) {
        try {
          await base44.integrations.Core.SendEmail({
            to: email,
            subject: subject,
            body: body,
          });
          sent++;
        } catch (err) {
          console.error(`Failed to send to ${email}:`, err);
          failed++;
        }
      }

      return { sent, failed, total: emails.length };
    },
    onSuccess: (result) => {
      setSendResult(result);
    },
    onError: (err) => {
      setSendResult({ error: err.message });
    }
  });

  const handleSend = () => {
    if (!subject.trim() || !body.trim() || uniqueEmails.length === 0) return;
    setSendResult(null);
    sendEmailsMutation.mutate();
  };

  const handleClose = () => {
    setSubject('');
    setBody('');
    setSendResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="bg-slate-900 border-slate-800 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-[#73e28a]" />
            Send Mass Email
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Source Selection */}
          <div>
            <Label className="text-slate-400 mb-2 block">Email Sources</Label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <Checkbox
                  checked={selectedSources.leads}
                  onCheckedChange={(checked) => setSelectedSources(prev => ({ ...prev, leads: checked }))}
                  className="border-slate-600 data-[state=checked]:bg-[#73e28a] data-[state=checked]:border-[#73e28a]"
                />
                <span>Leads ({leads.filter(l => l.email).length})</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <Checkbox
                  checked={selectedSources.contacts}
                  onCheckedChange={(checked) => setSelectedSources(prev => ({ ...prev, contacts: checked }))}
                  className="border-slate-600 data-[state=checked]:bg-[#73e28a] data-[state=checked]:border-[#73e28a]"
                />
                <span>Contacts ({contacts.filter(c => c.email).length})</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <Checkbox
                  checked={selectedSources.users}
                  onCheckedChange={(checked) => setSelectedSources(prev => ({ ...prev, users: checked }))}
                  className="border-slate-600 data-[state=checked]:bg-[#73e28a] data-[state=checked]:border-[#73e28a]"
                />
                <span>Users ({users.filter(u => u.email).length})</span>
              </label>
            </div>
            <p className="text-[#73e28a] text-sm mt-2 flex items-center gap-1">
              <Users className="w-4 h-4" />
              {uniqueEmails.length} unique recipients selected
            </p>
          </div>

          {/* Subject */}
          <div>
            <Label className="text-slate-400">Subject *</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Body */}
          <div>
            <Label className="text-slate-400">Message *</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter your message..."
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[150px]"
            />
          </div>

          {/* Result */}
          {sendResult && (
            <div className={`p-4 rounded-lg ${sendResult.error ? 'bg-red-500/20 border border-red-500/30' : 'bg-[#73e28a]/20 border border-[#73e28a]/30'}`}>
              {sendResult.error ? (
                <p className="text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Error: {sendResult.error}
                </p>
              ) : (
                <div className="text-[#73e28a] flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Sent {sendResult.sent} of {sendResult.total} emails{sendResult.failed > 0 && ` (${sendResult.failed} failed)`}</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-slate-700 text-slate-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={sendEmailsMutation.isPending || !subject.trim() || !body.trim() || uniqueEmails.length === 0}
              className="flex-1 bg-[#73e28a] text-black hover:bg-[#5dbb72]"
            >
              {sendEmailsMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send to {uniqueEmails.length} Recipients
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}