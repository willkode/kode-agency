import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Section from '@/components/ui-custom/Section';
import GridBackground from '@/components/ui-custom/GridBackground';
import { ArrowLeft, Image as ImageIcon, Save } from 'lucide-react';

export default function AdminPortfolioEditPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');
  const isEditing = !!projectId;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_result: '',
    image_url: '',
    app_url: '',
    category: 'Development',
    platform: 'Base44',
    status: 'Completed'
  });
  const [saving, setSaving] = useState(false);

  const queryClient = useQueryClient();

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => base44.entities.Project.filter({ id: projectId }),
    enabled: isEditing,
  });

  useEffect(() => {
    if (project && project.length > 0) {
      const p = project[0];
      setFormData({
        title: p.title || '',
        description: p.description || '',
        short_result: p.short_result || '',
        image_url: p.image_url || '',
        app_url: p.app_url || '',
        category: p.category || 'Development',
        platform: p.platform || 'Base44',
        status: p.status || 'Completed'
      });
    }
  }, [project]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Project.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-projects'] });
      window.location.href = createPageUrl('Admin') + '?tab=portfolio';
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Project.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-projects'] });
      window.location.href = createPageUrl('Admin') + '?tab=portfolio';
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (isEditing) {
      updateMutation.mutate({ id: projectId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, image_url: file_url });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24">
      <Section className="py-8">
        <GridBackground />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <Link to={createPageUrl('Admin') + '?tab=portfolio'} className="inline-flex items-center text-slate-400 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portfolio
          </Link>

          <h1 className="text-3xl font-bold text-white mb-8">
            {isEditing ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-slate-800 border-slate-700"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-800 border-slate-700"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Result Summary</label>
              <Input
                value={formData.short_result}
                onChange={(e) => setFormData({ ...formData, short_result: e.target.value })}
                className="bg-slate-800 border-slate-700"
                placeholder="e.g., 40% increase in conversions"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Featured Image</label>
              <div className="flex gap-2">
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="bg-slate-800 border-slate-700 flex-1"
                  placeholder="Image URL"
                />
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <Button type="button" variant="outline" className="border-slate-700">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                </label>
              </div>
              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" className="mt-3 h-32 rounded object-cover" />
              )}
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Live App URL</label>
              <Input
                value={formData.app_url}
                onChange={(e) => setFormData({ ...formData, app_url: e.target.value })}
                className="bg-slate-800 border-slate-700"
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Category</label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Platform</label>
                <Select value={formData.platform} onValueChange={(v) => setFormData({ ...formData, platform: v })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Base44">Base44</SelectItem>
                    <SelectItem value="Lovable">Lovable</SelectItem>
                    <SelectItem value="Replit">Replit</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Link to={createPageUrl('Admin') + '?tab=portfolio'}>
                <Button type="button" variant="outline" className="border-slate-700">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="bg-[#73e28a] hover:bg-[#5dbb72] text-black" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      </Section>
    </div>
  );
}