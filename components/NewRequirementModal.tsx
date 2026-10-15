import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { X, ChevronsUpDown, Bot, Loader2, Sparkles, Copy, ArrowUp } from 'lucide-react';
import { toast } from './ui/toast';
import {
  AGENT_NAME, REQUIRED, FIELD_LABEL,
  runIntake, licenseTermsReference,
  type IntakeDraft, type IntakeFields, type IntakeResult, type FieldKey, type Provenance,
} from './data/intakeAgent';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const INK = '#0F2A3D';
const GREEN = '#0F7B4F';
const STATUSES = ['Active', 'Draft', 'Executed', 'Archived'];
const WORKSPACE_TYPES = ['Office Suite', 'Private Office', 'Team Office', 'Coworking', 'Meeting Space'];
const CONFIGURATIONS = ['Single space', 'Collection of spaces'];

export type NewRequirementData = IntakeFields & {
  /** Present when the Requirements Intake Agent drafted this requirement. */
  intake?: { sourceText: string; questions: string[]; licenseId?: string };
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
  source: { color: GREEN, text: 'from your text' },
  license: { color: BLUE, text: 'from the license' },
  suggested: { color: '#B45309', text: 'suggested, please confirm' },
};

function AgentAvatar({ spinning, small }: { spinning?: boolean; small?: boolean }) {
  const size = small ? 34 : 40;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {spinning ? <Loader2 size={22} color="#059669" className="animate-spin" /> : <Bot size={small ? 20 : 24} color="#059669" />}
    </div>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (items: NewRequirementData[]) => void;
}

type Phase = 'closed' | 'open' | 'working' | 'review';

