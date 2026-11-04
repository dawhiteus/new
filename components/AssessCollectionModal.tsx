import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { X, Bot, ExternalLink } from 'lucide-react';
import { assess, ask, currentValues, newlyFit, type Answer, type ReqPatch, type SpaceResult, type Values } from './data/assessmentAgent';
import type { MvpRequirement } from './data/mvpRequirements';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const INK = '#0F2A3D';
const GREEN = '#0F7B4F';
const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

const label: React.CSSProperties = { fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: BLUE, fontFamily: FONT };
const field: React.CSSProperties = { width: '100%', height: 38, border: '1px solid #D1D5DB', borderRadius: 8, padding: '0 12px', fontSize: 14, fontFamily: FONT, color: INK, background: '#fff', outline: 'none' };
const primary: React.CSSProperties = { height: 38, padding: '0 18px', borderRadius: 10, border: 'none', background: BLUE, color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: FONT, cursor: 'pointer' };
const linkBtn: React.CSSProperties = { background: 'none', border: 'none', padding: 0, color: BLUE, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: FONT };

interface Props {
  requirement: MvpRequirement | null;
  onClose: () => void;
  /** Applying changes updates the Requirement; the Collection itself is never edited this way. */
  onApply: (req: MvpRequirement, patch: ReqPatch) => void;
  /** Adds spaces to the Collection only. */
  onAddSpaces: (req: MvpRequirement, urls: string[]) => void;
}

type Form = { location: string; type: string; capacity: string; budget: string; radiusMi: string };
const toForm = (v: Values): Form => ({ location: v.location, type: v.type, capacity: v.capacity != null ? String(v.capacity) : '', budget: v.budget != null ? String(v.budget) : '', radiusMi: String(v.radiusMi) });

