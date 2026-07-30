// Shared License Tracker field option lists — single source of truth for the
// Add License and License Details (edit) modals. Keeping these in one place
// prevents the two forms from drifting apart, which is the exact failure
// mode identified in the License Tracker Schema Discovery doc: Contract
// Type, Renewal Mechanism, and Notification Period must each answer one
// question and stay independent of one another.

// Workspace Type — aligned with the taxonomy already used in the License
// Tracker overview stats and table filters (Flex / Dedicated-External /
// Dedicated-LiquidSpace).
export const WORKSPACE_TYPES = ['Flex (Hourly)', 'Dedicated (External)', 'Dedicated (LiquidSpace)'];

export const LICENSE_STATUS_OPTIONS = ['Active', 'Pending', 'Expired', 'Cancelled'];

// Contract Type — structure of the current term only. No duration or
// renewal concepts. Annual/Multi-Year are represented via Term Start/End,
// not as separate Contract Type values.
export const CONTRACT_TYPES = ['Fixed-Term', 'Month-to-Month'];

// Renewal Mechanism (renamed from "Renewal Option") — what happens when the
// current term ends. Notice timing must never appear in these labels.
export const RENEWAL_MECHANISMS = [
  'Auto-Renewal',
  'Renewal by Mutual Agreement',
  'No Automatic Renewal',
  'Not Specified',
];

// Notification Period — required contractual notice, reported independently
// of Contract Type and Renewal Mechanism. "Other" covers non-standard
// provisions (e.g. "two full calendar months," a fixed calendar date);
// record the precise language in the Current-State Abstract.
export const NOTIFICATION_PERIODS = [
  'None',
  '15 Days',
  '30 Days',
  '45 Days',
  '60 Days',
  '90 Days',
  '120 Days',
  '180 Days',
  'Other',
];

export const CURRENCIES = [
  'USD - US Dollar',
  'NZD - New Zealand Dollar',
  'GBP - British Pound',
  'EUR - Euro',
  'AUD - Australian Dollar',
  'CAD - Canadian Dollar',
];

export const COUNTRIES = [
  'UNITED STATES',
  'NEW ZEALAND',
  'UNITED KINGDOM',
  'AUSTRALIA',
  'CANADA',
  'GERMANY',
];

export const PAID_BY_OPTIONS = ['LiquidSpace', 'Customer'];

// Mirrors the named cost centers in FundingSources.tsx.
export const FUNDING_SOURCES = [
  'Dallas Expansion 1',
  'Seattle Operations',
  'Chicago Remote Hub',
  'London Office Setup',
  'Legacy NYC Account',
];
