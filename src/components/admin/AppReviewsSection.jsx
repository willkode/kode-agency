import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
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
import { Search, ExternalLink, Mail, MapPin, Calendar, DollarSign } from 'lucide-react';
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

export default function AppReviewsSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['appReviewRequests'],
    queryFn: () => base44.entities.AppReviewRequest.list('-created_date'),
  });

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.app_url?.toLowerCase().includes(searchTerm.toLowerCase());
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
            placeholder="Search by name, email, or app URL..."
            className="pl-10 bg-slate-800 border-slate-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
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
          <p className="text-slate-400">No app review requests found.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((request) => (
            <Card 
              key={request.id} 
              className="p-6 bg-slate-900/50 border-slate-800 hover:border-[#73e28a]/50 cursor-pointer transition-colors"
              onClick={() => setSelectedRequest(request)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-white text-lg">{request.name}</h3>
                <Badge className={`${statusColors[request.payment_status || 'pending']} border`}>
                  {statusLabels[request.payment_status || 'pending']}
                </Badge>
              </div>
              <p className="text-slate-400 text-sm mb-2">{request.email}</p>
              <p className="text-slate-500 text-sm truncate mb-4">{request.app_url}</p>
              <p className="text-slate-400 text-xs">
                {moment(request.created_date).format('MMM D, YYYY h:mm A')}
              </p>
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
                      <a href={`mailto:${selectedRequest.email}`} className="text-white hover:text-[#73e28a]">
                        {selectedRequest.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                    <MapPin className="w-5 h-5 text-[#73e28a]" />
                    <div>
                      <p className="text-xs text-slate-500">Country</p>
                      <p className="text-white">{selectedRequest.country || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#73e28a]" />
                    <div>
                      <p className="text-xs text-slate-500">Submitted</p>
                      <p className="text-white">{moment(selectedRequest.created_date).format('MMM D, YYYY h:mm A')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                    <DollarSign className="w-5 h-5 text-[#73e28a]" />
                    <div>
                      <p className="text-xs text-slate-500">Payment</p>
                      <p className={`font-bold ${selectedRequest.payment_status === 'completed' ? 'text-green-400' : selectedRequest.payment_status === 'failed' ? 'text-red-400' : 'text-amber-400'}`}>
                        {statusLabels[selectedRequest.payment_status || 'pending']}
                      </p>
                    </div>
                  </div>
                </div>

                {/* App URL */}
                <div className="p-4 bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2">App URL</p>
                  <a 
                    href={selectedRequest.app_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#73e28a] hover:underline break-all"
                  >
                    {selectedRequest.app_url}
                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  </a>
                </div>

                {/* Issue Description */}
                <div className="p-4 bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2">Issue Description</p>
                  <p className="text-slate-300 whitespace-pre-wrap">{selectedRequest.issue_description}</p>
                </div>

                {/* Admin Invite Status */}
                <div className="p-4 bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2">Admin Invite</p>
                  <p className="text-slate-300">
                    {selectedRequest.admin_invite_sent 
                      ? '✅ User confirmed they sent the admin invite' 
                      : '⏳ Pending admin invite to iamwillkode@gmail.com'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-slate-700 text-slate-400 hover:text-white"
                    onClick={() => window.open(`mailto:${selectedRequest.email}`, '_blank')}
                  >
                    <Mail className="w-4 h-4 mr-2" /> Email Client
                  </Button>
                  <Button 
                    className="flex-1 bg-[#73e28a] hover:bg-[#5dbb72] text-black"
                    onClick={() => window.open(selectedRequest.app_url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" /> Open App
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}