# TOOLS.md — Client-Side Sandbox API Contract
# Sean's Portfolio & LinkedIn Blog
# Last updated: 2026-07-08 | Version: 1.0

---

> **Purpose:** This file defines the binding API contract for all client-side JavaScript utility tools deployed to `tools.html`. Every tool — current and future — must be documented here before production code is written. This document is the single source of truth for tool inputs, outputs, validation logic, and security boundaries.

---

## ████ UNIVERSAL BROWSER SECURITY BOUNDARIES

These constraints are **non-negotiable** and apply to **every tool** in this repository without exception:

```
╔══════════════════════════════════════════════════════════════════╗
║  SECURITY INVARIANTS — ZERO EXCEPTIONS PERMITTED                ║
╠══════════════════════════════════════════════════════════════════╣
║  1. ZERO EXTERNAL NETWORK REQUESTS                              ║
║     Tools must not call fetch(), XMLHttpRequest, WebSocket,     ║
║     or any API endpoint — internal or external.                 ║
║     All data is either user-provided or hardcoded constants.    ║
║                                                                 ║
║  2. ZERO PII PERSISTENCE                                        ║
║     Tools must not write user inputs to localStorage,           ║
║     IndexedDB, cookies, or any cross-session storage.           ║
║     sessionStorage is permitted for non-PII UX state only.      ║
║                                                                 ║
║  3. VANILLA JS ONLY                                             ║
║     No frameworks (React, Vue, Alpine, etc.)                    ║
║     No libraries (Chart.js, D3, etc.)                           ║
║     SVG/Canvas APIs permitted for rendering only.               ║
║                                                                 ║
║  4. DETERMINISTIC OUTPUT                                        ║
║     Given the same inputs, a tool must always return the        ║
║     same outputs. No randomness, no time-dependent state.       ║
║                                                                 ║
║  5. GRACEFUL DEGRADATION                                        ║
║     Tools must handle invalid inputs with user-facing error     ║
║     messages — never throw uncaught exceptions to the console.  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## ████ TOOL REGISTRATION STANDARD

All tools must be registered in `app.js` via `ToolRegistry.register()` if they have a computational core. UI-only tools (checklist-style, etc.) may wire directly without registry registration.

```javascript
// Template for tool registration
ToolRegistry.register('tool-id', {
  name: 'Human-Readable Tool Name',
  version: '1.0.0',
  /**
   * @param {Object} inputs - Validated inputs object
   * @returns {Object} - Structured output object
   * @throws {Error} - If computation cannot complete (caught by ToolRegistry.run)
   */
  run(inputs) {
    // Validate inputs internally
    // Compute output
    // Return structured object — never return raw HTML
    return { /* output fields */ };
  }
});
```

---

## ████ ACTIVE TOOLS — API CONTRACTS

---

### Tool 001 — AI ROI Estimator

| Field | Value |
|---|---|
| Tool ID | `roi-estimator` |
| Registry Registered | ✅ Yes (`app.js`) |
| Panel ID | `panel-roi` |
| Toggle Button ID | `toggle-roi` |
| Form ID | `roi-form` |
| Output Container ID | `roi-output` |
| Status | ✅ Active |

#### Inputs

| Input ID | Type | Required | Range | Description |
|---|---|---|---|---|
| `roi-hours` | `number` | ✅ YES | 1–168 | Hours per week currently spent on the target workflow |
| `roi-rate` | `number` | ✅ YES | >0 | Average fully-loaded hourly rate for the worker(s) involved (USD) |
| `roi-efficiency` | `number` (range) | ✅ YES | 1–100 | Estimated percentage efficiency gain from automation |
| `roi-cost` | `number` | ❌ NO | ≥0 | One-time implementation cost (USD) — enables payback calculation |

#### Outputs

| Output Field | Type | Description |
|---|---|---|
| `savedHoursPerWeek` | `string` | Decimal hours recovered per week (1 decimal place) |
| `monthlySavings` | `string` | Monthly dollar savings (4.33 weeks/month multiplier) |
| `annualSavings` | `string` | Annual dollar savings (52 weeks/year) |
| `paybackWeeks` | `string` | Weeks to payback implementation cost (only if cost > 0) |

#### Computation Formula

```
savedHoursPerWeek  = hoursPerWeek × (efficiencyGain / 100)
weeklySavings      = savedHoursPerWeek × hourlyRate
monthlySavings     = weeklySavings × 4.33
annualSavings      = weeklySavings × 52
paybackWeeks       = implementationCost / weeklySavings  (if cost > 0)
```

#### Validation Rules
```
hoursPerWeek:     required, numeric, min: 1, max: 168
hourlyRate:       required, numeric, min: 1 (warn if > 500)
efficiencyGain:   required, integer, min: 1, max: 100
implementationCost: optional, numeric, min: 0
```

#### Error States
| Condition | User-Facing Message |
|---|---|
| Missing required fields | "Please fill in all required fields." |
| Efficiency gain out of range | "Efficiency gain must be between 1–100%." |
| Computation error | "Calculation error. Check your inputs." |

---

### Tool 002 — Workflow Complexity Scorer

| Field | Value |
|---|---|
| Tool ID | `workflow-complexity` (UI-only, no registry) |
| Panel ID | `panel-complexity` |
| Toggle Button ID | `toggle-complexity` |
| Form ID | `complexity-form` (implicit — uses div+button) |
| Output Container ID | `complexity-output` |
| Status | ✅ Active |

#### Inputs

| Input ID | Type | Required | Range | Description |
|---|---|---|---|---|
| `wf-steps` | range | ✅ YES | 1–50 | Number of discrete manual steps in the workflow |
| `wf-tools` | range | ✅ YES | 1–20 | Number of distinct tools or systems the workflow touches |
| `wf-decisions` | range | ✅ YES | 0–20 | Number of conditional decision branch points |
| `wf-errors` | range | ✅ YES | 0–50 | Current monthly error rate as a percentage |

#### Outputs

| Output Field | Type | Description |
|---|---|---|
| `score` | `integer` | Composite complexity score 0–100 |
| `levelLabel` | `string` | Human label: Low / Moderate / High / Very High |
| `barColor` | `string` | CSS color token for visual severity |
| `recommendation` | `string` | Actionable automation strategy recommendation |

#### Complexity Formula (Weighted)
```
score = min(100, round(
  (steps    / 50) × 30  +
  (tools    / 20) × 25  +
  (decisions / 20) × 25 +
  (errors   / 50) × 20
))
```

#### Score Interpretation Thresholds
| Score Range | Label | Bar Color | Strategy |
|---|---|---|---|
| 0–29 | Low Complexity | `--color-success` | Direct automation candidate |
| 30–59 | Moderate Complexity | `--color-warning` | Decompose then automate |
| 60–79 | High Complexity | `#FF9F0A` | Phased automation approach |
| 80–100 | Very High Complexity | `--color-error` | Process reengineering first |

