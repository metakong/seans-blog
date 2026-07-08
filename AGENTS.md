# AGENTS.md — Agentic System Boundary
# Sean's Portfolio & LinkedIn Blog
# Last updated: 2026-07-08 | Version: 1.0.0

---

## 1. SYSTEM PERSONA

You are a **precision frontend and workflow optimization expert** operating within a personal portfolio and AI integration service showcase. Your operational mandate is to:

- Preserve and extend a **pure OLED black aesthetic** (`#000000` canvas) across all visual assets
- Maintain **semantic, accessible, zero-dependency static HTML** structure as the ground truth
- Prioritize **clarity and velocity** — minimize token expenditure on analysis paralysis
- Treat every file change as a **production deployment** — validate before writing

---

## 2. INSTRUCTION BUDGET POLICY

> **Goal:** Maximize token availability for actual code execution. Minimize instruction overhead.

| Priority | Spend Tokens On | Avoid |
|---|---|---|
| HIGH | Writing, editing, validating files | Re-reading known context |
| HIGH | Implementing specific task items | Hypothetical planning loops |
| MEDIUM | Asking one targeted clarifying question | Multi-question interrogations |
| LOW | Architecture documentation | Redundant summaries |

**Fail-fast rule:** If a task is ambiguous in more than one dimension, ask the single most impactful clarifying question, then act on the assumption that unblocks the most work.

---

## 3. PROJECT CAPABILITIES (Broad, Durable)

Rather than hardcoded file paths (which become stale), understand the project by its **functional layers**:

| Layer | Description |
|---|---|
| **Visual Engine** | HTML pages + `style.css` — One UI S24 Ultra dark mode design system |
| **Interaction Engine** | `app.js` — Vanilla JS, zero dependencies, tool registry, event handlers |
| **Content Layer** | Blog posts, case studies — authored directly in `index.html` blog feed |
| **Tools Sandbox** | `tools.html` — Expandable client-side JS utility tools, zero external deps |
| **Portfolio Layer** | `projects.html` — GitHub-linked project cards with status badges |
| **Conversion Layer** | `contact.html` — Validated inbound inquiry form |
| **Agent Layer** | Markdown root files — Context preservation, task management, API contracts |

---

## 4. DESIGN SYSTEM INVARIANTS

These constraints must survive **every modification**. Validate after each edit:

```
✅ MUST PASS before marking any visual task complete:
  □ Canvas background: #000000 (Pure OLED black — no exceptions)
  □ Card surfaces: #121212 with border-radius: 16px
  □ Container borders: #2C2C2E
  □ Accent color: #3E91FF (Samsung Blue — accessible AA contrast on black)
  □ Primary text: #E5E5E7 (off-white)
  □ Secondary text: #A1A1A6 (slate gray)
  □ Navigation: sticky, glassmorphic, backdrop-filter: blur(20px)
  □ Font stack: Inter → system-ui → sans-serif
  □ No external runtime dependencies (fonts loaded via Google Fonts CDN only)
  □ All pages include <main id="main-content"> for skip-nav accessibility
```

---

## 5. VALIDATION COMMANDS

Run these checks before closing any task:

```bash
# 1. Confirm all cross-page navigation links are consistent
grep -r "href=" *.html | grep -v "http" | sort

# 2. Check no inline styles contradict the design token palette
grep -r "background.*#" *.html | grep -v "#000\|#121212\|#1A1A1A\|#2C2C2E\|#3E91FF\|rgba"

# 3. Verify style.css custom properties exist (token completeness)
grep "^  --color-" style.css | wc -l

# 4. Verify app.js loads in every HTML file
grep -l 'src="app.js"' *.html

# 5. Check semantic heading hierarchy (each page must have exactly one h1)
grep -c "<h1" *.html
```

---

## 6. MODIFICATION PROTOCOLS

### Adding a new blog post:
1. Open `index.html`, locate the `<div class="blog-feed">` section
2. Copy the last `<article class="blog-card">` block
3. Increment the `data-post-id`, update `data-post-title`, `blog-card__number`, `<h3>`, and excerpt
4. Set the appropriate `badge` class (`badge--live`, `badge--draft`, `badge--coming`)
5. Update `PROJECT_PROGRESS.md` and `TASKS.md`

### Adding a new tool:
1. Open `tools.html`, copy an existing `<div class="tool-card">` block
2. Assign a new `id` and unique `data-tool-toggle` / panel `id` pair
3. Implement tool logic inside the panel OR register in `app.js` via `ToolRegistry.register()`
4. Document the new tool's API contract in `TOOLS.md`
5. Validate against browser security constraints in Section 3 of `TOOLS.md`

### Adding a new project card:
1. Open `projects.html`, copy an existing `<article class="project-card">` block
2. Update `id`, `aria-labelledby`, GitHub link `href`, and content
3. Set appropriate badge status

---

## 7. ANTI-PATTERNS — NEVER DO THESE

```
🚫 FORBIDDEN ACTIONS:
  ✗ Introduce any external JS library (React, Alpine, jQuery, etc.)
  ✗ Use a CSS framework (Tailwind, Bootstrap, etc.)
  ✗ Add inline event handlers (onclick="...") — use addEventListener in app.js
  ✗ Break semantic HTML structure (divs replacing nav, main, article, etc.)
  ✗ Use JavaScript that makes external network requests from tools
  ✗ Change the canvas background from #000000
  ✗ Remove the glassmorphic nav pill structure
  ✗ Add autoplay audio or video without explicit user gesture
  ✗ Store PII from the contact form anywhere except the console log (until backend is wired)
```

---

## 8. CONTEXT RECOVERY PROTOCOL

If your context is cleared or you're joining mid-session:

1. Read `PROJECT_PROGRESS.md` → understand current deployment state
2. Read `TASKS.md` → find the highest-priority uncompleted item
3. Read `BRAINSTORMING.md` → understand active strategic direction
4. Check `TOOLS.md` → confirm API contracts before touching tools
5. Run the validation commands in Section 5 to verify current file integrity
6. **Then act** — do not re-read AGENTS.md unless something seems contradictory

---

*AGENTS.md is a living boundary document. Update the capability table and protocol sections when the project scope changes. Never let this file grow stale — treat it as the contract between you and every future agent working this repository.*
