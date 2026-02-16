import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { track, usePageView, useScrollDepth, useTimeOnPage } from '@/components/analytics/useAnalytics';
import Section from '@/components/ui-custom/Section';
import PageHero from '@/components/ui-custom/PageHero';
import SEO, { createBreadcrumbSchema } from '@/components/SEO';
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogPage() {
  // Analytics tracking
  usePageView('blog_list');
  useScrollDepth('blog');
  useTimeOnPage('blog');

  const handlePostClick = (post) => {
    track('blog_post_clicked', {
      post_id: post.id,
      post_title: post.title,
      tags: post.tags?.join(',') || ''
    });
  };

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.list(),
    initialData: [],
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Blog", url: "/Blog" }
      ]),
      {
        "@type": "Blog",
        "name": "Kode Agency Blog",
        "description": "Insights on web development, AI, marketing, and building successful digital products."
      }
    ]
  };

  return (
    <div className="bg-slate-950 text-white">
      <SEO 
        title="Blog - Web Development, AI & Marketing Insights"
        description="Expert insights on web development, AI systems, digital marketing, and building successful SaaS products. Tips, tutorials, and case studies from 30+ years of experience."
        keywords={["web development blog", "AI development tips", "marketing insights", "SaaS building", "startup advice", "Base44 tutorials"]}
        url="/Blog"
        jsonLd={jsonLd}
      />
      {/* Hero */}
      <PageHero 
        title="Blog" 
        backgroundImage="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&auto=format&fit=crop"
      />

      {/* Blog Grid */}
      <Section className="py-20">
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-56 w-full rounded-xl bg-slate-800" />
                <Skeleton className="h-6 w-3/4 bg-slate-800" />
                <Skeleton className="h-4 w-full bg-slate-800" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} to={createPageUrl('BlogPost') + `?id=${post.id}`} className="group cursor-pointer block" onClick={() => handlePostClick(post)}>
                {/* Image Container */}
                <div className="relative h-56 rounded-xl overflow-hidden mb-4">
                  <img 
                    src={post.image_url || "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&auto=format&fit=crop"} 
                    alt={post.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                  />
                  {/* Author Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#73e28a] to-emerald-600 flex items-center justify-center text-black text-xs font-bold">
                      K
                    </div>
                    <span className="text-white text-xs font-medium">Kode Agency</span>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-slate-500 text-xs mb-3">
                  <span className="flex items-center gap-1.5 text-[#73e28a]">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.created_date ? format(new Date(post.created_date), 'MMM d, yyyy') : 'Recent'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5" />
                    0 Comments
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#73e28a] transition-colors leading-tight">
                  {post.title}
                </h3>

                {/* Summary */}
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                  {post.summary || "Donec porta massa id dictum varius at tincidunt massa. Mauris dis mauris eu sed ellt. Dolor Pra interdum facilis..."}
                </p>
              </Link>
            ))}
            
            {posts.length === 0 && (
              <>
                {/* Placeholder cards when no posts */}
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="group cursor-pointer">
                    <div className="relative h-56 rounded-xl overflow-hidden mb-4">
                      <img 
                        src={`https://images.unsplash.com/photo-${1600880292203 + i * 1000}-757bb62b4baf?w=600&auto=format&fit=crop`}
                        alt="Blog post" 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm rounded-full px-3 py-1.5">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#73e28a] to-emerald-600 flex items-center justify-center text-black text-xs font-bold">
                          K
                        </div>
                        <span className="text-white text-xs font-medium">Kode Agency</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500 text-xs mb-3">
                      <span className="flex items-center gap-1.5 text-[#73e28a]">
                        <Calendar className="w-3.5 h-3.5" />
                        July 6, 2023
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5" />
                        0 Comments
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#73e28a] transition-colors leading-tight">
                      {['Advantages Of Hiring Consulting Firm', 'Finding Consulting Agency Engagement', 'What To Expect From A Consulting Agency', 'How To Suggest & Promote Your Firm', 'The Best Ways to Display Your Success', 'How To Agree To A Fair And Visible Contract'][i-1]}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                      Donec porta massa id dictum varius at tincidunt massa. Mauris dis mauris eu sed ellt. Dolor Pra interdum facilis...
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-16">
          <button className="w-10 h-10 rounded-full bg-[#73e28a] text-black font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#73e28a] focus:ring-offset-2 focus:ring-offset-slate-950">1</button>
          <button className="w-10 h-10 rounded-full border border-slate-700 text-slate-400 hover:border-[#73e28a] hover:text-[#73e28a] transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-[#73e28a] focus:ring-offset-2 focus:ring-offset-slate-950">2</button>
          <button className="w-10 h-10 rounded-full border border-slate-700 text-slate-400 hover:border-[#73e28a] hover:text-[#73e28a] transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-[#73e28a] focus:ring-offset-2 focus:ring-offset-slate-950">→</button>
        </div>
      </Section>
    </div>
  );
}