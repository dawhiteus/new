# Collection Creation and Collection Agent
Transaction Manager | Functional Specification | v.1

## Objective
Reduce the time and effort required to build a LiquidSpace Collection for a Requirement. Sales can link an existing Collection, have the Collection Agent source and populate one, or create a named Collection in LiquidSpace. All three produce the same outcome: a LiquidSpace Collection associated with the Requirement.

## 1. User Experience
Any Requirement without a Collection shows a **Create Collection** action in the existing Collection column, regardless of its stage or status (including Drafts). Selecting it opens a modal with three options:

* **Use Existing Collection:** Link a Collection already built in LiquidSpace.
* **Create with Collection Agent:** The agent sources spaces and builds the Collection.
* **Create Manually in LiquidSpace:** Name a Collection here, then add spaces in LiquidSpace.

Once associated, the Collection column shows the Collection's workspace count and opens it in LiquidSpace. Collections are managed in LiquidSpace. Transaction Manager does not provide a separate Collection management interface.

## 2. Core Behavior

1. **Use Existing Collection:** Sales enters a Collection URL. Validate that it identifies a LiquidSpace Collection; if not, show a clear error. Associate it with the Requirement and display its name and workspace count. Do not modify its contents.
2. **Create with Collection Agent:** Sales explicitly invokes the agent. See Section 3.
3. **Create Manually:** Sales enters a Collection name (suggested from the Requirement, editable). The Collection is created in LiquidSpace, associated with the Requirement, and opened in LiquidSpace for Sales to add spaces. No URL entry is required.
4. **Same result for all paths:** The Collection is linked to the Requirement, the sourcing task notes record how it was created, and the Timeline records the event.

## 3. Collection Agent

**Inputs:** The agent uses the Requirement's existing fields: Location, Capacity, Budget, Workspace Type, Start Date, and Term. Fields that are not provided display as Not provided and are not inferred. A Location is required to search; without one, explain the limitation and allow Sales to link or create a Collection another way. Draft Requirements may use the agent if a Location is provided.

**Sourcing:**
* Suggest a Collection name, editable by Sales.
* Search LiquidSpace marketplace inventory only. Do not fabricate inventory, pricing, or availability.
* Create the Collection and populate it with relevant candidates, if available, and associate it with the Requirement. If no suitable inventory is found, create an empty Collection and clearly explain the result.

**Results summary:** Show a concise, factual summary. It reports what the agent found; it does not score, rank, or recommend.
* **Overview:** Collection name, total spaces, and how many match the Requirement's location, budget, and headcount.
* **Observations:** Short, plain-language notes on obvious mismatches (for example, spaces over budget or not available by the start date) and any Requirement criteria it could not match, because they were not provided or the available inventory data does not support them (for example, term length or amenity needs).
* Sales reviews the Collection in LiquidSpace and decides next steps, including whether to look beyond marketplace inventory.

**Records:** The Create Collection sourcing task is marked complete and retains the agent's output and observations as task notes.

## 4. Collection Display and Management
* The Requirements table shows the Collection link and workspace count. Selecting it opens the Collection in LiquidSpace.
* The Collection remains associated with its Requirement. Removing the association returns the Create Collection action.
* Sales continues to add, remove, and organize spaces in LiquidSpace.

## 5. Agent Visibility and Boundaries
* The Collection Agent is clearly identified, shows working and completion states, and attributes its Timeline entries and task notes to the agent.
* Sales reviews and controls the resulting Collection.
* The agent does not contact operators, solicit inventory, negotiate terms, or communicate with customers. Sales decides whether to look beyond marketplace inventory; supply-side activities belong to separate processes.
* The agent runs once per request; there is no automatic re-run when the Requirement changes.

## 6. HubSpot Integration
Collection creation follows the standard Transaction Manager–HubSpot integration, as defined in the separate Integration Mapping specification. Agent outputs are recorded as notes, not tasks. No HubSpot logic is required within Collection creation.

## 7. Dependencies
* A LiquidSpace capability to create a named, empty Collection and return its link (Create Manually).
* LiquidSpace marketplace search with location, capacity, price, workspace type, and availability data (Collection Agent).
* A way to read a Collection's name and workspace count from its URL (Use Existing).

## 8. Success Criteria
* Sales can associate an existing Collection by URL, with invalid links rejected clearly.
* Sales can create a populated Collection with the agent, using only real inventory, with a clear summary of what was found.
* Sales can create a named Collection in LiquidSpace without leaving Transaction Manager to copy a link.
* All three paths result in a Collection link and workspace count against the Requirement.
* The results summary states which criteria it could not match.
* The agent never presents invented inventory, pricing, or availability.

## 9. Open Questions
* **API operations:** The Marketplace collections endpoints are listed as done, but only list, add, and remove are mentioned. Confirm a create (named, empty) operation exists, and that a Collection's name and workspace count can be read from its URL.
* **Off-marketplace venues:** Can a Collection hold a venue with no marketplace listing? This affects how Sales enriches a Collection after the agent builds it.
* **Agent naming:** Is this a single Collection Agent, or the existing Market Sourcing Agent role (sourcing) with assessment left to Sales? Timeline and task-note attribution should use one name.
* **Assessment:** Not an agent responsibility in v.1. Sales reviews the Collection. Revisit an on-demand assessment of any associated Collection once collection contents can be read.
