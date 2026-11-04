# Collection Assessment
Transaction Manager | Functional Specification | v.1 draft

## Objective
A Collection is a list of candidate spaces for a Requirement. Assessment tells Sales whether that list is good enough: plenty of matches, few, or none. It makes it easy to widen or change the criteria, to ask what a change would do, and to add a space Sales already knows about. It does not choose among candidates; choosing stays with Sales and the customer.

## 1. Where it is merchandised and accessed
Assessment opens in a modal, in the same style as Create Collection. It has no page of its own and nothing runs on its own. Two entry points, both on a Requirement that has a Collection:

1. **Collection pill hover card (Requirements table).** The card shows a one-line status ("Few matches") under the Collection name and an **Assess** link beside View Collection. The status is visible without opening anything.
2. **Requirement row menu.** **Assess collection** joins the existing collection group: View collection, **Assess collection**, Update collection, Remove collection.

**How it relates to Update collection.** Update collection refreshes the Collection's spaces (Populate). Assess tells Sales whether the Collection is enough and what would widen it. An accepted proposal in Assess can lead to Update collection; the two stay separate actions.

**Held back for now:** a button on the "Collection populated" confirmation, the Workflow task, and a "re-check" line on the Requirement Overview. They can be added later without changing the modal.

Not included: automatic runs, badges that nag, and anything on the LiquidSpace collection page (outside Transaction Manager). Intended users are the Transaction Manager team; customer-scoped access is untested.

## 2. What it shows
1. **Headline:** **Plenty**, **Few** or **None**, with one sentence. A *fit* is a space that meets the Requirement's location, capacity, budget and workspace type. Plenty is 5 or more confirmed fits. Few is 1 to 4. None is 0. Fits that are not confirmed are counted separately ("3 more fit, but their listings are older than 90 days").
2. **What limits the pool:** a short funnel showing how many spaces each criterion removes, for example "Budget removes 9 of 14. Area removes 3."
3. **Widen or change:** proposals drawn from the funnel, for example "Raise budget 15%: adds 6" or "Search within 5 miles: adds 3". Each uses Accept / Keep mine.
4. **Ask:** a question box (section 4).
5. **Add a space:** paste a LiquidSpace link (section 5).
6. **Spaces and evidence on demand:** the candidate spaces, each expandable to show why it counts or does not, with the source of every value (for example "2.1 mi from the search center, from the venue location", "$270 per seat against a market median of $320, from 18 listings", "minimum term 12 months against 24 requested", "listing updated 41 days ago"). Availability shows as "not known"; it is never inferred.
7. **History:** a timeline of assessments, for example "Assessed: Few" and "Re-assessed after budget change: Few to Plenty".

## 3. Core behavior
**Candidates.** Everything in the Collection counts: Favorites (MCP "potential") and Shortlist together. The agent also reports how many matching spaces exist in the market that are not in the Collection.

**Confirmed.** A space is confirmed when its listing was updated within 90 days (from the listing's last-modified date) or it has a current RFP quote. Availability data is not used: Pulse holds an availability date for almost no listings.

**Must-haves first.** A space that misses a must-have is not a fit at any price. Rates more than 15 percent above the local market are flagged.

**Scoring.** Per space, four dimensions: location by true distance, workspace type, capacity band, and budget per seat against market. Term is shown as a gap, not scored. Each dimension is Strong, Partial or No match; a dimension with no matching space anywhere in the Collection is shown as "No match". A 0 to 100 score with reasons supports the evidence view and does not drive the headline.

**What changes the Requirement.** Nothing automatically. There is one source of truth: the Requirement's fields are the Collection's definition. What-ifs are read-only and labelled "if". A change to the Requirement happens only when Sales accepts a proposal; it is written as a normal Requirement update and logged by the platform. Adding or removing spaces never changes the Requirement. After an accepted change, the Collection is marked as assessed before the change and the agent offers a re-check: budget, headcount or type changes re-check the same spaces; a location change offers to refresh the Collection with new spaces. A search area has no field, so it is stored as text in Other Functional Requirements.

**Boundaries.** The agent does not set the Shortlist, change stage or status, or contact any venue. Anything that needs a venue (an RFP, a new listing) is a note for the supply side.

## 4. Ask
Ask follows the Ask pattern (agent-ui-patterns, section 11). Scope is "this collection". Suggested questions reflect the current state, led by the biggest limiter from the funnel. Question types:
* **Count:** "How many Private Offices under $5,000 within 3 miles?"
* **What-if:** "If budget goes up 15 percent?" Shows the change in Plenty, Few or None and offers the Requirement change.
* **Explain:** "Why is this space not a fit?"
* **Find:** "Show spaces like this one." Lists matches from the market, with a proposal to add them.
* **Add:** a pasted link (section 5).

Each answer is a card: the answer, the evidence, and an optional proposal. Follow-ups are "refine" chips on the last answer. There is no conversational memory in V1. Unsupported questions say so and suggest the nearest supported one.

## 5. Add a space by link
Sales pastes a LiquidSpace space link. The agent resolves it to the workspace and venue, shows the same evidence as other candidates, and proposes **Add to collection**, listing the operation first ("Add 1 workspace to Austin Collection"). After it is added, the agent re-checks and shows the effect.

Edge cases: a venue link lists that venue's spaces to choose from; a space already in the Collection says so; a hidden or unlisted space explains why it cannot be added; a link that is not LiquidSpace cannot be added, because that needs a private listing (Venue Manager, BL-027), and the agent leaves a note for the supply side.

## 6. Data and tool basis
* **Per-space metrics are computed from Pulse** (workspace and venue data, market medians). The platform's Assess tool returns counts that did not reconcile in testing and gives nothing per workspace, so it is not the source. The scoring rules are written here so engineering can adopt or replace them: one definition of a match.
* Logged platform issues affect Collection building, not assessment: Populate returns nothing when a Requirement has a budget, ignores the search area, and leaves the Collection link empty.
* Not available: availability dates, Shortlist control, task or note writes, and any inquire, tour or book operation.

## 7. Records
Assessments appear in the Timeline. Accepted Requirement changes are logged by the platform as field changes. The agent cannot write tasks or notes through MCP, so the Assess Collection task keeps only a link to the latest result in the prototype; in the product this depends on task writes (F10).

## 8. Open questions
* Does the existing LiquidSpace "search profile" belong in this design, or alongside it?
* Should "confirmed" use only listing age in V1, or also RFP quotes once private listings exist?
* Customer-scoped access and permissions for Ask and Add.
* Does Assess evolve to per-workspace output, or does the agent keep its own scoring?
