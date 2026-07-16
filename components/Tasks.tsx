import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
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
  AlertTriangle,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Task {
  id: string;
  type: 'Setup' | 'Operational';
  task: string;
  trigger: string;
  assignedTo?: { name: string; initials: string };
  action: string;
  status: 'pending' | 'completed';
  dueDate?: string;
}

type SortKey = 'task' | 'type' | 'trigger' | 'dueDate' | 'assignedTo' | 'status';
type Urgency = 'overdue' | 'soon' | 'upcoming' | 'none';

// ── Mock data ─────────────────────────────────────────────────────────────────

const mockTasks: Task[] = [
  {
    id: '1',
    type: 'Operational',
    task: 'Critical Lease Renewal - Tel Tech HQ',
    trigger: 'Campus lease expires Mar 31, 2025 - $23.4M annual impact',
    assignedTo: { name: 'Sarah Chen', initials: 'SC' },
    action: 'Negotiate',
    status: 'pending',
    dueDate: '2026-03-31',
  },
  {
    id: '2',
    type: 'Operational',
    task: 'Compliance Audit - Fire Safety',
    trigger: 'Due Sept 30 - 8 locations require certification',
    assignedTo: { name: 'Michael Torres', initials: 'MT' },
    action: 'Audit',
    status: 'pending',
    dueDate: '2026-09-30',
  },
  {
    id: '3',
    type: 'Operational',
    task: 'Cost Optimization Review',
    trigger: 'Market Rate Analysis - 12 locations above benchmark',
    action: 'Review',
    status: 'pending',
  },
  {
    id: '4',
    type: 'Operational',
    task: 'Process Overdue Payment - London',
    trigger: 'Finance Center payment £2.1M overdue by 15 days',
    assignedTo: { name: 'David Kim', initials: 'DK' },
    action: 'Pay',
    status: 'pending',
    dueDate: '2026-07-01',
  },
  {
    id: '5',
    type: 'Setup',
    task: 'Onboard New Regional Manager',
    trigger: 'APAC expansion - Singapore office opening Q2',
    assignedTo: { name: 'Emma Rodriguez', initials: 'ER' },
    action: 'Setup',
    status: 'pending',
    dueDate: '2026-08-15',
  },
  {
    id: '6',
    type: 'Operational',
    task: 'Space Utilization Assessment',
    trigger: 'Hybrid work policy - 15% underutilization detected',
    action: 'Assess',
    status: 'pending',
  },
  {
    id: '7',
    type: 'Operational',
    task: 'Contract Renegotiation - Atlanta Hub',
    trigger: 'Tel Tech Regional Hub lease 12% above market rate',
    assignedTo: { name: 'Jennifer Walsh', initials: 'JW' },
    action: 'Negotiate',
    status: 'pending',
    dueDate: '2026-07-20',
  },
  {
    id: '8',
    type: 'Setup',
    task: 'Configure ESG Reporting',
    trigger: 'Sustainability metrics required for Q4 board report',
    action: 'Configure',
    status: 'pending',
    dueDate: '2026-12-31',
  },
  {
    id: '9',
    type: 'Operational',
    task: 'Insurance Policy Renewal',
    trigger: 'Global property insurance expires Dec 31',
    assignedTo: { name: 'Roberto Martinez', initials: 'RM' },
    action: 'Renew',
    status: 'pending',
    dueDate: '2026-12-31',
  },
  {
    id: '10',
    type: 'Setup',
    task: 'Integration - HR Systems',
    trigger: 'Occupancy tracking integration with Workday',
    assignedTo: { name: 'Lisa Wong', initials: 'LW' },
    action: 'Integrate',
    status: 'completed',
  },
  {
    id: '11',
    type: 'Setup',
    task: 'Configure Automated Alerts',
    trigger: 'Lease expiration notifications 90/60/30 days',
    assignedTo: { name: 'Marcus Johnson', initials: 'MJ' },
    action: 'Configure',
    status: 'completed',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDueDateUrgency(dueDate: string): Urgency {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + 'T00:00:00');
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / 86400000);
  if (diffDays < 0) return 'overdue';
  if (diffDays <= 7) return 'soon';
  return 'upcoming';
}

