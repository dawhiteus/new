import React from 'react';
import type { Provenance } from './data/intakeAgent';

// One quiet vocabulary for what the Requirement Agent did to a field:
//   green dot  : stated in the customer's text (or answer)
//   blue dot   : taken from the license record
//   amber dot  : inferred or assumed, with the reason shown under the field so it can be confirmed
//   "Not provided" under the field : nothing was found
// Fields the agent did not touch carry no mark at all.
const COLOR: Record<Provenance['kind'], string> = { source: '#0F7B4F', license: '#0D619B', suggested: '#B45309' };
const WHAT: Record<Provenance['kind'], string> = { source: 'From the text', license: 'From the license', suggested: 'Inferred, please confirm' };

export function FieldMark({ prov }: { prov?: Provenance }) {
  if (!prov) return null;
  return (
    <span title={`${WHAT[prov.kind]}: ${prov.note}`} aria-label={WHAT[prov.kind]}
      style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: COLOR[prov.kind], marginLeft: 8, verticalAlign: 'middle', cursor: 'help' }} />
  );
}

/** Shown under a field only when the agent had to interpret or assume. */
export function InferredNote({ prov, field }: { prov?: Provenance; field?: string }) {
  if (!prov || prov.kind !== 'suggested') return null;
  return (
    <div style={{ fontSize: 12.5, color: '#92400E', marginTop: 5, lineHeight: 1.4, fontFamily: 'Inter, sans-serif' }}>
      {field === 'name' ? 'Suggested: ' : 'Inferred: '}{prov.note.replace(/\.$/, '')}.
    </div>
  );
}

export function MarkLegend({ prov }: { prov: Partial<Record<string, Provenance>> }) {
  const kinds = new Set(Object.values(prov).filter(Boolean).map((p) => p!.kind));
  if (!kinds.size) return null;
  const item = (k: Provenance['kind'], text: string) => kinds.has(k) ? (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: COLOR[k] }} />{text}</span>
  ) : null;
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12.5, color: '#6B7280', marginTop: 10 }}>
      {item('source', 'From your text')}{item('license', 'From the license')}{item('suggested', 'Inferred, please confirm')}
    </div>
  );
}
