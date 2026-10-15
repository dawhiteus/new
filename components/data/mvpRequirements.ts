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
  },
];
