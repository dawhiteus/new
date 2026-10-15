// PROTOTYPE ONLY. Simulated Collection Agent sourcing and assessment.
// The inventory below is FICTITIOUS sample data used to demonstrate the interaction.
// A real agent must source only from actual LiquidSpace marketplace inventory and
// must never invent inventory, pricing, or availability.

import type { MvpRequirement } from './mvpRequirements';

export const COLLECTION_AGENT = 'Collection Agent';
export const LIQUIDSPACE_COLLECTIONS_URL = 'https://liquidspace.com/collections';

export interface Venue {
  id: string;
  name: string;
  operator: string;
  area: string;
  type: string;
  desks: number; // maximum capacity of the offering
  monthlyPrice: number; // USD, total per month for the offering
  availableFrom: string; // ISO
}

const V = (id: string, name: string, operator: string, area: string, type: string, desks: number, monthlyPrice: number, availableFrom: string): Venue =>
  ({ id, name, operator, area, type, desks, monthlyPrice, availableFrom });

export const SAMPLE_INVENTORY: Record<string, Venue[]> = {
  lisbon: [
    V('lis1', 'Cais Workspace', 'Cais Offices', 'Cais do Sodré', 'Private Office', 40, 26000, '2026-09-01'),
    V('lis2', 'Saldanha Hub', 'Hub Collective', 'Saldanha', 'Private Office', 30, 21000, '2026-10-01'),
    V('lis3', 'Liberdade Suites', 'Avenida Offices', 'Avenida da Liberdade', 'Office Suite', 20, 14500, '2026-09-15'),
    V('lis4', 'Entrecampos Team Floor', 'Campo Spaces', 'Entrecampos', 'Team Office', 35, 23500, '2026-12-01'),
    V('lis5', 'Alvalade Cowork', 'Alvalade Works', 'Alvalade', 'Coworking', 15, 6800, '2026-09-01'),
    V('lis6', 'Pombal Tower Floor', 'Tower Offices', 'Marquês de Pombal', 'Office Suite', 60, 45000, '2027-01-15'),
  ],
  porto: [
    V('opo1', 'Ribeira Offices', 'Douro Workspaces', 'Ribeira', 'Private Office', 14, 7800, '2026-11-01'),
    V('opo2', 'Boavista Cowork', 'Boavista Works', 'Boavista', 'Coworking', 20, 6200, '2026-09-01'),
    V('opo3', 'Casa da Música Suites', 'Porto Suites', 'Casa da Música', 'Office Suite', 12, 8400, '2027-02-01'),
    V('opo4', 'Foz Team Office', 'Foz Spaces', 'Foz', 'Team Office', 25, 12500, '2026-10-15'),
  ],
  austin: [
    V('aus1', 'Congress Ave Offices', 'Capital Workspaces', 'Downtown', 'Private Office', 12, 9800, '2026-11-01'),
    V('aus2', 'South Lamar Cowork', 'Lamar Works', 'South Lamar', 'Coworking', 25, 8200, '2026-09-01'),
    V('aus3', 'Domain Suites', 'North Austin Offices', 'The Domain', 'Office Suite', 15, 11800, '2027-01-01'),
    V('aus4', 'East Sixth Team Office', 'Eastside Spaces', 'East Austin', 'Team Office', 30, 15600, '2027-03-01'),
    V('aus5', 'Rainey Street Floor', 'Rainey Offices', 'Rainey Street', 'Office Suite', 10, 8900, '2026-12-01'),
  ],
  denver: [
    V('den1', 'LoDo Workspace', 'Platte Offices', 'LoDo', 'Private Office', 6, 4300, '2026-10-01'),
    V('den2', 'Uptown Suites', 'Uptown Works', 'Uptown', 'Office Suite', 8, 5600, '2026-11-15'),
    V('den3', 'Cherry Creek Cowork', 'Creek Collective', 'Cherry Creek', 'Coworking', 20, 5400, '2026-09-01'),
    V('den4', 'RiNo Team Office', 'RiNo Spaces', 'RiNo', 'Team Office', 12, 7800, '2027-01-01'),
    V('den5', 'Union Station Floor', 'Rail Offices', 'Union Station', 'Office Suite', 5, 4900, '2026-10-15'),
  ],
  minneapolis: [
    V('msp1', 'North Loop Offices', 'Mill City Works', 'North Loop', 'Private Office', 20, 6900, '2027-01-01'),
    V('msp2', 'Downtown Suites', 'Nicollet Offices', 'Downtown', 'Office Suite', 22, 7400, '2027-03-15'),
    V('msp3', 'Uptown Cowork', 'Lake Street Works', 'Uptown', 'Coworking', 30, 5800, '2026-09-01'),
    V('msp4', 'Warehouse District Floor', 'Warehouse Spaces', 'Warehouse District', 'Team Office', 28, 9800, '2027-02-01'),
  ],
  'new york': [
    V('nyc1', 'Midtown Executive Suites', 'Fifth Ave Offices', 'Midtown', 'Office Suite', 42, 85000, '2026-10-01'),
    V('nyc2', 'Financial District Floor', 'Downtown Works', 'Financial District', 'Team Office', 87, 145000, '2026-11-01'),
    V('nyc3', 'Park Avenue Private Offices', 'Park Offices', 'Midtown East', 'Private Office', 18, 38000, '2026-09-15'),
    V('nyc4', 'Times Square Cowork', 'Broadway Works', 'Times Square', 'Coworking', 55, 72000, '2026-09-01'),
    V('nyc5', 'Flatiron Team Office', 'Flatiron Spaces', 'Flatiron', 'Team Office', 65, 98000, '2027-02-01'),
  ],
  dallas: [
    V('dal1', 'Uptown Dallas Floor', 'Uptown Spaces', 'Uptown', 'Team Office', 58, 48000, '2026-10-01'),
    V('dal2', 'Deep Ellum Suites', 'Ellum Offices', 'Deep Ellum', 'Office Suite', 24, 32000, '2026-11-01'),
    V('dal3', 'Legacy West Cowork', 'Legacy Works', 'Plano', 'Coworking', 40, 28000, '2026-09-01'),
    V('dal4', 'Preston Center Offices', 'Preston Offices', 'Preston Center', 'Private Office', 20, 22000, '2027-01-15'),
  ],
};

