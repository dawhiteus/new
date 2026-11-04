// License rows shown in the License Tracker demo (shared with the Requirement Agent's license picker).
// Dates are relative to today so the term-end filters always have something to show in the demo.
export const DAY_MS = 86400000;
export const toISO = (d: Date) => d.toISOString().slice(0, 10);
export const inDays = (n: number) => toISO(new Date(Date.now() + n * DAY_MS));
export const isISODate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
export const daysFromNow = (iso: string) => Math.round((new Date(iso + 'T00:00:00').getTime() - new Date(new Date().toDateString()).getTime()) / DAY_MS);

// License Type values as used in production.
export const LICENSE_TYPES = ['Dedicated (LiquidSpace License)', 'Dedicated (External License)', 'Traditional Lease'];
export const toLicenseType = (workspaceType: string) =>
  workspaceType === 'Dedicated (LiquidSpace)' ? 'Dedicated (LiquidSpace License)'
  : workspaceType === 'Traditional Lease' || LICENSE_TYPES.includes(workspaceType) ? workspaceType
  : 'Dedicated (External License)';


export const mockLicenses = [
  {
    id: 1,
    licenseId: 'TT-2022-001',
    customer: 'Tel Tech Corporation',
    notificationPeriod: '60 Days',
    noticeDate: inDays(2),
    city: 'Bellevue',
    type: 'Traditional Lease',
    address: 'Tel Tech Campus, 12920 SE 38th St',
    size: '485,000 sq ft',
    cost: 34448,
    seats: 139,
    marketRateComparison: '-8%',
    startDate: '2022-04-01',
    endDate: inDays(62),
    operator: 'Tel Tech Corporation',
    status: 'Active',
    paymentInfo: 'Quarterly Wire Transfer',
    daysUntilExpiration: 89,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    // Add additional fields for the detail modal
    name: 'Tel Tech Engineering Campus',
    property: 'Tel Tech Campus',
    location: 'Bellevue, WA',
    monthlyRent: 34448,
    squareFootage: 485000,
    renewalStatus: 'Under Negotiation',
    lastModified: '2024-09-15',
    documents: [
      { name: 'Master Campus Agreement', type: 'PDF', size: '8.2 MB', uploadDate: '2022-04-01' },
      { name: 'Environmental Impact Study', type: 'PDF', size: '4.1 MB', uploadDate: '2022-03-20' },
      { name: 'Zoning Compliance Certificate', type: 'PDF', size: '1.8 MB', uploadDate: '2024-01-10' }
    ],
    financials: {
      monthlyRent: 34448,
      securityDeposit: 103344,
      brokerFee: 68896,
      totalFirstYear: 482272
    },
    contacts: {
      landlord: { name: 'Tel Tech Properties LLC', phone: '(425) 555-0200', email: 'facilities@teltech.com' },
      broker: { name: 'Jennifer Walsh, CBRE', phone: '(425) 555-0156', email: 'jennifer.walsh@cbre.com' }
    }

  },
  {
    id: 2,
    licenseId: 'TT-2022-002',
    customer: 'Tel Tech Corporation',
    notificationPeriod: '60 Days',
    noticeDate: inDays(100),
    city: 'Atlanta',
    type: 'Dedicated (External License)',
    address: 'WeWork Peachtree, 3424 Peachtree Rd NE',
    size: '180,000 sq ft',
    cost: 4241,
    seats: 11,
    marketRateComparison: '+12%',
    startDate: '2022-06-01',
    endDate: 'autorenew',
    operator: 'WeWork',
    status: 'Active',
    paymentInfo: 'Monthly ACH Auto-Pay',
    daysUntilExpiration: 156,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: 'Tel Tech Atlanta Regional Hub',
    property: 'WeWork Peachtree Center',
    location: 'Atlanta, GA',
    monthlyRent: 4241,
    squareFootage: 180000,
    renewalStatus: 'Renewal Notice Sent',
    lastModified: '2024-08-20',
    documents: [
      { name: 'WeWork Enterprise License Agreement', type: 'PDF', size: '3.8 MB', uploadDate: '2022-06-01' },
      { name: 'Telecommunications Infrastructure Plan', type: 'PDF', size: '2.2 MB', uploadDate: '2022-05-15' }
    ],
    financials: {
      monthlyRent: 4241,
      securityDeposit: 8482,
      brokerFee: 4241,
      totalFirstYear: 59374
    },
    contacts: {
      landlord: { name: 'WeWork Enterprise Sales', phone: '(404) 555-0198', email: 'enterprise@wework.com' },
      broker: { name: 'Marcus Johnson, JLL', phone: '(404) 555-0142', email: 'marcus.johnson@jll.com' }
    }
  },
  {
    id: 3,
    licenseId: 'TT-2023-003',
    customer: 'Tel Tech Corporation',
    notificationPeriod: '60 Days',
    noticeDate: inDays(-60),
    city: 'New York',
    type: 'Dedicated (LiquidSpace License)',
    address: 'Industrious 101 Avenue of the Americas',
    size: '95,000 sq ft',
    cost: 11241,
    seats: 22,
    marketRateComparison: '-3%',
    startDate: '2023-07-01',
    endDate: inDays(0),
    operator: 'Industrious',
    status: 'Active',
    paymentInfo: 'Monthly Auto-Pay',
    daysUntilExpiration: 245,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: 'Tel Tech NYC Engineering Center',
    property: 'Industrious 101 Avenue of the Americas',
    location: 'New York, NY',
    monthlyRent: 11241,
    squareFootage: 95000,
    renewalStatus: 'Renewed',
    lastModified: '2024-06-15',
    documents: [
      { name: 'Industrious Enterprise License', type: 'PDF', size: '2.9 MB', uploadDate: '2023-07-01' },
      { name: 'Security Infrastructure Plan', type: 'PDF', size: '1.6 MB', uploadDate: '2023-06-20' },
      { name: 'Renewed Agreement 2025-2027', type: 'PDF', size: '3.1 MB', uploadDate: '2024-06-15' }
    ],
    financials: {
      monthlyRent: 11241,
      securityDeposit: 22482,
      brokerFee: 11241,
      totalFirstYear: 157374
    },
    contacts: {
      landlord: { name: 'Industrious Enterprise Team', phone: '(212) 555-0174', email: 'enterprise@industrious.com' },
      broker: { name: 'David Chen, Newmark', phone: '(212) 555-0189', email: 'david.chen@newmark.com' }
    }
  },
  {
    id: 4,
    licenseId: 'TT-2024-004',
    customer: 'Tel Tech Corporation',
    notificationPeriod: '90 Days',
    noticeDate: inDays(330),
    city: 'Seattle',
    type: 'Traditional Lease',
    address: 'Tel Tech Partnership Center, 15010 NE 36th St',
    size: '125,000 sq ft',
    cost: 3334,
    seats: 10,
    marketRateComparison: '-15%',
    startDate: '2023-09-01',
    endDate: inDays(420),
    operator: 'Tel Tech Corporation',
    status: 'Active',
    paymentInfo: 'Quarterly Invoice',
    daysUntilExpiration: 298,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: 'Tel Tech Partnership Center',
    property: 'Tel Tech Partnership Campus',
    location: 'Seattle, WA',
    monthlyRent: 3334,
    squareFootage: 125000,
    renewalStatus: 'Evaluation Phase',
    lastModified: '2024-09-10',
    documents: [
      { name: 'Partnership Hub Agreement', type: 'PDF', size: '4.2 MB', uploadDate: '2023-09-01' },
      { name: 'Joint Venture Addendum', type: 'PDF', size: '2.8 MB', uploadDate: '2023-08-15' }
    ],
    financials: {
      monthlyRent: 3334,
      securityDeposit: 6668,
      brokerFee: 0,
      totalFirstYear: 46676
    },
    contacts: {
      landlord: { name: 'Tel Tech Real Estate', phone: '(425) 555-0300', email: 'realestate@teltech.com' },
      broker: { name: 'Direct Partnership', phone: 'N/A', email: 'N/A' }
    }
  },
  {
    id: 5,
    licenseId: 'TT-2021-005',
    customer: 'Tel Tech Corporation',
    notificationPeriod: '90 Days',
    noticeDate: inDays(-135),
    city: 'London',
    type: 'Traditional Lease',
    address: 'One Canada Square, Canary Wharf',
    size: '200,000 sq ft',
    cost: 9420,
    seats: 20,
    marketRateComparison: '+5%',
    startDate: '2022-11-01',
    endDate: inDays(-75),
    operator: 'Canary Wharf Group',
    status: 'Active',
    paymentInfo: 'Monthly Sterling Transfer',
    daysUntilExpiration: 398,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: 'Tel Tech Global Finance Center',
    property: 'One Canada Square',
    location: 'London, UK',
    monthlyRent: 9420,
    squareFootage: 200000,
    renewalStatus: 'Pre-Negotiation',
    lastModified: '2024-08-30',
    documents: [
      { name: 'Canary Wharf Lease Agreement', type: 'PDF', size: '5.1 MB', uploadDate: '2022-11-01' },
      { name: 'FCA Compliance Certificate', type: 'PDF', size: '2.4 MB', uploadDate: '2024-01-15' },
      { name: 'Brexit Impact Assessment', type: 'PDF', size: '1.9 MB', uploadDate: '2023-03-10' }
    ],
    financials: {
      monthlyRent: 9420,
      securityDeposit: 28260,
      brokerFee: 9420,
      totalFirstYear: 131880
    },
    contacts: {
      landlord: { name: 'Canary Wharf Group plc', phone: '+44 20 7555 0200', email: 'leasing@canarywharf.com' },
      broker: { name: 'Sarah Williams, Savills', phone: '+44 20 7555 0156', email: 'sarah.williams@savills.com' }
    }
  },
  {
    id: 6,
    licenseId: 'TT-2023-006',
    customer: 'Tel Tech Corporation',
    notificationPeriod: '60 Days',
    noticeDate: inDays(-260),
    city: 'Dallas',
    type: 'Dedicated (LiquidSpace License)',
    address: 'Regus 2600 Commerce St',
    size: '68,000 sq ft',
    cost: 2711,
    seats: 15,
    marketRateComparison: '-22%',
    startDate: '2023-01-01',
    endDate: inDays(-200),
    operator: 'Regus / IWG',
    status: 'Archived',
    paymentInfo: 'Monthly Invoice',
    daysUntilExpiration: 456,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: 'Tel Tech Dallas Innovation Lab',
    property: 'Regus Deep Ellum',
    location: 'Dallas, TX',
    monthlyRent: 2711,
    squareFootage: 68000,
    renewalStatus: 'Early Renewal Option',
    lastModified: '2024-07-22',
    documents: [
      { name: 'Regus Enterprise License Agreement', type: 'PDF', size: '2.7 MB', uploadDate: '2023-01-01' },
      { name: 'R&D Tax Incentive Agreement', type: 'PDF', size: '1.3 MB', uploadDate: '2023-01-15' }
    ],
    financials: {
      monthlyRent: 2711,
      securityDeposit: 5422,
      brokerFee: 2711,
      totalFirstYear: 37954
    },
    contacts: {
      landlord: { name: 'IWG / Regus Enterprise', phone: '(214) 555-0167', email: 'enterprise@iwgplc.com' },
      broker: { name: 'Roberto Martinez, CBRE', phone: '(214) 555-0134', email: 'roberto.martinez@cbre.com' }
    }
  },
];
mockLicenses.forEach((l: any) => { l.daysUntilExpiration = isISODate(l.endDate) ? daysFromNow(l.endDate) : null; });
