import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { track, useTimeOnPage } from '@/components/analytics/useAnalytics';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Calendar, MessageCircle, Play, ChevronRight, Check, ArrowRight, Twitter, Facebook, Linkedin, Heart, Share2 } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogPostPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  const viewTracked = useRef(false);
  const scrollMilestones = useRef({ 50: false, 75: false, 90: false });

  // Time on page tracking
  useTimeOnPage('blog_post');

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => postId ? base44.entities.Post.filter({ id: postId }) : Promise.resolve([]),
    select: (data) => data?.[0] || null,
  });

  const { data: allPosts } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.list(),
    initialData: [],
  });

  // Track post view
  useEffect(() => {
    if (post && !viewTracked.current) {
      viewTracked.current = true;
      track('blog_post_viewed', {
        post_id: post.id,
        post_slug: post.title?.toLowerCase().replace(/\s+/g, '-'),
        tags: post.tags?.join(',') || ''
      });
    }
  }, [post?.id]);

  // Track scroll depth for blog posts
  useEffect(() => {
    if (!post) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

      [50, 75, 90].forEach((milestone) => {
        if (scrollPercent >= milestone && !scrollMilestones.current[milestone]) {
          scrollMilestones.current[milestone] = true;
          track(`blog_post_scroll_${milestone}`, {
            post_id: post.id,
            post_slug: post.title?.toLowerCase().replace(/\s+/g, '-')
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post?.id]);

  const categories = [
    { name: "Corporate Solution", count: null },
    { name: "Digital Agency", count: null },
    { name: "Consulting", count: null },
    { name: "IT Consulting", count: null },
    { name: "Web Development", count: null },
    { name: "Cyber Security", count: null },
  ];

  const relatedImages = [
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop",
  ];

  // Use post data or placeholder
  const displayPost = post || {
    title: "Fusce tincidunt semoda eac quis portitor Gia expiar, puis portitor ipsum etik pelis.",
    content: `Fusce tincidunt semoda ac quis portitor gia expiar puis portitor ipsum etik pelis the functionality but was expected to make it the collapse which continue the construction show the process in the creative agency developing, Cloud Palette Publicist de la que rent dibade. Parallel of the quad to 2014 quis a ullamcorper quis dolor in this week.

Our Success Journey for People.

Unlike going out and working with a marketing company for your website, working with our agency offers significant efficiency, versatility and skill diversity.

Fusce tincidunt ac quis. A lobortis ras tincidunt or simply free text ever but was expected to make it the collapse which continue the construction show the process in the creative agency. Parallel of the quad to 2014 quis a ullamcorper quis dolor in this week ipsam.

• Independent perspective on your situation
• Get an in-depth business review from our professionals 
• Proven and tried effective tactics to explore
• Closely monitor the effective to advise`,
    image_url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&auto=format&fit=crop",
    created_date: new Date().toISOString(),
    tags: ["Business", "Consultant", "Creative", "UX/UI", "App"],
  };

  if (isLoading) {
    return (
      <div className="bg-slate-950 min-h-screen pt-20">
        <Skeleton className="h-[400px] w-full bg-slate-800" />
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-8 w-3/4 bg-slate-800 mb-4" />
          <Skeleton className="h-4 w-full bg-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[400px] md:min-h-[450px] overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/60"></div>
        </div>
        
        {/* Decorative Image */}
        <div className="absolute top-20 right-20 hidden lg:block">
          <div className="w-32 h-40 rounded-[40px] overflow-hidden border-4 border-[#73e28a]/30">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop" 
              alt="" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-3xl leading-tight mb-8">
            Dec Design is really the creative invention
          </h1>
          <div className="flex items-center gap-2 text-sm">
            <Link to={createPageUrl('Home')} className="text-[#73e28a] hover:underline">Home</Link>
            <span className="text-slate-500">/</span>
            <Link to={createPageUrl('Blog')} className="text-[#73e28a] hover:underline">Blog</Link>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">Dec Design is really the creative invention</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-2">
            {/* Featured Image with Video Button */}
            <div className="relative rounded-xl overflow-hidden mb-8">
              <img 
                src={displayPost.image_url} 
                alt={displayPost.title}
                className="w-full h-[400px] object-cover"
              />
              {/* Play Button */}
              <div className="absolute bottom-6 right-6">
                <button className="w-14 h-14 rounded-full bg-[#73e28a] flex items-center justify-center hover:scale-110 transition-transform shadow-lg focus:outline-none focus:ring-2 focus:ring-[#73e28a] focus:ring-offset-2 focus:ring-offset-slate-950">
                  <Play className="w-6 h-6 text-black ml-1" fill="black" />
                </button>
              </div>
              {/* Author Badge */}
              <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-slate-900/90 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#73e28a] to-emerald-600 flex items-center justify-center text-black text-sm font-bold">
                  K
                </div>
                <span className="text-white text-sm font-medium">Kode Agency</span>
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
              <span className="flex items-center gap-1.5 text-[#73e28a]">
                <Calendar className="w-4 h-4" />
                {displayPost.created_date ? format(new Date(displayPost.created_date), 'MMMM d, yyyy') : 'Recent'}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
              {displayPost.title}
            </h2>

            {/* Content */}
            <div 
              className="blog-content max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: displayPost.content || '' }}
              style={{
                '--tw-prose-body': '#cbd5e1',
                '--tw-prose-headings': '#fff',
              }}
            />
            <style>{`
              .blog-content h2 {
                font-size: 1.75rem;
                font-weight: 700;
                color: #fff;
                margin-top: 2.5rem;
                margin-bottom: 1rem;
                padding-bottom: 0.75rem;
                border-bottom: 1px solid #334155;
              }
              .blog-content h3 {
                font-size: 1.25rem;
                font-weight: 600;
                color: #73e28a;
                margin-top: 2rem;
                margin-bottom: 0.75rem;
              }
              .blog-content p {
                color: #cbd5e1;
                line-height: 1.75;
                margin-bottom: 1rem;
              }
              .blog-content ul {
                margin: 1rem 0;
                padding-left: 1.5rem;
                list-style-type: disc;
              }
              .blog-content ul ul {
                margin: 0.5rem 0;
              }
              .blog-content li {
                color: #cbd5e1;
                margin-bottom: 0.5rem;
              }
              .blog-content strong {
                color: #fff;
                font-weight: 600;
              }
              .blog-content a {
                color: #73e28a;
                text-decoration: none;
              }
              .blog-content a:hover {
                text-decoration: underline;
              }
              .blog-content code {
                background: #1e293b;
                padding: 0.125rem 0.375rem;
                border-radius: 0.25rem;
                color: #73e28a;
                font-size: 0.875rem;
              }
              .blog-content pre {
                background: #0f172a;
                border: 1px solid #334155;
                border-radius: 0.75rem;
                padding: 1rem;
                overflow-x: auto;
                margin: 1.5rem 0;
              }
              .blog-content pre code {
                background: transparent;
                padding: 0;
                color: #e2e8f0;
              }
            `}</style>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-3 py-6 border-t border-slate-800">
              <span className="text-white font-bold">Tag Words:</span>
              {displayPost.tags?.map((tag, i) => (
                <span key={i} className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-300 hover:border-[#73e28a] hover:text-[#73e28a] cursor-pointer transition-colors">
                  {tag}
                </span>
              ))}
            </div>

            {/* Author Box */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 my-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#73e28a] to-emerald-600 flex items-center justify-center text-black text-xl font-bold flex-shrink-0">
                  K
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-2">Kode Agency</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    We're an AI-native software development agency specializing in rapid MVP development, SaaS platforms, and CRO-optimized websites.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Images Grid */}
            <div className="grid grid-cols-3 gap-4 my-8">
              {relatedImages.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden h-48 group">
                  <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>

            {/* Share & Like */}
            <div className="flex items-center justify-center gap-8 py-8 border-y border-slate-800">
              <button className="flex items-center gap-2 text-slate-400 hover:text-[#73e28a] transition-colors">
                <Heart className="w-5 h-5" />
                <span>Like</span>
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-[#73e28a] transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>

            {/* Comments Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-white mb-8">Comments (2)</h3>
              
              {/* Comment */}
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#73e28a] to-emerald-600 flex items-center justify-center text-black font-bold flex-shrink-0">
                    T
                  </div>
                  <div>
                    <h5 className="text-white font-bold">Townbu Rahman</h5>
                    <p className="text-slate-400 text-sm mt-2">
                      Fusce tincidunt or simply free text ever but was expected to make it the collapse which continue the construction show the process.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 ml-16">
                  <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                    M
                  </div>
                  <div>
                    <h5 className="text-white font-bold">Monaur Rahman Litu</h5>
                    <p className="text-slate-400 text-sm mt-2">
                      A lobortis ras tincidunt or simply free text ever but was expected to make.
                    </p>
                  </div>
                </div>
              </div>

              {/* Leave a Comment */}
              <div className="mt-12">
                <h4 className="text-xl font-bold text-white mb-6">Leave A Comment</h4>
                <p className="text-slate-500 text-sm mb-6">Your email address will not be published.</p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <Input 
                    placeholder="Your Name*" 
                    className="bg-slate-900 border-slate-700 text-white h-12 focus:border-[#73e28a]"
                  />
                  <Input 
                    placeholder="Your Email*" 
                    className="bg-slate-900 border-slate-700 text-white h-12 focus:border-[#73e28a]"
                  />
                </div>
                <Textarea 
                  placeholder="Message" 
                  className="bg-slate-900 border-slate-700 text-white min-h-[120px] focus:border-[#73e28a] mb-4"
                />
                <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-12 px-8">
                  Post Comment
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Search */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h4 className="text-white font-bold mb-4">Search Here</h4>
              <div className="relative">
                <Input 
                  placeholder="Search..." 
                  className="bg-slate-800 border-slate-700 text-white h-12 pr-12 focus:border-[#73e28a]"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#73e28a] rounded flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#73e28a]">
                  <Search className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h4 className="text-white font-bold mb-4">Our Services</h4>
              <ul className="space-y-3">
                {categories.map((cat, i) => (
                  <li key={i}>
                    <a href="#" className="flex items-center gap-3 text-slate-400 hover:text-[#73e28a] transition-colors group">
                      <ChevronRight className="w-4 h-4 text-[#73e28a]" />
                      <span>{cat.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h4 className="text-white font-bold mb-4">Social Link</h4>
              <div className="flex gap-3">
                {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-[#73e28a] hover:text-black hover:border-[#73e28a] transition-all">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
              <h4 className="text-xl font-bold text-white mb-2">Have Any Query Feel Free Contact</h4>
              <Link to={createPageUrl('Contact')}>
                <Button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold mt-4 w-full">
                  Contact Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}