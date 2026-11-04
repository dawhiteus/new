# Collection Creation
Transaction Manager | Functional Specification | v.2

## Objective
Reduce the time and effort required to build a LiquidSpace Collection for a Requirement. One action creates a Collection, fills it with candidate spaces that match the Requirement, and links it to the Requirement. Whether the Collection is good enough is a separate question, answered by Assessment (see collection-assessment-spec.md).

## 1. User Experience
Any Requirement without a Collection shows **Create Collection** in the Collection column, regardless of stage or status (including Drafts). It opens a **New Collection** dialog:
* The Requirement name and a suggested Collection name (editable), formed as "<Requirement> Collection".
* A short note that the agent sources spaces from the Requirement's location, headcount, budget and workspace type, and that a collection link and fitness assessment will appear in the Requirements table.
* **Create Collection** and **Cancel**. A secondary action, **Link an existing collection**, opens a single field for a LiquidSpace Collection URL.

After creation, a **Collection populated** confirmation offers **View Collection** (opens it in LiquidSpace) and Close.

## 2. Core Behavior
1. **Create:** create the Collection, populate it with spaces that match the Requirement's location, capacity and workspace type, and attach it to the Requirement. A Location is required; without one the dialog says so and the user can link a Collection instead. No inventory is invented.
2. **No suitable spaces:** the Collection is still created, empty, and the confirmation says no suitable spaces were found.
3. **Link existing:** the user enters a Collection URL. Validate that it identifies a LiquidSpace Collection; if not, show a clear error. Attach it and show its name and workspace count. Do not modify its contents.
4. **Same result for both paths:** the Collection is linked to the Requirement and the Timeline records the event. Collections are managed in LiquidSpace; Transaction Manager has no separate Collection management interface.

## 3. What the Collection column shows
The Collection pill shows the workspace count. Its hover card shows the Collection name, total spaces, three counts and the saved and shortlisted totals:
* In the Requirement's location
* Within the Requirement's budget per month
* For the headcount, as a band around it (for example 5 people is shown as 4-7, 30 as 24-42)

When the Collection can be assessed, the card also shows a one-line status (Plenty, Few or No matches) and an **Assess collection** link. The row menu offers **Assess collection** with View, Update and Remove collection. Creation itself gives no judgment of the result; that belongs to Assessment.

## 4. Platform notes
* Populate returns nothing when a Requirement has a budget set, ignores the search area, and leaves the Requirement's Collection link empty. The product call sequence must handle these: create the Collection, populate (without the budget), attach the Collection to the Requirement, then restore the budget.
* The Collection is built from public listings only. Private listings created from venue proposals enter a Collection through other steps.
* Collections are private to their owner until shared.
