import React, { useState } from 'react';
import { Check, Trash2, User, Calendar, ChevronsUpDown, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { STAGES, type WorkflowTask, type TaskStatus } from './data/mvpRequirements';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const INK = '#0F2A3D';
const GREEN = '#2E9D4A';
const ASSIGNEES = ['Unassigned', 'Brent Trebels', 'David White', 'Create Collection Agent', 'Assess Collection Agent'];

const STATUS_STYLE: Record<TaskStatus, string> = {
  Completed: GREEN,
  'In Progress': BLUE,
  'Not Started': '#F26B21',
};

const fmtDate = (iso: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${m}/${d}/${y}`;
};
const fmtLong = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

function Badge({ label, bg }: { label: string; bg: string }) {
  return (
    <span style={{ background: bg, color: '#fff', fontSize: 13, fontWeight: 600, padding: '3px 14px', borderRadius: 999, whiteSpace: 'nowrap', fontFamily: FONT }}>
      {label}
    </span>
  );
}

interface Props {
  status: string;
  currentStage: string;
  lastUpdated: string;
  tasks: WorkflowTask[];
  onChange: (tasks: WorkflowTask[]) => void;
}

const fieldInput: React.CSSProperties = {
  width: '100%', border: '1.5px solid #0F2A3D', borderRadius: 8, padding: '12px 14px', fontSize: 15,
  fontFamily: FONT, color: INK, background: '#fff', outline: 'none',
};
const fieldLabel: React.CSSProperties = { display: 'block', fontSize: 15, fontWeight: 600, color: INK, marginBottom: 8, fontFamily: FONT };

export function RequirementWorkflowTab({ status, currentStage, lastUpdated, tasks, onChange }: Props) {
  const [addStage, setAddStage] = useState<string | null>(null);
  const [draft, setDraft] = useState({ name: '', dueDate: '', assignee: 'Unassigned', dependsOn: '', description: '' });

  const byStage = (s: string) => tasks.filter((t) => t.stage === s);
  const isComplete = (s: string) => byStage(s).length > 0 && byStage(s).every((t) => t.status === 'Completed');
  const currentIdx = STAGES.indexOf(currentStage as (typeof STAGES)[number]);

  const toggle = (id: string) =>
    onChange(tasks.map((t) => (t.id === id ? { ...t, status: t.status === 'Completed' ? 'Not Started' : 'Completed' } : t)));
  const remove = (id: string) => onChange(tasks.filter((t) => t.id !== id));

  const openAdd = (s: string) => {
    setDraft({ name: '', dueDate: '', assignee: 'Unassigned', dependsOn: '', description: '' });
    setAddStage(s);
  };
  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addStage || !draft.name.trim()) return;
    onChange([
      ...tasks,
      {
        id: `task-${Date.now()}`,
        stage: addStage,
        name: draft.name.trim(),
        description: draft.description.trim(),
        status: 'Not Started',
        assignee: draft.assignee === 'Unassigned' ? '' : draft.assignee,
        dueDate: draft.dueDate,
        dependsOn: draft.dependsOn.trim(),
      },
    ]);
    setAddStage(null);
  };

  const card: React.CSSProperties = { border: '1px solid #E5E7EB', borderRadius: 16, background: '#fff' };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: INK, fontFamily: FONT }}>Workflow Details</div>
          <div style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 16px', fontFamily: FONT }}>
            Tasks are the unit of work. Tasks can be completed by people or by agents.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4 }}>
          <Badge label={status} bg={STATUS_STYLE.Completed} />
          <span style={{ fontSize: 14, color: '#6B7280', fontFamily: FONT }}>• Last updated {fmtLong(lastUpdated)}</span>
        </div>
      </div>

      {/* Stage progress */}
      <div style={{ ...card, padding: '24px 24px 20px', marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#6B7280', letterSpacing: '0.02em', textTransform: 'uppercase', marginBottom: 20, fontFamily: FONT }}>
          Requirement stage progress
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          {STAGES.map((s, i) => {
            const done = isComplete(s);
            const current = i === currentIdx && !done;
            return (
              <div key={s} style={{ width: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <div style={{ position: 'relative', zIndex: 1, width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? GREEN : '#fff',
                  border: done ? 'none' : current ? `6px solid #0B4F7F` : '2px solid #D1D5DB',
                  boxSizing: 'border-box' }}>
                  {done ? <Check size={22} color="#fff" strokeWidth={2.5} /> : current ? <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff' }} /> : <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #9CA3AF' }} />}
                </div>
                <div style={{ fontSize: 13, color: INK, marginTop: 8, fontFamily: FONT, textAlign: 'center', whiteSpace: 'nowrap' }}>{s}</div>
                <div style={{ fontSize: 13, color: INK, marginTop: 6, fontFamily: FONT }}>{byStage(s).length}</div>
              </div>
            );
          })}
          {/* connector lines */}
          <div style={{ position: 'absolute', top: 23, left: 24, right: 24, height: 2, background: '#E5E7EB', zIndex: 0 }}>
            <div style={{ height: 2, background: GREEN, width: `${Math.max(0, Math.min(currentIdx, STAGES.length - 1)) / (STAGES.length - 1) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Stage task cards */}
      {STAGES.map((s) => {
        const list = byStage(s);
        const doneCount = list.filter((t) => t.status === 'Completed').length;
        const pct = list.length ? (doneCount / list.length) * 100 : 0;
        return (
          <div key={s} style={{ ...card, padding: '24px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: INK, fontFamily: FONT }}>Stage Tasks: {s}</span>
                <span style={{ fontSize: 15, color: '#6B7280', fontFamily: FONT }}>({list.length})</span>
                {isComplete(s) && <Badge label="Complete" bg={GREEN} />}
              </div>
              <button
                onClick={() => openAdd(s)}
                style={{ background: '#0B4F7F', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 14px', fontSize: 14, fontWeight: 600, fontFamily: FONT, cursor: 'pointer' }}
              >
                + Add Task
              </button>
            </div>

            {list.map((t) => (
              <div key={t.id} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 16px', marginBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <button
                  aria-label={`Toggle ${t.name}`}
                  onClick={() => toggle(t.id)}
                  style={{ marginTop: 4, width: 20, height: 20, borderRadius: 4, flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: t.status === 'Completed' ? GREEN : '#fff', border: t.status === 'Completed' ? 'none' : '1.5px solid #D1D5DB' }}
                >
                  {t.status === 'Completed' && <Check size={14} color="#fff" strokeWidth={3} />}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: INK, fontFamily: FONT }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4, fontFamily: FONT }}>{t.description}</div>
                  {t.output && (
                    <div style={{ marginTop: 10, background: '#F8F9FA', border: '1px solid #E5E7EB', borderRadius: 8, padding: '8px 12px', fontFamily: FONT }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Notes</div>
                      <div style={{ fontSize: 13, color: INK, lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{t.output}</div>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 14, marginTop: 8, color: '#6B7280', fontSize: 12, fontFamily: FONT }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><User size={13} />{t.assignee}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Calendar size={13} />{fmtDate(t.dueDate)}</span>
                  </div>
                </div>
                <Badge label={t.status} bg={STATUS_STYLE[t.status]} />
                <button aria-label={`Delete ${t.name}`} onClick={() => remove(t.id)} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '2px 4px' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {list.length > 0 && (
              <div style={{ borderTop: '1px solid #E5E7EB', marginTop: 4, paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontFamily: FONT, marginBottom: 8 }}>
                  <span style={{ color: '#6B7280' }}>Work Completed</span>
                  <span style={{ fontWeight: 700, color: INK }}>{doneCount} of {list.length} task{list.length === 1 ? '' : 's'}</span>
                </div>
                <div style={{ height: 8, background: '#E5E7EB' }}>
                  <div style={{ height: 8, width: `${pct}%`, background: GREEN, transition: 'width 0.2s' }} />
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Add Task dialog */}
      <Dialog open={addStage !== null} onOpenChange={(o) => { if (!o) setAddStage(null); }}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden [&>button]:hidden gap-0" style={{ borderRadius: 24, border: 'none' }}>
          <form onSubmit={submitAdd}>
            <div style={{ padding: '16px 24px 14px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <DialogTitle style={{ fontSize: 20, fontWeight: 700, color: INK, fontFamily: FONT }}>Add Task to {addStage}</DialogTitle>
                <DialogDescription style={{ fontSize: 14, color: '#6B7280', fontFamily: FONT, marginTop: 4 }}>
                  Assign work to team members or delegate to an agent for automated execution
                </DialogDescription>
              </div>
              <button type="button" onClick={() => setAddStage(null)} aria-label="Close" style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', alignSelf: 'flex-start' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ marginBottom: 18 }}>
                <label style={fieldLabel}>Task Name</label>
                <input required autoFocus value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Enter task name" style={fieldInput} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={fieldLabel}>Due Date</label>
                <input type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} style={fieldInput} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={fieldLabel}>Assigned To</label>
                <div style={{ position: 'relative' }}>
                  <select value={draft.assignee} onChange={(e) => setDraft({ ...draft, assignee: e.target.value })} style={{ ...fieldInput, appearance: 'none', WebkitAppearance: 'none', paddingRight: 32 }}>
                    {ASSIGNEES.map((a) => <option key={a}>{a}</option>)}
                  </select>
                  <ChevronsUpDown size={13} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: INK }} />
                </div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={fieldLabel}>Depends On Task</label>
                <input value={draft.dependsOn} onChange={(e) => setDraft({ ...draft, dependsOn: e.target.value })} placeholder="Enter task dependency (optional)" style={fieldInput} />
              </div>
              <div>
                <label style={fieldLabel}>Description</label>
                <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Add task context or instructions..." rows={3} style={{ ...fieldInput, resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ padding: '14px 24px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" onClick={() => setAddStage(null)} style={{ padding: '10px 16px', borderRadius: 8, border: `1px solid ${BLUE}`, background: '#fff', color: BLUE, fontSize: 15, fontWeight: 500, fontFamily: FONT, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: BLUE, color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: FONT, cursor: 'pointer' }}>Add Task</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