export function AssessCollectionModal({ requirement, onClose, onApply, onAddSpaces }: Props) {
  const [form, setForm] = useState<Form>({ location: '', type: '', capacity: '', budget: '', radiusMi: '5' });
  const [showSpaces, setShowSpaces] = useState(false);
  const [chat, setChat] = useState<Answer[]>([]);
  const [text, setText] = useState('');
  const adjustRef = useRef<HTMLDivElement>(null);
  const chatEnd = useRef<HTMLDivElement>(null);

  const base = requirement ? currentValues(requirement) : null;
  const baseKey = base ? JSON.stringify(base) : '';
  useEffect(() => { if (base) setForm(toForm(base)); }, [requirement?.id, baseKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setChat([]); setText(''); setShowSpaces(false); }, [requirement?.id]);
  useEffect(() => { chatEnd.current?.scrollIntoView({ block: 'nearest' }); }, [chat.length]);

  const ov: Partial<Values> = useMemo(() => {
    const n = (s: string) => (s.trim() === '' ? null : Number(s.replace(/[$,]/g, '')));
    const radius = Number(form.radiusMi);
    return { location: form.location.trim(), type: form.type, capacity: n(form.capacity), budget: n(form.budget), radiusMi: Number.isFinite(radius) && radius > 0 ? radius : 5 };
  }, [form]);

  if (!requirement || !base) return <Dialog open={false}><DialogContent className="hidden" /></Dialog>;
  const a = assess(requirement);
  if (!a || !requirement.collection) return <Dialog open={false}><DialogContent className="hidden" /></Dialog>;
  const col = requirement.collection;
  const c = a.criteria;

  const changed = (Object.keys(ov) as (keyof Values)[]).filter((k) => String(ov[k] ?? '') !== String(base[k] ?? ''));
  const after = changed.length ? assess(requirement, ov) : null;
  const fresh = after ? newlyFit(a, after) : [];

  const apply = () => {
    const patch: ReqPatch = {};
    if (changed.includes('location')) patch.location = ov.location;
    if (changed.includes('type')) patch.type = ov.type;
    if (changed.includes('capacity')) patch.capacity = ov.capacity ?? null;
    if (changed.includes('budget')) patch.budget = ov.budget ?? null;
    if (changed.includes('radiusMi')) patch.searchArea = `within ${ov.radiusMi} miles of ${(after ?? a).criteria.centerLabel}`;
    onApply(requirement, patch);
  };

  const submit = (q: string) => {
    const v = q.trim();
    if (!v) return;
    const ans = ask(v, requirement);
    setChat((p) => [...p, ans]);
    setText('');
    if (ans.add?.length) onAddSpaces(requirement, ans.add);
    if (ans.adjust) {
      setForm((f) => ({
        ...f,
        ...(ans.adjust!.budget != null ? { budget: String(ans.adjust!.budget) } : {}),
        ...(ans.adjust!.capacity != null ? { capacity: String(ans.adjust!.capacity) } : {}),
        ...(ans.adjust!.radiusMi != null ? { radiusMi: String(ans.adjust!.radiusMi) } : {}),
      }));
      setTimeout(() => adjustRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  };

  const spaceRow = (r: SpaceResult, i: number, tag?: string) => (
    <div key={`${r.space.id}-${i}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderTop: i ? '1px solid #F1F3F5' : undefined }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{r.space.title}<span style={{ fontWeight: 400, color: '#6B7280' }}> · {r.space.venue}</span></div>
        <div style={{ fontSize: 13, color: r.fit && r.confirmed ? GREEN : '#374151', marginTop: 2 }}>{r.reason}{tag ? ` · ${tag}` : ''}</div>
        <div style={{ fontSize: 12.5, color: '#9CA3AF', marginTop: 1 }}>{r.facts}</div>
      </div>
      <a href={r.space.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: BLUE, textDecoration: 'none', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>Open listing <ExternalLink size={12} /></a>
    </div>
  );

  const stat = (n: number | null, caption: string, i: number) => (
    <div key={caption} style={{ padding: '12px 16px', borderLeft: i ? '1px solid #E5E7EB' : undefined }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: INK, lineHeight: 1.1 }}>{n == null ? '—' : n}</div>
      <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 3 }}>{caption}</div>
    </div>
  );

  const diff = (name: string, before: string | number, afterV: string | number) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '7px 0', borderBottom: '1px solid #F1F3F5' }}>
      <span style={{ color: '#6B7280' }}>{name}</span>
      <span style={{ color: INK }}>{before} <span style={{ color: '#9CA3AF' }}>→</span> <b>{afterV}</b></span>
    </div>
  );

  const showAdjust = a.state !== 'unrecorded';

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[680px] p-0 overflow-hidden [&>button]:hidden gap-0" style={{ borderRadius: 16, border: 'none', maxHeight: '92vh', boxShadow: '0 20px 50px rgba(15,42,61,0.25)' }}>
        <DialogDescription className="sr-only">The Collection Assessment Agent explains how well this collection covers the requirement</DialogDescription>

        <div style={{ padding: '20px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid #F1F3F5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={22} color={GREEN} /></div>
            <div>
              <DialogTitle style={{ fontSize: 18, fontWeight: 700, color: INK, fontFamily: FONT, letterSpacing: '-0.01em' }}>Collection Assessment Agent</DialogTitle>
              <div style={{ fontSize: 13.5, color: '#6B7280', marginTop: 2, fontFamily: FONT }}>For {requirement.name}{requirement.company ? ` · ${requirement.company}` : ''} · {col.name}</div>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="hover:bg-gray-100" style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', borderRadius: 8, padding: 6 }}><X size={18} /></button>
        </div>

        <div style={{ padding: '22px 24px 8px', overflowY: 'auto', maxHeight: 'calc(92vh - 250px)', fontFamily: FONT }}>
          {/* 1. What I found, and why */}
          <div style={label}>What I found</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: INK, marginTop: 8, letterSpacing: '-0.01em' }}>{a.statusText}</div>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.65, margin: '8px 0 0' }}>{a.summary}</p>

          {a.state === 'ok' && a.total > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', border: '1px solid #E5E7EB', borderRadius: 12, marginTop: 16 }}>
              {stat(a.inArea, `Within ${c.radiusMi} mi of ${c.centerLabel}`, 0)}
              {stat(a.withinBudget, c.budget ? `Within ${money(c.budget)}/mo` : 'Budget not provided', 1)}
              {stat(a.forPeople, a.bandText ? `For ${a.bandText}` : 'Headcount not provided', 2)}
            </div>
          )}

          <div style={{ fontSize: 14, fontWeight: 700, color: INK, margin: '20px 0 4px' }}>{a.gapsTitle}</div>
          <div style={{ borderTop: '1px solid #E5E7EB' }}>
            {a.gaps.map((g) => (
              <div key={g.label} style={{ display: 'flex', gap: 16, padding: '9px 0', borderBottom: '1px solid #F1F3F5' }}>
                <div style={{ width: 116, flexShrink: 0, fontSize: 13.5, fontWeight: 600, color: INK }}>{g.label}</div>
                <div style={{ flex: 1, fontSize: 13.5, color: '#374151', lineHeight: 1.55 }}>{g.text}</div>
              </div>
            ))}
          </div>

          {a.next && <p style={{ fontSize: 14, color: '#374151', margin: '14px 0 0', lineHeight: 1.55 }}><b style={{ color: INK }}>Next best change.</b> {a.next}</p>}
          {a.marketMore > 0 && (
            <div style={{ marginTop: 10 }}>
              <button type="button" style={linkBtn} onClick={() => onAddSpaces(requirement, a.marketFits.map((x) => x.space.url))}>Add the {a.marketMore} matching nearby {a.marketMore === 1 ? 'space' : 'spaces'} to this collection</button>
            </div>
          )}
          {a.total > 0 && a.state === 'ok' && (
            <div style={{ marginTop: 14 }}>
              <button type="button" style={linkBtn} onClick={() => setShowSpaces((s) => !s)}>{showSpaces ? 'Hide' : 'Show'} the {plural(a.total, 'space')} in this collection</button>
              {showSpaces && <div style={{ marginTop: 6 }}>{a.results.map((r, i) => spaceRow(r, i))}</div>}
            </div>
          )}

          {/* 2. Adjust */}
          {showAdjust && (
            <div ref={adjustRef} style={{ marginTop: 30 }}>
              <div style={label}>Adjust</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 6 }}>
                <p style={{ fontSize: 13.5, color: '#6B7280', margin: 0 }}>Change a value to see what happens. Nothing is saved until you apply it.</p>
                {changed.length > 0 && <button type="button" style={linkBtn} onClick={() => setForm(toForm(base))}>Reset</button>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 12, marginTop: 12 }}>
                <label style={{ fontSize: 12.5, color: '#6B7280' }}>Location
                  <input style={{ ...field, marginTop: 4 }} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City" />
                </label>
                <label style={{ fontSize: 12.5, color: '#6B7280' }}>People
                  <input style={{ ...field, marginTop: 4 }} inputMode="numeric" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="Any" />
                </label>
                <label style={{ fontSize: 12.5, color: '#6B7280' }}>Budget ($/mo)
                  <input style={{ ...field, marginTop: 4 }} inputMode="numeric" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="Any" />
                </label>
                <label style={{ fontSize: 12.5, color: '#6B7280' }}>Workspace type
                  <select style={{ ...field, marginTop: 4 }} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="">Any</option><option>Private Office</option><option>Team Office</option><option>Office Suite</option>
                  </select>
                </label>
                <label style={{ fontSize: 12.5, color: '#6B7280' }}>Search distance (miles)
                  <input style={{ ...field, marginTop: 4 }} inputMode="decimal" value={form.radiusMi} onChange={(e) => setForm({ ...form, radiusMi: e.target.value })} />
                </label>
              </div>
            </div>
          )}

          {/* 3. What changes */}
          {after && (
            <div style={{ marginTop: 26 }}>
              <div style={label}>What changes</div>
              <div style={{ marginTop: 8, borderTop: '1px solid #E5E7EB' }}>
                {diff('Result', a.statusText, after.statusText)}
                {diff('Fit in this collection', a.confirmedFits, after.confirmedFits)}
                {diff('Matching nearby, not in it', a.marketMore, after.marketMore)}
              </div>
              {after.state === 'unlocated' && <p style={{ fontSize: 13.5, color: '#374151', margin: '8px 0 0' }}>{after.summary}</p>}
              {fresh.length > 0 && (
                <>
                  <div style={{ fontSize: 14, fontWeight: 700, color: INK, margin: '14px 0 2px' }}>{plural(fresh.length, 'space')} would newly fit</div>
                  <div>{fresh.slice(0, 5).map((r, i) => spaceRow(r, i, r.space.inCollection ? 'in this collection' : 'nearby, not yet in it'))}</div>
                </>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
                <button type="button" style={primary} onClick={apply}>Apply to the requirement</button>
              </div>
            </div>
          )}
          <div style={{ height: 14 }} />
        </div>

        {/* Ask the agent */}
        {a.state === 'ok' && (
          <div style={{ padding: '10px 24px 16px', borderTop: '1px solid #E5E7EB', background: '#F9FAFB', fontFamily: FONT }}>
            {chat.length > 0 && (
              <div style={{ maxHeight: 150, overflowY: 'auto', marginBottom: 10 }}>
                {chat.map((m) => (
                  <div key={m.id} style={{ padding: '6px 0' }}>
                    <div style={{ fontSize: 12.5, color: '#9CA3AF' }}>{m.question}</div>
                    <div style={{ fontSize: 14, color: INK, lineHeight: 1.5, marginTop: 2 }}>{m.text}</div>
                    {m.spaces && m.spaces.map((s) => (
                      <div key={s.url} style={{ fontSize: 13, color: '#374151', marginTop: 3 }}>
                        <a href={s.url} target="_blank" rel="noreferrer" style={{ color: BLUE, fontWeight: 600, textDecoration: 'none' }}>{s.title}</a> · {s.sub}
                      </div>
                    ))}
                    {m.choices && m.choices.map((s) => (
                      <div key={s.url} style={{ fontSize: 13, color: '#374151', marginTop: 3 }}>
                        <button type="button" style={{ ...linkBtn, fontSize: 13 }} onClick={() => submit(s.url)}>{s.title}</button> · {s.desks} seats · {s.rate != null ? `${money(s.rate)}/mo` : 'not priced monthly'}
                      </div>
                    ))}
                  </div>
                ))}
                <div ref={chatEnd} />
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submit(text); } }}
                placeholder="Ask me about this collection, or paste a link to a space and I'll add it"
                style={{ flex: 1, height: 40, border: '1px solid #D1D5DB', borderRadius: 10, padding: '0 14px', fontSize: 14, fontFamily: FONT, outline: 'none', background: '#fff' }} />
              <button type="button" onClick={() => submit(text)} disabled={!text.trim()} style={{ ...primary, height: 40, opacity: text.trim() ? 1 : 0.5, cursor: text.trim() ? 'pointer' : 'default' }}>Ask</button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
