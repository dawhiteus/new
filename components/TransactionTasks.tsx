import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
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
  X,
} from 'lucide-react';
import { toast } from './ui/toast';

// ─── Types ────────────────────────────────────────────────────────────────────

type TaskStatus = 'Open' | 'Completed';
type SortKey = 'dealId' | 'taskType' | 'stage' | 'detail' | 'dueDate' | 'assignedTo' | 'status';

interface Note {
  text: string;
  timestamp: string;
}

interface TransactionTask {
  id: string;
  dealId: string;
  dealName: string;
  taskType: string;
  stage: string;
  detail: string;
  dueDate: string;
  assignedTo: string;
  status: TaskStatus;
  notes: Note[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_TASKS: TransactionTask[] = [
  {
    id: '1',
    dealId: 'TXN-2024-001',
    dealName: 'Tel Tech — Chicago HQ',
    taskType: 'Evaluate Spaces',
    stage: 'Evaluation',
    detail: '',
    dueDate: '2026-06-18',
    assignedTo: '',
    status: 'Open',
    notes: [],
  },
  {
    id: '2',
    dealId: 'TXN-2024-001',
    dealName: 'Tel Tech — Chicago HQ',
    taskType: 'Schedule Tour',
    stage: 'Evaluation',
    detail: 'Schedule tours for top 3 shortlisted spaces with client',
    dueDate: '2026-05-14',
    assignedTo: 'sarah@teltech.com',
    status: 'Open',
    notes: [],
  },
  {
    id: '3',
    dealId: 'TXN-2025-002',
    dealName: 'Acme Corp — NYC Expansion',
    taskType: 'Request Proposal',
    stage: 'Proposal & Negotiation',
    detail: 'Nothing back from landlord yet. Follow up on Hudson Yards term sheet.',
    dueDate: '2026-05-12',
    assignedTo: 'michael@liquidspace.com',
    status: 'Open',
    notes: [],
  },
  {
    id: '4',
    dealId: 'TXN-2025-002',
    dealName: 'Acme Corp — NYC Expansion',
    taskType: 'Negotiate Terms',
    stage: 'Proposal & Negotiation',
    detail: 'Review lease terms for Park Ave Suites',
    dueDate: '2026-05-12',
    assignedTo: 'sarah@liquidspace.com',
    status: 'Open',
    notes: [],
  },
  {
    id: '5',
    dealId: 'TXN-2026-003',
    dealName: 'Meridian Group — Austin',
    taskType: 'Coordinate Legal Review',
    stage: 'Legal & Contracting',
    detail: '',
    dueDate: '2026-05-08',
    assignedTo: 'legal@meridian.com',
    status: 'Open',
    notes: [],
  },
  {
    id: '6',
    dealId: 'TXN-2026-003',
    dealName: 'Meridian Group — Austin',
    taskType: 'Complete Execution',
    stage: 'Legal & Contracting',
    detail: 'Coordinate execution and signatures with legal team',
    dueDate: '2026-07-01',
    assignedTo: 'jennifer@liquidspace.com',
    status: 'Open',
    notes: [],
  },
  {
    id: '7',
    dealId: 'TXN-2024-001',
    dealName: 'Tel Tech — Chicago HQ',
    taskType: 'Assess Collection',
    stage: 'Evaluation',
    detail: '',
    dueDate: '2026-05-08',
    assignedTo: 'agent@liquidspace.com',
    status: 'Open',
    notes: [],
  },
  {
    id: '8',
    dealId: 'TXN-2025-002',
    dealName: 'Acme Corp — NYC Expansion',
    taskType: 'Schedule Tour',
    stage: 'Evaluation',
    detail: 'Client prefers morning slots, Midtown only',
    dueDate: '2026-05-08',
    assignedTo: 'sarah@liquidspace.com',
    status: 'Open',
    notes: [],
  },
  {
    id: '9',
    dealId: 'TXN-2024-004',
    dealName: 'GlobalBank — Boston Hub',
    taskType: 'Review License Terms',
    stage: 'Legal & Contracting',
    detail: 'Confirm insurance requirements match policy',
    dueDate: '2026-05-05',
    assignedTo: 'matt@liquidspace.com',
    status: 'Open',
    notes: [],
  },
  {
    id: '10',
    dealId: 'TXN-2024-004',
    dealName: 'GlobalBank — Boston Hub',
    taskType: 'Make Payment',
    stage: 'Closeout',
    detail: '',
    dueDate: '2026-05-01',
    assignedTo: 'matt@liquidspace.com',
    status: 'Open',
    notes: [],
  },
  {
    id: '11',
    dealId: 'TXN-2024-004',
    dealName: 'GlobalBank — Boston Hub',
    taskType: 'Review License Terms',
    stage: 'Legal & Contracting',
    detail: 'Get security deposit details confirmed',
    dueDate: '2026-04-30',
    assignedTo: 'matt@liquidspace.com',
    status: 'Open',
    notes: [],
  },
  {
    id: '12',
    dealId: 'TXN-2024-001',
    dealName: 'Tel Tech — Chicago HQ',
    taskType: 'Build Collection',
    stage: 'Evaluation',
    detail: '12 spaces sourced — collection ready for assessment',
    dueDate: '2026-04-15',
    assignedTo: 'agent@liquidspace.com',
    status: 'Completed',
    notes: [],
  },
  {
    id: '13',
    dealId: 'TXN-2025-002',
    dealName: 'Acme Corp — NYC Expansion',
    taskType: 'Evaluate Spaces',
    stage: 'Evaluation',
    detail: '',
    dueDate: '2026-04-10',
    assignedTo: 'michael@liquidspace.com',
    status: 'Completed',
    notes: [],
  },
];

const TASK_TYPES = [
  'Evaluate Spaces',
  'Build Collection',
  'Assess Collection',
  'Schedule Tour',
  'Request Proposal',
  'Negotiate Terms',
  'Coordinate Legal Review',
  'Complete Execution',
  'Review License Terms',
  'Make Payment',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date(new Date().toDateString());
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${m}/${d}/${y}`;
}

function formatDateLong(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Dot-menu component ───────────────────────────────────────────────────────

function RowMenu({ onViewDetails, onRemove }: { onViewDetails: () => void; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
        <div style={{
          position: 'absolute', right: 0, top: '100%', zIndex: 50,
          backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.10)', minWidth: '140px', overflow: 'hidden',
        }}>
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

// ─── Main component ───────────────────────────────────────────────────────────

interface TransactionTasksProps {
  onAIAssistantOpen?: () => void;
  isAIDrawerOpen?: boolean;
}

export function TransactionTasks({ onAIAssistantOpen = () => {}, isAIDrawerOpen = false }: TransactionTasksProps) {
  const [tasks, setTasks] = useState<TransactionTask[]>(MOCK_TASKS);

  // Filters
  const [filterDeal, setFilterDeal]         = useState('');
  const [filterType, setFilterType]         = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterStatus, setFilterStatus]     = useState('');

  // Sort
  const [sortKey, setSortKey]     = useState<SortKey>('dueDate');
  const [sortAsc, setSortAsc]     = useState(true);

  // Detail modal
  const [detailTask, setDetailTask]     = useState<TransactionTask | null>(null);
  const [noteInput, setNoteInput]       = useState('');
  const [editDueDate, setEditDueDate]   = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState('');
  const [editStatus, setEditStatus]     = useState<TaskStatus>('Open');

  // New task modal
  const [showNew, setShowNew]     = useState(false);
  const [newForm, setNewForm]     = useState({ taskType: 'Evaluate Spaces', dealId: '', dueDate: '', assignTo: '', description: '' });

  // Assign inline
  const [assigningId, setAssigningId]   = useState<string | null>(null);
  const [assignInput, setAssignInput]   = useState('');

  // ── Derived values ───────────────────────────────────────────────────────
  const now = new Date(new Date().toDateString());
  const openTasks    = tasks.filter(t => t.status === 'Open');
  const overdueTasks = tasks.filter(t => t.status === 'Open' && isOverdue(t.dueDate));

  const uniqueDeals     = Array.from(new Set(tasks.map(t => t.dealId)));
  const uniqueTypes     = Array.from(new Set(tasks.map(t => t.taskType)));
  const uniqueAssignees = Array.from(new Set(tasks.map(t => t.assignedTo).filter(Boolean)));

  // ── Filtered + sorted ────────────────────────────────────────────────────
  const visible = tasks
    .filter(t => !filterDeal     || t.dealId === filterDeal)
    .filter(t => !filterType     || t.taskType === filterType)
    .filter(t => !filterAssignee || t.assignedTo === filterAssignee)
    .filter(t => !filterStatus   || t.status === filterStatus)
    .sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  // ── Task actions ─────────────────────────────────────────────────────────
  const handleRemove = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    toast.info('Task removed.');
  };

  const openDetail = (task: TransactionTask) => {
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

  const handleComplete = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'Completed' } : t));
    setDetailTask(prev => prev?.id === id ? { ...prev, status: 'Completed' } : prev);
    toast.success('Task marked complete.');
  };

  const handleAddNote = (id: string) => {
    if (!noteInput.trim()) return;
    const note: Note = { text: noteInput.trim(), timestamp: new Date().toLocaleString() };
    setTasks(prev => prev.map(t => t.id === id ? { ...t, notes: [...t.notes, note] } : t));
    setDetailTask(prev => prev?.id === id ? { ...prev, notes: [...(prev.notes || []), note] } : prev);
    setNoteInput('');
  };

  const handleAssign = (id: string) => {
    if (!assignInput.trim()) return;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, assignedTo: assignInput.trim() } : t));
    setAssigningId(null);
    setAssignInput('');
  };

  const handleCreateTask = () => {
    if (!newForm.taskType || !newForm.dueDate) return;
    const task: TransactionTask = {
      id: String(Date.now()),
      dealId: newForm.dealId || 'TXN-MANUAL',
      dealName: tasks.find(t => t.dealId === newForm.dealId)?.dealName ?? newForm.dealId ?? 'Unlinked',
      taskType: newForm.taskType,
      stage: '',
      detail: newForm.description,
      dueDate: newForm.dueDate,
      assignedTo: newForm.assignTo,
      status: 'Open',
      notes: [],
    };
    setTasks(prev => [task, ...prev]);
    setNewForm({ taskType: 'Evaluate Spaces', dealId: '', dueDate: '', assignTo: '', description: '' });
    setShowNew(false);
    toast.success(`Task "${task.taskType}" created.`);
  };

  const SortHeader = ({ label, sortId }: { label: string; sortId: SortKey }) => (
    <TableHead
      onClick={() => handleSort(sortId)}
      style={{ fontSize: '11px', fontWeight: 700, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }}
    >
      <span className="flex items-center gap-1">
        {label}
        <ChevronsUpDown className="h-3 w-3 text-gray-400" />
      </span>
    </TableHead>
  );

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-page, #F9FAFB)' }}>
      <PageHeader
        icon={<ListTodo className="h-6 w-6" />}
        title="Tasks"
        subtitle="Review upcoming expirations, overdue payments, and setup tasks that require your attention."
        onAIAssistantOpen={onAIAssistantOpen}
        isAIDrawerOpen={isAIDrawerOpen}
        hideAIButton
      />

      <div className="p-6 max-w-7xl mx-auto space-y-5">

        {/* ── Metric cards ──────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Open Tasks */}
            <div className="rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                <Clock className="w-6 h-6" style={{ color: '#F59E0B' }} />
              </div>
              <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>Open Tasks</p>
              <p style={{ fontSize: '36px', fontWeight: 700, color: '#111827', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>
                {openTasks.length}
              </p>
            </div>
            {/* Overdue Tasks */}
            <div className="rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
                <AlertCircle className="w-6 h-6" style={{ color: '#EF4444' }} />
              </div>
              <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>Overdue Tasks</p>
              <p style={{ fontSize: '36px', fontWeight: 700, color: '#EF4444', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>
                {overdueTasks.length}
              </p>
            </div>
          </div>
        </div>

        {/* ── Table card ────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">

          {/* Filters + Add Task */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 flex-wrap">
              <select value={filterDeal} onChange={e => setFilterDeal(e.target.value)} style={selectStyle}>
                <option value="">All Deals</option>
                {uniqueDeals.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} style={selectStyle}>
                <option value="">All Types</option>
                {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
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
            <Button
              onClick={() => setShowNew(true)}
              className="text-white"
              style={{ backgroundColor: '#005B94', fontSize: '13px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
            >
              Add Task
            </Button>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: '#E5E7EB' }}>
                <SortHeader label="Deal ID"      sortId="dealId" />
                <SortHeader label="Task Type"    sortId="taskType" />
                <SortHeader label="Stage"        sortId="stage" />
                <SortHeader label="Detail"       sortId="detail" />
                <SortHeader label="Due Date"     sortId="dueDate" />
                <SortHeader label="Assigned To"  sortId="assignedTo" />
                <SortHeader label="Status"       sortId="status" />
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map(task => {
                const overdue = task.status === 'Open' && isOverdue(task.dueDate);
                return (
                  <TableRow key={task.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: '#F3F4F6' }}>

                    {/* Deal ID */}
                    <TableCell style={{ paddingTop: '14px', paddingBottom: '14px', fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
                      {task.dealId}
                    </TableCell>

                    {/* Task Type */}
                    <TableCell style={{ paddingTop: '14px', paddingBottom: '14px', fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      {task.taskType}
                    </TableCell>

                    {/* Stage */}
                    <TableCell style={{ paddingTop: '14px', paddingBottom: '14px', fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      {task.stage}
                    </TableCell>

                    {/* Detail */}
                    <TableCell style={{ paddingTop: '14px', paddingBottom: '14px', maxWidth: '190px', width: '190px' }}>
                      {task.detail ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span style={{
                              display: 'block',
                              fontSize: '13px',
                              color: '#6B7280',
                              fontFamily: 'Inter, sans-serif',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              cursor: 'default',
                            }}>
                              {task.detail}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            sideOffset={6}
                            className="max-w-xs text-xs leading-relaxed"
                            style={{ whiteSpace: 'normal', fontFamily: 'Inter, sans-serif' }}
                          >
                            {task.detail}
                          </TooltipContent>
                        </Tooltip>
                      ) : null}
                    </TableCell>

                    {/* Due Date */}
                    <TableCell style={{ paddingTop: '14px', paddingBottom: '14px', fontSize: '14px', color: overdue ? '#EF4444' : '#374151', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', fontWeight: overdue ? 500 : 400 }}>
                      {formatDate(task.dueDate)}
                    </TableCell>

                    {/* Assigned To */}
                    <TableCell style={{ paddingTop: '14px', paddingBottom: '14px' }}>
                      {assigningId === task.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            autoFocus
                            value={assignInput}
                            onChange={e => setAssignInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleAssign(task.id); if (e.key === 'Escape') setAssigningId(null); }}
                            placeholder="email@company.com"
                            style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', width: '160px', outline: 'none' }}
                          />
                          <button onClick={() => handleAssign(task.id)} style={{ fontSize: '12px', color: '#005B94', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Save</button>
                          <button onClick={() => setAssigningId(null)} style={{ fontSize: '12px', color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
                        </div>
                      ) : task.assignedTo ? (
                        <span style={{ fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>{task.assignedTo}</span>
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
                    <TableCell style={{ paddingTop: '14px', paddingBottom: '14px' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 12px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif',
                        backgroundColor: task.status === 'Completed' ? '#DCFCE7' : '#FEF3C7',
                        color: task.status === 'Completed' ? '#166534' : '#92400E',
                      }}>
                        {task.status}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell style={{ paddingTop: '14px', paddingBottom: '14px', textAlign: 'right' }}>
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

      {/* ── Task Details modal ─────────────────────────────────────────────── */}
      {detailTask && (
        <Dialog open={!!detailTask} onOpenChange={open => { if (!open) setDetailTask(null); }}>
          <DialogContent className="max-w-sm p-0 overflow-hidden" style={{ borderRadius: '12px' }}>
            {/* Blue header */}
            <div style={{ backgroundColor: '#005B94', padding: '16px 20px', position: 'relative' }}>
              <DialogHeader>
                <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: '#fff', fontFamily: 'Inter, sans-serif' }}>
                  Task Details
                </DialogTitle>
                <DialogDescription style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter, sans-serif' }}>
                  {detailTask.dealId}
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

              {/* Task type chip */}
              <div style={{ backgroundColor: '#EFF6FF', padding: '10px 14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#1D4ED8', fontFamily: 'Inter, sans-serif' }}>
                  {detailTask.taskType}
                </span>
              </div>

              {/* Stage */}
              {detailTask.stage && (
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>Stage</p>
                  <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{detailTask.stage}</p>
                </div>
              )}

              {/* Deal */}
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>Deal</p>
                <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{detailTask.dealName}</p>
              </div>

              {/* Existing notes */}
              {detailTask.notes.length > 0 && (
                <div className="space-y-2">
                  {detailTask.notes.map((n, i) => (
                    <div key={i} style={{ backgroundColor: '#F9FAFB', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                      <p style={{ fontSize: '13px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>{n.text}</p>
                      <p style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>{n.timestamp}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '6px' }}>Notes</p>
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

              {/* Footer buttons */}
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

      {/* ── New Task modal ─────────────────────────────────────────────────── */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-lg p-0 overflow-hidden" style={{ borderRadius: '12px' }}>
          {/* Blue header */}
          <div style={{ backgroundColor: '#005B94', padding: '16px 20px' }}>
            <DialogHeader>
              <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: '#fff', fontFamily: 'Inter, sans-serif' }}>
                New Task
              </DialogTitle>
              <DialogDescription className="sr-only">Create a new task</DialogDescription>
            </DialogHeader>
          </div>

          {/* Body */}
          <div style={{ padding: '24px' }} className="space-y-4">
            {/* Row 1: Task Type + Deal Id */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Task Type</Label>
                <select
                  value={newForm.taskType}
                  onChange={e => setNewForm({ ...newForm, taskType: e.target.value })}
                  style={{ ...selectStyle, width: '100%', marginTop: '6px' }}
                >
                  {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <Label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Deal ID</Label>
                <select
                  value={newForm.dealId}
                  onChange={e => setNewForm({ ...newForm, dealId: e.target.value })}
                  style={{ ...selectStyle, width: '100%', marginTop: '6px' }}
                >
                  <option value="">Select deal (optional)</option>
                  {uniqueDeals.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Row 2: Due Date + Assign To */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Due Date</Label>
                <Input
                  type="date"
                  value={newForm.dueDate}
                  onChange={e => setNewForm({ ...newForm, dueDate: e.target.value })}
                  className="mt-1.5"
                  style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif' }}
                />
              </div>
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
            </div>

            {/* Description */}
            <div>
              <Label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Description</Label>
              <Textarea
                value={newForm.description}
                onChange={e => setNewForm({ ...newForm, description: e.target.value })}
                placeholder="Add task context or instructions..."
                className="mt-1.5"
                style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', minHeight: '80px' }}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleCreateTask}
                disabled={!newForm.taskType || !newForm.dueDate}
                style={{
                  padding: '10px 24px', borderRadius: '8px', border: 'none',
                  backgroundColor: !newForm.taskType || !newForm.dueDate ? '#93C5FD' : '#005B94',
                  color: '#fff', fontSize: '14px', fontWeight: 600, fontFamily: 'Inter, sans-serif',
                  cursor: !newForm.taskType || !newForm.dueDate ? 'default' : 'pointer',
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
