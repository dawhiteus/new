import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { X, Link2, Bot, ExternalLink, ChevronLeft, Loader2, Sparkles, Check, MapPin, DollarSign, Users } from 'lucide-react';
import {
  COLLECTION_AGENT, criteriaFor, sourceCollection, resolveCollectionUrl, newCollectionUrl,
  type SourcingResult,
} from './data/collectionAgent';
import type { MvpRequirement } from './data/mvpRequirements';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const INK = '#0F2A3D';
const GREEN = '#0F7B4F';

export type CollectionMethod = 'existing' | 'agent' | 'manual';

export interface CollectionOutcome {
  method: CollectionMethod;
  name: string;
  url: string;
  spaces: number;
  saved: number;
  shortlisted: number;
  locationSpaces: number;
  budgetSpaces: number;
  peopleSpaces: number;
  assessment?: { summary: string; gaps: string[] };
}

interface Props {
  requirement: MvpRequirement | null;
  onClose: () => void;
  onComplete: (req: MvpRequirement, outcome: CollectionOutcome) => void;
}

type View = 'choose' | 'existing' | 'agent' | 'manual';
type AgentStage = 'setup' | 'working' | 'done' | 'none';

const input: React.CSSProperties = { width: '100%', border: '1.5px solid #0F2A3D', borderRadius: 8, padding: '11px 14px', fontSize: 15, fontFamily: FONT, color: INK, background: '#fff', outline: 'none' };
const lbl: React.CSSProperties = { display: 'block', fontSize: 14, fontWeight: 600, color: INK, marginBottom: 8, fontFamily: FONT };
const primary: React.CSSProperties = { padding: '10px 16px', borderRadius: 8, border: 'none', background: BLUE, color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: FONT, cursor: 'pointer' };
const secondary: React.CSSProperties = { padding: '10px 16px', borderRadius: 8, border: `1px solid ${BLUE}`, background: '#fff', color: BLUE, fontSize: 15, fontWeight: 500, fontFamily: FONT, cursor: 'pointer' };

const TIER_STYLE: Record<string, { bg: string; color: string }> = {
  Strong: { bg: '#2E9D4A', color: '#fff' },
  Partial: { bg: '#E8A91C', color: '#fff' },
  Weak: { bg: '#9CA3AF', color: '#fff' },
};