export type Tier = 'Strong' | 'Partial' | 'Weak';

export type Severity = 'high' | 'medium' | 'info';

export interface Flag { text: string; severity: Severity }
export interface Gap { label: string; text: string; severity: Severity }

export interface ScoredVenue extends Venue {
  tier: Tier;
  notes: Flag[]; // short, honest reasons for any gap
  withinBudget: boolean | null;
  fitsPeople: boolean | null;
}

export interface SourcingCriteria {
  location: string;
  capacity: number | null;
  budget: number | null;
  workspaceType: string;
  startDate: string;
  termLength: string;
}

export function criteriaFor(r: MvpRequirement): SourcingCriteria {
  const cap = parseInt(r.details.capacity, 10);
  return {
    location: (r.details.location || r.city || '').trim(),
    capacity: Number.isFinite(cap) && cap > 0 ? cap : null,
    budget: r.budget != null && r.budget > 0 ? r.budget : null,
    workspaceType: r.details.workspaceType || '',
    startDate: r.details.startDate || '',
    termLength: r.details.termLength && r.details.termLength !== '0' ? r.details.termLength : '',
  };
}

const money = (n: number) => `$${n.toLocaleString('en-US')}`;
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const fmtLong = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export interface SourcingResult {
  found: number;
  spaces: ScoredVenue[];
  counts: { strong: number; partial: number; weak: number };
  inMarket: number;
  withinBudget: number;
  fitsPeople: number;
  summary: string;
  /** Short line for the UI; counts are shown separately. */
  headline: string;
  gaps: Gap[];
  missingInputs: string[];
}

