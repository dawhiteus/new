// Requirement Agent: deterministic reading of pasted customer correspondence.
// A rules-based parser, not a language model. It is built to be readable and extended:
//   1. split the paste into messages, dropping quoted history, signatures and disclaimers
//   2. split each message into sentences
//   3. run small field extractors that produce *candidates* (value, quote, how sure)
//   4. resolve the candidates per field (newest message wins; conflicts stay unresolved)
//   5. validate and normalize against the real requirement schema
// It never invents a value. Anything it cannot read confidently is left empty or reported as an ambiguity.

export interface ParsedFields {
  company: string; name: string; location: string; workspaceType: string; capacity: string; size: string;
  programNeeds: string; amenityNeeds: string; configuration: string; otherFunctional: string;
  startDate: string; termLength: string; closeDate: string; budget: string; otherCommercial: string;
}
export type PField = keyof ParsedFields;
export type ParsedProv = { kind: 'source' | 'suggested'; note: string };
export interface Ambiguity { field?: PField; text: string }
export interface ParseOptions { today?: string; answerMode?: boolean }
export interface ParsedScope {
  fields: Partial<ParsedFields>;
  prov: Partial<Record<PField, ParsedProv>>;
  /** Fields whose value the customer gave as approximate ("about 20"). */
  approx: Partial<Record<PField, boolean>>;
  /** Fields stated as a target or wish rather than a commitment. */
  target: Partial<Record<PField, boolean>>;
  /** Fields the customer was unsure about ("maybe", "might", "not decided"). */
  tentative: Partial<Record<PField, boolean>>;
  ambiguities: Ambiguity[];
  /** Context that is useful but has no field (current office, headcount today, other workspace types…). */
  notes: string[];
}
export interface ParsedResult {
  /** One scope per requirement found (several when the text asks for more than one city). */
  scopes: { label: string; city: string; data: ParsedScope }[];
  /** What was read after quoted history, signatures and disclaimers were set aside. */
  usedMessages: number;
  empty: boolean;
}

export const WORKSPACE_TYPES = ['Office Suite', 'Private Office', 'Team Office', 'Coworking', 'Meeting Space'] as const;
export const CONFIGURATIONS = ['Single space', 'Collection of spaces'] as const;

