import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '@/components/ui-custom/Card';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Users, FileText, ExternalLink, Mail, Phone, MapPin, 
  DollarSign, Calendar, Download, Search
} from 'lucide-react';
import { Input } from "@/components/ui/input";

const statusColors = {
  'New': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Reviewed': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Contacted': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Hired': 'bg-[#73e28a]/20 text-[#73e28a] border-[#73e28a]/30',
  'Rejected': 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function CareersSection() {
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['subcontractor-applications'],
    queryFn: () => base44.entities.SubcontractorApplication.list('-created_date'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.SubcontractorApplication.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcontractor-applications'] });
    }
  });

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || (app.status || 'New') === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['New', 'Reviewed', 'Contacted', 'Hired', 'Rejected'].map(status => (
          <Card key={status} className="p-4 bg-slate-900/80 border-slate-800 text-center">
            <div className="text-2xl font-bold text-white">
              {applications.filter(a => (a.status || 'New') === status).length}
            </div>
            <div className="text-sm text-slate-400">{status}</div>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="Search applicants..." 
            className="pl-9 bg-slate-800 border-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.keys(statusColors).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="text-slate-400">Loading...</div>
        ) : filteredApps.length === 0 ? (
          <Card className="p-6 bg-slate-900/80 border-slate-800 text-center col-span-full">
            <p className="text-slate-400">No applications found</p>
          </Card>
        ) : (
          filteredApps.map(app => (
            <Card 
              key={app.id} 
              className="p-4 bg-slate-900/80 border-slate-800 cursor-pointer hover:border-[#73e28a]/50"
              onClick={() => setSelectedApp(app)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white">{app.full_name}</h3>
                <Badge className={statusColors[app.status || 'New']}>
                  {app.status || 'New'}
                </Badge>
              </div>
              <p className="text-sm text-slate-400 truncate">{app.email}</p>
              {app.skills && app.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {app.skills.slice(0, 3).map((skill, i) => (
                    <Badge key={i} variant="outline" className="border-slate-700 text-slate-400 text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {app.skills.length > 3 && (
                    <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">
                      +{app.skills.length - 3}
                    </Badge>
                  )}
                </div>
              )}
              <p className="text-xs text-slate-500 mt-2">
                {new Date(app.created_date).toLocaleDateString()}
              </p>
            </Card>
          ))
        )}
      </div>

      {/* Application Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedApp && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-white text-2xl">{selectedApp.full_name}</DialogTitle>
                    <p className="text-slate-400">{selectedApp.email}</p>
                  </div>
                  <Select 
                    value={selectedApp.status || 'New'} 
                    onValueChange={(value) => {
                      updateMutation.mutate({ id: selectedApp.id, status: value });
                      setSelectedApp({ ...selectedApp, status: value });
                    }}
                  >
                    <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Reviewed">Reviewed</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Hired">Hired</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedApp.phone && (
                    <div className="flex items-center gap-3 text-slate-300">
                      <Phone className="w-4 h-4 text-slate-500" />
                      {selectedApp.phone}
                    </div>
                  )}
                  {selectedApp.location && (
                    <div className="flex items-center gap-3 text-slate-300">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      {selectedApp.location}
                    </div>
                  )}
                  {(selectedApp.rate_type || selectedApp.hourly_rate) && (
                    <div className="flex items-center gap-3 text-slate-300">
                      <DollarSign className="w-4 h-4 text-slate-500" />
                      {selectedApp.rate_type}{selectedApp.hourly_rate && ` - ${selectedApp.hourly_rate}`}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-slate-300">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    Applied {new Date(selectedApp.created_date).toLocaleDateString()}
                  </div>
                </div>

                {selectedApp.skills && selectedApp.skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.skills.map((skill, i) => (
                        <Badge key={i} variant="outline" className="border-slate-700 text-slate-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {selectedApp.portfolio_url && (
                    <a href={selectedApp.portfolio_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white">
                        <ExternalLink className="w-4 h-4 mr-2" /> Portfolio
                      </Button>
                    </a>
                  )}
                  {selectedApp.linkedin_url && (
                    <a href={selectedApp.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white">
                        <ExternalLink className="w-4 h-4 mr-2" /> LinkedIn
                      </Button>
                    </a>
                  )}
                  {selectedApp.resume_url && (
                    <a href={selectedApp.resume_url} target="_blank" rel="noopener noreferrer" download>
                      <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white">
                        <Download className="w-4 h-4 mr-2" /> Download Resume
                      </Button>
                    </a>
                  )}
                </div>

                {selectedApp.message && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Message</h4>
                    <p className="text-slate-300 bg-slate-800/50 p-4 rounded-lg">{selectedApp.message}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-slate-800">
                  <a href={`mailto:${selectedApp.email}`}>
                    <Button className="bg-[#73e28a] text-black hover:bg-[#5dbb72]">
                      <Mail className="w-4 h-4 mr-2" /> Send Email
                    </Button>
                  </a>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}