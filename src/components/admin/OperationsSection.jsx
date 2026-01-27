import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '@/components/ui-custom/Card';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle, Clock, CreditCard, FolderKanban, CheckCircle,
  Send, ArrowRight, RefreshCw, Download, Mail, Eye, Loader2,
  DollarSign, Users, XCircle, Tag, MessageSquare
} from 'lucide-react';
import MassEmailModal from '@/components/admin/MassEmailModal';

const SERVICE_LABELS = {
  'app_review': 'App Review',
  'mobile_app_conversion': 'Mobile Conversion',
  'build_sprint': 'Build Sprint',
  'app_foundation': 'App Foundation',
  'custom': 'Custom'
};

const paymentStatusColors = {
  'pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'completed': 'bg-[#73e28a]/20 text-[#73e28a] border-[#73e28a]/30',
  'failed': 'bg-red-500/20 text-red-400 border-red-500/30',
  'refunded': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
};

const leadStatusColors = {
  'New': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Contacted': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Qualified': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Proposal': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Won': 'bg-[#73e28a]/20 text-[#73e28a] border-[#73e28a]/30',
  'Lost': 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function OperationsSection() {
  const queryClient = useQueryClient();
  const [selectedLead, setSelectedLead] = useState(null);
  const [isRunningReminders, setIsRunningReminders] = useState(false);
  const [reminderResult, setReminderResult] = useState(null);
  const [exportFilter, setExportFilter] = useState({ tag: '', status: '' });
  const [showMassEmailModal, setShowMassEmailModal] = useState(false);

  // Fetch all data
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list('-created_date'),
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date'),
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['all-tasks'],
    queryFn: () => base44.entities.Task.list(),
  });

  // Computed lists
  const needsFollowUp = leads.filter(l => 
    ['New', 'Contacted'].includes(l.status) && 
    !l.payment_status // No payment initiated
  );

  const awaitingPayment = leads.filter(l => l.payment_status === 'pending');

  const paidNotConverted = leads.filter(l => 
    l.payment_status === 'completed' && !l.project_id
  );

  const projectsWithoutTasks = projects.filter(p => {
    const projectTasks = tasks.filter(t => t.project_id === p.id);
    return projectTasks.length === 0;
  });

  // Mutations
  const convertMutation = useMutation({
    mutationFn: async (leadId) => {
      const response = await base44.functions.invoke('convertLeadToProject', { lead_id: leadId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] });
    }
  });

  const updateLeadMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Lead.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setSelectedLead(null);
    }
  });

  const runReminders = async () => {
    setIsRunningReminders(true);
    setReminderResult(null);
    try {
      const response = await base44.functions.invoke('runPaymentReminders', {});
      setReminderResult(response.data);
    } catch (err) {
      setReminderResult({ error: err.message });
    } finally {
      setIsRunningReminders(false);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  };

  const exportAudienceCSV = () => {
    let filtered = leads;
    
    if (exportFilter.tag) {
      filtered = filtered.filter(l => 
        l.marketing_tags?.includes(exportFilter.tag)
      );
    }
    if (exportFilter.status) {
      filtered = filtered.filter(l => l.status === exportFilter.status);
    }

    const headers = ['email', 'name', 'service_sku', 'status', 'payment_status', 'tags'];
    const rows = filtered.map(l => [
      l.email || '',
      l.name || '',
      l.service_sku || '',
      l.status || '',
      l.payment_status || '',
      (l.marketing_tags || []).join(';')
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audience-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ListSection = ({ title, icon: Icon, items, color, renderItem }) => (
    <Card className="p-4 bg-slate-900/80 border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center`}>
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white">{title}</h3>
        </div>
        <Badge variant="outline" className="border-slate-700 text-slate-300">{items.length}</Badge>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-slate-500 text-sm">None</p>
        ) : (
          items.slice(0, 10).map(renderItem)
        )}
        {items.length > 10 && (
          <p className="text-slate-500 text-xs">+{items.length - 10} more</p>
        )}
      </div>
    </Card>
  );

  if (leadsLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{needsFollowUp.length}</div>
              <div className="text-xs text-slate-400">Needs Follow-up</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{awaitingPayment.length}</div>
              <div className="text-xs text-slate-400">Awaiting Payment</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#73e28a]/20 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#73e28a]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{paidNotConverted.length}</div>
              <div className="text-xs text-slate-400">Paid, Not Converted</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{projectsWithoutTasks.length}</div>
              <div className="text-xs text-slate-400">Projects Missing Tasks</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={runReminders}
          disabled={isRunningReminders}
          className="bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          {isRunningReminders ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Run Payment Reminders
        </Button>
        <Button 
          onClick={exportAudienceCSV}
          variant="outline"
          className="border-slate-700 text-slate-300 hover:text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Audience CSV
        </Button>
        <Button 
          onClick={() => setShowMassEmailModal(true)}
          variant="outline"
          className="border-slate-700 text-slate-300 hover:text-white"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Message
        </Button>
      </div>

      {/* Reminder Result */}
      {reminderResult && (
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          {reminderResult.error ? (
            <p className="text-red-400">Error: {reminderResult.error}</p>
          ) : (
            <div className="text-sm text-slate-300 space-y-1">
              <p className="text-[#73e28a] font-bold">Reminder run complete!</p>
              <p>Processed: {reminderResult.processed} | Reminded: {reminderResult.reminded} | Marked stale: {reminderResult.marked_stale}</p>
              {reminderResult.errors?.length > 0 && (
                <p className="text-red-400">Errors: {reminderResult.errors.length}</p>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Lists Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <ListSection
          title="Needs Follow-up"
          icon={AlertTriangle}
          items={needsFollowUp}
          color="bg-blue-500/20 text-blue-400"
          renderItem={(lead) => (
            <div 
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className="p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm">{lead.name}</p>
                  <p className="text-slate-500 text-xs">{lead.email}</p>
                </div>
                <Badge className={leadStatusColors[lead.status]}>{lead.status}</Badge>
              </div>
            </div>
          )}
        />

        <ListSection
          title="Awaiting Payment"
          icon={Clock}
          items={awaitingPayment}
          color="bg-yellow-500/20 text-yellow-400"
          renderItem={(lead) => (
            <div 
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className="p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm">{lead.name}</p>
                  <p className="text-slate-500 text-xs">
                    {SERVICE_LABELS[lead.service_sku] || lead.service_sku || 'Unknown'} 
                    {lead.amount && ` • $${lead.amount}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {lead.reminder_count > 0 && (
                    <Badge variant="outline" className="border-slate-700 text-slate-300 text-xs">
                      {lead.reminder_count} reminder{lead.reminder_count > 1 ? 's' : ''}
                    </Badge>
                  )}
                  <Badge className={paymentStatusColors.pending}>Pending</Badge>
                </div>
              </div>
            </div>
          )}
        />

        <ListSection
          title="Paid, Not Converted"
          icon={CreditCard}
          items={paidNotConverted}
          color="bg-[#73e28a]/20 text-[#73e28a]"
          renderItem={(lead) => (
            <div 
              key={lead.id}
              className="p-3 bg-slate-800/50 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm">{lead.name}</p>
                  <p className="text-slate-500 text-xs">
                    {SERVICE_LABELS[lead.service_sku] || lead.service_sku || 'Unknown'}
                    {lead.amount && ` • $${lead.amount}`}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => convertMutation.mutate(lead.id)}
                  disabled={convertMutation.isPending}
                  className="bg-[#73e28a] text-black hover:bg-[#5dbb72] h-8 text-xs"
                >
                  {convertMutation.isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <ArrowRight className="w-3 h-3 mr-1" />
                      Convert
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        />

        <ListSection
          title="Projects Missing Tasks"
          icon={FolderKanban}
          items={projectsWithoutTasks}
          color="bg-orange-500/20 text-orange-400"
          renderItem={(project) => (
            <div 
              key={project.id}
              className="p-3 bg-slate-800/50 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm truncate max-w-[200px]">{project.title}</p>
                  <p className="text-slate-500 text-xs">{project.client_email || 'No email'}</p>
                </div>
                <Badge variant="outline" className="border-slate-700 text-slate-300 text-xs">
                  {project.status}
                </Badge>
              </div>
            </div>
          )}
        />
      </div>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-lg">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white">{selectedLead.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Email</p>
                    <p className="text-white">{selectedLead.email}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Service</p>
                    <p className="text-white">{SERVICE_LABELS[selectedLead.service_sku] || selectedLead.service_sku || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Amount</p>
                    <p className="text-white">${selectedLead.amount || selectedLead.deal_value || 0}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Payment Status</p>
                    <Badge className={paymentStatusColors[selectedLead.payment_status] || 'bg-slate-700'}>
                      {selectedLead.payment_status || 'N/A'}
                    </Badge>
                  </div>
                </div>

                {/* Marketing Tags */}
                <div>
                  <p className="text-slate-500 text-sm mb-2">Marketing Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {(selectedLead.marketing_tags || []).map((tag, i) => (
                      <Badge key={i} variant="outline" className="border-slate-700 text-slate-300">
                        <Tag className="w-3 h-3 mr-1" />{tag}
                      </Badge>
                    ))}
                    <Input
                      placeholder="Add tag..."
                      className="w-32 h-7 text-xs bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          const newTags = [...(selectedLead.marketing_tags || []), e.target.value.trim()];
                          updateLeadMutation.mutate({ 
                            id: selectedLead.id, 
                            data: { marketing_tags: newTags }
                          });
                          setSelectedLead({ ...selectedLead, marketing_tags: newTags });
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-slate-800">
                  {selectedLead.payment_status === 'pending' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-slate-700 text-slate-300 hover:text-white"
                      onClick={() => {
                        updateLeadMutation.mutate({
                          id: selectedLead.id,
                          data: { payment_status: 'completed' }
                        });
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Paid
                    </Button>
                  )}
                  {selectedLead.payment_status === 'completed' && !selectedLead.project_id && (
                    <Button 
                      size="sm"
                      onClick={() => {
                        convertMutation.mutate(selectedLead.id);
                        setSelectedLead(null);
                      }}
                      className="bg-[#73e28a] text-black hover:bg-[#5dbb72]"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Convert to Project
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Mass Email Modal */}
      <MassEmailModal 
        open={showMassEmailModal} 
        onClose={() => setShowMassEmailModal(false)} 
      />
    </div>
  );
}