// ───────────────────────────── vocabulary ─────────────────────────────
const CITY_LIST = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth',
  'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington', 'Boston', 'El Paso', 'Nashville', 'Detroit', 'Oklahoma City', 'Portland',
  'Las Vegas', 'Memphis', 'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento', 'Kansas City', 'Atlanta', 'Omaha', 'Raleigh', 'Miami',
  'Minneapolis', 'Tampa', 'Orlando', 'Pittsburgh', 'Cincinnati', 'Cleveland', 'St. Louis', 'Salt Lake City', 'Richmond', 'Boulder', 'Irvine', 'Santa Monica', 'Palo Alto',
  'Oakland', 'Brooklyn', 'Stamford', 'Hartford', 'Providence', 'Durham', 'Charleston', 'Savannah', 'Honolulu', 'Anchorage', 'Boise', 'Madison', 'Ann Arbor', 'Bellevue',
  'Reston', 'Arlington', 'Fort Lauderdale', 'Scottsdale', 'Plano', 'Newark', 'Jersey City', 'White Plains', 'Greenwich', 'Cambridge', 'Pasadena',
  'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Mexico City', 'Sao Paulo', 'Bogota', 'Buenos Aires',
  'London', 'Manchester', 'Edinburgh', 'Dublin', 'Paris', 'Lyon', 'Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Amsterdam', 'Rotterdam', 'Brussels', 'Zurich', 'Geneva', 'Vienna',
  'Madrid', 'Barcelona', 'Valencia', 'Lisbon', 'Porto', 'Rome', 'Milan', 'Warsaw', 'Prague', 'Budapest', 'Stockholm', 'Copenhagen', 'Oslo', 'Helsinki', 'Athens',
  'Dubai', 'Tel Aviv', 'Mumbai', 'Bangalore', 'Delhi', 'Singapore', 'Hong Kong', 'Tokyo', 'Seoul', 'Shanghai', 'Beijing', 'Sydney', 'Melbourne', 'Auckland', 'Johannesburg', 'Lagos', 'Nairobi', 'Cairo',
];
const CITY_ALIASES: Record<string, string> = {
  Manhattan: 'New York', NYC: 'New York', 'New York City': 'New York', SF: 'San Francisco', 'San Fran': 'San Francisco', 'Washington DC': 'Washington', 'Washington, DC': 'Washington', DC: 'Washington',
  'Saint Louis': 'St. Louis', Lisboa: 'Lisbon', 'São Paulo': 'Sao Paulo',
};
const NOT_CITY = new Set(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Q1', 'Q2', 'Q3', 'Q4', 'The', 'Our', 'We', 'This', 'That', 'It', 'Their', 'There', 'Phase', 'Person', 'Total', 'Addition']);
const GENERIC_TEAMS = new Set(['sales', 'engineering', 'marketing', 'product', 'design', 'finance', 'hr', 'legal', 'operations', 'customer', 'support', 'data', 'research', 'leadership', 'executive', 'admin', 'new', 'our', 'the', 'whole', 'entire', 'core', 'project', 'full', 'leadership', 'management', 'consulting', 'delivery', 'account', 'development']);
const FREE_MAIL = new Set(['gmail', 'yahoo', 'outlook', 'hotmail', 'icloud', 'aol', 'proton', 'protonmail', 'live', 'msn', 'me', 'mac', 'liquidspace', 'ai', 'comcast', 'verizon', 'att']);

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const MON = 'jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?';
const WORDNUM: Record<string, number> = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, a: 1 };
const NUMW = '(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|hundred';
const NUM = `(?:\\d{1,3}(?:,\\d{3})+|\\d+(?:\\.\\d+)?|${NUMW})`;
const toNum = (s: string): number => {
  const t = s.toLowerCase().replace(/,/g, '').trim();
  if (/^\d+(\.\d+)?$/.test(t)) return parseFloat(t);
  const [a, b] = t.split(/[- ]/);
  return (WORDNUM[a] ?? NaN) + (b ? (WORDNUM[b] ?? 0) : 0);
};
const HEDGE = /\b(about|around|roughly|approximately|approx\.?|ish|nearly|almost|closer to|somewhere (?:around|near|between)|or so|give or take|~|maybe|perhaps|probably|estimate[ds]?)\b|~/i;
const cap1 = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const fmtMoney = (n: number) => `$${n.toLocaleString('en-US')}`;
export const fmtDate = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };
const pad = (n: number) => String(n).padStart(2, '0');
const isoOf = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;
const lastDay = (y: number, m: number) => new Date(y, m, 0).getDate();
const validDay = (y: number, m: number, d: number) => m >= 1 && m <= 12 && d >= 1 && d <= lastDay(y, m);
const unique = <T,>(a: T[]) => [...new Set(a)];
const joinList = (a: string[]) => (a.length <= 1 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`);

// ───────────────────────────── 1. messages ─────────────────────────────
interface Message { body: string; signature: string; header: string; quoted: boolean }

const BOUNDARY = [
  /^\s*-{2,}\s*(?:forwarded message|original message)\s*-{2,}\s*$/i,
  /^\s*begin forwarded message:?\s*$/i,
  /^\s*on .{5,160}\bwrote:\s*$/i,
  /^\s*_{8,}\s*$/,
];
const HEADER_LINE = /^\s*(from|sent|date|to|cc|bcc|subject|reply-to)\s*:/i;
const SIGNOFF = /^\s*(thanks(?: so much| again| in advance)?|thank you(?: so much)?|thx|best(?: regards| wishes)?|all the best|kind regards|warm regards|regards|cheers|sincerely|many thanks|talk soon|speak soon|looking forward)[,!.\s]*$|^\s*--\s*$|^\s*sent from my /i;
const DISCLAIMER = /(confidential|intended recipient|privileged|unsubscribe|disclaimer|this e-?mail|virus|do not print|consider the environment|all rights reserved|legal notice|if you (?:have )?received this)/i;
const GREETING = /^\s*(hi|hello|hey|dear|good (?:morning|afternoon|evening)|team|all)\b[^.\n!?]{0,50}[,!:]?\s*$/i;

export function splitMessages(raw: string): Message[] {
  const lines = raw.replace(/\r\n?/g, '\n').split('\n');
  const chunks: { lines: string[]; quoted: boolean; header: string[] }[] = [{ lines: [], quoted: false, header: [] }];
  let inHeader = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isBoundary = BOUNDARY.some((re) => re.test(line))
      || (/^\s*from:/i.test(line) && lines.slice(i + 1, i + 5).some((l) => /^\s*(sent|date|to|subject):/i.test(l)));
    if (isBoundary) { chunks.push({ lines: [], quoted: false, header: /^\s*from:/i.test(line) ? [line] : [] }); inHeader = true; continue; }
    const cur = chunks[chunks.length - 1];
    if (inHeader && HEADER_LINE.test(line)) { cur.header.push(line); continue; }
    if (inHeader && !line.trim()) { if (cur.lines.length === 0) continue; }
    if (line.trim()) inHeader = false;
    if (/^\s*>/.test(line)) {
      // quoted history: group into its own earlier message
      if (!cur.quoted && cur.lines.some((l) => l.trim())) chunks.push({ lines: [], quoted: true, header: [] });
      else if (!cur.quoted) cur.quoted = true;
      chunks[chunks.length - 1].lines.push(line.replace(/^\s*(?:>\s?)+/, ''));
    } else {
      if (cur.quoted && line.trim()) chunks.push({ lines: [], quoted: false, header: [] });
      chunks[chunks.length - 1].lines.push(line);
    }
  }
  return chunks.filter((c) => c.lines.some((l) => l.trim())).map((c) => {
    let ls = c.lines.map((l) => l.replace(/\s+$/, ''));
    // signature: last sign-off line near the end
    let sigAt = -1;
    for (let i = ls.length - 1; i >= Math.max(0, ls.length - 12); i--) if (SIGNOFF.test(ls[i]) && ls[i].trim().length < 40) { sigAt = i; break; }
    let signature = sigAt >= 0 ? ls.slice(sigAt + 1).join('\n') : '';
    if (sigAt >= 0) ls = ls.slice(0, sigAt);
    else {
      // No sign-off word: a closing "Name / Company" pair of short lines is still a signature.
      const tail = ls.filter((l) => l.trim()).slice(-2);
      if (tail.length === 2 && /^[A-Z][a-z]+(?:\s[A-Z][a-z.]+){1,2}$/.test(tail[0].trim()) && /^[A-Z][\w&.,' -]{1,40}$/.test(tail[1].trim()) && !/[.!?]$/.test(tail[1].trim())) {
        const at = ls.lastIndexOf(tail[0]);
        signature = ls.slice(at).join('\n'); ls = ls.slice(0, at);
      }
    }
    ls = ls.filter((l) => !DISCLAIMER.test(l) && !/^\s*(sent from my|get outlook)/i.test(l));
    while (ls.length && GREETING.test(ls[0])) ls.shift();
    return { body: ls.join('\n').trim(), signature, header: c.header.join('\n'), quoted: c.quoted };
  }).filter((m) => m.body || m.signature);
}

// ───────────────────────────── 2. sentences ─────────────────────────────
// "Headcount: 22" style lines are rewritten into plain sentences the extractors already understand.
const LABELS: [RegExp, (v: string) => string][] = [
  [/^(?:head ?count|people|seats|team size|capacity|employees|staff|# of (?:people|seats))$/i, (v) => (/^\d/.test(v) ? `${v} people` : v)],
  [/^(?:size|square (?:feet|footage)|sq\.? ?ft\.?|sf)$/i, (v) => (/[a-z]/i.test(v) ? v : `${v} sq ft`)],
  [/^(?:start(?: date)?|move[- ]?in(?: date)?|occupancy|commencement)$/i, (v) => `starting ${v}`],
  [/^(?:lease )?term(?: length)?$/i, (v) => `${v} lease`],
  [/^(?:monthly )?budget$/i, (v) => `budget ${v}`],
  [/^(?:close(?: date)?|decision(?: date)?|sign(?:ing)? date)$/i, (v) => `sign by ${v}`],
  [/^(?:workspace |space )?type$/i, (v) => v],
];
function expandLabel(t: string): string {
  const m = t.match(/^([A-Za-z# .\/]{2,24}?)\s*[:\-–]\s+(.+)$/);
  if (!m) return t;
  for (const [re, f] of LABELS) if (re.test(m[1].trim())) return f(m[2].trim());
  return t;
}
interface Sentence { text: string; msg: number; idx: number }
function splitSentences(body: string, msg: number, start: number): Sentence[] {
  const protectedText = body
    .replace(/\b(sq|approx|e\.g|i\.e|vs|etc|inc|ltd|st|no|mr|ms|dr|co|corp|u\.s)\./gi, (m) => m.replace(/\./g, '\u0001'))
    .replace(/(\d)\.(\d)/g, '$1\u0001$2');
  const out: string[] = [];
  protectedText.split(/\n+/).forEach((line) => {
    const clean = line.replace(/^\s*(?:[-•*–]|\d+[.)])\s+/, '').trim();
    clean.split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/).forEach((s) => { const t = s.trim(); if (t) out.push(t); });
  });
  return out.map((t, i) => ({ text: expandLabel(t.replace(/\u0001/g, '.')), msg, idx: start + i }));
}

// ───────────────────────────── dates ─────────────────────────────
interface DateHit { start: number; end: number; iso: string; precision: 'day' | 'month' | 'quarter' | 'relative'; inferred: boolean; why: string; text: string }
const monthOf = (s: string) => MONTHS.findIndex((m) => m.startsWith(s.slice(0, 3).toLowerCase())) + 1;

function nextOccurrence(m: number, d: number, today: string): { y: number; inferredYear: boolean } {
  const [ty, tm, td] = today.split('-').map(Number);
  const y = m < tm || (m === tm && d < td) ? ty + 1 : ty;
  return { y, inferredYear: true };
}
function quarterStart(q: number, y: number, mod: string | undefined): string {
  const m0 = (q - 1) * 3 + 1;
  if (/mid/i.test(mod ?? '')) return isoOf(y, m0 + 1, 15);
  if (/late|end/i.test(mod ?? '')) return isoOf(y, m0 + 2, lastDay(y, m0 + 2));
  return isoOf(y, m0, 1);
}
export function findDates(text: string, today: string): DateHit[] {
  const [ty, tm] = today.split('-').map(Number);
  const hits: DateHit[] = [];
  const taken = (s: number, e: number) => hits.some((h) => s < h.end && e > h.start);
  const add = (h: DateHit) => { if (!taken(h.start, h.end)) hits.push(h); };
  let m: RegExpExecArray | null;

  const iso = /\b(20\d\d)-(\d\d)-(\d\d)\b/g;
  while ((m = iso.exec(text))) if (validDay(+m[1], +m[2], +m[3])) add({ start: m.index, end: m.index + m[0].length, iso: m[0], precision: 'day', inferred: false, why: '', text: m[0] });

  const us = /\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/g;
  while ((m = us.exec(text))) { const y = +m[3] < 100 ? 2000 + +m[3] : +m[3]; if (validDay(y, +m[1], +m[2])) add({ start: m.index, end: m.index + m[0].length, iso: isoOf(y, +m[1], +m[2]), precision: 'day', inferred: false, why: '', text: m[0] }); }

  const mdy = new RegExp(`\\b(${MON})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s+(20\\d\\d))?\\b`, 'gi');
  while ((m = mdy.exec(text))) {
    if (m[1].toLowerCase() === 'may' && m[1] !== 'May' && !m[3]) continue;
    const mo = monthOf(m[1]); const d = +m[2];
    if (d > 31) continue;
    let y = m[3] ? +m[3] : 0; let inf = false;
    if (!y) { y = nextOccurrence(mo, d, today).y; inf = true; }
    if (!validDay(y, mo, d)) continue;
    add({ start: m.index, end: m.index + m[0].length, iso: isoOf(y, mo, d), precision: 'day', inferred: inf, why: inf ? `No year given; read as ${fmtDate(isoOf(y, mo, d))}.` : '', text: m[0] });
  }
  const dmy = new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:of\\s+)?(${MON})\\.?(?:,?\\s+(20\\d\\d))?\\b`, 'gi');
  while ((m = dmy.exec(text))) {
    const mo = monthOf(m[2]); const d = +m[1];
    if (m[2].toLowerCase() === 'may' && !m[3]) continue;
    let y = m[3] ? +m[3] : 0; let inf = false;
    if (!y) { y = nextOccurrence(mo, d, today).y; inf = true; }
    if (!validDay(y, mo, d)) continue;
    add({ start: m.index, end: m.index + m[0].length, iso: isoOf(y, mo, d), precision: 'day', inferred: inf, why: inf ? `No year given; read as ${fmtDate(isoOf(y, mo, d))}.` : '', text: m[0] });
  }
  const modMonth = new RegExp(`\\b(?:(early|mid|late|the end of|end of|the beginning of|beginning of|the start of|start of|the middle of|middle of)[- ]?)?(${MON})\\.?(?:,?\\s+(20\\d\\d))?\\b`, 'gi');
  while ((m = modMonth.exec(text))) {
    const word = m[2];
    if (word.toLowerCase() === 'may' && word !== 'May' && !m[1] && !m[3]) continue;
    if (!m[1] && !m[3] && !/\b(?:in|by|for|around|during|until|from|of|before|after|this|next)\s*$/i.test(text.slice(Math.max(0, m.index - 14), m.index))) continue;
    const mo = monthOf(word); let y = m[3] ? +m[3] : 0;
    if (!y) y = mo < tm ? ty + 1 : ty;
    const mod = (m[1] ?? '').toLowerCase();
    const d = /end/.test(mod) ? lastDay(y, mo) : /mid|middle/.test(mod) ? 15 : 1;
    const label = `${m[1] ? `${m[1].replace(/^the /i, '')} ` : ''}${cap1(word)}${m[3] ? ` ${m[3]}` : ''}`;
    add({ start: m.index, end: m.index + m[0].length, iso: isoOf(y, mo, d), precision: 'month', inferred: true, why: `Read “${label}” as ${fmtDate(isoOf(y, mo, d))}; no day was given.`, text: m[0] });
  }
  const qtr = /\b(early|mid|late|end of)?\s*(?:Q([1-4])(?:\s+(?:of\s+)?(20\d\d))?|(first|second|third|fourth)\s+quarter(?:\s+of\s+(20\d\d))?|(this|next)\s+quarter)\b/gi;
  const curQ = Math.floor((tm - 1) / 3) + 1;
  while ((m = qtr.exec(text))) {
    let q: number; let y: number;
    if (m[2]) { q = +m[2]; y = m[3] ? +m[3] : (q < curQ ? ty + 1 : ty); }
    else if (m[4]) { q = ['first', 'second', 'third', 'fourth'].indexOf(m[4].toLowerCase()) + 1; y = m[5] ? +m[5] : (q < curQ ? ty + 1 : ty); }
    else { q = /next/i.test(m[6]) ? curQ + 1 : curQ; y = ty; if (q > 4) { q = 1; y = ty + 1; } }
    const iso0 = quarterStart(q, y, m[1]);
    add({ start: m.index, end: m.index + m[0].length, iso: iso0, precision: 'quarter', inferred: true, why: `Read “${m[0].trim()}” as ${fmtDate(iso0)}; only a quarter was given.`, text: m[0].trim() });
  }
  const season = /\b(?:early |late )?(next |this )?(spring|summer|fall|autumn|winter)\b/gi;
  while ((m = season.exec(text))) {
    const mo = { spring: 3, summer: 6, fall: 9, autumn: 9, winter: 12 }[m[2].toLowerCase() as 'spring'];
    const y = /next/i.test(m[1] ?? '') ? (mo <= tm ? ty + 1 : ty) : (mo < tm ? ty + 1 : ty);
    add({ start: m.index, end: m.index + m[0].length, iso: isoOf(y, mo, 1), precision: 'relative', inferred: true, why: `Read “${m[0].trim()}” as ${fmtDate(isoOf(y, mo, 1))}; only a season was given.`, text: m[0].trim() });
  }
  const rel = new RegExp(`\\b(?:(early|mid|late|the end of|the beginning of|the start of)\\s+)?(next|this)\\s+(month|year)\\b|\\bin\\s+(?:about\\s+|around\\s+)?(${NUM})\\s+(weeks?|months?)\\b`, 'gi');
  while ((m = rel.exec(text))) {
    let y = ty; let mo = tm; let d = 1;
    if (m[2]) {
      const next = /next/i.test(m[2]);
      if (/month/i.test(m[3])) { mo = tm + (next ? 1 : 0); if (mo > 12) { mo -= 12; y += 1; } }
      else { y = ty + (next ? 1 : 0); mo = 1; if (m[1] && /end/i.test(m[1])) { mo = 12; d = 31; } }
      if (m[1] && /late/i.test(m[1]) && /month/i.test(m[3])) d = 20;
      if (m[1] && /mid/i.test(m[1]) && /month/i.test(m[3])) d = 15;
    } else {
      const n = toNum(m[4]); const [yy, mm, dd] = today.split('-').map(Number);
      const dt = new Date(yy, mm - 1, dd + (/week/i.test(m[5]) ? n * 7 : n * 30));
      y = dt.getFullYear(); mo = dt.getMonth() + 1; d = dt.getDate();
    }
    add({ start: m.index, end: m.index + m[0].length, iso: isoOf(y, mo, d), precision: 'relative', inferred: true, why: `Read “${m[0].trim()}” as ${fmtDate(isoOf(y, mo, d))}, counting from today.`, text: m[0].trim() });
  }
  return hits.sort((a, b) => a.start - b.start);
}

