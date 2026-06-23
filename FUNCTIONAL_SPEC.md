# LiquidSpace Operations Platform — Functional Specification
**Workplace Manager · License Administrator · Transaction Manager**
Version 1.1 · June 2026

---

## 0. Product Architecture

This prototype covers three distinct product areas sharing a single application shell (sidebar + routing). Each area has its own entry-point component and supporting components.

### 0.1 Product → Component Map

#### Workplace Manager
The dashboard for workplace/facilities teams managing office portfolios, locations, and teams.

| Role | Component(s) |
|---|---|
| Entry point | `WorkplaceManagerDashboard.tsx` |
| Dashboard & overview | `DashboardOverview.tsx`, `PortfolioOverview.tsx` |
| Space comparison | `WorkspaceComparison.tsx`, `WorkspaceComparisonModal.tsx` |
| Portfolio & reservations | `ReservationsView.tsx`, `SearchesView.tsx`, `ReviewsView.tsx` |
| Sync & settings | `SyncCenter.tsx`, `SettingsPage.tsx`, `AlertsManager.tsx` |
| Analytics | `USActivityHeatmap.jsx`, `CFODashboard.tsx` |

#### License Administrator
Manages workspace license agreements, payments, and funding sources for a portfolio of leases.

| Role | Component(s) |
|---|---|
| Entry point | `LicenseTracker.tsx` |
| Payments | `PaymentManagement.tsx`, `PaymentDetailsModal.tsx`, `PaymentActionsDropdown.tsx` |
| Funding | `FundingSources.tsx`, `FundingSourceModal.tsx` |
| License detail & upload | `LicenseDetailModal.tsx`, `UploadLicenseModal.tsx`, `LicenseActionsDropdown.tsx` |
| Tasks | `Tasks.tsx`, `BrokerTasks.tsx` |
| Renewals | `HighImpactRenewalsActionsDropdown.tsx`, `UpcomingRenewalsActionsDropdown.tsx` |

#### Transaction Manager
Broker-facing deal management — tracks workspace requirements from intake through execution.

| Role | Component(s) |
|---|---|
| Entry point | `BrokerFlow.tsx` |
| Deal table & metrics | `BrokerDealMetrics.tsx`, `WorkflowOverview.tsx` |
| Deal details | `DealDetailsModal.tsx`, `DealFeed.tsx` |
| Create / edit deal | `CreateEditDealModal.tsx` |
| Team management | `DealTeamSection.tsx`, `AddTeamMemberModal.tsx` |
| Tasks | `TransactionTasks.tsx`, `TaskActionDropdown.tsx`, `TaskOverviewActionsDropdown.tsx` |
| Space sourcing | `SpaceSourcing.tsx`, `SpaceCard.tsx`, `SpaceDetailModal.tsx`, `AlternativeSpacesModal.tsx` |
| Collections | `SpaceComparisonModal.tsx` |

### 0.2 Shared Infrastructure

| Role | Component(s) |
|---|---|
| App shell | `Sidebar.tsx`, `PageHeader.tsx`, `GlobalHeader.tsx`, `Header.tsx` |
| AI / copilot | `ai-drawer.tsx`, `LiquidAI.tsx`, `copilot/AIAssistant.tsx`, `copilot/CopilotPanel.tsx` |
| UI primitives | `components/ui/` (shadcn-based: Button, Dialog, Select, Tabs, Tooltip, etc.) |
| Mock data | `components/data/` (notifications, sample spaces, sync data) |
| TypeScript types | `components/types/workspace-types.ts` |
| Utilities | `components/utils/workspace-utils.tsx` |

### 0.3 File Structure Note

All components live in a flat `components/` directory — no subdirectories per product area. This is intentional for a prototype. If this codebase graduates to a production build, the natural split would be `components/workplace-manager/`, `components/license-administrator/`, `components/transaction-manager/`, and `components/shared/`.

---

## 1. Overview

Transaction Manager is a broker-facing deal management application embedded within the broader LiquidSpace platform. It enables brokers to track, manage, and advance workspace requirements (deals) through a structured 6-stage workflow, with AI agent support throughout.

**Primary users:** LiquidSpace brokers and deal coordinators
**Core job to be done:** Manage a portfolio of client workspace requirements from first contact to signed agreement, with AI agents reducing manual work at each stage.

---

## 2. Application Shell

### 2.1 Layout
- Fixed sidebar (left) + scrollable main content area (right)
- When the AI Drawer is open, the main content area shifts left by 424px (animated, `cubic-bezier(0.23, 1, 0.32, 1)`)

### 2.2 Sidebar
**Collapsed state:** 64px icon rail — shows hamburger toggle + active-view icons only
**Expanded state:** 256px panel

**Navigation sections:**

| Section | Behavior | Items |
|---|---|---|
| License Administration | Static header (non-collapsible) | License Tracker ¹, Payments Dashboard, Funding Sources, Tasks |
| Workplace Operations | Collapsible (default: collapsed) | Dashboard ², Teams, Locations, Activity, Liquid AI ³, Setup, Branding |
| Workplace Strategy | Collapsible (default: collapsed) | Portfolio Manager, Hub Locator |
| Transaction Manager | Collapsible (default: expanded) | Transactions ✓ |

¹ License Tracker opens `https://crayon-duo-80396629.figma.site/` in a new tab (placeholder)
² Dashboard opens `https://same-wasp-78624830.figma.site/` in a new tab (placeholder)
³ Liquid AI navigates to the in-app LiquidAI view

Active nav item: `#005B94` background, white text. Inactive: gray-600, hover gray-100 bg.

---

## 3. Transactions View (Main View)

Route/state: `broker-flow`

### 3.1 Page Header
- Blue gradient banner: `#004A7C → #005B94 → #0071B8` (135°)
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

The following sidebar items navigate to external Figma prototypes and are **not implemented** in this codebase. They require separate implementation:

- **License Tracker** → external Figma site
- **Payments Dashboard** → (no active route, component exists: `PaymentManagement.tsx`)
- **Funding Sources** → (component exists: `FundingSources.tsx`)
- **Tasks** → (component exists: `Tasks.tsx`)
- **Workplace Operations: Dashboard** → external Figma site
- **Workplace Operations: Teams, Locations, Activity, Setup, Branding** → no active routes
- **Workplace Strategy: Portfolio Manager, Hub Locator** → no active routes
