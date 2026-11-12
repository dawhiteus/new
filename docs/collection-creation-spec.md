# Create Collection Agent — Spec
Transaction Manager | Nov 2026 | Overview: [agents-overview.md](agents-overview.md) | Screens and copy: [design-reference/create-collection-states.md](design-reference/create-collection-states.md)

**Required** = product requirement. **Default** = the prototype's choice; engineering may change it.

## Job
In one action, create a LiquidSpace Collection for a Requirement, fill it with matching spaces, and link it to the Requirement. Creating a Collection gives no verdict on it; whether it is good enough is the Assess Collection agent's job.

## Rules
- **Required:** offered on every Requirement without a Collection, at any stage or status, Drafts included.
- **Required:** the user can name the Collection before it's created. **Default** name: "{Requirement} Collection".
- **Required:** a Location is needed to create one. Without it, say so, and still let the user link an existing Collection.
- **Required:** fill the Collection from the Requirement's location, headcount and workspace type. Never invent inventory.
- **Required:** if nothing matches, still create the Collection, empty, and say no suitable spaces were found.
- **Required:** the user can link an existing Collection by URL instead. Reject a link that isn't a LiquidSpace Collection, and never change a linked Collection's contents.
- **Required:** both paths end with the Collection linked to the Requirement and one Timeline event ("Collection Created" or "Collection Linked").
- **Required:** remember the requirement values the Collection was built from, so a later change can be detected (see the Assess spec).
- **Required:** use public listings only. Private listings from venue proposals come in later through Add Space.
- **Default:** headcount band of −20% / +40% (5 people → 4-7).
- **Default:** the Collection pill's hover card shows counts in location, within budget and within the headcount band, plus Saved and Shortlisted totals.

## Platform limits
These come from prototype testing in Nov 2026; confirm them before building.
- Populate returns nothing when the Requirement has a budget.
- Populate ignores the search area.
- Populate doesn't link the Collection to the Requirement; that's a separate step.
- MCP can't mark a Workflow task complete. Show completion by checking for a linked Collection instead.
- Workspaces are added to a Collection one at a time.
- Collections are private to their owner until shared.

## Acceptance criteria
1. Every Requirement without a Collection offers Create Collection, Drafts included.
2. Without a Location, Create is unavailable and the reason is shown; Link still works.
3. A Requirement with a budget still gets matching spaces, and its budget is unchanged afterwards.
4. After creation, the Requirement shows the Collection and its space count with no further user action.
5. An empty result creates an empty Collection and says so, naming the city.
6. An invalid URL links nothing and shows an error. A valid URL links the Collection without changing it.
7. Each path writes exactly one Timeline event.

## Open questions
- Should populate use the search area once the platform supports it?
- Agent name: "Create Collection Agent" or "Market Sourcing Agent"? Both appear in the prototype.
