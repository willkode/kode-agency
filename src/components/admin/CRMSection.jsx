import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '@/components/ui-custom/Card';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Mail, Phone, Building, DollarSign, Calendar, 
  Plus, Search, Filter, ArrowRight, MessageSquare, Clock,
  CheckCircle, XCircle, TrendingUp, Edit, Trash2, Send, Bell, Tag, User
} from 'lucide-react';
import EmailComposer from '@/components/crm/EmailComposer';
import CommunicationTimeline from '@/components/crm/CommunicationTimeline';

const statusColors = {
  'New': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Contacted': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Qualified': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Proposal': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Won': 'bg-[#73e28a]/20 text-[#73e28a] border-[#73e28a]/30',
  'Lost': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const pipelineStages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

export default function CRMSection({ onConvertToProject }) {
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('pipeline'); // 'pipeline' or 'list'
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({ type: 'Note', description: '' });
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [projectType, setProjectType] = useState('');
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [leadScore, setLeadScore] = useState(50);
  const [assignedTo, setAssignedTo] = useState('');
  const [marketingTags, setMarketingTags] = useState('');
  
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list('-created_date'),
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['activities'],
    queryFn: () => base44.entities.Activity.list('-created_date'),
  });

  const { data: emails = [] } = useQuery({
    queryKey: ['emails'],
    queryFn: () => base44.entities.EmailThread.list('-created_date'),
  });

  const createLeadMutation = useMutation({
    mutationFn: (data) => base44.entities.Lead.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setIsAddDialogOpen(false);
    }
  });

  const updateLeadMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Lead.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      if (selectedLead) {
        setSelectedLead(prev => ({ ...prev, ...updateLeadMutation.variables?.data }));
      }
    }
  });

  const deleteLeadMutation = useMutation({
    mutationFn: (id) => base44.entities.Lead.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setSelectedLead(null);
    }
  });

  const createActivityMutation = useMutation({
    mutationFn: (data) => base44.entities.Activity.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      setNewActivity({ type: 'Note', description: '' });
    }
  });

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const leadsByStage = pipelineStages.reduce((acc, stage) => {
    acc[stage] = filteredLeads.filter(l => (l.status || 'New') === stage);
    return acc;
  }, {});

  const totalPipelineValue = leads
    .filter(l => !['Won', 'Lost'].includes(l.status))
    .reduce((sum, l) => sum + (l.deal_value || 0), 0);

  const wonDeals = leads.filter(l => l.status === 'Won');
  const totalWonValue = wonDeals.reduce((sum, l) => sum + (l.deal_value || 0), 0);

  const leadActivities = activities.filter(a => a.lead_id === selectedLead?.id);
  const leadEmails = emails.filter(e => e.lead_id === selectedLead?.id);
  
  // Follow-up reminders
  const todayFollowUps = leads.filter(l => {
    if (!l.next_follow_up) return false;
    const followUpDate = new Date(l.next_follow_up);
    const today = new Date();
    return followUpDate.toDateString() === today.toDateString();
  });

  const overdueFollowUps = leads.filter(l => {
    if (!l.next_follow_up) return false;
    const followUpDate = new Date(l.next_follow_up);
    const today = new Date();
    return followUpDate < today && followUpDate.toDateString() !== today.toDateString();
  });

  const handleStatusChange = (leadId, newStatus) => {
    updateLeadMutation.mutate({ id: leadId, data: { status: newStatus } });
    createActivityMutation.mutate({
      lead_id: leadId,
      type: 'Status Change',
      description: `Status changed to ${newStatus}`
    });
  };

  const handleConvertToProject = () => {
    setIsConvertDialogOpen(true);
  };

  const handleConfirmConvert = async () => {
    if (selectedLead && onConvertToProject) {
      onConvertToProject(selectedLead, projectType);
      setIsConvertDialogOpen(false);
      setProjectType('');
    }
  };

  const [newLead, setNewLead] = useState({
    name: '', email: '', company: '', phone: '', source: 'Contact Form',
    budget: '', timeline: '', description: '', deal_value: ''
  });

  const handleEmailSent = () => {
    queryClient.invalidateQueries({ queryKey: ['emails'] });
    queryClient.invalidateQueries({ queryKey: ['activities'] });
  };

  const handleSaveFollowUp = () => {
    if (followUpDate) {
      updateLeadMutation.mutate({ 
        id: selectedLead.id, 
        data: { next_follow_up: followUpDate }
      });
    }
  };

  const handleSaveLeadDetails = () => {
    const updates = {};
    if (assignedTo !== (selectedLead.assigned_to || '')) updates.assigned_to = assignedTo;
    if (leadScore !== (selectedLead.probability || 50)) updates.probability = leadScore;
    if (marketingTags) {
      const tagsArray = marketingTags.split(',').map(t => t.trim()).filter(Boolean);
      updates.marketing_tags = tagsArray;
    }
    if (Object.keys(updates).length > 0) {
      updateLeadMutation.mutate({ id: selectedLead.id, data: updates });
    }
  };

  // Initialize lead details when selected
  React.useEffect(() => {
    if (selectedLead) {
      setFollowUpDate(selectedLead.next_follow_up || '');
      setLeadScore(selectedLead.probability || 50);
      setAssignedTo(selectedLead.assigned_to || '');
      setMarketingTags(selectedLead.marketing_tags?.join(', ') || '');
    }
  }, [selectedLead?.id]);

  return (
    <div className="space-y-6">
      {/* Follow-up Alerts */}
      {(todayFollowUps.length > 0 || overdueFollowUps.length > 0) && (
        <Card className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-white mb-2">Follow-up Reminders</h3>
              {overdueFollowUps.length > 0 && (
                <p className="text-sm text-red-400 mb-1">
                  🔴 {overdueFollowUps.length} overdue follow-up{overdueFollowUps.length > 1 ? 's' : ''}
                </p>
              )}
              {todayFollowUps.length > 0 && (
                <p className="text-sm text-yellow-400">
                  ⚠️ {todayFollowUps.length} follow-up{todayFollowUps.length > 1 ? 's' : ''} due today
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{leads.length}</div>
              <div className="text-xs text-slate-400">Total Leads</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">${totalPipelineValue.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Pipeline Value</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#73e28a]/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#73e28a]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{wonDeals.length}</div>
              <div className="text-xs text-slate-400">Deals Won</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">${totalWonValue.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Revenue Won</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Search leads..." 
              className="pl-9 bg-slate-800 border-slate-700 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {pipelineStages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-slate-800 rounded-lg p-1">
            <Button 
              variant={viewMode === 'pipeline' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('pipeline')}
              className={viewMode === 'pipeline' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}
            >
              Pipeline
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}
            >
              List
            </Button>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#73e28a] text-black hover:bg-[#5dbb72]">
                <Plus className="w-4 h-4 mr-2" /> Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Lead</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input placeholder="Name *" className="bg-slate-800 border-slate-700" 
                  value={newLead.name} onChange={(e) => setNewLead({...newLead, name: e.target.value})} />
                <Input placeholder="Email *" className="bg-slate-800 border-slate-700"
                  value={newLead.email} onChange={(e) => setNewLead({...newLead, email: e.target.value})} />
                <Input placeholder="Company" className="bg-slate-800 border-slate-700"
                  value={newLead.company} onChange={(e) => setNewLead({...newLead, company: e.target.value})} />
                <Input placeholder="Phone" className="bg-slate-800 border-slate-700"
                  value={newLead.phone} onChange={(e) => setNewLead({...newLead, phone: e.target.value})} />
                <Select value={newLead.source} onValueChange={(v) => setNewLead({...newLead, source: v})}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Contact Form">Contact Form</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Deal Value ($)" type="number" className="bg-slate-800 border-slate-700"
                  value={newLead.deal_value} onChange={(e) => setNewLead({...newLead, deal_value: e.target.value})} />
                <Textarea placeholder="Description" className="bg-slate-800 border-slate-700"
                  value={newLead.description} onChange={(e) => setNewLead({...newLead, description: e.target.value})} />
                <Button className="w-full bg-[#73e28a] text-black hover:bg-[#5dbb72]"
                  onClick={() => createLeadMutation.mutate({...newLead, deal_value: parseFloat(newLead.deal_value) || 0})}>
                  Create Lead
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Pipeline View */}
      {viewMode === 'pipeline' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {pipelineStages.filter(s => s !== 'Lost').map(stage => (
            <div key={stage} className="min-w-[280px] flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white">{stage}</h3>
                <Badge className={statusColors[stage]}>{leadsByStage[stage].length}</Badge>
              </div>
              <div className="space-y-3">
                {leadsByStage[stage].map(lead => (
                  <Card 
                    key={lead.id} 
                    className="p-4 bg-slate-900/80 border-slate-800 cursor-pointer hover:border-[#73e28a]/50"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-bold text-white truncate flex-1">{lead.name}</h4>
                      {lead.next_follow_up && (
                        <Bell className={`w-3 h-3 flex-shrink-0 ${
                          new Date(lead.next_follow_up) < new Date() 
                            ? 'text-red-400' 
                            : 'text-yellow-400'
                        }`} />
                      )}
                    </div>
                    {lead.company && <p className="text-sm text-slate-400 truncate">{lead.company}</p>}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {lead.service_sku && (
                        <Badge variant="outline" className="border-slate-700 text-slate-300 text-xs">
                          {lead.service_sku}
                        </Badge>
                      )}
                      {lead.payment_status && (
                        <Badge className={`text-xs ${
                          lead.payment_status === 'completed' ? 'bg-[#73e28a]/20 text-[#73e28a]' :
                          lead.payment_status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {lead.payment_status}
                        </Badge>
                      )}
                    </div>
                    {(lead.amount || lead.deal_value) > 0 && (
                      <p className="text-sm text-[#73e28a] mt-1">${(lead.amount || lead.deal_value).toLocaleString()}</p>
                    )}
                    {lead.assigned_to && (
                      <div className="flex items-center gap-1 mt-1">
                        <User className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-500">{lead.assigned_to}</span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredLeads.map(lead => (
            <Card 
              key={lead.id} 
              className="p-4 bg-slate-900/80 border-slate-800 cursor-pointer hover:border-[#73e28a]/50"
              onClick={() => setSelectedLead(lead)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-bold text-white">{lead.name}</h4>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-slate-400">{lead.email}</p>
                      <span className="text-xs text-slate-500">•</span>
                      <p className="text-xs text-slate-500">
                        {new Date(lead.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {lead.service_sku && (
                    <Badge variant="outline" className="border-slate-700 text-slate-300 text-xs">{lead.service_sku}</Badge>
                  )}
                  {lead.payment_status && (
                    <Badge className={`text-xs ${
                      lead.payment_status === 'completed' ? 'bg-[#73e28a]/20 text-[#73e28a]' :
                      lead.payment_status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {lead.payment_status}
                    </Badge>
                  )}
                  {lead.company && <span className="text-slate-400">{lead.company}</span>}
                  {(lead.amount || lead.deal_value) > 0 && <span className="text-[#73e28a]">${(lead.amount || lead.deal_value).toLocaleString()}</span>}
                  <Badge className={statusColors[lead.status || 'New']}>{lead.status || 'New'}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Convert to Project Dialog */}
      <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Select Project Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-slate-400 text-sm">Choose the type of project to create:</p>
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue placeholder="Select project type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="app_review">App Review</SelectItem>
                <SelectItem value="app_review_corrections">App Review + Corrections</SelectItem>
                <SelectItem value="app_corrections">App Corrections</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                className="flex-1 border-slate-700 text-slate-300 hover:text-white"
                onClick={() => { setIsConvertDialogOpen(false); setProjectType(''); }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-[#73e28a] text-black hover:bg-[#5dbb72]"
                disabled={!projectType}
                onClick={handleConfirmConvert}
              >
                Create Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead && !isConvertDialogOpen && !isEmailComposerOpen} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedLead && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-white text-2xl">{selectedLead.name}</DialogTitle>
                    {selectedLead.company && <p className="text-slate-400">{selectedLead.company}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setIsEmailComposerOpen(true)}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteLeadMutation.mutate(selectedLead.id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="communication">Communication</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-4">
                {/* Status Selector */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Status</label>
                  <Select value={selectedLead.status || 'New'} onValueChange={(v) => handleStatusChange(selectedLead.id, v)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pipelineStages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-4 h-4 text-slate-500" />
                    {selectedLead.email}
                  </div>
                  {selectedLead.phone && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4 text-slate-500" />
                      {selectedLead.phone}
                    </div>
                  )}
                  {selectedLead.deal_value > 0 && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <DollarSign className="w-4 h-4 text-slate-500" />
                      ${selectedLead.deal_value.toLocaleString()}
                    </div>
                  )}
                  {selectedLead.source && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Building className="w-4 h-4 text-slate-500" />
                      {selectedLead.source}
                    </div>
                  )}
                </div>

                {selectedLead.description && (
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Description</label>
                    <p className="text-slate-300 bg-slate-800/50 p-3 rounded-lg">{selectedLead.description}</p>
                  </div>
                )}

                {/* Follow-up Date */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Next Follow-up</label>
                  <div className="flex gap-2">
                    <Input
                      type="datetime-local"
                      className="bg-slate-800 border-slate-700 flex-1"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                    />
                    <Button
                      className="bg-[#73e28a] text-black hover:bg-[#5dbb72]"
                      onClick={handleSaveFollowUp}
                    >
                      Save
                    </Button>
                  </div>
                  {selectedLead.next_follow_up && (
                    <p className="text-xs text-slate-500 mt-1">
                      Current: {new Date(selectedLead.next_follow_up).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Notes</label>
                  <Textarea 
                    className="bg-slate-800 border-slate-700"
                    value={selectedLead.notes || ''}
                    onChange={(e) => {
                      setSelectedLead({...selectedLead, notes: e.target.value});
                    }}
                    onBlur={() => updateLeadMutation.mutate({ id: selectedLead.id, data: { notes: selectedLead.notes }})}
                    placeholder="Add notes..."
                  />
                </div>

                {/* Create Project Button */}
                <Button 
                  className="w-full bg-[#73e28a] text-black hover:bg-[#5dbb72]"
                  onClick={handleConvertToProject}
                >
                  <ArrowRight className="w-4 h-4 mr-2" /> Convert to Project
                </Button>
                </TabsContent>

                <TabsContent value="communication" className="space-y-6 mt-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-3 block">Communication Timeline</label>
                    <CommunicationTimeline activities={leadActivities} emails={leadEmails} />
                  </div>

                {/* Quick Activity Log */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Activity</label>
                  <div className="flex gap-2 mb-3">
                    <Select value={newActivity.type} onValueChange={(v) => setNewActivity({...newActivity, type: v})}>
                      <SelectTrigger className="w-32 bg-slate-800 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Call">Call</SelectItem>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="Note">Note</SelectItem>
                        <SelectItem value="Task">Task</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      className="flex-1 bg-slate-800 border-slate-700" 
                      placeholder="Add activity..."
                      value={newActivity.description}
                      onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                    />
                    <Button 
                      className="bg-[#73e28a] text-black hover:bg-[#5dbb72]"
                      onClick={() => {
                        if (newActivity.description) {
                          createActivityMutation.mutate({ ...newActivity, lead_id: selectedLead.id });
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-6 mt-4">
                  {/* Lead Assignment */}
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Assigned To</label>
                    <Input
                      className="bg-slate-800 border-slate-700"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      placeholder="Team member name..."
                    />
                  </div>

                  {/* Lead Score */}
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">
                      Lead Score / Probability: {leadScore}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={leadScore}
                      onChange={(e) => setLeadScore(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#73e28a]"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Cold</span>
                      <span>Warm</span>
                      <span>Hot</span>
                    </div>
                  </div>

                  {/* Marketing Tags */}
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Marketing Tags</label>
                    <Input
                      className="bg-slate-800 border-slate-700"
                      value={marketingTags}
                      onChange={(e) => setMarketingTags(e.target.value)}
                      placeholder="e.g. campaign_spring_2024, webinar_attendee"
                    />
                    <p className="text-xs text-slate-500 mt-1">Comma-separated tags</p>
                  </div>

                  {selectedLead.marketing_tags && selectedLead.marketing_tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedLead.marketing_tags.map((tag, i) => (
                        <Badge key={i} className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Button
                    className="w-full bg-[#73e28a] text-black hover:bg-[#5dbb72]"
                    onClick={handleSaveLeadDetails}
                  >
                    Save Details
                  </Button>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Composer Dialog */}
      <Dialog open={isEmailComposerOpen} onOpenChange={setIsEmailComposerOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Send Email to {selectedLead?.name}</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <EmailComposer
              lead={selectedLead}
              onClose={() => setIsEmailComposerOpen(false)}
              onEmailSent={handleEmailSent}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}