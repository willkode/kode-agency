import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import GridBackground from '@/components/ui-custom/GridBackground';
import FloatingPixels from '@/components/ui-custom/FloatingPixels';
import GlowingOrb from '@/components/ui-custom/GlowingOrb';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from 'lucide-react';

export default function PortfolioPage() {
  const [filter, setFilter] = useState('All');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
    initialData: [],
  });

  const platforms = ["All", "Base44", "Lovable", "Replit", "Custom"];
  
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.platform === filter);

  return (
    <div className="bg-slate-950">
      <Section className="pt-32 pb-16 text-center relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={20} />
        <GlowingOrb position="top-right" size="400px" opacity={0.15} />
        
        <div className="relative z-10">
          <div className="inline-block px-4 py-2 bg-[#73e28a]/10 border border-[#73e28a]/30 rounded-full text-[#73e28a] text-sm font-semibold mb-6">
            Portfolio
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Case Studies</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            See how we've helped other founders and teams ship software.
          </p>
        </div>
      </Section>

      <Section>
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {platforms.map(platform => (
            <button
              key={platform}
              onClick={() => setFilter(platform)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === platform 
                  ? 'bg-[#73e28a] text-black' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="space-y-4">
                 <Skeleton className="h-64 w-full rounded-xl bg-slate-800" />
                 <Skeleton className="h-8 w-3/4 bg-slate-800" />
                 <Skeleton className="h-4 w-full bg-slate-800" />
               </div>
             ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden group p-0 h-full flex flex-col">
                <div className="h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={project.image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge variant="outline" className="border-[#73e28a]/50 text-[#73e28a] mb-2">
                        {project.platform}
                      </Badge>
                      <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                    </div>
                    {project.type && (
                      <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        {project.type}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-400 mb-6 flex-grow">
                    {project.description}
                  </p>
                  
                  <div className="border-t border-slate-800 pt-6 mt-auto">
                    <div className="flex items-center gap-2 text-green-400 font-medium mb-4">
                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                       Result: {project.short_result}
                    </div>
                    
                    {/* In a real app, this would link to a detail page */}
                    <button className="text-[#73e28a] hover:text-[#5dbb72] text-sm font-medium flex items-center gap-1 transition-colors">
                      Read full case study <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
            
            {filteredProjects.length === 0 && (
              <div className="col-span-full text-center py-20">
                <p className="text-slate-500">No projects found for this category yet.</p>
              </div>
            )}
          </div>
        )}
      </Section>
    </div>
  );
}