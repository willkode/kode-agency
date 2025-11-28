import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import PageHero from '@/components/ui-custom/PageHero';
import SectionLabel from '@/components/ui-custom/SectionLabel';
import RotatingBadge from '@/components/ui-custom/RotatingBadge';
import GridBackground from '@/components/ui-custom/GridBackground';
import FloatingPixels from '@/components/ui-custom/FloatingPixels';
import GlowingOrb from '@/components/ui-custom/GlowingOrb';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, ArrowUpRight } from 'lucide-react';

export default function PortfolioPage() {
  const [filter, setFilter] = useState('All');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
    initialData: [],
  });

  const categories = ["All", "Development", "Marketing"];
  
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  // Sample projects if none exist
  const sampleProjects = [
    {
      id: 1,
      title: "SaaS Dashboard",
      platform: "Base44",
      type: "Web App",
      description: "Full-featured analytics dashboard with real-time data visualization and team collaboration.",
      short_result: "Launched in 6 weeks",
      image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "E-Commerce Platform",
      platform: "Custom",
      type: "SaaS",
      description: "Complete marketplace solution with payment processing and inventory management.",
      short_result: "40% conversion increase",
      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Mobile App MVP",
      platform: "Lovable",
      type: "Mobile App",
      description: "Cross-platform mobile application for fitness tracking and social features.",
      short_result: "10k+ downloads",
      image_url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Internal Tools Suite",
      platform: "Base44",
      type: "Internal Tool",
      description: "Custom CRM and project management tools for enterprise operations.",
      short_result: "50% time saved",
      image_url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop"
    },
  ];

  const displayProjects = projects.length > 0 ? filteredProjects : sampleProjects;

  return (
    <div className="bg-slate-950 text-white">
      {/* Hero */}
      <PageHero 
        title="Portfolio" 
        backgroundImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&auto=format&fit=crop"
      />

      {/* Portfolio Grid */}
      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={20} />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
            <div>
              <SectionLabel text="Recent Works Gallery" />
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Our Recent<br />
                Project House
              </h2>
            </div>
            <div className="mt-6 lg:mt-0">
              <RotatingBadge size={100} />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-start gap-3 mb-12">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  filter === category 
                    ? 'bg-[#73e28a] text-black' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {category}
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
              {displayProjects.map((project, index) => (
                <Card key={project.id} className="overflow-hidden group p-0 h-full flex flex-col bg-slate-900/80">
                  <div className="overflow-hidden relative h-56">
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10" />
                    <img 
                      src={project.image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"} 
                      alt={project.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-end p-6">
                      <div className="w-12 h-12 rounded-full bg-[#73e28a] flex items-center justify-center">
                        <ArrowUpRight className="w-5 h-5 text-black" />
                      </div>
                    </div>
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
                        <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                          {project.type}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-slate-400 mb-6 flex-grow">
                      {project.description}
                    </p>
                    
                    <div className="border-t border-slate-800 pt-6 mt-auto">
                      <div className="flex items-center gap-2 text-[#73e28a] font-medium mb-4">
                         <span className="w-2 h-2 bg-[#73e28a] rounded-full animate-pulse"></span>
                         Result: {project.short_result}
                      </div>
                      
{project.app_url && (
                        <a 
                          href={project.app_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#73e28a] hover:text-[#5dbb72] text-sm font-medium flex items-center gap-2 transition-colors group"
                        >
                          View Live App
                          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              
              {displayProjects.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <p className="text-slate-500">No projects found for this category yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-24 bg-slate-900/30 relative overflow-hidden">
        <GlowingOrb position="center" size="500px" opacity={0.1} />
        
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Want your project here?
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            Let's build something amazing together and add it to our portfolio.
          </p>
          <Link to={createPageUrl('Contact')}>
            <button className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold h-14 px-10 text-lg rounded-lg transition-colors">
              Start Your Project
            </button>
          </Link>
        </div>
      </Section>
    </div>
  );
}