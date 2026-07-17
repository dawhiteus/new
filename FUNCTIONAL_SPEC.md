# LiquidSpace SaaS Navigation System — Component Specification
Version 2.0 · July 2026

---

## 1. Purpose & Scope

The Navigation System is the universal application shell shared by every LiquidSpace SaaS app (Transaction Manager, Workplace Strategist, and future products). It comprises exactly three parts:

1. **Chrome header** — global brand, search, notifications, settings, account
2. **Sidebar** — cross-product navigation
3. **Page-header system** — two sanctioned in-content header tiers that destination pages must choose between

**Out of scope:** everything below the page header. Destination apps own their page content entirely.

Live reference implementation: `lssaasnavsystem.vercel.app` (this repo). Every measurement in this spec is implemented there.

---

## 2. Architecture & Integration Contract

- **`nav/nav-data.ts` is the single source of truth** for the information architecture: products (pillars), groups, items, children, URLs, and access profiles. Host apps import it; the IA is never duplicated.
- **Shared components:** `SidebarA` (sidebar), `ChromeHeader` (chrome header). Each host app mounts both; page headers are built by the destination app to §6.
- **CSS isolation:** the sidebar root uses `all: initial` and inline styles only — no CSS classes. It must render identically regardless of the host app's Tailwind version or global stylesheet.
- **Cross-app navigation is hostname-based** (see §5.4). The system assumes multiple apps on multiple hostnames presenting as one product.

### Canonical app URLs

| App | Canonical URL |
|---|---|
| Transaction Manager | `https://transaction-manager-git-main-david-4453s-projects.vercel.app` |
| Workplace Strategist | `https://workplacestrategist-internal.vercel.app` |

The TM git-main URL is stable across deploys. Never use deployment-hash URLs. The WS URL is its own Vercel project — never alias it from another project.

---

## 3. Layout

| Region | Spec |
|---|---|
| Chrome header | Top, full viewport width, 64px, white, 1px bottom border `#e5e7eb` |
| Sidebar | Left, below chrome header, 244px fixed, always visible, no collapse, scrolls independently |
| Content area | Remaining space; owned by the destination app; begins with a §6 page header |

Base typography: Inter, `#374151` body text.

---

## 4. Chrome Header & Co-branding

### 4.1 Left — co-brand lockup (`CoBrand`)

The customer brand leads; LiquidSpace is de-emphasized:

1. **Customer logo/wordmark** — full color, rendered first. (Prototype renders the profile's org name as a wordmark in `#005b94`; production substitutes the customer's uploaded logo.)
2. Vertical 1px divider, 28px tall, `#e5e7eb`
3. **LiquidSpace lockup, grayscale** (`#9ca3af`) — glyph + wordmark with a "POWERED BY" microlabel (7px, uppercase, 0.18em tracking) above the wordmark

No customer co-brand (e.g., internal LiquidSpace users) → the LiquidSpace lockup renders alone in primary brand blue, no "POWERED BY" label.

### 4.2 Right — utility cluster

Left to right: **search** (⌘K), **notifications** (red count badge: `#dc3545`, 9px/700), **settings**, then the **user pill** (28px avatar with initials on `#005b94`, menu glyph, 1.5px `#005b94` outline, fully rounded).

Icon buttons: 36×36px, 8px radius, hover `#f8f9fa`.

---

## 5. Sidebar

### 5.1 Structure

```
Pillar (product)
  └── Group (functional area)
        └── Item (nav destination)
              └── Child item (sub-destination, optional)
```

- **Pillars** — top-level products, in order: **Workplace Strategist**, then **Workplace Operations**. Collapsible header row: 22px colored icon badge, uppercase 11px/700 label, right chevron (rotates 90° on toggle, 150ms). Both expanded by default.
- **Groups** — labeled sections within a pillar (uppercase 10px/700, `#6b7280`, 0.08em tracking). Collapsible. A pillar with a single group hides the group header.
- **Items** — 13px rows, 15px leading icon, 12px radius. Items with children show a right chevron and expand **in place**; they never navigate.
- **Children** — indented (28px left padding) below their expanded parent.

### 5.2 Interaction behavior

- Clicking an item with a URL navigates (see §5.4). Clicking a parent with children toggles expansion only.
- The parent row shows the active state when any of its children is active.
- Navigating directly to a child URL auto-expands its parent.

### 5.3 IA rule — nav children vs. in-page tabs

Nav children are **only** for distinct data destinations — separate datasets, each with its own chart/table/modals, that a user meaningfully "navigates to." Settings-style facets belong in **in-page tab bars**, never in the nav.

| Example | Pattern | Reason |
|---|---|---|
| Activity → Reservations / Searches / Reviews | Nav children | Separate datasets and views |
| Setup → General / Admins / SSO / Integrations | In-page tabs | Facets of one settings page |
| Branding → General / Onboarding / Portal / Email | In-page tabs | Facets of one settings page |
| Teams, Locations | Single items | One page with internal controls |

### 5.4 Navigation behavior

Hostname-based, always:

- Destination URL hostname **matches** `window.location.hostname` → client-side routing (no reload)
- Hostname **differs** → `window.location.href = url` (full-page navigation, same tab)

Never branch on product identity for routing. Never force a new tab — users get new tabs via standard browser conventions (⌘-click).

### 5.5 Access control

Access profiles (in `nav-data.ts`) declare which products and items a user can reach. Inaccessible items render **locked**: disabled, `#9ca3af` text, trailing lock icon. A fully inaccessible pillar shows a lock message with the reason instead of its groups.

### 5.6 Visual states (items)

| State | Background | Text / Icon |
|---|---|---|
| Active | `#005b94` | White |
| Hover (inactive) | `#f8f9fa` | `#374151` / `#6b7280` |
| Locked | Transparent | `#9ca3af` + lock icon |
| Default | Transparent | `#374151` / `#6b7280` |

