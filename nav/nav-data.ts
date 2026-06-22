// Information architecture + permission profiles.
// Single source of truth — import this everywhere, never duplicate the IA.

export interface NavItemDef {
  id: string;
  icon: string;
  label: string;
  badge?: number | string;
  locked?: boolean;
}

export interface NavGroup {
  id: string;
  label: string;
  internalOnly?: boolean;
  items: NavItemDef[];
}

export interface Product {
  id: string;
  label: string;
  icon: string;
  color: string;
  tagline: string;
  description: string;
  defaultPage: string;
  groups: NavGroup[];
}

export type ProductAccess =
  | { unlocked: true; items: '*' | string[] }
  | { unlocked: false; reason: string };

export interface Profile {
  key: string;
  label: string;
  shortLabel: string;
  role: string;
  name: string;
  initials: string;
  org: string;
  orgLogo: 'att' | null;
  products: Record<string, ProductAccess>;
  showInternal: boolean;
  notificationCount: number;
}

export interface RecentItem {
  id: string;
  product: string;
  icon: string;
  label: string;
}

export interface PageMeta extends NavItemDef {
  productId: string;
  productLabel: string;
  groupId: string;
  groupLabel: string;
}

// ── Information architecture ──────────────────────────────────────────

export const IA: Record<string, Product> = {
  ops: {
    id: 'ops',
    label: 'Workplace Operations',
    icon: 'briefcase',
    color: '#005b94',
    tagline: 'Run the workspace portfolio',
    description: 'Workplace inventory, licenses, payments, and deal flow.',
    defaultPage: 'license-tracker',
    groups: [
      {
        id: 'wm',
        label: 'Workplace Manager',
        items: [
          { id: 'dashboard',       icon: 'home',         label: 'Dashboard' },
          { id: 'teams',           icon: 'users',        label: 'Teams' },
          { id: 'locations',       icon: 'map-pinned',   label: 'Locations' },
          { id: 'activity',        icon: 'activity',     label: 'Activity' },
          { id: 'setup',           icon: 'settings',     label: 'Setup' },
          { id: 'branding',        icon: 'palette',      label: 'Branding' },
        ],
      },
      {
        id: 'la',
        label: 'License Administrator',
        items: [
          { id: 'license-tracker', icon: 'file',         label: 'License Tracker' },
          { id: 'payments',        icon: 'credit-card',  label: 'Payments' },
          { id: 'funding',         icon: 'dollar-sign',  label: 'Funding Sources' },
          { id: 'tasks',           icon: 'check-square', label: 'Tasks' },
        ],
      },
      {
        id: 'tm',
        label: 'Transaction Manager',
        items: [
          { id: 'requirements',    icon: 'book-open',    label: 'Requirements' },
        ],
      },
    ],
  },
  strategy: {
    id: 'strategy',
    label: 'Workplace Strategist',
    icon: 'bar-chart',
    color: '#00b8c4',
    tagline: 'Plan the portfolio',
    description: 'Portfolio analytics, spend modeling, hub planning.',
    defaultPage: 'portfolio-compiler',
    groups: [
      {
        id: 'tools',
        label: 'Workplace Strategist',
        items: [
          { id: 'portfolio-compiler', icon: 'layers',    label: 'Portfolio Compiler' },
          { id: 'flex-modeler',       icon: 'sliders',   label: 'Flex Modeler' },
          { id: 'hub-locator',        icon: 'map',       label: 'Hub Locator' },
        ],
      },
    ],
  },
};

// Injected into Operations sidebar for LS admins only.
export const INTERNAL_OPS_GROUP: NavGroup = {
  id: 'internal-ops',
  label: 'Internal Tools',
  internalOnly: true,
  items: [
    { id: 'audit-log',     icon: 'shield',     label: 'Audit Log' },
    { id: 'agent-console', icon: 'bot',        label: 'Agent Console', badge: 'NEW' },
    { id: 'org-browser',   icon: 'building-2', label: 'Org Browser' },
  ],
};

