import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { X, Bot, ExternalLink, MapPin, DollarSign, Users, ChevronDown, ArrowUp, Check } from 'lucide-react';
import { assess, ask, suggestions, type Answer, type AnswerAction, type ReqPatch, type SpaceResult } from './data/assessmentAgent';
import type { MvpRequirement } from './data/mvpRequirements';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const INK = '#0F2A3D';
const GREEN = '#0F7B4F';
const ACCENT = { Plenty: '#2E9D4A', Few: '#E8A91C', None: '#9CA3AF' } as const;
const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

const card: React.CSSProperties = { background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, boxShadow: '0 1px 2px rgba(16,24,40,0.05)' };
const linkBtn: React.CSSProperties = { background: 'none', border: 'none', padding: 0, color: BLUE, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, textAlign: 'left' };
const heading: React.CSSProperties = { fontSize: 15, fontWeight: 700, color: INK, fontFamily: FONT, letterSpacing: '-0.005em' };

interface Props {
  requirement: MvpRequirement | null;
  onClose: () => void;
  /** Changing the requirement is always an explicit action on an answer; the Collection is never edited this way. */
  onApply: (req: MvpRequirement, patch: ReqPatch) => void;
  /** Adds spaces to the Collection only. */
  onAddSpaces: (req: MvpRequirement, urls: string[]) => void;
  /** Opens Requirement Details, the one place requirement values are edited by hand. */
  onEditRequirement: (req: MvpRequirement) => void;
}

function AgentAvatar({ size = 28 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Bot size={Math.round(size * 0.55)} color={GREEN} />
    </div>
  );
}

