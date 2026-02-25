import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '@/components/ui-custom/Card';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, ExternalLink, Mail, MapPin, Calendar, DollarSign, Phone, Trash2, CheckCircle, Copy, FileText, ClipboardList, Send, Loader2, BellOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import moment from 'moment';

const statusColors = {
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusLabels = {
  pending: 'Unpaid',
  completed: 'Paid',
  failed: 'Cancelled',
};

const BASE44_PROMPT = `You are an expert code reviewer analyzing a live Base44 application. 
Scan the complete structure and configuration, all pages and functions of my app.
Your task is to analyze it thoroughly and respond ONLY with a detailed findings report.

Do NOT create any pages, interfaces, or automation workflows.
Do NOT provide code to build anything.
Simply analyze what I provide and return findings.


## YOUR ANALYSIS TASK

Conduct a comprehensive review across two dimensions:

### CODE QUALITY ASSESSMENT
- **Backend Function Quality**: Parameter validation, error handling, code patterns, reusability
- **Database Design**: Schema normalization, relationship integrity, field types, naming consistency
- **Access Rules**: CRUD rule logic, permission enforcement, data safety
- **Integration Setup**: Proper configuration, error handling, secret management
- **Overall Architecture**: Modularity, separation of concerns, maintainability

### SECURITY ASSESSMENT
- **Authentication & Authorization**: Proper identity verification, role enforcement, access control
- **Secrets Management**: API keys, credentials, tokens (stored securely, not hardcoded)
- **Data Access**: Access rules prevent unauthorized data exposure, sensitive fields protected
- **Input Validation**: Parameters validated to prevent injection attacks
- **Error Handling**: No sensitive information (stack traces, API URLs) exposed to client
- **Integration Security**: Third-party services properly authenticated, no credential leaks
- **Common Vulnerabilities**: SQL injection, XSS, CSRF, privilege escalation risks

---

## REPORT FORMAT

Return your analysis in the following structure:

## Code Quality Review

### Critical Issues
- [Issue 1]: [Description] → [Recommendation]
- [Issue 2]: [Description] → [Recommendation]
- [etc.]

### High Priority Findings
- [Finding 1]: [Description] → [Recommendation]
- [Finding 2]: [Description] → [Recommendation]
- [etc.]

### Medium Priority Findings
- [Finding 1]: [Description] → [Recommendation]
- [etc.]

### Low Priority Findings
- [Finding 1]: [Description] → [Recommendation]
- [etc.]

### Positive Observations
- [Good practice 1]: [Brief description]
- [Good practice 2]: [Brief description]
- [etc.]

---

## Security Review

### Critical Issues
- [Issue 1]: [Description] → [Recommendation]
- [Issue 2]: [Description] → [Recommendation]
- [etc.]

### High Priority Findings
- [Finding 1]: [Description] → [Recommendation]
- [Finding 2]: [Description] → [Recommendation]
- [etc.]

### Medium Priority Findings
- [Finding 1]: [Description] → [Recommendation]
- [etc.]

### Low Priority Findings
- [Finding 1]: [Description] → [Recommendation]
- [etc.]

### Positive Observations
- [Good practice 1]: [Brief description]
- [etc.]

---

## Summary

**Code Quality Score**: [1-10] with brief justification
**Security Score**: [1-10] with brief justification

**Total Issues by Severity**:
- Critical: [count]
- High: [count]
- Medium: [count]
- Low: [count]

**Top 5 Action Items** (prioritized by impact):
1. [Action 1]
2. [Action 2]
3. [Action 3]
4. [Action 4]
5. [Action 5]

**Estimated Effort to Remediate Critical/High Issues**: [rough estimate]

---

## ANALYSIS GUIDELINES

- Be specific: Reference exact function names, entity names, or field names when applicable
- Be actionable: Each finding should include a concrete recommendation
- Be thorough: Check for business logic flaws, not just syntax
- Be realistic: Distinguish between "must fix" and "nice to have"
- Flag assumptions: If I haven't provided certain information, note what's missing
- Context matters: Consider the app's purpose and user base when assessing risk severity

---

## NOW ANALYZE MY APP

Provide the full analysis in the report format above based on the data I share with you next.`;

const GPT_PROMPT = `You are a senior software architect and security expert. I will upload a ZIP file containing the entire codebase of a React + TypeScript (or React + JS) web application.

Your job is to UNPACK the ZIP, scan the codebase, and generate a detailed, customer-friendly, implementation-ready report.

IMPORTANT OUTPUT REQUIREMENTS
1) The report must be VERY detailed, well-organized, and written in a natural, client-friendly tone.
2) The report must be structured with clear headings and consistent formatting.
3) Every technical finding must include:
   - Severity (Critical / High / Medium / Low)
   - File path(s) and line number(s) where the issue appears
   - What we found (plain language)
   - Why it is a problem (security, reliability, maintainability, UX, business risk)
   - Risk if not fixed (concrete impact)
   - Recommended remediation (specific steps; code examples where helpful)
   - "Method: Prompt #" reference (do not paste the prompt here; only reference it)
   - Whether it requires backend changes (Yes/No)
4) At the VERY END of the report, include a section titled exactly:
   "Prompt Pack"
   - Include "AI Model instruction" first (ex: "Use Sonnet 4.5")
   - Include Prompt 0 as "Safety Rails"
   - Then include numbered prompts for each major fix (Prompt 1, Prompt 2, …)
   - Prompts must be copy/paste ready for a coding agent.
5) Include a separate section titled exactly:
   "RLS Audit (Row Level Security)"
   - List each data entity discovered in the codebase (or referenced by the app/backend functions)
   - Provide recommended Create / Read / Update / Delete rules per entity
   - For each entity include:
     - RLS recommendation summary (one sentence)
     - Why we recommend this
     - Risk if left public/full access
6) Include an "Executive Summary" that a non-technical customer can understand.
7) Include "Issue Totals" table by severity for:
   - Code Quality
   - Security
   - (Optional) RLS findings if you classify them separately
8) Include a "Fix Pack PR Plan" section that groups changes into small, low-risk PRs, in recommended order.
9) Include a "Verification & Test Plan" section after the checklist to confirm fixes and prevent regressions.
10) Produce the final report as an EDITABLE DOCUMENT (DOCX). If DOCX is not possible in your environment, produce clean Markdown that can be pasted into a document editor.

SCOPE: TWO PARALLEL REVIEWS

PART 1: CODE QUALITY REVIEW
Assess the codebase against these criteria:
1) Type Safety and TypeScript configuration
   - Is strict mode enabled (if TS exists)?
   - Where are types missing or any used?
   - Consistency across components/hooks/utils
2) Component architecture
   - Overly large components
   - Folder structure
   - Prop drilling / deep nesting
3) Hooks and state management
   - Rules of Hooks
   - Dependency arrays
   - State duplication / lifting issues
4) Code cleanliness
   - Dead code, commented code
   - Unused imports/vars
   - Naming and conventions
5) Testing
   - Coverage and gaps
   - Behavior vs implementation testing
6) Performance
   - Avoidable re-renders
   - Lazy loading / code splitting
   - Large lists and images optimization
7) Error handling and UX
   - Consistent error patterns
   - Loading states
   - Error boundaries
8) Accessibility
   - Semantic HTML
   - Keyboard support
   - ARIA usage where needed
   - Contrast risks (if detectable)

PART 2: SECURITY REVIEW (OWASP-aligned)
Assess against secure coding standards:
1) Input validation & XSS
   - dangerouslySetInnerHTML / raw HTML rendering
   - untrusted data rendering
2) Authentication & authorization
   - Client-only auth patterns
   - Hardcoded secrets
   - Authorization enforced server-side
3) API & data security
   - Sensitive data in logs
   - Token handling (URL leakage, localStorage, etc.)
   - CSRF considerations (where relevant)
4) Security headers (if applicable via hosting config)
   - CSP / HSTS / frame protection
5) Dependency security
   - package.json risks
   - version pinning and unused deps
6) Secrets & configuration
   - .env handling
   - build-time vs runtime secrets
7) Error handling
   - stack traces / sensitive messages leaked to client
8) Dangerous code patterns
   - eval / dynamic execution
   - injection patterns
   - IDOR (insecure direct object references)

DELIVERABLE STRUCTURE (REPORT OUTLINE)
Use this structure exactly (you can add subsections as needed):

1) Title page / header (app name if found) + report date
2) How to read this report
3) Scope and approach
4) Executive summary
5) Issue totals (table)
6) Recommended remediation sequence (PR plan)
7) Detailed findings and recommendations
   - Code Quality findings (organized by severity)
   - Security findings (organized by severity)
8) RLS Audit (Row Level Security)
   - Summary table
   - Per-entity CRUD rules + why + risk
9) Verification & test plan
10) Summary (updated scores + top actions + estimated effort)
11) Prompt Pack (at the very end)

WORKFLOW INSTRUCTIONS
A) Start by unpacking the ZIP and listing the file structure (high-level tree).
B) Identify key files (routing, auth, API layer, functions, state management, build config).
C) Perform both reviews and capture findings with file paths + line numbers.
D) Generate the report using the structure above.
E) Ensure every finding references a "Method: Prompt #".
F) At the end, generate the full "Prompt Pack" with Prompt 0 + all numbered prompts.

PROMPT NUMBERING RULES
- Prompt 0 = Safety Rails (always included)
- Prompts 1–N map to remediation items
- If multiple findings share the same fix approach, they can reference the same prompt number.
- Each prompt must have:
  - GOAL
  - CONTEXT / REFERENCES
  - TASKS
  - ACCEPTANCE CRITERIA
  - OUTPUT requirements

NOW BEGIN
1) Unpack and scan the uploaded ZIP.
2) Print the high-level file structure.
3) Then generate the full report and export it as a DOCX.

==========================================================
MANUAL FINDINGS ADD-ON (I WILL FILL THIS IN)
(Leave this section untouched if it is empty. If it contains content, you MUST incorporate it into the report in an "Extended Findings" section and update Prompt Pack accordingly.)

[Paste any extra findings here, with severity, file paths, and notes]
==========================================================`;

export default function AppReviewsSection({ readIds = [], onMarkRead }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [newProjectTitle, setNewProjectTitle] = useState('');

  const queryClient = useQueryClient();

  const copyPrompt = (type) => {
    const prompt = type === 'base44' ? BASE44_PROMPT : GPT_PROMPT;
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(type);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['appReviewRequests'],
    queryFn: () => base44.entities.AppReviewRequest.list('-created_date'),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.AppReviewRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appReviewRequests'] });
      setDeleteConfirm(null);
      setSelectedRequest(null);
    },
  });

  const markCompleteMutation = useMutation({
    mutationFn: (id) => base44.entities.AppReviewRequest.update(id, { payment_status: 'completed' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appReviewRequests'] });
      setSelectedRequest(prev => prev ? { ...prev, payment_status: 'completed' } : null);
    },
  });

  const sendPaymentLinkMutation = useMutation({
    mutationFn: async (request) => {
      const amount = request.include_fix ? 150 : 50;
      const description = `Base44 ER App Review${request.include_fix ? ' + Fix' : ''}`;
      return base44.functions.invoke('sendPaymentLinkEmail', {
        requestId: request.id,
        service: 'Base44ER',
        email: request.email,
        name: request.name,
        amount,
        description
      });
    },
    onSuccess: () => {
      alert('Payment link sent successfully!');
    },
    onError: (error) => {
      alert('Failed to send payment link: ' + error.message);
    }
  });

  const createTaskMutation = useMutation({
    mutationFn: async ({ request, projectId, newProjectTitle }) => {
      let finalProjectId = projectId;
      if (projectId === 'new' && newProjectTitle) {
        const newProject = await base44.entities.Project.create({
          title: newProjectTitle,
          client_name: request.name,
          client_email: request.email,
          platform: 'Base44',
          status: 'Planning',
          priority: 'High',
          description: `App Review project for ${request.name}`,
          app_url: request.app_url
        });
        finalProjectId = newProject.id;
      }
      return base44.entities.Task.create({
        name: `App Review: ${request.name}`,
        project_id: finalProjectId,
        status: 'To Do',
        priority: 'High',
        description: `App Review Request from ${request.name}\n\nApp URL: ${request.app_url}\n\nIssue Description:\n${request.issue_description}\n\nClient Email: ${request.email}\nClient Phone: ${request.phone || 'Not provided'}\nCountry: ${request.country || 'Not provided'}\nInclude Fix: ${request.include_fix ? 'Yes' : 'No'}`,
        notes: `Created from App Review Request ID: ${request.id}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowCreateTask(false);
      setSelectedProjectId('');
      setNewProjectTitle('');
      alert('Task created successfully!');
    },
  });

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.app_url?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search by name, email, or app URL..."
              className="pl-10 bg-slate-800 border-slate-700 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            onClick={() => copyPrompt('base44')}
            className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
          >
            <FileText className="w-4 h-4 mr-2" />
            {copiedPrompt === 'base44' ? 'Copied!' : 'Copy Base44 Prompt'}
          </Button>
          <Button
            size="sm"
            onClick={() => copyPrompt('gpt')}
            className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
          >
            <FileText className="w-4 h-4 mr-2" />
            {copiedPrompt === 'gpt' ? 'Copied!' : 'Copy GPT Prompt'}
          </Button>
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'completed', 'failed'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={statusFilter === status 
                ? 'bg-[#73e28a] text-black hover:bg-[#5dbb72]' 
                : 'border-slate-700 text-slate-400 hover:text-white'}
            >
              {status === 'all' ? 'All' : statusLabels[status]}
            </Button>
          ))}
        </div>
      </div>

      {/* Requests Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <Card key={i} className="p-6 bg-slate-900/50 border-slate-800 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-slate-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-2/3"></div>
            </Card>
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card className="p-12 text-center bg-slate-900/50 border-slate-800">
          <p className="text-slate-400">No app review requests found.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((request) => (
            <Card 
              key={request.id} 
              className="p-6 bg-slate-900/50 border-slate-800 hover:border-[#73e28a]/50 cursor-pointer transition-colors"
              onClick={() => setSelectedRequest(request)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-white text-lg">{request.name}</h3>
                <Badge className={`${statusColors[request.payment_status || 'pending']} border`}>
                  {statusLabels[request.payment_status || 'pending']}
                </Badge>
              </div>
              <p className="text-slate-400 text-sm mb-2">{request.email}</p>
              <p className="text-slate-500 text-sm truncate mb-4">{request.app_url}</p>
              <p className="text-slate-400 text-xs">
                {moment(request.created_date).format('MMM D, YYYY h:mm A')}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold">{selectedRequest.name}</DialogTitle>
                  <Badge className={`${statusColors[selectedRequest.payment_status || 'pending']} border text-sm px-3 py-1`}>
                    {statusLabels[selectedRequest.payment_status || 'pending']}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                    <Mail className="w-5 h-5 text-[#73e28a]" />
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <button 
                        onClick={() => copyEmail(selectedRequest.email)}
                        className="text-white hover:text-[#73e28a] flex items-center gap-2"
                      >
                        {selectedRequest.email}
                        {copiedEmail ? <CheckCircle className="w-3 h-3 text-[#73e28a]" /> : <Copy className="w-3 h-3 text-slate-500" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                    <Phone className="w-5 h-5 text-[#73e28a]" />
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      {selectedRequest.phone ? (
                        <a href={`tel:${selectedRequest.phone}`} className="text-white hover:text-[#73e28a]">
                          {selectedRequest.phone}
                        </a>
                      ) : (
                        <p className="text-slate-500">Not provided</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                    <MapPin className="w-5 h-5 text-[#73e28a]" />
                    <div>
                      <p className="text-xs text-slate-500">Country</p>
                      <p className="text-white">{selectedRequest.country || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#73e28a]" />
                    <div>
                      <p className="text-xs text-slate-500">Submitted</p>
                      <p className="text-white">{moment(selectedRequest.created_date).format('MMM D, YYYY h:mm A')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg col-span-2">
                    <DollarSign className="w-5 h-5 text-[#73e28a]" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500">Payment</p>
                      <div className="flex items-center gap-3">
                        <p className={`font-bold ${selectedRequest.payment_status === 'completed' ? 'text-green-400' : selectedRequest.payment_status === 'failed' ? 'text-red-400' : 'text-amber-400'}`}>
                          {statusLabels[selectedRequest.payment_status || 'pending']}
                          {selectedRequest.payment_status === 'completed' && selectedRequest.payment_amount && (
                            <span className="text-white font-normal ml-2">${selectedRequest.payment_amount.toLocaleString()}</span>
                          )}
                        </p>
                        {(selectedRequest.payment_status === 'pending' || !selectedRequest.payment_status) && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs"
                            onClick={() => sendPaymentLinkMutation.mutate(selectedRequest)}
                            disabled={sendPaymentLinkMutation.isPending}
                          >
                            {sendPaymentLinkMutation.isPending ? (
                              <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Sending...</>
                            ) : (
                              <><Send className="w-3 h-3 mr-1" /> Send Payment Link</>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* App URL */}
                <div className="p-4 bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2">App URL</p>
                  <a 
                    href={selectedRequest.app_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#73e28a] hover:underline break-all"
                  >
                    {selectedRequest.app_url}
                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  </a>
                </div>

                {/* Issue Description */}
                <div className="p-4 bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2">Issue Description</p>
                  <p className="text-slate-300 whitespace-pre-wrap">{selectedRequest.issue_description}</p>
                </div>

                {/* Admin Invite Status */}
                <div className="p-4 bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2">Admin Invite</p>
                  <p className="text-slate-300">
                    {selectedRequest.admin_invite_sent 
                      ? '✅ User confirmed they sent the admin invite' 
                      : '⏳ Pending admin invite to iamwillkode@gmail.com'}
                  </p>
                </div>

                {/* Create Task Section */}
                {showCreateTask ? (
                  <div className="p-4 bg-slate-800 rounded-lg space-y-3">
                    <p className="text-sm text-slate-400">Select a project to create a task:</p>
                    <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                      <SelectTrigger className="bg-slate-900 border-slate-700">
                        <SelectValue placeholder="Select Project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">+ Create New Project</SelectItem>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>{project.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedProjectId === 'new' && (
                      <Input
                        placeholder="New project title..."
                        className="bg-slate-900 border-slate-700"
                        value={newProjectTitle}
                        onChange={(e) => setNewProjectTitle(e.target.value)}
                      />
                    )}
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-[#73e28a] hover:bg-[#5dbb72] text-black"
                        disabled={(!selectedProjectId || (selectedProjectId === 'new' && !newProjectTitle)) || createTaskMutation.isPending}
                        onClick={() => createTaskMutation.mutate({ request: selectedRequest, projectId: selectedProjectId, newProjectTitle })}
                      >
                        {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-slate-700 text-slate-300 hover:text-white"
                        onClick={() => { setShowCreateTask(false); setSelectedProjectId(''); setNewProjectTitle(''); }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : null}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  {selectedRequest.payment_status !== 'completed' && (
                    <Button 
                      variant="outline" 
                      className="border-[#73e28a]/50 text-[#73e28a] hover:bg-[#73e28a]/20"
                      onClick={() => markCompleteMutation.mutate(selectedRequest.id)}
                      disabled={markCompleteMutation.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> 
                      {markCompleteMutation.isPending ? 'Marking...' : 'Mark Complete'}
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                    onClick={() => setShowCreateTask(true)}
                  >
                    <ClipboardList className="w-4 h-4 mr-2" /> Create Task
                  </Button>
                  <Button 
                    className="flex-1 bg-[#73e28a] hover:bg-[#5dbb72] text-black"
                    onClick={() => window.open(selectedRequest.app_url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" /> Open App
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                    onClick={() => setDeleteConfirm(selectedRequest)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review Request</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete the review request from <strong className="text-white">{deleteConfirm?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => deleteMutation.mutate(deleteConfirm?.id)}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}