export function CreateCollectionModal({ requirement, onClose, onComplete }: Props) {
  const [view, setView] = useState<View>('choose');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [stage, setStage] = useState<AgentStage>('setup');
  const [workMsg, setWorkMsg] = useState('');
  const [result, setResult] = useState<SourcingResult | null>(null);
  const [outcome, setOutcome] = useState<CollectionOutcome | null>(null);

  const open = requirement !== null;
  useEffect(() => {
    if (!requirement) return;
    setView('choose'); setUrl(''); setError(''); setName(`${requirement.name} Collection`); setStage('setup'); setResult(null); setOutcome(null);
  }, [requirement?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!requirement) return <Dialog open={false}><DialogContent className="hidden" /></Dialog>;

  const back = () => { setView('choose'); setError(''); setStage('setup'); };

  const linkByUrl = () => {
    const r = resolveCollectionUrl(url);
    if ('error' in r) { setError(r.error); return; }
    onComplete(requirement, {
      method: 'existing', name: r.name, url: r.url, spaces: r.spaces, saved: r.saved, shortlisted: r.shortlisted,
      locationSpaces: 0, budgetSpaces: 0, peopleSpaces: 0,
    });
    onClose();
  };

  const createManual = () => {
    if (!name.trim()) return;
    const collectionUrl = newCollectionUrl(name.trim());
    window.open(collectionUrl, '_blank', 'noopener');
    onComplete(requirement, { method: 'manual', name: name.trim(), url: collectionUrl, spaces: 0, saved: 0, shortlisted: 0, locationSpaces: 0, budgetSpaces: 0, peopleSpaces: 0 });
    onClose();
  };

  const criteria = criteriaFor(requirement);
  const canSource = criteria.location !== '';

  const runAgent = () => {
    if (!name.trim() || !canSource) return;
    setStage('working');
    const steps = [
      `Searching LiquidSpace inventory in ${criteria.location.split(',')[0]}…`,
      'Matching spaces against the requirement…',
      'Assessing fit, gaps and trade-offs…',
      'Creating the collection…',
    ];
    setWorkMsg(steps[0]);
    steps.forEach((s, i) => setTimeout(() => setWorkMsg(s), i * 650));
    setTimeout(() => {
      const r = sourceCollection(criteria, name.trim());
      if (!r) {
        // No suitable inventory: still create an empty Collection and explain the result.
        const empty: CollectionOutcome = {
          method: 'agent', name: name.trim(), url: newCollectionUrl(name.trim()), spaces: 0, saved: 0, shortlisted: 0,
          locationSpaces: 0, budgetSpaces: 0, peopleSpaces: 0,
          assessment: { summary: `I found no suitable LiquidSpace inventory in ${criteria.location.split(',')[0]}, so “${name.trim()}” was created empty.`, gaps: [`Overall: No suitable inventory was found in ${criteria.location.split(',')[0]}. Add spaces in LiquidSpace or link another Collection.`] },
        };
        setResult(null);
        setOutcome(empty);
        onComplete(requirement, empty);
        setStage('none');
        return;
      }
      const collectionUrl = newCollectionUrl(name.trim());
      const o: CollectionOutcome = {
        method: 'agent', name: name.trim(), url: collectionUrl, spaces: r.found, saved: 0, shortlisted: 0,
        locationSpaces: r.inMarket, budgetSpaces: r.withinBudget, peopleSpaces: r.fitsPeople,
        assessment: { summary: r.summary, gaps: r.gaps.map((g) => `${g.label}: ${g.text}`) },
      };
      setResult(r);
      setOutcome(o);
      onComplete(requirement, o); // associated as soon as it is created
      setStage('done');
    }, steps.length * 650);
  };

  const Option = ({ icon, title, desc, onClick }: { icon: React.ReactNode; title: string; desc: string; onClick: () => void }) => (
    <button type="button" onClick={onClick} className="hover:bg-gray-50"
      style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%', textAlign: 'left', border: '1px solid #E5E7EB', borderRadius: 14, padding: '16px 18px', background: '#fff', cursor: 'pointer', marginBottom: 12, fontFamily: FONT }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EAF3FB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, color: INK }}>{title}</div>
        <div style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>{desc}</div>
      </div>
    </button>
  );

  const backBtn = (
    <button type="button" onClick={back} style={{ background: 'none', border: 'none', color: BLUE, fontSize: 14, fontWeight: 600, fontFamily: FONT, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0, marginBottom: 14 }}>
      <ChevronLeft size={16} /> Back
    </button>
  );

  const urlField = (
    <>
      <label style={lbl}>Collection URL</label>
      <input value={url} onChange={(e) => { setUrl(e.target.value); setError(''); }} placeholder="https://liquidspace.com/collections/…" style={input}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); linkByUrl(); } }} />
      {error && <div style={{ fontSize: 13, color: '#B91C1C', marginTop: 6, fontFamily: FONT }}>{error}</div>}
    </>
  );

  const criteriaRow = (label: string, value: string | number | null) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14, fontFamily: FONT, borderBottom: '1px solid #F1F3F5' }}>
      <span style={{ color: '#6B7280' }}>{label}</span>
      {value ? <span style={{ color: INK, fontWeight: 600 }}>{value}</span> : <span style={{ color: '#9CA3AF', fontStyle: 'italic' }}>Not provided</span>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden [&>button]:hidden gap-0" style={{ borderRadius: 24, border: 'none', maxHeight: '92vh' }}>
        <DialogDescription className="sr-only">Create or link a LiquidSpace Collection for this requirement</DialogDescription>
        <div style={{ background: BLUE, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <DialogTitle style={{ color: '#fff', fontSize: 22, fontWeight: 700, fontFamily: FONT }}>Create Collection</DialogTitle>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: FONT, marginTop: 2 }}>For {requirement.name}{requirement.company ? ` · ${requirement.company}` : ''}</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '20px', overflowY: 'auto', maxHeight: 'calc(92vh - 80px)' }}>
          {view === 'choose' && (
            <>
              <Option icon={<Link2 size={22} color={BLUE} />} title="Use Existing Collection" desc="Link a Collection you've already built in LiquidSpace." onClick={() => setView('existing')} />
              <Option icon={<Bot size={22} color="#059669" />} title="Create with Collection Agent" desc="I'll source spaces from LiquidSpace inventory, build the Collection and assess the fit." onClick={() => setView('agent')} />
              <Option icon={<ExternalLink size={22} color={BLUE} />} title="Create Manually in LiquidSpace" desc="Name it here, then add spaces yourself in LiquidSpace." onClick={() => setView('manual')} />
            </>
          )}

          {view === 'existing' && (
            <>
              {backBtn}
              <div style={{ fontSize: 14, color: '#6B7280', fontFamily: FONT, marginBottom: 14 }}>Paste the link to a Collection in LiquidSpace. Its contents aren't changed.</div>
              {urlField}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={onClose} style={secondary}>Cancel</button>
                <button type="button" onClick={linkByUrl} style={primary}>Link Collection</button>
              </div>
            </>
          )}

          {view === 'manual' && (
            <>
              {backBtn}
              <div style={{ fontSize: 14, color: '#374151', fontFamily: FONT, marginBottom: 16, lineHeight: 1.5 }}>
                Name your Collection. We'll create it in LiquidSpace, link it to this requirement, and open it so you can add spaces.
              </div>
              <label style={lbl}>Collection name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} style={input} autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); createManual(); } }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={onClose} style={secondary}>Cancel</button>
                <button type="button" onClick={createManual} disabled={!name.trim()}
                  style={{ ...primary, opacity: name.trim() ? 1 : 0.5, cursor: name.trim() ? 'pointer' : 'default', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  Create and open in LiquidSpace <ExternalLink size={15} />
                </button>
              </div>
            </>
          )}

          {view === 'agent' && (
            <>
              {stage === 'setup' && backBtn}
              <div style={{ border: '1.5px solid #BFE5CC', background: '#F0FAF4', borderRadius: 16, padding: 16 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {stage === 'working' ? <Loader2 size={22} color="#059669" className="animate-spin" /> : <Bot size={24} color="#059669" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, fontFamily: FONT }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: INK }}>{COLLECTION_AGENT}</span>
                    </div>

                    {stage === 'setup' && (
                      <>
                        <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.5, marginBottom: 12 }}>
                          {canSource
                            ? "I'll search LiquidSpace inventory using what's in this requirement, build a Collection, and tell you how well it fits."
                            : "I need at least a location to search. Add one to this requirement, or link or build a Collection another way."}
                        </div>
                        <div style={{ background: '#fff', borderRadius: 10, padding: '4px 12px', marginBottom: 12 }}>
                          {criteriaRow('Location', criteria.location)}
                          {criteriaRow('Capacity', criteria.capacity ? `${criteria.capacity} people` : null)}
                          {criteriaRow('Budget', criteria.budget ? `$${criteria.budget.toLocaleString('en-US')}/mo` : null)}
                          {criteriaRow('Workspace type', criteria.workspaceType)}
                          {criteriaRow('Start date / term', [criteria.startDate, criteria.termLength && `${criteria.termLength} mos`].filter(Boolean).join(' · '))}
                        </div>
                        <label style={lbl}>Collection name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} style={{ ...input, background: '#fff' }} />
                      </>
                    )}

                    {stage === 'working' && <div style={{ fontSize: 14, color: '#374151', padding: '6px 0' }}>{workMsg}</div>}

                    {stage === 'none' && (
                      <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.55 }}>
                        I found no suitable LiquidSpace inventory in <b>{criteria.location.split(',')[0]}</b>, so I created an empty “{outcome?.name}” Collection and linked it to this requirement. You can add spaces in LiquidSpace, or link a different Collection.
                      </div>
                    )}

                    {stage === 'done' && result && outcome && (
                      <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{result.headline}</div>
                    )}
                  </div>
                </div>
              </div>

              {stage === 'done' && result && outcome && (
                <>
                  <div style={{ border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden', marginTop: 12, fontFamily: FONT }}>
                    <div style={{ padding: '14px 16px 10px' }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: INK }}>{outcome.name}</div>
                      <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{result.found} space{result.found === 1 ? '' : 's'} total</div>
                    </div>
                    <div style={{ borderTop: '1px solid #E5E7EB', padding: '8px 16px' }}>
                      {[
                        { icon: <MapPin size={13} />, label: `In ${criteria.location}`, n: outcome.locationSpaces },
                        { icon: <DollarSign size={13} />, label: criteria.budget ? `Within $${criteria.budget.toLocaleString('en-US')}/mo` : 'Budget not provided', n: outcome.budgetSpaces, off: !criteria.budget },
                        { icon: <Users size={13} />, label: criteria.capacity ? `For ${criteria.capacity} people` : 'Headcount not provided', n: outcome.peopleSpaces, off: !criteria.capacity },
                      ].map((r) => (
                        <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14, padding: '4px 0' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9CA3AF' }}>{r.icon} {r.label}</span>
                          {r.off ? <span style={{ color: '#9CA3AF' }}>—</span> : <span style={{ fontWeight: 700, color: INK }}>{r.n} {r.n === 1 ? 'space' : 'spaces'}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                  {result.gaps.length > 0 && (
                    <>
                      <div style={{ margin: '16px 0 8px', fontSize: 14, fontWeight: 700, color: INK, fontFamily: FONT }}>Observations</div>
                      <div style={{ border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
                        {result.gaps.map((g, i) => {
                          return (
                            <div key={g.label + i} style={{ display: 'flex', gap: 16, padding: '10px 14px', borderTop: i ? '1px solid #F1F3F5' : undefined, fontFamily: FONT, alignItems: 'flex-start' }}>
                              <div style={{ width: 112, flexShrink: 0, fontSize: 13.5, fontWeight: 600, color: INK }}>{g.label}</div>
                              <div style={{ flex: 1, fontSize: 13.5, color: '#374151', lineHeight: 1.5 }}>{g.text}</div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 12, fontFamily: FONT }}>Prototype: simulated sourcing from fictitious sample inventory. Browse the individual spaces in LiquidSpace. These results are saved to this requirement's Create Collection task.</div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                {stage === 'setup' && (
                  <>
                    <button type="button" onClick={onClose} style={secondary}>Cancel</button>
                    <button type="button" onClick={runAgent} disabled={!canSource || !name.trim()} style={{ ...primary, opacity: canSource && name.trim() ? 1 : 0.5, cursor: canSource && name.trim() ? 'pointer' : 'default', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <Sparkles size={16} /> Create Collection
                    </button>
                  </>
                )}
                {stage === 'none' && outcome && (
                  <>
                    <a href={outcome.url} target="_blank" rel="noreferrer" style={{ ...secondary, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      Open in LiquidSpace <ExternalLink size={15} />
                    </a>
                    <button type="button" onClick={onClose} style={primary}>Done</button>
                  </>
                )}
                {stage === 'done' && outcome && (
                  <>
                    <a href={outcome.url} target="_blank" rel="noreferrer" style={{ ...secondary, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      View in LiquidSpace <ExternalLink size={15} />
                    </a>
                    <button type="button" onClick={onClose} style={primary}>Done</button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