export function AssessCollectionModal({ requirement, onClose, onApply, onAddSpaces, onEditRequirement }: Props) {
  const [chat, setChat] = useState<Answer[]>([]);
  const [text, setText] = useState('');
  const [showSpaces, setShowSpaces] = useState(false);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => { setChat([]); setText(''); setShowSpaces(false); setDone({}); }, [requirement?.id]);
  useEffect(() => { if (chat.length) end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [chat.length]);

  if (!requirement || !requirement.collection) return <Dialog open={false}><DialogContent className="hidden" /></Dialog>;
  const a = assess(requirement);
  if (!a) return <Dialog open={false}><DialogContent className="hidden" /></Dialog>;
  const col = requirement.collection;
  const c = a.criteria;
  const examples = chat.length === 0 ? suggestions(requirement) : [];

  const submit = (q: string) => {
    const v = q.trim();
    if (!v) return;
    const ans = ask(v, requirement);
    setChat((p) => [...p, ans]);
    setText('');
    if (ans.added?.length) onAddSpaces(requirement, ans.added);
  };
  const run = (m: Answer, i: number, act: AnswerAction) => {
    if (act.patch) onApply(requirement, act.patch);
    if (act.add) onAddSpaces(requirement, act.add);
    setDone((p) => ({ ...p, [`${m.id}-${i}`]: true }));
  };

  const spaceLine = (r: SpaceResult, i: number) => (
    <div key={`${r.space.id}-${i}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderTop: i ? '1px solid #F1F3F5' : undefined }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{r.space.title}<span style={{ fontWeight: 400, color: '#6B7280' }}> · {r.space.venue}</span></div>
        <div style={{ fontSize: 13, color: r.fit && r.confirmed ? GREEN : '#374151', marginTop: 2 }}>{r.reason}</div>
        <div style={{ fontSize: 12.5, color: '#9CA3AF', marginTop: 1 }}>{r.facts}</div>
      </div>
      <a href={r.space.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: BLUE, textDecoration: 'none', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>Open listing <ExternalLink size={12} /></a>
    </div>
  );

  const stat = (Icon: typeof MapPin, n: number | null, caption: string) => (
    <div style={{ ...card, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9CA3AF' }}><Icon size={14} /></div>
      <div style={{ fontSize: 26, fontWeight: 700, color: INK, lineHeight: 1.15, marginTop: 6, letterSpacing: '-0.02em' }}>{n == null ? '—' : n}</div>
      <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 3, lineHeight: 1.35 }}>{caption}</div>
    </div>
  );

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden [&>button]:hidden gap-0" style={{ borderRadius: 18, border: 'none', maxHeight: '92vh', boxShadow: '0 24px 60px rgba(15,42,61,0.28)', background: '#F6F8FA' }}>
        <DialogDescription className="sr-only">The Collection Assessment Agent explains how well this collection covers the requirement</DialogDescription>

        {/* Header */}
        <div style={{ padding: '18px 24px', background: '#fff', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AgentAvatar size={42} />
            <div>
              <DialogTitle style={{ fontSize: 18, fontWeight: 700, color: INK, fontFamily: FONT, letterSpacing: '-0.01em' }}>Collection Assessment Agent</DialogTitle>
              <div style={{ fontSize: 13.5, color: '#6B7280', marginTop: 2, fontFamily: FONT }}>{requirement.name}{requirement.company ? ` · ${requirement.company}` : ''} · {col.name}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button type="button" style={linkBtn} onClick={() => onEditRequirement(requirement)}>Edit requirement</button>
            <button type="button" onClick={onClose} aria-label="Close" className="hover:bg-gray-100" style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', borderRadius: 8, padding: 6 }}><X size={18} /></button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px 8px', overflowY: 'auto', maxHeight: 'calc(92vh - 160px)', fontFamily: FONT }}>
          {/* What I see */}
          <div style={{ ...card, padding: '20px 22px', borderLeft: `4px solid ${ACCENT[a.status]}` }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: INK, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{a.statusText}</div>
            <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.65, margin: '10px 0 0' }}>{a.summary}</p>
            {a.next && <p style={{ fontSize: 14, color: '#374151', margin: '10px 0 0', lineHeight: 1.55 }}><b style={{ color: INK }}>Next best change.</b> {a.next}</p>}
            {a.marketMore > 0 && (
              <div style={{ marginTop: 12 }}>
                <button type="button" style={linkBtn} onClick={() => onAddSpaces(requirement, a.marketFits.map((x) => x.space.url))}>Add the {plural(a.marketMore, 'matching nearby space')} to this collection</button>
              </div>
            )}
          </div>

          {a.state === 'ok' && a.total > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 12 }}>
              {stat(MapPin, a.inArea, `Within ${c.radiusMi} mi of ${c.centerLabel}`)}
              {stat(DollarSign, a.withinBudget, c.budget ? `Within ${money(c.budget)}/mo` : 'Budget not provided')}
              {stat(Users, a.forPeople, a.bandText ? `For ${a.bandText}` : 'Headcount not provided')}
            </div>
          )}

          {/* Gaps and trade-offs, or why it's empty */}
          <div style={{ ...card, padding: '16px 22px 6px', marginTop: 12 }}>
            <div style={heading}>{a.gapsTitle}</div>
            <div style={{ marginTop: 6 }}>
              {a.gaps.map((g, i) => (
                <div key={g.label} style={{ display: 'flex', gap: 16, padding: '11px 0', borderTop: i ? '1px solid #F1F3F5' : undefined }}>
                  <div style={{ width: 118, flexShrink: 0, fontSize: 13.5, fontWeight: 600, color: INK }}>{g.label}</div>
                  <div style={{ flex: 1, fontSize: 13.5, color: '#374151', lineHeight: 1.55 }}>{g.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* The spaces */}
          {a.state === 'ok' && a.total > 0 && (
            <div style={{ ...card, padding: '14px 22px', marginTop: 12 }}>
              <button type="button" onClick={() => setShowSpaces((s) => !s)} style={{ ...linkBtn, display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', color: INK, fontSize: 15, fontWeight: 700 }}>
                <span>The {plural(a.total, 'space')} in this collection</span>
                <ChevronDown size={16} color="#9CA3AF" style={{ transform: showSpaces ? 'rotate(180deg)' : undefined, transition: 'transform .15s' }} />
              </button>
              {showSpaces && <div style={{ marginTop: 6 }}>{a.results.map((r, i) => spaceLine(r, i))}</div>}
            </div>
          )}

          {/* Ask me */}
          {a.state !== 'unrecorded' && (
            <div style={{ marginTop: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <AgentAvatar />
                <div style={heading}>Ask me</div>
              </div>
              {chat.length === 0 && (
                <div style={{ ...card, padding: '14px 18px' }}>
                  <div style={{ fontSize: 13.5, color: '#6B7280', lineHeight: 1.55 }}>Ask about what I found, try a change to see what it would do, or paste a link to a space and I'll add it. Nothing changes until you choose to apply it.</div>
                  {examples.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                      {examples.map((e) => (
                        <div key={e} style={{ padding: '3px 0' }}><button type="button" style={linkBtn} onClick={() => submit(e)}>{e}</button></div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {chat.map((m) => (
                <div key={m.id} style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ maxWidth: '82%', background: '#E6EFF6', color: INK, fontSize: 14, lineHeight: 1.5, padding: '9px 14px', borderRadius: '14px 14px 4px 14px', wordBreak: 'break-word' }}>{m.question}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 8, alignItems: 'flex-start' }}>
                    <AgentAvatar />
                    <div style={{ ...card, padding: '12px 16px', flex: 1, borderRadius: '4px 14px 14px 14px' }}>
                      <div style={{ fontSize: 14.5, color: INK, lineHeight: 1.6 }}>{m.text}</div>
                      {m.spaces && m.spaces.length > 0 && (
                        <div style={{ marginTop: 6 }}>
                          {m.spaces.map((s, i) => (
                            <div key={s.url} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderTop: i ? '1px solid #F1F3F5' : '1px solid #F1F3F5' }}>
                              <div><div style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>{s.title}</div><div style={{ fontSize: 12.5, color: '#6B7280' }}>{s.sub}</div></div>
                              <a href={s.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: BLUE, textDecoration: 'none', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>Open listing <ExternalLink size={12} /></a>
                            </div>
                          ))}
                        </div>
                      )}
                      {m.choices && (
                        <div style={{ marginTop: 6 }}>
                          {m.choices.map((s) => (
                            <div key={s.url} style={{ padding: '4px 0', fontSize: 13, color: '#374151' }}>
                              <button type="button" style={{ ...linkBtn, fontSize: 13.5 }} onClick={() => submit(s.url)}>{s.title}</button> · {s.desks} seats · {s.rate != null ? `${money(s.rate)}/mo` : 'not priced monthly'}
                            </div>
                          ))}
                        </div>
                      )}
                      {m.actions && m.actions.length > 0 && (
                        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                          {m.actions.map((act, i) => done[`${m.id}-${i}`] ? (
                            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, color: GREEN }}><Check size={14} /> Done</span>
                          ) : (
                            <button key={i} type="button" onClick={() => run(m, i, act)} className="hover:bg-[#EEF5FB]"
                              style={{ border: `1px solid ${BLUE}`, background: '#fff', color: BLUE, borderRadius: 8, padding: '7px 12px', fontSize: 13.5, fontWeight: 600, fontFamily: FONT, cursor: 'pointer', textAlign: 'left' }}>{act.label}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={end} />
            </div>
          )}
          <div style={{ height: 16 }} />
        </div>

        {/* Input */}
        {a.state !== 'unrecorded' && (
          <div style={{ padding: '12px 24px 16px', background: '#fff', borderTop: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #D1D5DB', borderRadius: 14, padding: '5px 6px 5px 16px', background: '#fff', boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
              <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submit(text); } }}
                placeholder="Ask me about this collection, or paste a link to a space"
                style={{ flex: 1, height: 36, border: 'none', outline: 'none', fontSize: 14.5, fontFamily: FONT, background: 'transparent', color: INK }} />
              <button type="button" onClick={() => submit(text)} disabled={!text.trim()} aria-label="Ask"
                style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: text.trim() ? BLUE : '#D1D5DB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: text.trim() ? 'pointer' : 'default' }}>
                <ArrowUp size={17} />
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
