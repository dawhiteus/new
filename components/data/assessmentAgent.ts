// Scripted Collection Assessment (prototype). Computes from the recorded Pulse facts in assessmentData.ts.
// Rules are written in docs/collection-assessment-spec.md so that one definition of a match exists.
import { criteriaFor } from './collectionAgent';
import { capacityBand } from './collectionAgent';
import { CENTERS, collectionSpaces, marketPool, listingByUrl, listingsAtVenue, exampleLink, type AssessSpace } from './assessmentData';
import type { MvpRequirement } from './mvpRequirements';

export type Status = 'Plenty' | 'Few' | 'None';
export type Tier = 'Strong' | 'Partial' | 'Weak';
type Dim = 'pass' | 'near' | 'fail' | 'na';

export interface AssessCriteria {
  city: string;
  centerLabel: string;
  lat: number;
  lng: number;
  radiusMi: number;
  radiusIsDefault: boolean;
  capacity: number | null;
  budget: number | null;
  type: string;
  termMonths: number | null;
}

export interface SpaceResult {
  space: AssessSpace;
  miles: number;
  area: Dim;
  capacity: Dim;
  budget: Dim | 'unknown';
  type: Dim;
  tier: Tier;
  fit: boolean;
  confirmed: boolean;
  ageDays: number;
  perSeat: number | null;
  marketPerSeat: number | null;
  overMarket: boolean;
  reason: string;
  issues: string[];
}

export type ReqPatch = { budget?: number; searchArea?: string; capacity?: number };

export interface Widen {
  id: string;
  title: string;
  detail: string;
  patch: ReqPatch;
  gainCollection: number;
  gainMarket: number;
}

export interface Assessment {
  status: Status;
  headline: string;
  total: number;
  inArea: number;
  withinBudget: number | null;
  forPeople: number | null;
  tiers: Record<Tier, number>;
  confirmedFits: number;
  unconfirmedFits: number;
  marketMore: number;
  marketFits: SpaceResult[];
  results: SpaceResult[];
  funnel: { label: string; removes: number }[];
  gaps: { label: string; text: string }[];
  widen: Widen[];
  criteria: AssessCriteria;
  bandText: string | null;
  /** Set when there is nothing to score: the collection is empty, or its spaces aren't available to the demo. */
  limited?: 'empty' | 'unrecorded';
}

const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const miles = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 3958.8, rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const daysAgo = (iso: string) => Math.max(0, Math.round((Date.now() - new Date(iso + 'T00:00:00').getTime()) / 86400000));
const cityKey = (loc: string) => loc.toLowerCase().split(',')[0].trim();

export function criteriaForAssessment(r: MvpRequirement): AssessCriteria | null {
  const c = criteriaFor(r);
  const key = cityKey(c.location);
  const center = CENTERS[key];
  if (!center) return null;
  const sa = (r.details.otherFunctional || '').match(/within\s+(\d+(?:\.\d+)?)\s*miles?/i);
  const term = parseInt(c.termLength, 10);
  return {
    city: key, centerLabel: center.label, lat: center.lat, lng: center.lng,
    radiusMi: sa ? parseFloat(sa[1]) : 5, radiusIsDefault: !sa,
    capacity: c.capacity, budget: c.budget, type: c.workspaceType, termMonths: Number.isFinite(term) && term > 0 ? term : null,
  };
}

/** Can this requirement's collection be assessed from recorded data? */
/** Every requirement that has a collection can be assessed; when there is nothing to score the result says so. */
export const canAssess = (r: MvpRequirement) => !!r.collection;

