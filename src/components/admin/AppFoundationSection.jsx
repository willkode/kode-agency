import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '@/components/ui-custom/Card';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Search, ExternalLink, Mail, Calendar, DollarSign, Trash2, CheckCircle, Copy, Layers, Target, Send, Loader2, BellOff } from 'lucide-react';
import moment from 'moment';

const statusColors = {
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusLabels = {
  pending: 'Unpaid',
  completed: 'Paid',
  failed: 'Cancelled',
};

export default function AppFoundationSection({ readIds = [], onMarkRead, onMarkUnread, onMarkAllRead }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['appFoundationRequests'],
    queryFn: () => base44.entities.AppFoundationRequest.list('-created_date'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.AppFoundationRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appFoundationRequests'] });
      setDeleteConfirm(null);
      setSelectedRequest(null);
    },
  });

  const markCompleteMutation = useMutation({
    mutationFn: (id) => base44.entities.AppFoundationRequest.update(id, { payment_status: 'completed' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appFoundationRequests'] });
      setSelectedRequest(prev => prev ? { ...prev, payment_status: 'completed' } : null);
    },
  });

  const sendPaymentLinkMutation = useMutation({
    mutationFn: async (request) => {
      const amount = request.total_amount || request.payment_amount || 250;
      return base44.functions.invoke('sendPaymentLinkEmail', {
        requestId: request.id,
        service: 'AppFoundation',
        email: request.email,
        name: request.name,
        amount,
        description: 'App Foundation'
      });
    },
    onSuccess: () => {
      alert('Payment link sent successfully!');
    },
    onError: (error) => {
      alert('Failed to send payment link: ' + error.message);
    }
  });

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.app_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search by name, email, or app name..."
            className="pl-10 bg-slate-800 border-slate-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'completed', 'failed'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={statusFilter === status 
                ? 'bg-[#73e28a] text-black hover:bg-[#5dbb72]' 
                : 'border-slate-700 text-slate-400 hover:text-white'}
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

      {/* Requests Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <Card key={i} className="p-6 bg-slate-900/50 border-slate-800 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-slate-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-2/3"></div>
            </Card>
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card className="p-12 text-center bg-slate-900/50 border-slate-800">
          <p className="text-slate-400">No app foundation requests found.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((request) => (
            <Card 
              key={request.id} 
              className={`p-6 border hover:border-[#73e28a]/50 cursor-pointer transition-colors ${readIds.includes(request.id) ? 'bg-slate-900/30 border-slate-800/50' : 'bg-slate-900/50 border-slate-800'}`}
              onClick={() => setSelectedRequest(request)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-white text-lg">{request.name}</h3>
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
                  <Badge className={`${statusColors[request.payment_status || 'pending']} border`}>
                    {statusLabels[request.payment_status || 'pending']}
                  </Badge>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-2">{request.email}</p>
              <div className="flex items-center gap-2 text-[#73e28a] text-sm mb-3">
                <Layers className="w-4 h-4" />
                <span className="truncate">{request.app_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">${request.total_amount || request.payment_amount || 500}</span>
                <span className="text-slate-400 text-xs">
                  {moment(request.created_date).format('MMM D, YYYY')}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold">{selectedRequest.name}</DialogTitle>
                  <Badge className={`${statusColors[selectedRequest.payment_status || 'pending']} border text-sm px-3 py-1`}>
                    {statusLabels[selectedRequest.payment_status || 'pending']}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                    <Mail className="w-5 h-5 text-[#73e28a]" />
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <button 
                        onClick={() => copyEmail(selectedRequest.email)}
                        className="text-white hover:text-[#73e28a] flex items-center gap-2"
                      >
                        {selectedRequest.email}
                        {copiedEmail ? <CheckCircle className="w-3 h-3 text-[#73e28a]" /> : <Copy className="w-3 h-3 text-slate-500" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#73e28a]" />
                    <div>
                      <p className="text-xs text-slate-500">Submitted</p>
                      <p className="text-white">{moment(selectedRequest.created_date).format('MMM D, YYYY h:mm A')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg col-span-2">
                    <DollarSign className="w-5 h-5 text-[#73e28a]" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500">Payment</p>
                      <div className="flex items-center gap-3">
                        <p className={`font-bold ${selectedRequest.payment_status === 'completed' ? 'text-green-400' : selectedRequest.payment_status === 'failed' ? 'text-red-400' : 'text-amber-400'}`}>
                          {statusLabels[selectedRequest.payment_status || 'pending']} - ${selectedRequest.total_amount || selectedRequest.payment_amount || 500}
                        </p>
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
                    </div>
                  </div>
                </div>

                {/* App Details */}
                <div className="p-4 bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-4 h-4 text-[#73e28a]" />
                    <p className="text-xs text-slate-500">App Name</p>
                  </div>
                  <p className="text-white font-bold text-lg">{selectedRequest.app_name}</p>
                </div>

                <div className="p-4 bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2">App Description</p>
                  <p className="text-slate-300 whitespace-pre-wrap">{selectedRequest.app_description}</p>
                </div>

                {selectedRequest.target_users && (
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-xs text-slate-500 mb-2">Target Users</p>
                    <p className="text-slate-300">{selectedRequest.target_users}</p>
                  </div>
                )}

                <div className="p-4 bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-[#73e28a]" />
                    <p className="text-xs text-slate-500">Core Features</p>
                  </div>
                  <p className="text-slate-300 whitespace-pre-wrap">{selectedRequest.core_features}</p>
                </div>

                {selectedRequest.integrations && (
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-xs text-slate-500 mb-2">Integrations</p>
                    <p className="text-slate-300">{selectedRequest.integrations}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Platform</p>
                    <p className="text-white">{selectedRequest.preferred_platform}</p>
                  </div>
                  {selectedRequest.deadline && (
                    <div className="p-3 bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Deadline</p>
                      <p className="text-white">{moment(selectedRequest.deadline).format('MMM D, YYYY')}</p>
                    </div>
                  )}
                </div>

                {selectedRequest.addons?.length > 0 && (
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-xs text-slate-500 mb-2">Add-ons</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.addons.map((addon, idx) => (
                        <Badge key={idx} variant="outline" className="border-[#73e28a]/30 text-[#73e28a]">
                          {addon}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 flex-wrap">
                  {readIds.includes(selectedRequest.id) ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-400 hover:text-white"
                      onClick={() => onMarkUnread && onMarkUnread(selectedRequest.id)}
                    >
                      <BellOff className="w-4 h-4 mr-2" /> Mark as Unread
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-400 hover:text-white"
                      onClick={() => onMarkRead && onMarkRead(selectedRequest.id)}
                    >
                      <BellOff className="w-4 h-4 mr-2" /> Mark as Read
                    </Button>
                  )}
                  {selectedRequest.payment_status !== 'completed' && (
                    <Button 
                      variant="outline" 
                      className="border-[#73e28a]/50 text-[#73e28a] hover:bg-[#73e28a]/20"
                      onClick={() => markCompleteMutation.mutate(selectedRequest.id)}
                      disabled={markCompleteMutation.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> 
                      {markCompleteMutation.isPending ? 'Marking...' : 'Mark Complete'}
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                    onClick={() => setDeleteConfirm(selectedRequest)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete App Foundation Request</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete the request from <strong className="text-white">{deleteConfirm?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => deleteMutation.mutate(deleteConfirm?.id)}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}