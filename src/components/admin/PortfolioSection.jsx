import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Pencil, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import Card from '@/components/ui-custom/Card';

export default function PortfolioSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['portfolio-projects'],
    queryFn: () => base44.entities.Project.list('-created_date'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Project.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-projects'] });
    },
  });

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search portfolio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Development">Development</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Link to={createPageUrl('AdminPortfolioEdit')}>
          <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black">
            <Plus className="w-4 h-4 mr-2" /> Add Portfolio Item
          </Button>
        </Link>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-slate-800 rounded-xl animate-pulse" />
          ))
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            No portfolio items found
          </div>
        ) : (
          filteredProjects.map(project => (
            <Card key={project.id} className="overflow-hidden bg-slate-900/80">
              <div className="aspect-video bg-slate-800 relative">
                {project.image_url ? (
                  <img 
                    src={project.image_url} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    project.category === 'Development' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white mb-1">{project.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-3">{project.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{project.platform}</span>
                  <div className="flex gap-1">
                    {project.app_url && (
                      <a href={project.app_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                    <Link to={createPageUrl('AdminPortfolioEdit') + `?id=${project.id}`}>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-slate-400 hover:text-white"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-slate-400 hover:text-red-400"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

    </div>
  );
}