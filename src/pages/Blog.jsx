import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.list(),
    initialData: [],
  });

  return (
    <div>
      <Section className="pt-32 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Insights & Resources</h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          Guides, tutorials, and thoughts on modern software development.
        </p>
      </Section>

      <Section>
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
             {[1, 2, 3].map(i => (
               <div key={i} className="space-y-4">
                 <Skeleton className="h-48 w-full rounded-xl bg-slate-800" />
                 <Skeleton className="h-6 w-3/4 bg-slate-800" />
                 <Skeleton className="h-4 w-full bg-slate-800" />
               </div>
             ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="p-0 overflow-hidden h-full flex flex-col group cursor-pointer">
                <div className="h-48 overflow-hidden relative">
                   <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
                   <img 
                     src={post.image_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"} 
                     alt={post.title} 
                     className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                   />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-wrap gap-2 mb-4">
                     {post.tags?.map(tag => (
                        <span key={tag} className="text-xs font-medium px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                           {tag}
                        </span>
                     ))}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                     {post.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-6 flex-grow line-clamp-3">
                     {post.summary}
                  </p>
                  <div className="flex items-center justify-between text-slate-500 text-xs mt-auto pt-4 border-t border-slate-800">
                     <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.created_date ? format(new Date(post.created_date), 'MMM d, yyyy') : 'Recent'}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.reading_time || '5 min'} read</span>
                     </div>
                  </div>
                </div>
              </Card>
            ))}
            {posts.length === 0 && (
              <div className="col-span-full text-center py-20">
                <p className="text-slate-500">No blog posts yet. Check back soon!</p>
              </div>
            )}
          </div>
        )}
      </Section>
      
      <Section className="bg-indigo-950/10 py-16">
         <div className="flex flex-col md:flex-row items-center justify-between bg-indigo-600 rounded-2xl p-8 md:p-12 max-w-5xl mx-auto">
            <div className="mb-6 md:mb-0 md:mr-8">
               <h3 className="text-2xl font-bold text-white mb-2">Get our free App Planning Checklist</h3>
               <p className="text-indigo-100">A comprehensive PDF to help you scope your idea before spending a dime.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
               <input type="email" placeholder="Enter your email" className="bg-white/10 border border-white/20 rounded px-4 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 flex-grow md:w-64" />
               <Button className="bg-white text-indigo-600 hover:bg-indigo-50">Download</Button>
            </div>
         </div>
      </Section>
    </div>
  );
}