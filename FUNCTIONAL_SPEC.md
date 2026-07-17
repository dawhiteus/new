# Transaction Manager — Functional Specification
**LiquidSpace · Broker Deal Management Tool**
Version 1.0 · March 2026

---

## 1. Overview

Transaction Manager is a broker-facing deal management application embedded within the broader LiquidSpace platform. It enables brokers to track, manage, and advance workspace requirements (deals) through a structured 6-stage workflow, with AI agent support throughout.

**Primary users:** LiquidSpace brokers and deal coordinators
**Core job to be done:** Manage a portfolio of client workspace requirements from first contact to signed agreement, with AI agents reducing manual work at each stage.

---

## 2. Application Shell

### 2.1 Layout
- Chrome header (top, 64px, full width) above a fixed sidebar (left) + scrollable main content area (right)
- Sidebar: 244px, always visible, no collapse
- When the AI Drawer is open, the main content area shifts left by 424px (animated, `cubic-bezier(0.23, 1, 0.32, 1)`)

### 2.2 Chrome Header & Co-branding

The chrome header (`ChromeHeader`, 64px, white, 1px bottom border) spans the full viewport width above the sidebar and content area.

**Left — co-brand lockup** (`CoBrand`). The customer brand leads; LiquidSpace is de-emphasized:

1. **Customer logo/wordmark** — full color, rendered first. (The prototype renders the profile's org name as a wordmark in `#005b94`; production substitutes the customer's uploaded logo from Branding → Header Image.)
2. Vertical 1px divider (28px tall, `#e5e7eb`)
3. **LiquidSpace lockup, grayscale** (`#9ca3af`) — glyph + wordmark with a "POWERED BY" microlabel (7px, uppercase, 0.18em tracking) above the wordmark.

When there is no customer co-brand (e.g., internal LiquidSpace profiles), the LiquidSpace lockup renders alone in primary brand blue with no "POWERED BY" label.

**Right — utility cluster:** search (⌘K), notifications (with red count badge), settings, then the user pill (avatar initials + menu icon, `#005b94` outline).

### 2.3 Universal Navigation Sidebar

The sidebar is a shared React component (`SidebarA`) used across all LiquidSpace SaaS apps. It is CSS-isolated from host apps via `all: initial` on the `<aside>` root and uses only inline styles — no CSS classes. This guarantees identical rendering regardless of the host app's Tailwind version or global stylesheet.

#### Structure: Pillars → Groups → Items → Children

```
Pillar (product)
  └── Group (functional area)
        └── Item (nav destination)
              └── Child item (sub-destination, optional)
```

**Pillars** are top-level product sections, listed in order: **Workplace Strategist** first, then **Workplace Operations**. Each renders as a collapsible header row with a colored icon badge. Both start expanded by default.

**Groups** are labeled sections within a pillar (Workplace Manager, License Administrator, Transaction Manager). Groups are collapsible; groups with only one group in their pillar hide the group header.

**Items** are individual navigation destinations. Items with children show a rotating chevron and expand in place when clicked — the parent row shows active state when any child is active.

**Child items** render indented (paddingLeft 28px) below their parent when the parent is expanded.

#### IA Rule: When to use children vs. in-page tabs

Nav children are **only** used for distinct data destinations — separate datasets, each with their own chart, table, and modals — where a user meaningfully "navigates to" a different data context.

Settings-style facets (General / Admins / SSO / Integrations) belong to **in-page tab bars**, not nav children. The rule in practice:

| Item | Pattern | Reason |
|---|---|---|
| Activity → Reservations / Searches / Reviews | Nav children | Separate datasets; distinct chart + table + modals per view |
| Setup → General / Admins / SSO / Integrations | In-page tabs | Same settings page, different facets |
| Branding → General / Onboarding / Portal / Email | In-page tabs | Same settings page, different facets |
| Teams, Locations | Single nav items | Each is a single page with internal controls |

#### Navigation behavior

