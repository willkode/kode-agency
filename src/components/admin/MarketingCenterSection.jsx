import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  Sparkles, 
  CheckCircle, 
  Send, 
  Image as ImageIcon,
  ExternalLink,
  Trash2,
  Edit2,
  Clock,
  Calendar
} from 'lucide-react';

const SERVICES = [
  // Development Services (8)
  { slug: 'app_development', name: 'App Development', description: 'Native, web, and cross-platform apps with AI-enhanced workflows', url: 'https://kodebase.us/AppDevelopment' },
  { slug: 'mvp_development', name: 'MVP Development', description: 'Rapid MVPs using Base44, Lovable, Replit — launch in weeks', url: 'https://kodebase.us/MVPDevelopment' },
  { slug: 'ai_systems', name: 'AI Systems & Automations', description: 'Custom AI agents, workflow automation, and LLM integrations', url: 'https://kodebase.us/AISystems' },
  { slug: 'api_development', name: 'API Development', description: 'REST & GraphQL APIs with third-party integrations', url: 'https://kodebase.us/APIDevelopment' },
  { slug: 'saas_development', name: 'Custom SaaS', description: 'Multi-tenant platforms with billing, auth, and dashboards', url: 'https://kodebase.us/SaaSDevelopment' },
  { slug: 'ui_ux_design', name: 'UI/UX Design', description: 'Conversion-focused interfaces and full design systems', url: 'https://kodebase.us/UIUXDesign' },
  { slug: 'website_development', name: 'Website Development', description: 'High-performance sites, landing pages, and e-commerce', url: 'https://kodebase.us/WebsiteDevelopment' },
  { slug: 'devops', name: 'DevOps & Infrastructure', description: 'Cloud setup, monitoring, scaling, and deployment', url: 'https://kodebase.us/DevOps' },
  // Specialty Services (7)
  { slug: 'build_sprint', name: 'Build Sprint', description: 'Live screen-share session where I build your MVP while you watch and learn. $75/hr', url: 'https://kodebase.us/BuildSprint' },
  { slug: 'base44_er', name: 'Base44 Emergency Room', description: 'Expert app review + fix service for just $50', url: 'https://kodebase.us/Base44ER' },
  { slug: 'app_foundation', name: 'App Foundation', description: 'Done-for-you app scaffolding with core data models and integrations. $250 flat', url: 'https://kodebase.us/AppFoundation' },
  { slug: 'mobile_app', name: 'Mobile App Conversion', description: 'Turn your web app into a real mobile app (Android + iOS). $250 flat', url: 'https://kodebase.us/MobileAppConversion' },
  { slug: 'basecms', name: 'BaseCMS Services', description: 'Setup, customization, and support for your BaseCMS project. From $75/hr', url: 'https://kodebase.us/BaseCMS' },
  { slug: 'frontend_exporter', name: 'Frontend Exporter', description: 'Scan your Base44 repo and get a full migration plan to host your frontend externally', url: 'https://kodebase.us/FrontendExporter' },
  { slug: 'migration_assistant', name: 'Migration Assistant', description: 'Self-serve wizard to generate configs, env vars, and deploy checklists for external hosting', url: 'https://kodebase.us/MigrationAssistant' },
  // Marketing Services (7)
  { slug: 'seo_services', name: 'SEO Services', description: 'Technical SEO, on-page optimization, and AI-powered audits', url: 'https://kodebase.us/SEOServices' },
  { slug: 'cro_services', name: 'Conversion Rate Optimization', description: 'Funnel optimization, A/B testing, and UX improvements', url: 'https://kodebase.us/CROServices' },
  { slug: 'paid_ads', name: 'Paid Ads Management', description: 'Google Ads, Facebook/Instagram Ads, and retargeting', url: 'https://kodebase.us/PaidAds' },
  { slug: 'content_marketing', name: 'Content Marketing', description: 'Blog writing, AI-generated content, and social media', url: 'https://kodebase.us/ContentMarketing' },
  { slug: 'branding', name: 'Branding & Creative', description: 'Logo design, brand identity, and messaging strategy', url: 'https://kodebase.us/Branding' },
  { slug: 'email_marketing', name: 'Email Marketing', description: 'Automation, lead nurturing, and list growth strategy', url: 'https://kodebase.us/EmailMarketing' },
  { slug: 'full_funnel_marketing', name: 'Full Funnel Marketing', description: 'End-to-end strategy, lead gen, and multi-channel campaigns', url: 'https://kodebase.us/FullFunnelMarketing' }
];