// ───────────────────────────── candidates ─────────────────────────────
interface Cand {
  field: PField; value: string; quote: string; conf: 'stated' | 'inferred'; msg: number; idx: number;
  approx?: boolean; target?: boolean; conditional?: boolean; note?: string; revision?: boolean; weak?: boolean; role?: string; tentative?: boolean;
}
const condBefore = (t: string, idx: number) => CONDITIONAL.test(t.slice(0, Math.max(0, idx)));
const CONDITIONAL = /\b(if|assuming|depending on|subject to|provided that|contingent|in case|once we|should we|unless)\b/i;
const TENT = /\b(might|not sure|unsure|tentative|tbd|not decided|undecided|we think|i think|thinking about|up in the air|not (?:yet )?confirmed)\b/i;
const SOFT = /\b(maybe|perhaps|probably|possibly|likely|roughly|ish)\b/i;
const REVISION = /\b(actually|correction|instead|updated?|revised?|changed|change of plan|now|rather|scratch that|no longer|moved to|pushed to|bumped|new (?:number|target|date|budget|headcount)|let'?s (?:say|go with|make it)|to confirm)\b/i;
const BACKGROUND = /\b(founded|raised|series [a-e]|funding|valuation|revenue|arr\b|customers?\b.*\b(?:worldwide|globally)|globally|worldwide|company-wide|in total|total (?:employees|headcount)|employees (?:worldwide|globally|total)|years? of experience|years? ago|since 19|since 20)\b/i;
const CURRENT_CUE = /\b(currently|right now|at the moment|today|as of now|now have|we have|we've got|we are at|we're at|presently|existing|currently at|at present)\b/i;
const FUTURE_CUE = /\b(will|plan(?:ning|s)?|expect(?:ing)?|grow(?:ing)?|expand(?:ing)?|need|require|looking|by|next|going to|projected|hiring|ramp(?:ing)?|add(?:ing)?|target|reach|scale|scaling|space for|seat|accommodate)\b/i;

const numRange = new RegExp(`(${NUM})\\s*(?:-|–|—|to|or)\\s*(${NUM})`, 'i');

function extractCapacity(s: Sentence, out: Cand[]) {
  const t = s.text;
  if (BACKGROUND.test(t) && !/\b(need|space for|seats?|looking)\b/i.test(t)) return;
  const unit = '(?:people|persons?|employees|staff|seats?|desks?|team members|folks|heads|headcount|ppl|workstations|FTEs?|colleagues|associates|consultants|engineers|reps|analysts|developers|advisors|bodies)';
  const hedge = '(?:(?<h>about|around|roughly|approximately|approx\\.?|~|nearly|almost|closer to|up to|at least|over|more than|maybe|perhaps|probably|somewhere (?:around|near|between)|give or take)\\s+)?';
  const tail = '(?!\\s*(?:%|percent|months?|years?|k\\b|sq|sf\\b|miles?|minutes?|blocks?))';
  const patterns: { re: RegExp; kind: 'plain' | 'growth' }[] = [
    { re: new RegExp(`${hedge}(?<a>${NUM})(?:\\s*\\+)?(?:\\s*(?:-|–|—|to|or)\\s*(?<b>${NUM}))?\\s*${unit}\\b`, 'gi'), kind: 'plain' },
    { re: new RegExp(`\\b(?:team|group|staff|crew|office|company|headcount|squad|department)\\s+(?:of|is|at|:)\\s+${hedge}(?<a>${NUM})\\b${tail}`, 'gi'), kind: 'plain' },
    { re: new RegExp(`\\b(?<a>${NUM})[- ]person\\b`, 'gi'), kind: 'plain' },
    { re: new RegExp(`\\b(?:grow(?:ing)?|expand(?:ing)?|scal(?:e|ing)|ramp(?:ing)?|reach(?:ing)?|hir(?:e|ing) up|rising)\\s+(?:up\\s+)?(?:to|towards)\\s+${hedge}(?<a>${NUM})\\b${tail}`, 'gi'), kind: 'growth' },
    { re: new RegExp(`\\b(?:space|room|seats?|desks?|offices?)\\s+for\\s+${hedge}(?<a>${NUM})\\b${tail}`, 'gi'), kind: 'plain' },
  ];
  const seen = new Set<string>();
  for (const { re, kind } of patterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(t))) {
      const g = m.groups!;
      const lo = toNum(g.a); const hi = g.b ? toNum(g.b) : null;
      if (!Number.isFinite(lo) || lo <= 0 || (hi !== null && !Number.isFinite(hi))) continue;
      const q = m[0].trim();
      const afterText = t.slice(m.index + m[0].length);
      const beforeText = t.slice(Math.max(0, m.index - 30), m.index);
      if (/\b(?:floors?|rooms?|offices?|months?)\s*$/i.test(beforeText) && kind === 'plain' && /\d/.test(g.a) === false) continue;
      if (/^\s*(?:each|apiece|per (?:office|location|space|site|city))/i.test(afterText)) continue;
      if (/\b(?:another|additional|extra|plus|an additional)\s*$/i.test(beforeText)) continue;
      const isCurrentSpace = /^\s*(?:in the )?(?:current|existing)\b/i.test(afterText);
      const isCurrent = isCurrentSpace || (CURRENT_CUE.test(t) && !FUTURE_CUE.test(t.replace(CURRENT_CUE, '')));
      const value = String(hi ?? lo);
      if (seen.has(kind + value)) continue; seen.add(kind + value);
      out.push({
        field: 'capacity', value, quote: q, conf: 'stated', msg: s.msg, idx: s.idx,
        approx: !!g.h || hi !== null || /\bor so\b/i.test(t), conditional: condBefore(t, m.index),
        note: hi !== null ? `Range ${lo} to ${hi}; entered ${hi} so the space fits everyone.` : undefined,
        role: isCurrent ? 'current' : kind === 'growth' ? 'growth' : 'plain', weak: isCurrent, revision: REVISION.test(t),
      });
    }
  }
}

const COMMERCIAL_NUM_BLOCK = /\b(raised|funding|series [a-e]|revenue|arr\b|valuation|salary|salaries|payroll|deposit|allowance|tenant improvement|\bti\b|per (?:sq|square)|psf|\/\s?sf|\/\s?sq)\b/i;
function extractBudget(s: Sentence, out: Cand[], ctx: Ctx) {
  const t = s.text;
  const re = new RegExp(`(?:(?:up to|under|max(?:imum)?(?: of)?|no more than|not to exceed|at most|below)\\s+)?(?:(about|around|roughly|approximately|approx\\.?|~|closer to)\\s+)?(\\$|USD\\s?|US\\$|€|£|EUR\\s?|GBP\\s?)\\s?(${NUM})\\s?(k\\b|K\\b|m\\b|M\\b|thousand|million)?(?:\\s*(?:-|–|—|to)\\s*(?:\\$|€|£)?\\s?(${NUM})\\s?(k\\b|K\\b|m\\b|M\\b|thousand|million)?)?`, 'gi');
  let m: RegExpExecArray | null;
  while ((m = re.exec(t))) {
    const around = t.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40);
    const after = t.slice(m.index + m[0].length, m.index + m[0].length + 32);
    const before = t.slice(Math.max(0, m.index - 36), m.index);
    if (/\b(raised|funding|series [a-e]|revenue|arr\b|valuation|salary|payroll)\b/i.test(before + after)) continue;
    const cur = /€|EUR/i.test(m[2]) ? 'EUR' : /£|GBP/i.test(m[2]) ? 'GBP' : 'USD';
    const scale = (u: string | undefined) => (!u ? 1 : /^k|thousand/i.test(u) ? 1000 : 1e6);
    let lo = toNum(m[3]) * scale(m[4]);
    let hi: number | null = null;
    if (m[5]) { const u2 = m[6] ?? m[4]; hi = toNum(m[5]) * scale(u2); if (m[4] === undefined && m[6] !== undefined && lo < 1000) lo *= scale(m[6]); }
    if (!Number.isFinite(lo)) continue;
    const per = (() => {
      if (/^\s*(?:\/|per|a|each|every)\s*(?:person|seat|desk|head|employee)/i.test(after) || /per (?:person|seat|desk|head|employee)\b/i.test(after)) return 'seat';
      if (/^\s*(?:\/|per|a|each|an)?\s*(?:sq|square|sf\b|psf)/i.test(after) || /^\s*\/\s?s/i.test(after) || /\bpsf\b/i.test(after)) return 'sf';
      if (/^\s*(?:\/\s?(?:mo|month)|per month|a month|monthly|each month|\/mo\b|pm\b|p\.m\.)/i.test(after) || /\bmonthly\b/i.test(before)) return 'month';
      if (/^\s*(?:\/\s?(?:yr|year)|per year|a year|annual|annually|per annum|p\.a\.|\/yr)/i.test(after) || /\b(annual|annually|yearly)\b/i.test(around)) return 'year';
      return 'none';
    })();
    const cueBefore = before.toLowerCase();
    const cueText = (cueBefore + ' ' + m[0].slice(0, 20)).replace(/\b(?:moves?|goes|go|going|raised?|increased?|bumped?|rises?|rose|pushed?|moving)\s+up\s+to\b/gi, 'moves to');
    const ceiling = /\b(up to|max(?:imum)?|no more than|not to exceed|cap(?:ped)?|ceiling|hard limit|at most|under|below|can'?t exceed|cannot exceed|do not exceed|limit)\b/i.test(cueText) || /\b(hard (?:cap|limit)|firm|not (?:a )?(?:flexible|negotiable)|absolute max)\b/i.test(t) || /\b(?:can'?t|cannot|won'?t|will not|don'?t|do not)\s+(?:go|spend|pay|exceed|stretch)\s*(?:above|over|more than|past|beyond)?/i.test(t);
    const flexible = /\b(flexible|negotiable|some (?:room|flexibility)|wiggle|can stretch|could stretch|stretch)\b/i.test(t);
    const hedge = !!m[1] || /\b(around|about|roughly|approximately|ballpark|target|hoping|ideally|in the range|somewhere|maybe|perhaps|probably|something like|let'?s say)\b/i.test(before);
    const target = !ceiling && (hedge || /\b(target|ballpark|aim|hoping|ideally|budget (?:is|of)? ?(?:around|about))\b/i.test(t) || flexible);
    const base = { field: 'budget' as PField, quote: m[0].trim(), msg: s.msg, idx: s.idx, conditional: condBefore(t, m.index), revision: REVISION.test(t) };
    if (cur !== 'USD') { out.push({ ...base, value: '', conf: 'stated', role: 'foreign-currency', note: `Budget stated as ${cur === 'EUR' ? '€' : '£'}${(hi ?? lo).toLocaleString('en-US')}. I did not convert currencies.` }); continue; }
    if (COMMERCIAL_NUM_BLOCK.test(around) && per !== 'month' && per !== 'seat') {
      if (/deposit|allowance|tenant improvement|\bti\b/i.test(around) || per === 'sf') out.push({ ...base, value: '', conf: 'stated', role: 'commercial-note', note: `${t.length > 160 ? m[0].trim() : t}` });
      continue;
    }
    const amount = hi ?? lo;
    let value: number; let note: string | undefined; let conf: Cand['conf'] = 'stated';
    if (per === 'sf') { out.push({ ...base, value: '', conf: 'stated', role: 'commercial-note', note: `Rate stated: ${m[0].trim()}${/sq|sf/i.test(after) ? '' : ' per sq ft'}.` }); continue; }
    if (per === 'seat') {
      const cap = ctx.capacityHint;
      if (!cap) { out.push({ ...base, value: '', conf: 'stated', role: 'per-seat', note: `Budget given per person (${m[0].trim()}); needs headcount to convert.` }); continue; }
      value = Math.round(amount * cap); conf = 'inferred'; note = `${fmtMoney(amount)} per person × ${cap} people = ${fmtMoney(value)} per month.`;
    } else if (per === 'year') { value = Math.round(amount / 12); conf = 'inferred'; note = `${fmtMoney(amount)} per year, converted to ${fmtMoney(value)} per month.`; }
    else if (per === 'month') value = amount;
    else {
      const keyword = /\b(budget|spend|afford|rent|price range|willing to pay|monthly|per month|cost|pay)\b/i.test(t) || ctx.answerMode;
      if (!keyword) continue;
      if (amount >= 100000) { out.push({ ...base, value: '', conf: 'stated', role: 'no-period', note: `${fmtMoney(amount)} was stated without saying per month or per year.` }); continue; }
      value = amount; conf = 'inferred'; note = `${fmtMoney(amount)} had no period; read as per month.`;
    }
    if (hi !== null) note = `Range ${fmtMoney(lo)} to ${fmtMoney(hi)}; entered the upper end.${note ? ' ' + note : ''}`;
    out.push({ ...base, value: String(value), conf, note, approx: hedge || hi !== null, target: target && !ceiling, role: ceiling ? 'ceiling' : 'plain' });
  }
}