function evaluate(sp: AssessSpace, c: AssessCriteria, medians: Record<string, number>): SpaceResult {
  const mi = miles(sp, c);
  const area: Dim = mi <= c.radiusMi ? 'pass' : mi <= c.radiusMi * 2 ? 'near' : 'fail';
  let capacity: Dim = 'na';
  if (c.capacity) { const [lo, hi] = capacityBand(c.capacity); capacity = sp.desks >= lo && sp.desks <= hi ? 'pass' : sp.desks > hi ? 'near' : 'fail'; }
  let budget: SpaceResult['budget'] = 'na';
  if (c.budget) budget = sp.rate == null ? 'unknown' : sp.rate <= c.budget ? 'pass' : sp.rate <= c.budget * 1.15 ? 'near' : 'fail';
  const type: Dim = c.type ? (sp.type === c.type ? 'pass' : 'near') : 'na';

  const dims = [area, capacity, budget, type].filter((d): d is Dim => d !== 'na' && d !== 'unknown');
  const pts = dims.reduce((n, d) => n + (d === 'pass' ? 1 : d === 'near' ? 0.5 : 0), 0);
  const fails = dims.filter((d) => d === 'fail').length;
  const ratio = dims.length ? pts / dims.length : 0.6;
  const tier: Tier = fails === 0 && ratio >= 0.9 ? 'Strong' : ratio >= 0.6 ? 'Partial' : 'Weak';
  const fit = area === 'pass' && (capacity === 'pass' || capacity === 'na') && (budget === 'pass' || budget === 'unknown' || budget === 'na') && (type === 'pass' || type === 'na');
  const age = daysAgo(sp.modified);
  const perSeat = sp.rate != null && sp.desks ? sp.rate / sp.desks : null;
  const mps = medians[sp.type] ?? null;
  const overMarket = perSeat != null && mps != null && perSeat > mps * 1.15;

  const issues: string[] = [];
  if (area !== 'pass') issues.push(`${mi.toFixed(1)} mi from ${c.centerLabel}`);
  if (budget === 'near' || budget === 'fail') issues.push(`${money((sp.rate as number) - (c.budget as number))}/mo over budget`);
  if (capacity === 'near') issues.push(`Larger than needed (${sp.desks} seats)`);
  if (capacity === 'fail') issues.push(`Holds ${sp.desks}, needs ${c.capacity}`);
  if (type === 'near') issues.push(`Not ${c.type}`);
  if (overMarket) issues.push('Over market rate');
  if (age > 90) issues.push(`Listing not updated in ${age} days`);
  const good = [`${mi.toFixed(1)} mi`, `${sp.desks} seats`, sp.rate != null ? `${money(sp.rate)}/mo` : 'Not priced monthly'];
  return { space: sp, miles: mi, area, capacity, budget, type, tier, fit, confirmed: age <= 90, ageDays: age, perSeat, marketPerSeat: mps, overMarket, issues, reason: (issues.length ? issues.slice(0, 3) : good).join(' · ') };
}

const mediansFor = (all: AssessSpace[]) => {
  const out: Record<string, number> = {};
  for (const t of Array.from(new Set(all.map((s) => s.type)))) {
    const xs = all.filter((s) => s.type === t && s.rate != null && s.desks).map((s) => (s.rate as number) / s.desks);
    if (xs.length >= 4) out[t] = median(xs);
  }
  return out;
};

/** Spaces added to a collection during this demo session (the browser cannot write to LiquidSpace). */
export const addedSpaces = new Map<string, string[]>();

function context(r: MvpRequirement) {
  const c = criteriaForAssessment(r);
  if (!c) return null;
  const base = collectionSpaces(c.city);
  if (!base.length) return null;
  const extraUrls = addedSpaces.get(r.id) ?? [];
  const extras = extraUrls.map((u) => listingByUrl(u)?.space).filter((x): x is AssessSpace => !!x).map((x) => ({ ...x, inCollection: true }));
  const members = [...base, ...extras];
  const taken = new Set(members.map((m) => m.url));
  const pool = marketPool(c.city).filter((p) => !taken.has(p.url));
  return { c, members, pool };
}

export function assess(r: MvpRequirement): Assessment | null {
  const x = context(r);
  if (x) return run(x.c, x.members, x.pool);
  if (!r.collection) return null;
  return limitedAssessment(r);
}

