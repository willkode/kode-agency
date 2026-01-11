import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Send, Eye, Trash2, Copy, ExternalLink, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

const statusColors = {
  draft: "bg-slate-500",
  sent: "bg-blue-500",
  viewed: "bg-purple-500",
  accepted: "bg-amber-500",
  paid: "bg-green-500",
  declined: "bg-red-500",
  expired: "bg-slate-400"
};

export default function QuotesSection() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_company: '',
    project_title: '',
    scope_of_work: '',
    price: '',
    valid_until: ''
  });

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ['quotes'],
    queryFn: () => base44.entities.Quote.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Quote.create({
      ...data,
      quote_number: `Q-${Date.now().toString(36).toUpperCase()}`,
      status: 'draft'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      setIsCreateOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Quote.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      setIsDeleteOpen(false);
      setSelectedQuote(null);
    }
  });

  const sendQuoteMutation = useMutation({
    mutationFn: async (quote) => {
      const quoteUrl = `${window.location.origin}/quote/${quote.id}`;
      
      await base44.integrations.Core.SendEmail({
        to: quote.client_email,
        subject: `Quote for ${quote.project_title} - ${quote.quote_number}`,
        body: `
Hi ${quote.client_name},

Thank you for your interest in working with Kode Agency!

We've prepared a quote for your project "${quote.project_title}".

Quote Details:
- Quote Number: ${quote.quote_number}
- Amount: $${quote.price.toLocaleString()}
- Valid Until: ${quote.valid_until ? format(new Date(quote.valid_until), 'MMMM d, yyyy') : 'N/A'}

View and accept your quote here:
${quoteUrl}

If you have any questions, please don't hesitate to reach out.

Best regards,
Kode Agency Team
        `
      });

      await base44.entities.Quote.update(quote.id, {
        status: 'sent',
        sent_date: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      setIsViewOpen(false);
    }
  });

  const resetForm = () => {
    setFormData({
      client_name: '',
      client_email: '',
      client_company: '',
      project_title: '',
      scope_of_work: '',
      price: '',
      valid_until: ''
    });
  };

  const handleCreate = () => {
    createMutation.mutate({
      ...formData,
      price: parseFloat(formData.price)
    });
  };

  const copyQuoteLink = (quote) => {
    const url = `${window.location.origin}/quote/${quote.id}`;
    navigator.clipboard.writeText(url);
  };

  const filteredQuotes = filterStatus === "all" 
    ? quotes 
    : quotes.filter(q => q.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Quotes</h2>
          <p className="text-slate-400">Create and manage client quotes</p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#73e28a] hover:bg-[#5dbb72] text-black"
        >
          <Plus className="w-4 h-4 mr-2" /> New Quote
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filterStatus === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("all")}
          className={filterStatus === "all" ? "bg-[#73e28a] text-black" : "border-slate-700 text-slate-300"}
        >
          All
        </Button>
        {["draft", "sent", "viewed", "accepted", "paid", "declined"].map(status => (
          <Button
            key={status}
            variant={filterStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus(status)}
            className={filterStatus === status ? "bg-[#73e28a] text-black" : "border-slate-700 text-slate-300 bg-slate-800 hover:bg-slate-700"}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Quotes Grid */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-slate-400 text-center py-8">Loading quotes...</div>
        ) : filteredQuotes.length === 0 ? (
          <div className="text-slate-400 text-center py-8">No quotes found</div>
        ) : (
          filteredQuotes.map(quote => (
            <div 
              key={quote.id}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-slate-500 text-sm font-mono">{quote.quote_number}</span>
                    <Badge className={`${statusColors[quote.status]} text-white`}>
                      {quote.status}
                    </Badge>
                  </div>
                  <h3 className="text-white font-semibold">{quote.project_title}</h3>
                  <p className="text-slate-400 text-sm">{quote.client_name} • {quote.client_email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[#73e28a] font-bold text-xl">${quote.price?.toLocaleString()}</div>
                    {quote.valid_until && (
                      <div className="text-slate-500 text-xs">
                        Valid until {format(new Date(quote.valid_until), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setSelectedQuote(quote); setIsViewOpen(true); }}
                      className="text-slate-400 hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyQuoteLink(quote)}
                      className="text-slate-400 hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setSelectedQuote(quote); setIsDeleteOpen(true); }}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Quote Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Quote</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client Name *</Label>
                <Input
                  value={formData.client_name}
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                  className="bg-slate-800 border-slate-700"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Client Email *</Label>
                <Input
                  type="email"
                  value={formData.client_email}
                  onChange={(e) => setFormData({...formData, client_email: e.target.value})}
                  className="bg-slate-800 border-slate-700"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input
                value={formData.client_company}
                onChange={(e) => setFormData({...formData, client_company: e.target.value})}
                className="bg-slate-800 border-slate-700"
                placeholder="Acme Inc."
              />
            </div>
            <div className="space-y-2">
              <Label>Project Title *</Label>
              <Input
                value={formData.project_title}
                onChange={(e) => setFormData({...formData, project_title: e.target.value})}
                className="bg-slate-800 border-slate-700"
                placeholder="MVP Development"
              />
            </div>
            <div className="space-y-2">
              <Label>Scope of Work *</Label>
              <Textarea
                value={formData.scope_of_work}
                onChange={(e) => setFormData({...formData, scope_of_work: e.target.value})}
                className="bg-slate-800 border-slate-700 min-h-[150px]"
                placeholder="Describe the project deliverables, timeline, and what's included..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (USD) *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="bg-slate-800 border-slate-700"
                  placeholder="5000"
                />
              </div>
              <div className="space-y-2">
                <Label>Valid Until</Label>
                <Input
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="border-slate-700 text-slate-300 hover:text-white">
              Cancel
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={!formData.client_name || !formData.client_email || !formData.project_title || !formData.scope_of_work || !formData.price}
              className="bg-[#73e28a] hover:bg-[#5dbb72] text-black"
            >
              Create Quote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Quote Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedQuote?.quote_number}
              <Badge className={`${statusColors[selectedQuote?.status]} text-white`}>
                {selectedQuote?.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-400">Client</Label>
                  <p className="text-white font-medium">{selectedQuote.client_name}</p>
                  <p className="text-slate-400 text-sm">{selectedQuote.client_email}</p>
                  {selectedQuote.client_company && (
                    <p className="text-slate-400 text-sm">{selectedQuote.client_company}</p>
                  )}
                </div>
                <div className="text-right">
                  <Label className="text-slate-400">Amount</Label>
                  <p className="text-[#73e28a] font-bold text-2xl">${selectedQuote.price?.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-slate-400">Project</Label>
                <p className="text-white font-medium">{selectedQuote.project_title}</p>
              </div>

              <div>
                <Label className="text-slate-400">Scope of Work</Label>
                <div className="bg-slate-800 rounded-lg p-4 mt-2 whitespace-pre-wrap text-slate-300">
                  {selectedQuote.scope_of_work}
                </div>
              </div>

              {selectedQuote.client_notes && (
                <div>
                  <Label className="text-slate-400">Client Notes</Label>
                  <div className="bg-slate-800 rounded-lg p-4 mt-2 whitespace-pre-wrap text-slate-300">
                    {selectedQuote.client_notes}
                  </div>
                </div>
              )}

              <div className="flex gap-4 text-sm text-slate-400">
                {selectedQuote.valid_until && (
                  <span>Valid until: {format(new Date(selectedQuote.valid_until), 'MMM d, yyyy')}</span>
                )}
                {selectedQuote.sent_date && (
                  <span>Sent: {format(new Date(selectedQuote.sent_date), 'MMM d, yyyy')}</span>
                )}
                {selectedQuote.paid_date && (
                  <span>Paid: {format(new Date(selectedQuote.paid_date), 'MMM d, yyyy')}</span>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => copyQuoteLink(selectedQuote)}
              className="border-slate-700 text-slate-300 hover:text-white"
            >
              <Copy className="w-4 h-4 mr-2" /> Copy Link
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(`/quote/${selectedQuote?.id}`, '_blank')}
              className="border-slate-700 text-slate-300 hover:text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" /> Preview
            </Button>
            {selectedQuote?.status === 'draft' && (
              <Button
                onClick={() => sendQuoteMutation.mutate(selectedQuote)}
                disabled={sendQuoteMutation.isPending}
                className="bg-[#73e28a] hover:bg-[#5dbb72] text-black"
              >
                <Send className="w-4 h-4 mr-2" /> 
                {sendQuoteMutation.isPending ? 'Sending...' : 'Send Quote'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Quote</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete this quote? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700 text-slate-300">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(selectedQuote?.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}