import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Section from '@/components/ui-custom/Section';
import GridBackground from '@/components/ui-custom/GridBackground';
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  FileSearch, Calendar, ExternalLink, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

const statusConfig = {
  'pending': { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
  'completed': { label: 'Completed', color: 'bg-[#73e28a]/20 text-[#73e28a] border-[#73e28a]/30', icon: CheckCircle },
  'failed': { label: 'Failed', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: AlertCircle },
};

export default function ClientAppReviewsPage() {
  const [selectedRequest, setSelectedRequest] = React.useState(null);

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['client-app-reviews', user?.email],
    queryFn: () => base44.entities.AppReviewRequest.filter({ email: user?.email }, '-created_date'),
    enabled: !!user?.email
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white pt-24 flex items-center justify-center">
        <p className="text-slate-400">Loading your app reviews...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24">
      <Section className="py-8">
        <GridBackground />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">My App Reviews</h1>
            <p className="text-slate-400">View your submitted app review requests</p>
          </div>

          {/* Requests List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <FileSearch className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No app review requests found.</p>
              </div>
            ) : (
              requests.map(request => {
                const status = statusConfig[request.payment_status] || statusConfig['pending'];
                const StatusIcon = status.icon;
                return (
                  <div
                    key={request.id}
                    onClick={() => setSelectedRequest(request)}
                    className="bg-slate-900/80 border border-slate-800 rounded-lg p-6 cursor-pointer hover:border-[#73e28a]/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                        <FileSearch className="w-6 h-6 text-[#73e28a]" />
                      </div>
                      <Badge className={status.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 truncate">{request.app_url}</h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{request.issue_description}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(request.created_date), 'MMM d, yyyy')}
                      </span>
                      {request.include_fix && (
                        <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">
                          + Fix Included
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Section>

      {/* Request Detail Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">App Review Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Status</span>
                  <Badge className={statusConfig[selectedRequest.payment_status]?.color || statusConfig['pending'].color}>
                    {statusConfig[selectedRequest.payment_status]?.label || 'Pending'}
                  </Badge>
                </div>

                {/* App URL */}
                <div className="space-y-1">
                  <span className="text-slate-500 text-xs uppercase">App URL</span>
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

                {/* Issue Description */}
                <div className="space-y-1">
                  <span className="text-slate-500 text-xs uppercase">Issue Description</span>
                  <p className="text-slate-300 bg-slate-800/50 rounded-lg p-3 whitespace-pre-wrap">
                    {selectedRequest.issue_description}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-slate-500 text-xs uppercase">Submitted</span>
                    <p className="text-white">{format(new Date(selectedRequest.created_date), 'MMMM d, yyyy')}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 text-xs uppercase">Include Fix</span>
                    <p className="text-white">{selectedRequest.include_fix ? 'Yes' : 'No'}</p>
                  </div>
                  {selectedRequest.country && (
                    <div className="space-y-1">
                      <span className="text-slate-500 text-xs uppercase">Country</span>
                      <p className="text-white">{selectedRequest.country}</p>
                    </div>
                  )}
                  {selectedRequest.payment_amount && (
                    <div className="space-y-1">
                      <span className="text-slate-500 text-xs uppercase">Amount Paid</span>
                      <p className="text-white">${selectedRequest.payment_amount}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}