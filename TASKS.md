# TASKS.md — Deterministic Execution Queue
# Sean's Portfolio & LinkedIn Blog
# Last updated: 2026-07-08 | Schema version: 1.0

---

> **Purpose:** Every coding action taken on this repository must be traceable to an item in this file. Agents do not self-assign work. They pull from this queue in priority order, complete a task, validate it passes its success criteria, then mark it complete. No item is marked `[x]` without passing its validation gate.

---

## ████ VALIDATION GATE PROTOCOL

Before marking **any** task complete, the agent MUST verify:

```
GATE A — File Integrity
  □ Modified files save without syntax errors
  □ HTML validates (no unclosed tags, no missing required attrs)
  □ app.js runs without console errors on page load

GATE B — Visual Integrity  
  □ Canvas background: #000000 confirmed
  □ No design token violations introduced
  □ Responsive layout intact at 375px, 768px, 1280px

GATE C — Link Integrity
  □ All internal href links resolve to existing pages
  □ No broken anchor (#section) links

GATE D — Task-Specific
  □ Each task below lists its own specific success criteria
  □ Task-specific gate must pass BEFORE generic gates
```

---

## ████ PRIORITY 1 — CORE LAYOUT & LAUNCH READINESS

### BATCH 1A: Placeholder Content Replacement
*Must complete before any public sharing or LinkedIn post*

- [ ] **TASK-001** — Replace `hello@example.com` with real email address in `contact.html` and `index.html`
  - Files: `contact.html`, `index.html`
  - Success: `grep "hello@example.com" *.html` returns 0 results
  - Status: ⏳ AWAITING INPUT (Need real email from Sean)

- [ ] **TASK-002** — Replace `https://linkedin.com` placeholder with real LinkedIn profile URL
  - Files: All 4 HTML files (footer + contact info sections)
  - Success: `grep 'href="https://linkedin.com"' *.html` returns 0 results
  - Status: ⏳ AWAITING INPUT

- [ ] **TASK-003** — Replace `https://github.com` placeholder with real GitHub profile URL
  - Files: All 4 HTML files + project card links
  - Success: All `href="https://github.com"` instances updated to real URL
  - Status: ⏳ AWAITING INPUT

