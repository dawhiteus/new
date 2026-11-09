import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { LICENSE_REGISTRY, needingDecision, byNoticeDate, daysUntil } from './data/licenseRegistry';
import { X, ChevronsUpDown, Bot, Loader2, Sparkles, Copy, ArrowUp, Paperclip, CheckSquare } from 'lucide-react';
import { toast } from './ui/toast';
import {
  AGENT_NAME, REQUIRED, FIELD_LABEL,
  runIntake, missingDetailsMessage,
  type IntakeDraft, type IntakeFields, type IntakeResult, type FieldKey, type Provenance, type OpenQuestion,
} from './data/intakeAgent';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const INK = '#0F2A3D';
const fmtShort = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const GREEN = '#0F7B4F';
// LiquidSpace v4 tokens used by the agent summary (agents are teal everywhere).
const TEAL = '#00b8c4';
const TEAL_TEXT = '#0e7490';
const TEXT = '#374151';
const MUTED = '#6b7280';
const BORDER = '#e5e7eb';
const HAIRLINE = '#f3f4f6';
const LS_500 = '#005b94';
const STATUSES = ['Active', 'Draft', 'Executed', 'Archived'];
const WORKSPACE_TYPES = ['Office Suite', 'Private Office', 'Team Office', 'Coworking', 'Meeting Space'];
const CONFIGURATIONS = ['Single space', 'Collection of spaces'];

export type NewRequirementData = IntakeFields & {
  /** Present when the Requirement Agent drafted this requirement. */
  intake?: { sourceText: string; sourceLabel: string; questions: string[]; licenseId?: string; contact?: string };
  /** Fields the agent filled, with their sources. */
  prov?: Partial<Record<FieldKey, Provenance>>;
};

const emptyFields = (): IntakeFields => ({
  company: '', status: 'Active', name: '', location: '', workspaceType: '', capacity: '', size: '', programNeeds: '', amenityNeeds: '',
  configuration: '', otherFunctional: '', startDate: '', termLength: '', closeDate: '', budget: '', otherCommercial: '',
});
const manualDraft = (): IntakeDraft => ({ id: 'manual', label: 'Requirement', fields: emptyFields(), prov: {}, questions: [] });

const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid #D1D5DB', borderRadius: 8, padding: '10px 12px',
  fontSize: 15, fontFamily: FONT, color: '#111827', background: '#fff', outline: 'none',
};
const labelStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 8, fontFamily: FONT };
const sectionStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: BLUE, textTransform: 'uppercase',
  borderBottom: '1px solid #E5E7EB', paddingBottom: 6, margin: '8px 0 18px', fontFamily: FONT,
};

const MARK: Record<Provenance['kind'], { color: string; text: string }> = {
  source: { color: TEAL_TEXT, text: 'From your text' },
  license: { color: TEAL_TEXT, text: 'From the license' },
  suggested: { color: TEAL_TEXT, text: 'Suggested, please confirm' },
};

// One checklist row per open question: a short field name, and a hint. When the agent asked something
// specific (a conflict, a currency, a hybrid headcount), the question itself is the hint.
const ROW_LABEL: Partial<Record<FieldKey, string>> = {
  location: 'Location', capacity: 'Headcount', budget: 'Monthly budget', startDate: 'Start date', termLength: 'Term length',
  workspaceType: 'Space type', otherFunctional: 'Search area', size: 'Size', company: 'Company',
};
const GENERIC_Q = /^(Which city|How many people will|What monthly budget|What start date|How long a term|What type of space|Which neighborhoods|Do they have a size|Which company)/;
function checklistRow(q: OpenQuestion, f: IntakeFields): { field: FieldKey; label: string; hint: string } {
  const label = ROW_LABEL[q.field] ?? FIELD_LABEL[q.field] ?? 'Detail';
  if (!GENERIC_Q.test(q.text)) return { field: q.field, label, hint: q.text };
  const termEnd = q.text.match(/Current term ends (.+?)\.\)/)?.[1];
  const hint: Partial<Record<FieldKey, string>> = {
    location: 'City or location',
    capacity: 'People the space must hold',
    budget: 'Target spend per month',
    startDate: termEnd ? `Current term ends ${termEnd}` : 'Required move-in date',
    termLength: 'Months of commitment',
    workspaceType: 'Office suite, private office, team office, coworking or meeting space',
    otherFunctional: f.location ? `Neighborhoods or radius in ${f.location}` : 'Neighborhoods or radius',
    size: q.suggest ? `About ${Number(q.suggest.value).toLocaleString('en-US')} sq ft at 150 sq ft per person` : 'Square feet',
    company: 'Customer company name',
  };
  return { field: q.field, label, hint: hint[q.field] ?? q.text };
}

