import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import FailureModesGuide from '@/components/knowledge-base/FailureModesGuide.jsx';
import { BookOpen, Search } from 'lucide-react';

function KnowledgeBaseInner() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const u = await base44.auth.me();
          setUser(u);
        }
      } catch (e) {
        // Public page, no auth required
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-[#73e28a]" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Knowledge Base</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Comprehensive guides for deploying, configuring, and troubleshooting your migration setup.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search failure modes, fixes, symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#73e28a] transition-colors"
            />
          </div>
        </div>

        {/* Main Content */}
        <FailureModesGuide />

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-lg text-center">
          <p className="text-slate-400 text-sm">
            Need more help? Check the migration wizard in the
            {user ? (
              <a href="/" className="text-[#73e28a] hover:underline ml-1">
                Migration Assistant
              </a>
            ) : (
              <span className="text-[#73e28a] ml-1">Migration Assistant</span>
            )}
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default function KnowledgeBase() {
  return <KnowledgeBaseInner />;
}