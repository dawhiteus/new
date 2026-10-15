// Requirements data mirroring what the MVP currently shows.
// Kept separate from the legacy BrokerFlow SAMPLE_DEALS.

export interface MvpCollection {
  name: string;
  totalSpaces: number;
  location: string;
  locationSpaces: number;
  budgetLabel: string;
  budgetSpaces: number;
  peopleLabel: string;
  peopleSpaces: number;
  saved: number;
  shortlisted: number;
  updated: string;
}

export interface RequirementNote {
  author: string;
  date: string;
  text: string;
}

export const STAGES = ['Intake', 'Evaluation', 'Proposal', 'Contracting', 'Execution'] as const;

export const ASSIGNEES = ['Unassigned', 'Brent Trebels', 'David White', 'Create Collection Agent', 'Assess Collection Agent'];

export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface WorkflowTask {
  id: string;
  stage: string;
  name: string;
  description: string;
  status: TaskStatus;
  assignee: string;
  dueDate: string;
  dependsOn: string;
}

const T = (stage: string, name: string, description: string, status: TaskStatus = 'Not Started'): WorkflowTask => ({
  id: `${stage}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  stage, name, description, status, assignee: '', dueDate: '', dependsOn: '',
});

/** Default MVP task set; Intake is complete when the requirement is past Intake. */
export function defaultTasks(currentStage: string): WorkflowTask[] {
  const introDone: TaskStatus = currentStage === 'Intake' ? 'Not Started' : 'Completed';
  return [
    T('Intake', 'Requirement intake', 'Define business and commercial requirements', introDone),
    T('Evaluation', 'Create Collection', 'Build Compliant Collection and Confirm Availability'),
    T('Evaluation', 'Assess Collection', 'Evaluate Collection Against Requirement Criteria'),
    T('Evaluation', 'Shortlist', 'Evaluate Alternatives and Recommend Shortlist'),
    T('Evaluation', 'Tour', 'Coordinate and Document Tour Evaluations'),
    T('Proposal', 'Review proposal(s)', 'Compare Proposals and Identify Negotiation Targets'),
    T('Proposal', 'Site selection', 'Select Final Space Option and Notify Stakeholders'),
    T('Contracting', 'Legal review', 'Manage Agreement Routing and Legal Risk Resolution'),
    T('Execution', 'Contract execution', 'Complete Document Finalization and Approval Process'),
    T('Execution', 'Onboarding', 'Prepare and Distribute Venue Onboarding Manual'),
    T('Execution', 'License Administration', 'Validate Closure Documents and Confirm Operational Handoff'),
  ];
}

export type MemberType = 'Unknown' | 'Internal' | 'External' | 'Agent';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string; // MVP enum value, e.g. 'RequirementsLead'
  type: MemberType;
  organization: string;
  phone: string;
  description?: string;
  /** Agents display the task they own instead of a role label. */
  taskLabel?: string;
}

export function defaultTeam(): TeamMember[] {
  return [
    { id: 'm-brent', name: 'Brent Trebels', email: 'brent@liquidspace.com', role: 'RequirementsLead', type: 'Internal', organization: 'LiquidSpace', phone: '' },
    {
      id: 'm-assess', name: 'Collection Assessment Agent', email: 'assessment.agent@ai.liquidspace.com', role: 'CollectionEvaluationAgent',
      type: 'Agent', organization: 'LiquidSpace AI', phone: '', taskLabel: 'Assess collection',
      description: "A Requirement-aware lens layered on top of LiquidSpace's existing recommendations. Answers: how well does this specific collection satisfy this specific requirement? Evaluates each space across five dimensions — location proximity, workspace type, size and capacity, budget, and term. Runs automatically after sourcing completes, and re-triggers when requirement fields are edited.",
    },
    {
      id: 'm-sourcing', name: 'Market Sourcing Agent', email: 'sourcing.agent@ai.liquidspace.com', role: 'MarketplaceSearchAgent',
      type: 'Agent', organization: 'LiquidSpace AI', phone: '', taskLabel: 'Build collection',
      description: 'Searches the LiquidSpace marketplace and builds a comprehensive first-pass candidate set — not a curated shortlist. Its purpose is to give the Collection Assessment Agent and human reviewers a full option set to work from. After this task completes, the Collection Assessment Agent runs automatically and the Collection tab becomes visible on the requirement.',
    },
    {
      id: 'm-intake', name: 'Requirements Intake Agent', email: 'requirements.agent@ai.liquidspace.com', role: 'RequirementsAgent',
      type: 'Agent', organization: 'LiquidSpace AI', phone: '', taskLabel: 'Structure requirement',
      description: 'Convert natural language descriptions, uploaded briefs, or reference spaces into structured requirement drafts.',
    },
  ];
}

export interface RequirementDocument {
  id: string;
  name: string;
  sizeBytes: number;
  uploadedAt: string; // display date
  /** Object URL for files uploaded this session (enables Download). */
  url?: string;
}

export type TimelineEventType = 'created' | 'team' | 'collection' | 'task' | 'document' | 'update' | 'note';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  date: string; // display date
  actor: string;
}

export const CURRENT_USER_EMAIL = 'david@liquidspace.com';

export interface RequirementDetails {
  dealId: string;
  createdDate: string; // ISO
  location: string;
  capacity: string;
  size: string;
  workspaceType: string;
  configuration: string;
  programNeeds: string;
  amenityNeeds: string;
  otherFunctional: string;
  startDate: string; // ISO or ''
  termLength: string;
  closeDate: string;
  otherCommercial: string;
  notes: RequirementNote[];
  tasks: WorkflowTask[];
  team: TeamMember[];
  documents: RequirementDocument[];
  events: TimelineEvent[];
}

export const EMPTY_DETAILS: RequirementDetails = {
  dealId: '', createdDate: '', location: '', capacity: '', size: '', workspaceType: '', configuration: '',
  programNeeds: '', amenityNeeds: '', otherFunctional: '', startDate: '', termLength: '0', closeDate: '',
  otherCommercial: '', notes: [], tasks: [], team: [], documents: [], events: [],
};

export interface MvpRequirement {
  id: string;
  name: string;
  company: string;
  status: 'Active' | 'Draft' | 'Executed' | 'Archived';
  stage: string;
  budget: number;
  city: string;
  lastUpdated: string; // ISO date
  agentTasks: number;
  collection: MvpCollection;
  details: RequirementDetails;
}

export const MVP_REQUIREMENTS: MvpRequirement[] = [
  {
    id: 'req-lisbon',
    name: 'Lisbon',
    company: 'Slalom',
    status: 'Active',
    stage: 'Evaluation',
    budget: 0,
    city: 'Lisbon',
    lastUpdated: '2026-09-22',
    agentTasks: 1,
    collection: {
      name: 'Lisbon Collection',
      totalSpaces: 6,
      location: 'In Lisbon, Portugal',
      locationSpaces: 0,
      budgetLabel: 'Within $0/mo',
      budgetSpaces: 0,
      peopleLabel: 'For 4-6 people',
      peopleSpaces: 0,
      saved: 2,
      shortlisted: 4,
      updated: 'Sep 22, 2026',
    },
    details: {
      ...EMPTY_DETAILS,
      createdDate: '2026-08-25',
      location: 'Lisbon',
      capacity: '5',
      size: '375',
      configuration: 'Single space',
      tasks: defaultTasks('Evaluation'),
      team: defaultTeam(),
      events: [
        { id: 'e1', type: 'created', title: 'Requirement Created', description: 'Lisbon requirement created for Slalom', date: 'Aug 25, 2026', actor: 'brent@liquidspace.com' },
        { id: 'e2', type: 'team', title: 'Team Member Added', description: 'Brent Trebels added to the requirement team.', date: 'Aug 25, 2026', actor: 'brent@liquidspace.com' },
        { id: 'e3', type: 'collection', title: 'Collection Created', description: 'Lisbon Collection collection created for Lisbon requirement.', date: 'Aug 25, 2026', actor: 'david@liquidspace.com' },
        { id: 'e4', type: 'task', title: 'Task Updated', description: "'Requirement intake' updated in Intake: Status was changed from Not Started to Completed", date: 'Sep 22, 2026', actor: 'david@liquidspace.com' },
      ],
      notes: [
        {
          author: 'Brent Trebels',
          date: 'Aug 25, 2026',
          text: 'Start Date: October 1, 2026 Location: Lisbon - Saldanha & Entrecampos areas preferred Term Length: 12 months Headcount: 5 people Configuration: One private office for 5 people/workstations',
        },
      ],
    },
  },
  {
    id: 'req-test',
    name: 'Test',
    company: 'Test',
    status: 'Active',
    stage: 'Evaluation',
    budget: 0,
    city: 'Test',
    lastUpdated: '2026-09-22',
    agentTasks: 0,
    collection: {
      name: 'Test Collection',
      totalSpaces: 0,
      location: 'In Test',
      locationSpaces: 0,
      budgetLabel: 'Within $0/mo',
      budgetSpaces: 0,
      peopleLabel: 'For 1-1 people',
      peopleSpaces: 0,
      saved: 0,
      shortlisted: 0,
      updated: 'Sep 22, 2026',
    },
    details: { ...EMPTY_DETAILS, createdDate: '2026-09-22', location: 'Test', tasks: defaultTasks('Evaluation'), team: defaultTeam(),
      events: [{ id: 'e1', type: 'created', title: 'Requirement Created', description: 'Test requirement created for Test', date: 'Sep 22, 2026', actor: 'david@liquidspace.com' }] },
  },
];