Navigation is **hostname-based**:
- If the destination URL's hostname matches `window.location.hostname` → client-side routing (React Router / Next.js router, no page reload)
- Otherwise → `window.location.href = url` (full-page navigation, same tab)

Users control new-tab behavior via standard browser conventions (⌘-click, right-click → Open in New Tab). The nav never forces a new tab.

In the nav prototype (`App.tsx`), all links open in a new tab via `window.open` so the prototype itself stays visible during demos.

#### Canonical app URLs

| App | Canonical URL |
|---|---|
| Transaction Manager | `https://transaction-manager-git-main-david-4453s-projects.vercel.app` |
| Workplace Strategist | `https://workplacestrategist-internal.vercel.app` |

The TM git-main URL is stable across deploys. Never use deployment-hash URLs or `labs.liquidspace.app` in nav-data. The WS URL is its own Vercel project — TM deploys must never alias it.

#### Current IA

Pillars appear in this order: Workplace Strategist, then Workplace Operations.

**Workplace Strategist** (color `#00b8c4`)

| Group | Item | URL |
|---|---|---|
| Workplace Strategist | Portfolio Compiler | `workplacestrategist-internal.vercel.app/portfolio-compiler` |
| | Scenario Modeler | `workplacestrategist-internal.vercel.app/scenario-modeler` |
| | Hub Locator | `workplacestrategist-internal.vercel.app/hub-locator` |

**Workplace Operations** (color `#005b94`)

| Group | Item | Children | URL |
|---|---|---|---|
| Workplace Manager | Dashboard | — | `/workplace/dashboard` (TM app) |
| | Teams | — | `/workplace/teams` |
| | Locations | — | `/workplace/locations` |
| | Activity | Reservations, Searches, Reviews | `/workplace/activity/{reservations,searches,reviews}` |
| | Setup | — | `/workplace/setup` |
| | Branding | — | `/workplace/branding` |
| License Administrator | License Tracker | — | `/license/tracker` |
| | Payments | — | `/license/payments` |
| | Funding Sources | — | `/license/funding` |
| | Tasks | — | `/license/tasks` |
| Transaction Manager | Transactions | — | `/transactions/list` |
| | Tasks | — | `/transactions/tasks` |

#### Visual states

| State | Background | Text/Icon |
|---|---|---|
| Active | `#005b94` | White |
| Hover (inactive) | `#f8f9fa` | `#374151` / `#6b7280` |
| Locked | Transparent | `#9ca3af`, lock icon |
| Default | Transparent | `#374151` / `#6b7280` |

#### Demo branding

All Workplace Manager page content uses the fictitious company **Tel Tech**. Do not use real company names (Airbnb, Slalom, etc.) in page content or spec examples.

### 2.4 Page Headers (in-content)

Page headers live **inside the content area**, below the chrome header and to the right of the sidebar. They are owned by the destination app, scroll with the page (not sticky), and must never duplicate what the chrome header owns — no brand marks, no user/utility controls.

There are exactly **two sanctioned tiers**, chosen by page type. No other variants.

#### Tier 1 — Blue Page Header band (operational / management pages)

For pages whose content is forms, tables, and workflows: Transactions, Tasks, Teams, Locations, Activity, Setup, Branding, License Tracker, Payments, Funding Sources.

- Blue gradient banner: `#004A7C → #005B94 → #0071B8` (135°), ~28px vertical padding
- Icon + title (28px/700, white) + subtitle (14px, white/75%)
- Optional page-level primary action, top right (e.g. "+ New Requirement"), white/15% background
- Rationale: these pages are scannable lists/forms — the band's height costs nothing and gives identity, orientation, and a stable home for the page action.

#### Tier 2 — Slim context toolbar (analytical workbench pages)

For dense, data-first canvases with their own side panels and in-canvas section structure: Portfolio Compiler, Scenario Modeler, Hub Locator.

- Single white toolbar, fixed height (~48px), 1px bottom border — no gradient band
- Must still carry, left to right: page identity (small label or breadcrumb), any global context switcher (e.g. client/org selector, centered or left), and the data-as-of timestamp (right)
- Rationale: identity is already established by the sidebar's active state; on a workbench every vertical pixel is working space, and a banner would push KPI content below the fold.

