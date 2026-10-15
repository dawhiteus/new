import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { X, ChevronsUpDown, Sparkles, Copy } from 'lucide-react';
import { toast } from './ui/toast';
import { RequirementTimelineTab } from './RequirementTimelineTab';
import { RequirementDocumentsTab } from './RequirementDocumentsTab';
import { RequirementTeamTab } from './RequirementTeamTab';
import { RequirementWorkflowTab } from './RequirementWorkflowTab';
import { STAGES, ACTIVE_REQUIRED, ACTIVE_REQUIRED_LABEL, type MvpRequirement, type RequirementDetails, type WorkflowTask, type TeamMember, type RequirementDocument, type TimelineEvent, CURRENT_USER_EMAIL } from './data/mvpRequirements';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const INK = '#0F2A3D';
const STATUSES = ['Active', 'Draft', 'Executed', 'Archived'];
const WORKSPACE_TYPES = ['Office Suite', 'Private Office', 'Team Office', 'Coworking', 'Meeting Space'];
const CONFIGURATIONS = ['Single space', 'Collection of spaces'];
const TABS = ['Overview', 'Workflow', 'Team', 'Documents', 'Timeline'] as const;
type Tab = (typeof TABS)[number];

const STATUS_BG: Record<string, string> = { Active: '#2E9D4A', Draft: '#9CA3AF', Executed: '#005B94', Archived: '#6B7280' };

const input: React.CSSProperties = {
  width: '100%', border: '1px solid #D1D5DB', borderRadius: 8, padding: '9px 12px', fontSize: 15,
  fontFamily: FONT, color: INK, background: '#fff', outline: 'none',
};
const disabledInput: React.CSSProperties = { ...input, background: '#E5E7EB', color: '#6B7280', cursor: 'not-allowed' };
const label: React.CSSProperties = { display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8, fontFamily: FONT };
const section: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: BLUE, textTransform: 'uppercase',
  borderBottom: '1px solid #E5E7EB', paddingBottom: 6, margin: '8px 0 16px', fontFamily: FONT,
};
const primaryBtn: React.CSSProperties = {
  background: BLUE, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 15,
  fontWeight: 600, fontFamily: FONT, cursor: 'pointer',
};

interface FormState extends RequirementDetails {
  company: string;
  status: string;
  stage: string;
  name: string;
  budget: string;
}

const toForm = (r: MvpRequirement): FormState => ({
  ...r.details,
  company: r.company,
  status: r.status,
  stage: r.stage,
  name: r.name,
  budget: r.budget == null ? '' : String(r.budget),
});

const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return iso ? `${m}/${d}/${y}` : '';
};

function Select({ value, onChange, options, disabled }: { value: string; onChange?: (v: string) => void; options: string[]; disabled?: boolean }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        style={{ ...(disabled ? disabledInput : input), appearance: 'none', WebkitAppearance: 'none', paddingRight: 30 }}
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronsUpDown size={13} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: disabled ? '#6B7280' : '#374151' }} />
    </div>
  );
}

interface Props {
  requirement: MvpRequirement | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: MvpRequirement) => void;
}

