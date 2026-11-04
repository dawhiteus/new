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
  monthlyPrice: number | null; // USD per month; null when the workspace is not priced monthly
  availableFrom: string | null; // ISO; null when not known
  url?: string; // public LiquidSpace listing, when recorded from real data
  minTerm?: string;
}

const V = (id: string, name: string, operator: string, area: string, type: string, desks: number, monthlyPrice: number | null, availableFrom: string | null): Venue =>
  ({ id, name, operator, area, type, desks, monthlyPrice, availableFrom });

/** A real workspace as read from Pulse (Workspaces + Venues). Availability is blank: Pulse holds almost none. */
const R = (id: string, venue: string, title: string, address: string, type: string, desks: number, rate: number, minTerm: string, url: string): Venue =>
  ({ id, name: title, operator: venue, area: address, type, desks, monthlyPrice: rate, availableFrom: null, minTerm, url });

export const SAMPLE_INVENTORY: Record<string, Venue[]> = {
  lisbon: [
    V('lis1', 'Cais Workspace', 'Cais Offices', 'Cais do Sodré', 'Private Office', 40, 26000, '2026-09-01'),
    V('lis2', 'Saldanha Hub', 'Hub Collective', 'Saldanha', 'Private Office', 30, 21000, '2026-10-01'),
    V('lis3', 'Liberdade Suites', 'Avenida Offices', 'Avenida da Liberdade', 'Office Suite', 20, 14500, '2026-09-15'),
    V('lis4', 'Entrecampos Team Floor', 'Campo Spaces', 'Entrecampos', 'Team Office', 35, 23500, '2026-12-01'),
    V('lis5', 'Alvalade Cowork', 'Alvalade Works', 'Alvalade', 'Coworking', 15, 6800, '2026-09-01'),
    V('lis6', 'Pombal Tower Floor', 'Tower Offices', 'Marquês de Pombal', 'Office Suite', 60, 45000, '2027-01-15'),
  ],
  // Denver: REAL workspaces at the four venues the Hub Locator analysis lists, as read from LiquidSpace.
  denver: [
    V('den-circa', 'Coworking Desk', 'WeWork | The Circa Building', 'Platte Street', 'Coworking', 35, null, null),
    V('den-uptown', 'Dedicated Desk', 'Venture X | Denver - Uptown', '16th Street Mall', 'Dedicated Desk', 10, 299, null),
    V('den-lodo', 'Dedicated Desk 1', 'Venture X | LoDo', 'LoDo', 'Dedicated Desk', 6, 599, null),
    V('den-lohi136', 'DenLoHi136', 'Industrious - LoHi', 'LoHi', 'Private Office', 5, 4784, null),
    V('den-lohi210', 'DenLoHi210', 'Industrious - LoHi', 'LoHi', 'Private Office', 5, 5115, null),
  ],
  // REAL workspaces (LiquidSpace / Pulse), each city backed by a real collection in the demo account (see REAL_COLLECTIONS).
  austin: [
    R('aus-1', 'Expansive - North Austin', 'Club Suite 400G', '14205 North Mopac Expressway', 'Office Suite', 39, 12250, '1 month', 'https://liquidspace.com/us/tx/austin/novel-coworking-north-austin/club-suite-200c-copy'),
    R('aus-2', 'Dwell Coworking Downtown', 'Office Suite 3', '1201 East Cesar Chavez Street', 'Office Suite', 25, 8000, '1 month', 'https://liquidspace.com/us/tx/austin/dwell-coworking-downtown/office-suite-3'),
    R('aus-3', 'Expansive - Austin Highland', 'Club Suite 200F', '305 East Huntland Drive', 'Office Suite', 22, 8999, '1 month', 'https://liquidspace.com/us/tx/austin/expansive-austin-highland/club-suite-200e-copy'),
    R('aus-4', 'Indy by Industrious Burnet Rd', 'AUSBUR220', '7001 Burnet Road', 'Private Office', 18, 26570, '1 month', 'https://liquidspace.com/us/tx/austin/indy-by-industrious/ausbur220'),
    R('aus-5', 'Regus | Westlake', 'Team Office', '1250 Capital of Texas Highway South', 'Team Office', 15, 4994, '1 month', 'https://liquidspace.com/us/tx/austin/regus-westlake/team-office-3168'),
    R('aus-6', 'Regus | Aspen Lake One', 'Team Office', '13785 Research Blvd', 'Team Office', 15, 5275, '1 month', 'https://liquidspace.com/us/tx/austin/regus-aspen-lake-one/team-office-df64'),
    R('aus-7', 'Regus | River Place', 'Team Office', '6500 River Place Blvd, Building 7', 'Team Office', 15, 5716, '1 month', 'https://liquidspace.com/us/tx/austin/regus-river-place/team-office-7a45'),
    R('aus-8', 'Regus | Dobie Center', 'Team Office', '2021 Guadalupe Street', 'Team Office', 15, 5816, '1 month', 'https://liquidspace.com/us/tx/austin/regus-dobie-center/team-office-ccd8'),
  ],
  chicago: [
    R('chi-1', 'Expansive - West Loop', 'Office Suite 800C', '318 West Adams Street', 'Office Suite', 41, 10374, '1 month', 'https://liquidspace.com/us/il/chicago/level-office/office-suite-1300c-copy'),
    R('chi-2', 'Expansive - River North – Superior', 'Office Suite 100A', '405 West Superior Street', 'Office Suite', 37, 8249, '1 month', 'https://liquidspace.com/us/il/chicago/expansive-river-north-superior/office-suite-100b-copy-37c1'),
    R('chi-3', 'Expansive - Pru', 'Team Suite 3300D', '180 North Stetson Avenue', 'Office Suite', 33, 15749, '1 month', 'https://liquidspace.com/us/il/chicago/expansive-stetson-ave/team-suite-3300a-copy-1041'),
    R('chi-4', 'Working From_', 'Premium 30-Person Private Studio #411', '200 North Green Street', 'Team Office', 30, 26400, '12 months', 'https://liquidspace.com/us/il/chicago/working-from/private-studio-411'),
    R('chi-5', 'Expansive - Wacker', 'Office Suite 1500B', '211 West Upper Wacker Drive', 'Office Suite', 25, 11586, '12 months', 'https://liquidspace.com/us/il/chicago/level-office-211-w-wacker/office-suite-1500a-copy-6189'),
    R('chi-6', 'Workbox - The Loop', 'Office 1', '125 South Clark Street', 'Office Suite', 25, 11685, '2 months', 'https://liquidspace.com/us/il/chicago/workbox-the-loop/office-1-6146'),
    R('chi-7', 'Industrious - Millennium Park', 'CHI24E116', '24 East Washington Street', 'Private Office', 24, 29581, '1 month', 'https://liquidspace.com/us/il/chicago/industrious-millennium-park-chicago/chi24e116'),
    R('chi-8', 'Regus | West Loop 200 S. Wacker', 'Team Office', '200 South Wacker Drive', 'Team Office', 15, 2457, '1 month', 'https://liquidspace.com/us/il/chicago/regus-west-loop-200-s-wacker/team-office-2c31'),
  ],
  minneapolis: [
    R('min-1', 'Expansive - TriTech Center', 'Office Suite 700B', '331 2nd Avenue South', 'Office Suite', 48, 8249, '1 month', 'https://liquidspace.com/us/mn/minneapolis/novel-coworking-minneapolis/office-suite-600b-copy-9c5a'),
    R('min-2', 'Industrious - North Loop', 'MINLOP002Suite', '323 North Washington Avenue', 'Private Office', 35, 39373, '1 month', 'https://liquidspace.com/us/mn/minneapolis/industrious-minneapolis-north-loop/minlop002suite'),
    R('min-3', 'Regus || Minneapolis - Washington Ave', 'Team Office', '333 N Washington Ave', 'Team Office', 15, 3427, '1 month', 'https://liquidspace.com/us/mn/minneapolis/regus-minneapolis-washington-ave/team-office-c8ad'),
    R('min-4', 'Regus | Minnesota Center', 'Team Office', '7760 France Avenue South', 'Team Office', 15, 3496, '1 month', 'https://liquidspace.com/us/mn/minneapolis/regus-minnesota-center/team-office-6896'),
    R('min-5', 'SPACES || North Loop', 'Team Office', '121 Washington Ave. N', 'Team Office', 15, 3926, '1 month', 'https://liquidspace.com/us/mn/minneapolis/regus-spaces-north-loop/team-office-d119'),
    R('min-6', 'Regus | Minnesota, Bloomington - Normandale Lake', 'Team Office', '8400 Normandale Lake Blvd.', 'Team Office', 15, 4466, '1 month', 'https://liquidspace.com/us/mn/minneapolis/regus-minnesota-bloomington-normandale-lake/team-office-1370'),
    R('min-7', 'Regus | Minneapolis - Lagoon Ave', 'Team Office', '1330 Lagoon Ave', 'Team Office', 15, 4806, '1 month', 'https://liquidspace.com/us/mn/minneapolis/regus-minneapolis-lagoon-ave/team-office-1bd5'),
    R('min-8', 'Regus | MN, Minneapolis - South 6th St', 'Team Office', '120 South 6th St', 'Team Office', 15, 6126, '1 month', 'https://liquidspace.com/us/mn/minneapolis/regus-mn-minneapolis-south-6th-st/team-office-b8bb'),
  ],
  dallas: [
    R('dal-1', 'Expansive - Katy Building', 'Office Suite 400A', '701 Commerce Street', 'Office Suite', 42, 8624, '1 month', 'https://liquidspace.com/us/tx/dallas/level-office-701commerce/club-suite-200b-copy-2e9c'),
    R('dal-2', 'Boxer - 4100 Spring Valley Rd', 'Suite 100.WS', '4100 Spring Valley Road', 'Office Suite', 45, 12792, '12 months', 'https://liquidspace.com/us/tx/dallas/4100-spring-valley-rd/suite-100ws'),
    R('dal-3', 'Boxer - Northbrook Atrium Plaza', 'Suite 1310', '2351 West Northwest Highway', 'Office Suite', 45, 5629, '12 months', 'https://liquidspace.com/us/tx/dallas/boxer-northbrook-atrium-plaza/suite-1310'),
    R('dal-4', 'Boxer - Pacific Place', 'Suite 18100', '1910 Pacific Avenue', 'Office Suite', 55, 7212, '12 months', 'https://liquidspace.com/us/tx/dallas/1910-pacific-place/suite-18100'),
    R('dal-5', 'Boxer - 14800 Quorum', 'Suite 200', '14800 Quorum Drive', 'Office Suite', 44, 7256, '12 months', 'https://liquidspace.com/us/tx/dallas/boxer-14800-quorum/suite-200'),
    R('dal-6', 'Boxer - Office Alpha', 'Suite 405', '13140 Coit Road', 'Office Suite', 44, 6530, '12 months', 'https://liquidspace.com/us/tx/dallas/boxer-office-alpha/suite-405'),
    R('dal-7', 'Boxer - 8330-8360 LBJ Freeway', 'Suite B725.WS', '8330-8360 Lyndon B Johnson Freeway', 'Office Suite', 60, 11551, '12 months', 'https://liquidspace.com/us/tx/dallas/8330-lbj-freeway/suite-b725ws'),
    R('dal-8', 'Boxer - Carillon Towers', 'Suite W0900', '13601 Preston Road', 'Office Suite', 55, 7983, '12 months', 'https://liquidspace.com/us/tx/dallas/carillon-towers/suite-w0900'),
  ],
  'new york': [
    R('new-1', 'Fully Furnished Prime Tribeca Offices', '3rd Floor Fully Furnished Office', '53 Beach Street', 'Office Suite', 60, 47000, '1 month', 'https://liquidspace.com/us/ny/new-york/53-beach-street/office-suite-1'),
    R('new-2', 'Select Office Suites - 1115 Broadway Flatiron NYC', '50 Person Windowed Team Room', '1115 Broadway', 'Team Office', 40, 24500, '12 months', 'https://liquidspace.com/us/ny/new-york/select-office-suites-flatiron/40-person-windowed-team-room'),
    R('new-3', 'Workville', 'Enterprise Team Office (50 Person)', '1412 Broadway', 'Private Office', 50, 38000, '12 months', 'https://liquidspace.com/us/ny/new-york/workville/team-office-18-person-capacity-copy-copy'),
    R('new-4', 'Chelsea by Penn', 'Full Floor Office', '143 West 29th Street', 'Team Office', 50, 23000, '1 month', 'https://liquidspace.com/us/ny/new-york/full-floor-penn-station-office/full-office-copy'),
    R('new-5', 'Tower 49® by Industrious', 'NYCTWR206', '12 East 49th Street', 'Private Office', 48, 67941, '1 month', 'https://liquidspace.com/us/ny/new-york/tower-49-by-industrious/nyctwr206'),
    R('new-6', 'Jay Suites & Jay Conference @ Fifth Avenue', 'Private Office Suite 1/2 Floor', '15 West 38th Street', 'Private Office', 45, 25000, '1 month', 'https://liquidspace.com/us/ny/new-york/jay-suites-38th-street-new-york/private-office-suite-12-floor'),
    R('new-7', 'Bevmax Office Centers - Plaza District', 'Suite 39', '667 Madison Avenue', 'Office Suite', 45, 45000, '12 months', 'https://liquidspace.com/us/ny/new-york/bevmax-office-centers-plaza-district/suite-39'),
    R('new-8', 'Jay Suites & Jay Conference @ Chelsea', 'Suite 802-A/B/C', '159 West 25th Street', 'Private Office', 60, 32000, '6 months', 'https://liquidspace.com/us/ny/new-york/jay-suites-chelsea/suite-802-abc'),
  ],
  porto: [
    R('por-1', 'Vertical Coworking Dom Henrique', 'Office 3', 'Rua do Bolhão 221', 'Private Office', 16, 5994, '1 month', 'https://liquidspace.com/pt/porto/porto/vertical-coworking-dom-henrique/office-3'),
    R('por-2', 'Regus | Regus Porto S. Bento', 'Team Office', 'Rua Augusto Rosa 79', 'Team Office', 15, 2567, '1 month', 'https://liquidspace.com/pt/porto/porto/regus-regus-porto-s-bento/team-office-ee24'),
    R('por-3', 'Regus | Porto, Batalha', 'Team Office', 'Praça Mouzinho de Albuquerque 113', 'Team Office', 15, 2926, '1 month', 'https://liquidspace.com/pt/porto-district/porto/regus-porto-batalha/team-office-0582'),
  ],
};

