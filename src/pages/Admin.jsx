import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Users, FolderKanban, Briefcase, Layout, FileText, Stethoscope, Zap, Receipt, ClipboardList, Menu, X, ChevronRight } from 'lucide-react';

import CRMSection from '@/components/admin/CRMSection';
import ProjectsSection from '@/components/admin/ProjectsSection';
import CareersSection from '@/components/admin/CareersSection';
import PortfolioSection from '@/components/admin/PortfolioSection';
import BlogSection from '@/components/admin/BlogSection';
import AppReviewsSection from '@/components/admin/AppReviewsSection';
import BuildSprintsSection from '@/components/admin/BuildSprintsSection';
import QuotesSection from '@/components/admin/QuotesSection';
import TaskTemplatesSection from '@/components/admin/TaskTemplatesSection';

const menuGroups = [
  {
    title: 'Sales',
    items: [
      { id: 'crm', label: 'CRM', icon: Users },
      { id: 'quotes', label: 'Quotes', icon: Receipt },
    ]
  },
  {
    title: 'Work',
    items: [
      { id: 'projects', label: 'Projects', icon: FolderKanban },
      { id: 'sprints', label: 'Build Sprints', icon: Zap },
      { id: 'reviews', label: 'App Reviews', icon: Stethoscope },
      { id: 'templates', label: 'Task Templates', icon: ClipboardList },
    ]
  },
  {
    title: 'Content',
    items: [
      { id: 'portfolio', label: 'Portfolio', icon: Layout },
      { id: 'blog', label: 'Blog', icon: FileText },
      { id: 'careers', label: 'Careers', icon: Briefcase },
    ]
  },
];

export default function AdminPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') || 'crm';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [convertingLead, setConvertingLead] = useState(null);

  const handleConvertToProject = (lead, projectType) => {
    const projectTypeLabels = {
      'app_review': 'App Review',
      'app_review_corrections': 'App Review + Corrections',
      'app_corrections': 'App Corrections',
      'other': 'Project'
    };
    const projectData = {
      title: `${lead.company || lead.name} - ${projectTypeLabels[projectType] || 'Project'}`,
      client_name: lead.name,
      client_email: lead.email,
      client_company: lead.company || '',
      budget: lead.deal_value ? String(lead.deal_value) : '',
      description: lead.description || '',
      lead_id: lead.id,
      project_type: projectType,
    };
    setConvertingLead(projectData);
    setActiveTab('projects');
  };

  const handleProjectCreated = () => {
    setConvertingLead(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24">
      <Section className="py-8">
        <GridBackground />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400">Manage leads, projects, and applicants</p>
            </div>
            
            {/* Tabs */}
            <div className="flex bg-slate-800 rounded-lg p-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    className={activeTab === tab.id ? 'bg-[#73e28a] text-black hover:bg-[#5dbb72]' : 'text-slate-400 hover:text-white hover:bg-slate-700'}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'crm' && (
            <CRMSection onConvertToProject={handleConvertToProject} />
          )}
          {activeTab === 'projects' && (
            <ProjectsSection 
              initialProject={convertingLead} 
              onProjectCreated={handleProjectCreated}
            />
          )}
          {activeTab === 'quotes' && (
            <QuotesSection />
          )}
          {activeTab === 'portfolio' && (
            <PortfolioSection />
          )}
          {activeTab === 'blog' && (
            <BlogSection />
          )}
          {activeTab === 'careers' && (
            <CareersSection />
          )}
          {activeTab === 'sprints' && (
            <BuildSprintsSection />
          )}
          {activeTab === 'reviews' && (
            <AppReviewsSection />
          )}
          {activeTab === 'templates' && (
            <TaskTemplatesSection />
          )}
        </div>
      </Section>
    </div>
  );
}