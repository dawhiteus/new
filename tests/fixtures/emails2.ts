import type { Case } from './emails';

// A second batch written after the parser was tuned: different phrasing, different formats.
export const CASES2: Case[] = [
  {
    id: 'outlook-thread', title: 'Outlook-style reply chain',
    text: `Thanks, that works. Let's go with 18 seats then.

From: Sam Lee <sam@liquidspace.com>
Sent: Tuesday, November 3, 2026 2:15 PM
To: Lena Ortiz <lena@vantagehealth.com>
Subject: RE: Office space in Raleigh

Lena, to confirm: you need a private office suite in Raleigh for 15 to 20 people, starting around Feb 1?

________________________________
From: Lena Ortiz <lena@vantagehealth.com>
Sent: Monday, November 2, 2026 10:01 AM
Subject: Office space in Raleigh

Hi Sam, Vantage Health needs an office in Raleigh for 15-20 people, starting around Feb 1, 2027. Budget about $18,000/month.`,
    expect: [{ city: 'Raleigh', fields: { location: 'Raleigh', capacity: '18', startDate: '2027-02-01', budget: '18000', company: 'Vantage Health' }, approx: ['budget'] }],
  },
  {
    id: 'bulleted', title: 'Bulleted requirements list',
    text: `Requirements for the Tampa office:
- Location: Tampa, FL (Westshore preferred)
- Headcount: 22
- Size: 4,500 sq ft
- Start: September 1, 2027
- Term: 3 years
- Budget: $28,000 / month
- Must have: parking, 24/7 access, 2 conference rooms`,
    expect: [{ city: 'Tampa', fields: { location: 'Tampa', capacity: '22', size: '4500', startDate: '2027-09-01', termLength: '36', budget: '28000' }, contains: { amenityNeeds: ['parking', '24/7 access'], programNeeds: ['2 conference rooms'] } }],
  },
  {
    id: 'brokers-client', title: 'Broker writing about a client',
    text: `Hi Brent, my client Orchard Capital is looking at Boston for a small team, 5 people. They want a private office, nothing huge. Start is whenever we find something good, probably Q1 next year. They'd do a 12 month term. Price isn't a concern yet.`,
    expect: [{ city: 'Boston', fields: { company: 'Orchard Capital', location: 'Boston', capacity: '5', workspaceType: 'Private Office', startDate: '2027-01-01', termLength: '12' }, empty: ['budget'], prov: { startDate: 'suggested' } }],
  },
  {
    id: 'word-numbers', title: 'Number words and informal terms',
    text: `We are twelve people and need a team office in Columbus, on a one year deal, starting next month.`,
    expect: [{ city: 'Columbus', fields: { location: 'Columbus', capacity: '12', workspaceType: 'Team Office', termLength: '12', startDate: '2026-12-01' }, prov: { startDate: 'suggested' } }],
  },
  {
    id: 'collection-multiple', title: 'Several spaces in one market',
    text: `We want a few small satellite offices around Chicago for our field reps, about 4 people each, 12 people total. Month to month is fine.`,
    expect: [{ city: 'Chicago', fields: { location: 'Chicago', configuration: 'Collection of spaces', termLength: '1', capacity: '12' }, prov: { termLength: 'suggested' } }],
  },
  {
    id: 'close-and-start', title: 'Close date separate from start date',
    text: `The board approves on December 10 so we need to sign by December 18. Space for 30 people in Seattle, move-in January 4, 2027, 36 months.`,
    expect: [{ city: 'Seattle', fields: { location: 'Seattle', capacity: '30', startDate: '2027-01-04', closeDate: '2026-12-18', termLength: '36' } }],
  },
  {
    id: 'sqft-per-person', title: 'Square feet per person is not total size',
    text: `For Denver, 40 people at about 150 sq ft per person. Budget $60 per sq ft per year.`,
    expect: [{ city: 'Denver', fields: { location: 'Denver', capacity: '40' }, empty: ['size', 'budget'] }],
  },
  {
    id: 'no-location', title: 'Requirement without a location',
    text: `We need a private office for 3 people from July 1, 2027 for a year. Budget $4,500 a month.`,
    expect: [{ city: '', fields: { capacity: '3', workspaceType: 'Private Office', startDate: '2027-07-01', termLength: '12', budget: '4500' }, empty: ['location'] }],
  },
  {
    id: 'revision-same-email', title: 'Customer corrects themselves in the same email',
    text: `We need 20 desks in Austin. Actually, correction: make it 24 desks. Starting August 1, 2027.`,
    expect: [{ city: 'Austin', fields: { location: 'Austin', capacity: '24', startDate: '2027-08-01' }, notes: ['revised'] }],
  },
  {
    id: 'sublease-notes', title: 'Commercial context is kept, not lost',
    text: `We need an office in Pittsburgh for 16 people from May 1, 2027. We would need the lease to include an expansion option for another 10 seats, and a break clause after year two. Please include parking.`,
    expect: [{ city: 'Pittsburgh', fields: { location: 'Pittsburgh', capacity: '16', startDate: '2027-05-01' }, contains: { otherCommercial: ['expansion option', 'break clause'], amenityNeeds: ['parking'] } }],
  },
];

CASES2.push({
  id: 'denver-hybrid', title: 'Hybrid team, counts in words and parentheses',
  text: `Hi Brent,

Following up on our call. We're opening a Denver office for the Brightline Health sales team - about 18 people, though only ~12 in the office on any given day since we're hybrid. Ideally in LoDo or near Union Station. We'd want private offices for the managers (4 or so) and open desks for everyone else, plus a couple of meeting rooms and phone booths. Target start is early next quarter, on a 2 year term. Budget is somewhere around $22k/month but we can stretch a bit if the space is great.

Thanks,
Priya Shah
VP Operations
Brightline Health`,
  expect: [{ city: 'Denver', fields: { company: 'Brightline Health', location: 'Denver', capacity: '18', workspaceType: 'Private Office', startDate: '2027-01-01', termLength: '24', budget: '22000' }, contains: { programNeeds: ['4 private offices', '2 meeting rooms', 'open workstations'], amenityNeeds: ['phone booths'], otherFunctional: ['LoDo', 'Union Station'] }, prov: { capacity: 'suggested', startDate: 'suggested' }, target: ['startDate', 'budget'], approx: ['capacity', 'budget'] }],
});

CASES2.push({
  id: 'signature-no-signoff', title: 'Name and company closing the email without a sign-off word',
  text: `We need space in Madrid for about 25 people, starting October 1, 2026 for 12 months. Private offices. Budget around $30,000 per month.

Maria Alves
Slalom`,
  expect: [{ city: 'Madrid', fields: { company: 'Slalom', location: 'Madrid', capacity: '25', startDate: '2026-10-01', termLength: '12', budget: '30000', workspaceType: 'Private Office' } }],
});