// ── Permission profiles ───────────────────────────────────────────────

export const PROFILES: Record<string, Profile> = {
  internal: {
    key: 'internal',
    label: 'Internal LS Admin',
    shortLabel: 'Internal',
    role: 'Operations Admin · LiquidSpace',
    name: 'Daria Wallace',
    initials: 'DW',
    org: 'LiquidSpace HQ',
    orgLogo: null,
    products: {
      ops:      { unlocked: true, items: '*' },
      strategy: { unlocked: true, items: '*' },
    },
    showInternal: true,
    notificationCount: 7,
  },
  enterprise_admin: {
    key: 'enterprise_admin',
    label: 'Customer Admin (AT&T)',
    shortLabel: 'Cust. Admin',
    role: 'Workplace Admin · AT&T',
    name: 'David Whitehurst',
    initials: 'DW',
    org: 'AT&T',
    orgLogo: 'att',
    products: {
      ops:      { unlocked: true, items: '*' },
      strategy: { unlocked: true, items: '*' },
    },
    showInternal: false,
    notificationCount: 2,
  },
  enterprise_member: {
    key: 'enterprise_member',
    label: 'Customer Member',
    shortLabel: 'Member',
    role: 'Booker · AT&T',
    name: 'Patrick Henkel',
    initials: 'PH',
    org: 'AT&T',
    orgLogo: 'att',
    products: {
      ops:      { unlocked: true, items: ['dashboard', 'license-tracker', 'tasks', 'requirements'] },
      strategy: { unlocked: false, reason: 'Available to Workplace Admins' },
    },
    showInternal: false,
    notificationCount: 2,
  },
};

// ── Recently visited ──────────────────────────────────────────────────

export const RECENTS: RecentItem[] = [
  { id: 'license-tracker', product: 'ops',      icon: 'file',        label: 'License Tracker' },
  { id: 'hub-locator',     product: 'strategy', icon: 'map',         label: 'Hub Locator' },
  { id: 'payments',        product: 'ops',      icon: 'credit-card', label: 'Payments' },
];

// ── Helpers ───────────────────────────────────────────────────────────

export function visibleGroups(profile: Profile, productId: string): NavGroup[] {
  const product = IA[productId];
  if (!product) return [];
  const out: NavGroup[] = product.groups.map(g => ({
    ...g,
    items: g.items.map(it => ({
      ...it,
      locked: !pageAccessible(profile, productId, it.id),
    })),
  }));
  return out;
}

export function productAccessible(profile: Profile, productId: string): boolean {
  return !!(profile.products[productId]?.unlocked);
}

export function pageAccessible(profile: Profile, productId: string, pageId: string): boolean {
  const p = profile.products[productId];
  if (!p?.unlocked) return false;
  if (p.items === '*') return true;
  return (p.items as string[]).includes(pageId);
}

export function firstAccessiblePage(profile: Profile, productId: string): string | null {
  for (const g of visibleGroups(profile, productId)) {
    for (const it of g.items) {
      if (!it.locked) return it.id;
    }
  }
  return null;
}

export function firstAccessibleProduct(profile: Profile): string | null {
  for (const id of Object.keys(IA)) {
    if (productAccessible(profile, id)) return id;
  }
  return null;
}

export function findPage(pageId: string): PageMeta | null {
  for (const productId of Object.keys(IA)) {
    for (const g of IA[productId].groups) {
      const it = g.items.find(i => i.id === pageId);
      if (it) {
        return {
          ...it,
          productId,
          productLabel: IA[productId].label,
          groupId: g.id,
          groupLabel: g.label,
        };
      }
    }
  }
  for (const it of INTERNAL_OPS_GROUP.items) {
    if (it.id === pageId) {
      return {
        ...it,
        productId: 'ops',
        productLabel: IA.ops.label,
        groupId: 'internal-ops',
        groupLabel: INTERNAL_OPS_GROUP.label,
      };
    }
  }
  return null;
}
