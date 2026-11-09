// Realistic customer correspondence used to test the Requirement Agent's reading of pasted text.
// These are test data only. Nothing here is referenced by the application.
// Reference date for every case is 2026-11-09 unless a case says otherwise.

export interface Expect {
  city: string;
  /** Exact values for these fields. */
  fields?: Record<string, string>;
  /** Fields that must stay empty (the agent must not invent them). */
  empty?: string[];
  /** Substrings that must appear in a free-text field. */
  contains?: Record<string, string[]>;
  /** Provenance kinds expected ('source' = stated, 'suggested' = inferred). */
  prov?: Record<string, 'source' | 'suggested'>;
  approx?: string[];
  target?: string[];
  /** Fields that must have an ambiguity reported. */
  ambiguous?: string[];
  /** Substrings expected in notes. */
  notes?: string[];
}
export interface Case { id: string; title: string; text: string; today?: string; answerMode?: boolean; expect: Expect[] }

export const CASES: Case[] = [
  {
    id: 'two-markets', title: 'Two markets in one email (the original sample)',
    text: `Hi Brent,

We're expanding the Slalom team in Europe and need space in Lisbon and Porto. Lisbon first: about 25 people, starting October 1, 2026 for 12 months. We'd like private offices with phone booths and a reception, ideally in Saldanha or Avenidas Novas. Budget is around $30,000 per month for Lisbon. Porto is smaller, roughly 10 people, starting January 2027, no budget yet - we're still deciding on the model. Can you send options?

Thanks,
Maria Alves
Slalom`,
    expect: [
      { city: 'Lisbon', fields: { company: 'Slalom', location: 'Lisbon', capacity: '25', startDate: '2026-10-01', termLength: '12', budget: '30000', workspaceType: 'Private Office' }, approx: ['capacity', 'budget'], contains: { amenityNeeds: ['phone booths', 'reception'], otherFunctional: ['Saldanha', 'Avenidas Novas'] }, empty: ['size', 'closeDate'] },
      { city: 'Porto', fields: { location: 'Porto', capacity: '10', startDate: '2027-01-01' }, prov: { startDate: 'suggested' }, approx: ['capacity'], empty: ['budget', 'termLength'] },
    ],
  },
  {
    id: 'short-incomplete', title: 'Short, informal, incomplete',
    text: `hey - we need an office in Denver for around 12 people. can you help?`,
    expect: [{ city: 'Denver', fields: { location: 'Denver', capacity: '12' }, approx: ['capacity'], empty: ['company', 'budget', 'startDate', 'termLength', 'size', 'workspaceType', 'closeDate'] }],
  },
  {
    id: 'detailed-brief', title: 'Detailed multi-paragraph brief with signature',
    text: `Subject: Space request - New York

Hi Brent,

Thanks for the call on Tuesday. Here is what we discussed so you have it in writing.

We're opening a new office in New York and will start with roughly 40 people, growing to 60 within a year. We want private offices (about 12 of them), open workstations for the rest, three meeting rooms and a staffed reception. We need around 8,000 sq ft in total.

Ideally Midtown, or near Grand Central. Our budget is $85,000 per month and that's a hard cap. We'd like to move in by March 1, 2027 on a 5-year lease. We need a decision by January 15.

Best regards,
Dana Kim
Director of Real Estate
Acme Corp
dana.kim@acme.com | 212-555-0100`,
    expect: [{
      city: 'New York',
      fields: { company: 'Acme Corp', location: 'New York', capacity: '60', size: '8000', budget: '85000', startDate: '2027-03-01', termLength: '60', closeDate: '2027-01-15', workspaceType: 'Private Office' },
      contains: { programNeeds: ['private offices', '3 meeting rooms', 'open workstations'], amenityNeeds: ['reception'], otherFunctional: ['Midtown'], otherCommercial: ['firm ceiling'] },
      target: ['startDate'], approx: ['size'],
    }],
  },
  {
    id: 'forwarded', title: 'Forwarded email with a short note on top',
    text: `FYI, can you take this one?

Sent from my iPhone

---------- Forwarded message ---------
From: Priya Nair <priya@northwind.io>
Date: Mon, Nov 2, 2026 at 9:14 AM
Subject: Coworking in Austin
To: Sam Lee <sam@liquidspace.com>

Hi Sam,

We're a small team of 6 and want coworking space in Austin starting June 1. Probably a 6 month commitment to start. Budget is about $3,500 a month.

Priya`,
    expect: [{ city: 'Austin', fields: { company: 'Northwind', location: 'Austin', capacity: '6', workspaceType: 'Coworking', startDate: '2027-06-01', termLength: '6', budget: '3500' }, prov: { company: 'suggested', startDate: 'suggested' }, approx: ['budget'] }],
  },
  {
    id: 'thread-revision', title: 'Thread where the newest message revises headcount',
    text: `Quick update: we've grown. We're now at 35 people for Boston, not 25. Everything else stays the same.

On Mon, Oct 26, 2026 at 3:02 PM Rob Chen <rob@brightwave.com> wrote:
> Hi,
> We need space in Boston for 25 people, budget $40,000 per month, starting February 1, 2027 for 24 months.
> Rob
> Brightwave`,
    expect: [{ city: 'Boston', fields: { location: 'Boston', capacity: '35', budget: '40000', startDate: '2027-02-01', termLength: '24' }, notes: ['earlier message said 25'] }],
  },
  {
    id: 'noise', title: 'Disclaimer, company background and small talk',
    text: `Hi there,

Great seeing you at the conference! Our CEO is still talking about the keynote.

For context, we were founded in 2012, raised a $40M Series B last year, and have about 800 employees worldwide. Right now the Chicago group needs a little room: 15 seats starting around April 1, 2027.

Best,
Jordan Wells
Operations Lead
Fieldstone Partners
jordan@fieldstone.com

CONFIDENTIAL: This e-mail is intended only for the recipient. If you have received this in error, please delete it.`,
    expect: [{ city: 'Chicago', fields: { company: 'Fieldstone Partners', location: 'Chicago', capacity: '15', startDate: '2027-04-01' }, empty: ['budget', 'termLength', 'size', 'closeDate'] }],
  },
  {
    id: 'conversational', title: 'Requirements spread through ordinary conversation',
    text: `Hi Brent,

So the thing is, the sales team keeps getting bigger and we're out of room. Realistically we'd want something by mid-January. It would be about 20 desks, coworking style is fine since people come and go. Maybe $12k a month? I don't have a real number yet. Let's say we sign for 6 months and see how it goes. It has to be in Portland, because that's where our reps live.

Thanks!
Tom
Harbor Freight Logistics`,
    expect: [{ city: 'Portland', fields: { location: 'Portland', capacity: '20', workspaceType: 'Coworking', startDate: '2027-01-15', termLength: '6', budget: '12000' }, approx: ['budget'], target: ['budget'], prov: { startDate: 'suggested' } }],
  },
  {
    id: 'area-flex-vs-must', title: 'Preferred neighborhood versus required one',
    text: `We need a private office for 8 people in Seattle. We'd prefer to be in South Lake Union but anywhere downtown works. The space must be within 10 minutes of King Street Station. Starting July 1, 2027.`,
    expect: [{ city: 'Seattle', fields: { location: 'Seattle', capacity: '8', workspaceType: 'Private Office', startDate: '2027-07-01' }, contains: { otherFunctional: ['Preferred area: South Lake Union', 'Required area: within 10 minutes of King Street Station'] } }],
  },
  {
    id: 'budget-cap', title: 'Hard budget limit',
    text: `Looking for an office in Atlanta for 14 people. We can't go above $22,000 a month, that's approved by finance and doesn't move.`,
    expect: [{ city: 'Atlanta', fields: { location: 'Atlanta', capacity: '14', budget: '22000' }, contains: { otherCommercial: ['firm ceiling'] }, empty: ['startDate', 'termLength'] }],
  },
  {
    id: 'budget-flexible', title: 'Budget target that is flexible',
    text: `We're hoping to be around $30k per month for a 10 person office in Miami, but there's some flexibility if the space is right. Start would be June 1, 2027.`,
    expect: [{ city: 'Miami', fields: { location: 'Miami', capacity: '10', budget: '30000', startDate: '2027-06-01' }, target: ['budget'], approx: ['budget'] }],
  },
  {
    id: 'multiple-types', title: 'Several workspace types',
    text: `We want private offices for the leadership team and a coworking area for everyone else, in Nashville. 18 people overall. Start May 3, 2027.`,
    expect: [{ city: 'Nashville', fields: { location: 'Nashville', workspaceType: 'Private Office', capacity: '18', startDate: '2027-05-03' }, notes: ['Coworking'] }],
  },
  {
    id: 'conditional', title: 'Conditional requirement',
    text: `We need space in Dallas for 20 people. If the Houston contract comes through we'd need 40 desks instead, but that's not decided. Starting February 1, 2027.`,
    expect: [{ city: 'Dallas', fields: { location: 'Dallas', capacity: '20', startDate: '2027-02-01' }, ambiguous: ['capacity'] }],
  },
  {
    id: 'missing-dates', title: 'No dates, no term',
    text: `Looking for a private office in Miami for 4 people. Budget is $6,000 monthly.`,
    expect: [{ city: 'Miami', fields: { location: 'Miami', capacity: '4', budget: '6000', workspaceType: 'Private Office' }, empty: ['startDate', 'termLength', 'closeDate', 'size'] }],
  },
  {
    id: 'contradiction', title: 'Contradictory headcount in one message',
    text: `We need space in Denver for 25 people. The Denver team will be 40 people. Budget $20,000 a month.`,
    expect: [{ city: 'Denver', fields: { location: 'Denver', budget: '20000' }, empty: ['capacity'], ambiguous: ['capacity'] }],
  },
  {
    id: 'relative-date', title: 'Relative start date',
    text: `We're opening a Houston office for 12 people early next quarter, on a 2 year term.`,
    expect: [{ city: 'Houston', fields: { location: 'Houston', capacity: '12', startDate: '2027-01-01', termLength: '24' }, prov: { startDate: 'suggested' } }],
  },
  {
    id: 'current-vs-new', title: 'Current office is not the new location',
    text: `Our HQ is in Boston with about 30 people currently. We're opening a second office in Nashville for 8 people. Starting September 1, 2027.`,
    expect: [{ city: 'Nashville', fields: { location: 'Nashville', capacity: '8', startDate: '2027-09-01' }, notes: ['currently in Boston'] }],
  },
  {
    id: 'hybrid', title: 'Employees are not necessarily seats',
    text: `We have 40 employees in Dallas but we run hybrid, about 3 days a week in the office. Looking for a team office near Uptown.`,
    expect: [{ city: 'Dallas', fields: { location: 'Dallas', capacity: '40', workspaceType: 'Team Office' }, prov: { capacity: 'suggested' } }],
  },
  {
    id: 'annual-budget', title: 'Annual budget is converted and disclosed',
    text: `Looking for an office in Phoenix for 10 people. Our budget is $180,000 per year. Start March 15, 2027 for 3 years.`,
    expect: [{ city: 'Phoenix', fields: { location: 'Phoenix', capacity: '10', budget: '15000', termLength: '36', startDate: '2027-03-15' }, prov: { budget: 'suggested' } }],
  },
  {
    id: 'per-seat-budget', title: 'Per-person budget uses the stated headcount',
    text: `We need 10 seats in San Diego at roughly $900 per person per month. Starting April 1, 2027.`,
    expect: [{ city: 'San Diego', fields: { location: 'San Diego', capacity: '10', budget: '9000', startDate: '2027-04-01' }, prov: { budget: 'suggested' } }],
  },
  {
    id: 'foreign-currency', title: 'Foreign currency is not converted',
    text: `We need a private office in London for 9 people, budget €25,000 per month, starting October 1, 2027.`,
    expect: [{ city: 'London', fields: { location: 'London', capacity: '9', startDate: '2027-10-01', workspaceType: 'Private Office' }, empty: ['budget'], ambiguous: ['budget'], contains: { otherCommercial: ['€25,000'] } }],
  },
  {
    id: 'metric-size', title: 'Square meters converted, month-only start',
    text: `We need about 300 square meters in Madrid for around 35 people from March 2027.`,
    expect: [{ city: 'Madrid', fields: { location: 'Madrid', size: '3229', capacity: '35', startDate: '2027-03-01' }, prov: { size: 'suggested', startDate: 'suggested' } }],
  },
  {
    id: 'irrelevant', title: 'Irrelevant text',
    text: `Thanks so much for lunch last week! The tacos were great. Let me know when you're free for coffee.`,
    expect: [{ city: '', empty: ['company', 'location', 'capacity', 'size', 'budget', 'startDate', 'termLength', 'workspaceType', 'closeDate', 'programNeeds', 'amenityNeeds', 'otherFunctional', 'otherCommercial'] }],
  },
  {
    id: 'answer-short', title: 'A short answer to open questions',
    answerMode: true,
    text: `$25k, starting June 1`,
    expect: [{ city: '', fields: { budget: '25000', startDate: '2027-06-01' }, prov: { budget: 'suggested', startDate: 'suggested' } }],
  },
  {
    id: 'lease-expiry', title: 'Lease expiry is context, not the start date',
    text: `Our current lease in Minneapolis ends March 31, 2027 and we'd like to renew for about 20 people. Looking at 12 months.`,
    expect: [{ city: 'Minneapolis', fields: { location: 'Minneapolis', capacity: '20', termLength: '12' }, empty: ['startDate'], contains: { otherCommercial: ['ends Mar 31, 2027'] } }],
  },
  {
    id: 'sf-range', title: 'Ranges and abbreviations',
    text: `Hi - we're a startup looking for about 20-25 people worth of desks in SF, 2,000 to 3,000 sf, 12-24 month term. Budget $15-18k/mo.`,
    expect: [{ city: 'San Francisco', fields: { location: 'San Francisco', capacity: '25', size: '3000', termLength: '12', budget: '18000' }, approx: ['capacity', 'size', 'budget'] }],
  },
  {
    id: 'meeting-rooms-not-type', title: 'Meeting rooms are program needs, not the workspace type',
    text: `We need office space in Charlotte for 30 people with 4 meeting rooms and a kitchen. Starting August 2, 2027.`,
    expect: [{ city: 'Charlotte', fields: { location: 'Charlotte', capacity: '30', startDate: '2027-08-02' }, empty: ['workspaceType'], contains: { programNeeds: ['4 meeting rooms'], amenityNeeds: ['kitchen/pantry'] } }],
  },
];
