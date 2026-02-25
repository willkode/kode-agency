import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Users, FolderKanban, Briefcase, Layout, FileText, Stethoscope, Zap, Receipt, ClipboardList, Menu, X, ChevronRight, Smartphone, Rocket, Activity, GitBranch } from 'lucide-react';
import { base44 } from '@/api/base44Client';

import CRMSection from '@/components/admin/CRMSection';
import ProjectsSection from '@/components/admin/ProjectsSection';
import CareersSection from '@/components/admin/CareersSection';
import PortfolioSection from '@/components/admin/PortfolioSection';
import BlogSection from '@/components/admin/BlogSection';
import AppReviewsSection from '@/components/admin/AppReviewsSection';
import BuildSprintsSection from '@/components/admin/BuildSprintsSection';
import QuotesSection from '@/components/admin/QuotesSection';
import TaskTemplatesSection from '@/components/admin/TaskTemplatesSection';
import MobileAppSection from '@/components/admin/MobileAppSection';
import AppFoundationSection from '@/components/admin/AppFoundationSection';
import OperationsSection from '@/components/admin/OperationsSection';
import MigrationQuotesSection from '@/components/admin/MigrationQuotesSection';

const menuGroups = [
  {
    title: 'Sales',
    items: [
      { id: 'operations', label: 'Operations', icon: Activity },
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
      { id: 'mobileapp', label: 'Mobile App', icon: Smartphone },
      { id: 'foundation', label: 'App Foundation', icon: Rocket },
      { id: 'templates', label: 'Task Templates', icon: ClipboardList },
      { id: 'migration-quotes', label: 'Migration Quotes', icon: GitBranch },
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
  const initialTab = urlParams.get('tab') || 'operations';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [convertingLead, setConvertingLead] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [badges, setBadges] = useState({});

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const [sprints, reviews, mobileapp, foundation, migrationQuotes] = await Promise.all([
          base44.entities.BuildSprintRequest.filter({ payment_status: 'completed' }),
          base44.entities.AppReviewRequest.filter({ payment_status: 'completed' }),
          base44.entities.MobileAppConversionRequest.filter({ payment_status: 'completed' }),
          base44.entities.AppFoundationRequest.filter({ payment_status: 'completed' }),
          base44.entities.MigrationQuoteRequest.filter({ status: 'New' }),
        ]);
        setBadges({
          sprints: sprints.length,
          reviews: reviews.length,
          mobileapp: mobileapp.length,
          foundation: foundation.length,
          'migration-quotes': migrationQuotes.length,
        });
      } catch (_) {}
    };
    fetchBadges();
  }, []);

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

  const currentTabLabel = menuGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 ${sidebarOpen ? 'w-64' : 'w-0 lg:w-16'} border-r border-slate-800 transition-all duration-300 overflow-hidden flex flex-col`} style={{ backgroundColor: '#0f172a' }}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {sidebarOpen && (
            <span className="font-bold text-lg text-white">Admin</span>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="mb-6">
              {sidebarOpen && (
                <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {group.title}
                </div>
              )}
              <div className="space-y-1 px-2">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-[#73e28a] text-black font-medium' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && <span className="flex-1">{item.label}</span>}
                      {sidebarOpen && badges[item.id] > 0 && (
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none ${isActive ? 'bg-black/20 text-black' : 'bg-red-500 text-white'}`}>
                          {badges[item.id]}
                        </span>
                      )}
                      {!sidebarOpen && badges[item.id] > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-x-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Admin</span>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <span className="text-white font-medium">{currentTabLabel}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {activeTab === 'operations' && (
            <OperationsSection />
          )}
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
          {activeTab === 'mobileapp' && (
            <MobileAppSection />
          )}
          {activeTab === 'foundation' && (
            <AppFoundationSection />
          )}
          {activeTab === 'migration-quotes' && (
            <MigrationQuotesSection />
          )}
        </div>
      </main>
    </div>
  );
}