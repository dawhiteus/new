# Collection Assessment
Transaction Manager | Functional Specification | v.2 draft

## Objective
A Collection is a list of candidate spaces for a Requirement. The Collection Assessment Agent tells Sales whether that list is good enough (plenty of matches, few, none, or an empty collection) and why. It makes it easy to change the criteria and see the effect, to ask questions, and to add a space Sales already knows about. It does not choose among candidates; that stays with Sales and the customer.

The page does three things: it **explains what the agent found and why**, it lets people **adjust** the requirement's values simply, and it shows **what changes** when they do.

## 1. Where it is merchandised and accessed
The assessment opens in a modal. Every Requirement that has a Collection has an Assess action; there are no exceptions and nothing to hunt for:
1. **Collection pill hover card (Requirements table):** a one-line status ("Few matches", "Empty collection", "Not assessed") and an **Assess collection** link beside View Collection.
2. **Requirement row menu:** **Assess collection** with View, Update and Remove collection.

Update collection refreshes the Collection's spaces. Assess explains whether the Collection is enough and what would improve it.

Held back for now: a button on the "Collection populated" confirmation, the Workflow task, and a "re-check" line on the Requirement Overview. Intended users are the Transaction Manager team; customer-scoped access is untested.

## 2. Identity
The agent is marked with the agent icon pattern used elsewhere: the green agent icon in a neutral circle, named **Collection Assessment Agent**, and it speaks in the first person ("I checked the 8 spaces…"). No badges, pills or colored tags are used.

## 3. What the page shows
**What I found.**
* A plain result (Plenty of matches, Few matches, No matches, Empty collection, or Not assessed) and a short summary in the agent's voice: what it checked, how many fit, and why the rest do not.
* Three counts: spaces in the search area, within budget, and for the headcount band.
* **Gaps and trade-offs**, one plain sentence per row: Area, Budget, Capacity, Workspace type, Rate (more than 15% over market), Listings (not updated in 90 days), Term, and Not assessed.
* One sentence for the next best change ("Raising the budget to $11,700/mo would add 2 matching spaces"), a link to add the matching nearby spaces, and a link to show the spaces, each with its distance, seats, rate, listing age and reason.

**Adjust.** Five fields, prefilled from the Requirement: Location, People, Budget, Workspace type and Search distance. Editing a field changes nothing. Reset restores the values.

**What changes.** Appears once a value is edited. It shows before and after for the result, the fits in this Collection, and the matching spaces nearby, and lists the spaces that would newly fit. **Apply to the requirement** writes the changed values to the Requirement as a normal update, logged on the Timeline. The Collection's spaces are never changed by this.

**Ask.** One input at the bottom: "Ask me about this collection, or paste a link to a space and I'll add it."

## 4. An empty or unassessable Collection
This is a primary reason to assess. The agent says what is going on:
* **Empty, location known:** it looks at the listings near the location and reports, per criterion, how many pass (Area, Workspace type, Capacity, Budget) and how many pass all of them. If some pass, it says the collection did not need to be empty and offers to add them. If none pass, it names the biggest blocker.
* **Empty, location not found:** it says it cannot search because it cannot find that location, and asks for a city under Adjust.
* **A budget is set:** it notes the known platform issue that populate returns nothing when a requirement has a budget, which can leave a collection empty even when spaces exist.
* **Spaces not available to the demo:** it says so plainly ("Not assessed") rather than hiding the action.

## 5. Ask and add by link
Question types: count or list ("How many Private Offices under $5,000 within 3 miles?"), what-if ("What if the budget goes up 15%?"), explain ("Why isn't Regus Westlake a fit?"), and adding a space. Answers are short lines under the input. A what-if puts its values into Adjust and shows the effect under What changes; it never changes the Requirement itself.

**Adding a space.** Pasting a LiquidSpace link adds the space to the Collection and says whether it fits. There is no confirmation step. A venue link lists that venue's spaces to choose from. A link that is not LiquidSpace cannot be added; it needs a private listing created by the supply team. The agent never contacts a venue.

## 6. Core rules
* **Fit:** the right area, the headcount band, the budget and the workspace type. Confirmed means the listing was updated within 90 days (from the listing's last-modified date). Plenty is 5 or more confirmed fits, Few is 1 to 4. Availability is not known and is never inferred.
* **One source of truth:** the Requirement's fields are the Collection's definition. Adjust and what-ifs are read-only previews; only Apply writes, and adding or removing spaces never changes the Requirement.
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
