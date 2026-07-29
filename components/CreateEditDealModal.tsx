import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { X, Bot, FileText, Upload, Building2, Loader2, Check } from 'lucide-react';
import { toast } from './ui/toast';

interface CreateEditDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal?: any;
}

type AgentMode = 'describe' | 'upload' | 'reference';

const WORKSPACE_TYPES = ['Office Suite', 'Team Office', 'Private Office', 'Coworking', 'Meeting Space', 'Headquarters'];

// ── Fake "agent" draft generation ────────────────────────────────────────────

function generateDraftFromDescription(text: string) {
  const t = text.toLowerCase();
  const companies = ['at&t', 'cisco', 'salesforce', 'amazon', 'microsoft', 'google', 'jpmorgan', 'deloitte', 'kpmg', 'pwc', 'ibm', 'oracle'];
  const company = companies.find(c => t.includes(c))?.toUpperCase().replace('&', '&') || 'AT&T';
  const cityMap: Record<string, string> = {
    'new york': 'New York', 'nyc': 'New York', 'manhattan': 'New York',
    'san francisco': 'San Francisco', 'sf': 'San Francisco',
    'chicago': 'Chicago', 'dallas': 'Dallas', 'boston': 'Boston',
    'seattle': 'Seattle', 'austin': 'Austin', 'los angeles': 'Los Angeles',
    'miami': 'Miami', 'denver': 'Denver', 'houston': 'Houston',
    'atlanta': 'Atlanta', 'philadelphia': 'Philadelphia',
  };
  const city = Object.entries(cityMap).find(([k]) => t.includes(k))?.[1] || 'New York';
  const typeMap: Record<string, string> = {
    'cowork': 'Coworking', 'flex': 'Coworking', 'headquarters': 'Headquarters', 'hq': 'Headquarters',
    'private office': 'Private Office', 'suite': 'Office Suite', 'office': 'Office Suite',
  };
  const wsType = Object.entries(typeMap).find(([k]) => t.includes(k))?.[1] || 'Office Suite';
  const sizeMatch = t.match(/(\d[\d,]*)\s*(sq\s*ft|sqft|sf)/);
  const size = sizeMatch ? sizeMatch[1].replace(',', '') : String(Math.round((Math.random() * 4 + 2) * 1000));
  const value = String(Math.round(parseInt(size) * 0.045 * 100) * 100);
  return {
    dealName: `${company} ${city} Workspace`,
    clientName: company,
    city,
    workspaceType: [wsType],
    size,
    estValue: value,
    serviceProvider: 'Sarah Chen',
    status: 'Active',
    headcount: String(Math.max(10, Math.round(parseInt(size) / 110))),
    programNeeds: 'Open workstations, 3 meeting rooms, 2 team rooms, and a kitchen/pantry.',
    amenityNeeds: 'On-site staffed reception, secure badge access, and bookable phone booths.',
    configuration: 'single',
    otherFunctional: '',
    otherCommercial: '',
  };
}

function generateDraftFromUpload(filename: string) {
  const base = filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
  return {
    dealName: base || 'Uploaded Brief Requirement',
    clientName: '',
    city: '',
    workspaceType: ['Office Suite'],
    size: '3500',
    estValue: '158000',
    serviceProvider: 'Michael Torres',
    status: 'Active',
    headcount: '32',
    programNeeds: 'Open workstations, 2 meeting rooms, and a collaboration area.',
    amenityNeeds: 'Reception, high-speed internet, and on-site parking.',
    configuration: 'single',
    otherFunctional: '',
    otherCommercial: '',
  };
}

