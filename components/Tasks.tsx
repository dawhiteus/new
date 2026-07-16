import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  ListTodo,
  AlertCircle,
  Clock,
  ChevronsUpDown,
  UserPlus,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from './ui/toast';

// ── Types ─────────────────────────────────────────────────────────────────────

type TaskStatus = 'Open' | 'Completed';
type SortKey = 'licenseId' | 'task' | 'type' | 'trigger' | 'dueDate' | 'assignedTo' | 'status';

interface Note {
  text: string;
  timestamp: string;
}

interface Task {
  id: string;
  licenseId: string;
  task: string;
  type: 'Operational' | 'Setup';
  trigger: string;
  action: string;
  dueDate: string;
  assignedTo: string;
  status: TaskStatus;
  notes: Note[];
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    licenseId: 'LIC-2024-001',
    task: 'Critical Lease Renewal - Tel Tech HQ',
    type: 'Operational',
    trigger: 'Campus lease expires Mar 31, 2025 — $23.4M annual impact',
    action: 'Negotiate',
    dueDate: '2026-03-31',
    assignedTo: 'sarah@liquidspace.com',
    status: 'Open',
    notes: [],
  },
  {
    id: '2',
    licenseId: 'LIC-2025-003',
    task: 'Compliance Audit - Fire Safety',
    type: 'Operational',
    trigger: 'Due Sept 30 — 8 locations require certification',
    action: 'Audit',
    dueDate: '2026-09-30',
    assignedTo: 'michael@liquidspace.com',
    status: 'Open',
    notes: [],
  },
  {
    id: '3',
    licenseId: 'LIC-2025-002',
    task: 'Cost Optimization Review',
    type: 'Operational',
    trigger: 'Market Rate Analysis — 12 locations above benchmark',
    action: 'Review',
    dueDate: '',
    assignedTo: '',
    status: 'Open',
    notes: [],
  },
  {
    id: '4',
    licenseId: 'LIC-2024-002',
    task: 'Process Overdue Payment - London',
    type: 'Operational',
    trigger: 'Finance Center payment £2.1M overdue by 15 days',
    action: 'Pay',
    dueDate: '2026-07-01',
    assignedTo: 'david@liquidspace.com',
    status: 'Open',
    notes: [],
  },
  {
    id: '5',
    licenseId: 'LIC-2025-004',
    task: 'Onboard New Regional Manager',
    type: 'Setup',
    trigger: 'APAC expansion — Singapore office opening Q2',
    action: 'Setup',
    dueDate: '2026-08-15',
    assignedTo: 'emma@liquidspace.com',
    status: 'Open',
    notes: [],
  },
  {
    id: '6',
    licenseId: 'LIC-2025-001',
    task: 'Space Utilization Assessment',
    type: 'Operational',
    trigger: 'Hybrid work policy — 15% underutilization detected',
    action: 'Assess',
    dueDate: '',
    assignedTo: '',
    status: 'Open',
    notes: [],
  },
  {
    id: '7',
    licenseId: 'LIC-2024-003',
    task: 'Contract Renegotiation - Atlanta Hub',
    type: 'Operational',
    trigger: 'Tel Tech Regional Hub lease 12% above market rate',
    action: 'Negotiate',
    dueDate: '2026-07-20',
    assignedTo: 'jennifer@liquidspace.com',
    status: 'Open',
    notes: [],
  },
  {
    id: '8',
    licenseId: 'LIC-2025-005',
    task: 'Configure ESG Reporting',
    type: 'Setup',
    trigger: 'Sustainability metrics required for Q4 board report',
    action: 'Configure',
    dueDate: '2026-12-31',
    assignedTo: '',
    status: 'Open',
    notes: [],
  },
  {
    id: '9',
    licenseId: 'LIC-2025-006',
    task: 'Insurance Policy Renewal',
    type: 'Operational',
    trigger: 'Global property insurance expires Dec 31',
    action: 'Renew',
    dueDate: '2026-12-31',
    assignedTo: 'roberto@liquidspace.com',
    status: 'Open',
    notes: [],
  },
  {
    id: '10',
    licenseId: 'LIC-2025-007',
    task: 'Integration - HR Systems',
    type: 'Setup',
    trigger: 'Occupancy tracking integration with Workday',
    action: 'Integrate',
    dueDate: '',
    assignedTo: 'lisa@liquidspace.com',
    status: 'Completed',
    notes: [{ text: 'Integration verified in staging and production.', timestamp: 'Jul 1, 2026, 10:14 AM' }],
  },
  {
    id: '11',
    licenseId: 'LIC-2025-007',
    task: 'Configure Automated Alerts',
    type: 'Setup',
    trigger: 'Lease expiration notifications 90/60/30 days',
    action: 'Configure',
    dueDate: '',
    assignedTo: 'marcus@liquidspace.com',
    status: 'Completed',
    notes: [],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function isOverdue(dueDate: string): boolean {
  if (!dueDate) return false;
  return new Date(dueDate + 'T00:00:00') < new Date(new Date().toDateString());
}

function formatDate(d: string): string {
  if (!d) return '—';
  const [y, m, dd] = d.split('-');
  return `${m}/${dd}/${y}`;
}

function formatDateLong(d: string): string {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Inline row menu ───────────────────────────────────────────────────────────

function RowMenu({ onViewDetails, onRemove }: { onViewDetails: () => void; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ padding: '4px 6px', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#9CA3AF' }}
        className="hover:bg-gray-100"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: '100%', zIndex: 50, backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.10)', minWidth: '140px', overflow: 'hidden' }}>
          <button
            onClick={() => { setOpen(false); onViewDetails(); }}
            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#374151', background: 'none', border: 'none', cursor: 'pointer' }}
            className="hover:bg-gray-50"
          >
            View Details
          </button>
          <button
            onClick={() => { setOpen(false); onRemove(); }}
            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}
            className="hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface TasksProps {
  onAIAssistantOpen?: () => void;
  isAIDrawerOpen?: boolean;
}

export function Tasks({ onAIAssistantOpen = () => {}, isAIDrawerOpen = false }: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  // Filters
  const [filterLicense, setFilterLicense]   = useState('');
  const [filterType, setFilterType]         = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterStatus, setFilterStatus]     = useState('');

  // Sort
  const [sortKey, setSortKey] = useState<SortKey>('dueDate');
  const [sortAsc, setSortAsc] = useState(true);

  // Detail modal
  const [detailTask, setDetailTask]             = useState<Task | null>(null);
  const [noteInput, setNoteInput]               = useState('');
  const [editDueDate, setEditDueDate]           = useState('');
  const [editAssignedTo, setEditAssignedTo]     = useState('');
  const [editStatus, setEditStatus]             = useState<TaskStatus>('Open');

  // New task modal
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState({ task: '', licenseId: '', type: 'Operational' as 'Operational' | 'Setup', dueDate: '', assignTo: '', description: '' });

  // ── Derived ──────────────────────────────────────────────────────────────
  const openTasks    = tasks.filter(t => t.status === 'Open');
  const overdueTasks = tasks.filter(t => t.status === 'Open' && isOverdue(t.dueDate));
  const uniqueLicenses  = Array.from(new Set(tasks.map(t => t.licenseId)));
  const uniqueAssignees = Array.from(new Set(tasks.map(t => t.assignedTo).filter(Boolean)));

  const visible = tasks
    .filter(t => !filterLicense  || t.licenseId === filterLicense)
    .filter(t => !filterType     || t.type === filterType)
    .filter(t => !filterAssignee || t.assignedTo === filterAssignee)
    .filter(t => !filterStatus   || t.status === filterStatus)
    .sort((a, b) => {
      const av = sortKey === 'assignedTo' ? a.assignedTo : (a[sortKey] ?? '');
      const bv = sortKey === 'assignedTo' ? b.assignedTo : (b[sortKey] ?? '');
      return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  // ── Actions ───────────────────────────────────────────────────────────────
  const openDetail = (task: Task) => {
    setDetailTask(task);
    setNoteInput('');
    setEditDueDate(task.dueDate);
    setEditAssignedTo(task.assignedTo);
    setEditStatus(task.status);
  };

  const handleSaveDetail = () => {
    if (!detailTask) return;
    setTasks(prev => prev.map(t =>
      t.id === detailTask.id
        ? { ...t, dueDate: editDueDate, assignedTo: editAssignedTo, status: editStatus }
        : t
    ));
    toast.success('Task updated.');
    setDetailTask(null);
  };

  const handleAddNote = (id: string) => {
    if (!noteInput.trim()) return;
    const note: Note = { text: noteInput.trim(), timestamp: new Date().toLocaleString() };
    setTasks(prev => prev.map(t => t.id === id ? { ...t, notes: [...t.notes, note] } : t));
    setDetailTask(prev => prev?.id === id ? { ...prev, notes: [...prev.notes, note] } : prev);
    setNoteInput('');
  };

  const handleRemove = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    toast.info('Task removed.');
  };

  const handleCreateTask = () => {
    if (!newForm.task || !newForm.dueDate) return;
    const task: Task = {
      id: String(Date.now()),
      licenseId: newForm.licenseId || 'LIC-MANUAL',
      task: newForm.task,
      type: newForm.type,
      trigger: newForm.description,
      action: '',
      dueDate: newForm.dueDate,
      assignedTo: newForm.assignTo,
      status: 'Open',
      notes: [],
    };
    setTasks(prev => [task, ...prev]);
    setNewForm({ task: '', licenseId: '', type: 'Operational', dueDate: '', assignTo: '', description: '' });
    setShowNew(false);
    toast.success(`Task "${task.task}" created.`);
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const selectStyle: React.CSSProperties = {
    padding: '6px 28px 6px 10px', fontSize: '13px', fontFamily: 'Inter, sans-serif',
    color: '#374151', border: '1px solid #D1D5DB', borderRadius: '6px',
    backgroundColor: '#fff', cursor: 'pointer', appearance: 'auto', outline: 'none',
  };

  const SortHeader = ({ label, sortId }: { label: string; sortId: SortKey }) => (
    <TableHead
      onClick={() => handleSort(sortId)}
      style={{ fontSize: '11px', fontWeight: 700, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }}
    >
      <span className="flex items-center gap-1">{label}<ChevronsUpDown className="h-3 w-3 text-gray-400" /></span>
    </TableHead>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-page, #F9FAFB)' }}>
      <PageHeader
        icon={<ListTodo className="h-6 w-6" />}
        title="Tasks"
        subtitle="Review upcoming expirations, overdue payments, and setup tasks that require your attention."
        onAIAssistantOpen={onAIAssistantOpen}
        isAIDrawerOpen={isAIDrawerOpen}
      />

      <div className="p-6 max-w-7xl mx-auto space-y-5">

        {/* Metric cards */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                <Clock className="w-6 h-6" style={{ color: '#F59E0B' }} />
              </div>
              <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: 4 }}>Open Tasks</p>
              <p style={{ fontSize: '36px', fontWeight: 700, color: '#111827', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>{openTasks.length}</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
                <AlertCircle className="w-6 h-6" style={{ color: '#EF4444' }} />
              </div>
              <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: 4 }}>Overdue Tasks</p>
              <p style={{ fontSize: '36px', fontWeight: 700, color: '#EF4444', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>{overdueTasks.length}</p>
            </div>
          </div>
        </div>

        {/* Table card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">

          {/* Filters + Add Task */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 flex-wrap">
              <select value={filterLicense} onChange={e => setFilterLicense(e.target.value)} style={selectStyle}>
                <option value="">All Licenses</option>
                {uniqueLicenses.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} style={selectStyle}>
                <option value="">All Types</option>
                <option value="Operational">Operational</option>
                <option value="Setup">Setup</option>
              </select>
              <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)} style={selectStyle}>
                <option value="">All Assignees</option>
                {uniqueAssignees.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <button
              onClick={() => setShowNew(true)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#005B94', color: '#fff', fontSize: '13px', fontWeight: 500, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
              className="hover:opacity-90 transition-opacity"
            >
              Add Task
            </button>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: '#E5E7EB' }}>
                <SortHeader label="License ID"  sortId="licenseId" />
                <SortHeader label="Task"        sortId="task" />
                <SortHeader label="Type"        sortId="type" />
                <SortHeader label="Trigger"     sortId="trigger" />
                <SortHeader label="Due Date"    sortId="dueDate" />
                <SortHeader label="Assigned To" sortId="assignedTo" />
                <SortHeader label="Status"      sortId="status" />
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map(task => {
                const overdue = task.status === 'Open' && isOverdue(task.dueDate);
                return (
                  <TableRow key={task.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: '#F3F4F6' }}>

                    <TableCell style={{ paddingTop: 14, paddingBottom: 14, fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
                      {task.licenseId}
                    </TableCell>

                    <TableCell style={{ paddingTop: 14, paddingBottom: 14, fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      {task.task}
                    </TableCell>

                    <TableCell style={{ paddingTop: 14, paddingBottom: 14, fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      {task.type}
                    </TableCell>

                    <TableCell style={{ paddingTop: 14, paddingBottom: 14, maxWidth: 190, width: 190 }}>
                      {task.trigger ? (
                        <span style={{ display: 'block', fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'default' }} title={task.trigger}>
                          {task.trigger}
                        </span>
                      ) : null}
                    </TableCell>

                    <TableCell style={{ paddingTop: 14, paddingBottom: 14, fontSize: '14px', color: overdue ? '#EF4444' : '#374151', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', fontWeight: overdue ? 500 : 400 }}>
                      {task.dueDate ? formatDate(task.dueDate) : <span style={{ color: '#D1D5DB' }}>—</span>}
                    </TableCell>

                    <TableCell style={{ paddingTop: 14, paddingBottom: 14 }}>
                      {task.assignedTo
                        ? <span style={{ fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>{task.assignedTo}</span>
                        : (
                          <button
                            onClick={() => openDetail(task)}
                            className="flex items-center gap-1 hover:bg-gray-100 rounded px-2 py-1 transition-colors"
                            style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', border: '1px solid #D1D5DB', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                            Assign
                          </button>
                        )
                      }
                    </TableCell>

                    <TableCell style={{ paddingTop: 14, paddingBottom: 14 }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 12px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif',
                        backgroundColor: task.status === 'Completed' ? '#DCFCE7' : '#FEF3C7',
                        color: task.status === 'Completed' ? '#166534' : '#92400E',
                      }}>
                        {task.status}
                      </span>
                    </TableCell>

                    <TableCell style={{ paddingTop: 14, paddingBottom: 14, textAlign: 'right' }}>
                      <RowMenu
                        onViewDetails={() => openDetail(task)}
                        onRemove={() => handleRemove(task.id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {visible.length === 0 && (
            <div className="text-center py-14">
              <p style={{ fontSize: '15px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>No tasks match the current filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Task Details modal ──────────────────────────────────────────────── */}
      {detailTask && (
        <Dialog open={!!detailTask} onOpenChange={open => { if (!open) setDetailTask(null); }}>
          <DialogContent className="max-w-sm p-0 overflow-hidden" style={{ borderRadius: '12px' }}>
            {/* Blue header */}
            <div style={{ backgroundColor: '#005B94', padding: '16px 20px' }}>
              <DialogHeader>
                <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: '#fff', fontFamily: 'Inter, sans-serif' }}>
                  Task Details
                </DialogTitle>
                <DialogDescription style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter, sans-serif' }}>
                  {detailTask.licenseId}
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Body */}
            <div style={{ padding: '20px' }} className="space-y-4">

              {/* Status — editable */}
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Status</span>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as TaskStatus)}
                  style={{
                    fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif',
                    padding: '3px 24px 3px 10px', borderRadius: '20px',
                    border: '1px solid transparent', cursor: 'pointer', appearance: 'auto',
                    backgroundColor: editStatus === 'Completed' ? '#DCFCE7' : '#FEF3C7',
                    color: editStatus === 'Completed' ? '#166534' : '#92400E',
                  }}
                >
                  <option value="Open">Open</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Due Date — editable */}
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Due Date</span>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={e => setEditDueDate(e.target.value)}
                  style={{
                    fontSize: '14px', fontFamily: 'Inter, sans-serif',
                    color: editDueDate && isOverdue(editDueDate) && editStatus === 'Open' ? '#EF4444' : '#374151',
                    border: '1px solid #D1D5DB', borderRadius: '6px', padding: '3px 6px', outline: 'none', cursor: 'pointer',
                  }}
                />
              </div>

              {/* Assigned To — editable */}
              <div className="flex items-center justify-between gap-4">
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>Assigned To</span>
                <input
                  type="text"
                  value={editAssignedTo}
                  onChange={e => setEditAssignedTo(e.target.value)}
                  placeholder="email@company.com"
                  style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '3px 8px', outline: 'none', width: '100%', maxWidth: 200 }}
                />
              </div>

              {/* Action chip */}
              {detailTask.action && (
                <div style={{ backgroundColor: '#EFF6FF', padding: '10px 14px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#1D4ED8', fontFamily: 'Inter, sans-serif' }}>
                    {detailTask.action}
                  </span>
                </div>
              )}

              {/* Type */}
              {detailTask.type && (
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 2 }}>Type</p>
                  <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{detailTask.type}</p>
                </div>
              )}

              {/* Trigger */}
              {detailTask.trigger && (
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 2 }}>Trigger</p>
                  <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{detailTask.trigger}</p>
                </div>
              )}

              {/* Existing notes */}
              {detailTask.notes.length > 0 && (
                <div className="space-y-2">
                  {detailTask.notes.map((n, i) => (
                    <div key={i} style={{ backgroundColor: '#F9FAFB', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                      <p style={{ fontSize: '13px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>{n.text}</p>
                      <p style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>{n.timestamp}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add note */}
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>Notes</p>
                <Textarea
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  placeholder="Enter note"
                  style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', minHeight: '72px', resize: 'vertical' }}
                />
                <button
                  onClick={() => handleAddNote(detailTask.id)}
                  className="w-full mt-2 hover:bg-gray-100 transition-colors"
                  style={{ padding: '9px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F3F4F6', fontSize: '13px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
                >
                  Add Note
                </button>
              </div>

              {/* Footer */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSaveDetail}
                  className="flex-1"
                  style={{ padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#005B94', color: '#fff', fontSize: '14px', fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setDetailTask(null)}
                  className="flex-1"
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#fff', color: '#374151', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ── New Task modal ──────────────────────────────────────────────────── */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-lg p-0 overflow-hidden" style={{ borderRadius: '12px' }}>
          <div style={{ backgroundColor: '#005B94', padding: '16px 20px' }}>
            <DialogHeader>
              <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: '#fff', fontFamily: 'Inter, sans-serif' }}>
                New Task
              </DialogTitle>
              <DialogDescription className="sr-only">Create a new license admin task</DialogDescription>
            </DialogHeader>
          </div>

          <div style={{ padding: '24px' }} className="space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Task Name *</Label>
                <Input
                  value={newForm.task}
                  onChange={e => setNewForm({ ...newForm, task: e.target.value })}
                  placeholder="e.g. Lease Renewal Review"
                  className="mt-1.5"
                  style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif' }}
                />
              </div>
              <div>
                <Label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>License ID</Label>
                <select
                  value={newForm.licenseId}
                  onChange={e => setNewForm({ ...newForm, licenseId: e.target.value })}
                  style={{ ...selectStyle, width: '100%', marginTop: '6px' }}
                >
                  <option value="">Select license (optional)</option>
                  {uniqueLicenses.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Type</Label>
                <select
                  value={newForm.type}
                  onChange={e => setNewForm({ ...newForm, type: e.target.value as 'Operational' | 'Setup' })}
                  style={{ ...selectStyle, width: '100%', marginTop: '6px' }}
                >
                  <option value="Operational">Operational</option>
                  <option value="Setup">Setup</option>
                </select>
              </div>
              <div>
                <Label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Due Date *</Label>
                <Input
                  type="date"
                  value={newForm.dueDate}
                  onChange={e => setNewForm({ ...newForm, dueDate: e.target.value })}
                  className="mt-1.5"
                  style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif' }}
                />
              </div>
            </div>

            {/* Row 3 */}
            <div>
              <Label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Assign To</Label>
              <Input
                value={newForm.assignTo}
                onChange={e => setNewForm({ ...newForm, assignTo: e.target.value })}
                placeholder="email@company.com"
                className="mt-1.5"
                style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Description */}
            <div>
              <Label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Description</Label>
              <Textarea
                value={newForm.description}
                onChange={e => setNewForm({ ...newForm, description: e.target.value })}
                placeholder="Add task context or trigger..."
                className="mt-1.5"
                style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', minHeight: '80px' }}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleCreateTask}
                disabled={!newForm.task || !newForm.dueDate}
                style={{
                  padding: '10px 24px', borderRadius: '8px', border: 'none',
                  backgroundColor: !newForm.task || !newForm.dueDate ? '#93C5FD' : '#005B94',
                  color: '#fff', fontSize: '14px', fontWeight: 600, fontFamily: 'Inter, sans-serif',
                  cursor: !newForm.task || !newForm.dueDate ? 'default' : 'pointer',
                }}
              >
                Create Task
              </button>
              <button
                onClick={() => setShowNew(false)}
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#fff', color: '#374151', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