/** A collection with nothing the demo can score: an empty one, or one whose spaces have not been recorded. */
function limitedAssessment(r: MvpRequirement): Assessment {
  const col = r.collection!;
  const cc = criteriaFor(r);
  const empty = col.totalSpaces === 0;
  const loc = (cc.location || r.city || 'the requirement location').split(',')[0];
  const c: AssessCriteria = { city: cityKey(cc.location), centerLabel: loc, lat: 0, lng: 0, radiusMi: 5, radiusIsDefault: true, capacity: cc.capacity, budget: cc.budget, type: cc.workspaceType, termMonths: null };
  return {
    status: 'None',
    headline: empty ? 'This collection has no spaces yet.' : "This collection's spaces aren't available to the demo, so they can't be assessed here.",
    total: col.totalSpaces, inArea: 0, withinBudget: null, forPeople: null,
    tiers: { Strong: 0, Partial: 0, Weak: 0 },
    confirmedFits: 0, unconfirmedFits: 0, marketMore: 0, marketFits: [], results: [], funnel: [],
    gaps: [{ label: 'Overall', text: empty ? 'Nothing to assess. Use Update collection to fill it with spaces that match the requirement.' : 'Spaces from this collection have not been recorded for the demo.' }],
    widen: [], criteria: c, bandText: null, limited: empty ? 'empty' : 'unrecorded',
  };
}

