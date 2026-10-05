// Requirements originated in Workplace Strategist (Hub Locator) arrive as URL
// params on /transactions/list?newReq=1&... . This module reads them, and keeps
// what arrived in sessionStorage so an originated requirement survives a reload
// or in-app navigation for the rest of the browser session.

/** The Hub Locator analysis an originated requirement came from. */
export interface HubOrigin {
  source: string;
  state?: string;
  seats?: number;
  hvsScore?: number;
  verdict?: string;
  hubPurpose?: string;
  /** Monthly hub cost (USD). The deal's own estValue stays annual. */
  estMonthlyCost?: number;
  ratePerSeat?: number;
  annualNetSaving?: number;
  paybackMonths?: number;
  baselineAnnualSpend?: number;
  seatRange?: string;
  configuration?: string;
  provenance?: string;
  backUrl?: string;
  originatedAt: string;
}

const STORAGE_KEY = 'tm.originatedDeals';

function num(p: URLSearchParams, k: string): number | undefined {
  const raw = p.get(k);
  if (raw == null || raw === '') return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

export function readHubOrigin(p: URLSearchParams): HubOrigin {
  return {
    source: p.get('source') ?? 'hub-locator',
    state: p.get('state') ?? undefined,
    seats: num(p, 'seats'),
    hvsScore: num(p, 'hvs'),
    verdict: p.get('verdict') ?? undefined,
    hubPurpose: p.get('purpose') ?? undefined,
    estMonthlyCost: num(p, 'estMonthly'),
    ratePerSeat: num(p, 'rate'),
    annualNetSaving: num(p, 'saving'),
    paybackMonths: num(p, 'payback'),
    baselineAnnualSpend: num(p, 'baseline'),
    seatRange: p.get('seatRange') ?? undefined,
    configuration: p.get('config') ?? undefined,
    provenance: p.get('prov') ?? undefined,
    backUrl: safeHttpUrl(p.get('back')),
    originatedAt: new Date().toISOString(),
  };
}

/** Only http(s) links may become the "Back to Hub Locator" href. */
function safeHttpUrl(raw: string | null): string | undefined {
  if (!raw) return undefined;
  try {
    const u = new URL(raw);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function loadOriginated<T>(): T[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOriginated<T>(deals: T[]): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
  } catch {
    /* storage unavailable — the deal still shows for this page view */
  }
}

export function formatVerdict(v?: string): string | undefined {
  return v ? v.replace(/_/g, ' ') : undefined;
}

export function formatPurpose(p?: string): string | undefined {
  if (!p) return undefined;
  return p.toLowerCase().split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}

export function formatUsd(v?: number): string | undefined {
  return v == null ? undefined : `$${Math.round(v).toLocaleString()}`;
}
