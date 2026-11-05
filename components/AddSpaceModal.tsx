import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { X, Bot } from 'lucide-react';
import { listingByUrl, type AssessSpace } from './data/assessmentData';
import { assess, hasSpace, proposalSpace } from './data/assessmentAgent';
import type { MvpRequirement } from './data/mvpRequirements';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const INK = '#0F2A3D';
const LABEL: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 6 };
const INPUT: React.CSSProperties = { width: '100%', border: '1px solid #D1D5DB', borderRadius: 8, padding: '9px 12px', fontSize: 14, fontFamily: FONT, color: INK, background: '#fff', outline: 'none', boxSizing: 'border-box' };
const WORKSPACE_TYPES = ['Team Office', 'Private Office', 'Office Suite', 'Coworking Desk', 'Dedicated Desk'];
const iso = (d: Date) => d.toISOString().slice(0, 10);

interface Props {
  requirement: MvpRequirement | null;
  onClose: () => void;
  /** Called after the space is added, with a plain line for the timeline. */
  onAdded: (req: MvpRequirement, space: AssessSpace, text: string) => void;
  addSpace: (req: MvpRequirement, space: AssessSpace) => void;
}

export function AddSpaceModal({ requirement, onClose, onAdded, addSpace }: Props) {
  const [mode, setMode] = useState<'link' | 'proposal'>('link');
  const [url, setUrl] = useState('');
  const [msg, setMsg] = useState('');
  const [f, setF] = useState({ venue: '', title: '', type: '', desks: '', rate: '', miles: '', validUntil: iso(new Date(Date.now() + 30 * 864e5)), availableFrom: '' });

  useEffect(() => { setMode('link'); setUrl(''); setMsg(''); }, [requirement?.id]);

  const a = requirement ? assess(requirement) : null;
  if (!requirement || !requirement.collection || !a) return <Dialog open={false}><DialogContent className="hidden" /></Dialog>;
  const col = requirement.collection;
  const ready = a.state === 'ok';

  const finish = (sp: AssessSpace) => {
    addSpace(requirement, sp);
    onAdded(requirement, sp, `Added “${sp.title}” (${sp.venue}, ${sp.visibility === 'Private' ? 'private' : 'public'}) to ${col.name}.`);
    onClose();
  };
  const addLink = () => {
    const hit = listingByUrl(url);
    if (!hit) { setMsg("I can't find that listing."); return; }
    if (hasSpace(requirement, hit.space)) { setMsg('That space is already in this collection.'); return; }
    finish(hit.space);
  };
  const num = (v: string) => (v.trim() === '' || isNaN(+v) ? null : +v);
  const proposalOk = f.venue.trim() && f.title.trim() && f.type && num(f.desks) && num(f.rate) != null && num(f.miles) != null && f.availableFrom;
  const addProposal = () => {
    const p = proposalSpace(requirement, { venue: f.venue.trim(), title: f.title.trim(), type: f.type, desks: num(f.desks) as number, rate: num(f.rate) as number, miles: num(f.miles) as number, validUntil: f.validUntil, availableFrom: f.availableFrom });
    if (p) finish(p);
  };

  const field = (label: string, node: React.ReactNode, flex = 1) => <div style={{ flex }}><div style={LABEL}>{label}</div>{node}</div>;
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const linkBtn: React.CSSProperties = { background: 'none', border: 'none', padding: 0, color: BLUE, fontWeight: 600, fontFamily: FONT, fontSize: 13.5, cursor: 'pointer' };
  const primary = (on: boolean): React.CSSProperties => ({ background: BLUE, color: '#fff', border: 'none', borderRadius: 8, padding: '0 22px', height: 40, whiteSpace: 'nowrap', fontSize: 14, fontWeight: 600, fontFamily: FONT, cursor: on ? 'pointer' : 'default', opacity: on ? 1 : 0.5 });

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden [&>button]:hidden gap-0" style={{ borderRadius: 16, border: 'none', maxHeight: '92vh', boxShadow: '0 20px 60px rgba(0,0,0,.15)', background: '#fff', display: 'flex', flexDirection: 'column' }}>
        <DialogDescription className="sr-only">Add a space to this requirement's collection</DialogDescription>
        <div style={{ background: BLUE, padding: '20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <DialogTitle style={{ color: '#fff', fontSize: 24, fontWeight: 700, fontFamily: FONT }}>Add Space</DialogTitle>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '20px 24px 24px', overflowY: 'auto', flex: 1, minHeight: 0, fontFamily: FONT }}>
          <div style={{ border: '1px solid #E5E7EB', background: '#F9FAFB', borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={18} color="#059669" /></div>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: INK }}>Collection Assessment Agent</div>
            <div style={{ fontSize: 13, color: '#6B7280' }}>{requirement.name} · {col.name}</div>
          </div>

          {!ready && <div style={{ fontSize: 14, color: '#374151', marginTop: 16, lineHeight: 1.55 }}>This requirement has no location I can find, so spaces can't be added here yet.</div>}

          {ready && mode === 'link' && (
            <div style={{ marginTop: 18 }}>
              <div style={LABEL}>Listing link</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input style={{ ...INPUT, height: 40 }} placeholder="https://liquidspace.com/us/…" value={url} onChange={(e) => { setUrl(e.target.value); setMsg(''); }} onKeyDown={(e) => { if (e.key === 'Enter' && url.trim()) addLink(); }} />
                <button type="button" onClick={addLink} disabled={!url.trim()} style={primary(!!url.trim())}>Add</button>
              </div>
              {msg && <div style={{ fontSize: 13.5, color: '#374151', marginTop: 10 }}>{msg}</div>}
              <div style={{ marginTop: 14 }}><button type="button" onClick={() => { setMode('proposal'); setMsg(''); }} style={linkBtn}>Add a venue proposal instead</button></div>
            </div>
          )}

          {ready && mode === 'proposal' && (
            <div style={{ marginTop: 18, display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                {field('Venue', <input style={INPUT} value={f.venue} onChange={set('venue')} />)}
                {field('Space', <input style={INPUT} value={f.title} onChange={set('title')} />)}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {field('Workspace type', <select style={INPUT} value={f.type} onChange={set('type')}><option value="">Choose</option>{WORKSPACE_TYPES.map((t) => <option key={t}>{t}</option>)}</select>)}
                {field('Seats', <input style={INPUT} inputMode="numeric" value={f.desks} onChange={set('desks')} />)}
                {field('Price per month', <input style={INPUT} inputMode="numeric" value={f.rate} onChange={set('rate')} />)}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {field(`Miles from ${a.criteria.centerLabel}`, <input style={INPUT} inputMode="decimal" value={f.miles} onChange={set('miles')} />)}
                {field('Available from', <input style={INPUT} type="date" value={f.availableFrom} onChange={set('availableFrom')} />)}
                {field('Quote valid until', <input style={INPUT} type="date" value={f.validUntil} onChange={set('validUntil')} />)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button type="button" onClick={() => setMode('link')} style={linkBtn}>Use a listing link instead</button>
                <button type="button" onClick={addProposal} disabled={!proposalOk} style={primary(!!proposalOk)}>Add</button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
