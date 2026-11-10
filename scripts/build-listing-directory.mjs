// Builds components/data/listingDirectory.json from a Pulse export (see scripts/pulse-listings.sql).
// Usage: node scripts/build-listing-directory.mjs [path/to/pulse-listings.csv]
// Each row becomes [path, venue, title, type, desks, rate, lat, lng, modified, booking, minTerm], grouped by city.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.resolve(process.argv[2] ?? path.join(root, 'pulse-listings.csv'));
const out = path.join(root, 'components/data/listingDirectory.json');

/** RFC 4180 CSV: quoted fields, doubled quotes, commas and newlines inside quotes. */
function parseCsv(text) {
  const rows = []; let row = []; let f = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(f); f = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; }
    else f += ch;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  return rows.filter((r) => r.some((x) => x !== ''));
}

const [head, ...body] = parseCsv(readFileSync(src, 'utf8').replace(/^﻿/, ''));
const col = Object.fromEntries(head.map((h, i) => [h.trim().toLowerCase(), i]));
for (const need of ['city', 'url', 'venue', 'title', 'type', 'desks', 'rate', 'lat', 'lng', 'modified', 'booking', 'min_term']) {
  if (!(need in col)) throw new Error(`pulse-listings.csv is missing the "${need}" column. Columns found: ${head.join(', ')}`);
}
const num = (v) => (v === '' || v == null || Number.isNaN(+v) ? null : +v);
const PREFIX = 'https://liquidspace.com/';
const dir = {};
let n = 0;
for (const r of body) {
  const url = r[col.url].trim();
  if (!url.toLowerCase().startsWith(PREFIX)) continue;
  const city = r[col.city].trim().toLowerCase();
  (dir[city] ??= []).push([
    url.slice(PREFIX.length).replace(/\/+$/, ''),
    r[col.venue], r[col.title], r[col.type],
    num(r[col.desks]) ?? 0, num(r[col.rate]), num(r[col.lat]), num(r[col.lng]),
    r[col.modified], r[col.booking], r[col.min_term],
  ]);
  n++;
}
writeFileSync(out, JSON.stringify({ source: 'Pulse: Workspaces and Venues', exported: new Date().toISOString().slice(0, 10), cities: dir }));
console.log(`Wrote ${n} listings for ${Object.keys(dir).length} cities to ${path.relative(root, out)}`);
for (const [c, rows] of Object.entries(dir)) console.log(`  ${c}: ${rows.length}`);