function extractTerm(s: Sentence, out: Cand[], ctx: Ctx) {
  const t = s.text;
  if (/month[- ]to[- ]month/i.test(t)) { out.push({ field: 'termLength', value: '1', quote: 'month-to-month', conf: 'inferred', msg: s.msg, idx: s.idx, note: 'Month-to-month entered as a 1 month term.' }); return; }
  const re = new RegExp(`(?:(about|around|roughly|approximately|approx\\.?|at least|minimum of|minimum|up to|maximum of)\\s+)?(${NUM}|a|an)(?:\\s*(?:-|–|—|to|or)\\s*(${NUM}))?[- ]\\s?(months?|mos?\\b|years?|yrs?\\b)(?:[- ](?:term|lease|commitment|contract|deal|agreement|initial))?`, 'gi');
  let m: RegExpExecArray | null;
  while ((m = re.exec(t))) {
    const before = t.slice(Math.max(0, m.index - 40), m.index);
    const after = t.slice(m.index + m[0].length, m.index + m[0].length + 28);
    if (/\b(ago|old|of experience|history|since)\b/i.test(after) || /\b(last|past|previous|over the)\s*$/i.test(before)) continue;
    if (/^\s*(?:of\s+)?(?:notice|free|rent[- ]free|deposit|runway|ramp)/i.test(after)) continue;
    if (/\bin\s+(?:about\s+|around\s+)?$/i.test(before)) continue; // "in 3 months" is a date
    const cued = /\b(term|lease|commit(?:ment|ting)?|contract|agreement|license|for|initial|duration|through|over|looking at|thinking|planning|say|maybe|probably|minimum|at least|pilot|deal)\b/i.test(before + ' ' + m[0] + ' ' + after) || ctx.answerMode;
    if (/\b(?:within|after|every|each|over the next|in the next|past|last|next)\s*$/i.test(before)) continue;
    if (!cued && /^(a|an)$/i.test(m[2])) continue;
    if (/(?:\$|€|£)\s?[\d,.]+\s?(?:k|m)?\s*(?:\/|per|a|an)?\s*$/i.test(before) && /^(a|an)$/i.test(m[2])) continue;
    if (/^(a|an)$/i.test(m[2]) && !/\b(term|lease|commit(?:ment|ting)?|contract|agreement|for|initial|through|over|deal|pilot|minimum|about|around|roughly)\b/i.test(before.slice(-24) + ' ' + after.slice(0, 14))) continue;
    const isYear = /^y/i.test(m[4]);
    const a = /^(a|an)$/i.test(m[2]) ? 1 : toNum(m[2]); if (!Number.isFinite(a)) continue;
    const b = m[3] ? toNum(m[3]) : null;
    const lo = a * (isYear ? 12 : 1); const hi = b !== null ? b * (isYear ? 12 : 1) : null;
    const val = lo;
    out.push({
      field: 'termLength', value: String(val), quote: m[0].trim(), conf: hi !== null || /^(about|around|roughly|approximately|approx)/i.test(m[1] ?? '') ? 'inferred' : 'stated', msg: s.msg, idx: s.idx,
      approx: !!m[1] && /about|around|roughly|approx/i.test(m[1]), conditional: condBefore(t, m.index), revision: REVISION.test(t),
      note: hi !== null ? `Range ${lo} to ${hi} months; entered ${lo}.` : /minimum|at least/i.test(m[1] ?? '') ? 'Stated as a minimum.' : undefined,
      role: hi !== null ? 'range' : 'plain',
    });
    return;
  }
}

function extractSize(s: Sentence, out: Cand[]) {
  const t = s.text;
  const re = new RegExp(`(?:(about|around|roughly|approximately|approx\\.?|~|up to|at least|minimum of)\\s+)?(${NUM})\\s?(k\\b)?(?:\\s*(?:-|–|—|to)\\s*(${NUM})\\s?(k\\b)?)?\\s*(sq\\.?\\s?ft\\.?|sqft|sf\\b|square (?:feet|foot)|rsf|usf|m2|m²|sqm|square met(?:er|re)s?)`, 'i');
  const m = t.match(re); if (!m) return;
  if (/per\s+(?:person|desk|seat|employee|head)/i.test(t.slice(m.index! + m[0].length, m.index! + m[0].length + 18)) || /^\s*(?:\/|per)/i.test(t.slice(m.index! + m[0].length, m.index! + m[0].length + 6))) return;
  const scale = (k?: string) => (k ? 1000 : 1);
  let lo = toNum(m[2]) * scale(m[3]); let hi = m[4] ? toNum(m[4]) * scale(m[5] ?? m[3]) : null;
  const metric = /m2|m²|sqm|met/i.test(m[6]);
  let note: string | undefined; let conf: Cand['conf'] = 'stated';
  let v = hi ?? lo;
  if (metric) { v = Math.round(v * 10.764); conf = 'inferred'; note = `${(hi ?? lo).toLocaleString('en-US')} m² converted to ${v.toLocaleString('en-US')} sq ft.`; }
  if (hi !== null) note = `Range ${Math.round(metric ? lo * 10.764 : lo).toLocaleString('en-US')} to ${Math.round(metric ? hi * 10.764 : hi).toLocaleString('en-US')} sq ft; entered the upper end.${note ? ' ' + note : ''}`;
  out.push({ field: 'size', value: String(Math.round(v)), quote: m[0], conf, msg: s.msg, idx: s.idx, approx: !!m[1] || hi !== null, note, conditional: condBefore(t, m.index!), revision: REVISION.test(t) });
}

function extractType(s: Sentence, out: Cand[]) {
  const t = s.text;
  const rules: [RegExp, string, Cand['conf']][] = [
    [/\bprivate offices?\b|\benclosed offices?\b|\bdedicated offices?\b|\bindividual offices?\b|\bclosed offices?\b|\boffices? with (?:a )?doors?\b/i, 'Private Office', 'stated'],
    [/\boffice suites?\b|\bwhole floor\b|\bfull floor\b|\bentire floor\b|\bturn-?key (?:office|space)\b|\b(?:managed|serviced) offices?\b|\bsuite\b/i, 'Office Suite', 'stated'],
    [/\bteam offices?\b|\bteam space\b|\bteam suite\b|\bdedicated team space\b|\bteam pod\b/i, 'Team Office', 'stated'],
    [/\bco-?working\b|\bshared (?:work)?space\b|\bhot[- ]?desk(?:s|ing)?\b|\bflex(?:ible)? (?:desks?|workspace)\b|\bdesk (?:membership|pass)/i, 'Coworking', 'stated'],
    [/\bdedicated desks?\b/i, 'Coworking', 'inferred'],
  ];
  for (const [re, label, conf] of rules) {
    const m = t.match(re);
    if (m) out.push({ field: 'workspaceType', value: label, quote: m[0], conf, msg: s.msg, idx: s.idx, conditional: condBefore(t, m.index!), revision: REVISION.test(t), note: conf === 'inferred' ? `Read “${m[0]}” as Coworking.` : undefined });
  }
}

