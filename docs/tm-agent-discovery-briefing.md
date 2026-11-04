# Transaction Manager — Requirements Intake & Collection Agent: Product and Architecture Briefing

*Discovery document. Nothing was implemented or changed to produce it. Prepared for use in a separate product-strategy discussion.*

---

## 0. Read this first: what this briefing can and cannot establish

**The most important fact for anyone reading this:** the codebase that was inspected (`/Users/davidwhite/Desktop/Transaction Manager`, GitHub `dawhiteus/new`, deployed on Vercel) is a **front-end-only clickable demo**, not the Transaction Manager (TM) product. It has **no backend, no API client, no database, and no authentication**.

- A repo-wide search finds exactly one network call: a CDN fetch of US map geometry in `components/USActivityHeatmap.jsx:67`. There is no `fetch` to any LiquidSpace service, no `import.meta.env`/`process.env` usage, no HubSpot code, no Airtable code. State is React state, a small in-memory store, and `sessionStorage`.
- The **MVP / production TM was not inspected.** Its source, API surface, database schema and services are not accessible from this repo. Everything this briefing says about the MVP comes from **screenshots of the MVP supplied by David** (stored in `docs/briefing-assets/`), not from MVP code.
- Consequently: **no real API endpoints are listed in this document, because none could be verified.** Where an endpoint would normally go, the doc says `UNKNOWN — needs MVP/backend owner`. Inventing endpoints would be misleading.
- The demo contains **mock "agents"** (canned text, fake delays, hard-coded sample data). **None of that is evidence of an implemented agent capability.** Treat every demo agent behavior as a *design illustration*, not a product fact.

### Evidence labels used throughout

| Label | Meaning |
|---|---|
| **[DEMO-VERIFIED]** | Read directly in the demo source code (file references given). True of the demo only. |
| **[MVP-SCREENSHOT]** | Visible in a screenshot of the real MVP that David supplied. True of the MVP UI at that moment; says nothing about back-end behavior. |
| **[DOCUMENTED-INTENT]** | Stated in a spec/doc in the repo (`FUNCTIONAL_SPEC.md`, `docs/collection-assessment-history-spec.md`). A plan, not shipped behavior. |
| **[ASSUMPTION]** | Reasoned inference. Needs confirmation. |
| **[UNKNOWN]** | Cannot be determined from available material. |

---

## 1. Current Transaction Manager experience

### 1.1 Where TM sits

The demo shell hosts three product areas: **Workplace Operations**, **License Administrator**, **Workplace Strategist**, plus **Transaction Manager** and a Marketplace link ([DEMO-VERIFIED] `nav/nav-data.ts`). TM has two pages in the demo:

| Page | Route (demo) | Component |
|---|---|---|
| Requirements (home) | `/transactions/list` | `components/RequirementsHome.tsx` |
| Requirement Tasks | `/transactions/tasks` | `components/RequirementTasksHome.tsx` |