**The rule:** if the user *manages things* on the page, use Tier 1. If the user *analyzes a canvas* on the page, use Tier 2. This is a deliberate two-tier system, not a per-page styling choice — new pages must pick a tier by this rule.

---

## 3. Transactions View (Main View)

Route/state: `broker-flow`

### 3.1 Page Header
Tier 1 Blue Page Header band (see §2.4):
- Title: **"Transactions"** — 28px/700 weight, white
- Subtitle: "Manage your workspace requirements and track opportunities." — 14px, white/75%
- **"+ New Requirement"** button (top right) — white/15% background, triggers Create Modal (§4)

### 3.2 Metrics Bar
Five read-only KPI cards in a 5-column grid:

| Metric | Display Value | Color |
|---|---|---|
| Pipeline Value | $10.75M | `#10B981` (green) |
| Active Requirements | 23 | `#0694A2` (teal) |
| At Risk | 4 | `#F59E0B` (amber) |
| Median Close Time | 32 days | `#1E3A5F` (navy) |
| Vs Market Rate | −8% | `#7C3AED` (purple) |

Each card: label (11px/600, uppercase, gray), value (24px/700), subtitle (12px, gray), trend icon.

### 3.3 Deal Table

#### Toolbar
- **Search field** — full-width, placeholder "Search deals by client, city, broker..." — filters across: deal name, client name, city, broker (case-insensitive)
- **All Stages** dropdown — filters by stage value
- **All Statuses** dropdown — filters by status value
- **All Cities** dropdown — dynamically populated from deal data, sorted alphabetically

All filters are additive (AND logic). Clearing a filter resets it to "show all."

#### Table Columns

| Column | Type | Notes |
|---|---|---|
| Transaction Name | Text | Clickable — opens Deal Details Modal |
| Client Name | Text | |
| Broker | Text | |
| Status | Badge | Draft (gray), Active (green `#10B981`), Executed (dark green), Archived (gray `#6B7280`) |
| Stage | Badge | See stage badge colors below |
| Est. Value | Currency | Formatted: `$X,XXX` or `$X.XXM` |
| Last Updated | Date | ISO format display |
| Actions | Menu | "..." — opens per-row dropdown |

**Stage badge colors:**

| Stage | Background |
|---|---|
| Intake | `#1E3A5F` (dark navy) |
| Evaluation | `#0369A1` (blue) |
| Proposal | `#7C3AED` (purple) |
| Negotiation | `#EA580C` (orange) |
| Contracting | `#2563EB` (bright blue) |
| Execution | `#059669` (green) |

#### Row Interactions
- **Click row** → opens Deal Details Modal (§5)
- **"..." menu** → dropdown with single action: "View Requirement" (eye icon, `#005B94`) — also opens Deal Details Modal

---

## 4. Create / Edit Requirement Modal

Triggered by: "+ New Requirement" button (create mode) or edit action from deal (edit mode).
Header background: `#005B94`. Close via ✕ button or Cancel.

### 4.1 Form Fields (all required *)

| Field | Input Type | Options / Notes |
|---|---|---|
| Requirement Name | Text | Full width |
| Client Name | Text | Half width |
| City | Text | Half width |
| Workspace Type | Select | Dedicated Desk, Hot Desk, Private Office, Team Suite |
| Requirement Stage | Select | Intake, Evaluation, Proposal, Negotiation, Contracting, Execution — defaults to Intake |
| Size (sq ft) | Number | Half width |
| Estimated Value ($) | Number | Half width |
| Broker | Select | Populated from broker list |
| Status | Select | Active (default), Draft, Executed, Archived |

### 4.2 Actions
- **Cancel** — closes modal, discards changes
- **Create Requirement** / **Save Changes** — closes modal, triggers toast notification:
  - Create: `"Requirement '[name]' created."`
  - Edit: `"Requirement updated successfully."`

---

## 5. Deal Details Modal

