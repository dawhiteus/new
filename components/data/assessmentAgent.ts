// Scripted Collection Assessment (prototype). Computes from the recorded Pulse facts in assessmentData.ts.
// Rules are written in docs/collection-assessment-spec.md so that one definition of a match exists.
import { criteriaFor } from './collectionAgent';
import { capacityBand } from './collectionAgent';
import { CENTERS, collectionSpaces, marketPool, type AssessSpace } from './assessmentData';
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
}

export interface Widen {
  id: string;
  title: string;
  detail: string;
  patch: { budget?: number; searchArea?: string };
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
export const canAssess = (r: MvpRequirement) => !!r.collection && !!criteriaForAssessment(r) && collectionSpaces(cityKey(criteriaFor(r).location)).length > 0;

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
  return { space: sp, miles: mi, area, capacity, budget, type, tier, fit, confirmed: age <= 90, ageDays: age, perSeat, marketPerSeat: mps, overMarket, reason: (issues.length ? issues.slice(0, 3) : good).join(' · ') };
}

const mediansFor = (all: AssessSpace[]) => {
  const out: Record<string, number> = {};
  for (const t of Array.from(new Set(all.map((s) => s.type)))) {
    const xs = all.filter((s) => s.type === t && s.rate != null && s.desks).map((s) => (s.rate as number) / s.desks);
    if (xs.length >= 4) out[t] = median(xs);
  }
  return out;
};

export function assess(r: MvpRequirement): Assessment | null {
  const c = criteriaForAssessment(r);
  if (!c) return null;
  const members = collectionSpaces(c.city);
  if (!members.length) return null;
  const pool = marketPool(c.city);
  return run(c, members, pool);
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
    : status === 'Few' ? `Only ${confirmedFits} space${confirmedFits === 1 ? '' : 's'} fit your ${list}.${tail}`
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
  return a ? { status: a.status, text: a.status === 'Plenty' ? 'Plenty of matches' : a.status === 'Few' ? 'Few matches' : 'No matches' } : null;
}
