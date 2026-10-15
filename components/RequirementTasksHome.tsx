import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckSquare, ChevronsUpDown, ArrowUp, ArrowUpDown, UserPlus, MoreHorizontal, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from './ui/toast';
import { useRequirements } from './data/requirementsStore';
import { ASSIGNEES, CURRENT_USER_EMAIL, type TaskStatus, type WorkflowTask, type TimelineEvent } from './data/mvpRequirements';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const INK = '#0F2A3D';
const STATUSES: TaskStatus[] = ['Not Started', 'In Progress', 'Completed'];

const STAGE_BG: Record<string, string> = {
  Intake: '#0D619B', Evaluation: '#E8A91C', Proposal: '#A855F7', Contracting: '#6366F1', Execution: '#17B8C4',
};
const STATUS_BG: Record<TaskStatus, string> = { Completed: '#2E9D4A', 'In Progress': '#0D619B', 'Not Started': '#F26B21' };

type Row = WorkflowTask & { reqId: string; reqName: string };
type SortKey = 'reqName' | 'stage' | 'name' | 'dueDate' | 'assignee' | 'status';
const COLUMNS: { key: SortKey; label: string; w: string }[] = [
  { key: 'reqName', label: 'REQUIREMENT', w: '14%' }, { key: 'stage', label: 'STAGE', w: '14%' }, { key: 'name', label: 'NAME', w: '22%' },
  { key: 'dueDate', label: 'DUE DATE', w: '12%' }, { key: 'assignee', label: 'ASSIGNED TO', w: '17%' }, { key: 'status', label: 'STATUS', w: '15%' },
];

const fmtDate = (iso: string) => { if (!iso) return ''; const [y, m, d] = iso.split('-'); return `${m}/${d}/${y}`; };
const today = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function Pill({ label, bg }: { label: string; bg: string }) {
  return <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600, background: bg, color: '#fff', whiteSpace: 'nowrap' }}>{label}</span>;
}

function FilterButton({ value, onChange, all, options }: { value: string; onChange: (v: string) => void; all: string; options: string[] }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        style={{ appearance: 'none', WebkitAppearance: 'none', fontFamily: FONT, fontSize: 14, color: INK, background: '#fff', border: '1.5px solid #0F2A3D', borderRadius: 4, padding: '8px 34px 8px 9px', cursor: 'pointer', outline: 'none' }}>
        <option value="">{all}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronsUpDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: INK }} />
    </div>
  );
}

function RowMenu({ onView, onRemove }: { onView: () => void; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const item = (l: string, fn: () => void) => (
    <button key={l} onClick={() => { setOpen(false); fn(); }} className="hover:bg-gray-100"
      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 24px 8px 16px', fontSize: 14, color: INK, fontFamily: FONT, background: 'transparent', border: 'none', cursor: 'pointer' }}>{l}</button>
  );
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button aria-label="Task actions" onClick={() => setOpen((o) => !o)}
        style={{ background: 'none', border: open ? '2px solid #9CC3E0' : '2px solid transparent', borderRadius: 4, cursor: 'pointer', color: '#9CA3AF', padding: '2px 4px', display: 'inline-flex' }}>
        <MoreHorizontal size={18} />
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: '100%', zIndex: 30, minWidth: 150, background: '#fff', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', padding: '6px 0', marginTop: 4 }}>
          {item('View Details', onView)}
          {item('Remove', onRemove)}
        </div>
      )}
    </div>
  );
}

const fieldInput: React.CSSProperties = { width: '100%', border: '1.5px solid #0F2A3D', borderRadius: 8, padding: '12px 14px', fontSize: 15, fontFamily: FONT, color: INK, background: '#fff', outline: 'none' };
const fieldLabel: React.CSSProperties = { display: 'block', fontSize: 15, fontWeight: 600, color: INK, marginBottom: 8, fontFamily: FONT };