- [ ] **TASK-004** — Generate and add `favicon.ico` (32x32 + 16x16, dark "S" on #3E91FF background)
  - Files: New file `favicon.ico`, add `<link rel="icon">` to all HTML `<head>` sections
  - Success: Browser tab shows favicon on all 4 pages
  - Status: ⏳ TODO

### BATCH 1B: GitHub Repository Setup
*Execution by Sean; agent documents commands*

- [ ] **TASK-005** — Create GitHub repository
  - Commands: `git init && git add . && git commit -m "feat: initial baseline build"`
  - Then create remote: `gh repo create portfolio --public --source=. --push`
  - Success: `git remote -v` shows origin pointing to github.com
  - Status: ⏳ AWAITING ACTION (Sean)

- [ ] **TASK-006** — Activate GitHub Pages
  - Via GitHub UI: Settings → Pages → Deploy from branch: `main` / `root`
  - OR via CLI: `gh api repos/:owner/:repo/pages -X POST -f source.branch=main`
  - Success: `https://[username].github.io/[repo]` resolves and renders `index.html`
  - Status: ⏳ AWAITING TASK-005

---

## ████ PRIORITY 2 — DNS & CUSTOM DOMAIN HANDSHAKE

- [ ] **TASK-007** — Register custom domain
  - Candidates: `sean.dev`, `seanbuilds.ai` (check availability and price)
  - Recommended registrar: Cloudflare Registrar (at-cost pricing, built-in DNS)
  - Success: Domain registered, nameservers pointing to Cloudflare
  - Status: ⏳ AWAITING DECISION

- [ ] **TASK-008** — Configure DNS records for GitHub Pages
  - Add A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - Add CNAME: `www` → `[username].github.io`
  - In GitHub: Settings → Pages → Custom domain → Enter domain → Save
  - Success: `dig [domain] A` returns GitHub Pages IPs; SSL auto-provisions within 24h
  - Status: ⏳ AWAITING TASK-007

- [ ] **TASK-009** — Verify SSL certificate provisioned
  - Wait up to 24h after TASK-008 completion
  - Success: `https://[domain]` loads with valid Let's Encrypt certificate; no browser warnings
  - Status: ⏳ AWAITING TASK-008

- [ ] **TASK-010** — Create `CNAME` file in repository root for GitHub Pages custom domain enforcement
  - File content: single line containing the registered domain name
  - Success: File exists at repo root; GitHub Pages settings reflect custom domain
  - Status: ⏳ AWAITING TASK-008

---

## ████ PRIORITY 3 — BLOG CONTENT INGESTION

### Post #001: The eBay Frontline Resolution

- [ ] **TASK-011** — Write full Post #001 body content (target: 800–1,200 words)
  - Create: `post-001.html` using `index.html` as structural base
  - Sections required: Situation → Root Cause → System Applied → Numbers → Takeaways
  - Link `blog-card` for Post #001 in `index.html` to `post-001.html`
  - Success: Post loads, renders correctly, contains ≥ 800 words of real content
  - Status: ⏳ AWAITING CONTENT FROM SEAN

- [ ] **TASK-012** — Update Post #001 blog card badge from planning state to `badge--live`
  - File: `index.html`
  - Success: `<span class="badge badge--live">Published</span>` verified in source
  - Status: ⏳ AWAITING TASK-011

- [ ] **TASK-013** — Cross-post Post #001 to LinkedIn
  - Format: Native LinkedIn article OR link post with excerpt
  - Include: Link to `post-001.html` on live domain, 3 relevant hashtags
  - Success: LinkedIn post live with link resolving correctly
  - Status: ⏳ AWAITING TASK-009 + TASK-011

### Post #002: AP Wireless Data Integrity

- [ ] **TASK-014** — Write full Post #002 body content
  - Create: `post-002.html`
  - Core framework: Data pipeline diagnostic flowchart + validation layer design
  - Status: ⏳ AWAITING CONTENT FROM SEAN

- [ ] **TASK-015** — Cross-post Post #002 to LinkedIn
  - Status: ⏳ AWAITING TASK-014

### Post #003: First & Bowl Revenue Scaling

- [ ] **TASK-016** — Write full Post #003 body content
  - Create: `post-003.html`
  - Include: Pricing model table, upsell funnel diagram (HTML/CSS only), raw revenue numbers
  - Status: ⏳ AWAITING CONTENT FROM SEAN

- [ ] **TASK-017** — Cross-post Post #003 to LinkedIn
  - Status: ⏳ AWAITING TASK-016

---

## ████ PRIORITY 4 — TOOLS & CONVERSION OPTIMIZATION

- [ ] **TASK-018** — Wire contact form backend
  - Option A (Recommended): Formspree — `<form action="https://formspree.io/f/[id]" method="POST">`
  - Option B: Netlify Forms — add `netlify` attribute to form, requires Netlify deployment
  - Success: Test submission reaches inbox; honeypot field blocks spam bots
  - Status: ⏳ AWAITING DEPLOYMENT PLATFORM DECISION

- [ ] **TASK-019** — Build Prompt Cost Analyzer tool in `tools.html`
  - Inputs: Model selection, prompt tokens, completion tokens, requests/day
  - Pricing table: Hardcode from public provider pricing pages (GPT-4o, Claude, Gemini)
  - Output: Monthly cost comparison grid across models
  - Constraint: Zero external network requests — static pricing constants only
  - Success: Tool calculates and displays results entirely in-browser; passes TOOLS.md API contract
  - Status: ⏳ TODO (HIGH priority — promotes from BRAINSTORMING.md)

- [ ] **TASK-020** — Add sticky "Talk to a specialist →" bottom bar on `tools.html` (mobile only)
  - CSS: `position:fixed; bottom:0; left:0; right:0;` — visible only on `max-width:768px`
  - Link: → `contact.html`
  - Success: Visible and functional on iPhone SE (375px) viewport; hidden on desktop
  - Status: ⏳ TODO

- [ ] **TASK-021** — Generate Open Graph images for all 4 pages
  - Size: 1200×630px, dark OLED background, S24 Ultra design language
  - Add `<meta property="og:image" content="og-[pagename].jpg">` to each HTML `<head>`
  - Success: LinkedIn link preview renders correct image when sharing each page
  - Status: ⏳ TODO

---

## ████ PRIORITY 5 — LONG HORIZON

- [ ] **TASK-022** — Create `post-template.html` reusable base for all future post detail pages
- [ ] **TASK-023** — Generate `feed.xml` RSS feed aggregating all published posts
- [ ] **TASK-024** — Integrate Plausible Analytics (privacy-first, GDPR compliant)
- [ ] **TASK-025** — Build AI Vendor Selection Matrix tool (`tools.html` addition)
- [ ] **TASK-026** — Publish `dispute-resolution-engine` as standalone GitHub repo
- [ ] **TASK-027** — Publish `ap-data-validator` as standalone GitHub repo with README
- [ ] **TASK-028** — Build Process Decomposition Visualizer (vanilla SVG renderer)

---

## ████ COMPLETED TASKS

| Task ID | Description | Completed |
|---|---|---|
| TASK-INIT-001 | Generate all 11 baseline project files | 2026-07-08 |
| TASK-INIT-002 | Establish design system CSS tokens | 2026-07-08 |
| TASK-INIT-003 | Build interaction engine (app.js) | 2026-07-08 |
| TASK-INIT-004 | Deploy 3 functional tools in tools.html | 2026-07-08 |
| TASK-INIT-005 | Establish agent orchestration markdown layer | 2026-07-08 |

---

*Pull from this queue top-to-bottom within each priority level. Never mark a task complete without passing its defined success criteria. When adding new tasks, assign them to the correct priority tier and include success criteria before saving.*