Both were rebuilt in October 2026 to mirror the MVP UI (per David's screenshots). The earlier, richer demo (`BrokerFlow.tsx`, `DealDetailsModal.tsx`, AI drawer, deal feed) still exists in the repo but is **intentionally not linked**; it should be treated as legacy exploration.

### 1.2 Requirements list **[MVP-SCREENSHOT]**
Banner "Requirements"; four stat cards (Requirement Costs, Active Requirements, Collections Created, Agent Tasks Completed); filters All Statuses / All Stages / All Cities; **New Requirement** button; sortable table.

Columns: `REQUIREMENT`, `COMPANY`, `STATUS`, `STAGE`, `BUDGET`, `COLLECTION`, `LAST UPDATED`, row menu. Pagination ("Show N entries").
The Collection column is a pill ("6 spaces"). Row menu: **View Requirement, Remove Requirement, View collection, Update collection, Remove collection**.

Screenshots: `docs/briefing-assets/mvp-requirements-list.png`, `mvp-row-menu.png`.

### 1.3 The Requirement object (what the MVP UI exposes)

Assembled from the MVP's *New Requirement modal* and *Requirement Details → Overview tab* **[MVP-SCREENSHOT]**. Field labels are exact; storage names/types are **[UNKNOWN]**.

| Section | Field (UI label) | Control | Required in New modal |
|---|---|---|---|
| Deal Details | Company | text | yes |
| | Status | select: Active, Draft, Executed, Archived | yes (default Active) |
| | Deal ID *(Overview only)* | text | — |
| | Current Stage *(Overview only, read-only)* | select (disabled) | — |
| | Created Date *(Overview only, read-only)* | date | — |
| Business Requirements | Requirement Name | text | yes |
| | Location | text (free text, e.g. "Lisbon") | yes |
| | Workspace Type | chips, single-select: Office Suite, Private Office, Team Office, Coworking, Meeting Space | no |
| | Capacity / Headcount | number | yes |
| | Size (sq ft) | number | no |
| | Program Needs | textarea (placeholder: "Open workstations, 3 meeting rooms, 2 team rooms, and a kitchen/pantry.") | no |
| | Amenity Needs | textarea (placeholder: "On-site staffed reception, secure badge access, and bookable phone booths.") | no |
| | Configuration | toggle: Single space / Collection of spaces | no |
| | Other Functional Requirements | textarea | no |
| Commercial Terms | Start Date | date | yes |
| | Term Length (mos) | number | yes |
| | Expected Close Date | date | no |
| | Budget ($/mo) | currency, monthly | yes |
| | Other Commercial Requirements | textarea | no |

Also on Overview: a **Requirement notes** list (author, date, text) with an "Add Note" box. Screenshots: `mvp-new-requirement-modal-top.png`, `mvp-new-requirement-modal-bottom.png`, `mvp-requirement-overview.png`.

Observations that matter for intake **[ASSUMPTION]**:
- `Location` is free text, not a structured geography. An MVP Collection card shows "In Lisbon, Portugal", implying *something* resolves it to a place downstream **[UNKNOWN how]**.
- `Capacity/Headcount` is a single number, but the Collection hover card shows a range ("For 4-6 people"), so the system derives a range from it **[UNKNOWN rule]**.
- A real MVP note on the Lisbon requirement reads: "Start Date: October 1, 2026 Location: Lisbon - Saldanha & Entrecampos areas preferred Term Length: 12 months Headcount: 5 people Configuration: One private office for 5 people/workstations". This shows people already write the **sub-market preference and structured values into free-text notes** because no field holds them. It is a useful real-world extraction example.
- Start Date appears as `01/01/0001` on a requirement with no start date, suggesting a null/default-date bug or unset-date sentinel **[MVP-SCREENSHOT; cause UNKNOWN]**.

### 1.4 Lifecycle **[MVP-SCREENSHOT]**
Five stages with task counts shown on a stepper: **Intake (1), Evaluation (4), Proposal (2), Contracting (1), Execution (3)**. "Current Stage" is read-only on the Overview tab; whether stage advances automatically or by user action in the MVP is **[UNKNOWN]**. The demo does *not* auto-advance stages.

Default tasks per stage **[MVP-SCREENSHOT]** (name — description):
- Intake: *Requirement intake* — Define business and commercial requirements
- Evaluation: *Create Collection* — Build Compliant Collection and Confirm Availability · *Assess Collection* — Evaluate Collection Against Requirement Criteria · *Shortlist* — Evaluate Alternatives and Recommend Shortlist · *Tour* — Coordinate and Document Tour Evaluations
- Proposal: *Review proposal(s)* — Compare Proposals and Identify Negotiation Targets · *Site selection* — Select Final Space Option and Notify Stakeholders
- Contracting: *Legal review* — Manage Agreement Routing and Legal Risk Resolution
- Execution: *Contract execution* · *Onboarding* · *License Administration* — Validate Closure Documents and Confirm Operational Handoff

Task fields in MVP UI (Add/Edit Task dialog): Task Name, Task Status (Not Started / In Progress / Completed), Due Date, Assigned To (default Unassigned), Depends On Task (free text, optional), Description. Tasks can be assigned to people; whether an assignee can be an agent in the MVP is **[UNKNOWN]**.

Screenshot: `mvp-workflow-tab.png`.

### 1.5 Team, Documents, Timeline **[MVP-SCREENSHOT]**
- **Team** members have Name, Email, Role, Type (Internal / External / Agent / Unknown), Organization, Phone. Role filter values appear as enum identifiers: `Unknown, ServiceProvider, ClientContact, LegalCounsel, DealCoordinator, RequirementsLead, MarketLead, Other, RequirementsAgent, MarketplaceSearchAgent, CollectionEvaluationAgent`.
- Every requirement shown lists three **Agent**-type team members: *Requirements Intake Agent* (role `RequirementsAgent`, task "Structure requirement"), *Market Sourcing Agent* (`MarketplaceSearchAgent`, "Build collection"), *Collection Assessment Agent* (`CollectionEvaluationAgent`, "Assess collection"), each with a capability description. The MVP therefore **models agents as team members with dedicated role enums**. Whether those agents *execute* anything, or are placeholders, is **[UNKNOWN] — must be confirmed before any design relies on them.**
- **Documents:** upload (drag/drop, multiple files); list shows name, size, date; row actions Download / Remove.
- **Timeline:** append-only event feed; each event has a type icon, title, description, date and actor email. Observed events: *Requirement Created*, *Team Member Added*, *Collection Created* ("Lisbon Collection collection created for Lisbon requirement."), *Task Updated* ("'Requirement intake' updated in Intake: Status was changed from Not Started to Completed"). Screenshots: `mvp-team-tab.png`, `mvp-timeline-tab.png`.

### 1.6 Requirements → Collections today **[MVP-SCREENSHOT]**
Each requirement row has at most one Collection (pill count). Hover card for "Lisbon Collection": "6 spaces total"; three criteria rows — **"In Lisbon, Portugal" / "Within $0/mo" / "For 4-6 people"** — each with a count ("0 spaces"); **Saved 2 · Shortlisted 4**; "Updated Sep 22, 2026"; **View Collection**. Row menu: View / Update / Remove collection.

Reading **[ASSUMPTION]**: the three criteria rows look like *requirement-derived filters* (location, budget, headcount) with the number of spaces that satisfy each; here all three read 0 because the sample requirement has $0 budget and a free-text location, i.e. data-quality in the requirement directly degrades how the collection is characterised. "Saved" and "Shortlisted" appear to be reviewer states a space can be in.
The Collection detail screen ("View Collection") was **not provided** and is **[UNKNOWN]**.

Screenshot: `mvp-collection-hover-card.png`.

---

## 2. Requirements Intake

### 2.1 Current behavior
- **MVP:** manual form only, as far as the screenshots show. No intake assistant was visible. The MVP *does* list a "Requirements Intake Agent" on the Team tab (see 1.5) — status **[UNKNOWN]**.
- **Demo (legacy, now unlinked):** `components/CreateEditDealModal.tsx` contains a "Requirements Intake Agent" panel with three modes — `describe`, `upload`, `reference` (type `AgentMode`). The "agent" is **fake**: `generateDraftFromDescription`, `generateDraftFromUpload` and `generateDraftFromReference` use keyword matching (hard-coded city/company/type maps), regexes (e.g. `/(\d[\d,]*)\s*(sq\s*ft|sqft|sf)/`) and **random numbers**, then fill a form. **[DEMO-VERIFIED]** It illustrates the intended interaction, not a capability. The *current* demo New Requirement modal (`components/NewRequirementModal.tsx`) matches the MVP and has no intake assistant.
- **Hub Locator handoff (the one real "pre-populated requirement" path in the demo):** Workplace Strategist links to `/transactions/list?newReq=1&reqId=…&company=…&city=…&state=…&estValue=…&seats=…&workspaceType=…` (plus optional `estMonthly`, `hvs`, `verdict`, `purpose`, `rate`, `saving`, `payback`, `baseline`, `seatRange`, `config`, `prov`, `back`). `RequirementsHome.tsx` parses these (`readHubOrigin` in `components/hubOrigin.ts`) and creates a pre-filled, highlighted requirement. **[DEMO-VERIFIED]** The URL format was observed in a live Workplace Strategist link, so the *contract* is real; whether the MVP consumes it is **[UNKNOWN]**. It proves an "existing record → pre-filled requirement" pattern is already conceptually accepted.

### 2.2 Three intake paths — feasibility

For all three, the target is a **populated draft the user reviews before saving** (consistent with Section 0 principle: no autonomous writes).

#### A. Natural language ("describe it")
- **Inputs:** a free-text paragraph.
- **Mapping:** company → `Company`; city/area → `Location`; "40 people" → `Capacity/Headcount`; "12 months starting Oct 1" → `Start Date`, `Term Length (mos)`; "$X/month" → `Budget ($/mo)`; "private offices, phone booths" → `Workspace Type`, `Program Needs`, `Amenity Needs`; "one office for 5" vs "multiple locations" → `Configuration`.
- **Lookups:** (1) *company* — match against existing companies/accounts to avoid duplicates **[UNKNOWN source of truth; HubSpot is the likely CRM but no integration exists in the demo; none verified in MVP]**; (2) *location* — normalize to a geography (city/region/country, optionally sub-market) so the Collection can search it; the MVP's "In Lisbon, Portugal" suggests a geocoding/normalization step exists or is intended **[UNKNOWN]**.
- **Missing information handling:** required fields (Company, Name, Location, Headcount, Start Date, Term, Budget) are frequently absent in conversation; the draft must show unfilled required fields rather than guess. Budget in particular is often given as annual or per-seat; the UI field is **$/month total**, so unit normalization is a risk.
- **Limitation:** `Workspace Type` is a *single-select* in the UI, while real briefs often name several types.

#### B. Brief / document interpretation
- **Inputs:** uploaded email/PDF/doc text. The MVP has a Documents tab (upload exists) but that is post-creation and attached to an *existing* requirement; **document upload at creation time is not shown [UNKNOWN]**. Document text extraction (PDF/Word/OCR) infrastructure **[UNKNOWN]**.
- **Mapping:** same fields as A; briefs are richer and more ambiguous (multiple locations, phased headcount, alternatives). Real-estate-style briefs commonly contain multiple candidate geographies — the data model supports **one** `Location` string per requirement, so the output may need to propose multiple requirements or put extras in `Other Functional Requirements` **[ASSUMPTION]**.
- **Limitations:** confidentiality of customer documents sent to an LLM; file size/format coverage.

#### C. Existing record (License Administrator license ID, existing workspace, other record)
- **Demo-verified source schema** (License Tracker, `components/licenseFieldOptions.ts`, `LicenseDetailModal.tsx`, `AddLicenseModal.tsx`): `licenseId`, `operator`, `address1`, `address2`, `city`, `state`, `zip`, `country`, `workspaceType` (Flex (Hourly) | Dedicated (External) | Dedicated (LiquidSpace)), `status`, `size`, `seats`, `owner`, `monthlyCost`, `annualizedCost`, `securityDeposit`, `currency`, `paidBy`, `fundingSource`, `contractType` (Fixed-Term | Month-to-Month), `renewalMechanism` (Auto-Renewal | Renewal by Mutual Agreement | No Automatic Renewal | Not Specified), `termStart`, `termEnd`, `notificationPeriod` (None, 15–180 Days, Other). **This is demo data**; the MVP License Admin was shown only as a design target.
- **Natural mapping (a renewal/replacement scenario)** **[ASSUMPTION]**: `city/state/country` → `Location`; `seats` → `Capacity/Headcount`; `size` → `Size (sq ft)`; `monthlyCost` → `Budget ($/mo)`; `termEnd` → drives `Start Date` of the *next* term; `operator`/company → `Company` (note: the license's *customer* vs the *operator* are different things — the license `operator` is the **space provider**, not the TM `Company` (client); the client link is **[UNKNOWN]**).
- **Gaps:** workspace-type taxonomies differ (License: Flex/Dedicated…; Requirement: Office Suite/Private Office/…); no license→requirement relationship exists in the demo; a deterministic lookup API from license ID is **[UNKNOWN]** (License Admin has no backend in the demo).
- **Hub Locator path** (2.1) is the working precedent: structured source → deterministic mapping → reviewed draft.

### 2.3 Agent or simpler? **[ASSUMPTION — recommendation for discussion]**
All three can be built as **one LLM extraction call with a fixed output schema + deterministic validators**, without agentic orchestration:
- LLM job: turn messy text into the requirement fields + a per-field confidence/"source quote"; flag missing required fields.
- Deterministic: schema/enum validation, unit normalization, date parsing, geography normalization, company/account lookup (exact/fuzzy), license-ID fetch for path C.
- Agent-style looping (tool calls, follow-up questions) is only valuable for **conversational** gap-filling (ask the user for missing Budget). That can be a simple "ask for missing required fields" turn, not a multi-agent design.
- Human boundary: nothing is saved until the user presses Create; the only "write" is the existing create action.

### 2.4 Gaps to close for Intake
1. Authoritative company/account lookup source (HubSpot? LiquidSpace company table?) — **[UNKNOWN]**.
2. Location normalization service/geocoder and desired granularity (city vs neighborhood) — **[UNKNOWN]**.
3. Whether the MVP create endpoint accepts partial drafts, and its validation rules — **[UNKNOWN]**.
4. File-ingestion path and data-handling policy for customer briefs — **[UNKNOWN]**.
5. License ID → record lookup for path C — **[UNKNOWN]**.
6. Single `Location` / single `Workspace Type` limit vs real-world briefs.

---

## 3. Collection Agent

### 3.1 Current Collection mechanics
**MVP [MVP-SCREENSHOT]:** one Collection per requirement (as displayed), named "{Requirement} Collection", with a space count, criteria summary (location/budget/headcount), Saved/Shortlisted counts, an updated date, and row actions View/Update/Remove collection. A "Collection created" event appears on the Timeline. **Create/Update/Remove actions exist in the MVP UI**; how they work — how spaces get in, whether Update re-runs a search, what persistence/model underlies it, whether spaces are LiquidSpace marketplace listings — is **[UNKNOWN]**.

**Demo [DEMO-VERIFIED] — all mocked:**
- `BrokerFlow.tsx` (legacy): "Create Collection" prompts for a name, then calls `generateMockAssessment` — arithmetic on deal size/id, not a search. Toast: "collection created — assessing fit…".
- `components/data/collectionSpaces.ts`: hard-coded `COLLECTION_SPACES` per city. Space shape: `{ id, name, image, rating, address, type ('Office Suite'|'Team Office'|'Coworking'|'Private Office'), capacity, price, isAvailable, amenities[], category ('Recommended'|'Saved'|'Shortlisted') }`.
- `DealDetailsModal.tsx` `CollectionTab` (legacy): Recommended / Saved / Shortlisted columns with **drag-and-drop between categories** (local state only).
- `SpaceSourcing.tsx` (legacy): search form — location, min/max size, workspace type, max budget, start/term dates, capacity — which runs a `setTimeout` and returns hard-coded results ("WeWork Times Square", …). Source badges "LiquidSpace / External". **No real search.**
- Mock agent task records in `DealDetailsModal.tsx` (e.g. `Create Collection` assigned to "Market Sourcing Agent", `agentState: 'completed'`, `agentOutput`, `collectionUrl: 'https://liquidspace.com/collections/…'`, `Assess Collection` → "Strong matches: 2, Partial: 4, Weak: 6…").

**Documented intent [DOCUMENTED-INTENT]** — `docs/collection-assessment-history-spec.md` (v0.2, "Canonical Draft") defines an append-only **Assessment History** with event types `sourced`, `resourced`, `initial_assessment`, `reassessment`, `assessment_blocked` (agent pipeline) plus requirement-change and broker-intervention events, and a tier-movement `delta`. `FUNCTIONAL_SPEC.md` §9 defines a task schema with `taskType` (human/agent/collaborative), `agentState` (queued/running/completed/needs_review), `agentOutput`, `agentInstruction`, `expectedOutput`, `agentTaskType` (Assess Collection, Create Collection, …), `createdBy`, `reviewState` (pending/approved/rejected), `generatedReason`. The MVP Team tab's agent descriptions (Market Sourcing Agent → Collection Assessment Agent "runs automatically after sourcing completes, and re-triggers when requirement fields are edited"; "the Collection tab becomes visible on the requirement") describe a **two-step pipeline already narrated in product copy**. **These are intentions/copy, not verified behavior.**

### 3.2 Marketplace search & inventory access
- In the demo, "Search & Browse" under Marketplace is a navigation entry (`nav/nav-data.ts`); no inventory API is called anywhere. **[DEMO-VERIFIED]**
- LiquidSpace marketplace listing/search APIs, query parameters, listing fields (capacity, price units, availability, amenities), geographic search semantics, and any **Collection create/add/remove/favorite endpoints** are all **[UNKNOWN] — must come from the MVP/platform owners.**
- Related *data* that exists elsewhere but is **not accessible to TM** as built: Pulse (LiquidSpace's analytics warehouse, referenced in `docs/markettide-implementation-architecture.md` as owned by Jim, with a "validated live Pulse connector") — available to Claude tooling in this environment but **not wired into TM**. Not a TM capability.

### 3.3 What an agent would do (scope per the request)
Given a **saved** requirement:
1. Derive search criteria from fields: `Location` (normalized), `Capacity/Headcount`, `Size (sq ft)`, `Workspace Type`, `Budget ($/mo)`, `Start Date`/`Term Length`, `Amenity Needs`, `Program Needs`, `Configuration`.
2. Query marketplace inventory.
3. Create/populate the requirement's Collection with a first-pass set.
4. Produce a concise assessment (suitability, coverage, trade-offs, gaps).

**Deterministic vs LLM [ASSUMPTION]:**
| Step | Approach |
|---|---|
| Criteria derivation, budget/capacity range math, date windows | Deterministic code |
| Marketplace query and filtering (location, capacity, price, availability) | Deterministic API calls |
| Ranking / tiering (e.g. Strong/Partial/Weak per the `collection-assessment-history-spec`) | Deterministic scoring across defined dimensions (the spec names five: location proximity, workspace type, size/capacity, budget, term) |
| Interpreting free-text `Program Needs`/`Amenity Needs`/`Other…` against listing amenities | LLM (the only genuinely fuzzy step) |
| Narrative: coverage, trade-offs, gaps, "what to relax" | LLM, grounded in the scored data |

A single orchestrated flow (derive → search → score → LLM interpret/summarize → write collection) is sufficient; an open-ended autonomous agent is not obviously needed.

### 3.4 Gaps
1. **Search API** (inputs, geo semantics, pagination, price basis — per month/seat/desk?) — **[UNKNOWN]**
2. **Collection write API** (create, add space, set Saved/Shortlisted, update, delete; whether an API caller can write as a system actor) — **[UNKNOWN]**
3. **Availability/timing:** whether inventory exposes availability for a given `Start Date` and term — **[UNKNOWN]**; demo only has a boolean `isAvailable`.
4. **Budget semantics:** requirement `Budget ($/mo)` vs listing price units — **[UNKNOWN]**.
5. **Requirement data quality:** the MVP hover card shows 0 matches when budget is $0 or location is ambiguous; the agent must refuse or flag instead of searching on missing criteria.
6. **Re-run semantics:** "Update collection" and the documented re-trigger on requirement edits imply versioning/diffing and preservation of human Saved/Shortlisted choices **[DOCUMENTED-INTENT; mechanism UNKNOWN]**.
7. **One collection per requirement** appears to be the model, but Configuration includes "Collection of spaces" vs "Single space" — how these interact is **[UNKNOWN]**.

---

## 4. Relevant architecture and integrations

### 4.1 What exists in the demo repo **[DEMO-VERIFIED]**
- Stack: React 18, TypeScript, Vite 6, Tailwind v4, Radix UI, react-router-dom 7. SPA served by Vercel (`vercel.json` rewrites to `/index.html`).
- Data: `components/data/mvpRequirements.ts` (requirement model, default tasks/team), `components/data/requirementsStore.ts` (in-memory store shared by Requirements and Tasks pages), `sessionStorage` key `tm.originatedRequirements` for Hub-originated rows. **Resets on reload (except the Hub-originated rows).**
- Cross-surface links are **hard-coded URLs** in `nav/nav-data.ts` (all in-repo pages share one deployment; Workplace Strategist is a **separate** Vercel project at `workplacestrategist-internal.vercel.app`).
- **Demo requirement type** (`MvpRequirement`/`RequirementDetails`): `id, name, company, status, stage, budget, city, lastUpdated, agentTasks, collection{name,totalSpaces,location,locationSpaces,budgetLabel,budgetSpaces,peopleLabel,peopleSpaces,saved,shortlisted,updated}, details{dealId, createdDate, location, capacity, size, workspaceType, configuration, programNeeds, amenityNeeds, otherFunctional, startDate, termLength, closeDate, otherCommercial, notes[], tasks[], team[], documents[], events[]}, origin?`. This is a **UI model shaped by screenshots**, not the MVP schema.

### 4.2 Integration points

| Integration | State | Evidence |
|---|---|---|
| **Workplace Strategist → TM** (Hub Locator "Open in Transaction Manager") | Working in the demo as a **URL-parameter handoff**; no API, no shared store, no auth. | `RequirementsHome.tsx`, `components/hubOrigin.ts` |
| **TM → Workplace Strategist** | Optional `back` URL param renders a "Back to Hub Locator" link. | `hubOrigin.ts` (`safeHttpUrl`: http(s) only) |
| **License Administrator ↔ TM** | **None in code.** The License Tracker is a separate demo module; the only conceptual link is the *License Administration* task in the Execution stage ("Validate Closure Documents and Confirm Operational Handoff"). Executing a requirement does **not** create a license record. | task list; no shared model |
| **HubSpot** | **No code or config.** Mentioned only in tooling settings, not the product. Any company/deal sync is **[UNKNOWN / not built]**. | repo-wide search |
| **Marketplace / inventory** | Nav link only; no API use. | `nav/nav-data.ts` |
| **Pulse** | Not referenced by TM. Documented in MarketTide architecture doc as the network-facts authority (owner: Jim). | `docs/markettide-implementation-architecture.md` |
| **Identity/permissions** | None. Actor shown on Timeline is a hard-coded `david@liquidspace.com`; team/assignee lists are static. | `mvpRequirements.ts` |
| **LLM / agent runtime** | **None.** No SDK, no keys, no endpoints. All "agents" are scripted text or random data. | repo-wide search |

### 4.3 Data flows an implementation would need **[ASSUMPTION]**
- *Intake:* user input → LLM extraction → validators/lookups (company, geography, optional license) → **draft** shown in New Requirement modal → user confirms → existing create path.
- *Collection:* saved requirement → derive criteria → marketplace search → score → (LLM interpretation/summary) → Collection create/populate → Timeline event + assessment record.

### 4.4 Permissions and approval boundaries **[ASSUMPTION — for decision]**
- Intake produces drafts only; the existing create action is the sole write and stays user-initiated.
- Collection creation is a write the agent performs; options: (a) agent writes automatically after requirement creation, (b) agent proposes, user approves. The MVP copy says the assessment "runs automatically" — whether *sourcing* should also be automatic is a product decision (Section 5).
- Agent writes should be attributable (actor = agent identity) and appear on the Timeline, matching the existing event model (`created`, `team`, `collection`, `task`…).
- Customer briefs/documents sent to an LLM need an explicit data-handling policy **[UNKNOWN]**.

---

## 5. Key product and architectural decisions (need David / Jim input)

1. **Is the MVP's Requirements Intake Agent / Market Sourcing Agent / Collection Assessment Agent real, stubbed, or copy-only?** (Team tab lists them on every requirement.) This determines whether we extend or build.
2. **What are the actual APIs** for marketplace search and Collection create/add/update/remove/favorite (and their auth model)? Who owns them (Jim? David?)
3. **Where does company truth live?** (HubSpot, LiquidSpace company table, both?) And is HubSpot a *read* dependency for Intake?
4. **Location model:** keep free text and normalize at runtime, or add structured geography (and sub-market) to the requirement? Does one requirement allow multiple locations?
5. **Budget & capacity semantics:** confirm `Budget ($/mo)` is total monthly, and how it maps to listing price units; how `Capacity/Headcount` becomes the "4-6 people" range.
6. **Automatic vs. user-triggered Collection creation** after a requirement is saved; and whether re-runs on requirement edits should ever overwrite Sales' Saved/Shortlisted curation.
7. **Existing-record intake scope:** which records can seed a requirement (License Admin license, an existing workspace/booking, a prior requirement)? What is the License ↔ Requirement relationship (renewal, replacement, expansion)?
8. **Document intake:** is upload-at-creation in scope, and what is allowed to leave the platform to an LLM provider?
9. **Auditability:** should agent-generated field values be marked (confidence/source quote) on the draft, and logged on the Timeline?
10. **Assessment model:** adopt the tiering in `collection-assessment-history-spec.md` (Strong/Partial/Weak, five dimensions) as the contract, or revise?
11. **Single Workspace Type / single Location** limits vs real briefs — expand, or accept and push extras into free text?

---

## 6. Initial implementation assessment **[ASSUMPTION — relative, not estimates]**

| Capability | Relative complexity | Main dependencies | Notes |
|---|---|---|---|
| **Intake — Natural language** | Low–Medium | LLM extraction + schema validation; geography normalization; company lookup | Highest leverage per effort; works against today's New Requirement form (UI already exists). |
| **Intake — Existing record (License ID / Hub Locator-style)** | Low (if record API exists) / Blocked (if not) | Record lookup API; mapping table License→Requirement | Deterministic; little LLM needed. Hub Locator handoff already demonstrates the pattern. |
| **Intake — Brief/document** | Medium–High | Document upload + text extraction; data-handling policy; multi-location handling | Same extraction core as NL, plus ingestion and ambiguity. |
| **Collection Agent — search + create + populate** | Medium–High, gated | Marketplace search API; Collection write API; availability data | Complexity is dominated by *access to APIs we have not confirmed*, not by the agent logic. |
| **Collection Agent — assessment narrative** | Low–Medium | Scored data from the step above | Straightforward once structured results exist. |

**Possible sequencing [ASSUMPTION]:** (1) resolve decisions 1, 2 and 3 above (they determine feasibility); (2) NL intake as a reviewed draft (self-contained, uses existing create path); (3) existing-record intake; (4) Collection Agent first pass (deterministic search/score first, LLM interpretation second); (5) document intake last.

**Major risks:** unknown/unconfirmed inventory and collection APIs; poor requirement data quality (e.g. $0 budget, free-text location) producing empty or misleading collections; budget/price unit mismatches; silent overwriting of Sales' curation on re-run; customer-document confidentiality.

---

## Appendix A — Source references (demo repo)

| Topic | File |
|---|---|
| Requirements page (MVP-style) | `components/RequirementsHome.tsx` |
| New Requirement modal (MVP-style) | `components/NewRequirementModal.tsx` |
| Requirement Details modal & tabs | `components/RequirementDetailsModal.tsx`, `RequirementWorkflowTab.tsx`, `RequirementTeamTab.tsx`, `RequirementDocumentsTab.tsx`, `RequirementTimelineTab.tsx` |
| Requirement Tasks page | `components/RequirementTasksHome.tsx` |
| Requirement/task/team/event data model & defaults | `components/data/mvpRequirements.ts`, `components/data/requirementsStore.ts` |
| Hub Locator handoff parsing | `components/hubOrigin.ts`, `RequirementsHome.tsx` |
| Legacy mocked intake "agent" | `components/CreateEditDealModal.tsx` (`generateDraftFrom*`) |
| Legacy mocked collection/assessment | `components/BrokerFlow.tsx` (`MOCK_ASSESSMENTS`, `generateMockAssessment`), `components/data/collectionSpaces.ts`, `components/DealDetailsModal.tsx` (`CollectionTab`, mock agent tasks), `components/SpaceSourcing.tsx` |
| License Tracker schema (demo) | `components/licenseFieldOptions.ts`, `LicenseDetailModal.tsx`, `AddLicenseModal.tsx` |
| Specs / intent | `FUNCTIONAL_SPEC.md`, `docs/collection-assessment-history-spec.md`, `docs/markettide-implementation-architecture.md` |
| Cross-surface links | `nav/nav-data.ts` |

## Appendix B — MVP screenshots (as supplied by David)

All in `docs/briefing-assets/`:
`mvp-requirements-list.png` · `mvp-collection-hover-card.png` · `mvp-row-menu.png` · `mvp-new-requirement-modal-top.png` · `mvp-new-requirement-modal-bottom.png` · `mvp-requirement-overview.png` · `mvp-workflow-tab.png` · `mvp-team-tab.png` · `mvp-timeline-tab.png`

Live demo (not the MVP): `https://labs.liquidspace.app/transactions/list`.
