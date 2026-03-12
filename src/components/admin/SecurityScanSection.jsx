import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, ExternalLink, Mail, Phone, Globe, CheckCircle, Clock, XCircle, Eye, EyeOff, DollarSign, Calendar } from 'lucide-react';

export default function SecurityScanSection({ readIds = [], onMarkRead, onMarkUnread, onMarkAllRead }) {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['securityCheckRequests'],
    queryFn: () => base44.entities.SecurityCheckRequest.list('-created_date'),
    refetchInterval: 30000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SecurityCheckRequest.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['securityCheckRequests'] });
      setDetailsOpen(false);
    }
  });

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
    if (!readIds.includes(request.id)) {
      onMarkRead(request.id);
    }
  };

  const handleMarkAllRead = () => {
    const allIds = requests.map(r => r.id);
    onMarkAllRead(allIds);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30', label: 'Pending' },
      completed: { color: 'bg-green-500/10 text-green-500 border-green-500/30', label: 'Completed' },
      failed: { color: 'bg-red-500/10 text-red-500 border-red-500/30', label: 'Failed' },
    };
    const variant = variants[status] || variants.pending;
    return <Badge className={`${variant.color} border`}>{variant.label}</Badge>;
  };

  const unreadCount = requests.filter(r => !readIds.includes(r.id)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Security Scan Requests</h2>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white">{unreadCount} new</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="border-slate-700 text-slate-400 hover:text-white"
          >
            Mark All Read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900/50 border-slate-800">
          <div className="text-slate-400 text-sm mb-1">Total Requests</div>
          <div className="text-2xl font-bold text-white">{requests.length}</div>
        </Card>
        <Card className="p-4 bg-slate-900/50 border-slate-800">
          <div className="text-slate-400 text-sm mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-500">
            {requests.filter(r => r.payment_status === 'pending').length}
          </div>
        </Card>
        <Card className="p-4 bg-slate-900/50 border-slate-800">
          <div className="text-slate-400 text-sm mb-1">Completed</div>
          <div className="text-2xl font-bold text-green-500">
            {requests.filter(r => r.payment_status === 'completed').length}
          </div>
        </Card>
        <Card className="p-4 bg-slate-900/50 border-slate-800">
          <div className="text-slate-400 text-sm mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-[#73e28a]">
            ${requests.filter(r => r.payment_status === 'completed').reduce((sum, r) => sum + (r.payment_amount || 0), 0)}
          </div>
        </Card>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {isLoading ? (
          <Card className="p-8 bg-slate-900/50 border-slate-800 text-center">
            <p className="text-slate-400">Loading requests...</p>
          </Card>
        ) : requests.length === 0 ? (
          <Card className="p-8 bg-slate-900/50 border-slate-800 text-center">
            <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No security scan requests yet</p>
          </Card>
        ) : (
          requests.map((request) => {
            const isUnread = !readIds.includes(request.id);
            return (
              <Card
                key={request.id}
                className={`p-4 transition-all cursor-pointer ${
                  isUnread
                    ? 'bg-slate-900/80 border-[#73e28a]/30 hover:border-[#73e28a]/50'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
                onClick={() => handleViewDetails(request)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white truncate">{request.name}</h3>
                      {getStatusBadge(request.payment_status)}
                      {isUnread && (
                        <Badge className="bg-[#73e28a] text-black">NEW</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{request.email}</span>
                      </div>
                      {request.phone && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Phone className="w-4 h-4" />
                          <span>{request.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-slate-400">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">${request.payment_amount || 50}</span>
                      </div>
                    </div>
                    {request.app_url && (
                      <div className="flex items-center gap-2 text-slate-400 text-sm mt-2">
                        <Globe className="w-4 h-4" />
                        <a
                          href={request.app_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#73e28a] hover:underline truncate"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {request.app_url}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isUnread) {
                          onMarkRead(request.id);
                        } else {
                          onMarkUnread(request.id);
                        }
                      }}
                      className="text-slate-400 hover:text-white"
                    >
                      {isUnread ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(request.created_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Security Scan Request Details</DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6 mt-4">
              {/* Status Update */}
              <div className="space-y-2">
                <Label className="text-slate-400">Payment Status</Label>
                <Select
                  value={selectedRequest.payment_status}
                  onValueChange={(value) =>
                    updateMutation.mutate({
                      id: selectedRequest.id,
                      data: { payment_status: value }
                    })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-400">Name</Label>
                  <div className="text-white font-medium">{selectedRequest.name}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Country</Label>
                  <div className="text-white font-medium">{selectedRequest.country || 'N/A'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-400">Email</Label>
                  <div className="text-white font-medium">{selectedRequest.email}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Phone</Label>
                  <div className="text-white font-medium">{selectedRequest.phone || 'N/A'}</div>
                </div>
              </div>

              {/* App Info */}
              <div className="space-y-2">
                <Label className="text-slate-400">Base44 App URL</Label>
                <a
                  href={selectedRequest.app_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#73e28a] hover:underline"
                >
                  {selectedRequest.app_url}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-slate-400">Focus Areas / Description</Label>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-white whitespace-pre-wrap">
                  {selectedRequest.description}
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-400">Payment Amount</Label>
                  <div className="text-2xl font-bold text-[#73e28a]">
                    ${selectedRequest.payment_amount || 50}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Admin Invite Sent</Label>
                  <div className="text-white font-medium">
                    {selectedRequest.admin_invite_sent ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-slate-500">Created</div>
                  <div className="text-white">{new Date(selectedRequest.created_date).toLocaleString()}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-500">Last Updated</div>
                  <div className="text-white">{new Date(selectedRequest.updated_date).toLocaleString()}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setDetailsOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}