/** Returns null when sample inventory has nothing for this location (the agent then says so and creates nothing). */
export function sourceCollection(c: SourcingCriteria, collectionName: string): SourcingResult | null {
  const key = c.location.toLowerCase().split(',')[0].trim();
  const venues = SAMPLE_INVENTORY[key];
  if (!venues || !venues.length) return null;

  const scored: ScoredVenue[] = venues.map((v) => {
    let pts = 0;
    let known = 0;
    let fails = 0;
    const notes: Flag[] = [];
    let fits: boolean | null = null;
    let within: boolean | null = null;

    if (c.capacity != null) {
      known++;
      if (v.desks >= c.capacity && v.desks <= c.capacity * 2.5) { pts += 1; fits = true; }
      else if (v.desks >= c.capacity) { pts += 0.5; fits = true; notes.push({ text: `Larger than needed (${v.desks} desks)`, severity: 'medium' }); }
      else { fails++; fits = false; notes.push({ text: `Holds ${v.desks} of ${c.capacity}`, severity: 'high' }); }
    }
    if (c.budget != null) {
      known++;
      if (v.monthlyPrice <= c.budget) { pts += 1; within = true; }
      else if (v.monthlyPrice <= c.budget * 1.15) { pts += 0.5; within = false; notes.push({ text: `${money(v.monthlyPrice - c.budget)}/mo over budget`, severity: 'medium' }); }
      else { fails++; within = false; notes.push({ text: `${money(v.monthlyPrice - c.budget)}/mo over budget`, severity: 'high' }); }
    }
    if (c.workspaceType) {
      known++;
      if (v.type === c.workspaceType) pts += 1;
      else { pts += 0.5; notes.push({ text: `Not ${c.workspaceType}`, severity: 'medium' }); }
    }
    if (c.startDate) {
      known++;
      if (v.availableFrom <= c.startDate) pts += 1;
      else { fails++; notes.push({ text: `Available ${fmtLong(v.availableFrom)}`, severity: 'high' }); }
    }
    const ratio = known ? pts / known : 0.6;
    const tier: Tier = fails === 0 && ratio >= 0.9 ? 'Strong' : ratio >= 0.6 ? 'Partial' : 'Weak';
    return { ...v, tier, notes, withinBudget: within, fitsPeople: fits, _ratio: ratio } as ScoredVenue & { _ratio: number };
  });

  const order: Record<Tier, number> = { Strong: 0, Partial: 1, Weak: 2 };
  scored.sort((a, b) => order[a.tier] - order[b.tier] || (b as any)._ratio - (a as any)._ratio);

  const counts = {
    strong: scored.filter((s) => s.tier === 'Strong').length,
    partial: scored.filter((s) => s.tier === 'Partial').length,
    weak: scored.filter((s) => s.tier === 'Weak').length,
  };
  const withinBudget = scored.filter((s) => s.withinBudget).length;
  const fitsPeople = scored.filter((s) => s.fitsPeople).length;

  const gaps: Gap[] = [];
  const missingInputs: string[] = [];
  if (c.capacity == null) missingInputs.push('headcount');
  if (c.budget == null) missingInputs.push('budget');
  if (!c.workspaceType) missingInputs.push('workspace type');
  if (!c.startDate) missingInputs.push('start date');

  if (counts.strong === 0) gaps.push({ label: 'Overall', text: 'No strong matches. Every space has at least one trade-off.', severity: 'high' });
  if (c.budget != null) {
    const cheapest = [...scored].sort((a, b) => a.monthlyPrice - b.monthlyPrice)[0];
    gaps.push({
      label: 'Budget',
      text: withinBudget === 0
        ? `None are within ${money(c.budget)}/mo. The lowest is ${money(cheapest.monthlyPrice)}/mo (${cheapest.name}).`
        : `${withinBudget} of ${scored.length} ${withinBudget === 1 ? 'is' : 'are'} within ${money(c.budget)}/mo${withinBudget < scored.length ? `. The lowest-priced over budget is ${money(cheapest.monthlyPrice)}/mo.` : '.'}`,
      severity: withinBudget === 0 ? 'high' : withinBudget < scored.length / 2 ? 'medium' : 'info',
    });
  }
  if (c.capacity != null) {
    const small = scored.filter((s) => s.fitsPeople === false).length;
    if (small) gaps.push({ label: 'Capacity', text: `${small} of ${scored.length} can't hold ${c.capacity} people. The largest holds ${Math.max(...scored.map((s) => s.desks))}.`, severity: small === scored.length ? 'high' : 'medium' });
  }
  if (c.workspaceType) {
    const off = scored.filter((s) => s.type !== c.workspaceType).length;
    if (off) gaps.push({ label: 'Workspace type', text: `${off} of ${scored.length} ${off === 1 ? 'is' : 'are'} not ${c.workspaceType}.`, severity: off === scored.length ? 'high' : 'medium' });
  }
  if (c.startDate) {
    const late = scored.filter((s) => s.availableFrom > c.startDate);
    if (late.length) gaps.push({ label: 'Availability', text: `${late.length} of ${scored.length} ${late.length === 1 ? "isn't" : "aren't"} available by ${fmtLong(c.startDate)}. The earliest opens ${fmtLong(late.map((s) => s.availableFrom).sort()[0])}.`, severity: 'medium' });
  }
  if (missingInputs.length) gaps.push({ label: 'Not assessed', text: `${cap(missingInputs.join(', '))} ${missingInputs.length === 1 ? 'was' : 'were'} not provided.`, severity: 'info' });
  if (counts.strong === 0) gaps.push({ label: 'Next step', text: "If these gaps matter, additional supply may be worth sourcing. That's a separate process I don't start.", severity: 'info' });

  const summary = `I found ${scored.length} spaces in ${c.location.split(',')[0]} and added them to “${collectionName}”: ${counts.strong} strong, ${counts.partial} partial, ${counts.weak} weak.`;
  const headline = `Added ${scored.length} space${scored.length === 1 ? '' : 's'} in ${c.location.split(',')[0]} to “${collectionName}”.`;
  return { found: scored.length, spaces: scored, counts, headline, inMarket: scored.length, withinBudget, fitsPeople, summary, gaps, missingInputs };
}

