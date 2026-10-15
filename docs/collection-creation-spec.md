# Collection Creation and Collection Agent
Transaction Manager | Functional Specification | v.1

## Objective
Reduce the time and effort required to build a LiquidSpace Collection for a Requirement. Sales can link an existing Collection, have the Collection Agent source and assess one, or create a named Collection in LiquidSpace. All three produce the same outcome: a LiquidSpace Collection associated with the Requirement.

## 1. User Experience
Requirements without a Collection show a **Create Collection** action in the existing Collection column. Selecting it opens a modal with three options:

* **Use Existing Collection:** Link a Collection already built in LiquidSpace.
* **Create with Collection Agent:** The agent sources spaces, builds the Collection, and assesses the fit.
* **Create Manually in LiquidSpace:** Name a Collection here, then add spaces in LiquidSpace.

Once associated, the Collection column shows the Collection's workspace count and opens it in LiquidSpace. Collections are managed in LiquidSpace. Transaction Manager does not provide a separate Collection management interface.

## 2. Core Behavior

1. **Use Existing Collection:** Sales enters a Collection URL. Validate that it identifies a LiquidSpace Collection; if not, show a clear error. Associate it with the Requirement and display its name and workspace count. Do not modify its contents.
2. **Create with Collection Agent:** Sales explicitly invokes the agent. See Section 3.
3. **Create Manually:** Sales enters a Collection name (suggested from the Requirement, editable). The Collection is created in LiquidSpace, associated with the Requirement, and opened in LiquidSpace for Sales to add spaces. No URL entry is required.
4. **Same result for all paths:** The Collection is linked to the Requirement, the sourcing task notes record how it was created, and the Timeline records the event.

## 3. Collection Agent

**Inputs:** The agent uses the Requirement's existing fields: Location, Capacity, Budget, Workspace Type, Start Date, and Term. Fields that are not provided display as Not provided and are not inferred. A Location is required to search; without one, explain the limitation and allow Sales to link or create a Collection another way.

**Sourcing:**
* Suggest a Collection name, editable by Sales.
* Search LiquidSpace marketplace inventory only. Do not fabricate inventory, pricing, or availability.
* Create the Collection and populate it with relevant candidates, if available, and associate it with the Requirement. If no suitable inventory is found, create an empty Collection and clearly explain the result.

**Assessment:** Show a concise overview and a short list of gaps and trade-offs:
* **Overview:** Collection name, total spaces, how many match the Requirement's location, budget, and headcount, and the count of Strong, Partial, and Weak matches.
* **Gaps and trade-offs:** Only categories that apply (for example Budget, Capacity, Workspace type, Availability), each in one plain sentence.
* **Not assessed:** List any Requirement criteria the agent could not assess, because they were not provided or the available inventory data does not support them.
* Individual spaces are reviewed in LiquidSpace, not in Transaction Manager.

**Records:** The Create Collection and Assess Collection sourcing tasks are marked complete and retain the agent's output and assessment as task notes.

## 4. Collection Display and Management
* The Requirements table shows the Collection link and workspace count. Selecting it opens the Collection in LiquidSpace.
* The Collection remains associated with its Requirement. Removing the association returns the Create Collection action.
* Sales continues to add, remove, and organize spaces in LiquidSpace.

## 5. Agent Visibility and Boundaries
* The Collection Agent is clearly identified, shows working and completion states, and attributes its Timeline entries and task notes to the agent.
* Sales reviews and controls the resulting Collection.
* The agent may identify gaps that warrant additional supply but does not contact operators, solicit inventory, negotiate terms, or communicate with customers. Those activities belong to separate supply-side processes.
* The agent runs once per request; there is no automatic re-run when the Requirement changes.

## 6. HubSpot Integration
Collection creation follows the standard Transaction Manager–HubSpot integration, as defined in the separate Integration Mapping specification. Agent outputs are recorded as notes, not tasks. No HubSpot logic is required within Collection creation.

## 7. Dependencies
* A LiquidSpace capability to create a named, empty Collection and return its link (Create Manually).
* LiquidSpace marketplace search with location, capacity, price, workspace type, and availability data (Collection Agent).
* A way to read a Collection's name and workspace count from its URL (Use Existing).

## 8. Success Criteria
* Sales can associate an existing Collection by URL, with invalid links rejected clearly.
* Sales can create a populated, assessed Collection with the agent, using only real inventory.
* Sales can create a named Collection in LiquidSpace without leaving Transaction Manager to copy a link.
* All three paths result in a Collection link and workspace count against the Requirement.
* The assessment states which criteria it could not assess.
* The agent never presents invented inventory, pricing, or availability.
