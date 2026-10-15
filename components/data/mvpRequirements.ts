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
}

export const EMPTY_DETAILS: RequirementDetails = {
  dealId: '', createdDate: '', location: '', capacity: '', size: '', workspaceType: '', configuration: '',
  programNeeds: '', amenityNeeds: '', otherFunctional: '', startDate: '', termLength: '0', closeDate: '',
  otherCommercial: '', notes: [],
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
    details: { ...EMPTY_DETAILS, createdDate: '2026-09-22', location: 'Test' },
  },
];
