# Collection Assessment
Transaction Manager | Functional Specification | v.2 draft

## Objective
A Collection is a list of candidate spaces for a Requirement. The Collection Assessment Agent tells Sales whether that list is good enough (plenty of matches, few, none, or an empty collection) and why. It makes it easy to change the criteria and see the effect, to ask questions, and to add a space Sales already knows about. It does not choose among candidates; that stays with Sales and the customer.

The page does two things: it **says what the agent sees and why**, and it lets people **ask questions** and see answers, including what-ifs. Requirement values are edited in Requirement Details, not here.

## 1. Where it is merchandised and accessed
The assessment opens in a modal. Every Requirement that has a Collection has an Assess action; there are no exceptions and nothing to hunt for:
1. **Collection pill hover card (Requirements table):** a one-line status ("Few matches", "Empty collection", "Not assessed") and an **Assess collection** link beside View Collection.
2. **Requirement row menu:** **Assess collection** with View, Update and Remove collection.

Update collection refreshes the Collection's spaces. Assess explains whether the Collection is enough and what would improve it.

Held back for now: a button on the "Collection populated" confirmation, the Workflow task, and a "re-check" line on the Requirement Overview. Intended users are the Transaction Manager team; customer-scoped access is untested.

## 2. Identity
The agent is marked with the agent icon pattern used elsewhere: the green agent icon in a neutral circle, named **Collection Assessment Agent**, and it speaks in the first person ("I checked the 8 spaces…"). No badges, pills or colored tags are used.

## 3. What the page shows
**What I see.** A card with the plain result (Plenty of matches, Few matches, No matches, Empty collection, or Not assessed) and a summary in the agent's voice: what it checked, how many fit and why the rest do not. It also gives one sentence for the next best change and a link to add the matching nearby spaces. Beneath it:
* Three counts: spaces in the search area, within budget, and for the headcount band.
* **Gaps and trade-offs** (or **Why it's empty**), one plain sentence per row: Area, Budget, Capacity, Workspace type, Rate (more than 15% over market), Listings (not updated in 90 days), Term, Not assessed.
* The spaces, collapsed, each with distance, seats, rate, listing age and reason, and a link to its listing.

**Ask me.** A conversation with the agent, with a few example questions shown as plain text before the first question. Each answer is short, with the spaces behind it. Questions and answers appear as a simple conversation; the input is fixed at the bottom.

**Edit requirement.** A link in the header opens Requirement Details, the one place values are edited by hand.

## 3a. What-ifs and changes
A what-if is only an answer. "What if the budget goes up 15%?" is answered with the effect (for example "Few matches → Plenty of matches. 3 spaces would newly fit") and the spaces behind it. When an answer implies a change, it offers explicit actions under the answer: **Update the requirement: budget $9,000 → $10,350/mo**, and, if nearby spaces would fit, **Add the 3 nearby spaces to <collection>**. Nothing changes until one is chosen. Updating the requirement is a normal requirement update, logged on the Timeline; it never edits the Collection. Adding spaces never changes the requirement.

## 4. An empty or unassessable Collection
This is a primary reason to assess. The agent says what is going on:
* **Empty, location known:** it looks at the listings near the location and reports, per criterion, how many pass (Area, Workspace type, Capacity, Budget) and how many pass all of them. If some pass, it says the collection did not need to be empty and offers to add them. If none pass, it names the biggest blocker.
* **Empty, location not found:** it says it cannot search because it cannot find that location, and suggests asking about a city or using Edit requirement.
* **A budget is set:** it notes the known platform issue that populate returns nothing when a requirement has a budget, which can leave a collection empty even when spaces exist.
* **Spaces not available to the demo:** it says so plainly ("Not assessed") rather than hiding the action.

## 5. Questions the agent answers
* **What I see:** "Why is it empty?", "Summarize".
* **Count or list:** "How many Private Offices under $5,000 within 3 miles?", "Show nearby spaces that fit".
* **What-if:** budget, search distance, headcount or location ("What if we look in Austin?").
* **Explain a space:** "Why isn't Regus Westlake a fit?"
* **Add a space:** pasting a LiquidSpace link adds the space and says whether it fits. There is no confirmation step. A venue link lists that venue's spaces to choose from. A link that is not LiquidSpace cannot be added; it needs a private listing created by the supply team. The agent never contacts a venue.

## 6. Core rules
* **Fit:** the right area, the headcount band, the budget and the workspace type. Confirmed means the listing was updated within 90 days (from the listing's last-modified date). Plenty is 5 or more confirmed fits, Few is 1 to 4. Availability is not known and is never inferred.
* **One source of truth:** the Requirement's fields are the Collection's definition. What-ifs are answers only; a change is an explicit action, and adding or removing spaces never changes the Requirement.
* **Search area:** with none given, the city center and 5 miles are used. A search distance is stored as text in Other Functional Requirements.
* **Boundaries:** the agent does not set the Shortlist, change stage or status, or contact any venue.

## 7. Data and tool basis
* Per-space facts are computed from Pulse (venue location, rate, seats, minimum term, last-modified date, booking method, venue response time). The platform's Assess tool did not reconcile in testing and gives nothing per workspace, so it is not the source.
* Not available: availability dates, Shortlist control, task or note writes, and any inquire, tour or book operation.

## 8. Prototype notes
* The browser demo cannot call Pulse. For each assessable city (Austin, Chicago, Minneapolis, Dallas, New York, Porto, Denver, Lisbon) the spaces of its real LiquidSpace collection are recorded with their Pulse facts, plus a pool of the nearest real listings. Counts that cover the market cover that recorded pool, and answers say so.
* Adding a space is recorded for the demo session only; in the product it is `add_workspace_to_collection`.
* Ask matches free text to question types by simple rules; the product would use a language model for that step with the same queries behind it.

## 9. Open questions
* Does the existing LiquidSpace "search profile" belong in this design, or alongside it?
* Should "confirmed" use only listing age, or also RFP quotes once private listings exist?
* Customer-scoped access and permissions for Ask and Add.
* Does Assess evolve to per-workspace output, or does the agent keep its own scoring?