function isOverdue(dueDate?: string): boolean {
  if (!dueDate) return false;
  return getDueDateUrgency(dueDate) === 'overdue';
}

function formatDate(dueDate: string): string {
  const [y, m, d] = dueDate.split('-');
  return `${m}/${d}/${y}`;
}

function formatDateLong(dueDate: string): string {
  return new Date(dueDate + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

// ── Inline row menu ───────────────────────────────────────────────────────────

function RowMenu({
  onEdit,
  onMarkComplete,
  onRemove,
}: {
  onEdit: () => void;
  onMarkComplete: () => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const item = (label: string, color: string, onClick: () => void) => (
    <button
      onClick={() => { setOpen(false); onClick(); }}
      style={{
        display: 'block', width: '100%', textAlign: 'left',
        padding: '9px 14px', fontSize: '13px', fontFamily: 'Inter, sans-serif',
        color, background: 'none', border: 'none', cursor: 'pointer',
      }}
      className="hover:bg-gray-50"
    >
      {label}
    </button>
  );

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
        <div style={{
          position: 'absolute', right: 0, top: '100%', zIndex: 50,
          backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.10)', minWidth: '150px', overflow: 'hidden',
        }}>
          {item('Edit Task', '#374151', onEdit)}
          {item('Mark as Complete', '#374151', onMarkComplete)}
          {item('Remove', '#EF4444', onRemove)}
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
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  // Filters
  const [filterType, setFilterType]     = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');

  // Sort
  const [sortKey, setSortKey] = useState<SortKey>('dueDate');
  const [sortAsc, setSortAsc] = useState(true);

  // Edit dialog
  const [editingTask, setEditingTask]   = useState<Task | null>(null);
  const [editDueDate, setEditDueDate]   = useState('');
  const [editStatus, setEditStatus]     = useState<'pending' | 'completed'>('pending');

  // Inline assign
  const [assigningId, setAssigningId]   = useState<string | null>(null);
  const [assignInput, setAssignInput]   = useState('');

  // ── Derived ──────────────────────────────────────────────────────────────
  const activeTasks  = tasks.filter(t => t.status === 'pending');
  const overdueTasks = activeTasks.filter(t => isOverdue(t.dueDate));
  const uniqueAssignees = Array.from(new Set(tasks.map(t => t.assignedTo?.name).filter(Boolean))) as string[];

  const visible = tasks
    .filter(t => !filterType     || t.type === filterType)
    .filter(t => !filterStatus   || t.status === filterStatus)
    .filter(t => !filterAssignee || t.assignedTo?.name === filterAssignee)
    .sort((a, b) => {
      let av = '';
      let bv = '';
      if (sortKey === 'assignedTo') { av = a.assignedTo?.name ?? ''; bv = b.assignedTo?.name ?? ''; }
      else { av = (a[sortKey] ?? '') as string; bv = (b[sortKey] ?? '') as string; }
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleMarkComplete = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
  };

  const handleRemove = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setEditDueDate(task.dueDate ?? '');
    setEditStatus(task.status);
  };

  const handleSaveEdit = () => {
    if (!editingTask) return;
    setTasks(prev => prev.map(t =>
      t.id === editingTask.id
        ? { ...t, dueDate: editDueDate || undefined, status: editStatus }
        : t
    ));
    setEditingTask(null);
  };

  const handleAssign = (id: string) => {
    if (!assignInput.trim()) return;
    const name = assignInput.trim();
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, assignedTo: { name, initials } } : t));
    setAssigningId(null);
    setAssignInput('');
  };

  // ── Sub-components ────────────────────────────────────────────────────────
  const selectStyle: React.CSSProperties = {
    padding: '6px 28px 6px 10px',
    fontSize: '13px',
    fontFamily: 'Inter, sans-serif',
    color: '#374151',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    appearance: 'auto',
    outline: 'none',
  };

  const SortHeader = ({ label, sortId }: { label: string; sortId: SortKey }) => (
    <TableHead
      onClick={() => handleSort(sortId)}
      style={{
        fontSize: '11px', fontWeight: 700, color: '#374151',
        fontFamily: 'Inter, sans-serif', textTransform: 'uppercase',
        letterSpacing: '0.06em', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none',
      }}
    >
      <span className="flex items-center gap-1">
        {label}
        <ChevronsUpDown className="h-3 w-3 text-gray-400" />
      </span>
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

        {/* ── Metric cards ─────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                <Clock className="w-6 h-6" style={{ color: '#F59E0B' }} />
              </div>
              <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>Active Tasks</p>
              <p style={{ fontSize: '36px', fontWeight: 700, color: '#111827', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>
                {activeTasks.length}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
                <AlertCircle className="w-6 h-6" style={{ color: '#EF4444' }} />
              </div>
              <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>Overdue</p>
              <p style={{ fontSize: '36px', fontWeight: 700, color: '#EF4444', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>
                {overdueTasks.length}
              </p>
            </div>
          </div>
        </div>

        {/* ── Table card ───────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap mb-5">
            <select value={filterType} onChange={e => setFilterType(e.target.value)} style={selectStyle}>
              <option value="">All Types</option>
              <option value="Operational">Operational</option>
              <option value="Setup">Setup</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)} style={selectStyle}>
              <option value="">All Assignees</option>
              {uniqueAssignees.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: '#E5E7EB' }}>
                <SortHeader label="Type"        sortId="type" />
                <SortHeader label="Task"        sortId="task" />
                <SortHeader label="Trigger"     sortId="trigger" />
                <SortHeader label="Due Date"    sortId="dueDate" />
                <SortHeader label="Assigned To" sortId="assignedTo" />
                <SortHeader label="Status"      sortId="status" />
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map(task => {
                const overdue = task.status === 'pending' && isOverdue(task.dueDate);
                return (
                  <TableRow key={task.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: '#F3F4F6' }}>

                    {/* Type */}
                    <TableCell style={{ paddingTop: 14, paddingBottom: 14, whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif',
                        backgroundColor: task.type === 'Setup' ? '#F3F4F6' : '#005B94',
                        color: task.type === 'Setup' ? '#374151' : '#fff',
                      }}>
                        {task.type}
                      </span>
                    </TableCell>

                    {/* Task */}
                    <TableCell style={{ paddingTop: 14, paddingBottom: 14, fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      {task.task}
                    </TableCell>

                    {/* Trigger */}
                    <TableCell style={{ paddingTop: 14, paddingBottom: 14, maxWidth: 220, width: 220 }}>
                      <span style={{
                        display: 'block', fontSize: '13px', color: '#6B7280',
                        fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                      }} title={task.trigger}>
                        {task.trigger}
                      </span>
                    </TableCell>

                    {/* Due Date */}
                    <TableCell style={{ paddingTop: 14, paddingBottom: 14, fontSize: '14px', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', color: overdue ? '#EF4444' : '#374151', fontWeight: overdue ? 500 : 400 }}>
                      {task.dueDate ? formatDate(task.dueDate) : <span style={{ color: '#D1D5DB' }}>—</span>}
                    </TableCell>

                    {/* Assigned To */}
                    <TableCell style={{ paddingTop: 14, paddingBottom: 14 }}>
                      {assigningId === task.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            autoFocus
                            value={assignInput}
                            onChange={e => setAssignInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleAssign(task.id); if (e.key === 'Escape') setAssigningId(null); }}
                            placeholder="Name"
                            style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', width: '130px', outline: 'none' }}
                          />
                          <button onClick={() => handleAssign(task.id)} style={{ fontSize: '12px', color: '#005B94', background: 'none', border: 'none', cursor: 'pointer' }}>Save</button>
                          <button onClick={() => setAssigningId(null)} style={{ fontSize: '12px', color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
                        </div>
                      ) : task.assignedTo ? (
                        <span style={{ fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>{task.assignedTo.name}</span>
                      ) : (
                        <button
                          onClick={() => { setAssigningId(task.id); setAssignInput(''); }}
                          className="flex items-center gap-1 hover:bg-gray-100 rounded px-2 py-1 transition-colors"
                          style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', border: '1px solid #D1D5DB', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          Assign
                        </button>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell style={{ paddingTop: 14, paddingBottom: 14 }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 12px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif',
                        backgroundColor: task.status === 'completed' ? '#DCFCE7' : '#FEF3C7',
                        color: task.status === 'completed' ? '#166534' : '#92400E',
                      }}>
                        {task.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell style={{ paddingTop: 14, paddingBottom: 14, textAlign: 'right' }}>
                      <RowMenu
                        onEdit={() => handleOpenEdit(task)}
                        onMarkComplete={() => handleMarkComplete(task.id)}
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

      {/* ── Edit Task dialog ──────────────────────────────────────────────── */}
      <Dialog open={!!editingTask} onOpenChange={open => { if (!open) setEditingTask(null); }}>
        <DialogContent className="max-w-sm p-0 overflow-hidden" style={{ borderRadius: '12px' }}>
          {/* Blue header */}
          <div style={{ backgroundColor: '#005B94', padding: '16px 20px' }}>
            <DialogHeader>
              <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: '#fff', fontFamily: 'Inter, sans-serif' }}>
                Edit Task
              </DialogTitle>
              <DialogDescription style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter, sans-serif' }}>
                {editingTask?.task}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Body */}
          <div style={{ padding: '20px' }} className="space-y-4">

            {/* Status */}
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Status</span>
              <select
                value={editStatus}
                onChange={e => setEditStatus(e.target.value as 'pending' | 'completed')}
                style={{
                  fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif',
                  padding: '3px 24px 3px 10px', borderRadius: '20px',
                  border: '1px solid transparent', cursor: 'pointer',
                  backgroundColor: editStatus === 'completed' ? '#DCFCE7' : '#FEF3C7',
                  color: editStatus === 'completed' ? '#166534' : '#92400E',
                  appearance: 'auto',
                }}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Due Date</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {editDueDate && getDueDateUrgency(editDueDate) === 'overdue' && (
                  <AlertTriangle style={{ width: 14, height: 14, color: '#EF4444', flexShrink: 0 }} />
                )}
                <input
                  type="date"
                  value={editDueDate}
                  onChange={e => setEditDueDate(e.target.value)}
                  style={{
                    fontSize: '14px', fontFamily: 'Inter, sans-serif',
                    color: editDueDate && getDueDateUrgency(editDueDate) === 'overdue' ? '#EF4444' : '#374151',
                    border: '1px solid #D1D5DB', borderRadius: '6px',
                    padding: '3px 6px', outline: 'none', cursor: 'pointer',
                  }}
                />
              </div>
            </div>

            {/* Assigned To */}
            {editingTask?.assignedTo && (
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Assigned To</span>
                <span style={{ fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>{editingTask.assignedTo.name}</span>
              </div>
            )}

            {/* Action chip */}
            {editingTask?.action && (
              <div style={{ backgroundColor: '#EFF6FF', padding: '10px 14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#1D4ED8', fontFamily: 'Inter, sans-serif' }}>
                  {editingTask.action}
                </span>
              </div>
            )}

            {/* Type */}
            {editingTask?.type && (
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>Type</p>
                <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{editingTask.type}</p>
              </div>
            )}

            {/* Trigger */}
            {editingTask?.trigger && (
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>Trigger</p>
                <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{editingTask.trigger}</p>
              </div>
            )}

            {/* Footer */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSaveEdit}
                className="flex-1"
                style={{ padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#005B94', color: '#fff', fontSize: '14px', fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingTask(null)}
                className="flex-1"
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#fff', color: '#374151', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