function run(c: AssessCriteria, members: AssessSpace[], pool: AssessSpace[]): Assessment {
  const meds = mediansFor([...members, ...pool]);
  const results = members.map((m) => evaluate(m, c, meds));
  const order: Record<Tier, number> = { Strong: 0, Partial: 1, Weak: 2 };
  results.sort((a, b) => order[a.tier] - order[b.tier] || a.miles - b.miles);

  const total = results.length;
  const confirmedFits = results.filter((x) => x.fit && x.confirmed).length;
  const unconfirmedFits = results.filter((x) => x.fit && !x.confirmed).length;
  const marketFits = pool.map((p) => evaluate(p, c, meds)).filter((x) => x.fit && x.confirmed).sort((a, b) => a.miles - b.miles);
  const marketMore = marketFits.length;
  const status: Status = confirmedFits >= 5 ? 'Plenty' : confirmedFits >= 1 ? 'Few' : 'None';
  const [lo, hi] = c.capacity ? capacityBand(c.capacity) : [0, 0];
  const bandText = c.capacity ? `${lo}-${hi} people` : null;

  const criteriaWords = ['location', c.capacity ? 'headcount' : '', c.budget ? 'budget' : '', c.type ? 'workspace type' : ''].filter(Boolean);
  const list = criteriaWords.length > 1 ? `${criteriaWords.slice(0, -1).join(', ')} and ${criteriaWords[criteriaWords.length - 1]}` : criteriaWords[0];
  const tail = unconfirmedFits ? ` ${unconfirmedFits} more fit, but their listings are older than 90 days.` : '';
  const headline =
    status === 'None' ? `No space in this collection fits your ${list}.${tail}`
    : status === 'Few' ? `Only ${confirmedFits} space${confirmedFits === 1 ? ' fits' : 's fit'} your ${list}.${tail}`
    : `${confirmedFits} spaces fit your ${list}.${tail}`;

  const inArea = results.filter((x) => x.area === 'pass').length;
  const withinBudget = c.budget ? results.filter((x) => x.budget === 'pass').length : null;
  const forPeople = c.capacity ? results.filter((x) => x.capacity === 'pass').length : null;
  const tiers: Record<Tier, number> = { Strong: 0, Partial: 0, Weak: 0 };
  results.forEach((x) => tiers[x.tier]++);

  const funnel = [
    { label: `Area (within ${c.radiusMi} mi of ${c.centerLabel})`, removes: results.filter((x) => x.area !== 'pass').length },
    ...(c.capacity ? [{ label: `Capacity (${bandText})`, removes: results.filter((x) => x.capacity !== 'pass').length }] : []),
    ...(c.budget ? [{ label: `Budget (${money(c.budget)}/mo)`, removes: results.filter((x) => x.budget === 'near' || x.budget === 'fail').length }] : []),
    ...(c.type ? [{ label: `Workspace type (${c.type})`, removes: results.filter((x) => x.type !== 'pass').length }] : []),
  ].filter((f) => f.removes > 0);

  // Gaps and trade-offs: same structure as the original assessment (label + one plain sentence).
  const gaps: { label: string; text: string }[] = [];
  if (tiers.Strong === 0) gaps.push({ label: 'Overall', text: 'No strong matches. Every space has at least one trade-off.' });
  const farther = results.filter((x) => x.area !== 'pass');
  if (farther.length) gaps.push({ label: 'Area', text: `${farther.length} of ${total} are more than ${c.radiusMi} miles from ${c.centerLabel}. The nearest is ${Math.min(...results.map((x) => x.miles)).toFixed(1)} mi.${c.radiusIsDefault ? ' No search area was given, so the city center and 5 miles are used.' : ''}` });
  if (c.budget) {
    const priced = results.filter((x) => x.space.rate != null);
    const over = priced.filter((x) => (x.space.rate as number) > (c.budget as number));
    if (priced.length) {
      const lowestOver = over.length ? Math.min(...over.map((x) => x.space.rate as number)) : null;
      gaps.push({ label: 'Budget', text: over.length === priced.length ? `None are within ${money(c.budget)}/mo. The lowest is ${money(Math.min(...priced.map((x) => x.space.rate as number)))}/mo.` : `${priced.length - over.length} of ${priced.length} are within ${money(c.budget)}/mo${lowestOver != null ? `. The lowest-priced over budget is ${money(lowestOver)}/mo.` : '.'}` });
    }
    const hi15 = results.filter((x) => x.overMarket).length;
    if (hi15) gaps.push({ label: 'Rate', text: `${hi15} of ${total} ${hi15 === 1 ? 'is' : 'are'} more than 15% above the local market rate per seat.` });
  }
  if (c.capacity) {
    const off = results.filter((x) => x.capacity !== 'pass').length;
    if (off) gaps.push({ label: 'Capacity', text: `${off} of ${total} are outside ${bandText}. The sizes in this collection range from ${Math.min(...results.map((x) => x.space.desks))} to ${Math.max(...results.map((x) => x.space.desks))}.` });
  }
  if (c.type) {
    const off = results.filter((x) => x.type !== 'pass').length;
    if (off) gaps.push({ label: 'Workspace type', text: `${off} of ${total} are not ${c.type}.` });
  }
  const stale = results.filter((x) => !x.confirmed).length;
  if (stale) gaps.push({ label: 'Listings', text: `${stale} of ${total} have listings not updated in the last 90 days, so their price and details are unconfirmed.` });
  if (c.termMonths) {
    const long = results.filter((x) => { const m = x.space.minTerm?.match(/(\d+)\s*month/); return m && +m[1] > (c.termMonths as number); }).length;
    if (long) gaps.push({ label: 'Term', text: `${long} of ${total} require a longer minimum term than ${c.termMonths} months.` });
  }
  const missing = [!c.capacity ? 'headcount' : '', !c.budget ? 'budget' : '', !c.type ? 'workspace type' : ''].filter(Boolean);
  gaps.push({ label: 'Not assessed', text: `${missing.length ? `${missing.join(', ').replace(/^./, (m) => m.toUpperCase())} ${missing.length === 1 ? 'was' : 'were'} not provided. ` : ''}Availability, amenity needs and program needs aren't in the available data.` });

  // What would widen it: re-run the same rules with one change, count the confirmed fits that appear.
  const baseColl = confirmedFits;
  const basePool = marketMore;
  const tryScenario = (cc: AssessCriteria) => ({
    coll: members.map((m) => evaluate(m, cc, meds)).filter((x) => x.fit && x.confirmed).length - baseColl,
    mkt: pool.map((m) => evaluate(m, cc, meds)).filter((x) => x.fit && x.confirmed).length - basePool,
  });
  const widen: Widen[] = [];
  if (c.budget) {
    for (const pct of [15, 30]) {
      const nb = Math.round((c.budget * (1 + pct / 100)) / 100) * 100;
      const g = tryScenario({ ...c, budget: nb });
      if (g.coll + g.mkt > 0) widen.push({ id: `b${pct}`, title: `Raise the budget ${pct}% to ${money(nb)}/mo`, detail: gainText(g.coll, g.mkt), patch: { budget: nb }, gainCollection: g.coll, gainMarket: g.mkt });
    }
  }
  for (const nr of [Math.round(c.radiusMi * 2), Math.round(c.radiusMi * 3)]) {
    const g = tryScenario({ ...c, radiusMi: nr });
    if (g.coll + g.mkt > 0) widen.push({ id: `r${nr}`, title: `Search within ${nr} miles of ${c.centerLabel}`, detail: gainText(g.coll, g.mkt), patch: { searchArea: `within ${nr} miles of ${c.centerLabel}` }, gainCollection: g.coll, gainMarket: g.mkt });
  }
  // keep the best one per kind
  const best = (pref: string) => widen.filter((w) => w.id.startsWith(pref)).sort((a, b) => (b.gainCollection + b.gainMarket) - (a.gainCollection + a.gainMarket) || a.id.localeCompare(b.id))[0];
  const picked = [best('b'), best('r')].filter(Boolean) as Widen[];

  return { status, headline, total, inArea, withinBudget, forPeople, tiers, confirmedFits, unconfirmedFits, marketMore, marketFits: marketFits.slice(0, 5), results, funnel, gaps, widen: picked, criteria: c, bandText };
}

