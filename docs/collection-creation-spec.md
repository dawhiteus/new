# Create Collection Agent — Spec
Transaction Manager | Nov 2026 | Overview: [agents-overview.md](agents-overview.md) | Screens and copy: [design-reference/create-collection-states.md](design-reference/create-collection-states.md)

**Required** = product requirement. **Default** = the prototype's choice; engineering may change it. **TM user** = the LiquidSpace person working the requirement.

## Job
In one action, create a LiquidSpace Collection for a Requirement, fill it with matching spaces, and link it to the Requirement. Creating a Collection gives no verdict on it; whether it is good enough is the Assess Collection agent's job.

## Use cases
As a TM user, I want to…

| # | I want to… | So that… |
|---|---|---|
| C1 | create, fill and link a Collection for a Requirement in one action | I have candidate spaces without searching LiquidSpace by hand |
| C2 | name the Collection before it's created | it's recognisable in LiquidSpace and when shared |
| C3 | know why I can't create one yet | I can fix the Requirement or link a Collection instead |
| C4 | be told when nothing matched | an empty Collection isn't mistaken for an error |
| C5 | link a Collection I already built in LiquidSpace | my existing work is used, not duplicated |
| C6 | see a Collection's size and fit at a glance from the Requirements table | I can tell which Requirements need attention without opening each one |
| C7 | open the Collection in LiquidSpace | I can work with the spaces where they live |

## Rules
**C1–C4: Create**
- **Required:** offered on every Requirement without a Collection, at any stage or status, Drafts included.
- **Required:** the user can edit the name before creating. **Default** name: "{Requirement} Collection".
- **Required:** a Location is needed. Without one, say so and still offer Link (C5).
- **Required:** fill the Collection from the Requirement's location, headcount and workspace type, using public listings only. Never invent inventory. Private listings from venue proposals come in later through Add Space (see the Assess spec).
- **Required:** if nothing matches, still create the Collection, empty, and say no suitable spaces were found in that city.
- **Required:** remember the requirement values the Collection was built from, so a later change can be detected (see the Assess spec).
- **Default:** headcount band of −20% / +40% (5 people → 4-7).

**C5: Link existing**
- **Required:** accept a LiquidSpace Collection URL. Reject anything else with a clear message. Never change a linked Collection's contents.

**C1, C5: Outcome of either path**
- **Required:** the Collection is linked to the Requirement, and the Requirement shows it with its space count with no further user action.
- **Required:** one Timeline event: "Collection Created" or "Collection Linked".
- **Required:** the Workflow's Create Collection step reads as done.

**C6–C7: At a glance**
- **Required:** the Requirements table shows the Collection's space count, with a way to open it in LiquidSpace.
- **Default:** a hover card shows the Collection's name and update date; counts in the location, within budget and within the headcount band; Saved and Shortlisted totals; the assessment status and any change notice (see the Assess spec); and actions: View, Assess, Add Space, and Update when the Requirement has changed.

## Acceptance criteria
1. Every Requirement without a Collection offers Create Collection, Drafts included. (C1)
2. Without a Location, Create is unavailable and the reason is shown; Link still works. (C3)
3. A Requirement with a budget still gets matching spaces, and its budget is unchanged afterwards. (C1)
4. After creation, the Requirement shows the Collection and its space count with no further user action. (C1, C6)
5. An empty result creates an empty Collection and says so, naming the city. (C4)
6. An invalid URL links nothing and shows an error. A valid URL links the Collection without changing it. (C5)
7. Each path writes exactly one Timeline event. (C1, C5)
8. The Collection opens in LiquidSpace from the Requirements table. (C7)