export function RequirementTasksHome() {
  const [reqs, setReqs] = useRequirements();
  const [reqF, setReqF] = useState('');
  const [stageF, setStageF] = useState('');
  const [assF, setAssF] = useState('');
  const [statF, setStatF] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'reqName', dir: 'asc' });
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Row | null>(null);
  const [draft, setDraft] = useState<WorkflowTask | null>(null);

  const all: Row[] = useMemo(
    () => reqs.flatMap((r) => r.details.tasks.map((t) => ({ ...t, reqId: r.id, reqName: r.name }))),
    [reqs],
  );
  const assigneeOf = (t: Row) => t.assignee || 'Unassigned';

  const filtered = useMemo(() => {
    const out = all.filter((t) =>
      (!reqF || t.reqName === reqF) && (!stageF || t.stage === stageF) && (!assF || assigneeOf(t) === assF) && (!statF || t.status === statF));
    const stageOrder = Object.keys(STAGE_BG);
    out.sort((a, b) => {
      let c: number;
      if (sort.key === 'stage') c = stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage);
      else if (sort.key === 'assignee') c = assigneeOf(a).localeCompare(assigneeOf(b));
      else c = String(a[sort.key]).localeCompare(String(b[sort.key]));
      return sort.dir === 'asc' ? c : -c;
    });
    return out;
  }, [all, reqF, stageF, assF, statF, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);

  const toggleSort = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));

  const mutate = (reqId: string, fn: (tasks: WorkflowTask[]) => WorkflowTask[], event?: TimelineEvent) =>
    setReqs((rs) => rs.map((r) => r.id !== reqId ? r : {
      ...r,
      lastUpdated: new Date().toISOString().slice(0, 10),
      details: { ...r.details, tasks: fn(r.details.tasks), events: event ? [...r.details.events, event] : r.details.events },
    }));
  const mkEvent = (title: string, description: string): TimelineEvent => ({
    id: `e-${Date.now()}`, type: 'task', title, description, date: today(), actor: CURRENT_USER_EMAIL,
  });

  const openEdit = (t: Row) => { setEditing(t); setDraft({ ...t }); };
  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !draft) return;
    const changedStatus = draft.status !== editing.status;
    mutate(
      editing.reqId,
      (ts) => ts.map((t) => (t.id === draft.id ? { ...draft } : t)),
      mkEvent('Task Updated', changedStatus
        ? `'${draft.name}' updated in ${draft.stage}: Status was changed from ${editing.status} to ${draft.status}`
        : `'${draft.name}' updated in ${draft.stage}.`),
    );
    toast.success('Task updated.');
    setEditing(null);
  };
  const remove = (t: Row) => {
    mutate(t.reqId, (ts) => ts.filter((x) => x.id !== t.id), mkEvent('Task Removed', `'${t.name}' removed from ${t.stage}.`));
    toast.success(`Task "${t.name}" removed.`);
  };

  const th: React.CSSProperties = { padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: INK, letterSpacing: '0.04em', fontFamily: FONT, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' };
  const td: React.CSSProperties = { padding: '10px 16px', fontSize: 14, color: INK, fontFamily: FONT };
  const reqNames = Array.from(new Set(reqs.map((r) => r.name)));
  const stages = Object.keys(STAGE_BG);
  const assignees = Array.from(new Set(all.map(assigneeOf)));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: FONT }}>
      {/* Header (demo treatment) */}
      <div style={{ background: 'linear-gradient(135deg, #004A7C 0%, #005B94 60%, #0071B8 100%)', padding: '28px 32px 32px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3" style={{ marginBottom: '4px' }}>
            <CheckSquare className="h-7 w-7" style={{ color: 'rgba(255,255,255,0.85)' }} />
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.3px' }}>Requirement Tasks</h1>
          </div>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', paddingLeft: '40px' }}>
            Review and manage tasks across all your requirements.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto" style={{ padding: '24px 32px 48px' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}>
          <div style={{ border: '1px solid #E5E7EB', borderRadius: 20, padding: '40px 20px 24px' }}>
            <div style={{ display: 'flex', gap: 8, paddingBottom: 20, borderBottom: '1px solid #E5E7EB' }}>
              <FilterButton value={reqF} onChange={(v) => { setReqF(v); setPage(1); }} all="All Requirements" options={reqNames} />
              <FilterButton value={stageF} onChange={(v) => { setStageF(v); setPage(1); }} all="All Stages" options={stages} />
              <FilterButton value={assF} onChange={(v) => { setAssF(v); setPage(1); }} all="All Assignees" options={assignees} />
              <FilterButton value={statF} onChange={(v) => { setStatF(v); setPage(1); }} all="All Statuses" options={STATUSES} />
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24, tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ background: '#F3F4F6' }}>
                  {COLUMNS.map((c) => (
                    <th key={c.key} style={{ ...th, width: c.w }} onClick={() => toggleSort(c.key)}>
                      {c.label}{' '}
                      {sort.key === c.key
                        ? <ArrowUp size={12} style={{ display: 'inline', transform: sort.dir === 'desc' ? 'rotate(180deg)' : undefined }} />
                        : <ArrowUpDown size={12} style={{ display: 'inline', color: '#6B7280' }} />}
                    </th>
                  ))}
                  <th style={{ ...th, width: 56, cursor: 'default' }} />
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr><td colSpan={7} style={{ ...td, textAlign: 'center', color: '#9CA3AF', padding: 40 }}>No tasks match your filters.</td></tr>
                ) : visible.map((t, i) => (
                  <tr key={`${t.reqId}-${t.id}`} style={{ borderTop: '1px solid #E5E7EB', background: i % 2 ? '#F9FAFB' : '#fff' }}>
                    <td style={td}>{t.reqName}</td>
                    <td style={td}><Pill label={t.stage} bg={STAGE_BG[t.stage] ?? '#6B7280'} /></td>
                    <td style={td}>{t.name}</td>
                    <td style={td}>{fmtDate(t.dueDate)}</td>
                    <td style={td}>
                      {t.assignee ? t.assignee : (
                        <button onClick={() => openEdit(t)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid #E5E7EB', background: '#fff', borderRadius: 999, padding: '5px 12px', fontSize: 13, color: INK, fontFamily: FONT, cursor: 'pointer' }}>
                          <UserPlus size={13} /> Assign
                        </button>
                      )}
                    </td>
                    <td style={td}><Pill label={t.status} bg={STATUS_BG[t.status]} /></td>
                    <td style={{ ...td, textAlign: 'right', padding: '10px 12px 10px 0' }}>
                      <RowMenu onView={() => openEdit(t)} onRemove={() => remove(t)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, fontSize: 15, color: '#9CA3AF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>Show</span>
                <div style={{ position: 'relative' }}>
                  <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                    style={{ appearance: 'none', WebkitAppearance: 'none', fontFamily: FONT, fontSize: 14, color: INK, border: '1.5px solid #0F2A3D', borderRadius: 4, padding: '8px 30px 8px 9px', background: '#fff' }}>
                    {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronsUpDown size={13} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: INK }} />
                </div>
                <span>entries</span>
                <span>{filtered.length === 0 ? '0' : `${start + 1} - ${start + visible.length}`} of {filtered.length}</span>
              </div>
              <div style={{ display: 'flex', border: '1px solid #E5E7EB', borderRadius: 6, overflow: 'hidden' }}>
                <button onClick={() => setPage(Math.max(1, current - 1))} disabled={current === 1} style={{ padding: '10px 12px', background: '#fff', border: 'none', color: '#6B7280', fontFamily: FONT, fontSize: 15, cursor: current === 1 ? 'default' : 'pointer' }}>Previous</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)} style={{ minWidth: 32, padding: '10px 8px', border: 'none', fontFamily: FONT, fontSize: 15, cursor: 'pointer', background: p === current ? BLUE : '#fff', color: p === current ? '#fff' : BLUE }}>{p}</button>
                ))}
                <button onClick={() => setPage(Math.min(totalPages, current + 1))} disabled={current === totalPages} style={{ padding: '10px 12px', background: '#fff', border: 'none', color: current === totalPages ? '#6B7280' : BLUE, fontFamily: FONT, fontSize: 15, cursor: current === totalPages ? 'default' : 'pointer' }}>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Task dialog */}
      <Dialog open={editing !== null} onOpenChange={(o) => { if (!o) setEditing(null); }}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden [&>button]:hidden gap-0" style={{ borderRadius: 24, border: 'none', maxHeight: '94vh' }}>
          {draft && editing && (
            <form onSubmit={saveEdit}>
              <div style={{ padding: '16px 24px 14px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <DialogTitle style={{ fontSize: 20, fontWeight: 700, color: INK, fontFamily: FONT }}>Edit Task from {editing.stage}</DialogTitle>
                  <DialogDescription style={{ fontSize: 14, color: '#6B7280', fontFamily: FONT, marginTop: 4 }}>
                    Assign work to team members or delegate to an agent for automated execution
                  </DialogDescription>
                </div>
                <button type="button" onClick={() => setEditing(null)} aria-label="Close" style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', alignSelf: 'flex-start' }}><X size={18} /></button>
              </div>
              <div style={{ padding: '20px 24px', maxHeight: '66vh', overflowY: 'auto' }}>
                <div style={{ marginBottom: 18 }}>
                  <label style={fieldLabel}>Task Name</label>
                  <input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} style={fieldInput} />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={fieldLabel}>Task Status</label>
                  <div style={{ position: 'relative' }}>
                    <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as TaskStatus })} style={{ ...fieldInput, appearance: 'none', WebkitAppearance: 'none', paddingRight: 32 }}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <ChevronsUpDown size={13} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: INK }} />
                  </div>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={fieldLabel}>Due Date</label>
                  <input type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} style={fieldInput} />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={fieldLabel}>Assigned To</label>
                  <div style={{ position: 'relative' }}>
                    <select value={draft.assignee || 'Unassigned'} onChange={(e) => setDraft({ ...draft, assignee: e.target.value === 'Unassigned' ? '' : e.target.value })} style={{ ...fieldInput, appearance: 'none', WebkitAppearance: 'none', paddingRight: 32 }}>
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
                  <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={2} style={{ ...fieldInput, resize: 'vertical' }} />
                </div>
              </div>
              <div style={{ padding: '14px 24px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" onClick={() => setEditing(null)} style={{ padding: '10px 16px', borderRadius: 8, border: `1px solid ${BLUE}`, background: '#fff', color: BLUE, fontSize: 15, fontWeight: 500, fontFamily: FONT, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: BLUE, color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: FONT, cursor: 'pointer' }}>Save Changes</button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