function gainText(coll: number, mkt: number) {
  const parts = [];
  if (coll > 0) parts.push(`${coll} more in this collection`);
  if (mkt > 0) parts.push(`${mkt} more nearby, not yet in it`);
  return `Adds ${parts.join(' and ')}.`;
}

/** One short line for the hover card. */
export function quickStatus(r: MvpRequirement): { status: Status; text: string } | null {
  const a = assess(r);
  if (!a) return null;
  if (a.limited === 'unrecorded') return { status: a.status, text: 'Not assessed' };
  return { status: a.status, text: a.status === 'Plenty' ? 'Plenty of matches' : a.status === 'Few' ? 'Few matches' : 'No matches' };
}

// ── Ask ─────────────────────────────────────────────────────────────────────
// A fixed set of question types, each answered by a deterministic query over the recorded data.
// Free text is only matched to one of them (the real product would use a language model for that step).

export interface Answer {
  id: string;
  question: string;
  kind: 'count' | 'whatif' | 'explain' | 'find' | 'add' | 'help';
  headline: string;
  detail?: string;
  applied?: string;
  evidence: { title: string; sub: string; url?: string }[];
  proposal?: { title: string; patch?: ReqPatch; addUrl?: string; ops: string; effect: string };
  choices?: AssessSpace[];
  refine?: string[];
}

interface Filters { type?: string; maxRate?: number; miles?: number; seatsFor?: number; scope: 'collection' | 'nearby' | 'both' }

const TYPES: [RegExp, string][] = [[/private offices?/, 'Private Office'], [/team offices?/, 'Team Office'], [/office suites?/, 'Office Suite']];
const statusWord = (s: Status) => (s === 'Plenty' ? 'Plenty of matches' : s === 'Few' ? 'Few matches' : 'No matches');

function parseFilters(t: string): Filters {
  const f: Filters = { scope: /in this collection|in the collection|already in/.test(t) ? 'collection' : /nearby|not in (?:the|this)|outside the collection|market/.test(t) ? 'nearby' : 'both' };
  for (const [re, label] of TYPES) if (re.test(t)) { f.type = label; break; }
  const price = t.match(/(?:under|below|less than|up to|within|max(?:imum)?(?: of)?)\s*\$\s*([\d,]+(?:\.\d+)?)\s*(k)?/) ?? t.match(/(?:under|below|less than)\s*([\d.]+)\s*k\b/);
  if (price) f.maxRate = price.length === 3 ? parseFloat(price[1]) * 1000 : parseFloat(price[1].replace(/,/g, '')) * (price[2] ? 1000 : 1);
  const mi = t.match(/(\d+(?:\.\d+)?)\s*(?:miles?|mi)\b/);
  if (mi) f.miles = parseFloat(mi[1]);
  const seats = t.match(/(?:for|fits?|hold(?:s)?)\s+(\d+)\s*(?:people|seats|desks|staff|persons?)?/) ?? t.match(/(\d+)\s*(?:people|seats|persons?)/);
  if (seats) f.seatsFor = parseInt(seats[1], 10);
  return f;
}

