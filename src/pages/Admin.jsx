import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import GridBackground from '@/components/ui-custom/GridBackground';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, FileText, ExternalLink, Mail, Phone, MapPin, DollarSign, Calendar, Download } from 'lucide-react';

export default function AdminPage() {
  const [selectedApp, setSelectedApp] = useState(null);
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ['subcontractor-applications'],
    queryFn: () => base44.entities.SubcontractorApplication.list('-created_date'),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.SubcontractorApplication.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcontractor-applications'] });
    }
  });

  const statusColors = {
    'New': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Reviewed': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Contacted': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Hired': 'bg-[#73e28a]/20 text-[#73e28a] border-[#73e28a]/30',
    'Rejected': 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24">
      <Section className="py-8">
        <GridBackground />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#73e28a]/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-[#73e28a]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400">Manage subcontractor applications</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {['New', 'Reviewed', 'Contacted', 'Hired', 'Rejected'].map(status => (
              <Card key={status} className="p-4 bg-slate-900/80 border-slate-800 text-center">
                <div className="text-2xl font-bold text-white">
                  {applications.filter(a => a.status === status).length}
                </div>
                <div className="text-sm text-slate-400">{status}</div>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Applications List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">Applications ({applications.length})</h2>
              
              {isLoading ? (
                <div className="text-slate-400">Loading...</div>
              ) : applications.length === 0 ? (
                <Card className="p-6 bg-slate-900/80 border-slate-800 text-center">
                  <p className="text-slate-400">No applications yet</p>
                </Card>
              ) : (
                applications.map(app => (
                  <Card 
                    key={app.id} 
                    className={`p-4 bg-slate-900/80 border-slate-800 cursor-pointer transition-all hover:border-[#73e28a]/50 ${selectedApp?.id === app.id ? 'border-[#73e28a]' : ''}`}
                    onClick={() => setSelectedApp(app)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white">{app.full_name}</h3>
                      <Badge className={statusColors[app.status || 'New']}>
                        {app.status || 'New'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 truncate">{app.email}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(app.created_date).toLocaleDateString()}
                    </p>
                  </Card>
                ))
              )}
            </div>

            {/* Application Detail */}
            <div className="lg:col-span-2">
              {selectedApp ? (
                <Card className="p-6 bg-slate-900/80 border-slate-800">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedApp.full_name}</h2>
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

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
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
                    <div className="mb-6">
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

                  <div className="flex flex-wrap gap-3 mb-6">
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

                  <div className="flex gap-3 mt-6 pt-6 border-t border-slate-800">
                    <a href={`mailto:${selectedApp.email}`}>
                      <Button className="bg-[#73e28a] text-black hover:bg-[#5dbb72]">
                        <Mail className="w-4 h-4 mr-2" /> Send Email
                      </Button>
                    </a>
                  </div>
                </Card>
              ) : (
                <Card className="p-12 bg-slate-900/80 border-slate-800 text-center">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Select an application to view details</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}