const COUNT_ITEM = `(${NUM})\\s+(?:(?:private|small|large|additional|extra|bookable|enclosed|dedicated|big)\\s+)?`;
function extractProgramAndAmenities(s: Sentence, out: Cand[]) {
  const t = s.text;
  const prog: [RegExp, string, boolean][] = [
    [/private offices?|enclosed offices?|individual offices?/i, 'private offices', true],
    [/open (?:workstations|plan|floor|desks?|seating)|bench(?:ing)? (?:desks|seating)|workstations/i, 'open workstations', false],
    [/meeting rooms?/i, 'meeting rooms', true], [/conference rooms?|boardrooms?/i, 'conference rooms', true], [/huddle rooms?/i, 'huddle rooms', true],
    [/team rooms?/i, 'team rooms', true], [/training rooms?|classrooms?/i, 'training rooms', true], [/event space|town hall|all-hands space/i, 'event space', false],
    [/collaboration (?:space|area)s?|breakout (?:space|area|room)s?/i, 'collaboration space', false], [/lounge|break ?room/i, 'lounge', false], [/focus rooms?|quiet rooms?/i, 'focus rooms', true],
    [/interview rooms?/i, 'interview rooms', true], [/lab\b|workshop space/i, 'lab space', false], [/storage (?:room|space|cage)/i, 'storage', false],
  ];
  const amen: [RegExp, string][] = [
    [/phone booths?|call booths?|phone rooms?/i, 'phone booths'], [/reception|front desk|receptionist/i, 'reception'], [/badge|key ?card|secure access|controlled access/i, 'secure badge access'],
    [/24\/7|24-7|24 hours|after[- ]hours access|round[- ]the[- ]clock/i, '24/7 access'], [/parking|garage/i, 'parking'], [/kitchen|pantry|caf[eé]\b/i, 'kitchen/pantry'],
    [/bike (?:storage|room|rack)s?/i, 'bike storage'], [/\bshowers?\b/i, 'showers'], [/printing|printers?/i, 'printing'], [/(?:high[- ]speed|fast|gigabit|dedicated) (?:internet|wifi|wi-fi|connectivity)|fiber/i, 'high-speed internet'],
    [/\ba\/v\b|video ?conferencing|conference room (?:tech|av)/i, 'AV / video conferencing'], [/natural light|lots of light|bright space/i, 'natural light'], [/pet[- ]friendly|dog[- ]friendly/i, 'pet friendly'], [/\bada\b|accessib|wheelchair|step-free/i, 'accessibility'],
    [/(?:near|close to|walkable to|steps from|next to)\s+(?:public\s+)?(?:transit|subway|metro|train|station|bus)|transit access|public transport/i, 'transit access'], [/mail (?:room|handling|service)|package (?:handling|room|reception)/i, 'mail and package handling'],
    [/lockers?|storage lockers?/i, 'lockers'], [/on-?site security|security desk|\b24\/7 security\b/i, 'on-site security'], [/gym|fitness/i, 'fitness'], [/wellness room|lactation|mothers'? room/i, 'wellness room'],
  ];
  for (const [re, label, counted] of prog) {
    if (!re.test(t)) continue;
    let value = label;
    if (counted) {
      const m = t.match(new RegExp(`${COUNT_ITEM}(?:${re.source})`, 'i'));
      const couple = t.match(new RegExp(`\\ba couple of\\s+(?:\\w+\\s+)?(?:${re.source})`, 'i'));
      const trailing = t.match(new RegExp(`(?:${re.source})[^.()]{0,32}\\(\\s*(?:about\\s+|around\\s+)?(${NUM})\\b`, 'i'));
      if (m) { const n = toNum(m[1]); if (Number.isFinite(n) && n > 0 && n < 500) value = `${n} ${label}`; }
      else if (couple) value = `2 ${label}`;
      else if (trailing) { const n = toNum(trailing[1]); if (Number.isFinite(n) && n > 0 && n < 500) value = `${n} ${label}`; }
    }
    out.push({ field: 'programNeeds', value, quote: label, conf: 'stated', msg: s.msg, idx: s.idx, conditional: condBefore(t, t.search(re)) });
  }
  for (const [re, label] of amen) if (re.test(t)) out.push({ field: 'amenityNeeds', value: label, quote: label, conf: 'stated', msg: s.msg, idx: s.idx, conditional: condBefore(t, t.search(re)) });
}

function extractConfiguration(s: Sentence, out: Cand[]) {
  const t = s.text;
  const multi = t.match(/\b(multiple|several|a few|a couple of|two|three|four|five|various|different|numerous)\s+(?:small\s+|separate\s+|satellite\s+|smaller\s+)?(locations?|spaces?|offices?|buildings?|floors?|sites?|neighborhoods)\b|\bhub[- ]and[- ]spoke\b|\bsatellite offices?\b|\bdistributed\b|\bacross (?:the city|several|multiple|a few)\b/i);
  const single = t.match(/\b(?:one|a single|single|1)\b[^.]{0,30}\b(?:office|space|location|floor|suite|building|site)\b/i);
  if (multi && !single) out.push({ field: 'configuration', value: 'Collection of spaces', quote: multi[0], conf: 'stated', msg: s.msg, idx: s.idx });
  else if (single && !multi) out.push({ field: 'configuration', value: 'Single space', quote: single[0], conf: 'stated', msg: s.msg, idx: s.idx });
}

const START_CUE = /\b(start(?:ing)?|begin(?:ning)?|move[- ]?in|moving in|move in|occupy|occupancy|open(?:ing)?|go(?:ing)? live|ready by|available|commence|kick ?off|need (?:it|the space|space|to be in|to be there)|be in by|in by|get in|take possession|possession|lease (?:start|commencement)|target(?:ing)? (?:date )?of|want (?:it|to start)|looking to (?:start|move))\b/i;
const CLOSE_CUE = /\b(sign(?:ed|ing)?|close|closing|decide|decision|finali[sz]e|commit(?:ment)?|approval|approve|execute|execution|loi|lease signed|wrap up|get this done|board)\b/i;
const EXPIRY_CUE = /\b(lease|license|contract|agreement|term|membership)\b[^.]{0,50}\b(ends?|expires?|up|runs? out|terminates?|is up|renews?|renewal)\b|\bexpir|\bup for renewal\b|\bour (?:current )?(?:lease|license) (?:is|ends)/i;
function extractDates(s: Sentence, out: Cand[], ctx: Ctx) {
  const dates = findDates(s.text, ctx.today);
  if (!dates.length) return;
  dates.forEach((h) => {
    const before = s.text.slice(Math.max(0, h.start - 70), h.start);
    const sentBefore = s.text.slice(0, h.start);
    const clauseBefore = before.split(/[,;]/).pop() ?? before;
    const target = /\b(target(?:ing)?|ideally|hope|hoping|aim(?:ing)?|looking to|would like|want to|we'?d like|i'?d like|like to|we'?d love|prefer|roughly|around|approximately|tentative|goal|planning|expect|anticipate|tbd|something like|probably|maybe|aiming)\b/i.test(clauseBefore);
    const firm = /\b(must|hard deadline|no later than|firm|lease (?:is )?up|have to|need to be in by)\b/i.test(before + ' ' + s.text);
    const role = (() => {
      if (EXPIRY_CUE.test(sentBefore) && !START_CUE.test(before.slice(-36))) return 'expiry';
      if (CLOSE_CUE.test(before.slice(-48)) && !START_CUE.test(before.slice(-30))) return 'close';
      if (START_CUE.test(before.slice(-60)) || START_CUE.test(s.text.slice(h.end, h.end + 24))) return 'start';
      if (/\b(?:by|on|from|for)\s*$/i.test(before) && START_CUE.test(s.text)) return 'start';
      if (/\b(?:from|starting|beginning|as of|effective)\s*$/i.test(before) && !EXPIRY_CUE.test(s.text)) return 'start';
      if (/\b(?:want|need|like|hope|looking|aim)\b[^.]{0,30}\bby\s*$/i.test(before) && !CLOSE_CUE.test(before)) return 'start';
      if (/\b(?:by|before)\s*$/i.test(before) && CLOSE_CUE.test(s.text)) return 'close';
      if (ctx.answerMode && !CLOSE_CUE.test(s.text) && !EXPIRY_CUE.test(s.text)) return 'start';
      return 'unknown';
    })();
    if (role === 'unknown') return;
    const field: PField = role === 'close' ? 'closeDate' : role === 'expiry' ? 'otherCommercial' : 'startDate';
    const inferred = h.inferred;
    out.push({
      field, value: role === 'expiry' ? `Current ${/license/i.test(s.text) ? 'license' : 'lease'} ends ${fmtDate(h.iso)}.` : h.iso, quote: h.text,
      conf: inferred ? 'inferred' : 'stated', msg: s.msg, idx: s.idx, target: target && !firm, conditional: condBefore(s.text, h.start), revision: REVISION.test(s.text),
      note: [h.why, target && !firm && field === 'startDate' ? 'Stated as a target, not a confirmed date.' : '', role === 'expiry' ? 'Context only; not used as the start date.' : ''].filter(Boolean).join(' ') || undefined,
      role, weak: role === 'close' && /\b(approv|board|decision|decide)/i.test(before.slice(-48)) && !/\b(sign|clos|execut|commit)/i.test(before.slice(-48)),
    });
  });
}

// location
const CITY_RES = [...CITY_LIST, ...Object.keys(CITY_ALIASES)].map((c) => ({ name: c, canon: CITY_ALIASES[c] || c, re: new RegExp(`(?<![\\w])${c.replace(/\./g, '\\.?').replace(/ /g, '\\s+')}(?![\\w])`, c.length <= 3 ? '' : 'i') }));
const TARGET_CUE = /\b(new|second|additional|expand(?:ing)? (?:to|into)|open(?:ing)?|relocat(?:e|ing) to|move (?:to|into)|moving (?:to|into)|looking (?:in|for|at)|need(?:s)? (?:space |an office |office space )?in|space in|office in|offices in|located in|be in|set up in|establish|launch(?:ing)?|hub in|presence in|space near|options in|spaces in|search in|focus(?:ed)? on|for (?:the )?\w+ team in|to)\b/i;
const CURRENT_LOC = /\b(current(?:ly)?|existing|present|our (?:hq|headquarters|home office|main office|current office|office)|based (?:in|out of)|headquartered|hq|we(?:'re| are) (?:in|at|located)|lease (?:in|at)|moving (?:out of)|relocat(?:e|ing) from|from our|out of our|our (?:\w+ )?office (?:in|at|is))\b/i;
const LOC_CUE = /\b(office|space|location|move|expand|open|looking|relocat|city|market|team|hub|headquarters|hq|presence|site|desks?|seats?|sourcing|options)\b/i;

interface CityMention { city: string; role: 'target' | 'current' | 'unknown'; state?: string; index: number; text: string }
export function cityMentions(sentence: string, loose = false): CityMention[] {
  const found: CityMention[] = [];
  const seen: [number, number][] = [];
  const hit = (s: number, e: number) => seen.some(([a, b]) => s < b && e > a);
  // longest names first so "New York" wins over "York"
  [...CITY_RES].sort((a, b) => b.name.length - a.name.length).forEach(({ canon, re }) => {
    const m = re.exec(sentence); if (!m) return;
    const s = m.index; const e = s + m[0].length;
    if (hit(s, e)) return;
    const before = sentence.slice(Math.max(0, s - 40), s);
    const sameWord = /\b(?:[A-Z][a-z]+)\s+$/.test(sentence.slice(0, s)) && !/\b(?:in|to|near|around|from|of|at|downtown|greater|the)\s+$/i.test(before);
    const nextWord = /^\s+[A-Z][a-z]+/.test(sentence.slice(e)) && !/^\s+(?:area|metro|office|market|and|or|team|,)/i.test(sentence.slice(e));
    const prep = /\b(?:in|to|near|around|from|of|at|downtown|greater|outside|within|serving)\s+(?:the\s+)?(?:downtown\s+|greater\s+|central\s+)?$/i.test(before);
    const label = /\b(?:location|city|market|where|office|area)s?\s*[:\-–]\s*$/i.test(before) || /^\s*(?:,\s*[A-Z]{2}\b|\s+(?:area|metro|office|market))/.test(sentence.slice(e));
    const lead = /^\s*(?:for|in|and|also|as for|now)?\s*$/i.test(sentence.slice(0, s));
    if (!(prep || label || lead || loose || LOC_CUE.test(sentence)) || ((sameWord || nextWord) && !prep && !label && !lead)) return;
    if (/^[a-z]/.test(m[0]) && m[0].length <= 3) return;
    if (/^\s+(?:contract|deal|project|clients?|customers?|accounts?|business|launch|rollout|conference|event|trip|pilot|win|opportunity|expansion deal)\b/i.test(sentence.slice(e)) && !prep) return;
    seen.push([s, e]);
    const state = sentence.slice(e).match(/^,\s*([A-Z]{2})\b/)?.[1];
    const win = sentence.slice(Math.max(0, s - 64), s);
    const curIdx = Math.max(win.search(/(?:current(?:ly)?|existing|based (?:in|out of)|headquartered|hq|from|we(?:'re| are) (?:in|at|located)|our (?:\w+ )?office (?:in|at|is))(?!.*(?:to|into|new|second|additional))[^.]*$/i), -1);
    const tgtM = [...win.matchAll(new RegExp(TARGET_CUE.source, 'gi'))].pop();
    const curM = [...win.matchAll(new RegExp(CURRENT_LOC.source, 'gi'))].pop();
    const role: CityMention['role'] = tgtM && (!curM || (tgtM.index ?? 0) >= (curM.index ?? 0)) && !/\bfrom\s*$/i.test(win) ? 'target' : curM || curIdx >= 0 || /\bfrom\s*$/i.test(win) ? 'current' : 'unknown';
    found.push({ city: canon, role, state, index: s, text: m[0] });
  });
  return found.sort((a, b) => a.index - b.index);
}

function extractArea(s: Sentence, out: Cand[]) {
  const t = s.text;
  const clean = (x: string) => x.replace(/,?\s+(?:because|since|as|so that|which|where)\b.*$/i, '').replace(/\s+(?:but|though|however|although|so)\b.*$/i, '').replace(/\s+and\s+(?:we|they|it|the|then)\b.*$/i, '').replace(/[.;]+$/, '').replace(/\s+or\s+/gi, ', ').replace(/\s+and\s+/gi, ', ').replace(/,\s*,/g, ',').trim();
  const req = t.match(/\b(?:must|need(?:s)? to|has to|have to|required to|got to|should)\s+be\s+(?:located\s+)?(?:in|near|within|close to|walking distance (?:of|to)|on|at)\s+([^.;]+)/i);
  const pref = t.match(/\b(?:ideally|preferably|prefer(?:red|s|ring)?|would (?:like|love|prefer)|we'?d (?:like|prefer|love)|hoping for|leaning (?:towards|toward)|looking (?:at|in))\s+(?:to be\s+|somewhere\s+)?(?:in|near|around|within|close to|by|on)\s+([^.;]+)/i)
    ?? t.match(/\b(?:[Ii]deally|[Pp]referably)[,:]?\s+((?:[A-Z][\w'’]+(?:\s+[A-Z][\w'’]+){0,2})(?:\s*,?\s*(?:or|and)\s+(?:near\s+)?[A-Z][\w'’]+(?:\s+[A-Z][\w'’]+){0,2})*)/);
  const within = t.match(/\bwithin\s+(?:about\s+|roughly\s+)?(\d+(?:\.\d+)?)\s*(miles?|mi|km|minutes?|min|blocks?)\s+(?:of|from)\s+([^.;,]+)/i);
  const near = t.match(/\b(?:near|close to|next to|steps from|walking distance (?:of|to)|around)\s+(?:the\s+)?([A-Z][\w'’]+(?:\s+[A-Z][\w'’]+){0,3})/);
  const inArea = t.match(/\bin\s+(?:the\s+)?([A-Z][\w'’]+(?:\s+[A-Z][\w'’]+){0,2})\s+(?:area|district|neighbou?rhood|submarket|corridor)\b/);
  const prefAfter = t.match(/\(?\b([A-Z][\w'’]+(?:\s[A-Z][\w'’]+){0,2})\s+(?:is |are )?(?:preferred|preferable)\b/);
  const downtown = t.match(/\b(downtown|midtown|cbd|city center|city centre|financial district|uptown)\b/i);
  const base = { field: 'otherFunctional' as PField, msg: s.msg, idx: s.idx, conditional: CONDITIONAL.test(t), conf: 'stated' as const };
  const isCity = (v: string) => CITY_RES.some((c) => c.name.toLowerCase() === v.replace(/[.,]+$/, '').trim().toLowerCase());
  if (req && isCity(clean(req[1]))) return;
  if (within) { const hard = !/\b(ideally|preferably|prefer|hoping|about)\b/i.test(t); out.push({ ...base, value: `${hard ? 'Required' : 'Preferred'} area: within ${within[1]} ${within[2]} of ${within[3].trim()}.`, quote: within[0], role: 'area' }); return; }
  if (req) { out.push({ ...base, value: `Required area: ${clean(req[1])}.`, quote: req[0], role: 'area' }); return; }
  if (pref) { const val = clean(pref[1]); if (val && !/^(?:a|an|the)?\s*(?:space|office|building|floor)\b/i.test(val)) { out.push({ ...base, value: `Preferred area: ${val}.`, quote: pref[0], role: 'area' }); return; } }
  if (inArea) { out.push({ ...base, value: `Preferred area: ${inArea[1].trim()} area.`, quote: inArea[0], role: 'area' }); return; }
  if (near && !CITY_RES.some((c) => c.re.test(near[1])) && !/^(?:The|Our|We)\b/.test(near[1]) && !NOT_CITY.has(near[1].split(' ')[0])) { out.push({ ...base, value: `Preferred area: near ${near[1].trim()}.`, quote: near[0], role: 'area' }); return; }
  if (prefAfter && !CITY_RES.some((c) => c.name.toLowerCase() === prefAfter[1].toLowerCase()) && !NOT_CITY.has(prefAfter[1])) { out.push({ ...base, value: `Preferred area: ${prefAfter[1].trim()}.`, quote: prefAfter[0], role: 'area' }); return; }
  if (downtown && LOC_CUE.test(t)) out.push({ ...base, value: `Preferred area: ${cap1(downtown[1].toLowerCase())}.`, quote: downtown[0], role: 'area' });
}

// ───────────────────────────── context + company ─────────────────────────────
interface Ctx { today: string; answerMode: boolean; capacityHint?: number; noCue?: boolean }

function extractCompany(messages: Message[]): { value: string; note: string; conf: 'stated' | 'inferred' } | null {
  const bad = (v: string) => !v || NOT_CITY.has(v) || CITY_RES.some((c) => c.re.test(v) && c.name.toLowerCase() === v.toLowerCase()) || GENERIC_TEAMS.has(v.toLowerCase()) || /^(?:I|We|You|He|She|They)$/i.test(v);
  const NAME = "([A-Z][\\w&.'’-]+(?:\\s+(?:&\\s+)?[A-Z][\\w&.'’-]+){0,3})";
  const all = messages.map((m) => m.body).join('\n');
  const ordered = [...messages];
  const tryRes: [RegExp, string][] = [
    [new RegExp(`\\b(?:I(?:'m| am)|we(?:'re| are)|I work|we work)\\s+(?:work(?:ing)?\\s+)?(?:at|for|with|from|part of)\\s+${NAME}`), 'stated in the text'],
    [new RegExp(`\\b(?:on behalf of|representing|(?:my|our) (?:client|customer)(?: is| are)?|client(?: is)?|for our client)\\s+${NAME}`), 'stated in the text'],
    [new RegExp(`\\b(?:here at|from)\\s+${NAME}\\s+(?:we|our|and|,)`), 'stated in the text'],
    [new RegExp(`\\b(?:the|our)\\s+${NAME}\\s+(?:team|office|group|company|offices)\\b`), 'stated in the text'],
    [new RegExp(`${NAME}(?:'s|’s)\\s+(?:team|office|headquarters|new office|growth)\\b`), 'stated in the text'],
    [new RegExp(`(?:^|[.!?,]\\s+|\\n)${NAME}\\s+(?:needs|is looking|are looking|wants|is opening|is expanding|is growing|is planning|plans to|would like|is hiring|is relocating|is moving)\\b`), 'stated in the text'],
  ];
  for (const [re, why] of tryRes) {
    const m = all.match(re);
    if (m) { const v = m[1].replace(/\s+(?:is|are|has|have|will|and|team|office)$/i, '').trim(); if (!bad(v) && !bad(v.split(' ')[0])) return { value: v, note: `“${m[0].trim()}” (${why})`, conf: 'stated' }; }
  }
  // signature block
  for (const msg of ordered) {
    const lines = msg.signature.split('\n').map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    const titleRe = /\b(vp|vice president|director|manager|head|lead|chief|officer|president|coordinator|partner|associate|analyst|assistant|founder|ceo|cfo|coo|cro|evp|svp|principal|specialist|executive|administrator|controller|strategist|broker)\b/i;
    const contact = /@|https?:\/\/|www\.|\+?\d[\d\s().-]{6,}|^[a-z]\s*:/i;
    const suffix = /\b(inc|llc|ltd|corp|corporation|group|partners|capital|llp|plc|gmbh|co|company|holdings|labs|studios?|technologies|systems|solutions|consulting|advisors|bank|financial)\b\.?$/i;
    let idx = lines.findIndex((l) => titleRe.test(l) && !contact.test(l));
    const start = idx >= 0 ? idx + 1 : 1;
    const cands = lines.slice(start).filter((l) => !contact.test(l) && !/\d{3,}/.test(l) && l.length < 50 && /^[A-Z]/.test(l) && !/^(?:www|tel|mobile|office|direct)\b/i.test(l));
    const co = cands.find((l) => suffix.test(l)) ?? cands[0] ?? (idx < 0 && lines.length === 1 && /^[A-Z]/.test(lines[0]) && !/^[A-Z][a-z]+(?:\s[A-Z][a-z]+)?$/.test(lines[0]) ? lines[0] : undefined);
    if (co && !bad(co) && !titleRe.test(co)) return { value: co.replace(/[|,;].*$/, '').trim(), note: `Signature block: “${co}”`, conf: 'stated' };
    // "Name\nCompany" with no title
    if (lines.length === 2 && /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)+$/.test(lines[0]) && !contact.test(lines[1]) && /^[A-Z]/.test(lines[1]) && !bad(lines[1])) return { value: lines[1], note: `Signature block: “${lines[1]}”`, conf: 'stated' };
  }
  const emails = [...(all + '\n' + messages.map((m) => m.signature + '\n' + m.header).join('\n')).matchAll(/[\w.+-]+@([\w-]+)\.[\w.-]+/g)].map((m) => m[1].toLowerCase()).filter((d) => !FREE_MAIL.has(d));
  if (emails.length) { const d = emails[0]; return { value: d.split('-').map(cap1).join(' '), note: `Inferred from an email address at ${d}`, conf: 'inferred' }; }
  return null;
}

// ───────────────────────────── resolution ─────────────────────────────
const toPlain = (field: PField, v: string) => (field === 'startDate' || field === 'closeDate' ? fmtDate(v) : v);
const FIELD_NAME: Record<PField, string> = { company: 'Company', name: 'Name', location: 'Location', workspaceType: 'Workspace type', capacity: 'Headcount', size: 'Size', programNeeds: 'Program needs', amenityNeeds: 'Amenities', configuration: 'Configuration', otherFunctional: 'Other requirements', startDate: 'Start date', termLength: 'Term', closeDate: 'Close date', budget: 'Budget', otherCommercial: 'Commercial terms' };

function resolveScope(cands: Cand[], ctx: Ctx, extraNotes: string[]): ParsedScope {
  const sc: ParsedScope = { fields: {}, prov: {}, approx: {}, target: {}, tentative: {}, ambiguities: [], notes: [...extraNotes] };
  const by = (f: PField) => cands.filter((c) => c.field === f);
  const setF = (f: PField, v: string, p: ParsedProv) => { sc.fields[f] = v; sc.prov[f] = p; };
  const quoteNote = (c: Cand, extra?: string) => (c.conf === 'inferred' && c.note ? [c.note, extra] : [`“${c.quote.trim()}”`, c.note, extra]).filter(Boolean).join(' ');
  const kindOf = (c: Cand): 'source' | 'suggested' => (c.conf === 'inferred' ? 'suggested' : 'source');

  // single-valued fields
  (['capacity', 'size', 'budget', 'termLength', 'startDate', 'closeDate', 'workspaceType', 'configuration'] as PField[]).forEach((f) => {
    let cs = by(f).filter((c) => c.value !== '' && c.role !== 'expiry');
    const condOnly = cs.filter((c) => c.conditional);
    cs = cs.filter((c) => !c.conditional);
    if (condOnly.length) sc.ambiguities.push({ field: f, text: `${FIELD_NAME[f]}: “${condOnly[0].quote.trim()}” depends on a condition (${condOnly[0].value}), so I left it out of the requirement.` });
    if (f !== 'capacity' && cs.some((c) => !c.weak) && cs.some((c) => c.weak)) cs = cs.filter((c) => !c.weak);
    if (f === 'capacity') {
      const strong = cs.filter((c) => !c.weak);
      if (strong.length) cs = strong;
      else if (cs.length) { sc.notes.push(`Current headcount: ${cs[0].value}.`); cs = cs.map((c) => ({ ...c, conf: 'inferred' as const, note: 'Only the current headcount was mentioned; confirm the number needed.' })); }
    }
    if (!cs.length) return;
    // newest message wins; within a message, distinguish revision from conflict
    const newest = Math.min(...cs.map((c) => c.msg)); // msg 0 is the top (newest) message
    const olderCs = cs.filter((c) => c.msg > newest);
    let top = cs.filter((c) => c.msg === newest);
    // growth beats plain/current for capacity when they differ
    if (f === 'capacity' && top.some((c) => c.role === 'growth') && top.some((c) => c.role !== 'growth')) {
      const g = top.find((c) => c.role === 'growth')!; const others = top.filter((c) => c.role !== 'growth');
      sc.notes.push(`Headcount: ${others.map((o) => o.value).join(', ')} now, planning for ${g.value}.`); top = [g];
    }
    const vals = unique(top.map((c) => c.value));
    let chosen: Cand;
    if (vals.length > 1) {
      const rev = top.filter((c) => c.revision);
      if (rev.length) { chosen = rev[rev.length - 1]; sc.notes.push(`${FIELD_NAME[f]}: the text first said ${toPlain(f, top.find((c) => c !== chosen && c.value !== chosen.value)!.value)}, then revised it to ${toPlain(f, chosen.value)}.`); }
      else if (f === 'workspaceType') { chosen = top[0]; sc.notes.push(`Other workspace types mentioned: ${joinList(vals.filter((v) => v !== chosen.value))}.`); }
      else {
        sc.ambiguities.push({ field: f, text: `${FIELD_NAME[f]}: the text gives ${joinList(vals.map((v) => toPlain(f, v)))}. I left it blank until you choose.` });
        return;
      }
    } else chosen = top[0];
    // an older message with a different value: record continuity
    const older = olderCs.find((c) => c.value !== chosen.value);
    if (older) {
      if (chosen.target || chosen.approx || chosen.conditional) sc.ambiguities.push({ field: f, text: `${FIELD_NAME[f]}: an earlier message said ${toPlain(f, older.value)}; the latest is less certain (${toPlain(f, chosen.value)}).` });
      else sc.notes.push(`${FIELD_NAME[f]}: an earlier message said ${toPlain(f, older.value)}; I used the latest, ${toPlain(f, chosen.value)}.`);
    }
    if (f === 'budget' && chosen.role === 'ceiling') sc.target.budget = false;
    const extra = f === 'budget' ? (chosen.role === 'ceiling' ? 'Stated as a ceiling.' : chosen.target ? 'Stated as a target, not a hard limit.' : '') : '';
    setF(f, chosen.value, { kind: kindOf(chosen), note: quoteNote(chosen, extra) });
    if (chosen.approx) sc.approx[f] = true;
    if (chosen.tentative) { sc.tentative[f] = true; sc.approx[f] = true; }
    if (chosen.target) sc.target[f] = true;
    if (f === 'budget' && chosen.role === 'ceiling') sc.fields.otherCommercial = unique([...(sc.fields.otherCommercial ? [sc.fields.otherCommercial] : []), 'Budget is stated as a firm ceiling.']).join(' ');
  });

  // budget notes that did not become a value
  by('budget').filter((c) => c.value === '' && c.note).forEach((c) => {
    if (c.role === 'commercial-note' || c.role === 'per-seat' || c.role === 'foreign-currency') sc.fields.otherCommercial = unique([...(sc.fields.otherCommercial ? [sc.fields.otherCommercial] : []), c.note!]).join(' ');
    if (c.role === 'no-period' || c.role === 'per-seat' || c.role === 'foreign-currency') sc.ambiguities.push({ field: 'budget', text: c.note! });
  });
  // expiry notes
  by('otherCommercial').filter((c) => c.role === 'expiry').forEach((c) => {
    sc.fields.otherCommercial = unique([...(sc.fields.otherCommercial ? [sc.fields.otherCommercial] : []), c.value]).join(' ');
  });

  // list fields: union
  (['programNeeds', 'amenityNeeds'] as PField[]).forEach((f) => {
    const vals = unique(by(f).filter((c) => !c.conditional).map((c) => c.value));
    // a counted item supersedes the bare item
    const final = vals.filter((v) => !vals.some((w) => w !== v && /^\d+ /.test(w) && w.endsWith(v)));
    if (final.length) setF(f, cap1(joinList(final)) + '.', { kind: 'source', note: `Mentioned in the text: ${final.join(', ')}.` });
    const cond = by(f).filter((c) => c.conditional);
    if (cond.length) sc.ambiguities.push({ field: f, text: `${FIELD_NAME[f]}: ${unique(cond.map((c) => c.value)).join(', ')} only if a condition in the text is met, so not included.` });
  });

  // area
  const areas = by('otherFunctional').filter((c) => c.role === 'area' && !c.conditional);
  if (areas.length) {
    const newest = Math.min(...areas.map((c) => c.msg));
    const top = areas.filter((c) => c.msg === newest);
    const req = top.filter((c) => /^Required/.test(c.value)); const pre = top.filter((c) => !/^Required/.test(c.value));
    const chosen = [...req, ...pre].slice(0, 2);
    const merged = unique(chosen.map((c) => c.value)).join(' ');
    setF('otherFunctional', merged, { kind: 'source', note: chosen.map((c) => `“${c.quote.trim()}”`).join('; ') + (req.length ? '' : ' Stated as a preference, not a restriction.') });
  }
  return sc;
}

// ───────────────────────────── leftovers ─────────────────────────────
const NEED_CUE = /\b(need(?:s)?|require[sd]?|must|want(?:s)?|should|prefer(?:s|red)?|ideally|important|critical|essential|looking for|would like|can'?t|cannot|no later|avoid|walkable|accessible|quiet|natural light|dog|pet|security|secure|visitors?|clients? (?:will|visit|come)|customers? (?:will|visit|come))\b/i;
const COMMERCIAL_CUE = /\b(lease|rent|deposit|sublease|sublet|incentive|free rent|concession|tenant improvement|expansion|renewal|option(?:s)?\b|flexib(?:le|ility)|contraction|all[- ]in|nnn|cam\b|insurance|break clause|notice|escalat|pricing|cost|invoice|payment|terms?\b|commitment|contract|no long-term|long-term|short-term|sign|approval|procurement|legal|vendor|msa|nda)\b/i;
const PLEASANTRY = /\b(thanks|thank you|let me know|looking forward|hope (?:you|this)|please (?:send|share|let)|can you (?:send|share)|could you|get back to me|call me|reach out|feel free|appreciate|best regards|happy to|touch base|catch up|speak soon|talk soon|follow(?:ing)? up)\b/i;

// ───────────────────────────── entry ─────────────────────────────
const isoToday = () => { const d = new Date(); return isoOf(d.getFullYear(), d.getMonth() + 1, d.getDate()); };

function validate(sc: ParsedScope, today: string): void {
  const drop = (f: PField, why: string) => { delete sc.fields[f]; delete sc.prov[f]; sc.ambiguities.push({ field: f, text: why }); };
  const int = (f: PField, lo: number, hi: number, label: string) => {
    const raw = sc.fields[f]; if (raw === undefined || raw === '') return;
    const n = Number(raw);
    if (!Number.isFinite(n) || !Number.isInteger(n) || n < lo || n > hi) drop(f, `${label} “${raw}” is outside the range I accept (${lo.toLocaleString('en-US')} to ${hi.toLocaleString('en-US')}), so I left it blank.`);
    else sc.fields[f] = String(n);
  };
  int('capacity', 1, 5000, 'Headcount'); int('size', 50, 2_000_000, 'Size'); int('budget', 100, 5_000_000, 'Budget'); int('termLength', 1, 240, 'Term');
  (['startDate', 'closeDate'] as PField[]).forEach((f) => {
    const v = sc.fields[f]; if (!v) return;
    const [y, m, d] = v.split('-').map(Number); const ty = Number(today.slice(0, 4));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || !validDay(y, m, d)) return drop(f, `${FIELD_NAME[f]} “${v}” is not a valid date, so I left it blank.`);
    if (y < ty - 1 || y > ty + 10) drop(f, `${FIELD_NAME[f]} ${fmtDate(v)} looks implausible, so I left it blank.`);
  });
  if (sc.fields.workspaceType && !(WORKSPACE_TYPES as readonly string[]).includes(sc.fields.workspaceType)) drop('workspaceType', `“${sc.fields.workspaceType}” is not a supported workspace type.`);
  if (sc.fields.configuration && !(CONFIGURATIONS as readonly string[]).includes(sc.fields.configuration)) drop('configuration', `“${sc.fields.configuration}” is not a supported configuration.`);
  if (sc.fields.startDate && sc.fields.closeDate && sc.fields.closeDate > sc.fields.startDate) {
    sc.ambiguities.push({ field: 'closeDate', text: `The expected close date (${fmtDate(sc.fields.closeDate)}) is after the start date (${fmtDate(sc.fields.startDate)}). Please check both.` });
  }
}

export function parseRequirement(raw: string, opts: ParseOptions = {}): ParsedResult {
  const today = opts.today ?? isoToday();
  const text = (raw ?? '').trim();
  const empty = (): ParsedResult => ({ scopes: [], usedMessages: 0, empty: true });
  if (!text || !/[A-Za-z0-9]{2,}/.test(text)) return empty();
  const wordCount = text.split(/\s+/).length;
  const answerMode = !!opts.answerMode || false;

  let messages = splitMessages(text);
  if (!messages.length) return empty();
  // A forward with only a short note on top: the forwarded message is the content.
  // (Messages are ordered newest first, as they appear in the paste.)
  const ctxBase: Ctx = { today, answerMode };

  // Sentences, tagged by message (0 = newest).
  const sentences: Sentence[] = [];
  messages.forEach((m, mi) => sentences.push(...splitSentences(m.body, mi, sentences.length)));
  if (!sentences.length) return empty();

  // Which cities does the text ask for?
  const perSentence = sentences.map((s) => ({ s, cities: cityMentions(s.text, answerMode || wordCount <= 40) }));
  const targets: string[] = [];
  const currents: string[] = [];
  const condTargets: string[] = [];
  perSentence.forEach(({ s, cities }) => cities.forEach((c) => {
    if (c.role === 'current') { if (!currents.includes(c.city)) currents.push(c.city); }
    else if (CONDITIONAL.test(s.text)) { if (!condTargets.includes(c.city)) condTargets.push(c.city); }
    else if (!targets.includes(c.city)) targets.push(c.city);
  }));
  if (!targets.length) condTargets.forEach((c) => targets.push(c));
  // A renewal or stay: the only city mentioned is where they are, and that is where the requirement is.
  let renewal = false;
  if (!targets.length && currents.length === 1 && /\b(renew|renewal|extend|extension|stay|remain|keep (?:the|our)|re-?sign|re-?up)\b/i.test(text)) { targets.push(currents[0]); renewal = true; }
  const targetCities = targets.filter((c) => renewal || !(currents.includes(c) && !perSentence.some(({ cities }) => cities.some((x) => x.city === c && x.role === 'target'))));
  const multi = targetCities.length > 1;

  const company = extractCompany(messages);

  const buildScope = (city: string, sents: Sentence[], shared: Sentence[]): ParsedScope => {
    const all = [...shared, ...sents];
    const ctx: Ctx = { ...ctxBase };
    // headcount first, so per-person budgets can use it
    const capProbe: Cand[] = []; all.forEach((s) => extractCapacity(s, capProbe));
    const strong = capProbe.filter((c) => !c.weak && !c.conditional);
    if (strong.length) ctx.capacityHint = Number(strong[strong.length - 1].value);
    const cands: Cand[] = [];
    const used = new Set<number>();
    all.forEach((s) => {
      const before = cands.length;
      extractCapacity(s, cands); extractBudget(s, cands, ctx); extractTerm(s, cands, ctx); extractSize(s, cands); extractType(s, cands);
      extractProgramAndAmenities(s, cands); extractConfiguration(s, cands); extractDates(s, cands, ctx); extractArea(s, cands);
      for (let i = before; i < cands.length; i++) { const at = s.text.indexOf(cands[i].quote.trim()); const win = at >= 0 ? s.text.slice(Math.max(0, at - 28), at + cands[i].quote.trim().length) : ''; cands[i].tentative = TENT.test(win); if (SOFT.test(win) && ['capacity', 'size', 'budget', 'termLength', 'startDate'].includes(cands[i].field)) cands[i].approx = true; }
      if (cands.length > before || cityMentions(s.text).some((c) => c.role !== 'current')) used.add(s.idx);
    });
    const notes: string[] = [];
    if (currents.length) notes.push(`They are currently in ${joinList(currents)}; that is not treated as the new location.`);
    const sc = resolveScope(cands, ctx, notes);

    // hybrid / desks distinction
    const hybrid = all.find((s) => /\b(hybrid|work from home|remote(?:ly)?|in the office (?:\w+ )?(?:days?|times?)|days? (?:a|per) week|at any (?:given )?time|hot[- ]desk|not everyone|rotat)/i.test(s.text) && !/\b(coworking|co-working)\b/i.test(s.text));
    if (hybrid && sc.fields.capacity && sc.prov.capacity && !/desks?|seats?|workstations/i.test(sc.prov.capacity.note)) {
      sc.prov.capacity = { kind: 'suggested', note: 'A hybrid schedule is mentioned, so the seats needed may be fewer than this headcount.' };
    }

    // location
    const lc = city || '';
    if (lc) {
      const mention = perSentence.flatMap(({ cities }) => cities).find((c) => c.city === lc && c.role !== 'current');
      sc.fields.location = lc; sc.prov.location = { kind: 'source', note: `Mentioned as “${mention?.text ?? lc}”${mention?.state ? `, ${mention.state}` : ''}` };
    }

    // leftovers: functional / commercial context that no field absorbed
    const fn: string[] = []; const co: string[] = [];
    all.forEach((s) => {
      if (used.has(s.idx)) return;
      const t = s.text;
      if (t.length < 25 || t.length > 260 || /\?\s*$/.test(t) || PLEASANTRY.test(t) || BACKGROUND.test(t) || !NEED_CUE.test(t) || GREETING.test(t)) return;
      if (cityMentions(t).some((c) => c.role === 'current') && !FUTURE_CUE.test(t)) return;
      if (COMMERCIAL_CUE.test(t)) co.push(t.replace(/\s+/g, ' ')); else fn.push(t.replace(/\s+/g, ' '));
    });
    if (fn.length) {
      const extra = fn.slice(0, 3).join(' ');
      sc.fields.otherFunctional = [sc.fields.otherFunctional, extra].filter(Boolean).join(' ');
      sc.prov.otherFunctional = { kind: 'source', note: `${sc.prov.otherFunctional?.note ? sc.prov.otherFunctional.note + ' ' : ''}Other requirements kept from the text as written.`.trim() };
    }
    if (co.length) {
      const extra = co.slice(0, 3).join(' ');
      sc.fields.otherCommercial = [sc.fields.otherCommercial, extra].filter(Boolean).join(' ');
      sc.prov.otherCommercial = { kind: 'source', note: 'Commercial points kept from the text as written.' };
    }
    if (sc.fields.otherCommercial && !sc.prov.otherCommercial) sc.prov.otherCommercial = { kind: 'source', note: 'Mentioned in the text.' };

    if (company) { sc.fields.company = company.value; sc.prov.company = { kind: company.conf === 'inferred' ? 'suggested' : 'source', note: company.note }; }
    validate(sc, today);
    return sc;
  };

  const scopes: ParsedResult['scopes'] = [];
  if (multi) {
    const seg: Record<string, Sentence[]> = {}; targetCities.forEach((c) => (seg[c] = []));
    const shared: Sentence[] = [];
    let cur: string | null = null; let curMsg = -1;
    perSentence.forEach(({ s, cities }) => {
      if (s.msg !== curMsg) { cur = null; curMsg = s.msg; }
      const hits = unique(cities.filter((c) => c.role !== 'current' && targetCities.includes(c.city)).map((c) => c.city));
      const general = /^\s*(?:all|both|each|across|overall|in both|for all|everywhere|for both|in all)\b|\b(?:both|all of them|each of them|every (?:location|office|market)|all (?:locations|offices|markets|three|four))\b/i.test(s.text);
      if (general) shared.push(s);
      else if (hits.length === 1) { cur = hits[0]; seg[cur].push(s); }
      else if (hits.length > 1) shared.push(s);
      else if (cur) seg[cur].push(s);
      else shared.push(s);
    });
    targetCities.forEach((c) => scopes.push({ label: c, city: c, data: buildScope(c, seg[c], shared) }));
  } else {
    scopes.push({ label: targetCities[0] ?? 'Requirement', city: targetCities[0] ?? '', data: buildScope(targetCities[0] ?? '', sentences, []) });
  }
  void wordCount; messages = messages;
  return { scopes, usedMessages: messages.length, empty: false };
}