const hasFilter = (f: Filters) => !!(f.type || f.maxRate != null || f.miles != null || f.seatsFor != null);
const filterText = (f: Filters) => [f.type, f.maxRate != null ? `under ${money(f.maxRate)}/mo` : '', f.miles != null ? `within ${f.miles} mi` : '', f.seatsFor != null ? `for ${capacityBand(f.seatsFor).join('-')} people` : ''].filter(Boolean).join(' · ');

const spaceSub = (s: AssessSpace, c: AssessCriteria) => `${s.venue} · ${miles(s, c).toFixed(1)} mi · ${s.desks} seats · ${s.rate != null ? `${money(s.rate)}/mo` : 'Not priced monthly'}${s.inCollection ? ' · in this collection' : ''}`;

export function suggestions(r: MvpRequirement): string[] {
  const x = context(r);
  if (!x) return [];
  const a = run(x.c, x.members, x.pool);
  const out: string[] = [];
  const top = [...a.funnel].sort((p, q) => q.removes - p.removes)[0];
  if (top?.label.startsWith('Budget')) out.push('What if the budget goes up 15%?');
  else if (top?.label.startsWith('Area')) out.push(`What if we search within ${Math.round(x.c.radiusMi * 2)} miles?`);
  else if (top?.label.startsWith('Workspace type') && x.c.type) out.push(`How many ${x.c.type}s are nearby?`);
  else if (top?.label.startsWith('Capacity') && x.c.capacity) out.push(`What if we need ${x.c.capacity + 4} people?`);
  out.push('Show nearby spaces that fit');
  const worst = a.results.find((q) => !(q.fit && q.confirmed));
  if (worst) out.push(`Why isn't ${worst.space.venue} a fit?`);
  return out.slice(0, 3);
}

const HELP = "I can count spaces (“How many Private Offices under $5,000 within 3 miles?”), try a what-if (“What if the budget goes up 15%?”), explain a space (“Why isn't Regus Westlake a fit?”), list spaces (“Show nearby spaces that fit”), or add a space from a LiquidSpace link.";

