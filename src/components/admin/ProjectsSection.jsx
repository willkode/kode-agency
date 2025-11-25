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
import { Progress } from "@/components/ui/progress";
import { 
  FolderKanban, Calendar, DollarSign, User, Building,
  Plus, Search, Clock, CheckCircle, Pause, XCircle, Edit, Trash2
} from 'lucide-react';

const statusColors = {
  'Planning': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'In Progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Review': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Completed': 'bg-[#73e28a]/20 text-[#73e28a] border-[#73e28a]/30',
  'On Hold': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const priorityColors = {
  'Low': 'bg-slate-500/20 text-slate-400',
  'Medium': 'bg-blue-500/20 text-blue-400',
  'High': 'bg-orange-500/20 text-orange-400',
  'Urgent': 'bg-red-500/20 text-red-400',
};

const statusIcons = {
  'Planning': Clock,
  'In Progress': FolderKanban,
  'Review': Edit,
  'Completed': CheckCircle,
  'On Hold': Pause,
  'Cancelled': XCircle,
};

export default function ProjectsSection({ initialProject, onProjectCreated }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(!!initialProject);
  const [newProject, setNewProject] = useState(initialProject || {
    title: '', client_name: '', client_email: '', client_company: '',
    platform: '', status: 'Planning', priority: 'Medium', budget: '',
    start_date: '', due_date: '', description: '', type: ''
  });

  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date'),
  });

  const createProjectMutation = useMutation({
    mutationFn: (data) => base44.entities.Project.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsAddDialogOpen(false);
      setNewProject({
        title: '', client_name: '', client_email: '', client_company: '',
        platform: '', status: 'Planning', priority: 'Medium', budget: '',
        start_date: '', due_date: '', description: '', type: ''
      });
      if (onProjectCreated) onProjectCreated();
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Project.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id) => base44.entities.Project.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setSelectedProject(null);
    }
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client_company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeProjects = projects.filter(p => ['Planning', 'In Progress', 'Review'].includes(p.status)).length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

  // Set initial project when passed from CRM
  React.useEffect(() => {
    if (initialProject) {
      setNewProject(initialProject);
      setIsAddDialogOpen(true);
    }
  }, [initialProject]);

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{projects.length}</div>
              <div className="text-xs text-slate-400">Total Projects</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{activeProjects}</div>
              <div className="text-xs text-slate-400">Active</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#73e28a]/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#73e28a]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{completedProjects}</div>
              <div className="text-xs text-slate-400">Completed</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">${totalBudget.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Total Budget</div>
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
              placeholder="Search projects..." 
              className="pl-9 bg-slate-800 border-slate-700 w-64"
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#73e28a] text-black hover:bg-[#5dbb72]">
              <Plus className="w-4 h-4 mr-2" /> New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input placeholder="Project Title *" className="bg-slate-800 border-slate-700" 
                value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Client Name" className="bg-slate-800 border-slate-700"
                  value={newProject.client_name} onChange={(e) => setNewProject({...newProject, client_name: e.target.value})} />
                <Input placeholder="Client Company" className="bg-slate-800 border-slate-700"
                  value={newProject.client_company} onChange={(e) => setNewProject({...newProject, client_company: e.target.value})} />
              </div>
              <Input placeholder="Client Email" className="bg-slate-800 border-slate-700"
                value={newProject.client_email} onChange={(e) => setNewProject({...newProject, client_email: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <Select value={newProject.platform} onValueChange={(v) => setNewProject({...newProject, platform: v})}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Base44">Base44</SelectItem>
                    <SelectItem value="Lovable">Lovable</SelectItem>
                    <SelectItem value="Replit">Replit</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={newProject.type} onValueChange={(v) => setNewProject({...newProject, type: v})}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Project Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Internal Tool">Internal Tool</SelectItem>
                    <SelectItem value="SaaS">SaaS</SelectItem>
                    <SelectItem value="Automation">Automation</SelectItem>
                    <SelectItem value="Mobile App">Mobile App</SelectItem>
                    <SelectItem value="Web App">Web App</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select value={newProject.priority} onValueChange={(v) => setNewProject({...newProject, priority: v})}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Budget ($)" type="number" className="bg-slate-800 border-slate-700"
                  value={newProject.budget} onChange={(e) => setNewProject({...newProject, budget: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Start Date</label>
                  <Input type="date" className="bg-slate-800 border-slate-700"
                    value={newProject.start_date} onChange={(e) => setNewProject({...newProject, start_date: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Due Date</label>
                  <Input type="date" className="bg-slate-800 border-slate-700"
                    value={newProject.due_date} onChange={(e) => setNewProject({...newProject, due_date: e.target.value})} />
                </div>
              </div>
              <Textarea placeholder="Description" className="bg-slate-800 border-slate-700"
                value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} />
              <Button className="w-full bg-[#73e28a] text-black hover:bg-[#5dbb72]"
                onClick={() => createProjectMutation.mutate({...newProject, budget: parseFloat(newProject.budget) || 0})}>
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map(project => {
          const StatusIcon = statusIcons[project.status] || FolderKanban;
          return (
            <Card 
              key={project.id} 
              className="p-5 bg-slate-900/80 border-slate-800 cursor-pointer hover:border-[#73e28a]/50"
              onClick={() => setSelectedProject(project)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                  <StatusIcon className="w-5 h-5 text-slate-400" />
                </div>
                <Badge className={statusColors[project.status || 'Planning']}>{project.status || 'Planning'}</Badge>
              </div>
              <h3 className="font-bold text-white mb-1 truncate">{project.title}</h3>
              {project.client_name && (
                <p className="text-sm text-slate-400 flex items-center gap-1 mb-3">
                  <User className="w-3 h-3" /> {project.client_name}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-slate-500">
                {project.due_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(project.due_date).toLocaleDateString()}
                  </span>
                )}
                {project.budget > 0 && (
                  <span className="text-[#73e28a]">${project.budget.toLocaleString()}</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Project Detail Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto [&>button]:text-slate-400 [&>button]:hover:text-white">
          {selectedProject && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-white text-2xl">{selectedProject.title}</DialogTitle>
                    {selectedProject.client_company && <p className="text-slate-400">{selectedProject.client_company}</p>}
                  </div>
                  <Button variant="ghost" size="icon" className="hover:bg-slate-800" onClick={() => deleteProjectMutation.mutate(selectedProject.id)}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Status</label>
                    <Select 
                      value={selectedProject.status || 'Planning'} 
                      onValueChange={(v) => {
                        updateProjectMutation.mutate({ id: selectedProject.id, data: { status: v }});
                        setSelectedProject({...selectedProject, status: v});
                      }}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(statusColors).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Priority</label>
                    <Select 
                      value={selectedProject.priority || 'Medium'} 
                      onValueChange={(v) => {
                        updateProjectMutation.mutate({ id: selectedProject.id, data: { priority: v }});
                        setSelectedProject({...selectedProject, priority: v});
                      }}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {selectedProject.client_name && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <User className="w-4 h-4 text-slate-500" />
                      {selectedProject.client_name}
                    </div>
                  )}
                  {selectedProject.client_email && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Building className="w-4 h-4 text-slate-500" />
                      {selectedProject.client_email}
                    </div>
                  )}
                  {selectedProject.budget > 0 && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <DollarSign className="w-4 h-4 text-slate-500" />
                      ${selectedProject.budget.toLocaleString()}
                    </div>
                  )}
                  {selectedProject.platform && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <FolderKanban className="w-4 h-4 text-slate-500" />
                      {selectedProject.platform}
                    </div>
                  )}
                </div>

                {(selectedProject.start_date || selectedProject.due_date) && (
                  <div className="flex gap-6">
                    {selectedProject.start_date && (
                      <div>
                        <label className="text-xs text-slate-500">Start Date</label>
                        <p className="text-slate-300">{new Date(selectedProject.start_date).toLocaleDateString()}</p>
                      </div>
                    )}
                    {selectedProject.due_date && (
                      <div>
                        <label className="text-xs text-slate-500">Due Date</label>
                        <p className="text-slate-300">{new Date(selectedProject.due_date).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedProject.description && (
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Description</label>
                    <p className="text-slate-300 bg-slate-800/50 p-3 rounded-lg">{selectedProject.description}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Notes</label>
                  <Textarea 
                    className="bg-slate-800 border-slate-700"
                    value={selectedProject.notes || ''}
                    onChange={(e) => setSelectedProject({...selectedProject, notes: e.target.value})}
                    onBlur={() => updateProjectMutation.mutate({ id: selectedProject.id, data: { notes: selectedProject.notes }})}
                    placeholder="Add project notes..."
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}