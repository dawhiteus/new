// Scripted Collection Assessment Agent (prototype). Computes from the recorded Pulse facts in assessmentData.ts.
// The rules are written in docs/collection-assessment-spec.md so that one definition of a match exists.
import { criteriaFor, capacityBand } from './collectionAgent';
import { CENTERS, collectionSpaces, collectionCityFor, marketPool, listingByUrl, listingsAtVenue, type AssessSpace } from './assessmentData';
import type { MvpRequirement } from './mvpRequirements';

export type Status = 'Plenty' | 'Few' | 'None';
type Dim = 'pass' | 'near' | 'fail' | 'na';

/** The values a person can adjust. They map one to one onto the Requirement. */
export interface Values {
  location: string;
  type: string;
  capacity: number | null;
  budget: number | null;
  radiusMi: number;
}

export interface AssessCriteria extends Values {
  city: string;
  centerLabel: string;
  lat: number;
  lng: number;
  radiusIsDefault: boolean;
  termMonths: number | null;
}

export interface SpaceResult {
  space: AssessSpace;
  miles: number;
  fit: boolean;
  confirmed: boolean;
  ageDays: number;
  reason: string;
  issues: string[];
  facts: string;
}

export type ReqPatch = { location?: string; type?: string; budget?: number | null; capacity?: number | null; searchArea?: string };

