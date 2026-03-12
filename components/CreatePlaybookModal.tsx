import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import {
  FileText,
  Video,
  CheckSquare,
  Link as LinkIcon,
  Calendar,
  X,
  Plus,
  User,
  Bot,
  TrendingUp,
} from 'lucide-react';

interface CreatePlaybookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePlaybookModal({
  isOpen,
  onClose,
}: CreatePlaybookModalProps) {
  const [knowledgeSource, setKnowledgeSource] = useState<'human' | 'agent' | 'promote'>('human');
  const [agentName, setAgentName] = useState('');
  const [generatedFromDeal, setGeneratedFromDeal] = useState('');
  const [taskContext, setTaskContext] = useState('');
  const [validationStatus, setValidationStatus] = useState('draft');
  const [entryType, setEntryType] = useState<string>('text');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedTaskTypes, setSelectedTaskTypes] = useState<string[]>([]);
  const [dealType, setDealType] = useState('');
  const [isCanonical, setIsCanonical] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      knowledgeSource,
      agentName,
      generatedFromDeal,
      taskContext,
      validationStatus,
      entryType,
      title,
      description,
      content,
      externalUrl,
      tags,
      selectedStages,
      selectedTaskTypes,
      dealType,
      isCanonical,
    });
    onClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <FileText className="h-5 w-5" />;
      case 'link':
        return <LinkIcon className="h-5 w-5" />;
      case 'checklist':
        return <CheckSquare className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'calendar':
        return <Calendar className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const stages = ['Requirement', 'Evaluate', 'Terms', 'Negotiation', 'Contracting', 'Executed'];
  const taskTypes = ['Assess Collection', 'Negotiate Terms', 'Legal Review', 'Draft Addendum', 'Risk Review', 'Structured Evaluation'];

  const toggleStage = (stage: string) => {
    setSelectedStages(prev =>
      prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]
    );
  };

  const toggleTaskType = (type: string) => {
    setSelectedTaskTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto p-0"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <DialogHeader className="px-6 py-6 border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#005B94' }}>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle
                className="text-white"
                style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Create New Playbook Entry
              </DialogTitle>
              <DialogDescription className="sr-only">
                Create a new playbook entry by selecting type, adding title, description, content, tags, and visibility settings
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Form Content */}
        <div className="p-6 space-y-5">
          {/* Knowledge Source Selection */}
          <div>
            <Label
              htmlFor="knowledge-source"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Knowledge Source
            </Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <button
                onClick={() => setKnowledgeSource('human')}
                className={`flex items-center gap-2 justify-center p-3 rounded-lg border-2 transition-all ${
                  knowledgeSource === 'human'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User
                  className="h-5 w-5"
                  style={{
                    color: knowledgeSource === 'human' ? '#005B94' : '#6B7280',
                  }}
                />
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: knowledgeSource === 'human' ? '#005B94' : '#374151',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Human
                </span>
              </button>
              <button
                onClick={() => setKnowledgeSource('agent')}
                className={`flex items-center gap-2 justify-center p-3 rounded-lg border-2 transition-all ${
                  knowledgeSource === 'agent'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Bot
                  className="h-5 w-5"
                  style={{
                    color: knowledgeSource === 'agent' ? '#005B94' : '#6B7280',
                  }}
                />
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: knowledgeSource === 'agent' ? '#005B94' : '#374151',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Agent
                </span>
              </button>
              <button
                onClick={() => setKnowledgeSource('promote')}
                className={`flex items-center gap-2 justify-center p-3 rounded-lg border-2 transition-all ${
                  knowledgeSource === 'promote'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <TrendingUp
                  className="h-5 w-5"
                  style={{
                    color: knowledgeSource === 'promote' ? '#005B94' : '#6B7280',
                  }}
                />
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: knowledgeSource === 'promote' ? '#005B94' : '#374151',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Promote from Deal
                </span>
              </button>
            </div>
          </div>

          {/* Agent-specific fields */}
          {knowledgeSource === 'agent' && (
            <div className="space-y-4 p-4 rounded-lg" style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }}>
              <div>
                <Label
                  htmlFor="agent-name"
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#374151',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Agent Name
                </Label>
                <Select value={agentName} onValueChange={setAgentName}>
                  <SelectTrigger
                    className="mt-1 border-gray-300 bg-white"
                    style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                  >
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transaction-coordinator">TransactionCoordinatorAgent</SelectItem>
                    <SelectItem value="market-sourcing">MarketSourcingAgent</SelectItem>
                    <SelectItem value="risk-compliance">RiskComplianceAgent</SelectItem>
                    <SelectItem value="stakeholder-alignment">StakeholderAlignmentAgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="generated-from"
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#374151',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Generated From (Deal)
                </Label>
                <Select value={generatedFromDeal} onValueChange={setGeneratedFromDeal}>
                  <SelectTrigger
                    className="mt-1 border-gray-300 bg-white"
                    style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                  >
                    <SelectValue placeholder="Select deal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teltech-nyc">Tel Tech NYC Expansion</SelectItem>
                    <SelectItem value="mediaco-chicago">MediaCo Chicago Office</SelectItem>
                    <SelectItem value="fintech-sf">FinTech SF HQ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="task-context"
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#374151',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Task Context
                </Label>
                <Select value={taskContext} onValueChange={setTaskContext}>
                  <SelectTrigger
                    className="mt-1 border-gray-300 bg-white"
                    style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                  >
                    <SelectValue placeholder="Select task context" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assess-collection">Assess Collection – Sourcing Stage</SelectItem>
                    <SelectItem value="negotiate-terms">Negotiate Terms – Negotiation Stage</SelectItem>
                    <SelectItem value="draft-addendum">Draft Addendum – Negotiation Stage</SelectItem>
                    <SelectItem value="risk-review">Risk Review – Contracting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="validation-status"
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#374151',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Validation Status
                </Label>
                <Select value={validationStatus} onValueChange={setValidationStatus}>
                  <SelectTrigger
                    className="mt-1 border-gray-300 bg-white"
                    style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="validated">Team Validated</SelectItem>
                    <SelectItem value="canonical">Canonical – Agent Referencable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Promote from Deal fields */}
          {knowledgeSource === 'promote' && (
            <div className="space-y-4 p-4 rounded-lg" style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }}>
              <div>
                <Label
                  htmlFor="source-deal"
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#374151',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Source Deal
                </Label>
                <Select value={generatedFromDeal} onValueChange={setGeneratedFromDeal}>
                  <SelectTrigger
                    className="mt-1 border-gray-300 bg-white"
                    style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                  >
                    <SelectValue placeholder="Select deal to promote from" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teltech-nyc">Tel Tech NYC Expansion</SelectItem>
                    <SelectItem value="mediaco-chicago">MediaCo Chicago Office</SelectItem>
                    <SelectItem value="fintech-sf">FinTech SF HQ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p
                style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Title and description will be auto-filled from the selected deal. Default validation status: Draft.
              </p>
            </div>
          )}

          {/* Entry Type Selection */}
          <div>
            <Label
              htmlFor="entry-type"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Entry Type
            </Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {[
                { value: 'text', label: 'Document', icon: FileText },
                { value: 'link', label: 'Link', icon: LinkIcon },
                { value: 'checklist', label: 'Checklist', icon: CheckSquare },
                { value: 'video', label: 'Video', icon: Video },
                { value: 'calendar', label: 'Calendar', icon: Calendar },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setEntryType(type.value)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    entryType === type.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <type.icon
                    className="h-5 w-5"
                    style={{
                      color: entryType === type.value ? '#005B94' : '#6B7280',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: entryType === type.value ? '#005B94' : '#374151',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label
              htmlFor="title"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter a descriptive title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 border-gray-300"
              style={{ fontSize: '16px', fontFamily: 'Inter, sans-serif' }}
            />
          </div>

          {/* Description */}
          <div>
            <Label
              htmlFor="description"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Brief description of this resource..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 border-gray-300"
              style={{ fontSize: '16px', fontFamily: 'Inter, sans-serif' }}
              rows={3}
            />
          </div>

          {/* Content (for text type) */}
          {entryType === 'text' && (
            <div>
              <Label
                htmlFor="content"
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Content
              </Label>
              <Textarea
                id="content"
                placeholder="Write your content here... (supports Markdown)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 border-gray-300"
                style={{ fontSize: '16px', fontFamily: 'Inter, sans-serif' }}
                rows={8}
              />
              <p
                className="mt-1"
                style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Tip: Use Markdown formatting for rich text
              </p>
            </div>
          )}

          {/* External URL (for link, video, calendar types) */}
          {(entryType === 'link' ||
            entryType === 'video' ||
            entryType === 'calendar') && (
            <div>
              <Label
                htmlFor="url"
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {entryType === 'link' && 'External Link URL'}
                {entryType === 'video' && 'Video URL'}
                {entryType === 'calendar' && 'Calendar Link'}
              </Label>
              <Input
                id="url"
                placeholder={
                  entryType === 'link'
                    ? 'https://docs.google.com/...'
                    : entryType === 'video'
                    ? 'https://www.loom.com/share/...'
                    : 'https://calendar.google.com/...'
                }
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                className="mt-1 border-gray-300"
                style={{ fontSize: '16px', fontFamily: 'Inter, sans-serif' }}
              />
              <p
                className="mt-1"
                style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {entryType === 'link' &&
                  'Supports Google Docs, Dropbox, Notion, and other platforms'}
                {entryType === 'video' && 'Supports Loom, YouTube, and Vimeo links'}
                {entryType === 'calendar' && 'Paste a shareable calendar link'}
              </p>
            </div>
          )}

          {/* Checklist Items (for checklist type) */}
          {entryType === 'checklist' && (
            <div>
              <Label
                htmlFor="checklist"
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Checklist Items
              </Label>
              <Textarea
                id="checklist"
                placeholder="Enter each checklist item on a new line..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 border-gray-300"
                style={{ fontSize: '16px', fontFamily: 'Inter, sans-serif' }}
                rows={6}
              />
              <p
                className="mt-1"
                style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Each line will become a checkbox item
              </p>
            </div>
          )}

          {/* Knowledge Classification Section */}
          <div className="pt-4 border-t border-gray-200">
            <h3
              className="mb-4"
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Knowledge Classification
            </h3>

            {/* Applies To - Stage */}
            <div className="mb-4">
              <Label
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Applies To – Stage (Multi-Select)
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {stages.map((stage) => (
                  <button
                    key={stage}
                    onClick={() => toggleStage(stage)}
                    className={`px-3 py-1.5 rounded-md border transition-all ${
                      selectedStages.includes(stage)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            {/* Task Type */}
            <div className="mb-4">
              <Label
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Task Type (Multi-Select)
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {taskTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleTaskType(type)}
                    className={`px-3 py-1.5 rounded-md border transition-all ${
                      selectedTaskTypes.includes(type)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Deal Type */}
            <div className="mb-4">
              <Label
                htmlFor="deal-type"
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Deal Type
              </Label>
              <Select value={dealType} onValueChange={setDealType}>
                <SelectTrigger
                  className="mt-1 border-gray-300"
                  style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                >
                  <SelectValue placeholder="Select deal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="flex">Flex</SelectItem>
                  <SelectItem value="renewal">Renewal</SelectItem>
                  <SelectItem value="expansion">Expansion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mark as Canonical */}
            <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }}>
              <Switch
                id="canonical"
                checked={isCanonical}
                onCheckedChange={setIsCanonical}
              />
              <div className="flex-1">
                <Label
                  htmlFor="canonical"
                  className="cursor-pointer"
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#374151',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Mark as Canonical (Available for Agent Reference)
                </Label>
                {isCanonical && (
                  <p
                    className="mt-1"
                    style={{
                      fontSize: '12px',
                      color: '#6B7280',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Agents may reference this guidance automatically when generating tasks or outputs.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label
              htmlFor="tags"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Tags
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="tags"
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                className="border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: '#F8F9FA',
                      color: '#374151',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p
              className="mt-1"
              style={{
                fontSize: '12px',
                color: '#6B7280',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Suggested: Process, Training, Sales, Legal, Template, HowTo
            </p>
          </div>

          {/* Team/Visibility */}
          <div>
            <Label
              htmlFor="visibility"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Visibility
            </Label>
            <Select defaultValue="all">
              <SelectTrigger
                className="mt-1 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              >
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="sales">Sales Team Only</SelectItem>
                <SelectItem value="legal">Legal Team Only</SelectItem>
                <SelectItem value="research">Research Team Only</SelectItem>
                <SelectItem value="private">Private (Only Me)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300"
            style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !description.trim()}
            className="text-white"
            style={{
              backgroundColor: '#005B94',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Create Entry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}