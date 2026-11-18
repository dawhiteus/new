// License rows shown in the License Tracker demo (shared with the Requirement Agent's license picker).
// Dates are relative to today so the term-end filters always have something to show in the demo.
export const DAY_MS = 86400000;
export const toISO = (d: Date) => d.toISOString().slice(0, 10);
export const inDays = (n: number) => toISO(new Date(Date.now() + n * DAY_MS));
export const isISODate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
export const daysFromNow = (iso: string) => Math.round((new Date(iso + 'T00:00:00').getTime() - new Date(new Date().toDateString()).getTime()) / DAY_MS);

// Agreement Type — the kind of agreement a tracked space is held under (shown
// as "Type" where space is tight). Single source of truth for the tracker
// table, filter, distribution chart and the Add/Edit license forms.
export const AGREEMENT_TYPES = [
  'Dedicated (External License)',
  'Dedicated (LiquidSpace)',
  'Traditional Lease',
  'Virtual Office',
  'Managed Space',
];
/** @deprecated use AGREEMENT_TYPES */
export const LICENSE_TYPES = AGREEMENT_TYPES;

// On-Demand (hourly flex) is a first-class Agreement Type in Workplace
// Strategist. It is not something License Administrator records, so it is not
// offered in these menus, but a record that carries it is shown as On-Demand.
export const ON_DEMAND = 'On-Demand';

// Earlier labels, kept so older saved/demo values still resolve.
const LEGACY_AGREEMENT_TYPES: Record<string, string> = {
  'Dedicated (External)': 'Dedicated (External License)',
  'Dedicated (LiquidSpace License)': 'Dedicated (LiquidSpace)',
  'Flex (Hourly)': ON_DEMAND,
};
/** Canonical Agreement Type for a stored value. A value that is not a known
 *  type is returned unchanged rather than silently re-labelled. Blank → the
 *  form default. */
export const toAgreementType = (value: string | undefined | null): string => {
  const v = (value ?? '').trim();
  if (!v) return 'Dedicated (External License)';
  if (AGREEMENT_TYPES.includes(v) || v === ON_DEMAND) return v;
  return LEGACY_AGREEMENT_TYPES[v] ?? v;
};
/** @deprecated use toAgreementType */
export const toLicenseType = toAgreementType;