function generateDraftFromReference(ref: string) {
  return {
    dealName: `Reference Space Requirement`,
    clientName: '',
    city: '',
    workspaceType: ['Private Office'],
    size: '2200',
    estValue: '94000',
    serviceProvider: 'Jessica Park',
    status: 'Active',
    headcount: '20',
    programNeeds: 'Private offices, 1 meeting room, and a shared lounge.',
    amenityNeeds: 'Mail handling, cleaning service, and pantry access.',
    configuration: 'collection',
    otherFunctional: '',
    otherCommercial: '',
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CreateEditDealModal({ isOpen, onClose, deal }: CreateEditDealModalProps) {
  const [agentMode, setAgentMode] = useState<AgentMode>('describe');
  const [agentText, setAgentText] = useState('');
  const [agentRef, setAgentRef] = useState('');
  const [agentFile, setAgentFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    dealName:         deal?.dealName || '',
    clientName:       deal?.clientName || '',
    city:             deal?.city || '',
    workspaceType:    (deal?.workspaceType ? [deal.workspaceType] : []) as string[],
    size:             deal?.size ? String(deal.size) : '',
    estValue:         deal?.estValue ? String(deal.estValue) : '',
    serviceProvider:  deal?.broker || '',
    status:           deal?.status === 'Executed' || deal?.status === 'Archived' ? 'Active' : (deal?.status || 'Active'),
    headcount:        '',
    term:             '',
    startDate:        '',
    termMonths:       '',
    programNeeds:     '',
    amenityNeeds:     '',
    configuration:    'single',
    otherFunctional:  '',
    otherCommercial:  '',
  });
  const toggleWorkspaceType = (t: string) =>
    setFormData(prev => ({
      ...prev,
      workspaceType: prev.workspaceType.includes(t)
        ? prev.workspaceType.filter(x => x !== t)
        : [...prev.workspaceType, t],
    }));

  const canGenerate =
    (agentMode === 'describe' && agentText.trim().length > 0) ||
    (agentMode === 'upload' && agentFile !== null) ||
    (agentMode === 'reference' && agentRef.trim().length > 0);

  function handleGenerate() {
    if (!canGenerate || isGenerating) return;
    setIsGenerating(true);
    setTimeout(() => {
      let draft: ReturnType<typeof generateDraftFromDescription>;
      if (agentMode === 'describe') draft = generateDraftFromDescription(agentText);
      else if (agentMode === 'upload') draft = generateDraftFromUpload(agentFile?.name || '');
      else draft = generateDraftFromReference(agentRef);
      setFormData(prev => ({ ...prev, ...draft }));
      setIsGenerating(false);
      toast.success('Draft requirement generated — review and confirm below.');
    }, 1800);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    if (deal) {
      toast.success('Requirement updated successfully.');
    } else {
      toast.success(`Requirement "${formData.dealName}" created.`);
    }
  };

  // ── Tab config ──────────────────────────────────────────────────────────────

  const tabs: { key: AgentMode; icon: React.ReactNode; label: string[] }[] = [
    { key: 'describe',   icon: <FileText className="h-5 w-5" />, label: ['Describe', 'Requirement'] },
    { key: 'upload',     icon: <Upload className="h-5 w-5" />,   label: ['Upload Brief'] },
    { key: 'reference',  icon: <Building2 className="h-5 w-5" />, label: ['Use Reference', 'Space'] },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <DialogDescription className="sr-only">
          {deal ? 'Edit requirement details' : 'Create a new workspace requirement'}
        </DialogDescription>

        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#005B94' }}>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white" style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
              {deal ? 'Edit Requirement' : 'Create New Requirement'}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 88px)' }}>

          {/* ── Requirements Intake Agent Panel ── */}
          <div
            className="rounded-xl mb-6 p-4"
            style={{ border: '2px dashed #93C5FD', backgroundColor: '#F0F7FF' }}
          >
            {/* Panel header */}
            <div className="flex items-center gap-2 mb-1">
              <Bot className="h-4 w-4" style={{ color: '#005B94' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E3A5F', fontFamily: 'Inter, sans-serif' }}>
                Requirements Intake Agent
              </span>
              <span
                className="px-2 py-0.5 rounded-full"
                style={{ fontSize: '10px', fontWeight: 600, backgroundColor: '#DBEAFE', color: '#1D4ED8', fontFamily: 'Inter, sans-serif', letterSpacing: '0.02em' }}
              >
                Agent
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: '14px' }}>
              Let the agent help you create a structured requirement from:
            </p>

            {/* Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {tabs.map(({ key, icon, label }) => {
                const selected = agentMode === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAgentMode(key)}
                    className="flex flex-col items-center justify-center rounded-lg transition-colors"
                    style={{
                      padding: '10px 8px',
                      border: `1.5px solid ${selected ? '#2563EB' : '#D1D5DB'}`,
                      backgroundColor: selected ? '#EFF6FF' : '#FFFFFF',
                      cursor: 'pointer',
                      minHeight: '66px',
                      gap: '5px',
                    }}
                  >
                    <span style={{ color: selected ? '#2563EB' : '#6B7280' }}>{icon}</span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: selected ? 600 : 400,
                      color: selected ? '#2563EB' : '#374151',
                      fontFamily: 'Inter, sans-serif',
                      textAlign: 'center',
                      lineHeight: 1.3,
                    }}>
                      {label.map((line, i) => (
                        <span key={i} style={{ display: 'block' }}>{line}</span>
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            {agentMode === 'describe' && (
              <Textarea
                value={agentText}
                onChange={(e) => setAgentText(e.target.value)}
                placeholder="Describe the workspace requirement in natural language. E.g., 'AT&T needs a 5,000 sq ft office suite in Midtown Manhattan for approximately 45 people, targeting Q3 close.'"
                className="border-gray-200 resize-none"
                style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', minHeight: '90px', backgroundColor: '#FFFFFF' }}
              />
            )}

            {agentMode === 'upload' && (
              <div
                className="rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors"
                style={{
                  border: `2px dashed ${isDragging ? '#2563EB' : '#D1D5DB'}`,
                  backgroundColor: isDragging ? '#EFF6FF' : '#FFFFFF',
                  padding: '24px 16px',
                  minHeight: '90px',
                }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file) setAgentFile(file);
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) setAgentFile(e.target.files[0]); }}
                />
                {agentFile ? (
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" style={{ color: '#2563EB' }} />
                    <span style={{ fontSize: '13px', color: '#1E3A5F', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
                      {agentFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setAgentFile(null); }}
                      style={{ color: '#9CA3AF', marginLeft: '4px' }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-6 w-6 mb-2" style={{ color: '#9CA3AF' }} />
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>
                      Click to upload or drag and drop
                    </p>
                    <p style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                      PDF, DOC, DOCX up to 10 MB
                    </p>
                  </>
                )}
              </div>
            )}

            {agentMode === 'reference' && (
              <Input
                value={agentRef}
                onChange={(e) => setAgentRef(e.target.value)}
                placeholder="Enter reference space ID or URL"
                className="border-gray-200"
                style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', backgroundColor: '#FFFFFF' }}
              />
            )}

            {/* Generate button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!canGenerate || isGenerating}
              className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg transition-opacity"
              style={{
                padding: '10px 16px',
                backgroundColor: canGenerate && !isGenerating ? '#1D4ED8' : '#93C5FD',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                cursor: canGenerate && !isGenerating ? 'pointer' : 'default',
                border: 'none',
              }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating draft…
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4" />
                  Generate Draft Requirement
                </>
              )}
            </button>
          </div>

          {/* ── Deal Details ── */}
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#005B94', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'Inter, sans-serif', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid #E5E7EB' }}>
            Deal Details
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Company */}
            <div>
              <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Company *
              </Label>
              <Input
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="e.g. AT&T"
                required
                className="mt-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Service Provider */}
            <div>
              <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Service Provider *
              </Label>
              <Select value={formData.serviceProvider} onValueChange={(v) => setFormData({ ...formData, serviceProvider: v })}>
                <SelectTrigger className="mt-2 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue placeholder="Select service provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                  <SelectItem value="Michael Torres">Michael Torres</SelectItem>
                  <SelectItem value="Jessica Park">Jessica Park</SelectItem>
                  <SelectItem value="David Kim">David Kim</SelectItem>
                  <SelectItem value="Priya Nair">Priya Nair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Status *
              </Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger className="mt-2 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ── Business Requirements ── */}
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#005B94', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'Inter, sans-serif', margin: '24px 0 12px', paddingBottom: '6px', borderBottom: '1px solid #E5E7EB' }}>
            Business Requirements
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Requirement Name */}
            <div className="col-span-2">
              <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Requirement Name *
              </Label>
              <Input
                value={formData.dealName}
                onChange={(e) => setFormData({ ...formData, dealName: e.target.value })}
                placeholder="Enter requirement name"
                required
                className="mt-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Location */}
            <div className="col-span-2">
              <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Location *
              </Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Country / city / neighborhood"
                required
                className="mt-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Workspace Type — multi-select */}
            <div className="col-span-2">
              <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Workspace Type *
              </Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {WORKSPACE_TYPES.map((t) => {
                  const on = formData.workspaceType.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleWorkspaceType(t)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                        borderRadius: 9999, border: `1px solid ${on ? '#005B94' : '#D1D5DB'}`,
                        backgroundColor: on ? '#EFF6FF' : '#FFFFFF', color: on ? '#005B94' : '#374151',
                        fontSize: '13px', fontWeight: on ? 600 : 400, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                      }}
                    >
                      {on && <Check className="h-3.5 w-3.5" />}
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Capacity / Headcount */}
            <div>
              <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Capacity / Headcount *
              </Label>
              <Input
                type="number"
                value={formData.headcount}
                onChange={(e) => setFormData({ ...formData, headcount: e.target.value })}
                placeholder="e.g. 50"
                required
                className="mt-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Size (sq ft) — optional */}
            <div>
              <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Size (sq ft)
              </Label>
              <Input
                type="number"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="Optional"
                className="mt-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Program needs */}
            <div className="col-span-2">
              <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Program Needs
              </Label>
              <Textarea
                value={formData.programNeeds}
                onChange={(e) => setFormData({ ...formData, programNeeds: e.target.value })}
                placeholder="e.g. open workstations, meeting rooms, team rooms, kitchen"
                className="mt-2 border-gray-300 min-h-20"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Amenity needs */}
            <div className="col-span-2">
              <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Amenity Needs
              </Label>
              <Textarea
                value={formData.amenityNeeds}
                onChange={(e) => setFormData({ ...formData, amenityNeeds: e.target.value })}
                placeholder="Describe required on-site amenities"
                className="mt-2 border-gray-300 min-h-20"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Configuration */}
            <div className="col-span-2">
              <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Configuration
              </Label>
              <div className="mt-2 flex gap-2">
                {[{ v: 'single', l: 'Single space' }, { v: 'collection', l: 'Collection of spaces' }].map((opt) => {
                  const on = formData.configuration === opt.v;
                  return (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setFormData({ ...formData, configuration: opt.v })}
                      style={{
                        flex: 1, padding: '9px 12px', borderRadius: 8,
                        border: `1.5px solid ${on ? '#2563EB' : '#D1D5DB'}`,
                        backgroundColor: on ? '#EFF6FF' : '#FFFFFF', color: on ? '#2563EB' : '#374151',
                        fontSize: '13px', fontWeight: on ? 600 : 500, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                      }}
                    >
                      {opt.l}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Other functional requirements */}
            <div className="col-span-2">
              <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Other Functional Requirements
              </Label>
              <Textarea
                value={formData.otherFunctional}
                onChange={(e) => setFormData({ ...formData, otherFunctional: e.target.value })}
                placeholder="Any other functional needs"
                className="mt-2 border-gray-300 min-h-20"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>
          </div>

          {/* ── Commercial Terms ── */}
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#005B94', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'Inter, sans-serif', margin: '24px 0 12px', paddingBottom: '6px', borderBottom: '1px solid #E5E7EB' }}>
            Commercial Terms
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Start Date *
              </Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                className="mt-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Term length (mos) */}
            <div>
              <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Term Length (mos) *
              </Label>
              <Input
                type="number"
                value={formData.termMonths}
                onChange={(e) => setFormData({ ...formData, termMonths: e.target.value })}
                placeholder="e.g. 12"
                required
                className="mt-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Budget ($/mo) */}
            <div>
              <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Budget ($/mo) *
              </Label>
              <Input
                type="number"
                value={formData.estValue}
                onChange={(e) => setFormData({ ...formData, estValue: e.target.value })}
                placeholder="Enter monthly budget"
                required
                className="mt-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Other commercial requirements */}
            <div className="col-span-2">
              <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Other Commercial Requirements
              </Label>
              <Textarea
                value={formData.otherCommercial}
                onChange={(e) => setFormData({ ...formData, otherCommercial: e.target.value })}
                placeholder="Any other commercial terms"
                className="mt-2 border-gray-300 min-h-20"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t" style={{ borderColor: '#E5E7EB' }}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300"
              style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-white"
              style={{ backgroundColor: '#005B94', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
            >
              {deal ? 'Save Changes' : 'Create Requirement'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