const MAX_POSTS_PER_DAY = 3;

const SCHEDULE_SLOTS = [
  { value: 'morning', label: '9:00 AM CST', description: 'Morning' },
  { value: 'afternoon', label: '1:00 PM CST', description: 'Afternoon' },
  { value: 'evening', label: '7:00 PM CST', description: 'Evening' }
];

export default function MarketingCenterSection() {
  const [selectedService, setSelectedService] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editText, setEditText] = useState('');
  const [scheduleSlot, setScheduleSlot] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['linkedin-posts'],
    queryFn: () => base44.entities.LinkedInPost.list('-created_date', 100)
  });

  const todayPosts = posts.filter(p => {
    if (p.status !== 'posted' || !p.posted_at) return false;
    const postedDate = new Date(p.posted_at).toDateString();
    const today = new Date().toDateString();
    return postedDate === today;
  });

  const postsRemaining = MAX_POSTS_PER_DAY - todayPosts.length;

  const generateMutation = useMutation({
    mutationFn: async (service) => {
      const { data } = await base44.functions.invoke('generateLinkedInPost', {
        service_slug: service.slug,
        service_name: service.name,
        service_description: service.description,
        service_url: service.url
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-posts'] });
      setSelectedService('');
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (postId) => {
      await base44.entities.LinkedInPost.update(postId, { status: 'approved' });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['linkedin-posts'] })
  });

  const postMutation = useMutation({
    mutationFn: async (postId) => {
      const { data } = await base44.functions.invoke('postToLinkedIn', { postId });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['linkedin-posts'] })
  });

  const updateMutation = useMutation({
    mutationFn: async ({ postId, text }) => {
      await base44.entities.LinkedInPost.update(postId, { text });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-posts'] });
      setEditingPost(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId) => {
      await base44.entities.LinkedInPost.delete(postId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['linkedin-posts'] })
  });

  const handleGenerate = () => {
    const service = SERVICES.find(s => s.slug === selectedService);
    if (service) {
      generateMutation.mutate(service);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post.id);
    setEditText(post.text);
  };

  const handleSaveEdit = (postId) => {
    updateMutation.mutate({ postId, text: editText });
  };

  const draftPosts = posts.filter(p => p.status === 'draft');
  const approvedPosts = posts.filter(p => p.status === 'approved');
  const scheduledPosts = posts.filter(p => p.status === 'scheduled');
  const postedPosts = posts.filter(p => p.status === 'posted');

  const statusColors = {
    draft: 'bg-yellow-500/20 text-yellow-400',
    approved: 'bg-blue-500/20 text-blue-400',
    scheduled: 'bg-purple-500/20 text-purple-400',
    posted: 'bg-green-500/20 text-green-400',
    failed: 'bg-red-500/20 text-red-400'
  };

  const scheduleMutation = useMutation({
    mutationFn: async ({ postId, slot, date }) => {
      await base44.entities.LinkedInPost.update(postId, { 
        status: 'scheduled',
        scheduled_slot: slot,
        scheduled_date: date
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-posts'] });
      setScheduleSlot('');
      setScheduleDate('');
    }
  });

  const PostCard = ({ post }) => (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <Badge className={statusColors[post.status]}>{post.status}</Badge>
          <span className="text-xs text-slate-500">
            {new Date(post.created_date).toLocaleDateString()}
          </span>
        </div>
        
        {post.image_url && (
          <img 
            src={post.image_url} 
            alt="Post graphic" 
            className="w-full h-40 object-cover rounded-lg mb-3"
          />
        )}
        
        {editingPost === post.id ? (
          <div className="space-y-2">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleSaveEdit(post.id)} disabled={updateMutation.isPending}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditingPost(null)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-slate-300 text-sm whitespace-pre-wrap mb-3">{post.text}</p>
        )}
        
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span>Service: {SERVICES.find(s => s.slug === post.service_slug)?.name || post.service_slug}</span>
        </div>
        
        {post.error_message && (
          <div className="text-red-400 text-xs mb-3 p-2 bg-red-500/10 rounded">
            {post.error_message}
          </div>
        )}
        
        <div className="flex gap-2 flex-wrap">
          {post.status === 'draft' && (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleEdit(post)}
                className="border-slate-600"
              >
                <Edit2 className="w-3 h-3 mr-1" /> Edit
              </Button>
              <Button 
                size="sm" 
                onClick={() => approveMutation.mutate(post.id)}
                disabled={approveMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="w-3 h-3 mr-1" /> Approve
              </Button>
            </>
          )}
          
          {post.status === 'approved' && (
            <Button 
              size="sm" 
              onClick={() => postMutation.mutate(post.id)}
              disabled={postMutation.isPending || postsRemaining <= 0}
              className="bg-[#73e28a] hover:bg-[#5dbb72] text-black"
            >
              {postMutation.isPending ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Send className="w-3 h-3 mr-1" />
              )}
              Post to LinkedIn
            </Button>
          )}
          
          {post.status === 'posted' && post.linkedin_post_id && (
            <a 
              href={`https://www.linkedin.com/feed/update/${post.linkedin_post_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#73e28a] text-xs flex items-center gap-1 hover:underline"
            >
              <ExternalLink className="w-3 h-3" /> View on LinkedIn
            </a>
          )}
          
          {post.status !== 'posted' && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => deleteMutation.mutate(post.id)}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Marketing Center</h2>
          <p className="text-slate-400 text-sm">Generate and manage LinkedIn posts</p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-[#73e28a]">{postsRemaining}</div>
          <div className="text-xs text-slate-500">posts remaining today</div>
        </div>
      </div>

      {/* Generate New Post */}
      <Card className="bg-slate-900 border-slate-800 mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Sparkles className="w-5 h-5 text-[#73e28a]" />
            Generate New Post
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="w-64 bg-slate-800 border-slate-700">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {SERVICES.map(s => (
                  <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleGenerate}
              disabled={!selectedService || generateMutation.isPending}
              className="bg-[#73e28a] hover:bg-[#5dbb72] text-black"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Post
                </>
              )}
            </Button>
          </div>
          
          {generateMutation.isPending && (
            <div className="mt-4 text-slate-400 text-sm flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Creating graphic and writing copy... this takes about 15 seconds
            </div>
          )}
        </CardContent>
      </Card>

      {/* Posts Tabs */}
      <Tabs defaultValue="drafts">
        <TabsList className="bg-slate-800 mb-4">
          <TabsTrigger value="drafts" className="data-[state=active]:bg-slate-700">
            Drafts ({draftPosts.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-slate-700">
            Approved ({approvedPosts.length})
          </TabsTrigger>
          <TabsTrigger value="posted" className="data-[state=active]:bg-slate-700">
            Posted ({postedPosts.length})
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <>
            <TabsContent value="drafts">
              {draftPosts.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No draft posts. Generate one above!
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {draftPosts.map(post => <PostCard key={post.id} post={post} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved">
              {approvedPosts.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No approved posts waiting to be published.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {approvedPosts.map(post => <PostCard key={post.id} post={post} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="posted">
              {postedPosts.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No posts published yet.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {postedPosts.map(post => <PostCard key={post.id} post={post} />)}
                </div>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}