function AgentAvatar({ spinning, small }: { spinning?: boolean; small?: boolean }) {
  const size = small ? 34 : 40;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {spinning ? <Loader2 size={22} color="#059669" className="animate-spin" /> : <Bot size={small ? 20 : 24} color="#059669" />}
    </div>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (items: NewRequirementData[]) => void;
  /** When set, the Requirement Agent opens and drafts straight from this license. */
  initialLicenseId?: string;
  /** Existing requirements, used to warn about likely duplicates. */
  existing?: { name: string; company: string; city: string; capacity: string }[];
}

type Phase = 'closed' | 'open' | 'working' | 'review';

export function NewRequirementModal({ isOpen, onClose, onCreate, initialLicenseId, existing = [] }: Props) {
  const [dupWarn, setDupWarn] = useState<string | null>(null);
  const [autoRun, setAutoRun] = useState(false);
  const [phase, setPhase] = useState<Phase>('closed');
  const [text, setText] = useState('');
  const [licenseId, setLicenseId] = useState('');
  const [licOpen, setLicOpen] = useState(false);
  const [showAllLic, setShowAllLic] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileText, setFileText] = useState('');
  const [fileUnreadable, setFileUnreadable] = useState(false);
  const [reviewOnly, setReviewOnly] = useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [workMsg, setWorkMsg] = useState('');
  const [result, setResult] = useState<IntakeResult | null>(null);
  const [drafts, setDrafts] = useState<IntakeDraft[]>([manualDraft()]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setPhase('closed'); setText(''); setLicenseId(''); setFileName(''); setFileText(''); setFileUnreadable(false); setReviewOnly(false); setResult(null); setDrafts([manualDraft()]); setActive(0); setDupWarn(null);
    if (initialLicenseId) { setLicenseId(initialLicenseId); setPhase('open'); setAutoRun(true); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (autoRun && licenseId) { setAutoRun(false); startAgent(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun, licenseId]);

  const close = () => onClose();
  const draft = drafts[active] ?? drafts[0];
  const agentRun = phase === 'review' && result !== null;

  const TEXT_FILE = /\.(txt|eml|md|csv|rtf)$/i;
  const attachFile = async (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    if (TEXT_FILE.test(file.name) || file.type.startsWith('text/')) {
      setFileText((await file.text()).trim());
      setFileUnreadable(false);
    } else {
      setFileText('');
      setFileUnreadable(true);
    }
  };
  const removeFile = () => { setFileName(''); setFileText(''); setFileUnreadable(false); if (fileRef.current) fileRef.current.value = ''; };
  const sourceText = [text.trim(), fileText].filter(Boolean).join('\n\n');
  const sourceLabel = text.trim() && fileText ? `pasted text and the attached file “${fileName}”` : fileText ? `the attached file “${fileName}”` : 'pasted text';

  const startAgent = () => {
    if (!sourceText && !licenseId.trim()) return;
    setPhase('working');
    const steps = [
      licenseId.trim() ? `Pulling license ${licenseId.trim().toUpperCase()}…` : fileText ? 'Reading the file…' : 'Reading what you pasted…',
      'Pulling out the requirement details…',
      'Checking what is missing…',
    ];
    setWorkMsg(steps[0]);
    steps.forEach((s, i) => setTimeout(() => setWorkMsg(s), i * 700));
    setTimeout(() => {
      const r = runIntake(sourceText, licenseId);
      if (!r.found) { toast.error("I didn't find a requirement in that text. Add details and try again, or fill the form yourself."); setPhase('open'); return; }
      setResult(r);
      setDrafts(r.drafts);
      setActive(0);
      setPhase('review');
    }, steps.length * 700);
  };

  const startOver = () => { setPhase('closed'); setResult(null); setDrafts([manualDraft()]); setActive(0); setText(''); setLicenseId(''); setFileName(''); setFileText(''); setFileUnreadable(false); setReviewOnly(false); };

  const setField = (k: FieldKey, v: string) =>
    setDrafts((ds) => ds.map((d, i) => {
      if (i !== active) return d;
      const prov = { ...d.prov };
      delete prov[k];
      return { ...d, fields: { ...d.fields, [k]: v }, prov };
    }));

  const missingFor = (d: IntakeDraft) => REQUIRED.filter((k) => k !== 'name' && !d.fields[k].trim());
  const incompleteDrafts = drafts.filter((d) => missingFor(d).length > 0);

  const cityOf = (v: string) => v.split(',')[0].trim().toLowerCase();
  /** Same company, same city, capacity within 20%. */
  const likelyDuplicates = () => drafts.flatMap((d) => {
    const co = d.fields.company.trim().toLowerCase();
    const city = cityOf(d.fields.location);
    const cap = parseInt(d.fields.capacity, 10);
    if (!co || !city) return [];
    return existing.filter((r) => {
      if (r.company.trim().toLowerCase() !== co || cityOf(r.city) !== city) return false;
      const rc = parseInt(r.capacity, 10);
      if (!Number.isFinite(cap) || !Number.isFinite(rc)) return true;
      return Math.abs(rc - cap) <= Math.max(1, cap * 0.2);
    });
  });

  const create = () => {
    onCreate?.(
      drafts.map((d) => ({
        ...d.fields,
        prov: Object.keys(d.prov).length ? d.prov : undefined,
        intake: agentRun && result ? { sourceText: result.sourceText, sourceLabel, questions: d.questions, licenseId: result.license?.licenseId, contact: result.contact } : undefined,
      })),
    );
    close();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only a Requirement Name is needed to save. Anything else missing is saved as a Draft.
    for (let i = 0; i < drafts.length; i++) {
      if (!drafts[i].fields.name.trim()) {
        setActive(i);
        toast.error(`${drafts.length > 1 ? `${drafts[i].label}: ` : ''}Requirement Name is required.`);
        return;
      }
    }
    const dupes = likelyDuplicates();
    if (dupes.length && dupWarn === null) {
      const r = dupes[0];
      setDupWarn(`This looks like an existing requirement: ${r.name} (${r.company}${r.capacity ? `, ${r.capacity} seats` : ''}). Create it anyway?`);
      return;
    }
    create();
  };

  const marker = (k: FieldKey) => {
    const p = draft.prov[k];
    if (!p) return null;
    const m = MARK[p.kind];
    return (
      <span title={`${m.text}: ${p.note}`} aria-label={`Agent-filled. ${m.text}: ${p.note}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: m.color, padding: '0 2px', cursor: 'help' }}>
        <Sparkles size={12} />
      </span>
    );
  };
  // Fields to review: anything missing that Active needs, anything the agent only suggested, plus the name and company.
  const needsReview = (k: FieldKey) =>
    k === 'name' || k === 'company' ||
    (REQUIRED.includes(k) && !draft.fields[k].trim()) ||
    draft.prov[k]?.kind === 'suggested';
  const vis = (k: FieldKey) => !(agentRun && reviewOnly) || needsReview(k);
  const ALL_FIELDS: FieldKey[] = ['company', 'name', 'location', 'workspaceType', 'capacity', 'size', 'programNeeds', 'amenityNeeds', 'configuration', 'otherFunctional', 'startDate', 'termLength', 'closeDate', 'budget', 'otherCommercial'];
  const reviewCount = ALL_FIELDS.filter(needsReview).length;
  const checklist = (draft.open ?? draft.questions.map((text) => ({ field: 'otherFunctional' as FieldKey, tier: 'useful' as const, text }))).map((q) => checklistRow(q, draft.fields));
  const missingFlag = (k: FieldKey) => agentRun && REQUIRED.includes(k) && k !== 'name' && !draft.fields[k];

  const field = (k: FieldKey, type = 'text') => (
    <div>
      <label style={labelStyle}>{FIELD_LABEL[k]}{k === 'name' ? ' *' : ''}{marker(k)}</label>
      <input
        type={type}
        value={draft.fields[k]}
        onChange={(e) => setField(k, e.target.value)}
        style={{ ...inputStyle, borderColor: missingFlag(k) ? '#E5E7EB' : '#D1D5DB' }}
      />
      {missingFlag(k) && <div style={{ fontSize: 12, color: '#B45309', marginTop: 5, fontFamily: FONT }}>Not provided</div>}
    </div>
  );
  const area = (k: FieldKey, placeholder: string) => (
    <div style={{ marginBottom: 20 }}>
      <label style={labelStyle}>{FIELD_LABEL[k]}{marker(k)}</label>
      <textarea
        value={draft.fields[k]}
        onChange={(e) => setField(k, e.target.value)}
        placeholder={placeholder}
        rows={3}
        style={{ ...inputStyle, resize: 'vertical', borderColor: '#D1D5DB' }}
      />
    </div>
  );
  const chip = (selected: boolean, label: string, onClick: () => void, grow = false) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      style={{
        flex: grow ? 1 : undefined, padding: grow ? '12px' : '9px 16px', borderRadius: grow ? 8 : 999,
        border: `1px solid ${selected ? BLUE : '#D1D5DB'}`, background: selected ? '#E8F1F8' : '#fff',
        color: selected ? BLUE : '#111827', fontSize: 14, fontWeight: selected ? 600 : 500, fontFamily: FONT, cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
  const row2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 };

  const f = draft.fields;
  const canDraft = !!(sourceText || licenseId.trim());

  return (
    <Dialog open={isOpen} onOpenChange={(o) => { if (!o) close(); }}>
      <DialogContent className="sm:max-w-[760px] p-0 overflow-hidden [&>button]:hidden" style={{ borderRadius: 24, border: 'none', maxHeight: '92vh' }}>
        <DialogDescription className="sr-only">Create a new workspace requirement</DialogDescription>
        <div style={{ background: 'linear-gradient(135deg, #004a7c 0%, #005b94 50%, #0071b8 100%)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <DialogTitle style={{ color: '#fff', fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', fontFamily: FONT }}>Create Requirement</DialogTitle>
          <button type="button" onClick={close} aria-label="Close" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <form onSubmit={submit} style={{ padding: '16px 20px 28px', overflowY: 'auto', maxHeight: 'calc(92vh - 72px)' }}>
          {/* ── Requirement Agent (optional) ── */}
          {phase === 'closed' && (
            <div style={{ border: '1px solid #E5E7EB', background: '#F9FAFB', borderRadius: 14, padding: '10px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <AgentAvatar small />
              <div style={{ flex: 1, minWidth: 0, fontFamily: FONT }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: INK }}>{AGENT_NAME}</div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>I can draft this from a pasted email, a description, or a license ID.</div>
              </div>
              <button type="button" onClick={() => setPhase('open')}
                style={{ background: '#fff', border: `1px solid ${GREEN}`, color: GREEN, borderRadius: 8, padding: '8px 14px', fontSize: 14, fontWeight: 600, fontFamily: FONT, cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={14} /> Use Requirement Agent
              </button>
            </div>
          )}

          {(phase === 'open' || phase === 'working') && (
            <div style={{ border: '1.5px solid #E5E7EB', background: '#F9FAFB', borderRadius: 16, padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <AgentAvatar spinning={phase === 'working'} />
                <div style={{ flex: 1, minWidth: 0, fontFamily: FONT }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: INK }}>{AGENT_NAME}</span>
                    <span style={{ flex: 1 }} />
                    {phase === 'open' && (
                      <button type="button" onClick={startOver} aria-label="Close agent" title="Close"
                        style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', display: 'inline-flex', padding: 2 }}>
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {phase === 'open' && (
                    <>
                      <div style={{ position: 'relative' }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); attachFile(e.dataTransfer.files?.[0]); }}>
                        <textarea
                          autoFocus
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); startAgent(); } }}
                          placeholder="Paste or type requirements here."
                          rows={4}
                          style={{ ...inputStyle, resize: 'vertical', background: '#fff', paddingRight: 52 }}
                        />
                        <button type="button" onClick={startAgent} disabled={!canDraft} aria-label="Draft requirement" title="Draft requirement (Ctrl/Cmd + Enter)"
                          style={{ position: 'absolute', right: 10, bottom: 10, width: 32, height: 32, borderRadius: '50%', border: 'none', background: canDraft ? GREEN : '#C7D9CF', color: '#fff', cursor: canDraft ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ArrowUp size={18} />
                        </button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
                        <input ref={fileRef} type="file" accept=".txt,.eml,.md,.csv,.rtf,.pdf,.doc,.docx" style={{ display: 'none' }} onChange={(e) => attachFile(e.target.files?.[0])} />
                        {fileName ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 999, padding: '4px 6px 4px 10px', fontSize: 13, color: INK }}>
                            <Paperclip size={13} /> {fileName}
                            <button type="button" onClick={removeFile} aria-label="Remove file" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'inline-flex', padding: 2 }}><X size={13} /></button>
                          </span>
                        ) : (
                          <button type="button" onClick={() => fileRef.current?.click()}
                            style={{ background: 'none', border: 'none', color: BLUE, fontSize: 13, fontWeight: 600, fontFamily: FONT, cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                            <Paperclip size={14} /> Attach a file
                          </button>
                        )}
                        {fileUnreadable && <span style={{ fontSize: 12.5, color: '#B45309' }}>The prototype can only read text files (.txt, .eml, .md). Paste this file's text instead.</span>}
                      </div>
                      <div style={{ position: 'relative', marginTop: 10, maxWidth: 420 }}>
                        <input
                          value={licenseId}
                          onChange={(e) => { setLicenseId(e.target.value); setLicOpen(true); }}
                          onFocus={() => setLicOpen(true)}
                          onBlur={() => setTimeout(() => setLicOpen(false), 150)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); startAgent(); } if (e.key === 'Escape') setLicOpen(false); }}
                          placeholder="Pick or enter a License ID (optional, for renewals)"
                          style={{ ...inputStyle, background: '#fff', padding: '8px 12px', width: '100%' }}
                        />
                        {licOpen && (() => {
                          const q = licenseId.trim().toLowerCase();
                          const rows = (q
                            ? LICENSE_REGISTRY.filter((l) => `${l.licenseId} ${l.customer} ${l.city}`.toLowerCase().includes(q))
                            : showAllLic ? [...LICENSE_REGISTRY].sort(byNoticeDate) : needingDecision(6));
                          return (
                            <div style={{ position: 'absolute', zIndex: 20, left: 0, right: 0, top: '100%', marginTop: 4, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: 280, overflowY: 'auto', fontFamily: FONT }}>
                              <div style={{ padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                                {q ? 'Matching licenses' : showAllLic ? 'All licenses, by notification date' : 'Licenses needing a decision in the next 6 months'}
                              </div>
                              {rows.length === 0 && <div style={{ padding: '8px 12px', fontSize: 13, color: '#6B7280' }}>No licenses match.</div>}
                              {rows.map((l) => {
                                const d = l.noticeDate ? daysUntil(l.noticeDate) : null;
                                const late = d != null && d < 0;
                                return (
                                  <button key={l.licenseId} type="button" onMouseDown={(e) => { e.preventDefault(); setLicenseId(l.licenseId); setLicOpen(false); }}
                                    className="hover:bg-gray-50"
                                    style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', gap: 12, textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', borderTop: '1px solid #F3F4F6', cursor: 'pointer' }}>
                                    <span>
                                      <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: INK }}>{l.customer} · {l.city}</span>
                                      <span style={{ display: 'block', fontSize: 12.5, color: '#6B7280' }}>{l.licenseId} · {l.termEnd ? `ends ${fmtShort(l.termEnd)}` : 'auto-renews'}</span>
                                    </span>
                                    <span style={{ fontSize: 12.5, fontWeight: 600, color: late ? '#B91C1C' : '#374151', whiteSpace: 'nowrap', textAlign: 'right' }}>
                                      {l.noticeDate ? `Notify by ${fmtShort(l.noticeDate)}` : 'No notification date'}
                                      <span style={{ display: 'block', fontWeight: 400, color: late ? '#B91C1C' : '#6B7280' }}>{d == null ? 'Auto-renews' : late ? `${-d} days overdue` : d === 0 ? 'today' : `in ${d} days`}</span>
                                    </span>
                                  </button>
                                );
                              })}
                              {!q && (
                                <button type="button" onMouseDown={(e) => { e.preventDefault(); setShowAllLic((v) => !v); }}
                                  style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', borderTop: '1px solid #F3F4F6', color: BLUE, fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                                  {showAllLic ? 'Show only the next 6 months' : 'Show all licenses'}
                                </button>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </>
                  )}

                  {phase === 'working' && <div style={{ fontSize: 14, color: '#374151', padding: '6px 0' }}>{workMsg}</div>}
                </div>
              </div>
            </div>
          )}

          {/* ── Agent summary (after a draft) ── */}
          {agentRun && result && (
            <section aria-label="Requirement Agent summary" style={{ border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 20px', marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)', fontFamily: FONT, color: TEXT, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: TEAL, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={15} /></div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{AGENT_NAME}</span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: '#ecfeff', border: '1px solid #a5f3fc', color: TEAL_TEXT }}>{result.drafts.length > 1 ? 'Drafts ready' : 'Draft ready'}</span>
                <span style={{ flex: 1 }} />
                <span style={{ fontSize: 12, color: MUTED, fontVariantNumeric: 'tabular-nums' }}><b style={{ color: TEXT, fontWeight: 600 }}>{result.filledCount} of {result.totalCount}</b> fields filled</span>
                <div role="img" aria-label={`${result.filledCount} of ${result.totalCount} fields filled`} style={{ width: 88, height: 6, borderRadius: 999, background: BORDER, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.round((result.filledCount / Math.max(1, result.totalCount)) * 100)}%`, height: '100%', background: TEAL, borderRadius: 999 }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
                  {result.drafts.length > 1
                    ? `Drafted ${result.drafts.length} requirements · ${result.drafts.map((d) => d.label).join(' and ')}`
                    : result.license
                      ? `Drafted from license ${result.license.licenseId}${result.sourceText ? ` and ${sourceLabel}` : ''}`
                      : `Drafted from ${sourceLabel}`}
                </p>
                <p style={{ margin: 0, fontSize: 14 }}>
                  {result.license
                    ? 'Customer, location, seats and size carried over. Commercial terms were not.'
                    : 'Review the marked fields, then create the requirement.'}
                </p>
                {result.licenseError && <p style={{ margin: 0, fontSize: 13, color: '#b45309' }}>{result.licenseError}</p>}
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: MUTED }}>
                <Sparkles size={12} color={TEAL_TEXT} aria-hidden="true" /> Agent-filled fields are marked
              </span>
            </section>
          )}

          {/* Draft switcher (multiple locations) */}
          {agentRun && drafts.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {drafts.map((d, i) => (
                <button key={d.id} type="button" onClick={() => setActive(i)}
                  style={{ padding: '8px 16px', borderRadius: 999, fontSize: 14, fontWeight: 600, fontFamily: FONT, cursor: 'pointer', border: `1.5px solid ${i === active ? BLUE : '#D1D5DB'}`, background: i === active ? '#E8F1F8' : '#fff', color: i === active ? BLUE : INK }}>
                  {d.label}
                </button>
              ))}
            </div>
          )}

          {/* ── Needed from customer ── */}
          {agentRun && checklist.length > 0 && (
            <section aria-label="Needed from customer" style={{ border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden', marginBottom: 16, fontFamily: FONT, color: TEXT }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px 12px 20px', borderBottom: `1px solid ${HAIRLINE}` }}>
                <h2 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Needed from customer{drafts.length > 1 ? ` · ${draft.label}` : ''}</h2>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 8px', borderRadius: 999, background: HAIRLINE, color: MUTED, fontVariantNumeric: 'tabular-nums' }}>{checklist.length}</span>
                <span style={{ flex: 1 }} />
                <button type="button"
                  onClick={() => { navigator.clipboard?.writeText(missingDetailsMessage(draft.fields.location ? `${draft.fields.location}` : draft.fields.name, draft.questions, result?.contact)); toast.success('Missing details copied'); }}
                  style={{ height: 30, padding: '0 12px', display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', color: TEXT, fontFamily: FONT, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                  <Copy size={14} /> Copy Missing Details
                </button>
              </div>
              {checklist.map((row, i) => (
                <div key={`${row.field}-${i}`} style={{ display: 'grid', gridTemplateColumns: '160px minmax(0, 1fr)', columnGap: 16, alignItems: 'baseline', padding: '10px 20px', borderBottom: i < checklist.length - 1 ? `1px solid ${HAIRLINE}` : 'none' }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{row.label}</span>
                  <span style={{ fontSize: 13, color: MUTED }}>{row.hint}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#f8f9fa', borderTop: `1px solid ${BORDER}`, fontSize: 12, color: MUTED }}>
                <CheckSquare size={13} aria-hidden="true" />
                <span>On create, a task asks {draft.fields.company.trim() || 'the customer'} for these details.</span>
              </div>
            </section>
          )}

          {agentRun && (
            <div role="group" aria-label="Field view" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              {([[false, `All fields · ${ALL_FIELDS.length}`], [true, `Needs review · ${reviewCount}`]] as const).map(([val, label]) => (
                <button key={label} type="button" aria-pressed={reviewOnly === val} onClick={() => setReviewOnly(val)}
                  style={{ height: 30, padding: '0 12px', borderRadius: 6, border: `1px solid ${reviewOnly === val ? LS_500 : '#d1d5db'}`, background: reviewOnly === val ? '#e6f1f8' : '#fff', color: reviewOnly === val ? LS_500 : TEXT, fontFamily: FONT, fontSize: 13, fontWeight: reviewOnly === val ? 600 : 500, cursor: 'pointer', fontVariantNumeric: 'tabular-nums' }}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* ── The requirement form ── */}
          {(['company'] as FieldKey[]).some(vis) && <div style={sectionStyle}>Deal Details</div>}
          <div style={row2}>
            {vis('company') && field('company')}
            <div>
              <label style={labelStyle}>Status *</label>
              <div style={{ position: 'relative' }}>
                <select value={f.status} onChange={(e) => setField('status', e.target.value)} style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none', paddingRight: 30 }}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <ChevronsUpDown size={13} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#374151' }} />
              </div>
            </div>
          </div>

          {(['name','location','workspaceType','capacity','size','programNeeds','amenityNeeds','configuration','otherFunctional'] as FieldKey[]).some(vis) && <div style={sectionStyle}>Business Requirements</div>}
          {vis('name') && <div style={{ marginBottom: 20 }}>{field('name')}</div>}
          {vis('location') && <div style={{ marginBottom: 20 }}>{field('location')}</div>}
          {vis('workspaceType') && <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Workspace Type{marker('workspaceType')}</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {WORKSPACE_TYPES.map((t) => chip(f.workspaceType === t, t, () => setField('workspaceType', f.workspaceType === t ? '' : t)))}
            </div>
          </div>}
          <div style={row2}>
            {vis('capacity') && field('capacity', 'number')}
            {vis('size') && field('size', 'number')}
          </div>
          {vis('programNeeds') && area('programNeeds', 'Open workstations, 3 meeting rooms, 2 team rooms, and a kitchen/pantry.')}
          {vis('amenityNeeds') && area('amenityNeeds', 'On-site staffed reception, secure badge access, and bookable phone booths.')}
          {vis('configuration') && <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Configuration{marker('configuration')}</label>
            <div style={{ display: 'flex', gap: 12 }}>
              {CONFIGURATIONS.map((c) => chip(f.configuration === c, c, () => setField('configuration', f.configuration === c ? '' : c), true))}
            </div>
          </div>}
          {vis('otherFunctional') && area('otherFunctional', 'Any other functional needs')}

          {(['startDate','termLength','closeDate','budget','otherCommercial'] as FieldKey[]).some(vis) && <div style={sectionStyle}>Commercial Terms</div>}
          <div style={row2}>
            {vis('startDate') && field('startDate', 'date')}
            {vis('termLength') && field('termLength', 'number')}
          </div>
          <div style={row2}>
            {vis('closeDate') && field('closeDate', 'date')}
            {vis('budget') && field('budget', 'number')}
          </div>
          {vis('otherCommercial') && area('otherCommercial', 'Any other commercial terms')}

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
            {dupWarn && (
              <div role="alert" style={{ flexBasis: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, border: '1px solid #E5E7EB', background: '#F9FAFB', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#374151', fontFamily: FONT, marginBottom: 12 }}>
                <span>{dupWarn}</span>
                <span style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button type="button" onClick={() => setDupWarn(null)} style={{ background: 'none', border: 'none', color: BLUE, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Review</button>
                  <button type="button" onClick={create} style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Create anyway</button>
                </span>
              </div>
            )}
            <button type="button" onClick={close} style={{ padding: '10px 16px', borderRadius: 8, border: `1px solid ${BLUE}`, background: '#fff', color: BLUE, fontSize: 15, fontWeight: 500, fontFamily: FONT, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: BLUE, color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: FONT, cursor: 'pointer' }}>
              {drafts.length > 1 ? `Create ${drafts.length} Requirements` : incompleteDrafts.length ? 'Save as Draft' : 'Create Requirement'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