Opened by clicking a deal row or "View Requirement." Full-screen modal with header + 4 tabs.

**Modal header:**
- Deal name (large, white on `#005B94`)
- Status badge (Active/Archived/etc.)
- Client name
- Close (✕) button

### 5.1 Summary Tab

**Requirement Details section** — editable form with "Save Changes" button:

| Field | Input Type |
|---|---|
| Requirement Name | Text |
| Client / Company | Text |
| Deal ID | Text (read-only, system-generated, e.g. `#TL-NYC-98321`) |
| Workspace Type | Select |
| Location | Select (city) |
| Size (sq ft) | Text |
| Estimated Value ($) | Text |
| Requirement Stage | Select |
| Status | Select |
| Broker | Select |
| Created Date | Date picker |
| Expected Close Date | Date picker |
| Primary Contact Name | Text |
| Primary Contact Email | Text |

**Notes section:**
- Multi-line textarea — placeholder: "Add notes about this deal..."
- **Save Note** button

---

### 5.2 Workflow Tab

Displays the deal's stage progress and task breakdown.

#### Stage Progress Stepper
Linear stepper across 6 stages: **Intake → Evaluation → Proposal → Negotiation → Contracting → Execution**
- Completed stages: filled green circle with checkmark + task count below
- Current stage: filled navy circle (active) + task count
- Upcoming stages: empty circle (gray) + task count
- Header: "Active" status chip + "Last updated: [date]"

#### Next Step Card
Highlighted amber-left-bordered card showing:
- Title: "Next Step"
- Action name
- Due date
- Assignee name

#### Stage Completion Signals
Tabs: **Stage Completion Signals** / **Work-Based Readiness**
- Lists criteria with completion state icons (e.g., "Proposal accepted ✓", "Legal review pending ⏳")

#### Stage Task Lists
Each stage section is collapsible. Current stage defaults to expanded.

**Task list features:**
- "+ Add Task" button per stage (opens Add Task inline form)
- Each task shows: name, assignee, due date, status, task type indicator

**Task types and states:**

| Type | States | Visual |
|---|---|---|
| Human task | Not Started, In Progress, Completed | Person icon |
| Agent task | queued, running, completed, needs_review | Bot icon + status chip |
| Agent-generated human task | pending (awaiting broker approval) | Bot icon + approve/reject actions |

**Agent task detail expansion:**
- Agent instruction
- Expected output type (Comparison Table, Brief/Summary, Draft Document, Risk Flags)
- Agent task type (Assess Collection, Create Collection, Negotiate Terms, Structured Evaluation + Decisioning)
- Execution timestamp (when completed/running)
- Output text (when completed)

**Agent-generated task actions (broker review):**
- **Approve** — accepts task into workflow
- **Reject** — removes task from list

**Add Task form fields:**
- Task name* (text)
- Due date* (date)
- Assigned To (select: broker names or "Agent")
- Dependency (optional text)
- If assigned to Agent:
  - Agent instruction (text)
  - Expected output (select)
  - Agent task type (select)

---

### 5.3 Team Tab

Manages the deal team roster including human members and AI agents.

**Filter controls:**
- All Roles (dropdown)
- All Types: Internal / External / Agent (dropdown)

**"+ Add Member"** button → opens Add Team Member modal