---

### Tool 003 — Automation Readiness Auditor

| Field | Value |
|---|---|
| Tool ID | `automation-readiness` (UI-only, no registry) |
| Panel ID | `panel-audit` |
| Toggle Button ID | `toggle-audit` |
| Form container ID | `audit-checklist-form` |
| Output Container ID | `audit-output` |
| Status | ✅ Active |

#### Inputs (Checkbox Array)

| Checkbox ID | Weight | Criterion |
|---|---|---|
| `audit-1` | 15 | Process runs on a predictable, repeatable schedule |
| `audit-2` | 20 | Input data is structured (spreadsheet, database, API) |
| `audit-3` | 20 | Clear, documented rules govern every decision point |
| `audit-4` | 15 | Current process generates measurable performance data |
| `audit-5` | 10 | Stakeholders have agreed on success metrics upfront |
| `audit-6` | 10 | Existing tooling has accessible API or webhook capability |
| `audit-7` | 5 | Error recovery procedures are documented and tested |
| `audit-8` | 5 | At least one team member owns implementation accountability |

**Total maximum score: 100 points**

#### Outputs

| Output Field | Type | Description |
|---|---|---|
| `score` | `integer` | Weighted sum of passed criteria (0–100) |
| `barColor` | `string` | CSS color — green ≥70, yellow ≥40, red <40 |
| `resultItems` | `array` | Per-criterion pass/fail with weight displayed |