export interface Assessment {
  state: 'ok' | 'unlocated' | 'unrecorded';
  status: Status;
  statusText: string;
  summary: string;
  gapsTitle: string;
  gaps: { label: string; text: string }[];
  next?: string;
  total: number;
  inArea: number;
  withinBudget: number | null;
  forPeople: number | null;
  confirmedFits: number;
  marketMore: number;
  marketFits: SpaceResult[];
  results: SpaceResult[];
  criteria: AssessCriteria;
  bandText: string | null;
  empty: boolean;
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
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

/** The current Requirement values the agent works from. */
export function currentValues(r: MvpRequirement): Values {
  const c = criteriaFor(r);
  const sa = (r.details.otherFunctional || '').match(/within\s+(\d+(?:\.\d+)?)\s*miles?/i);
  return { location: (c.location || r.city || '').trim(), type: c.workspaceType || '', capacity: c.capacity, budget: c.budget, radiusMi: sa ? parseFloat(sa[1]) : 5 };
}

/** Every requirement with a collection can be assessed. */
export const canAssess = (r: MvpRequirement) => !!r.collection;

/** Spaces added to a collection during this demo session (the browser cannot write to LiquidSpace). */
export const addedSpaces = new Map<string, string[]>();

function membersFor(r: MvpRequirement): { members: AssessSpace[]; recorded: boolean } {
  const key = collectionCityFor(r.collection?.url);
  const base = key ? collectionSpaces(key) : [];
  const extras = (addedSpaces.get(r.id) ?? []).map((u) => listingByUrl(u)?.space).filter((x): x is AssessSpace => !!x).map((x) => ({ ...x, inCollection: true }));
  const members = [...base, ...extras];
  const total = r.collection?.totalSpaces ?? 0;
  return { members, recorded: members.length > 0 || total === 0 };
}

function evaluate(sp: AssessSpace, c: AssessCriteria, medians: Record<string, number>): SpaceResult {
  const mi = miles(sp, c);
  const area: Dim = mi <= c.radiusMi ? 'pass' : 'fail';
  let capacity: Dim = 'na';
  if (c.capacity) { const [lo, hi] = capacityBand(c.capacity); capacity = sp.desks >= lo && sp.desks <= hi ? 'pass' : sp.desks > hi ? 'near' : 'fail'; }
  let budget: Dim | 'unknown' = 'na';
  if (c.budget) budget = sp.rate == null ? 'unknown' : sp.rate <= c.budget ? 'pass' : 'fail';
  const type: Dim = c.type ? (sp.type === c.type ? 'pass' : 'fail') : 'na';
  const fit = area === 'pass' && (capacity === 'pass' || capacity === 'na') && (budget === 'pass' || budget === 'unknown' || budget === 'na') && (type === 'pass' || type === 'na');
  const age = daysAgo(sp.modified);
  const perSeat = sp.rate != null && sp.desks ? sp.rate / sp.desks : null;
  const mps = medians[sp.type];

  const issues: string[] = [];
  if (area !== 'pass') issues.push(`${mi.toFixed(1)} mi from ${c.centerLabel}`);
  if (budget === 'fail') issues.push(`${money((sp.rate as number) - (c.budget as number))}/mo over budget`);
  if (capacity === 'near') issues.push(`larger than needed (${sp.desks} seats)`);
  if (capacity === 'fail') issues.push(`holds ${sp.desks}, needs ${c.capacity}`);
  if (type === 'fail') issues.push(`not ${c.type}`);
  if (perSeat != null && mps && perSeat > mps * 1.15) issues.push('over the local market rate');
  if (age > 90) issues.push(`listing not updated in ${age} days`);
  const facts = [`${mi.toFixed(1)} mi`, `${sp.desks} seats`, sp.rate != null ? `${money(sp.rate)}/mo` : 'not priced monthly', `updated ${age} day${age === 1 ? '' : 's'} ago`].join(' · ');
  return { space: sp, miles: mi, fit, confirmed: age <= 90, ageDays: age, issues, facts, reason: issues.length ? issues[0].charAt(0).toUpperCase() + issues.join(', ').slice(1) : 'Meets every criterion' };
}

const mediansFor = (all: AssessSpace[]) => {
  const out: Record<string, number> = {};
  for (const t of Array.from(new Set(all.map((s) => s.type)))) {
    const xs = all.filter((s) => s.type === t && s.rate != null && s.desks).map((s) => (s.rate as number) / s.desks);
    if (xs.length >= 4) out[t] = median(xs);
  }
  return out;
};

const phrase = (c: AssessCriteria, band: string | null) =>
  [c.capacity ? band : '', c.type, c.budget ? `under ${money(c.budget)}/mo` : '', `within ${c.radiusMi} miles of ${c.centerLabel}`].filter(Boolean).join(', ');

/** Assess a requirement's collection. `ov` tries different values without changing anything. */
export function assess(r: MvpRequirement, ov: Partial<Values> = {}): Assessment | null {
  const col = r.collection;
  if (!col) return null;
  const v = { ...currentValues(r), ...ov };
  const key = cityKey(v.location);
  const center = CENTERS[key];
  const { members, recorded } = membersFor(r);
  const termN = parseInt(criteriaFor(r).termLength, 10);
  const c: AssessCriteria = {
    ...v, city: key, centerLabel: center?.label ?? (v.location.split(',')[0] || 'the requirement location'),
    lat: center?.lat ?? 0, lng: center?.lng ?? 0, radiusIsDefault: !(r.details.otherFunctional || '').match(/within\s+\d/i),
    termMonths: Number.isFinite(termN) && termN > 0 ? termN : null,
  };
  const budgetSet = (r.budget ?? 0) > 0;
  const populateNote = 'A budget is set, and populate currently returns nothing when a requirement has one (a known issue, logged Oct 28). It can leave a collection empty even when spaces exist.';
  const blank = { total: members.length || col.totalSpaces, inArea: 0, withinBudget: null, forPeople: null, confirmedFits: 0, marketMore: 0, marketFits: [] as SpaceResult[], results: [] as SpaceResult[], criteria: c, bandText: c.capacity ? capacityBand(c.capacity).join('-') + ' people' : null };

  if (!recorded) {
    return { ...blank, state: 'unrecorded', status: 'None', statusText: 'Not assessed', empty: false, gapsTitle: 'Gaps and trade-offs', gaps: [{ label: 'Not assessed', text: "This collection's spaces aren't available to the demo, so I can't compare them to the requirement here." }], summary: `${col.name} has ${plural(col.totalSpaces, 'space')}, but I can't see them in the demo, so I can't assess it.` };
  }
  if (!center) {
    const loc = v.location.trim();
    return {
      ...blank, state: 'unlocated', status: 'None', statusText: members.length ? 'Not assessed' : 'Empty collection', empty: members.length === 0,
      summary: `${members.length ? `${col.name} can't be assessed yet` : `${col.name} is empty`}${loc ? `, and I can't search for spaces: I couldn't find “${loc}” as a location.` : ', and I can’t search for spaces: the requirement has no location.'}${budgetSet ? ' ' + populateNote : ''}`,
      gapsTitle: members.length ? 'Gaps and trade-offs' : "Why it's empty",
      gaps: [
        { label: 'Location', text: loc ? `“${loc}” isn't a place I can search near. Ask me about a city, for example “What if we look in Austin?”, or use Edit requirement.` : 'No location is set. Ask me about a city, for example “What if we look in Austin?”, or use Edit requirement.' },
        ...(budgetSet ? [{ label: 'Platform', text: populateNote }] : []),
      ],
    };
  }

  const pool = marketPool(key).filter((p) => !members.some((m) => m.url === p.url));
  const meds = mediansFor([...members, ...pool]);
  const results = members.map((m) => evaluate(m, c, meds)).sort((a, b) => Number(b.fit) - Number(a.fit) || a.miles - b.miles);
  const total = results.length;
  const confirmedFits = results.filter((x) => x.fit && x.confirmed).length;
  const unconfirmed = results.filter((x) => x.fit && !x.confirmed).length;
  const poolResults = pool.map((p) => evaluate(p, c, meds));
  const marketFits = poolResults.filter((x) => x.fit && x.confirmed).sort((a, b) => a.miles - b.miles);
  const status: Status = confirmedFits >= 5 ? 'Plenty' : confirmedFits >= 1 ? 'Few' : 'None';
  const band = c.capacity ? `${capacityBand(c.capacity).join('-')} people` : null;
  const statusText = total === 0 ? 'Empty collection' : status === 'Plenty' ? 'Plenty of matches' : status === 'Few' ? 'Few matches' : 'No matches';

  // What would help: one plain sentence, from the same rules with a single change.
  const gainOf = (cc: AssessCriteria) => {
    const m2 = mediansFor([...members, ...pool]);
    return members.concat(pool).map((s) => evaluate(s, cc, m2)).filter((x) => x.fit && x.confirmed).length - (confirmedFits + marketFits.length);
  };
  const tries: { gain: number; text: string }[] = [];
  if (c.budget) for (const pct of [15, 30]) { const nb = Math.round((c.budget * (1 + pct / 100)) / 100) * 100; tries.push({ gain: gainOf({ ...c, budget: nb }), text: `Raising the budget to ${money(nb)}/mo` }); }
  for (const nr of [Math.round(c.radiusMi * 2), Math.round(c.radiusMi * 3)]) tries.push({ gain: gainOf({ ...c, radiusMi: nr }), text: `Searching within ${nr} miles` });
  const best = tries.filter((t) => t.gain > 0).sort((a, b) => b.gain - a.gain)[0];
  const next = best ? `${best.text} would add ${plural(best.gain, 'matching space')}.` : undefined;

  const inArea = results.filter((x) => x.miles <= c.radiusMi).length;
  const withinBudget = c.budget ? results.filter((x) => x.space.rate != null && x.space.rate <= (c.budget as number)).length : null;
  const forPeople = c.capacity ? results.filter((x) => { const [lo, hi] = capacityBand(c.capacity as number); return x.space.desks >= lo && x.space.desks <= hi; }).length : null;

  const base = { state: 'ok' as const, status, statusText, total, inArea, withinBudget, forPeople, confirmedFits, marketMore: marketFits.length, marketFits, results, criteria: c, bandText: band, next, empty: total === 0 };

  // Empty collection: say why, using the market around the requirement.
  if (total === 0) {
    const M = poolResults.length;
    const pass = (f: (x: SpaceResult) => boolean) => poolResults.filter(f).length;
    const area = pass((x) => x.miles <= c.radiusMi);
    const typeOk = c.type ? pass((x) => x.space.type === c.type) : M;
    const capOk = c.capacity ? pass((x) => { const [lo, hi] = capacityBand(c.capacity as number); return x.space.desks >= lo && x.space.desks <= hi; }) : M;
    const budOk = c.budget ? pass((x) => x.space.rate != null && x.space.rate <= (c.budget as number)) : M;
    const rows: { label: string; text: string; n: number }[] = [
      { label: 'Area', n: area, text: `${area} of ${M} listings near ${c.centerLabel} are within ${c.radiusMi} miles.` },
      ...(c.type ? [{ label: 'Workspace type', n: typeOk, text: `${typeOk} of ${M} are ${c.type}.` }] : []),
      ...(c.capacity ? [{ label: 'Capacity', n: capOk, text: `${capOk} of ${M} hold ${band}.` }] : []),
      ...(c.budget ? [{ label: 'Budget', n: budOk, text: `${budOk} of ${M} are within ${money(c.budget)}/mo${budOk === 0 && poolResults.some((x) => x.space.rate != null) ? `. The lowest is ${money(Math.min(...poolResults.filter((x) => x.space.rate != null).map((x) => x.space.rate as number)))}/mo` : ''}.` }] : []),
    ];
    const worst = [...rows].sort((a, b) => a.n - b.n)[0];
    const F = marketFits.length;
    const summary = F > 0
      ? `${col.name} is empty, but it doesn't need to be. I looked at the ${M} listings recorded near ${c.centerLabel} and ${plural(F, 'space')} meet every criterion (${phrase(c, band)}).${budgetSet ? ' ' + populateNote : ''}`
      : `${col.name} is empty, and I can see why. I looked at the ${M} listings recorded near ${c.centerLabel} and none meet every criterion (${phrase(c, band)}). The biggest blocker is ${worst ? worst.label.toLowerCase() : 'the combination of criteria'}.${budgetSet ? ' ' + populateNote : ''}`;
    return { ...base, summary, gapsTitle: "Why it's empty", gaps: [...rows.map(({ label, text }) => ({ label, text })), { label: 'Together', text: `${F} of ${M} meet all of them.` }, ...(budgetSet ? [{ label: 'Platform', text: populateNote }] : [])] };
  }

  // Non-empty: gaps and trade-offs, in the original structure.
  const gaps: { label: string; text: string }[] = [];
  const off = (f: (x: SpaceResult) => boolean) => results.filter(f).length;
  const tooFar = off((x) => x.miles > c.radiusMi);
  if (!results.some((x) => x.fit)) gaps.push({ label: 'Overall', text: 'No space meets every criterion.' });
  if (tooFar) gaps.push({ label: 'Area', text: `${tooFar} of ${total} are more than ${c.radiusMi} miles from ${c.centerLabel}. The nearest is ${Math.min(...results.map((x) => x.miles)).toFixed(1)} mi.${c.radiusIsDefault ? ' No search area was given, so the city center and 5 miles are used.' : ''}` });
  if (c.budget) {
    const priced = results.filter((x) => x.space.rate != null);
    const over = priced.filter((x) => (x.space.rate as number) > (c.budget as number));
    if (over.length) gaps.push({ label: 'Budget', text: over.length === priced.length ? `None are within ${money(c.budget)}/mo. The lowest is ${money(Math.min(...priced.map((x) => x.space.rate as number)))}/mo.` : `${priced.length - over.length} of ${priced.length} are within ${money(c.budget)}/mo. The lowest-priced over budget is ${money(Math.min(...over.map((x) => x.space.rate as number)))}/mo.` });
  }
  if (c.capacity) {
    const bad = off((x) => { const [lo, hi] = capacityBand(c.capacity as number); return x.space.desks < lo || x.space.desks > hi; });
    if (bad) gaps.push({ label: 'Capacity', text: `${bad} of ${total} are outside ${band}. Sizes here range from ${Math.min(...results.map((x) => x.space.desks))} to ${Math.max(...results.map((x) => x.space.desks))}.` });
  }
  if (c.type) { const bad = off((x) => x.space.type !== c.type); if (bad) gaps.push({ label: 'Workspace type', text: `${bad} of ${total} are not ${c.type}.` }); }
  const overMarket = off((x) => x.issues.includes('over the local market rate'));
  if (overMarket) gaps.push({ label: 'Rate', text: `${overMarket} of ${total} ${overMarket === 1 ? 'is' : 'are'} more than 15% above the local market rate per seat.` });
  const stale = off((x) => !x.confirmed);
  if (stale) gaps.push({ label: 'Listings', text: `${stale} of ${total} have listings not updated in the last 90 days, so their price and details are unconfirmed.` });
  if (c.termMonths) { const long = off((x) => { const m = x.space.minTerm?.match(/(\d+)\s*month/); return !!m && +m[1] > (c.termMonths as number); }); if (long) gaps.push({ label: 'Term', text: `${long} of ${total} require a longer minimum term than ${c.termMonths} months.` }); }
  const missing = [!c.capacity ? 'headcount' : '', !c.budget ? 'budget' : '', !c.type ? 'workspace type' : ''].filter(Boolean);
  gaps.push({ label: 'Not assessed', text: `${missing.length ? `${missing.join(', ').replace(/^./, (m) => m.toUpperCase())} ${missing.length === 1 ? 'was' : 'were'} not provided. ` : ''}Availability, amenity needs and program needs aren't in the available data.` });

  const reasons: { n: number; text: string }[] = [
    { n: tooFar, text: `area (${tooFar === total ? 'all' : tooFar} too far)` },
    ...(c.capacity ? [{ n: off((x) => { const [lo, hi] = capacityBand(c.capacity as number); return x.space.desks < lo || x.space.desks > hi; }), text: `capacity (outside ${band})` }] : []),
    ...(c.budget ? [{ n: off((x) => x.space.rate != null && x.space.rate > (c.budget as number)), text: 'budget' }] : []),
    ...(c.type ? [{ n: off((x) => x.space.type !== c.type), text: `workspace type (not ${c.type})` }] : []),
  ].filter((x) => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 2);
  const fitSentence = confirmedFits === 0 ? 'None of them fit.' : `${confirmedFits} ${confirmedFits === 1 ? 'fits' : 'fit'}.${unconfirmed ? ` ${plural(unconfirmed, 'more')} would, but ${unconfirmed === 1 ? 'its listing is' : 'their listings are'} over 90 days old.` : ''}`;
  const why = reasons.length ? ` ${confirmedFits === 0 ? 'They miss' : 'The rest miss'} on ${reasons.map((x) => x.text).join(' and ')}.` : '';
  const more = marketFits.length ? ` ${plural(marketFits.length, 'more matching space')} nearby ${marketFits.length === 1 ? "isn't" : "aren't"} in the collection.` : '';
  return { ...base, gapsTitle: 'Gaps and trade-offs', gaps, summary: `I checked the ${plural(total, 'space')} in ${col.name} against your requirement (${phrase(c, band)}). ${fitSentence}${why}${more}` };
}

/** One short line for the hover card. */
export const quickStatus = (r: MvpRequirement) => { const a = assess(r); return a ? { status: a.status, text: a.statusText } : null; };

/** Fits under the adjusted values that were not fits before, so a change can be shown. */
export function newlyFit(before: Assessment, after: Assessment): SpaceResult[] {
  const had = new Set([...before.results, ...before.marketFits].filter((x) => x.fit && x.confirmed).map((x) => x.space.url));
  return [...after.results.filter((x) => x.fit && x.confirmed), ...after.marketFits].filter((x) => !had.has(x.space.url));
}

// ── Ask ─────────────────────────────────────────────────────────────────────
// Free text is matched to a few question types, each answered by a deterministic query over the recorded data.
// (The product would use a language model for the matching step only.)
// A what-if is only ever an answer. Changing the requirement or the collection is a separate action offered with the answer.

export interface AnswerAction {
  label: string;
  patch?: ReqPatch;
  add?: string[];
}

export interface Answer {
  id: string;
  question: string;
  text: string;
  spaces?: { title: string; sub: string; url: string }[];
  actions?: AnswerAction[];
  /** Spaces added right away (a pasted link). */
  added?: string[];
  /** A venue link: pick one of its spaces. */
  choices?: AssessSpace[];
}

interface Filters { type?: string; maxRate?: number; miles?: number; seatsFor?: number; scope: 'collection' | 'nearby' | 'both' }
const TYPES: [RegExp, string][] = [[/private offices?/, 'Private Office'], [/team offices?/, 'Team Office'], [/office suites?/, 'Office Suite']];
const cap = (s: string) => s.replace(/\b\w/g, (m) => m.toUpperCase());

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
const filterText = (f: Filters) => [f.type, f.maxRate != null ? `under ${money(f.maxRate)}/mo` : '', f.miles != null ? `within ${f.miles} mi` : '', f.seatsFor != null ? `for ${capacityBand(f.seatsFor).join('-')} people` : ''].filter(Boolean).join(', ');

const HELP = "I can explain what I see, count or list spaces (“How many Private Offices under $5,000 within 3 miles?”), try a change (“What if the budget goes up 15%?” or “What if we look in Austin?”), explain a space (“Why isn't Regus Westlake a fit?”), or add a space if you paste a LiquidSpace link.";

/** A few example questions that fit what the agent sees. Shown as plain text, never as buttons. */
export function suggestions(r: MvpRequirement): string[] {
  const a = assess(r);
  if (!a) return [];
  if (a.state === 'unrecorded') return [];
  if (a.state === 'unlocated') { const other = Object.keys(CENTERS)[0]; return [`What if we look in ${cap(other)}?`, 'Why is it empty?']; }
  const out: string[] = [];
  if (a.empty) out.push('Why is it empty?');
  const c = a.criteria;
  if (c.budget && a.confirmedFits < 5) out.push('What if the budget goes up 15%?');
  else if (a.confirmedFits < 5) out.push(`What if we search within ${Math.round(c.radiusMi * 2)} miles?`);
  if (a.marketMore > 0) out.push('Show nearby spaces that fit');
  const worst = a.results.find((q) => !(q.fit && q.confirmed));
  if (worst) out.push(`Why isn't ${worst.space.venue} a fit?`);
  return out.slice(0, 3);
}

export function ask(text: string, r: MvpRequirement): Answer {
  const id = `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const q = text.trim();
  const t = q.toLowerCase();
  const reply = (body: Partial<Answer> & { text: string }): Answer => ({ id, question: q, ...body });
  const a = assess(r);
  if (!a || !q) return reply({ text: HELP });
  const colName = r.collection?.name ?? 'the collection';
  const base = currentValues(r);

  // Explain what I see.
  if (/\b(why is it empty|why is (?:this|the collection) empty|what(?:'s| is) (?:wrong|going on)|summari[sz]e|what do you see|overview|how does it look)\b/.test(t)) {
    return reply({ text: `${a.summary}${a.next ? ' ' + a.next : ''}` });
  }

  // A what-if: a location, a budget, a distance, or a headcount. Answered, never applied.
  const cityHit = Object.keys(CENTERS).find((k) => new RegExp(`\\b${k}\\b`).test(t));
  const whatIf = /\b(what if|what about|what happens|suppose|widen|expand|raise|increase|lower|reduce|cut|drop)\b|^\s*if\b/.test(t);
  if (whatIf || (cityHit && a.state !== 'ok')) {
    const ov: Partial<Values> = {};
    const patch: ReqPatch = {};
    const said: string[] = [];
    const labels: string[] = [];
    if (cityHit && cityKey(base.location) !== cityHit) { ov.location = cap(cityHit); patch.location = cap(cityHit); said.push(`we look in ${cap(cityHit)}`); labels.push(`location ${base.location || 'not set'} → ${cap(cityHit)}`); }
    const down = /\b(lower|reduce|cut|decrease|drop|down)\b/.test(t);
    const abs = t.match(/\$\s*([\d,]+(?:\.\d+)?)\s*(k)?/);
    const pct = t.match(/(\d+(?:\.\d+)?)\s*%/);
    if (base.budget && (abs || pct)) {
      const nb = Math.round((abs ? parseFloat(abs[1].replace(/,/g, '')) * (abs[2] ? 1000 : 1) : base.budget * (1 + (down ? -1 : 1) * parseFloat((pct as RegExpMatchArray)[1]) / 100)) / 100) * 100;
      ov.budget = nb; patch.budget = nb; said.push(`the budget goes to ${money(nb)}/mo`); labels.push(`budget ${money(base.budget)} → ${money(nb)}/mo`);
    }
    const mi = t.match(/(\d+(?:\.\d+)?)\s*(?:miles?|mi)\b/);
    if (mi && /(search|area|within|widen|radius|distance|miles)/.test(t)) {
      const n = parseFloat(mi[1]); ov.radiusMi = n; patch.searchArea = `within ${n} miles of ${CENTERS[cityKey(ov.location ?? base.location)]?.label ?? 'the center'}`; said.push(`we search within ${n} miles`); labels.push(`search distance → ${n} miles`);
    }
    const hc = t.match(/(\d+)\s*(?:people|seats|persons?|staff|headcount)/);
    if (hc && /(need|headcount|people|seats|team|grow|hire)/.test(t)) {
      const n = parseInt(hc[1], 10); ov.capacity = n; patch.capacity = n; said.push(`we need ${n} people`); labels.push(`people ${base.capacity ?? 'not set'} → ${n}`);
    }
    if (!said.length) return reply({ text: "I can try a change to the location, budget, search distance or headcount, for example “What if the budget goes up 15%?”" });
    const after = assess(r, ov);
    if (!after) return reply({ text: HELP });
    if (after.state === 'unlocated') return reply({ text: `If ${said.join(' and ')}: ${after.summary}` });
    const fresh = a.state === 'ok' ? newlyFit(a, after) : [...after.results, ...after.marketFits].filter((x) => x.fit && x.confirmed);
    const inColl = fresh.filter((x) => x.space.inCollection).length;
    const near = fresh.filter((x) => !x.space.inCollection);
    const effect = fresh.length === 0 ? 'No additional spaces would fit.' : `${plural(fresh.length, 'space')} would ${a.state === 'ok' ? 'newly ' : ''}fit${inColl && near.length ? ` (${inColl} in ${colName}, ${near.length} nearby)` : near.length ? ', all nearby and not yet in the collection' : ` in ${colName}`}.`;
    const actions: AnswerAction[] = [{ label: `Update the requirement: ${labels.join(', ')}`, patch }];
    if (near.length) actions.push({ label: `Add the ${plural(near.length, 'nearby space')} to ${colName}`, add: near.map((x) => x.space.url) });
    return reply({
      text: `If ${said.join(' and ')}: ${a.statusText} → ${after.statusText}. ${effect}`,
      spaces: fresh.slice(0, 4).map((x) => ({ title: `${x.space.title} · ${x.space.venue}`, sub: `${x.miles.toFixed(1)} mi · ${x.space.desks} seats · ${x.space.rate != null ? `${money(x.space.rate)}/mo` : 'not priced monthly'}${x.space.inCollection ? ' · in this collection' : ''}`, url: x.space.url })),
      actions: fresh.length ? actions : undefined,
    });
  }

  if (a.state !== 'ok') return reply({ text: a.state === 'unlocated' ? 'I can only look at spaces once the requirement has a location I can find. Ask me, for example, “What if we look in Austin?”' : HELP });
  const c = a.criteria;
  const { members } = membersFor(r);
  const pool = marketPool(c.city).filter((p) => !members.some((m) => m.url === p.url));
  const all = [...members, ...pool];
  const meds = mediansFor(all);
  const sub = (s: AssessSpace) => `${s.venue} · ${miles(s, c).toFixed(1)} mi · ${s.desks} seats · ${s.rate != null ? `${money(s.rate)}/mo` : 'not priced monthly'}${s.inCollection ? ' · in this collection' : ''}`;

  // A link: add the space.
  const url = q.match(/https?:\/\/\S+/)?.[0];
  if (url) {
    let host = '';
    try { host = new URL(url).hostname.replace(/^www\./, ''); } catch { /* not a link */ }
    if (host !== 'liquidspace.com') return reply({ text: "That isn't a LiquidSpace link, so I can't add it. A space outside LiquidSpace needs a private listing, which the supply team creates." });
    const hit = listingByUrl(url);
    if (!hit) {
      const at = listingsAtVenue(url);
      if (at.length) return reply({ text: `That's a venue link. Which of its ${plural(at.length, 'space')} should I add?`, choices: at.slice(0, 8) });
      return reply({ text: "I couldn't find that listing. The demo can only look up listings it has recorded; the product looks the link up in Pulse." });
    }
    const sp = hit.space;
    if (members.some((m) => m.url === sp.url)) return reply({ text: `${sp.title} (${sp.venue}) is already in ${colName}.` });
    const res = evaluate(sp, c, meds);
    const fits = res.fit && res.confirmed;
    return reply({ text: `Added ${sp.title} (${sp.venue}) to ${colName}. ${fits ? 'It fits the requirement.' : `It doesn't fit every criterion: ${res.issues.join(', ')}.`}`, added: [sp.url] });
  }

  // Explain a space.
  if (/^\s*(why|explain)\b|\bwhy (?:is|isn'?t|are|aren'?t)\b/.test(t)) {
    const stop = new Set(['team', 'office', 'suite', 'private', 'person', 'with', 'from', 'that', 'this', 'what', 'does', 'isnt', 'fit', 'explain', 'collection']);
    const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3 && !stop.has(w));
    const qw = new Set(words(q));
    let best: AssessSpace | null = null, score = 0;
    for (const sp of all) { const sc = words(`${sp.venue} ${sp.title}`).filter((w) => qw.has(w)).length; if (sc > score) { best = sp; score = sc; } }
    if (!best) return reply({ text: "I couldn't tell which space you mean. Name the venue or the space, for example “Why isn't Regus Westlake a fit?”" });
    const res = evaluate(best, c, meds);
    const fits = res.fit && res.confirmed;
    return reply({ text: `${best.title} (${best.venue}) ${fits ? 'fits. It meets the area, capacity, budget and workspace type, and its listing is current.' : `is not a fit: ${res.issues.length ? res.issues.join(', ') : 'its listing could not be confirmed'}.`}`, spaces: [{ title: `${best.title} · ${best.venue}`, sub: sub(best), url: best.url }] });
  }

