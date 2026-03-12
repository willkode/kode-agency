import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MessageSquare, Calendar, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

const TIMELINE_ICONS = {
  'Email': Mail,
  'Call': Phone,
  'Meeting': Calendar,
  'Note': MessageSquare,
  'Task': CheckCircle,
  'Status Change': TrendingUp,
};

export default function CommunicationTimeline({ activities = [], emails = [] }) {
  // Combine activities and emails into unified timeline
  const timeline = [
    ...activities.map(a => ({ ...a, type: a.type, created_date: a.created_date, source: 'activity' })),
    ...emails.map(e => ({ 
      ...e, 
      type: 'Email', 
      description: `${e.direction === 'sent' ? 'Sent' : 'Received'}: ${e.subject}`,
      created_date: e.created_date,
      source: 'email',
      email_body: e.body,
      email_status: e.status
    }))
  ].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  if (timeline.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No communication history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {timeline.map((item, index) => {
        const Icon = TIMELINE_ICONS[item.type] || MessageSquare;
        const isEmail = item.source === 'email';
        
        return (
          <div key={`${item.source}-${item.id}-${index}`} className="flex gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              isEmail 
                ? 'bg-blue-500/20' 
                : 'bg-slate-700'
            }`}>
              <Icon className={`w-4 h-4 ${isEmail ? 'text-blue-400' : 'text-slate-400'}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="border-slate-700 text-slate-300 text-xs">
                  {item.type}
                </Badge>
                {isEmail && item.email_status === 'failed' && (
                  <Badge className="bg-red-500/20 text-red-400 text-xs">Failed</Badge>
                )}
                <span className="text-slate-500 text-xs ml-auto">
                  {new Date(item.created_date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <p className="text-slate-300 text-sm">{item.description}</p>
              
              {isEmail && item.email_body && (
                <details className="mt-2">
                  <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-400">
                    View email content
                  </summary>
                  <div className="mt-2 p-3 bg-slate-900 rounded text-xs text-slate-400 whitespace-pre-wrap border border-slate-700">
                    {item.email_body}
                  </div>
                </details>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}