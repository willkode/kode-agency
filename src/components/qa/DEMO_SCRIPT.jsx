/**
 * 2-MINUTE DEMO SCRIPT — Frontend Migration Assistant
 * Audience: Customers, stakeholders, new users
 * Duration: 2 minutes
 * 
 * ─────────────────────────────────────────────────────────────────
 * OPENING (10 seconds)
 * ─────────────────────────────────────────────────────────────────
 * 
 * "The Frontend Migration Assistant helps you deploy self-hosted 
 *  frontends securely. It generates production-ready configs for 
 *  Nginx, Vercel, Netlify, and Cloudflare—without guessing."
 * 
 * ACTION: Show home page, scroll to key value props.
 * 
 * ─────────────────────────────────────────────────────────────────
 * STEP 1: PROJECT SETUP (15 seconds)
 * ─────────────────────────────────────────────────────────────────
 * 
 * "Let's create a new migration project. Start with basic details: 
 *  name, description, and your team."
 * 
 * ACTION: 
 *   1. Click "New Project" or navigate to MAProjects
 *   2. Show Step 1 form (app name, description)
 *   3. Fill in example: "Demo App"
 *   4. Click "Continue"
 * 
 * "We're capturing your project scope upfront. This helps us 
 *  generate configs tailored to YOUR app."
 * 
 * ─────────────────────────────────────────────────────────────────
 * STEP 2: CHOOSE HOSTING TARGET (20 seconds)
 * ─────────────────────────────────────────────────────────────────
 * 
 * "Next, pick your hosting platform. Each platform has different 
 *  deployment rules—we handle them all."
 * 
 * ACTION:
 *   1. Show radio options: Nginx, Cloudflare, Vercel, Netlify
 *   2. Select Nginx
 *   3. Fill form:
 *      - App Name: demo-app
 *      - Frontend Domain: https://app.example.com
 *      - API Base URL: https://api.base44.com/api/apps/YOUR_APP_ID
 *   4. Click "Continue"
 * 
 * "Each platform needs different config syntax. We auto-generate 
 *  the right one. Nginx needs a server block with SPA fallback rules."
 * 
 * ─────────────────────────────────────────────────────────────────
 * STEP 3: HEALTH SYSTEM (20 seconds)
 * ─────────────────────────────────────────────────────────────────
 * 
 * "Every deployment needs a way to detect outages. We set up a 
 *  health check endpoint so your frontend knows when backend is down."
 * 
 * ACTION:
 *   1. Show health endpoint panel
 *   2. Toggle "Deep Health Check" (optional)
 *   3. Explain: Simple = backend responds. Deep = query database.
 *   4. Click "Continue"
 * 
 * "Health endpoint runs every 30 seconds. If it times out, your 
 *  frontend shows: 'We're experiencing issues.' When service recovers, 
 *  banner disappears."
 * 
 * ─────────────────────────────────────────────────────────────────
 * STEP 4-5: EDGE WORKER & BANNER (20 seconds, optional)
 * ─────────────────────────────────────────────────────────────────
 * 
 * "For Cloudflare users: inject a banner script into all HTML 
 *  responses. The script polls health and displays outage messages."
 * 
 * ACTION (if time):
 *   1. Show edge worker mode options
 *   2. Show banner customization (text, color)
 *   3. Explain injection marker prevents double-injection
 *   4. Click "Continue"
 * 
 * ─────────────────────────────────────────────────────────────────
 * STEP 6: REVIEW PROFILE (15 seconds)
 * ─────────────────────────────────────────────────────────────────
 * 
 * "Review everything before we generate configs. You can snapshot 
 *  this profile to lock it—useful for team collaboration."
 * 
 * ACTION:
 *   1. Show Step 6 summary
 *   2. Point out key values
 *   3. (Optional) Click "Snapshot" to show profile locks
 *   4. Click "Continue"
 * 
 * "Snapshots are immutable. Great for: audit trails, rollbacks, 
 *  sharing with team without accidental edits."
 * 
 * ─────────────────────────────────────────────────────────────────
 * STEP 7: OUTPUTS & COPY (20 seconds)
 * ─────────────────────────────────────────────────────────────────
 * 
 * "Here are your production-ready configs. Copy any output and 
 *  paste into your deployment."
 * 
 * ACTION:
 *   1. Show outputs page with tabs
 *   2. Click through 2-3 tabs
 *   3. Show Nginx config — highlight try_files line
 *   4. Click copy button on Nginx config
 *   5. Paste in text editor to prove it works
 * 
 * "This Nginx config handles SPA routing, caches assets, proxies 
 *  API calls, adds security headers. All copy-paste ready."
 * 
 * ─────────────────────────────────────────────────────────────────
 * TEMPLATE LIBRARY (20 seconds)
 * ─────────────────────────────────────────────────────────────────
 * 
 * "Don't want the wizard? Browse our template library. Pre-configured 
 *  starters for every platform."
 * 
 * ACTION:
 *   1. Go to MATemplates
 *   2. Show template cards
 *   3. Click one (e.g., Vercel)
 *   4. Show preview
 *   5. (Optional) Click "Template Engine" toggle
 * 
 * "Each template has built-in tests. Renders with 50+ assertions 
 *  to catch issues before deployment."
 * 
 * ─────────────────────────────────────────────────────────────────
 * KNOWLEDGE BASE (10 seconds)
 * ─────────────────────────────────────────────────────────────────
 * 
 * "Stuck? Check our Knowledge Base for 7 common failure modes: 
 *  SPA 404 errors, login redirect loops, CORS issues, and more."
 * 
 * ACTION:
 *   1. Go to KnowledgeBase
 *   2. Expand one failure mode (e.g., "SPA Refresh Returns 404")
 *   3. Show symptoms, cause, fix steps, verification
 * 
 * "Each failure mode includes: symptoms, root cause, step-by-step 
 *  fixes, and how to verify the fix works."
 * 
 * ─────────────────────────────────────────────────────────────────
 * CLOSING (10 seconds)
 * ─────────────────────────────────────────────────────────────────
 * 
 * "That's it. In 2 minutes, you've generated deployment configs, 
 *  set up health monitoring, and learned how to troubleshoot. 
 *  Deploy with confidence."
 * 
 * ACTION:
 *   1. Return to home page
 *   2. Show key links (Projects, KnowledgeBase)
 * 
 * "Your team can collaborate on profiles, snapshot them for releases, 
 *  and audit every config change. Get started now."
 * 
 * ─────────────────────────────────────────────────────────────────
 * Q&A TIPS
 * ─────────────────────────────────────────────────────────────────
 * 
 * Q: "Can I customize the generated configs?"
 * A: "Absolutely. These are starting points. Modify as needed—
 *     they're copy-paste into your deployment."
 * 
 * Q: "What if my platform isn't listed?"
 * A: "We cover the top 4 (Nginx, Vercel, Netlify, Cloudflare). 
 *     Custom platforms? Templates are templates—adapt them to your setup."
 * 
 * Q: "Are the health endpoints production-ready?"
 * A: "They're examples. Real health checks depend on your architecture. 
 *     Templates show the pattern; implement the actual logic."
 * 
 * Q: "Is my data private?"
 * A: "Yes. Projects and profiles stay in your account. We don't 
 *     collect or share your deployment details."
 * 
 * ─────────────────────────────────────────────────────────────────
 * KEY TALKING POINTS
 * ─────────────────────────────────────────────────────────────────
 * 
 * 1. NO VENDOR LOCK-IN
 *    Outputs are standard configs (Nginx, JSON, JavaScript). 
 *    Use anywhere.
 * 
 * 2. REPRODUCIBILITY
 *    Snapshot profiles. Version configs. Audit who changed what.
 * 
 * 3. SECURITY
 *    Templates remind you not to hardcode secrets. Use env vars.
 *    Health checks don't expose credentials.
 * 
 * 4. TIME-SAVING
 *    2 minutes to generate what'd take 30 minutes manually. 
 *    No copy-paste errors.
 * 
 * 5. TEAM COLLABORATION
 *    Profiles lock, preventing accidental overwrites. 
 *    Perfect for handoffs.
 * 
 * ─────────────────────────────────────────────────────────────────
 * TIMING NOTES
 * ─────────────────────────────────────────────────────────────────
 * 
 * • 60 seconds: Steps 1-2, Outputs, copy demo
 * • 2 minutes: Follow script as written
 * • 5 minutes: Add template library deep-dive, Q&A, roadmap
 */

export default function DemoScript() {
  return null;
}