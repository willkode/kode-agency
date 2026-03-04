import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Loader2, 
  Sparkles, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  Twitter,
  MessageSquare,
  Linkedin,
  Zap,
  Wrench,
  Calendar,
  Clock
} from 'lucide-react';

const PLATFORMS = [
  { value: 'twitter', label: 'Twitter', icon: Twitter, color: 'bg-sky-500/20 text-sky-400', maxChars: 280 },
  { value: 'reddit', label: 'Reddit', icon: MessageSquare, color: 'bg-orange-500/20 text-orange-400', maxChars: null },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'bg-blue-500/20 text-blue-400', maxChars: 3000 }
];

const SERVICES = [
  { value: 'build_sprint', label: 'Build Sprint', icon: Zap, color: 'bg-purple-500/20 text-purple-400' },
  { value: 'base44_er', label: 'Base44 ER', icon: Wrench, color: 'bg-green-500/20 text-green-400' }
];

const STATUS_COLORS = {
  generate: 'bg-gray-500/20 text-gray-400',
  pending_review: 'bg-yellow-500/20 text-yellow-400',
  scheduled: 'bg-cyan-500/20 text-cyan-400',
  approved: 'bg-blue-500/20 text-blue-400',
  rejected: 'bg-red-500/20 text-red-400',
  published: 'bg-green-500/20 text-green-400',
  failed: 'bg-red-500/20 text-red-400'
};