export function NewRequirementModal({ isOpen, onClose, onCreate }: Props) {
  const [phase, setPhase] = useState<Phase>('closed');
  const [text, setText] = useState('');
  const [licenseId, setLicenseId] = useState('');
  const [workMsg, setWorkMsg] = useState('');
  const [result, setResult] = useState<IntakeResult | null>(null);
  const [drafts, setDrafts] = useState<IntakeDraft[]>([manualDraft()]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setPhase('closed'); setText(''); setLicenseId(''); setResult(null); setDrafts([manualDraft()]); setActive(0);
  }, [isOpen]);

  const close = () => onClose();
  const draft = drafts[active] ?? drafts[0];
  const agentRun = phase === 'review' && result !== null;

  const startAgent = () => {
    if (!text.trim() && !licenseId.trim()) return;
    setPhase('working');
    const steps = [
      licenseId.trim() ? `Pulling license ${licenseId.trim().toUpperCase()}…` : 'Reading what you pasted…',
      'Pulling out the requirement details…',
      'Checking what is missing…',
    ];
    setWorkMsg(steps[0]);
    steps.forEach((s, i) => setTimeout(() => setWorkMsg(s), i * 700));
    setTimeout(() => {
      const r = runIntake(text, licenseId);
      setResult(r);
      setDrafts(r.drafts);
      setActive(0);
      setPhase('review');
    }, steps.length * 700);
  };

  const startOver = () => { setPhase('closed'); setResult(null); setDrafts([manualDraft()]); setActive(0); setText(''); setLicenseId(''); };

  const setField = (k: FieldKey, v: string) =>
    setDrafts((ds) => ds.map((d, i) => {
      if (i !== active) return d;
      const prov = { ...d.prov };
      delete prov[k];
      return { ...d, fields: { ...d.fields, [k]: v }, prov };
    }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    for (let i = 0; i < drafts.length; i++) {
      const missing = REQUIRED.filter((k) => !drafts[i].fields[k].trim());
      if (missing.length) {
        setActive(i);
        const who = drafts.length > 1 ? `${drafts[i].label}: ` : '';
        toast.error(`${who}please fill ${missing.map((k) => FIELD_LABEL[k]).join(', ')}.`);
        return;
      }
    }
    onCreate?.(
      drafts.map((d) => ({
        ...d.fields,
        intake: agentRun && result ? { sourceText: result.sourceText, questions: d.questions, licenseId: result.license?.licenseId } : undefined,
      })),
    );
    close();
  };

  const marker = (k: FieldKey) => {
    const p = draft.prov[k];
    if (!p) return null;
    const m = MARK[p.kind];
    return (
      <span title={`${m.text}: ${p.note}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 600, color: m.color, background: '#F0FAF4', border: `1px solid ${m.color}33`, borderRadius: 999, padding: '1px 7px', cursor: 'help' }}>
        <Sparkles size={10} /> {p.kind === 'suggested' ? 'Suggested' : 'Agent'}
      </span>
    );
  };
  const missingFlag = (k: FieldKey) => agentRun && REQUIRED.includes(k) && !draft.fields[k];

  const field = (k: FieldKey, type = 'text') => (
    <div>
      <label style={labelStyle}>{FIELD_LABEL[k]}{REQUIRED.includes(k) ? ' *' : ''}{marker(k)}</label>
      <input
        type={type}
        value={draft.fields[k]}
        onChange={(e) => setField(k, e.target.value)}
        style={{ ...inputStyle, borderColor: draft.prov[k] ? `${MARK[draft.prov[k]!.kind].color}66` : missingFlag(k) ? '#F5C27A' : '#D1D5DB' }}
      />
      {missingFlag(k) && <div style={{ fontSize: 12, color: '#B45309', marginTop: 5, fontFamily: FONT }}>Not stated. Add it or ask the customer.</div>}
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
        style={{ ...inputStyle, resize: 'vertical', borderColor: draft.prov[k] ? `${MARK[draft.prov[k]!.kind].color}66` : '#D1D5DB' }}
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
  const canDraft = !!(text.trim() || licenseId.trim());

  return (
    <Dialog open={isOpen} onOpenChange={(o) => { if (!o) close(); }}>
      <DialogContent className="sm:max-w-[760px] p-0 overflow-hidden [&>button]:hidden" style={{ borderRadius: 24, border: 'none', maxHeight: '92vh' }}>
        <DialogDescription className="sr-only">Create a new workspace requirement</DialogDescription>
        <div style={{ background: BLUE, padding: '20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <DialogTitle style={{ color: '#fff', fontSize: 24, fontWeight: 700, fontFamily: FONT }}>Create New Requirement</DialogTitle>
          <button type="button" onClick={close} aria-label="Close" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <form onSubmit={submit} style={{ padding: '16px 20px 28px', overflowY: 'auto', maxHeight: 'calc(92vh - 72px)' }}>
          {/* ── Requirements Intake Agent (optional) ── */}
          {phase === 'closed' && (
            <div style={{ border: '1px solid #BFE5CC', background: '#F0FAF4', borderRadius: 14, padding: '10px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <AgentAvatar small />
              <div style={{ flex: 1, minWidth: 0, fontFamily: FONT }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: INK }}>{AGENT_NAME}</div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>I can draft this from a pasted email, a description, or a license ID.</div>
              </div>
              <button type="button" onClick={() => setPhase('open')}
                style={{ background: '#fff', border: `1px solid ${GREEN}`, color: GREEN, borderRadius: 8, padding: '8px 14px', fontSize: 14, fontWeight: 600, fontFamily: FONT, cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={14} /> Use Requirement Intake Agent
              </button>
            </div>
          )}

          {phase !== 'closed' && (
            <div style={{ border: '1.5px solid #BFE5CC', background: '#F0FAF4', borderRadius: 16, padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <AgentAvatar spinning={phase === 'working'} />
                <div style={{ flex: 1, minWidth: 0, fontFamily: FONT }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: INK }}>{AGENT_NAME}</span>
                    <span style={{ background: '#2E9D4A', color: '#fff', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999 }}>Agent</span>
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
                      <div style={{ position: 'relative' }}>
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
                      <input
                        value={licenseId}
                        onChange={(e) => setLicenseId(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); startAgent(); } }}
                        placeholder="License ID (optional, for renewals)"
                        style={{ ...inputStyle, background: '#fff', marginTop: 10, padding: '8px 12px', maxWidth: 300 }}
                      />
                    </>
                  )}

                  {phase === 'working' && <div style={{ fontSize: 14, color: '#374151', padding: '6px 0' }}>{workMsg}</div>}

                  {phase === 'review' && result && (
                    <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.55 }}>
                      {result.drafts.length > 1
                        ? <>I drafted <b>{result.drafts.length} requirements</b> ({result.drafts.map((d) => d.label).join(' and ')}). </>
                        : <>I've drafted your requirement. </>}
                      I filled <b>{result.filledCount} of {result.totalCount}</b> fields, marked <span style={{ color: GREEN, fontWeight: 600 }}>✦</span>. Review and edit anything, then create.
                      {result.license && (
                        <div style={{ fontSize: 13, color: '#6B7280', marginTop: 6 }}>
                          I used the location, seats and size from license <b>{result.license.licenseId}</b>, but not its commercial terms.
                        </div>
                      )}
                      {result.licenseError && <div style={{ fontSize: 13, color: '#B45309', marginTop: 6 }}>{result.licenseError}</div>}
                      <button type="button" onClick={startOver} style={{ background: 'none', border: 'none', color: BLUE, fontSize: 13, fontWeight: 600, fontFamily: FONT, cursor: 'pointer', padding: 0, marginTop: 8 }}>
                        Start over
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
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

          {/* License reference */}
          {agentRun && result?.license && (
            <div style={{ border: '1px dashed #9CC3E0', background: '#F5FAFE', borderRadius: 12, padding: '12px 16px', marginBottom: 16, fontFamily: FONT }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: BLUE, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                Current license {result.license.licenseId} · reference only, not applied
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
                {licenseTermsReference(result.license).map((t) => (
                  <div key={t.label}>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{t.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{t.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Questions for the customer */}
          {agentRun && draft.questions.length > 0 && (
            <div style={{ border: '1px solid #F5C27A', background: '#FFF9ED', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontFamily: FONT }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#92400E' }}>
                  Questions for the customer{drafts.length > 1 ? ` (${draft.label})` : ''}
                </div>
                <button type="button" onClick={() => { navigator.clipboard?.writeText(draft.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')); toast.success('Questions copied.'); }}
                  style={{ background: 'none', border: 'none', color: BLUE, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Copy size={13} /> Copy
                </button>
              </div>
              <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#374151', lineHeight: 1.7 }}>
                {draft.questions.map((q) => <li key={q}>{q}</li>)}
              </ol>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 6 }}>I'll save these with the requirement as an open-questions note.</div>
            </div>
          )}

          {/* ── The requirement form ── */}
          <div style={sectionStyle}>Deal Details</div>
          <div style={row2}>
            {field('company')}
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

          <div style={sectionStyle}>Business Requirements</div>
          <div style={{ marginBottom: 20 }}>{field('name')}</div>
          <div style={{ marginBottom: 20 }}>{field('location')}</div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Workspace Type{marker('workspaceType')}</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {WORKSPACE_TYPES.map((t) => chip(f.workspaceType === t, t, () => setField('workspaceType', f.workspaceType === t ? '' : t)))}
            </div>
          </div>
          <div style={row2}>
            {field('capacity', 'number')}
            {field('size', 'number')}
          </div>
          {area('programNeeds', 'Open workstations, 3 meeting rooms, 2 team rooms, and a kitchen/pantry.')}
          {area('amenityNeeds', 'On-site staffed reception, secure badge access, and bookable phone booths.')}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Configuration{marker('configuration')}</label>
            <div style={{ display: 'flex', gap: 12 }}>
              {CONFIGURATIONS.map((c) => chip(f.configuration === c, c, () => setField('configuration', f.configuration === c ? '' : c), true))}
            </div>
          </div>
          {area('otherFunctional', 'Any other functional needs')}

          <div style={sectionStyle}>Commercial Terms</div>
          <div style={row2}>
            {field('startDate', 'date')}
            {field('termLength', 'number')}
          </div>
          <div style={row2}>
            {field('closeDate', 'date')}
            {field('budget', 'number')}
          </div>
          {area('otherCommercial', 'Any other commercial terms')}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
            <button type="button" onClick={close} style={{ padding: '10px 16px', borderRadius: 8, border: `1px solid ${BLUE}`, background: '#fff', color: BLUE, fontSize: 15, fontWeight: 500, fontFamily: FONT, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: BLUE, color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: FONT, cursor: 'pointer' }}>
              {drafts.length > 1 ? `Create ${drafts.length} Requirements` : 'Create Requirement'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