  // Count or list.
  const wantsList = /^\s*(show|find|list)\b/.test(t) || /that fit/.test(t);
  if (/that fit|fits? (?:our|the|my) (?:requirement|needs)/.test(t)) {
    const fits = [...a.results.filter((z) => z.fit && z.confirmed), ...a.marketFits];
    return reply({
      text: `${plural(a.confirmedFits, 'confirmed fit')} in ${colName} and ${a.marketMore} more nearby that aren't in it.`,
      spaces: fits.slice(0, 5).map((z) => ({ title: `${z.space.title} · ${z.space.venue}`, sub: sub(z.space), url: z.space.url })),
      actions: a.marketMore ? [{ label: `Add the ${plural(a.marketMore, 'nearby space')} to ${colName}`, add: a.marketFits.map((x) => x.space.url) }] : undefined,
    });
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
    const scoped = f.scope === 'collection' ? `${inC} in ${colName}` : f.scope === 'nearby' ? `${near} nearby, not in ${colName}` : `${inC} in ${colName} and ${near} nearby, not in it`;
    return reply({ text: `${scoped} (${filterText(f)}). That covers the ${all.length} listings recorded near ${c.centerLabel}, not the whole market.`, spaces: matches.slice(0, 5).map((s) => ({ title: `${s.title} · ${s.venue}`, sub: sub(s), url: s.url })) });
  }
  return reply({ text: HELP });
}