export default function SocialPostsSection() {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [generatePlatform, setGeneratePlatform] = useState('twitter');
  const [generateService, setGenerateService] = useState('build_sprint');
  const [hashtagNotes, setHashtagNotes] = useState('');
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['social-posts'],
    queryFn: () => base44.entities.SocialPost.list('-created_date', 200)
  });

  const approveMutation = useMutation({
    mutationFn: async (postId) => {
      // Call the publish function which posts to the platform
      const { data } = await base44.functions.invoke('publishSocialPost', { post_id: postId });
      if (!data.success) {
        throw new Error(data.error);
      }
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['social-posts'] })
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ postId, reason }) => {
      await base44.entities.SocialPost.update(postId, { 
        status: 'rejected',
        rejection_reason: reason
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-posts'] });
      setRejectModalOpen(false);
      setSelectedPost(null);
      setRejectionReason('');
    }
  });

  const generateMutation = useMutation({
    mutationFn: async ({ platform, service }) => {
      const { data } = await base44.functions.invoke('generateSocialPost', { platform, service });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['social-posts'] })
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId) => {
      await base44.entities.SocialPost.delete(postId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['social-posts'] })
  });

  const [hashtagPostId, setHashtagPostId] = useState(null);
  const [bulkPlatform, setBulkPlatform] = useState('twitter');
  const [bulkDays, setBulkDays] = useState(30);

  const bulkGenerateMutation = useMutation({
    mutationFn: async ({ platform, days }) => {
      const { data } = await base44.functions.invoke('bulkGenerateSocialPosts', { platform, days });
      if (!data.success) {
        throw new Error(data.error);
      }
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['social-posts'] })
  });

  const generateHashtagsMutation = useMutation({
    mutationFn: async (postId) => {
      setHashtagPostId(postId);
      const { data } = await base44.functions.invoke('generateHashtags', { post_id: postId });
      if (!data.success) {
        throw new Error(data.error);
      }
      return { postId, hashtag_notes: data.hashtag_notes };
    },
    onSuccess: ({ postId, hashtag_notes }) => {
      setHashtagNotes(prev => prev 
        ? `${prev}\n\n--- Generated ${new Date().toLocaleString()} ---\n${hashtag_notes}` 
        : hashtag_notes
      );
      setHashtagPostId(null);
      queryClient.invalidateQueries({ queryKey: ['social-posts'] });
    },
    onError: () => {
      setHashtagPostId(null);
    }
  });



  const handleReject = (post) => {
    setSelectedPost(post);
    setRejectModalOpen(true);
  };

  const confirmReject = () => {
    if (selectedPost) {
      rejectMutation.mutate({ postId: selectedPost.id, reason: rejectionReason });
    }
  };

  const pendingPosts = posts.filter(p => p.status === 'pending_review' || p.status === 'generate_hashtags');
  const scheduledPosts = posts.filter(p => p.status === 'scheduled').sort((a, b) => new Date(a.scheduled_for) - new Date(b.scheduled_for));
  const approvedPosts = posts.filter(p => p.status === 'approved');
  const publishedPosts = posts.filter(p => p.status === 'published');
  const rejectedPosts = posts.filter(p => p.status === 'rejected');
  const failedPosts = posts.filter(p => p.status === 'failed');
  const generatingPosts = posts.filter(p => p.status === 'generate');

  const getPlatformConfig = (platform) => PLATFORMS.find(p => p.value === platform) || PLATFORMS[0];
  const getServiceConfig = (service) => SERVICES.find(s => s.value === service) || SERVICES[0];

  const PostCard = ({ post, showActions = false }) => {
    const platformConfig = getPlatformConfig(post.platform);
    const serviceConfig = getServiceConfig(post.service);
    const PlatformIcon = platformConfig.icon;
    const ServiceIcon = serviceConfig.icon;
    const charCount = post.content?.length || 0;
    const maxChars = platformConfig.maxChars;

    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex gap-2 flex-wrap">
              <Badge className={platformConfig.color}>
                <PlatformIcon className="w-3 h-3 mr-1" />
                {platformConfig.label}
              </Badge>
              <Badge className={serviceConfig.color}>
                <ServiceIcon className="w-3 h-3 mr-1" />
                {serviceConfig.label}
              </Badge>
              <Badge className={STATUS_COLORS[post.status]}>
                {post.status.replace('_', ' ')}
              </Badge>
            </div>
            <span className="text-xs text-slate-500">
              {new Date(post.created_date).toLocaleDateString()}
            </span>
          </div>

          {post.title && (
            <h4 className="text-white font-medium mb-2">{post.title}</h4>
          )}

          {post.subreddit && (
            <div className="text-orange-400 text-xs mb-2">r/{post.subreddit}</div>
          )}

          <p className="text-slate-300 text-sm whitespace-pre-wrap mb-3">
            {post.content || <span className="text-slate-500 italic">Generating...</span>}
          </p>

          {maxChars && post.content && (
            <div className={`text-xs mb-3 ${charCount > maxChars ? 'text-red-400' : 'text-slate-500'}`}>
              {charCount} / {maxChars} characters
              {charCount > maxChars && ' (over limit!)'}
            </div>
          )}

          {post.rejection_reason && (
            <div className="text-red-400 text-xs mb-3 p-2 bg-red-500/10 rounded">
              Rejection reason: {post.rejection_reason}
            </div>
          )}

          {post.error_message && (
            <div className="text-red-400 text-xs mb-3 p-2 bg-red-500/10 rounded">
              Error: {post.error_message}
            </div>
          )}

          {post.post_url && (
            <a 
              href={post.post_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#73e28a] text-xs flex items-center gap-1 hover:underline mb-3"
            >
              <ExternalLink className="w-3 h-3" /> View Post
            </a>
          )}

          {post.scheduled_for && post.status === 'scheduled' && (
            <div className="text-cyan-400 text-xs mb-3 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Scheduled: {new Date(post.scheduled_for).toLocaleString()}
            </div>
          )}

          {post.published_at && (
            <div className="text-slate-500 text-xs mb-3">
              Published: {new Date(post.published_at).toLocaleString()}
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {showActions && (post.status === 'pending_review' || post.status === 'generate_hashtags' || post.status === 'scheduled') && (
              <>
                <Button 
                  size="sm" 
                  onClick={() => approveMutation.mutate(post.id)}
                  disabled={approveMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-3 h-3 mr-1" /> {post.status === 'scheduled' ? 'Publish Now' : 'Approve'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleReject(post)}
                  className="border-red-500 text-red-400 hover:bg-red-500/10"
                >
                  <XCircle className="w-3 h-3 mr-1" /> Reject
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => generateHashtagsMutation.mutate(post.id)}
                  disabled={generateHashtagsMutation.isPending || hashtagPostId === post.id}
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                >
                  {hashtagPostId === post.id ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 mr-1" />
                  )}
                  Hashtags
                </Button>
              </>
            )}
            
            {(post.status === 'rejected' || post.status === 'failed' || post.status === 'generate' || post.status === 'scheduled') && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => deleteMutation.mutate(post.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                Delete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Social Posts</h2>
          <p className="text-slate-400 text-sm">Manage posts across Twitter, Reddit, and LinkedIn</p>
        </div>
      </div>

      {/* Generate New Post */}
      <Card className="bg-slate-900 border-slate-800 mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center flex-wrap">
            <Select value={generatePlatform} onValueChange={setGeneratePlatform}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {PLATFORMS.map(p => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={generateService} onValueChange={setGenerateService}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {SERVICES.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={() => generateMutation.mutate({ platform: generatePlatform, service: generateService })}
              disabled={generateMutation.isPending}
              className="bg-[#73e28a] hover:bg-[#5dbb72] text-black"
            >
              {generateMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Generate Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Generate Posts */}
      <Card className="bg-slate-900 border-slate-800 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-medium">Bulk Schedule (3 posts/day at optimal times)</span>
          </div>
          <div className="flex gap-4 items-center flex-wrap">
            <Select value={bulkPlatform} onValueChange={setBulkPlatform}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {PLATFORMS.map(p => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={String(bulkDays)} onValueChange={(v) => setBulkDays(Number(v))}>
              <SelectTrigger className="w-32 bg-slate-800 border-slate-700">
                <SelectValue placeholder="Days" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={() => bulkGenerateMutation.mutate({ platform: bulkPlatform, days: bulkDays })}
              disabled={bulkGenerateMutation.isPending}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {bulkGenerateMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Calendar className="w-4 h-4 mr-2" />
              )}
              Generate {bulkDays * 3} Posts
            </Button>

            {bulkGenerateMutation.isPending && (
              <span className="text-slate-400 text-sm">This may take a few minutes...</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Posts Tabs */}
      <Tabs defaultValue="pending">
        <TabsList className="bg-slate-800 mb-4 text-white">
          <TabsTrigger value="pending" className="data-[state=active]:bg-slate-700">
            Pending Review ({pendingPosts.length})
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="data-[state=active]:bg-slate-700">
            Scheduled ({scheduledPosts.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-slate-700">
            Approved ({approvedPosts.length})
          </TabsTrigger>
          <TabsTrigger value="published" className="data-[state=active]:bg-slate-700">
            Published ({publishedPosts.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="data-[state=active]:bg-slate-700">
            Rejected ({rejectedPosts.length})
          </TabsTrigger>
          <TabsTrigger value="failed" className="data-[state=active]:bg-slate-700">
            Failed ({failedPosts.length})
          </TabsTrigger>
          {generatingPosts.length > 0 && (
            <TabsTrigger value="generating" className="data-[state=active]:bg-slate-700">
              Generating ({generatingPosts.length})
            </TabsTrigger>
          )}
          <TabsTrigger value="hashtags" className="data-[state=active]:bg-slate-700">
            Hashtags
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <>
            <TabsContent value="pending">
              {pendingPosts.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No posts pending review.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingPosts.map(post => <PostCard key={post.id} post={post} showActions />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="scheduled">
              {scheduledPosts.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No scheduled posts.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scheduledPosts.map(post => <PostCard key={post.id} post={post} showActions />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved">
              {approvedPosts.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No approved posts.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {approvedPosts.map(post => <PostCard key={post.id} post={post} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="published">
              {publishedPosts.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No published posts yet.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {publishedPosts.map(post => <PostCard key={post.id} post={post} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected">
              {rejectedPosts.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No rejected posts.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rejectedPosts.map(post => <PostCard key={post.id} post={post} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="failed">
              {failedPosts.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No failed posts.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {failedPosts.map(post => <PostCard key={post.id} post={post} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="generating">
              {generatingPosts.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No posts generating.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generatingPosts.map(post => <PostCard key={post.id} post={post} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="hashtags">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Hashtag Research</h3>
                    {hashtagPostId && (
                      <div className="flex items-center gap-2 text-purple-400 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating hashtags...
                      </div>
                    )}
                  </div>
                  <Textarea
                    value={hashtagNotes}
                    onChange={(e) => setHashtagNotes(e.target.value)}
                    placeholder="Click 'Hashtags' on a pending post to generate research..."
                    className="bg-slate-700 border-slate-600 text-white min-h-[300px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Reject Post</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm text-slate-400 mb-2 block">Rejection Reason</label>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmReject}
              disabled={rejectMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {rejectMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}