export function RequirementDetailsModal({ requirement, isOpen, onClose, onSave }: Props) {
  const [tab, setTab] = useState<Tab>('Overview');
  const [f, setF] = useState<FormState | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen && requirement) {
      setF(toForm(requirement));
      setTab('Overview');
      setNote('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, requirement?.id]);

  if (!requirement || !f) return null;

  const withoutMark = (p: FormState, k: keyof FormState): FormState['provenance'] => {
    if (!p.provenance || !(k in p.provenance)) return p.provenance;
    const next = { ...p.provenance };
    delete next[k as string];
    return next;
  };
  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((p) => (p ? { ...p, [k]: e.target.value, provenance: withoutMark(p, k) } : p));
  const setVal = (k: keyof FormState, v: string) => setF((p) => (p ? { ...p, [k]: v, provenance: withoutMark(p, k) } : p));

  const buildUpdated = (form: FormState = f): MvpRequirement => {
    const { company, status, stage, name, budget, ...details } = form;
    return {
      ...requirement,
      company,
      name,
      status: status as MvpRequirement['status'],
      stage,
      budget: budget.trim() === '' ? null : Number(budget),
      city: details.location.trim(),
      lastUpdated: new Date().toISOString().slice(0, 10),
      details,
    };
  };

  const today = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const ev = (type: TimelineEvent['type'], title: string, description: string): TimelineEvent => ({
    id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, type, title, description, date: today(), actor: CURRENT_USER_EMAIL,
  });
  /** Apply a change, log timeline events for it, and persist to the table row. */
  const commit = (patch: Partial<FormState>, events: TimelineEvent[]) => {
    const next = { ...f, ...patch, events: [...f.events, ...events] };
    setF(next);
    onSave(buildUpdated(next));
  };

  const missingActive = (form: FormState) => ACTIVE_REQUIRED.filter((k) => !String(form[k] ?? '').trim());

  const save = () => {
    // Saving progress never loses anything. If required details are still missing, the requirement stays (or becomes) a Draft.
    const missing = missingActive(f);
    const forcedDraft = missing.length > 0 && f.status !== 'Draft';
    commit(
      forcedDraft ? { status: 'Draft' } : {},
      [ev('update', 'Requirement Updated', `${f.name} requirement details were updated.`)],
    );
    toast.success(
      missing.length
        ? `Progress saved. ${forcedDraft ? 'Kept as a Draft: ' : 'Not provided yet: '}${missing.map((k) => ACTIVE_REQUIRED_LABEL[k]).join(', ')}.`
        : 'Requirement updated.',
    );
  };

  const addNote = () => {
    if (!note.trim()) return;
    commit(
      { notes: [...f.notes, { author: 'You', date: today(), text: note.trim() }] },
      [ev('note', 'Note Added', 'A note was added to the requirement.')],
    );
    setNote('');
  };

  const onTasks = (tasks: WorkflowTask[]) => {
    const old = new Map(f.tasks.map((t) => [t.id, t]));
    const events: TimelineEvent[] = [];
    tasks.forEach((t) => {
      const o = old.get(t.id);
      if (!o) events.push(ev('task', 'Task Added', `'${t.name}' added to ${t.stage}.`));
      else if (o.status !== t.status) events.push(ev('task', 'Task Updated', `'${t.name}' updated in ${t.stage}: Status was changed from ${o.status} to ${t.status}`));
    });
    f.tasks.filter((t) => !tasks.some((x) => x.id === t.id)).forEach((t) => events.push(ev('task', 'Task Removed', `'${t.name}' removed from ${t.stage}.`)));
    commit({ tasks }, events);
  };
  const onTeam = (team: TeamMember[]) => {
    const events: TimelineEvent[] = [
      ...team.filter((m) => !f.team.some((x) => x.id === m.id)).map((m) => ev('team', 'Team Member Added', `${m.name} added to the requirement team.`)),
      ...f.team.filter((m) => !team.some((x) => x.id === m.id)).map((m) => ev('team', 'Team Member Removed', `${m.name} removed from the requirement team.`)),
    ];
    commit({ team }, events);
  };
  const onDocs = (documents: RequirementDocument[]) => {
    const events: TimelineEvent[] = [
      ...documents.filter((d) => !f.documents.some((x) => x.id === d.id)).map((d) => ev('document', 'Document Uploaded', `${d.name} uploaded to the requirement.`)),
      ...f.documents.filter((d) => !documents.some((x) => x.id === d.id)).map((d) => ev('document', 'Document Removed', `${d.name} removed from the requirement.`)),
    ];
    commit({ documents }, events);
  };

  const text = (k: keyof FormState, opts: { type?: string; disabled?: boolean } = {}) => (
    <input type={opts.type || 'text'} value={String(f[k] ?? '')} onChange={set(k)} disabled={opts.disabled} style={opts.disabled ? disabledInput : input} />
  );
  const mark = (k: keyof FormState) => {
    const p = f.provenance?.[k as string];
    if (!p) return null;
    const color = p.kind === 'source' ? '#0F7B4F' : p.kind === 'license' ? BLUE : '#B45309';
    const what = p.kind === 'source' ? 'from the customer input' : p.kind === 'license' ? 'from the license' : 'suggested, please confirm';
    return (
      <span title={`${what}: ${p.note}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color, background: '#F0FAF4', border: `1px solid ${color}33`, borderRadius: 999, padding: '2px 6px', marginLeft: 8, cursor: 'help', verticalAlign: 'middle' }}>
        <Sparkles size={11} />
      </span>
    );
  };
  const notProvided = (k: keyof FormState) =>
    (ACTIVE_REQUIRED as readonly string[]).includes(k as string) && k !== 'name' && !String(f[k] ?? '').trim() ? (
      <div style={{ fontSize: 12, color: '#B45309', marginTop: 5, fontFamily: FONT }}>Not provided</div>
    ) : null;
  const field = (l: string, node: React.ReactNode, k?: keyof FormState) => (
    <div><label style={label}>{l}{k === 'name' ? ' *' : ''}{k && mark(k)}</label>{node}{k && notProvided(k)}</div>
  );
  const area = (l: string, k: keyof FormState, ph: string) => (
    <div style={{ marginBottom: 18 }}>
      <label style={label}>{l}{mark(k)}</label>
      <textarea value={String(f[k] ?? '')} onChange={set(k)} placeholder={ph} rows={3} style={{ ...input, resize: 'vertical' }} />
    </div>
  );
  const chip = (selected: boolean, l: string, onClick: () => void, grow = false) => (
    <button
      key={l}
      type="button"
      onClick={onClick}
      style={{
        flex: grow ? 1 : undefined, padding: grow ? '11px' : '8px 14px', borderRadius: grow ? 8 : 999,
        border: `1px solid ${selected ? BLUE : '#D1D5DB'}`, background: selected ? '#EAF3FB' : '#fff',
        color: selected ? BLUE : INK, fontSize: 14, fontWeight: selected ? 600 : 500, fontFamily: FONT, cursor: 'pointer',
      }}
    >
      {l}
    </button>
  );
  const grid3: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20, marginBottom: 20 };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        className="sm:max-w-[820px] p-0 overflow-hidden [&>button]:hidden flex flex-col gap-0"
        style={{ borderRadius: 24, border: 'none', maxHeight: '94vh' }}
      >
        <DialogDescription className="sr-only">Requirement details</DialogDescription>
        <div style={{ background: BLUE, padding: '16px 16px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <DialogTitle style={{ color: '#fff', fontSize: 24, fontWeight: 700, fontFamily: FONT }}>Requirement Details</DialogTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ background: STATUS_BG[requirement.status], color: '#fff', fontSize: 13, fontWeight: 600, padding: '3px 12px', borderRadius: 999 }}>{requirement.status}</span>
            <button type="button" onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 32, padding: '0 20px', borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '22px 0 12px', fontFamily: FONT, fontSize: 16,
                fontWeight: tab === t ? 600 : 500, color: tab === t ? BLUE : '#6B7280',
                borderBottom: `2px solid ${tab === t ? BLUE : 'transparent'}`, marginBottom: -1,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ overflowY: 'auto', padding: '20px 20px 28px', background: '#fff' }}>
          {tab === 'Workflow' ? (
            <RequirementWorkflowTab
              status={requirement.status}
              currentStage={requirement.stage}
              lastUpdated={requirement.lastUpdated}
              tasks={f.tasks}
              onChange={onTasks}
            />
          ) : tab === 'Team' ? (
            <RequirementTeamTab
              team={f.team}
              onChange={onTeam}
            />
          ) : tab === 'Documents' ? (
            <RequirementDocumentsTab
              documents={f.documents}
              onChange={onDocs}
            />
          ) : tab === 'Timeline' ? (
            <RequirementTimelineTab events={f.events} />
          ) : tab !== 'Overview' ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#9CA3AF', fontFamily: FONT, fontSize: 15 }}>
              {tab} tab coming next.
            </div>
          ) : (
            <>
              {requirement.origin && (
                <div style={{ background: '#ECFDF3', border: '1px solid #A7E3BE', borderRadius: 12, padding: '12px 16px', marginBottom: 16, fontFamily: FONT }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#166534' }}>
                    {requirement.origin.reqId} · Originated in Workplace Strategist (Hub Locator)
                  </div>
                  {requirement.origin.summary.length > 0 && (
                    <div style={{ fontSize: 13, color: '#166534', marginTop: 4 }}>{requirement.origin.summary.join(' · ')}</div>
                  )}
                  {requirement.origin.backUrl && (
                    <a href={requirement.origin.backUrl} style={{ display: 'inline-block', marginTop: 6, fontSize: 13, fontWeight: 600, color: BLUE }}>← Back to Hub Locator</a>
                  )}
                </div>
              )}
              <div style={{ fontSize: 20, fontWeight: 700, color: INK, fontFamily: FONT }}>Requirement Details</div>
              <div style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 16px', fontFamily: FONT }}>
                Authoritative summary of client requirements and deal parameters
              </div>

              {f.intake && f.intake.questions.length > 0 && requirement.status === 'Draft' && (
                <div style={{ border: '1px solid #F5C27A', background: '#FFF9ED', borderRadius: 12, padding: '12px 16px', marginBottom: 16, fontFamily: FONT }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#92400E' }}>Questions for the customer</div>
                    <button type="button" onClick={() => { navigator.clipboard?.writeText(f.intake!.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')); toast.success('Questions copied.'); }}
                      style={{ background: 'none', border: 'none', color: BLUE, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <Copy size={13} /> Copy
                    </button>
                  </div>
                  <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#374151', lineHeight: 1.7 }}>
                    {f.intake.questions.map((q) => <li key={q}>{q}</li>)}
                  </ol>
                </div>
              )}

              <div style={{ border: '1px solid #E5E7EB', borderRadius: 16, padding: '16px 24px 24px' }}>
                <div style={section}>Deal Details</div>
                <div style={grid3}>
                  {field('Company', text('company'), 'company')}
                  {field('Deal ID', text('dealId'))}
                  {field('Status', <Select value={f.status} onChange={(v) => setVal('status', v)} options={STATUSES} />)}
                  {field('Current Stage', <Select value={f.stage} options={[...STAGES]} disabled />)}
                  {field('Created Date', <input value={fmtDate(f.createdDate)} disabled style={disabledInput} />)}
                </div>

                <div style={section}>Business Requirements</div>
                <div style={{ marginBottom: 20 }}>{field('Requirement Name', text('name'), 'name')}</div>
                <div style={grid3}>
                  {field('Location', text('location'), 'location')}
                  {field('Capacity / Headcount', text('capacity', { type: 'number' }), 'capacity')}
                  {field('Size (sq ft)', text('size', { type: 'number' }), 'size')}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={label}>Workspace Type{mark('workspaceType')}</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {WORKSPACE_TYPES.map((t) => chip(f.workspaceType === t, t, () => setVal('workspaceType', f.workspaceType === t ? '' : t)))}
                  </div>
                </div>
                {area('Program Needs', 'programNeeds', 'Open workstations, 3 meeting rooms, 2 team rooms, and a kitchen/pantry.')}
                {area('Amenity Needs', 'amenityNeeds', 'On-site staffed reception, secure badge access, and bookable phone booths.')}
                <div style={{ marginBottom: 20 }}>
                  <label style={label}>Configuration{mark('configuration')}</label>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {CONFIGURATIONS.map((c) => chip(f.configuration === c, c, () => setVal('configuration', f.configuration === c ? '' : c), true))}
                  </div>
                </div>
                {area('Other Functional Requirements', 'otherFunctional', 'Any other functional needs')}

                <div style={section}>Commercial Terms</div>
                <div style={grid3}>
                  {field('Start Date', text('startDate', { type: 'date' }), 'startDate')}
                  {field('Term Length (mos)', text('termLength', { type: 'number' }), 'termLength')}
                  {field('Expected Close Date', text('closeDate', { type: 'date' }), 'closeDate')}
                </div>
                <div style={{ ...grid3, marginBottom: 20 }}>
                  {field(
                    'Budget',
                    <div style={{ display: 'flex' }}>
                      <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px', background: '#E5E7EB', border: '1px solid #D1D5DB', borderRight: 'none', borderRadius: '8px 0 0 8px', color: '#374151', fontSize: 15 }}>$</span>
                      <input type="number" value={f.budget} onChange={set('budget')} style={{ ...input, borderRadius: '0 8px 8px 0' }} />
                    </div>,
                    'budget',
                  )}
                </div>
                {area('Other Commercial Requirements', 'otherCommercial', 'Any other commercial terms')}
                <button onClick={save} style={primaryBtn}>Save Changes</button>
              </div>

              <div style={{ border: '1px solid #E5E7EB', borderRadius: 16, padding: 24, marginTop: 24 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: INK, fontFamily: FONT, marginBottom: 16 }}>Requirement notes</div>
                {f.notes.map((n, i) => (
                  <div key={i} style={{ background: '#F8F9FA', borderRadius: 4, padding: '12px 12px', marginBottom: 12, fontFamily: FONT }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B7280', marginBottom: 6 }}>
                      <span>{n.author}</span><span>{n.date}</span>
                    </div>
                    <div style={{ fontSize: 15, color: INK, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{n.text}</div>
                  </div>
                ))}
                <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Enter note" rows={3} style={{ ...input, resize: 'vertical', marginBottom: 14 }} />
                <button onClick={addNote} style={primaryBtn}>Add Note</button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