#### Score Interpretation
| Score | Assessment | Recommendation |
|---|---|---|
| 70–100 | Ready | Proceed with automation planning |
| 40–69 | Partially Ready | Address failing criteria first |
| 0–39 | Not Ready | Process maturation required before automation |

---

## ████ PLANNED TOOLS — PRE-APPROVED API CONTRACTS

*These tools are approved for development. Do not build until promoted from `TASKS.md` with a TASK-XXX assignment.*

---

### Tool 004 — Prompt Cost Analyzer *(In Development)*

| Field | Value |
|---|---|
| Tool ID | `prompt-cost-analyzer` |
| Status | ⏳ IN DEVELOPMENT (see TASK-019) |

#### Inputs

| Input | Type | Required | Description |
|---|---|---|---|
| `prompt-tokens` | number | YES | Average input tokens per request |
| `completion-tokens` | number | YES | Average output tokens per request |
| `requests-per-day` | number | YES | Expected daily request volume |
| `model-selection` | checkbox (multi) | YES | Models to compare: GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro |

#### Outputs (Per Selected Model)

| Output | Type | Description |
|---|---|---|
| `dailyCost` | string | Estimated daily API cost (USD) |
| `monthlyCost` | string | Estimated monthly API cost (USD, 30 days) |
| `annualCost` | string | Estimated annual cost (USD) |
| `costPerRequest` | string | Per-request cost (USD, 6 decimal places) |

#### Pricing Constants (Hardcoded — Verify Quarterly)
```javascript
// Pricing as of July 2026 — UPDATE EACH QUARTER
const MODEL_PRICING = {
  'gpt-4o': {
    inputPerMToken:  2.50,  // USD per 1M input tokens
    outputPerMToken: 10.00  // USD per 1M output tokens
  },
  'claude-3-5-sonnet': {
    inputPerMToken:  3.00,
    outputPerMToken: 15.00
  },
  'gemini-1-5-pro': {
    inputPerMToken:  1.25,  // up to 128K context
    outputPerMToken: 5.00
  }
};
```

#### Security: This tool MUST NOT call any pricing API. All pricing is hardcoded constants with a quarterly refresh reminder in code comments.

---

### Tool 005 — AI Vendor Selection Matrix *(Planned)*

| Field | Value |
|---|---|
| Tool ID | `vendor-selection-matrix` |
| Status | ⏳ PLANNED (not yet in TASKS.md) |

#### Criteria Dimensions (Weighted by user sliders)
- Cost efficiency (0–100 weight)
- Data privacy / on-premise option (0–100 weight)
- Latency / speed (0–100 weight)
- Context window size (0–100 weight)
- Developer tooling / ecosystem (0–100 weight)

#### Output
- Ranked vendor list with weighted scores
- Recommendation card for top vendor
- Comparison table (all vendors × all dimensions)

---

## ████ DEPRECATION POLICY

If a tool is removed or disabled:
1. Move its contract to a `## DEPRECATED TOOLS` section at the bottom of this file
2. Document the deprecation date and reason
3. Remove its DOM elements from `tools.html`
4. Remove or comment out its `ToolRegistry.register()` call in `app.js`
5. Update `PROJECT_PROGRESS.md` and `TASKS.md` to reflect removal

---

## ████ TOOL REVIEW CHECKLIST (Pre-Launch Gate)

Before publishing any tool to production, verify:

```
□ Tool ID documented in TOOLS.md with full API contract
□ ToolRegistry.register() call present in app.js (if computational)
□ Inputs validated before computation (type, range, required)
□ All error states produce user-facing toast messages
□ Output renders correctly at 375px, 768px, and 1280px viewport widths
□ No fetch(), XMLHttpRequest, WebSocket, or external URL calls
□ No localStorage or cookie writes containing user input data
□ Performance: computation completes in < 50ms for maximum input values
□ Accessible: form labels, aria attributes, keyboard navigable
□ Tool panel expand/collapse works via data-tool-toggle mechanism
□ badge status updated to badge--live on tool card
□ TOOLS.md updated with final input/output documentation
□ TASKS.md task marked [x] with validation gate evidence
```

---

*TOOLS.md is a binding contract. No tool enters tools.html without a documented contract here. Contracts are written BEFORE implementation, not after.*
