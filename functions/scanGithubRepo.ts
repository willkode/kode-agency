import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized. Please log in to run a scan.' }, { status: 401 });
    }

    const { github_url, scan_id } = await req.json();

    if (!github_url) {
      return Response.json({ error: 'GitHub URL is required' }, { status: 400 });
    }

    // Validate GitHub URL
    const githubRegex = /^https?:\/\/github\.com\/[^/]+\/[^/]+/;
    if (!githubRegex.test(github_url)) {
      return Response.json({ error: 'Please provide a valid GitHub repository URL' }, { status: 400 });
    }

    // Update scan status to scanning
    await base44.asServiceRole.entities.FrontendExporterScan.update(scan_id, {
      status: 'scanning'
    });

    // Convert github.com URL to raw API URL to fetch repo info
    const repoPath = github_url.replace('https://github.com/', '').replace(/\/$/, '');
    const apiBase = `https://api.github.com/repos/${repoPath}`;

    // Fetch repo metadata
    const repoRes = await fetch(apiBase, {
      headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'FrontendExporter/1.0' }
    });

    if (!repoRes.ok) {
      throw new Error(`Could not access repository. Make sure it is public. (Status: ${repoRes.status})`);
    }

    const repoData = await repoRes.json();

    // Fetch file tree
    const treeRes = await fetch(`${apiBase}/git/trees/HEAD?recursive=1`, {
      headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'FrontendExporter/1.0' }
    });

    let fileTree = [];
    if (treeRes.ok) {
      const treeData = await treeRes.json();
      fileTree = (treeData.tree || []).filter(f => f.type === 'blob').map(f => f.path);
    }

    // Fetch key file contents
    const KEY_FILES = [
      'package.json',
      'vite.config.js', 'vite.config.ts',
      'next.config.js', 'next.config.ts',
      'src/main.jsx', 'src/main.tsx', 'src/main.js',
      'src/App.jsx', 'src/App.tsx', 'src/App.js',
      'src/api/base44Client.js', 'src/api/base44Client.ts',
      'api/base44Client.js',
      '.env.example', '.env',
      'index.html',
      '_redirects',
      'vercel.json',
      'netlify.toml',
      'wrangler.toml',
      'src/Layout.js', 'src/Layout.jsx',
      'Layout.js', 'Layout.jsx'
    ];

    const fileContents = {};
    const filesToFetch = KEY_FILES.filter(f => fileTree.includes(f)).slice(0, 12);

    await Promise.all(filesToFetch.map(async (filePath) => {
      const rawUrl = `https://raw.githubusercontent.com/${repoPath}/HEAD/${filePath}`;
      const res = await fetch(rawUrl, { headers: { 'User-Agent': 'FrontendExporter/1.0' } });
      if (res.ok) {
        const text = await res.text();
        fileContents[filePath] = text.slice(0, 3000); // Cap at 3000 chars per file
      }
    }));

    // Sample some source files for analysis
    const srcFiles = fileTree.filter(f =>
      (f.startsWith('src/') || f.startsWith('pages/') || f.startsWith('components/') || f.startsWith('functions/')) &&
      (f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.ts') || f.endsWith('.tsx')) &&
      !KEY_FILES.includes(f)
    ).slice(0, 8);

    await Promise.all(srcFiles.map(async (filePath) => {
      const rawUrl = `https://raw.githubusercontent.com/${repoPath}/HEAD/${filePath}`;
      const res = await fetch(rawUrl, { headers: { 'User-Agent': 'FrontendExporter/1.0' } });
      if (res.ok) {
        const text = await res.text();
        fileContents[filePath] = text.slice(0, 2000);
      }
    }));

    // Build context string
    const fileTreeSummary = fileTree.slice(0, 200).join('\n');
    const fileContentsSummary = Object.entries(fileContents)
      .map(([path, content]) => `\n\n=== FILE: ${path} ===\n${content}`)
      .join('');

    const prompt = `You are a senior Base44 migration architect and code reviewer.

I have provided a GitHub repository: ${github_url}
Repo name: ${repoData.name}
Repo description: ${repoData.description || 'N/A'}
Default branch: ${repoData.default_branch}
Language: ${repoData.language}

## FILE TREE (first 200 files):
${fileTreeSummary}

## KEY FILE CONTENTS:
${fileContentsSummary}

---

Your job is to scan the entire repo and produce a migration plan that helps the developer:
1) Move ONLY the frontend off Base44 hosting (host externally, e.g. Cloudflare Pages / Vercel / Netlify / static hosting)
2) KEEP all backend functionality on Base44 (entities, auth, backend functions, integrations, permissions)

IMPORTANT:
- Do NOT suggest rewriting the app.
- Do NOT suggest building new pages unless absolutely required for migration.
- Do NOT suggest changing backend logic unless needed for compatibility.
- Focus on analysis + exact update instructions.
- Assume the smallest set of changes needed to keep the app working with Base44 as the backend (BaaS model).

Return EXACTLY this report structure in clean Markdown:

# 1. Executive Summary
- Can this app be migrated to external frontend hosting while keeping Base44 backend? (Yes/No/Mostly)
- Estimated migration complexity (Low / Medium / High)
- Top blockers (if any)

# 2. Repo Detection Summary
- Framework / build system
- Frontend entry points
- Base44-related directories/files
- Key config files found
- Auth-related files found
- Deployment config files found

# 3. Required Changes (Must Do)
For each required change:
- Priority: Critical / High / Medium / Low
- File path(s)
- What needs to change
- Why it matters
- Exact step-by-step instruction
- Affects: Frontend / Backend / Both

# 4. Recommended Changes (Should Do)
Same format, for non-critical improvements.

# 5. Hosting-Specific Setup Checklist
Checklists for:
- Cloudflare Pages
- Vercel
- Netlify
Each with: build command, output directory, SPA routing, required env vars, gotchas.

# 6. Base44 BaaS Connection Checklist
Copy-paste checklist to keep Base44 backend working from external frontend:
- SDK config
- App ID / Base URL variables
- Auth redirect URLs
- CORS/origin checks
- Backend function endpoint validation
- Post-deploy verification tests

# 7. Migration Test Plan (Step-by-Step)
Manual QA test plan:
- Auth tests
- CRUD tests
- Backend function tests
- File upload/download tests
- Integration tests
- Role/permission tests
- Browser console/network checks

# 8. Risk Register
| Risk | Impact | Likelihood | Mitigation | Rollback |
(table format)

# 9. Final Cutover Plan
- Pre-migration prep
- Staging deployment
- Validation
- DNS/domain cutover
- Post-cutover monitoring
- Rollback triggers

# Copy-Paste Action List (for AI Agent)
Sequential numbered task list another AI coding agent can execute safely, with clear CHECKPOINT markers after each step.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: null
    });

    const report = typeof result === 'string' ? result : JSON.stringify(result);

    // Extract executive summary for preview (locked state)
    const execSummaryMatch = report.match(/# 1\. Executive Summary([\s\S]*?)(?=# 2\.)/);
    const executiveSummary = execSummaryMatch ? execSummaryMatch[1].trim() : 'Migration analysis complete. Pay to unlock the full report.';

    // Extract complexity and can_migrate
    const complexityMatch = report.match(/complexity[:\s]*(Low|Medium|High)/i);
    const complexity = complexityMatch ? complexityMatch[1] : 'Medium';

    const canMigrateMatch = report.match(/\b(Yes|No|Mostly)\b/i);
    const canMigrate = canMigrateMatch ? canMigrateMatch[1] : 'Mostly';

    // Save completed scan - free, no payment needed
    await base44.asServiceRole.entities.FrontendExporterScan.update(scan_id, {
      status: 'completed',
      payment_status: 'completed',
      report,
      executive_summary: executiveSummary,
      complexity,
      can_migrate: canMigrate
    });

    return Response.json({ success: true, scan_id });

  } catch (error) {
    console.error('Scan error:', error);

    const base44 = createClientFromRequest(req);
    const { scan_id } = await req.json().catch(() => ({}));
    if (scan_id) {
      await base44.asServiceRole.entities.FrontendExporterScan.update(scan_id, {
        status: 'failed',
        error_message: error.message
      }).catch(() => {});
    }

    return Response.json({ error: error.message }, { status: 500 });
  }
});