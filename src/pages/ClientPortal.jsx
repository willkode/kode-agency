import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Section from '@/components/ui-custom/Section';
import GridBackground from '@/components/ui-custom/GridBackground';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  FolderKanban, Calendar, User, CheckCircle, Clock, Circle, 
  AlertCircle, Send, ArrowLeft, FileText 
} from 'lucide-react';
import { format } from 'date-fns';

const statusColors = {
  'To Do': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  'In Progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Review': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Completed': 'bg-[#73e28a]/20 text-[#73e28a] border-[#73e28a]/30',
};

const projectStatusColors = {
  'Planning': 'bg-slate-500/20 text-slate-400',
  'In Progress': 'bg-yellow-500/20 text-yellow-400',
  'Review': 'bg-purple-500/20 text-purple-400',
  'Completed': 'bg-[#73e28a]/20 text-[#73e28a]',
  'On Hold': 'bg-orange-500/20 text-orange-400',
  'Cancelled': 'bg-red-500/20 text-red-400',
};

const statusIcons = {
  'To Do': Circle,
  'In Progress': Clock,
  'Review': AlertCircle,
  'Completed': CheckCircle,
};

export default function ClientPortalPage() {
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newComment, setNewComment] = useState('');

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['client-projects', user?.email],
    queryFn: () => base44.entities.Project.filter({ client_email: user?.email }),
    enabled: !!user?.email
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['project-tasks', selectedProject?.id],
    queryFn: () => base44.entities.Task.filter({ project_id: selectedProject?.id }, '-created_date'),
    enabled: !!selectedProject?.id
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['task-comments', selectedTask?.id],
    queryFn: () => base44.entities.TaskComment.filter({ task_id: selectedTask?.id }, '-created_date'),
    enabled: !!selectedTask?.id
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content) => {
      return base44.entities.TaskComment.create({
        task_id: selectedTask.id,
        content,
        author_name: user?.full_name || 'Client'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-comments', selectedTask?.id] });
      setNewComment('');
    }
  });

  if (projectsLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white pt-24 flex items-center justify-center">
        <p className="text-slate-400">Loading your projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24">
      <Section className="py-8">
        <GridBackground />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            {selectedProject && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">
                {selectedProject ? selectedProject.title : 'Client Portal'}
              </h1>
              <p className="text-slate-400">
                {selectedProject ? 'View project tasks and progress' : 'Welcome back, ' + (user?.full_name || 'Client')}
              </p>
            </div>
          </div>

          {!selectedProject ? (
            /* Projects List */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No projects found for your account.</p>
                </div>
              ) : (
                projects.map(project => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="bg-slate-900/80 border border-slate-800 rounded-lg p-6 cursor-pointer hover:border-[#73e28a]/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                        <FolderKanban className="w-6 h-6 text-[#73e28a]" />
                      </div>
                      <Badge className={projectStatusColors[project.status]}>
                        {project.status}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                    {project.description && (
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      {project.due_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(project.due_date), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Tasks List */
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 text-sm font-medium text-slate-400">
                <div className="col-span-5">Task Name</div>
                <div className="col-span-3">Assigned To</div>
                <div className="col-span-2">Due Date</div>
                <div className="col-span-2">Status</div>
              </div>

              {tasksLoading ? (
                <div className="p-8 text-center text-slate-400">Loading tasks...</div>
              ) : tasks.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No tasks for this project yet.</div>
              ) : (
                tasks.map(task => {
                  const StatusIcon = statusIcons[task.status] || Circle;
                  return (
                    <div 
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <div className="col-span-5 flex items-center gap-3">
                        <StatusIcon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-white font-medium truncate">{task.name}</span>
                      </div>
                      <div className="col-span-3 flex items-center gap-2 text-slate-300">
                        {task.assigned_to ? (
                          <>
                            <User className="w-4 h-4 text-slate-500" />
                            <span className="truncate">{task.assigned_to}</span>
                          </>
                        ) : (
                          <span className="text-slate-500">Unassigned</span>
                        )}
                      </div>
                      <div className="col-span-2 flex items-center gap-2 text-slate-300">
                        {task.due_date ? (
                          format(new Date(task.due_date), 'MMM d')
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </div>
                      <div className="col-span-2">
                        <Badge className={statusColors[task.status]}>{task.status}</Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </Section>

      {/* Task Detail Modal (Read-Only with Comments) */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedTask.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Task Details (Read-Only) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-slate-500 text-xs uppercase">Status</Label>
                    <Badge className={statusColors[selectedTask.status]}>{selectedTask.status}</Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-500 text-xs uppercase">Priority</Label>
                    <p className="text-white">{selectedTask.priority || 'Medium'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-slate-500 text-xs uppercase">Assigned To</Label>
                    <p className="text-white">{selectedTask.assigned_to || 'Unassigned'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-500 text-xs uppercase">Due Date</Label>
                    <p className="text-white">
                      {selectedTask.due_date 
                        ? format(new Date(selectedTask.due_date), 'MMMM d, yyyy') 
                        : 'No due date'}
                    </p>
                  </div>
                </div>

                {selectedTask.description && (
                  <div className="space-y-1">
                    <Label className="text-slate-500 text-xs uppercase">Description</Label>
                    <p className="text-slate-300 bg-slate-800/50 rounded-lg p-3">{selectedTask.description}</p>
                  </div>
                )}

                {selectedTask.notes && (
                  <div className="space-y-1">
                    <Label className="text-slate-500 text-xs uppercase">Notes</Label>
                    <p className="text-slate-300 bg-slate-800/50 rounded-lg p-3">{selectedTask.notes}</p>
                  </div>
                )}

                {/* Comments Section */}
                <div className="space-y-3 border-t border-slate-800 pt-4">
                  <Label className="text-slate-400">Comments</Label>
                  
                  <div className="flex gap-2">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="bg-slate-800 border-slate-700 flex-1"
                      placeholder="Add a comment..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newComment.trim()) {
                          createCommentMutation.mutate(newComment);
                        }
                      }}
                    />
                    <Button
                      onClick={() => newComment.trim() && createCommentMutation.mutate(newComment)}
                      disabled={!newComment.trim() || createCommentMutation.isPending}
                      className="bg-[#73e28a] hover:bg-[#5dbb72] text-black"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {comments.length === 0 ? (
                      <p className="text-slate-500 text-sm">No comments yet</p>
                    ) : (
                      comments.map(comment => (
                        <div key={comment.id} className="bg-slate-800/50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-white">{comment.author_name}</span>
                            <span className="text-xs text-slate-500">
                              {format(new Date(comment.created_date), 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm">{comment.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}