Badges: numeric → red pill (`#dc3545`); text (e.g. "NEW") → teal pill (`#00b8c4`); both white 9–10px/600–700, fully rounded.

---

## 6. Page Headers

Page headers live **inside the content area**, below the chrome header, right of the sidebar. They are owned by the destination app, scroll with the page (not sticky), and never duplicate chrome-header responsibilities — no brand marks, no user/utility controls.

There are exactly **two tiers**. No other variants.

**The rule:** if the user *manages things* on the page (forms, tables, workflows) → Tier 1. If the user *analyzes a canvas* (dense data workbench with side panels) → Tier 2. New pages must pick a tier by this rule.

### 6.1 Tier 1 — Blue Page Header band (operational pages)

Used by: Transactions, Tasks, Teams, Locations, Activity pages, Setup, Branding, License Tracker, Payments, Funding Sources. Reference: `PageHeaderBand` (this repo).

| Element | Spec |
|---|---|
| Container | Full-bleed gradient `linear-gradient(135deg, #004A7C 0%, #005B94 60%, #0071B8 100%)`; padding `28px 32px 32px` |
| Content wrapper | `max-width: 1280px`, centered; flex row, space-between |
| Icon | 24px, white, 12px gap to title |
| Title | 28px / 700, white, letter-spacing −0.3px — the nav item's label, title-case |
| Subtitle | 14px / 400, `rgba(255,255,255,0.75)` — one sentence, sentence-case, period |
| Action slot | Top right, optional; holds header buttons (§6.2) |

### 6.2 Header buttons

Buttons and filter controls are allowed in the Tier 1 action slot. One treatment — translucent white on the gradient, never solid brand colors:

| Property | Spec |
|---|---|
| Background | `rgba(255,255,255,0.15)`; hover `rgba(255,255,255,0.25)` |
| Border | 1px `rgba(255,255,255,0.25)` |
| Radius | 10px |
| Text | White, 14px / 500 |
| Padding | 10px 18px |
| Glyph | Optional leading glyph (e.g. "+"), white, 6–8px gap |
| Filter dropdowns | Same treatment + label prefix + trailing chevron ("Period: **This Month** ⌄") |
| Multiple controls | 12px gap, right-aligned; actions after filters |
| Disabled | 50% opacity, no hover |

Destructive actions never live in the band — they belong next to the content they affect.

### 6.3 Tier 2 — Slim context toolbar (analytical workbench pages)

Used by: Portfolio Compiler, Scenario Modeler, Hub Locator. Reference: `ContextToolbar` (this repo).

| Element | Spec |
|---|---|
| Container | White, fixed 48px height, 1px `#e5e7eb` bottom border, padding `0 24px`; spans the canvas width (between sidebar and any right-side analysis panel) |
| Page identity (left) | 11px / 600, uppercase, 0.08em tracking, `#6b7280` — the nav item's label, never a generic word |
| Data-as-of timestamp (right) | 12px, `#6b7280` — e.g. "Data as of Jul 17, 2026 · 12:05 PM" |

Both slots are required. No gradient, no large title, no page actions — actions belong in the canvas or side panel.

Rationale: page identity is already established by the sidebar's active state; on a workbench every vertical pixel is working space.

---

## 7. Current IA

Pillar order: Workplace Strategist, then Workplace Operations.

**Workplace Strategist** (pillar color `#00b8c4`) — all pages Tier 2

| Group | Item | URL |
|---|---|---|
| Workplace Strategist | Portfolio Compiler | `workplacestrategist-internal.vercel.app/portfolio-compiler` |
| | Scenario Modeler | `workplacestrategist-internal.vercel.app/scenario-modeler` |
| | Hub Locator | `workplacestrategist-internal.vercel.app/hub-locator` |

**Workplace Operations** (pillar color `#005b94`) — all pages Tier 1, on the TM app

| Group | Item | Children | Path |
|---|---|---|---|
| Workplace Manager | Dashboard | — | `/workplace/dashboard` |
| | Teams | — | `/workplace/teams` |
| | Locations | — | `/workplace/locations` |
| | Activity | Reservations, Searches, Reviews | `/workplace/activity/{reservations,searches,reviews}` |
| | Setup | — | `/workplace/setup` |
| | Branding | — | `/workplace/branding` |
| License Administrator | License Tracker | — | `/license/tracker` |
| | Payments | — | `/license/payments` |
| | Funding Sources | — | `/license/funding` |
| | Tasks | — | `/license/tasks` |
| Transaction Manager | Transactions | — | `/transactions/list` |
| | Tasks | — | `/transactions/tasks` |

---

## 8. Design tokens

| Token | Value | Use |
|---|---|---|
| `ls-500` | `#005b94` | Primary brand, active states, Tier 1 gradient mid-stop |
| `ls-teal` | `#00b8c4` | Strategist pillar, "NEW" badges |
| Gradient | `135deg: #004A7C → #005B94 (60%) → #0071B8` | Tier 1 page header |
| Text | `#374151` | Body |
| Text muted | `#6b7280` | Secondary labels |
| Text disabled | `#9ca3af` | Locked items, grayscale lockup |
| Border | `#e5e7eb` | All hairlines |
| Page | `#f8f9fa` | Hover fills, content background |
| Danger | `#dc3545` | Notification badges |
| Font | Inter | Everything |

---

## 9. Prototype notes

- Selecting a nav item in this prototype resolves **in place** to a stub page rendering the correct page-header tier, with an "Open live page ↗" link to the deployed app — so the prototype demonstrates the full shell without leaving the demo.
- Demo content uses the fictitious customer **Tel Tech**. Never use real company names in demo content or spec examples.