// ── Linking an existing Collection by URL ──────────────────────────────────

const KNOWN: Record<string, { name: string; spaces: number; saved: number; shortlisted: number }> = {
  'lisbon-private-offices-a1b2c3': { name: 'Lisbon Private Offices', spaces: 7, saved: 2, shortlisted: 3 },
  'manhattan-private-offices-abc123': { name: 'Manhattan Private Offices', spaces: 12, saved: 3, shortlisted: 4 },
  'austin-flex-options-d4e5f6': { name: 'Austin Flex Options', spaces: 9, saved: 1, shortlisted: 2 },
};

const URL_RE = /^https?:\/\/(?:www\.)?liquidspace\.com\/collections?\/([A-Za-z0-9][A-Za-z0-9_-]*)\/?(?:[?#].*)?$/i;

export interface LinkedCollection { url: string; name: string; spaces: number; saved: number; shortlisted: number }

/** Simulated lookup. A real implementation would fetch the Collection from LiquidSpace. */
export function resolveCollectionUrl(raw: string): LinkedCollection | { error: string } {
  const url = raw.trim();
  if (!url) return { error: 'Enter a LiquidSpace Collection URL.' };
  const m = url.match(URL_RE);
  if (!m) return { error: 'That doesn\'t look like a LiquidSpace Collection link. It should look like liquidspace.com/collections/…' };
  const slug = m[1];
  const known = KNOWN[slug.toLowerCase()];
  if (known) return { url, name: known.name, spaces: known.spaces, saved: known.saved, shortlisted: known.shortlisted };
  const words = slug.replace(/-[a-z0-9]{5,}$/i, '').split(/[-_]+/).filter(Boolean);
  const name = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'LiquidSpace Collection';
  let h = 0;
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return { url, name, spaces: 3 + (h % 9), saved: 0, shortlisted: 0 };
}

export function newCollectionUrl(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'collection';
  return `https://liquidspace.com/collections/${slug}-${Math.random().toString(36).slice(2, 8)}`;
}