// Tel Tech is a fictional demo account. These licences mirror the 17 agreements in
// Workplace Strategist's Tel Tech Location Details (same costs, seats, addresses, dates).
export const mockLicenses = [
  {
    id: 1,
    licenseId: "TT-2018-001",
    customer: 'Tel Tech Corporation',
    notificationPeriod: "180 Days",
    city: "New York",
    type: "Traditional Lease",
    address: "One World Trade Center, 285 Fulton St, New York, NY 10007",
    size: "57,000 sq ft",
    cost: 320000,
    seats: 380,
    marketRateComparison: "—",
    startDate: "2018-09-01",
    endDate: "2028-08-31",
    operator: "Lower Manhattan Office Partners LLC",
    status: 'Active',
    paymentInfo: "Monthly Wire Transfer",
    daysUntilExpiration: 0,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: "Tel Tech New York Office",
    property: "One World Trade Center",
    location: "New York, NY",
    monthlyRent: 320000,
    squareFootage: 57000,
    renewalStatus: "Active Term",
    lastModified: '2026-11-18',
    documents: [
      { name: "Lower Manhattan Office Partners LLC Lease Agreement", type: 'PDF', size: '1.2 MB', uploadDate: "2018-09-01" }
    ],
    financials: {
      monthlyRent: 320000,
      securityDeposit: 960000,
      brokerFee: 0,
      totalFirstYear: 3840000
    },
    contacts: {
      landlord: { name: "Lower Manhattan Office Partners LLC Client Services", phone: '(800) 555-0140', email: 'clientservices@example.com' },
      broker: { name: 'LiquidSpace Account Team', phone: '(800) 555-0199', email: 'accounts@liquidspace.com' }
    }
  },
  {
    id: 2,
    licenseId: "TT-2020-002",
    customer: 'Tel Tech Corporation',
    notificationPeriod: "180 Days",
    city: "Austin",
    type: "Traditional Lease",
    address: "Indeed Tower, 200 W 6th St, Austin, TX 78701",
    size: "75,000 sq ft",
    cost: 210000,
    seats: 500,
    marketRateComparison: "—",
    startDate: "2020-07-01",
    endDate: "2030-06-30",
    operator: "Congress Tower Holdings LP",
    status: 'Active',
    paymentInfo: "Monthly Wire Transfer",
    daysUntilExpiration: 0,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: "Tel Tech Austin Office",
    property: "Indeed Tower",
    location: "Austin, TX",
    monthlyRent: 210000,
    squareFootage: 75000,
    renewalStatus: "Active Term",
    lastModified: '2026-11-18',
    documents: [
      { name: "Congress Tower Holdings LP Lease Agreement", type: 'PDF', size: '1.2 MB', uploadDate: "2020-07-01" }
    ],
    financials: {
      monthlyRent: 210000,
      securityDeposit: 630000,
      brokerFee: 0,
      totalFirstYear: 2520000
    },
    contacts: {
      landlord: { name: "Congress Tower Holdings LP Client Services", phone: '(800) 555-0140', email: 'clientservices@example.com' },
      broker: { name: 'LiquidSpace Account Team', phone: '(800) 555-0199', email: 'accounts@liquidspace.com' }
    }
  },
  {
    id: 3,
    licenseId: "TT-2021-003",
    customer: 'Tel Tech Corporation',
    notificationPeriod: "180 Days",
    city: "Sydney",
    type: "Traditional Lease",
    address: "Level 22, 1 Bligh Street, Sydney NSW 2000",
    size: "19,000 sq ft",
    cost: 125000,
    seats: 125,
    marketRateComparison: "—",
    startDate: "2021-06-01",
    endDate: "2028-05-31",
    operator: "Bligh Street Property Trust",
    status: 'Active',
    paymentInfo: "Monthly Wire Transfer",
    daysUntilExpiration: 0,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: "Tel Tech Sydney Office",
    property: "Level 22",
    location: "Sydney, NSW",
    monthlyRent: 125000,
    squareFootage: 19000,
    renewalStatus: "Active Term",
    lastModified: '2026-11-18',
    documents: [
      { name: "Bligh Street Property Trust Lease Agreement", type: 'PDF', size: '1.2 MB', uploadDate: "2021-06-01" }
    ],
    financials: {
      monthlyRent: 125000,
      securityDeposit: 375000,
      brokerFee: 0,
      totalFirstYear: 1500000
    },
    contacts: {
      landlord: { name: "Bligh Street Property Trust Client Services", phone: '(800) 555-0140', email: 'clientservices@example.com' },
      broker: { name: 'LiquidSpace Account Team', phone: '(800) 555-0199', email: 'accounts@liquidspace.com' }
    }
  },
  {
    id: 4,
    licenseId: "TT-2025-004",
    customer: 'Tel Tech Corporation',
    notificationPeriod: "60 Days",
    city: "London",
    type: "Dedicated (External License)",
    address: "1 Fore Street Avenue, London EC2Y 9DT",
    size: "—",
    cost: 39600,
    seats: 45,
    marketRateComparison: "—",
    startDate: "2025-12-01",
    endDate: "2027-11-30",
    operator: "IWG",
    status: 'Active',
    paymentInfo: "Monthly ACH Auto-Pay",
    daysUntilExpiration: 0,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: "Tel Tech London Dedicated",
    property: "1 Fore Street Avenue",
    location: "London, UK",
    monthlyRent: 39600,
    squareFootage: 0,
    renewalStatus: "Active Term",
    lastModified: '2026-11-18',
    documents: [
      { name: "IWG Licence Agreement", type: 'PDF', size: '1.2 MB', uploadDate: "2025-12-01" }
    ],
    financials: {
      monthlyRent: 39600,
      securityDeposit: 39600,
      brokerFee: 0,
      totalFirstYear: 475200
    },
    contacts: {
      landlord: { name: "IWG Client Services", phone: '(800) 555-0140', email: 'clientservices@example.com' },
      broker: { name: 'LiquidSpace Account Team', phone: '(800) 555-0199', email: 'accounts@liquidspace.com' }
    }
  },
  {
    id: 5,
    licenseId: "TT-2023-005",
    customer: 'Tel Tech Corporation',
    notificationPeriod: "60 Days",
    city: "Seattle",
    type: "Dedicated (External License)",
    address: "1201 3rd Ave, Seattle, WA 98101",
    size: "—",
    cost: 22000,
    seats: 40,
    marketRateComparison: "+54%",
    startDate: "2023-11-01",
    endDate: "2028-10-31",
    operator: "Industrious",
    status: 'Active',
    paymentInfo: "Monthly ACH Auto-Pay",
    daysUntilExpiration: 0,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: "Tel Tech Seattle Dedicated",
    property: "1201 3rd Ave",
    location: "Seattle, WA",
    monthlyRent: 22000,
    squareFootage: 0,
    renewalStatus: "Active Term",
    lastModified: '2026-11-18',
    documents: [
      { name: "Industrious Licence Agreement", type: 'PDF', size: '1.2 MB', uploadDate: "2023-11-01" }
    ],
    financials: {
      monthlyRent: 22000,
      securityDeposit: 22000,
      brokerFee: 0,
      totalFirstYear: 264000
    },
    contacts: {
      landlord: { name: "Industrious Client Services", phone: '(800) 555-0140', email: 'clientservices@example.com' },
      broker: { name: 'LiquidSpace Account Team', phone: '(800) 555-0199', email: 'accounts@liquidspace.com' }
    }
  },
  {
    id: 6,
    licenseId: "TT-2024-006",
    customer: 'Tel Tech Corporation',
    notificationPeriod: "60 Days",
    city: "Boston",
    type: "Dedicated (External License)",
    address: "One Lincoln St, Boston, MA 02111",
    size: "—",
    cost: 19900,
    seats: 48,
    marketRateComparison: "-2%",
    startDate: "2024-12-01",
    endDate: "2027-11-30",
    operator: "Industrious",
    status: 'Active',
    paymentInfo: "Monthly ACH Auto-Pay",
    daysUntilExpiration: 0,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: "Tel Tech Boston Dedicated",
    property: "One Lincoln St",
    location: "Boston, MA",
    monthlyRent: 19900,
    squareFootage: 0,
    renewalStatus: "Active Term",
    lastModified: '2026-11-18',
    documents: [
      { name: "Industrious Licence Agreement", type: 'PDF', size: '1.2 MB', uploadDate: "2024-12-01" }
    ],
    financials: {
      monthlyRent: 19900,
      securityDeposit: 19900,
      brokerFee: 0,
      totalFirstYear: 238800
    },
    contacts: {
      landlord: { name: "Industrious Client Services", phone: '(800) 555-0140', email: 'clientservices@example.com' },
      broker: { name: 'LiquidSpace Account Team', phone: '(800) 555-0199', email: 'accounts@liquidspace.com' }
    }
  },
  {
    id: 7,
    licenseId: "TT-2024-007",
    customer: 'Tel Tech Corporation',
    notificationPeriod: "60 Days",
    city: "Chicago",
    type: "Dedicated (External License)",
    address: "20 W Kinzie St, Chicago, IL 60654",
    size: "—",
    cost: 17500,
    seats: 35,
    marketRateComparison: "+13%",
    startDate: "2024-02-01",
    endDate: "2028-01-31",
    operator: "WeWork",
    status: 'Active',
    paymentInfo: "Monthly ACH Auto-Pay",
    daysUntilExpiration: 0,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: "Tel Tech Chicago Dedicated",
    property: "20 W Kinzie St",
    location: "Chicago, IL",
    monthlyRent: 17500,
    squareFootage: 0,
    renewalStatus: "Active Term",
    lastModified: '2026-11-18',
    documents: [
      { name: "WeWork Licence Agreement", type: 'PDF', size: '1.2 MB', uploadDate: "2024-02-01" }
    ],
    financials: {
      monthlyRent: 17500,
      securityDeposit: 17500,
      brokerFee: 0,
      totalFirstYear: 210000
    },
    contacts: {
      landlord: { name: "WeWork Client Services", phone: '(800) 555-0140', email: 'clientservices@example.com' },
      broker: { name: 'LiquidSpace Account Team', phone: '(800) 555-0199', email: 'accounts@liquidspace.com' }
    }
  },
  {
    id: 8,
    licenseId: "TT-2024-008",
    customer: 'Tel Tech Corporation',
    notificationPeriod: "30 Days",
    city: "Los Angeles",
    type: "Dedicated (External License)",
    address: "10250 Constellation Blvd, Los Angeles, CA 90067",
    size: "—",
    cost: 16800,
    seats: 42,
    marketRateComparison: "+3%",
    startDate: "2024-03-01",
    endDate: "autorenew",
    operator: "WeWork",
    status: 'Active',
    paymentInfo: "Monthly ACH Auto-Pay",
    daysUntilExpiration: 0,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: "Tel Tech Los Angeles Dedicated",
    property: "10250 Constellation Blvd",
    location: "Los Angeles, CA",
    monthlyRent: 16800,
    squareFootage: 0,
    renewalStatus: "Month-to-Month",
    lastModified: '2026-11-18',
    documents: [
      { name: "WeWork Licence Agreement", type: 'PDF', size: '1.2 MB', uploadDate: "2024-03-01" }
    ],
    financials: {
      monthlyRent: 16800,
      securityDeposit: 16800,
      brokerFee: 0,
      totalFirstYear: 201600
    },
    contacts: {
      landlord: { name: "WeWork Client Services", phone: '(800) 555-0140', email: 'clientservices@example.com' },
      broker: { name: 'LiquidSpace Account Team', phone: '(800) 555-0199', email: 'accounts@liquidspace.com' }
    }
  },
  {
    id: 9,
    licenseId: "TT-2025-009",
    customer: 'Tel Tech Corporation',
    notificationPeriod: "30 Days",
    city: "Washington",
    type: "Dedicated (External License)",
    address: "1440 G St NW, Washington, DC 20005",
    size: "—",
    cost: 13300,
    seats: 35,
    marketRateComparison: "0%",
    startDate: "2025-02-01",
    endDate: "autorenew",
    operator: "WeWork",
    status: 'Active',
    paymentInfo: "Monthly ACH Auto-Pay",
    daysUntilExpiration: 0,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: "Tel Tech Washington Dedicated",
    property: "1440 G St NW",
    location: "Washington, DC",
    monthlyRent: 13300,
    squareFootage: 0,
    renewalStatus: "Month-to-Month",
    lastModified: '2026-11-18',
    documents: [
      { name: "WeWork Licence Agreement", type: 'PDF', size: '1.2 MB', uploadDate: "2025-02-01" }
    ],
    financials: {
      monthlyRent: 13300,
      securityDeposit: 13300,
      brokerFee: 0,
      totalFirstYear: 159600
    },
    contacts: {
      landlord: { name: "WeWork Client Services", phone: '(800) 555-0140', email: 'clientservices@example.com' },
      broker: { name: 'LiquidSpace Account Team', phone: '(800) 555-0199', email: 'accounts@liquidspace.com' }
    }
  },
  {
    id: 10,
    licenseId: "TT-2025-010",
    customer: 'Tel Tech Corporation',
    notificationPeriod: "60 Days",
    city: "Toronto",
    type: "Dedicated (External License)",
    address: "100 King St W, Toronto, ON M5X 1A9",
    size: "—",
    cost: 11000,
    seats: 25,
    marketRateComparison: "-4%",
    startDate: "2025-03-01",
    endDate: "2028-02-29",
    operator: "Spaces",
    status: 'Active',
    paymentInfo: "Monthly ACH Auto-Pay",
    daysUntilExpiration: 0,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: "Tel Tech Toronto Dedicated",
    property: "100 King St W",
    location: "Toronto, ON",
    monthlyRent: 11000,
    squareFootage: 0,
    renewalStatus: "Active Term",
    lastModified: '2026-11-18',
    documents: [
      { name: "Spaces Licence Agreement", type: 'PDF', size: '1.2 MB', uploadDate: "2025-03-01" }
    ],
    financials: {
      monthlyRent: 11000,
      securityDeposit: 11000,
      brokerFee: 0,
      totalFirstYear: 132000
    },
    contacts: {
      landlord: { name: "Spaces Client Services", phone: '(800) 555-0140', email: 'clientservices@example.com' },
      broker: { name: 'LiquidSpace Account Team', phone: '(800) 555-0199', email: 'accounts@liquidspace.com' }
    }
  },
  {
    id: 11,
    licenseId: "TT-2024-011",
    customer: 'Tel Tech Corporation',
    notificationPeriod: "60 Days",
    city: "Atlanta",
    type: "Dedicated (External License)",
    address: "1180 Peachtree St NE, Atlanta, GA 30309",
    size: "—",
    cost: 7800,
    seats: 30,
    marketRateComparison: "+3%",
    startDate: "2024-06-01",
    endDate: "2027-05-31",
    operator: "Industrious",
    status: 'Active',
    paymentInfo: "Monthly ACH Auto-Pay",
    daysUntilExpiration: 0,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: "Tel Tech Atlanta Dedicated",
    property: "1180 Peachtree St NE",
    location: "Atlanta, GA",
    monthlyRent: 7800,
    squareFootage: 0,
    renewalStatus: "Active Term",
    lastModified: '2026-11-18',
    documents: [
      { name: "Industrious Licence Agreement", type: 'PDF', size: '1.2 MB', uploadDate: "2024-06-01" }
    ],
    financials: {
      monthlyRent: 7800,
      securityDeposit: 7800,
      brokerFee: 0,
      totalFirstYear: 93600
    },
    contacts: {
      landlord: { name: "Industrious Client Services", phone: '(800) 555-0140', email: 'clientservices@example.com' },
      broker: { name: 'LiquidSpace Account Team', phone: '(800) 555-0199', email: 'accounts@liquidspace.com' }
    }
  },
  {
    id: 12,
    licenseId: "TT-2025-012",
    customer: 'Tel Tech Corporation',
    notificationPeriod: "60 Days",
    city: "Miami",
    type: "Dedicated (LiquidSpace)",
    address: "1450 Brickell Ave, Miami, FL 33131",
    size: "—",
    cost: 9000,
    seats: 20,
    marketRateComparison: "-1%",
    startDate: "2025-10-01",
    endDate: "2027-09-30",
    operator: "Novel Coworking",
    status: 'Active',
    paymentInfo: "Monthly ACH Auto-Pay",
    daysUntilExpiration: 0,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: "Tel Tech Miami Dedicated",
    property: "1450 Brickell Ave",
    location: "Miami, FL",
    monthlyRent: 9000,
    squareFootage: 0,
    renewalStatus: "Active Term",
    lastModified: '2026-11-18',
    documents: [
      { name: "Novel Coworking Licence Agreement", type: 'PDF', size: '1.2 MB', uploadDate: "2025-10-01" }
    ],
    financials: {
      monthlyRent: 9000,
      securityDeposit: 9000,
      brokerFee: 0,
      totalFirstYear: 108000
    },
    contacts: {
      landlord: { name: "Novel Coworking Client Services", phone: '(800) 555-0140', email: 'clientservices@example.com' },
      broker: { name: 'LiquidSpace Account Team', phone: '(800) 555-0199', email: 'accounts@liquidspace.com' }
    }
  },
  {
    id: 13,
    licenseId: "TT-2026-013",
    customer: 'Tel Tech Corporation',
    notificationPeriod: "90 Days",
    city: "San Francisco",
    type: "Managed Space",
    address: "101 California St, Floor 12, San Francisco, CA 94111",
    size: "—",
    cost: 64000,
    seats: 80,
    marketRateComparison: "—",
    startDate: "2026-11-01",
    endDate: "2029-10-31",
    operator: "LiquidSpace",
    status: 'Active',
    paymentInfo: "Monthly Wire Transfer",
    daysUntilExpiration: 0,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: "Tel Tech San Francisco Managed Space",
    property: "101 California St",
    location: "San Francisco, CA",
    monthlyRent: 64000,
    squareFootage: 0,
    renewalStatus: "Active Term",
    lastModified: '2026-11-18',
    services: "80-seat branded office managed by LiquidSpace. The all-in cost includes the space, facilities management, utilities, cleaning, IT and network, reception and workplace operations.",
    documents: [
      { name: "LiquidSpace Managed Workplace Agreement", type: 'PDF', size: '1.2 MB', uploadDate: "2026-11-01" }
    ],
    financials: {
      monthlyRent: 64000,
      securityDeposit: 64000,
      brokerFee: 0,
      totalFirstYear: 768000
    },
    contacts: {
      landlord: { name: "LiquidSpace Client Services", phone: '(800) 555-0140', email: 'clientservices@example.com' },
      broker: { name: 'LiquidSpace Account Team', phone: '(800) 555-0199', email: 'accounts@liquidspace.com' }
    }
  },
  {
    id: 14,
    licenseId: "TT-2026-014",
    customer: 'Tel Tech Corporation',
    notificationPeriod: "90 Days",
    city: "Dallas",
    type: "Managed Space",
    address: "2200 Ross Ave, Suite 3800, Dallas, TX 75201",
    size: "—",
    cost: 27000,
    seats: 45,
    marketRateComparison: "—",
    startDate: "2026-07-01",
    endDate: "2029-06-30",
    operator: "LiquidSpace",
    status: 'Active',
    paymentInfo: "Monthly Wire Transfer",
    daysUntilExpiration: 0,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: "Tel Tech Dallas Managed Space",
    property: "2200 Ross Ave",
    location: "Dallas, TX",
    monthlyRent: 27000,
    squareFootage: 0,
    renewalStatus: "Active Term",
    lastModified: '2026-11-18',
    services: "45-seat private office with three meeting rooms, managed by LiquidSpace. The all-in cost includes the space, facilities management, utilities, IT, cleaning and workplace services.",
    documents: [
      { name: "LiquidSpace Managed Workplace Agreement", type: 'PDF', size: '1.2 MB', uploadDate: "2026-07-01" }
    ],
    financials: {
      monthlyRent: 27000,
      securityDeposit: 27000,
      brokerFee: 0,
      totalFirstYear: 324000
    },
    contacts: {
      landlord: { name: "LiquidSpace Client Services", phone: '(800) 555-0140', email: 'clientservices@example.com' },
      broker: { name: 'LiquidSpace Account Team', phone: '(800) 555-0199', email: 'accounts@liquidspace.com' }
    }
  },
  {
    id: 15,
    licenseId: "TT-2025-015",
    customer: 'Tel Tech Corporation',
    notificationPeriod: "30 Days",
    city: "New York",
    type: "Virtual Office",
    address: "17 State St, 40th Floor, New York, NY 10004",
    size: "—",
    cost: 800,
    seats: 0,
    marketRateComparison: "—",
    startDate: "2025-12-01",
    endDate: "2027-11-30",
    operator: "Servcorp",
    status: 'Active',
    paymentInfo: "Monthly Card Payment",
    daysUntilExpiration: 0,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: "Tel Tech New York Virtual Office",
    property: "17 State St",
    location: "New York, NY",
    monthlyRent: 800,
    squareFootage: 0,
    renewalStatus: "Active Term",
    lastModified: '2026-11-18',
    services: "Premium package — staffed reception, a dedicated local phone number with call handling, 16 meeting-room hours per month, and up to 5 days of workspace access per month.",
    documents: [
      { name: "Servcorp Virtual Office Service Agreement", type: 'PDF', size: '1.2 MB', uploadDate: "2025-12-01" }
    ],
    financials: {
      monthlyRent: 800,
      securityDeposit: 0,
      brokerFee: 0,
      totalFirstYear: 9600
    },
    contacts: {
      landlord: { name: "Servcorp Client Services", phone: '(800) 555-0140', email: 'clientservices@example.com' },
      broker: { name: 'LiquidSpace Account Team', phone: '(800) 555-0199', email: 'accounts@liquidspace.com' }
    }
  },
  {
    id: 16,
    licenseId: "TT-2026-016",
    customer: 'Tel Tech Corporation',
    notificationPeriod: "30 Days",
    city: "Boston",
    type: "Virtual Office",
    address: "One Lincoln St, Boston, MA 02111",
    size: "—",
    cost: 200,
    seats: 0,
    marketRateComparison: "—",
    startDate: "2026-01-01",
    endDate: "2027-12-31",
    operator: "Industrious",
    status: 'Active',
    paymentInfo: "Monthly Card Payment",
    daysUntilExpiration: 0,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: "Tel Tech Boston Virtual Office",
    property: "One Lincoln St",
    location: "Boston, MA",
    monthlyRent: 200,
    squareFootage: 0,
    renewalStatus: "Active Term",
    lastModified: '2026-11-18',
    services: "Business address, mail forwarding, live call answering, and 8 meeting-room hours per month.",
    documents: [
      { name: "Industrious Virtual Office Service Agreement", type: 'PDF', size: '1.2 MB', uploadDate: "2026-01-01" }
    ],
    financials: {
      monthlyRent: 200,
      securityDeposit: 0,
      brokerFee: 0,
      totalFirstYear: 2400
    },
    contacts: {
      landlord: { name: "Industrious Client Services", phone: '(800) 555-0140', email: 'clientservices@example.com' },
      broker: { name: 'LiquidSpace Account Team', phone: '(800) 555-0199', email: 'accounts@liquidspace.com' }
    }
  },
  {
    id: 17,
    licenseId: "TT-2025-017",
    customer: 'Tel Tech Corporation',
    notificationPeriod: "30 Days",
    city: "Austin",
    type: "Virtual Office",
    address: "100 Congress Ave, Suite 2000, Austin, TX 78701",
    size: "—",
    cost: 30,
    seats: 0,
    marketRateComparison: "—",
    startDate: "2025-08-01",
    endDate: "autorenew",
    operator: "Davinci Virtual",
    status: 'Active',
    paymentInfo: "Monthly Card Payment",
    daysUntilExpiration: 0,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    name: "Tel Tech Austin Virtual Office",
    property: "100 Congress Ave",
    location: "Austin, TX",
    monthlyRent: 30,
    squareFootage: 0,
    renewalStatus: "Month-to-Month",
    lastModified: '2026-11-18',
    services: "Basic business address and mail handling — mail received, scanned and held for collection.",
    documents: [
      { name: "Davinci Virtual Virtual Office Service Agreement", type: 'PDF', size: '1.2 MB', uploadDate: "2025-08-01" }
    ],
    financials: {
      monthlyRent: 30,
      securityDeposit: 0,
      brokerFee: 0,
      totalFirstYear: 360
    },
    contacts: {
      landlord: { name: "Davinci Virtual Client Services", phone: '(800) 555-0140', email: 'clientservices@example.com' },
      broker: { name: 'LiquidSpace Account Team', phone: '(800) 555-0199', email: 'accounts@liquidspace.com' }
    }
  },
];
mockLicenses.forEach((l: any) => { l.daysUntilExpiration = isISODate(l.endDate) ? daysFromNow(l.endDate) : null; });