/** Cities where the simulated agent run resolves to a real, pre-built LiquidSpace collection. */
export const REAL_COLLECTIONS: Record<string, { name: string; url: string }> = {
  denver: { name: 'Denver Hub Collection', url: 'https://liquidspace.com/collections/44f4f9b4-9e80-4abc-a97a-cec2baa5ea99' },
  austin: { name: 'Austin Collection', url: 'https://liquidspace.com/collections/43b4f500-e474-4b36-b303-9f875980c51e' },
  chicago: { name: 'Chicago Collection', url: 'https://liquidspace.com/collections/a09a0bd0-054b-4da8-89f0-ef9816a8c2fa' },
  minneapolis: { name: 'Minneapolis Collection', url: 'https://liquidspace.com/collections/c9004465-1786-4ecf-a5bf-199d72cb4e6a' },
  dallas: { name: 'Dallas Collection', url: 'https://liquidspace.com/collections/568ef221-1642-4822-b79f-3fe348062ccc' },
  'new york': { name: 'New York Collection', url: 'https://liquidspace.com/collections/b6709b07-6512-4120-98b7-7a4dd7505bb4' },
  porto: { name: 'Porto Collection', url: 'https://liquidspace.com/collections/85361f6e-0113-4954-a782-54c933b5155c' },
};
export const realCollectionFor = (location: string) => REAL_COLLECTIONS[location.toLowerCase().split(',')[0].trim()];

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
  amenityNeeds: string;
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
    amenityNeeds: [r.details.programNeeds, r.details.amenityNeeds].filter((x) => x && x.trim()).join(' '),
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
export function sourceCollection(c: SourcingCriteria, collectionName: string, only?: string[]): SourcingResult | null {
  const key = c.location.toLowerCase().split(',')[0].trim();
  const venues = (SAMPLE_INVENTORY[key] ?? []).filter((v) => !only || only.includes(v.id));
  if (!venues.length) return null;

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
    if (c.budget != null && v.monthlyPrice != null) {
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
    if (c.startDate && v.availableFrom != null) {
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
    const priced = scored.filter((s) => s.monthlyPrice != null);
    const unpriced = scored.length - priced.length;
    if (priced.length) {
      const over = priced.filter((s) => s.monthlyPrice! > c.budget!);
      const lowestOver = over.length ? Math.min(...over.map((s) => s.monthlyPrice!)) : null;
      const lowest = [...priced].sort((a, b) => a.monthlyPrice! - b.monthlyPrice!)[0];
      gaps.push({
        label: 'Budget',
        text: (withinBudget === 0
          ? `None are within ${money(c.budget)}/mo. The lowest is ${money(lowest.monthlyPrice!)}/mo (${lowest.name}).`
          : `${withinBudget} of ${priced.length} ${withinBudget === 1 ? 'is' : 'are'} within ${money(c.budget)}/mo${lowestOver != null ? `. The lowest-priced over budget is ${money(lowestOver)}/mo.` : '.'}`)
          + (unpriced ? ` ${unpriced} ${unpriced === 1 ? 'is' : 'are'} not priced monthly.` : ''),
        severity: withinBudget === 0 ? 'high' : withinBudget < priced.length / 2 ? 'medium' : 'info',
      });
    } else {
      gaps.push({ label: 'Budget', text: 'None are priced monthly, so budget could not be compared.', severity: 'info' });
    }
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
    const late = scored.filter((s) => s.availableFrom != null && s.availableFrom > c.startDate);
    if (late.length) gaps.push({ label: 'Availability', text: `${late.length} of ${scored.length} ${late.length === 1 ? "isn't" : "aren't"} available by ${fmtLong(c.startDate)}. The earliest opens ${fmtLong(late.map((s) => s.availableFrom as string).sort()[0])}.`, severity: 'medium' });
  }
  const unsupported = [c.termLength ? 'term length' : '', c.amenityNeeds ? 'program and amenity needs' : ''].filter(Boolean);
  const notAssessed: string[] = [];
  if (missingInputs.length) notAssessed.push(`${cap(missingInputs.join(', '))} ${missingInputs.length === 1 ? 'was' : 'were'} not provided.`);
  if (unsupported.length) notAssessed.push(`${cap(unsupported.join(' and '))} ${unsupported.length === 1 && unsupported[0] === 'term length' ? "isn't" : "aren't"} in the available inventory data.`);
  if (notAssessed.length) gaps.push({ label: 'Not assessed', text: notAssessed.join(' '), severity: 'info' });

  const summary = `Found ${scored.length} space${scored.length === 1 ? '' : 's'} in ${c.location.split(',')[0]} and added ${scored.length === 1 ? 'it' : 'them'} to “${collectionName}”: ${counts.strong} strong, ${counts.partial} partial, ${counts.weak} weak.`;
  const headline = `Added ${scored.length} space${scored.length === 1 ? '' : 's'} in ${c.location.split(',')[0]} to “${collectionName}”.`;
  return { found: scored.length, spaces: scored, counts, headline, inMarket: scored.length, withinBudget, fitsPeople, summary, gaps, missingInputs };
}

// ── Linking an existing Collection by URL ──────────────────────────────────

const KNOWN: Record<string, { name: string; spaces: number; saved: number; shortlisted: number }> = {
  '44f4f9b4-9e80-4abc-a97a-cec2baa5ea99': { name: 'Denver Hub Collection', spaces: 5, saved: 5, shortlisted: 0 },
  // Real collections in the demo LiquidSpace account.
  '43b4f500-e474-4b36-b303-9f875980c51e': { name: 'Austin Collection', spaces: 8, saved: 8, shortlisted: 0 },
  'a09a0bd0-054b-4da8-89f0-ef9816a8c2fa': { name: 'Chicago Collection', spaces: 8, saved: 8, shortlisted: 0 },
  'c9004465-1786-4ecf-a5bf-199d72cb4e6a': { name: 'Minneapolis Collection', spaces: 8, saved: 8, shortlisted: 0 },
  '568ef221-1642-4822-b79f-3fe348062ccc': { name: 'Dallas Collection', spaces: 8, saved: 8, shortlisted: 0 },
  'b6709b07-6512-4120-98b7-7a4dd7505bb4': { name: 'New York Collection', spaces: 8, saved: 8, shortlisted: 0 },
  '85361f6e-0113-4954-a782-54c933b5155c': { name: 'Porto Collection', spaces: 3, saved: 3, shortlisted: 0 },
  '573e59b5-7b3f-43cb-a0f1-e8d341902c4c': { name: 'Lisbon Collection', spaces: 6, saved: 2, shortlisted: 4 },
  '7d10724b-d1b0-41ce-8840-dff497cddae0': { name: 'Chicago Spaces', spaces: 2, saved: 2, shortlisted: 0 },
  '5a3c1c41-0645-46b3-9aec-bbc314c9b748': { name: 'Test', spaces: 5, saved: 4, shortlisted: 1 },
  '6ee8a26f-6fbf-4c3e-aad7-04b2a20a6a16': { name: 'Test Collection 5', spaces: 5, saved: 5, shortlisted: 0 },
  '30857d7f-f151-48ee-97b1-100e2cd20b92': { name: 'Test Collection', spaces: 0, saved: 0, shortlisted: 0 },
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

/** Why a space is proposed, in plain words. Positives first, then the trade-offs already found by scoring. */
export function reasonsFor(v: ScoredVenue, c: SourcingCriteria): string[] {
  const out: string[] = [];
  const city = c.location.split(',')[0];
  if (city) out.push(`In ${city}`);
  if (c.capacity != null && v.fitsPeople) out.push(`Holds ${v.desks} (needs ${c.capacity})`);
  if (c.budget != null && v.withinBudget) out.push(`${money(v.monthlyPrice as number)}/mo, within budget`);
  if (c.workspaceType && v.type === c.workspaceType) out.push(v.type);
  if (c.startDate && v.availableFrom != null && v.availableFrom <= c.startDate) out.push(`Available by ${fmtLong(c.startDate)}`);
  return out;
}

/** Capacity matches as a band around the headcount, as in production ("For 4-7 people" for 5). */
export const capacityBand = (n: number): [number, number] => [Math.max(1, Math.round(n * 0.8)), Math.max(1, Math.round(n * 1.4))];
