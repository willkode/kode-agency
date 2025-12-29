import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Section from '@/components/ui-custom/Section';
import GridBackground from '@/components/ui-custom/GridBackground';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Calendar, User, CheckCircle, Clock, Circle, AlertCircle, Send } from 'lucide-react';
import { format } from 'date-fns';

const statusColors = {
  'To Do': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  'In Progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Review': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Completed': 'bg-[#73e28a]/20 text-[#73e28a] border-[#73e28a]/30',
};

const statusIcons = {
  'To Do': Circle,
  'In Progress': Clock,
  'Review': AlertCircle,
  'Completed': CheckCircle,
};

export default function ProjectTasksPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');
  const queryClient = useQueryClient();

  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newTask, setNewTask] = useState({
    name: '',
    assigned_to: '',
    status: 'To Do',
    priority: 'Medium',
    due_date: '',
    description: ''
  });

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const projects = await base44.entities.Project.filter({ id: projectId });
      return projects[0];
    },
    enabled: !!projectId
  });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => base44.entities.Task.filter({ project_id: projectId }, '-created_date'),
    enabled: !!projectId
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['task-comments', selectedTask?.id],
    queryFn: () => base44.entities.TaskComment.filter({ task_id: selectedTask?.id }, '-created_date'),
    enabled: !!selectedTask?.id
  });

  const createTaskMutation = useMutation({
    mutationFn: (data) => base44.entities.Task.create({ ...data, project_id: projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      setIsAddOpen(false);
      setNewTask({ name: '', assigned_to: '', status: 'To Do', priority: 'Medium', due_date: '', description: '' });
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    }
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content) => {
      const user = await base44.auth.me();
      return base44.entities.TaskComment.create({
        task_id: selectedTask.id,
        content,
        author_name: user?.full_name || 'Unknown'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-comments', selectedTask?.id] });
      setNewComment('');
    }
  });

  if (!projectId) {
    return (
      <div className="min-h-screen bg-slate-950 text-white pt-24 flex items-center justify-center">
        <p className="text-slate-400">No project selected</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24">
      <Section className="py-8">
        <GridBackground />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('Admin') + '?tab=projects'}>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">{project?.title || 'Project Tasks'}</h1>
                <p className="text-slate-400">{project?.client_name || ''}</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsAddOpen(true)}
              className="bg-[#73e28a] hover:bg-[#5dbb72] text-black"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Task
            </Button>
          </div>

          {/* Tasks Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 text-sm font-medium text-slate-400">
              <div className="col-span-4">Task Name</div>
              <div className="col-span-2">Assigned To</div>
              <div className="col-span-2">Client</div>
              <div className="col-span-2">Due Date</div>
              <div className="col-span-2">Status</div>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-slate-400">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No tasks yet. Create your first task!</div>
            ) : (
              tasks.map(task => {
                const StatusIcon = statusIcons[task.status] || Circle;
                return (
                  <div 
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <div className="col-span-4 flex items-center gap-3">
                      <StatusIcon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span className="text-white font-medium truncate">{task.name}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2 text-slate-300">
                      {task.assigned_to ? (
                        <>
                          <User className="w-4 h-4 text-slate-500" />
                          <span className="truncate">{task.assigned_to}</span>
                        </>
                      ) : (
                        <span className="text-slate-500">Unassigned</span>
                      )}
                    </div>
                    <div className="col-span-2 text-slate-300 truncate">
                      {project?.client_name || '-'}
                    </div>
                    <div className="col-span-2 flex items-center gap-2 text-slate-300">
                      {task.due_date ? (
                        <>
                          <Calendar className="w-4 h-4 text-slate-500" />
                          {format(new Date(task.due_date), 'MMM d, yyyy')}
                        </>
                      ) : (
                        <span className="text-slate-500">No date</span>
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
        </div>
      </Section>

      {/* Add Task Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Task Name *</Label>
              <Input
                value={newTask.name}
                onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                className="bg-slate-800 border-slate-700"
                placeholder="Enter task name"
              />
            </div>
            <div className="space-y-2">
              <Label>Assigned To</Label>
              <Input
                value={newTask.assigned_to}
                onChange={(e) => setNewTask({...newTask, assigned_to: e.target.value})}
                className="bg-slate-800 border-slate-700"
                placeholder="Team member name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={newTask.status} onValueChange={(v) => setNewTask({...newTask, status: v})}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={newTask.priority} onValueChange={(v) => setNewTask({...newTask, priority: v})}>
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
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="bg-slate-800 border-slate-700"
                placeholder="Task details..."
              />
            </div>
            <Button
              onClick={() => createTaskMutation.mutate(newTask)}
              disabled={!newTask.name || createTaskMutation.isPending}
              className="w-full bg-[#73e28a] hover:bg-[#5dbb72] text-black"
            >
              Create Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Detail Modal */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedTask.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Task Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-400">Status</Label>
                    <Select 
                      value={selectedTask.status} 
                      onValueChange={(v) => {
                        updateTaskMutation.mutate({ id: selectedTask.id, data: { status: v }});
                        setSelectedTask({...selectedTask, status: v});
                      }}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="To Do">To Do</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Review">Review</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">Priority</Label>
                    <Select 
                      value={selectedTask.priority} 
                      onValueChange={(v) => {
                        updateTaskMutation.mutate({ id: selectedTask.id, data: { priority: v }});
                        setSelectedTask({...selectedTask, priority: v});
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
                  <div className="space-y-2">
                    <Label className="text-slate-400">Assigned To</Label>
                    <Input
                      value={selectedTask.assigned_to || ''}
                      onChange={(e) => setSelectedTask({...selectedTask, assigned_to: e.target.value})}
                      onBlur={() => updateTaskMutation.mutate({ id: selectedTask.id, data: { assigned_to: selectedTask.assigned_to }})}
                      className="bg-slate-800 border-slate-700"
                      placeholder="Team member name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">Due Date</Label>
                    <Input
                      type="date"
                      value={selectedTask.due_date || ''}
                      onChange={(e) => {
                        setSelectedTask({...selectedTask, due_date: e.target.value});
                        updateTaskMutation.mutate({ id: selectedTask.id, data: { due_date: e.target.value }});
                      }}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-slate-400">Description</Label>
                  <Textarea
                    value={selectedTask.description || ''}
                    onChange={(e) => setSelectedTask({...selectedTask, description: e.target.value})}
                    onBlur={() => updateTaskMutation.mutate({ id: selectedTask.id, data: { description: selectedTask.description }})}
                    className="bg-slate-800 border-slate-700 min-h-[80px]"
                    placeholder="Task details..."
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label className="text-slate-400">Notes</Label>
                  <Textarea
                    value={selectedTask.notes || ''}
                    onChange={(e) => setSelectedTask({...selectedTask, notes: e.target.value})}
                    onBlur={() => updateTaskMutation.mutate({ id: selectedTask.id, data: { notes: selectedTask.notes }})}
                    className="bg-slate-800 border-slate-700 min-h-[80px]"
                    placeholder="Internal notes..."
                  />
                </div>

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