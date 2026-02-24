import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, ExternalLink, Eye, Github } from 'lucide-react';
import Card from '@/components/ui-custom/Card';

const statusColors = {
  New: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Reviewed: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Quoted: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Won: 'bg-[#73e28a]/20 text-[#73e28a] border-[#73e28a]/30',
  Lost: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const complexityColors = {
  Low: 'bg-[#73e28a]/20 text-[#73e28a] border-[#73e28a]/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  High: 'bg-red-500/20 text-red-400 border-red-500/30'
};

export default function MigrationQuotesSection() {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedScan, setSelectedScan] = useState(null);
  const [loadingScan, setLoadingScan] = useState(false);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['migration-quote-requests'],
    queryFn: () => base44.entities.MigrationQuoteRequest.list('-created_date')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.MigrationQuoteRequest.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['migration-quote-requests'] })
  });

  const handleViewScan = async (scanId) => {
    if (!scanId) return;
    setLoadingScan(true);
    const scans = await base44.entities.FrontendExporterScan.filter({ id: scanId });
    setSelectedScan(scans?.[0] || null);
    setLoadingScan(false);
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Migration Quote Requests</h2>
        <Badge variant="outline" className="border-slate-700 text-slate-300">{requests.length} total</Badge>
      </div>

      {requests.length === 0 ? (
        <Card className="p-8 bg-slate-900/80 border-slate-800 text-center">
          <p className="text-slate-500">No migration quote requests yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <Card key={req.id} className="p-4 bg-slate-900/80 border-slate-800">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-medium">{req.name}</p>
                    <Badge className={statusColors[req.status]}>{req.status}</Badge>
                    {req.complexity && <Badge className={complexityColors[req.complexity]}>Complexity: {req.complexity}</Badge>}
                    {req.can_migrate && <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">Migratable: {req.can_migrate}</Badge>}
                  </div>
                  <p className="text-slate-400 text-sm">{req.email}</p>
                  {req.github_url && (
                    <a href={req.github_url} target="_blank" rel="noopener noreferrer"
                      className="text-slate-500 text-xs flex items-center gap-1 mt-1 hover:text-[#73e28a] transition-colors">
                      <Github className="w-3 h-3" />{req.github_url}
                    </a>
                  )}
                  {req.message && (
                    <p className="text-slate-400 text-sm mt-2 italic">"{req.message}"</p>
                  )}
                  <p className="text-slate-600 text-xs mt-1">{new Date(req.created_date).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {req.scan_id && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:text-white h-8 text-xs"
                      onClick={() => { setSelectedRequest(req); handleViewScan(req.scan_id); }}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View Scan
                    </Button>
                  )}
                  <Select
                    value={req.status}
                    onValueChange={(val) => updateMutation.mutate({ id: req.id, data: { status: val } })}
                  >
                    <SelectTrigger className="h-8 text-xs border-slate-700 bg-slate-800 text-slate-300 w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {['New', 'Reviewed', 'Quoted', 'Won', 'Lost'].map(s => (
                        <SelectItem key={s} value={s} className="text-slate-300">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Scan Report Dialog */}
      <Dialog open={!!(selectedRequest && (selectedScan || loadingScan))} onOpenChange={(open) => { if (!open) { setSelectedRequest(null); setSelectedScan(null); } }}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              Scan Report — {selectedRequest?.name}
            </DialogTitle>
          </DialogHeader>
          {loadingScan ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
          ) : selectedScan ? (
            <div className="space-y-4 mt-2">
              <div className="flex gap-2 flex-wrap">
                {selectedScan.can_migrate && <Badge className="bg-[#73e28a]/20 text-[#73e28a] border-[#73e28a]/30">Migratable: {selectedScan.can_migrate}</Badge>}
                {selectedScan.complexity && <Badge className={complexityColors[selectedScan.complexity]}>Complexity: {selectedScan.complexity}</Badge>}
                <Badge variant="outline" className="border-slate-700 text-slate-400">{selectedScan.status}</Badge>
              </div>
              {selectedScan.executive_summary && (
                <div>
                  <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">Executive Summary</p>
                  <p className="text-slate-300 text-sm whitespace-pre-wrap">{selectedScan.executive_summary}</p>
                </div>
              )}
              {selectedScan.report && (
                <div>
                  <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">Full Report</p>
                  <pre className="text-slate-400 text-xs whitespace-pre-wrap bg-slate-800 p-4 rounded-lg max-h-96 overflow-y-auto">{selectedScan.report}</pre>
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-500 text-sm py-4">No scan data found.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}