export function ask(text: string, r: MvpRequirement): Answer {
  const id = `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const q = text.trim();
  const t = q.toLowerCase();
  const x = context(r);
  const help = (headline = HELP): Answer => ({ id, question: q, kind: 'help', headline, evidence: [] });
  if (!x || !q) return help();
  const { c, members, pool } = x;
  const base = run(c, members, pool);
  const meds = mediansFor([...members, ...pool]);
  const all = [...members, ...pool];
  const colName = r.collection?.name ?? 'this collection';

  // Add a space by link
  const url = q.match(/https?:\/\/\S+/)?.[0];
  if (url) {
    let host = '';
    try { host = new URL(url).hostname.replace(/^www\./, ''); } catch { /* not a link */ }
    if (host !== 'liquidspace.com') return { id, question: q, kind: 'add', headline: "That isn't a LiquidSpace link, so it can't be added.", detail: 'A space outside LiquidSpace needs a private listing, which the supply team creates. I can note it for them; I never contact a venue.', evidence: [] };
    const hit = listingByUrl(url);
    if (!hit) {
      const at = listingsAtVenue(url);
      if (at.length) return { id, question: q, kind: 'add', headline: `That's a venue link. ${at.length} space${at.length === 1 ? '' : 's'} recorded there. Which one?`, evidence: [], choices: at.slice(0, 8) };
      return { id, question: q, kind: 'add', headline: "I couldn't find that listing.", detail: 'This prototype can only look up listings it has recorded. In the product the link is looked up in Pulse.', evidence: [] };
    }
    const sp = hit.space;
    if (members.some((m) => m.url === sp.url)) return { id, question: q, kind: 'add', headline: `${sp.title} (${sp.venue}) is already in this collection.`, evidence: [] };
    const res = evaluate(sp, c, meds);
    const after = run(c, [...members, { ...sp, inCollection: true }], pool.filter((p) => p.url !== sp.url));
    const effect = `${statusWord(base.status)} → ${statusWord(after.status)}. Confirmed fits ${base.confirmedFits} → ${after.confirmedFits}.`;
    return {
      id, question: q, kind: 'add',
      headline: `${sp.title} (${sp.venue}) ${res.fit && res.confirmed ? 'fits the requirement' : res.fit ? 'fits, but its listing is unconfirmed' : 'does not fit every criterion'}.`,
      detail: res.issues.length ? res.issues.join(' · ') : res.reason,
      evidence: [{ title: sp.title, sub: spaceSub(sp, c), url: sp.url }],
      proposal: { title: `Add ${sp.title} to ${colName}`, addUrl: sp.url, ops: `Add 1 workspace to ${colName}`, effect },
    };
  }

  // Explain a space
  if (/^\s*(why|explain)\b|\bwhy (?:is|isn'?t|are|aren'?t)\b/.test(t)) {
    const stop = new Set(['team', 'office', 'suite', 'private', 'person', 'with', 'from', 'that', 'this', 'what', 'does', 'isnt', 'fit', 'explain', 'collection']);
    const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3 && !stop.has(w));
    const qw = new Set(words(q));
    let best: AssessSpace | null = null, bestScore = 0;
    for (const sp of all) { const sc = words(`${sp.venue} ${sp.title}`).filter((w) => qw.has(w)).length; if (sc > bestScore) { best = sp; bestScore = sc; } }
    if (!best) return help("I couldn't tell which space you mean. Name the venue or the space, for example “Why isn't Regus Westlake a fit?”");
    const res = evaluate(best, c, meds);
    const fits = res.fit && res.confirmed;
    return {
      id, question: q, kind: 'explain',
      headline: `${best.title} (${best.venue}) ${fits ? 'fits' : 'is not a fit'}.`,
      detail: fits ? 'It meets the area, capacity, budget and workspace type, and its listing is current.' : (res.issues.length ? res.issues.join(' · ') : 'It meets every criterion, but its listing could not be confirmed.'),
      evidence: [{ title: best.title, sub: spaceSub(best, c), url: best.url }],
    };
  }

  // What if
  const whatIf = /\b(what if|what happens|suppose|widen|expand|raise|increase|lower|reduce|cut|drop)\b|^\s*if\b/.test(t);
  if (whatIf) {
    const c2 = { ...c };
    const changes: string[] = [];
    const patch: ReqPatch = {};
    const down = /\b(lower|reduce|cut|decrease|drop|down)\b/.test(t);
    const abs = t.match(/\$\s*([\d,]+(?:\.\d+)?)\s*(k)?/);
    const pct = t.match(/(\d+(?:\.\d+)?)\s*%/);
    if (c.budget && (abs || pct) && (/budget/.test(t) || pct || abs)) {
      const nb = Math.round((abs ? parseFloat(abs[1].replace(/,/g, '')) * (abs[2] ? 1000 : 1) : c.budget * (1 + (down ? -1 : 1) * parseFloat((pct as RegExpMatchArray)[1]) / 100)) / 100) * 100;
      c2.budget = nb; patch.budget = nb; changes.push(`the budget goes from ${money(c.budget)} to ${money(nb)}/mo`);
    }
    const mi = t.match(/(\d+(?:\.\d+)?)\s*(?:miles?|mi)\b/);
    if (mi && /(search|area|within|widen|radius|distance|miles)/.test(t)) {
      c2.radiusMi = parseFloat(mi[1]); patch.searchArea = `within ${mi[1]} miles of ${c.centerLabel}`; changes.push(`we search within ${mi[1]} miles of ${c.centerLabel}`);
    }
    const hc = t.match(/(\d+)\s*(?:people|seats|persons?|staff|headcount)/);
    if (hc && /(need|headcount|people|seats|team|grow|hire)/.test(t)) {
      c2.capacity = parseInt(hc[1], 10); patch.capacity = c2.capacity; changes.push(`we need ${hc[1]} people`);
    }
    if (!changes.length) return help("I can try a change to the budget, the search distance or the headcount. For example “What if the budget goes up 15%?”");
    const after = run(c2, members, pool);
    const before = new Set([...base.results.filter((z) => z.fit && z.confirmed).map((z) => z.space.url)]);
    const fitsAfter = [...members, ...pool].map((s) => evaluate(s, c2, mediansFor([...members, ...pool]))).filter((z) => z.fit && z.confirmed);
    const newly = fitsAfter.filter((z) => !before.has(z.space.url) && (z.space.inCollection || !base.marketFits.some((m) => m.space.url === z.space.url)));
    return {
      id, question: q, kind: 'whatif',
      headline: `If ${changes.join(' and ')}: ${statusWord(base.status)} → ${statusWord(after.status)}.`,
      detail: `Confirmed fits in this collection ${base.confirmedFits} → ${after.confirmedFits}. Matching spaces nearby, not in it, ${base.marketMore} → ${after.marketMore}.`,
      applied: 'This is only a what-if. Nothing has changed.',
      evidence: newly.slice(0, 8).map((z) => ({ title: z.space.title, sub: spaceSub(z.space, c), url: z.space.url })),
      proposal: { title: 'Make this change to the requirement', patch, ops: `Updates the requirement: ${changes.join('; ')}`, effect: `${statusWord(base.status)} → ${statusWord(after.status)}.` },
    };
  }

  // Count or find
  const wantsList = /^\s*(show|find|list)\b/.test(t) || /that fit/.test(t);
  if (/that fit|fits? (?:our|the|my) (?:requirement|needs)/.test(t)) {
    return {
      id, question: q, kind: 'find',
      headline: `${base.confirmedFits} confirmed fit${base.confirmedFits === 1 ? '' : 's'} in this collection and ${base.marketMore} more nearby, not in it.`,
      applied: `Fit means the right area, the ${base.bandText ?? 'headcount'}, the budget and the workspace type, with a listing updated in the last 90 days.`,
      evidence: [...base.results.filter((z) => z.fit && z.confirmed), ...base.marketFits].slice(0, 8).map((z) => ({ title: z.space.title, sub: spaceSub(z.space, c), url: z.space.url })),
    };
  }
  const f = parseFilters(t);
  if ((/^\s*how many\b/.test(t) || wantsList) && hasFilter(f)) {
    const matches = all.filter((sp) => {
      const mi = miles(sp, c);
      if (f.type && sp.type !== f.type) return false;
      if (f.maxRate != null && (sp.rate == null || sp.rate > f.maxRate)) return false;
      if (f.miles != null && mi > f.miles) return false;
      if (f.seatsFor != null) { const [lo, hi] = capacityBand(f.seatsFor); if (sp.desks < lo || sp.desks > hi) return false; }
      return true;
    }).sort((p, q2) => miles(p, c) - miles(q2, c));
    const inC = matches.filter((m) => m.inCollection).length;
    const near = matches.length - inC;
    const scoped = f.scope === 'collection' ? `${inC} in this collection.` : f.scope === 'nearby' ? `${near} nearby, not in this collection.` : `${inC} in this collection and ${near} nearby, not in it.`;
    const refine: string[] = [];
    if (f.miles == null) refine.push(`${q.replace(/\?$/, '')} within 3 miles`);
    if (!f.type && c.type) refine.push(`${q.replace(/\?$/, '')}, only ${c.type}s`);
    return {
      id, question: q, kind: wantsList ? 'find' : 'count',
      headline: scoped,
      applied: `Counted: ${filterText(f)}. This covers the ${all.length} listings recorded near ${c.centerLabel}, not the whole market.`,
      evidence: matches.slice(0, 8).map((s) => ({ title: s.title, sub: spaceSub(s, c), url: s.url })),
      refine: refine.slice(0, 2),
    };
  }
  return help();
}
