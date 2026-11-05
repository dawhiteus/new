# Collection Assessment
Transaction Manager | Functional Specification | v.2 draft

## Objective
A Collection is a list of candidate spaces for a Requirement. The Collection Assessment Agent tells Sales how many of those spaces meet every criterion of the Requirement, why the rest do not, and what that means for the next step: enough to work with, or thin and in need of an RFP to venues. It can be run again whenever the Requirement or the Collection changes, and it says what changed. It does not choose among candidates, and it does not edit the Requirement; requirement values are edited in Requirement Details.

## 1. Where it is merchandised and accessed
The assessment opens in a modal. Every Requirement that has a Collection has an Assess action; there are no exceptions and nothing to hunt for:
1. **Collection pill hover card (Requirements table):** a one-line status ("Few matches", "Empty collection", "Not assessed") and an **Assess collection** link beside View Collection.
2. **Requirement row menu:** **Assess collection** with View, Update and Remove collection.

Update collection refreshes the Collection's spaces. Assess explains whether the Collection is enough and what would improve it.

Held back for now: a button on the "Collection populated" confirmation, the Workflow task, and a "re-check" line on the Requirement Overview. Intended users are the Transaction Manager team; customer-scoped access is untested.

## 2. Identity
The agent is marked with the agent icon pattern used elsewhere: the green agent icon in a neutral circle, named **Collection Assessment Agent**, and it speaks in the first person ("I checked the 8 spaces…"). No badges, pills or colored tags are used.

## 3. What the page shows
**Heading.** The title bar matches the other modals (solid blue, white title, close), followed by the agent bar used elsewhere. Then two facts side by side:
* **Spaces added:** how many spaces are in the collection and, when the Collection Agent built it, why ("matched on location, headcount and workspace type when the collection was built"). For a collection built another way it says it cannot say why.
* **Meet every criterion:** how many of those spaces meet the area, headcount, budget and workspace type of the Requirement together, with the criteria named.

Below them, only what can be observed: what was checked, and any spaces that would meet every criterion except for a stale listing. The agent does not judge the result ("none fit", "thin") or recommend a next step; the counts and gaps tell the story and people decide. If the assessment has run before and something changed, one more line says what changed and how the matches moved. There is no score.

**Criteria cards.** One card per criterion the requirement gives (area, budget, headcount, workspace type), each showing how many spaces meet it ("4 of 8"). Cards are plain white with a thin border. Color is used only for contrast: the number is red when no space meets the criterion and green when every space does.

**Gaps and trade-offs** (or **Why it's empty**). One plain sentence per row, giving the detail behind the cards and not repeating their counts: the nearest and farthest distance, the lowest price over budget, the size range against the size needed, the workspace type mix, spaces over the market rate, stale listings, term, and what was not assessed.

The spaces follow, collapsed, each with distance, seats, rate, listing age and reason, and a link to its listing.

## 3a. Running it again
The agent remembers its last assessment of each Requirement. It is run again by opening Assess collection, and it is out of date when:
* a value that matters to the match changes on the Requirement (location, workspace type, headcount, budget or search distance), or
* the Collection's spaces change (for example when proposals from venues become spaces).

When it is out of date, the collection's hover card says so ("Out of date: the requirement or collection has changed. Assess again.") so nobody has to guess. The next run adds a line saying what changed since the last one ("Since last assessed on Nov 4: budget $9,000/mo → $12,000/mo. Matches 0 → 2.") and the Timeline records it as "Collection Assessed" ("Reassessed after budget $9,000/mo → $12,000/mo: 0 → 2 of 8 meet every criterion."). The first run is recorded too. A run with nothing changed since the last one adds nothing to the Timeline.

The loop the documents describe is iterative: assessing a thin collection prompts sourcing (Update collection, or an RFP outside Transaction Manager), and changed requirements prompt reassessment.

## 4. An empty or unassessable Collection
This is a primary reason to assess. The agent says what is going on:
* **Empty, location known:** it looks at the listings near the location and reports, per criterion, how many pass (Area, Workspace type, Capacity, Budget) and how many pass all of them. If some pass, it says the collection did not need to be empty and offers to add them. If none pass, it names the biggest blocker.
* **Empty, location not found:** it says it cannot search because it cannot find that location, and suggests asking about a city or using Edit requirement.
* **A budget is set:** it notes the known platform issue that populate returns nothing when a requirement has a budget, which can leave a collection empty even when spaces exist.
* **Spaces not available to the demo:** it says so plainly ("Not assessed") rather than hiding the action.

## 5. Core rules
* **Fit:** the right area, the headcount band, the budget and the workspace type. Confirmed means the listing was updated within 90 days (from the listing's last-modified date). Plenty is 5 or more confirmed fits, Few is 1 to 4. Availability is not known and is never inferred.
* **One source of truth:** the Requirement's fields are the Collection's definition. The agent reads them and never changes them.
* **Search area:** with none given, the city center and 5 miles are used. A search distance is stored as text in Other Functional Requirements.
* **Boundaries:** the agent does not set the Shortlist, change stage or status, or contact any venue.

## 6. Data and tool basis
* Per-space facts are computed from Pulse (venue location, rate, seats, minimum term, last-modified date, booking method, venue response time). The platform's Assess tool did not reconcile in testing and gives nothing per workspace, so it is not the source.
* Not available: availability dates, Shortlist control, task or note writes, and any inquire, tour or book operation.

## 7. Prototype notes
* The browser demo cannot call Pulse. For each assessable city (Austin, Chicago, Minneapolis, Dallas, New York, Porto, Denver, Lisbon) the spaces of its real LiquidSpace collection are recorded with their Pulse facts, plus a pool of the nearest real listings. Counts that cover the market cover that recorded pool, and answers say so.

## 8. Open questions
* Does the existing LiquidSpace "search profile" belong in this design, or alongside it?
* Should "confirmed" use only listing age, or also RFP quotes once private listings exist?
* Chat and what-if exploration are a design hypothesis in the project charter, not a requirement in the workflow or capability documents. They are out of this version and can be revisited.
* Does Assess evolve to per-workspace output, or does the agent keep its own scoring?
