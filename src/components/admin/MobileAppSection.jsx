import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, ExternalLink, Trash2, CheckCircle, Mail, Smartphone, Calendar, Building, Send, Loader2, DollarSign, BellOff } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const statusLabels = {
  pending: 'Pending Payment',
  completed: 'Paid',
  failed: 'Payment Failed'
};

export default function MobileAppSection({ readIds = [], onMarkRead, onMarkUnread, onMarkAllRead }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['mobileAppRequests'],
    queryFn: () => base44.entities.MobileAppConversionRequest.list('-created_date'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.MobileAppConversionRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mobileAppRequests'] });
      setDeleteConfirm(null);
      setSelectedRequest(null);
    }
  });

  const sendPaymentLinkMutation = useMutation({
    mutationFn: async (request) => {
      const amount = request.payment_amount || 750;
      return base44.functions.invoke('sendPaymentLinkEmail', {
        requestId: request.id,
        service: 'MobileAppConversion',
        email: request.email,
        name: request.name,
        amount,
        description: 'Mobile App Conversion'
      });
    },
    onSuccess: () => {
      alert('Payment link sent successfully!');
    },
    onError: (error) => {
      alert('Failed to send payment link: ' + error.message);
    }
  });

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.web_app_url?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || req.payment_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Mobile App Conversion Requests</h1>
          <p className="text-slate-400 text-sm mt-1">Manage mobile app conversion requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search by name, email, company, or URL..."
            className="pl-10 bg-slate-800 border-slate-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'completed', 'failed'].map(status => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? 'bg-[#73e28a] text-black hover:bg-[#5dbb72]' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}
            >
              {status === 'all' ? 'All' : statusLabels[status]}
            </Button>
          ))}
          {requests.some(r => !readIds.includes(r.id)) && (
            <Button
              size="sm"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:text-white"
              onClick={() => onMarkAllRead && onMarkAllRead(requests.map(r => r.id))}
            >
              <BellOff className="w-4 h-4 mr-1" /> Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-800/50 border-slate-700">
          <p className="text-slate-400 text-sm">Total Requests</p>
          <p className="text-2xl font-bold text-white">{requests.length}</p>
        </Card>
        <Card className="p-4 bg-slate-800/50 border-slate-700">
          <p className="text-slate-400 text-sm">Paid</p>
          <p className="text-2xl font-bold text-green-400">{requests.filter(r => r.payment_status === 'completed').length}</p>
        </Card>
        <Card className="p-4 bg-slate-800/50 border-slate-700">
          <p className="text-slate-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">{requests.filter(r => r.payment_status === 'pending').length}</p>
        </Card>
        <Card className="p-4 bg-slate-800/50 border-slate-700">
          <p className="text-slate-400 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-[#73e28a]">
            ${requests.filter(r => r.payment_status === 'completed').reduce((sum, r) => sum + (r.payment_amount || 750), 0).toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Requests Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400">Loading...</div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12 text-slate-400">No requests found</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map(request => (
            <Card 
              key={request.id} 
              className={`p-4 border hover:border-slate-600 cursor-pointer transition-colors ${readIds.includes(request.id) ? 'bg-slate-800/30 border-slate-700/50' : 'bg-slate-800/50 border-slate-700'}`}
              onClick={() => setSelectedRequest(request)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-[#73e28a]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{request.name}</h3>
                    <p className="text-slate-400 text-sm">{request.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!readIds.includes(request.id) && (
                    <button
                      className="text-slate-500 hover:text-slate-300 p-1 rounded"
                      onClick={(e) => { e.stopPropagation(); onMarkRead && onMarkRead(request.id); }}
                      title="Mark as read"
                    >
                      <BellOff className="w-4 h-4" />
                    </button>
                  )}
                  <Badge className={statusColors[request.payment_status || 'pending']}>
                    {statusLabels[request.payment_status || 'pending']}
                  </Badge>
                </div>
              </div>
              
              {request.company && (
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Building className="w-4 h-4" />
                  {request.company}
                </div>
              )}
              
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2 truncate">
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{request.web_app_url}</span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-3">
                <Calendar className="w-3 h-3" />
                {new Date(request.created_date).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Mobile App Conversion Request</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={statusColors[selectedRequest.payment_status || 'pending']}>
                    {statusLabels[selectedRequest.payment_status || 'pending']}
                  </Badge>
                  {(selectedRequest.payment_status === 'pending' || !selectedRequest.payment_status) && (
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs"
                      onClick={() => sendPaymentLinkMutation.mutate(selectedRequest)}
                      disabled={sendPaymentLinkMutation.isPending}
                    >
                      {sendPaymentLinkMutation.isPending ? (
                        <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Sending...</>
                      ) : (
                        <><Send className="w-3 h-3 mr-1" /> Send Payment Link</>
                      )}
                    </Button>
                  )}
                </div>
                <span className="text-[#73e28a] font-bold text-xl">${selectedRequest.payment_amount || 750}</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-500 text-sm">Name</p>
                  <p className="text-white">{selectedRequest.name}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Email</p>
                  <p className="text-white">{selectedRequest.email}</p>
                </div>
                {selectedRequest.company && (
                  <div className="md:col-span-2">
                    <p className="text-slate-500 text-sm">Company</p>
                    <p className="text-white">{selectedRequest.company}</p>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-slate-500 text-sm mb-1">Web App URL</p>
                <a 
                  href={selectedRequest.web_app_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#73e28a] hover:underline flex items-center gap-2"
                >
                  {selectedRequest.web_app_url}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              
              <div>
                <p className="text-slate-500 text-sm mb-1">Description</p>
                <p className="text-slate-300">{selectedRequest.description}</p>
              </div>
              
              {selectedRequest.has_auth && (
                <div>
                  <p className="text-slate-500 text-sm mb-1">Authentication</p>
                  <p className="text-slate-300">{selectedRequest.has_auth}</p>
                </div>
              )}
              
              {selectedRequest.platforms_needed?.length > 0 && (
                <div>
                  <p className="text-slate-500 text-sm mb-2">Platforms Needed</p>
                  <div className="flex gap-2">
                    {selectedRequest.platforms_needed.map((platform, idx) => (
                      <Badge key={idx} variant="outline" className="border-slate-600 text-slate-300">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedRequest.add_ons?.length > 0 && (
                <div>
                  <p className="text-slate-500 text-sm mb-2">Requested Add-Ons</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.add_ons.map((addon, idx) => (
                      <Badge key={idx} variant="outline" className="border-[#73e28a]/30 text-[#73e28a]">
                        {addon}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedRequest.questions && (
                <div>
                  <p className="text-slate-500 text-sm mb-1">Questions / Special Requirements</p>
                  <p className="text-slate-300">{selectedRequest.questions}</p>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Calendar className="w-4 h-4" />
                Submitted on {new Date(selectedRequest.created_date).toLocaleString()}
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <Button 
                  variant="outline" 
                  className="border-slate-700 text-black bg-slate-200 hover:bg-slate-300"
                  onClick={() => window.open(`mailto:${selectedRequest.email}`, '_blank')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Client
                </Button>
                <Button 
                  variant="outline" 
                  className="border-slate-700 text-black bg-slate-200 hover:bg-slate-300"
                  onClick={() => window.open(selectedRequest.web_app_url, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open App
                </Button>
                <Button 
                  variant="outline" 
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 ml-auto"
                  onClick={() => setDeleteConfirm(selectedRequest)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Request?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently delete the request from {deleteConfirm?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteMutation.mutate(deleteConfirm?.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}