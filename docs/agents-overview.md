# Transaction Manager Agents — Overview
Design close-out, Nov 2026

Three agents take a dedicated requirement from customer correspondence to a candidate list Sales can judge. Each has its own spec with the same structure: Job, Entry points, Inputs and outputs, Flow and states, Rules, Copy, Data and platform limits, Out of scope / open questions, Acceptance criteria.

## How they connect
```
Customer email / notes / license
        │
        ▼
 Requirement Agent ──── creates or updates the Requirement (fields, initial note, open questions)
        │
        ▼
 Create Collection Agent ──── creates, populates and links a LiquidSpace Collection
        │
        ▼
 Assess Collection Agent ──── is the list good enough? N of M meet every criterion
        │                         │
        │       thin ─────────────┼──► Update Collection (search again) / Add Space / RFP outside TM
        │                         │
        └── requirement changes ──┴──► "changed since built" notice → Update → reassess
```

## Specs
| Agent | Spec | Status | Prototype entry |
|---|---|---|---|
| Requirement Agent | [requirement-agent-spec.md](requirement-agent-spec.md) | Design complete | Create Requirement; Requirement Details → Update Fields |
| Create Collection Agent | [collection-creation-spec.md](collection-creation-spec.md) | Design complete | Collection column → Create Collection |
| Assess Collection Agent | [collection-assessment-spec.md](collection-assessment-spec.md) | Design complete | Collection pill → Assess; row menu; Workflow tab |
| Shared UI patterns | [agent-ui-patterns.md](agent-ui-patterns.md) | Reference | — |
| Assessment history event model | [collection-assessment-history-spec.md](collection-assessment-history-spec.md) | **Superseded** (June, tier-based) | — |

Figma: _add file links here._ Name frames by spec state ID (e.g. `Requirement / C6 Draft ready`, `Assess / A6 Requirement changed`) so each frame traces to a row in a spec.

## Principles shared by all three
1. **The agent proposes, a person decides.** Nothing is written until the user acts.
2. **Never claim what the platform can't do.** No task or later-note writes, no Shortlist control, no availability data.
3. **Requirement fields are the single source of truth.** Collection agents read them, never write them.
4. **Observations, not verdicts.** Counts and gaps, no scores, no recommended next step.
5. **Opt-in and restrained identity.** Green agent icon, first-person voice, no "AI" badges.

## Platform constraints that shape the designs
| Constraint | Affects |
|---|---|
| One note per requirement, at create | Requirement Agent: source text and open questions live there; later replies update fields only |
| No task writes | Intake Task; Workflow tasks are read from data, not set |
| Populate returns nothing when a budget is set; ignores search area; leaves the link empty | Create Collection call sequence; Assess empty-state note |
| Platform Assess tool doesn't reconcile | Assess computes per-space facts from Pulse |
| Workspaces added one at a time; no Shortlist control | Add Space, Update Collection, groups |

## Prototype vs production
The browser demo cannot call Pulse or MCP. It uses recorded Pulse data for eight real LiquidSpace collections (Austin, Chicago, Minneapolis, Dallas, New York, Porto, Denver, Lisbon) and an in-memory store that resets on reload. Each spec's §7 lists what is real and what is simulated.

## Cross-agent open items
- Agent naming: "Create Collection Agent" vs "Market Sourcing Agent", and "Assess Collection Agent" vs "Collection Assessment Agent", appear in different places. Pick one name per agent.
- Draft minimum: prototype requires a name only; MCP requires name, company and workspace type.
- Where the customer Intake Task lives in production (HubSpot or a TM task API).
- Ask (scoped questions, pattern 11) is designed but held out of V1.

## Glossary
- **Requirement:** one customer need in one city.
- **Collection:** a LiquidSpace list of candidate spaces linked to a Requirement.
- **Headcount band:** −20% / +40% around headcount (5 → 4-7).
- **Confirmed:** public listing updated within 90 days, or private listing with a valid quote.
- **Thin:** fewer than 5 confirmed spaces meeting every criterion.
- **Groups:** Shortlist (chosen by a person), Favorites, Recommendations (the agent's matches).
- **Pulse:** LiquidSpace's analytics datasets, the source of per-space and per-venue facts.
