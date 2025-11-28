import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Section from '@/components/ui-custom/Section';
import GridBackground from '@/components/ui-custom/GridBackground';
import { ArrowLeft, Image as ImageIcon, Save, X } from 'lucide-react';
import ReactQuill from 'react-quill';

export default function AdminBlogEditPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  const isEditing = !!postId;

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    image_url: '',
    tags: [],
    reading_time: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const queryClient = useQueryClient();

  const { data: post } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => base44.entities.Post.filter({ id: postId }),
    enabled: isEditing,
  });

  useEffect(() => {
    if (post && post.length > 0) {
      const p = post[0];
      setFormData({
        title: p.title || '',
        summary: p.summary || '',
        content: p.content || '',
        image_url: p.image_url || '',
        tags: p.tags || [],
        reading_time: p.reading_time || ''
      });
    }
  }, [post]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Post.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      window.location.href = createPageUrl('Admin') + '?tab=blog';
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Post.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      window.location.href = createPageUrl('Admin') + '?tab=blog';
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (isEditing) {
      updateMutation.mutate({ id: postId, data: formData });
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

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24">
      <Section className="py-8">
        <GridBackground />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <Link to={createPageUrl('Admin') + '?tab=blog'} className="inline-flex items-center text-slate-400 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Link>

          <h1 className="text-3xl font-bold text-white mb-8">
            {isEditing ? 'Edit Blog Post' : 'New Blog Post'}
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
              <label className="text-sm text-slate-400 mb-1 block">Summary</label>
              <Input
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="bg-slate-800 border-slate-700"
                placeholder="Brief description for previews"
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
              <label className="text-sm text-slate-400 mb-1 block">Content</label>
              <div className="bg-white rounded-md">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  modules={quillModules}
                  className="[&_.ql-editor]:min-h-[300px]"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="bg-slate-800 border-slate-700"
                  placeholder="Add tag and press Enter"
                />
                <Button type="button" variant="outline" onClick={addTag} className="border-slate-700">
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-slate-700 text-slate-300 text-sm rounded flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Reading Time</label>
              <Input
                value={formData.reading_time}
                onChange={(e) => setFormData({ ...formData, reading_time: e.target.value })}
                className="bg-slate-800 border-slate-700"
                placeholder="e.g., 5 min read"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Link to={createPageUrl('Admin') + '?tab=blog'}>
                <Button type="button" variant="outline" className="border-slate-700">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="bg-[#73e28a] hover:bg-[#5dbb72] text-black" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update' : 'Publish'}
              </Button>
            </div>
          </form>
        </div>
      </Section>
    </div>
  );
}