**Team member card displays:**
- Avatar (initials-based)
- Name
- Type badge: Internal (green), External (orange), Agent (purple/blue)
- Role + organization
- Email (linked)
- Phone (if present)
- Description (for Agent type only — functional summary of agent's role)
- Edit (pencil) + Remove (trash) action icons

**Seeded AI agents on every deal:**

| Agent Name | Role | Function |
|---|---|---|
| RequirementsIntakeAgent | Requirements Agent | Front of funnel; structures client needs, validates completeness, flags gaps |
| MarketSourcingAgent | Market Sourcing Agent | Owns search, collection building, comparables, structured evaluation |
| TransactionCoordinatorAgent | Transaction Coordinator Agent | Orchestrates tasks across stages; tracks progress, nudges, routes documents |
| RiskComplianceAgent | Risk & Compliance Agent | Flags contract risk, insurance gaps, SLA deviations |
| FinanceOpsAgent | Finance Ops Agent | Budget validation, pricing analysis, concession benchmarking |

---

### 5.4 Documents Tab

Document library attached to the deal.

**Document list columns:** Name, Uploaded By, Date, Size, Review State (if agent-drafted)

**Document sources:**
- Human-uploaded: standard file entry
- Agent-drafted: tagged with "Agent" uploader + review state badge

**Agent-drafted document states:**
- `pending_review` — amber badge, broker must review
- `approved` — green badge
- `needs_revision` — red badge

**Document actions:** Download, Preview
**Upload:** upload button for human-added files

---

## 6. AI Drawer

A right-side slide-in panel triggered from agent card interactions within a deal. Animated entry/exit (slide from right, `0.35s`).

### 6.1 Layout
- **Default width:** 420px
- **Expanded width:** 780px (toggle via expand/minimize button)
- **Left border:** 4px solid, color based on severity
- Semi-transparent scrim behind drawer; clicking scrim closes drawer

### 6.2 Severity Levels

| Severity | Color | Icon | When Used |
|---|---|---|---|
| Informational | Green `#28A745` | CheckCircle | Positive update, no action needed |
| Suggestion | Blue `#005B94` | Lightbulb | Revenue opportunity, upsell signal |
| Needs Review | Amber `#FFA500` | AlertTriangle | Stalled deal, pricing approval blocked |
| Escalation | Red `#DC3545` | AlertCircle | Competitive threat, budget risk, deal at risk |

### 6.3 Content Structure (agent-context mode)

**Header:** severity icon + badge, deal name, agent name, close (✕) + expand/minimize buttons

**Body sections:**
1. **Summary** — 1–2 sentence situation summary, deal-context-aware
2. **Analysis** — 3 bullet points with deal-specific details (stage, value, broker, close date)
3. **Recommendations** — 4–5 actionable steps
4. **Action Buttons** — 2 CTA buttons (scenario-specific labels, e.g., "Schedule Executive Call", "Model Alternative Pricing")

### 6.4 Scenario Coverage
The drawer generates context-specific content for:
- Competitive threat (escalation)
- Budget / finance risk (escalation)
- Close date at risk / deal stalled (needs-review)
- Pricing approval blocked (needs-review)
- Expansion / upsell opportunity (suggestion)
- General positive update (informational)

---

## 7. LiquidAI View

Route/state: `liquid-ai` (full-screen, sidebar hidden)

A scripted 4-screen conversational AI interface demonstrating **Portfolio Intelligence** — a co-pilot mode for analyzing portfolio-level data.

### 7.1 Layout
- Dark navy top bar (`#1a5276`) with:
  - ← Back to Dashboard button
  - "Co-Pilot" animated badge (purple `#6c5ce7`, pulsing green dot)
  - "Portfolio Intelligence" title
  - "+ New Session" button
  - "Export" button
- Context bar (below top bar)
- Chat message thread area (scrollable, auto-scrolls to bottom on screen change)

### 7.2 Interaction Flow
Scripted progression through 4 screens simulating a live AI chat session. Each screen advances the conversation state.

**Draft Modal:**
- Opens from within a conversation screen
- Shows a pre-written outreach draft
- **Copy** button — copies draft text to clipboard, shows 2-second confirmation state
- **Close (✕)** button

---

## 8. Space Sourcing (within Deal Details)

An embedded workspace search tool accessible from within a deal's workflow context.

### 8.1 Search Tab

**Search form fields:**
- Location (text, pre-filled from deal city)
- Min / Max Size (sq ft)
- Workspace Type (dropdown)
- Max Budget ($)
- Start Date / Term End Date (date pickers)
- Capacity (headcount)

**Search action:** Simulates async API call (loading state), returns mock results.

**Result card fields:** Space name, operator, location, city, size, price, workspace type, amenities list, source badge (LiquidSpace / External)

**Actions per result:** Add to Collection (star/plus), View Details

### 8.2 Collection Tab
- Displays spaces added to collection for this deal
- Remove individual spaces
- Collection feeds into agent evaluation workflow

---

## 9. Data Model

### Deal (Requirement)

| Field | Type | Notes |
|---|---|---|
| id | string | Unique identifier |
| dealName | string | |
| clientName | string | |
| city | string | |
| workspaceType | string | Dedicated Desk, Hot Desk, Private Office, Team Suite |
| dealStage | string | Intake, Evaluation, Proposal, Negotiation, Contracting, Execution |
| size | number | Square feet |
| estValue | number | USD |
| status | string | Draft, Active, Executed, Archived |
| lastUpdated | string | ISO date |
| broker | string | Broker display name |
| closeDate | string? | Target close date |
| notes | string? | Free-text notes |
| aiAgents | AgentCard[]? | Active agent alerts |

### AgentCard

| Field | Type | Notes |
|---|---|---|
| id | string | |
| severity | enum | informational, suggestion, needs-review, escalation |
| title | string | Alert headline |
| description | string | Detail text |
| timestamp | string | When generated |
| agent | string | Agent name |

### Task

| Field | Type | Notes |
|---|---|---|
| id | string | |
| name | string | |
| dueDate | string | ISO date |
| status | string | Not Started, In Progress, Completed |
| assignedTo | string | Person name or "Agent" |
| taskType | enum? | human, agent, collaborative |
| agentState | enum? | queued, running, completed, needs_review |
| agentOutput | string? | Agent-produced result text |
| agentInstruction | string? | What the agent was told to do |
| expectedOutput | string? | Comparison Table, Brief/Summary, Draft Document, Risk Flags |
| agentTaskType | string? | Assess Collection, Create Collection, Negotiate Terms, Structured Evaluation + Decisioning |
| createdBy | enum? | agent, human |
| reviewState | enum? | pending, approved, rejected |
| generatedReason | string? | Why the agent created this task |

### TeamMember

| Field | Type | Notes |
|---|---|---|
| id | string | |
| name | string | |
| role | string | |
| organization | string | |
| email | string | |
| phone | string? | |
| type | enum | Internal, External, Agent |
| description | string? | Agent capability summary |

### Document

| Field | Type | Notes |
|---|---|---|
| id | string | |
| name | string | Filename |
| uploadedBy | string | Person name or "Agent" |
| uploadedDate | string | ISO date |
| size | string | Human-readable file size |
| draftedBy | enum? | agent, human |
| reviewState | enum? | pending_review, approved, needs_revision |
| version | number? | Document version |

---

## 10. Notifications & Feedback

- **Toast notifications** — displayed for create/edit actions
  - Success: green, e.g. `"Requirement 'X' created."`
  - Error: red (supported in toast system)
  - Positioned bottom of viewport, auto-dismiss

---

## 11. Responsive / Layout Behavior

- Sidebar collapse: expands (256px) ↔ collapses (64px icon rail), animated with 300ms transition
- AI Drawer open: main content area padding-right → 424px, animated
- Deal table: full viewport width minus sidebar
- Modals: centered, max-width 2xl (app shell dims behind modal)

---

## 12. Out of Scope (Prototype Placeholders)

The following items are linked in the nav but render stub pages or redirect to the other app. Full implementation is out of scope for this prototype.

**Transaction Manager app (implemented routes):** `/license/tracker`, `/license/payments`, `/license/funding`, `/license/tasks`, `/transactions/list`, `/transactions/tasks`, `/workplace/dashboard`, `/workplace/teams`, `/workplace/locations`, `/workplace/activity/reservations`, `/workplace/activity/searches`, `/workplace/activity/reviews`, `/workplace/setup`, `/workplace/branding`

**Workplace Strategist app:** Portfolio Compiler, Scenario Modeler, Hub Locator — all implemented at `workplacestrategist-internal.vercel.app`. Navigating to these from TM performs a full-page load to the WS app (hostname differs).
