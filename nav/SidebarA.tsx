// Variation A — Unified Sidebar
// Both products stacked in one sidebar as collapsible pillar sections.
// No product switcher — users see everything at once and collapse what they don't need.

import React, { useState, useMemo } from 'react';
import { Icon } from './icons';
import {
  IA,
  visibleGroups,
  pageAccessible,
  type Profile,
  type NavGroup,
  type NavItemDef,
  type Product,
} from './nav-data';

const T = {
  ls50:         '#e6f1f8',
  ls500:        '#005b94',
  teal:         '#00b8c4',
  text:         '#374151',
  textMuted:    '#6b7280',
  textDisabled: '#9ca3af',
  border:       '#e5e7eb',
  page:         '#f8f9fa',
  danger:       '#dc3545',
  purple:       '#7c3aed',
} as const;

// ── Pillar header (product-level collapsible row) ─────────────────────

function PillarHeader({
  product,
  expanded,
  onToggle,
}: {
  product: Product;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%',
        padding: '11px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: T.text,
        cursor: 'pointer',
        background: hover ? T.page : 'transparent',
        borderBottom: `1px solid ${T.border}`,
        border: 'none',
        borderBottom: `1px solid ${T.border}`,
        fontFamily: 'inherit',
        transition: 'background 100ms ease',
      }}
    >
      <div style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        background: product.color,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={product.icon} size={12} color="#fff" />
      </div>
      <span style={{ flex: 1, textAlign: 'left' }}>{product.label}</span>
      <Icon
        name="chevron-down"
        size={11}
        color={T.textMuted}
        style={{
          transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
          transition: 'transform 150ms ease',
          flexShrink: 0,
        }}
      />
    </button>
  );
}

// ── Nav item ──────────────────────────────────────────────────────────

function NavItemA({ item, active, onClick }: { item: NavItemDef; active: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const locked = !!item.locked;
  const bg = active ? T.ls500 : hover && !locked ? T.page : 'transparent';
  const color = active ? '#fff' : locked ? T.textDisabled : T.text;
  const iconColor = active ? '#fff' : locked ? T.textDisabled : T.textMuted;

  const handleClick = locked ? undefined : onClick;

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '6px 12px',
        borderRadius: 12,
        background: bg,
        color,
        fontSize: 13,
        fontWeight: active ? 500 : 400,
        cursor: locked ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        transition: 'background 100ms ease',
      }}
    >
      <Icon name={item.icon} size={15} color={iconColor} />
      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {item.label}
      </span>
      {locked && <Icon name="lock" size={11} color={T.textDisabled} />}
      {!locked && item.badge != null && (
        typeof item.badge === 'number' ? (
          <span style={{
            background: active ? 'rgba(255,255,255,.22)' : T.danger,
            color: '#fff',
            borderRadius: 9999,
            fontSize: 10,
            fontWeight: 600,
            padding: '1px 7px',
          }}>
            {item.badge}
          </span>
        ) : (
          <span style={{
            background: active ? 'rgba(255,255,255,.22)' : T.teal,
            color: '#fff',
            borderRadius: 9999,
            fontSize: 9,
            fontWeight: 700,
            padding: '2px 6px',
          }}>
            {item.badge}
          </span>
        )
      )}
    </div>
  );
}

// ── Group within a pillar ─────────────────────────────────────────────

function GroupSection({
  group,
  activeId,
  expanded,
  onToggle,
  onSelectPage,
  hideHeader,
}: {
  group: NavGroup;
  activeId: string;
  expanded: boolean;
  onToggle: () => void;
  onSelectPage: (id: string) => void;
  hideHeader?: boolean;
}) {
  return (
    <div style={{ marginBottom: 2 }}>
      {!hideHeader && <button
        onClick={onToggle}
        style={{
          width: '100%',
          appearance: 'none',
          background: 'transparent',
          border: 'none',
          padding: '10px 12px 6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: T.textMuted,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <span>{group.label}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {group.internalOnly && (
            <span style={{
              fontSize: 8, fontWeight: 700, letterSpacing: '0.06em',
              color: T.purple, background: T.purple + '18',
              padding: '1px 6px', borderRadius: 9999, textTransform: 'uppercase',
            }}>
              LS ONLY
            </span>
          )}
          <Icon
            name="chevron-right"
            size={11}
            color={T.textDisabled}
            style={{
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 150ms ease',
            }}
          />
        </span>
      </button>}
      {(hideHeader || expanded) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {group.items.map(it => (
            <NavItemA
              key={it.id}
              item={it}
              active={activeId === it.id}
              onClick={() => onSelectPage(it.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sidebar A ─────────────────────────────────────────────────────────

export interface SidebarAProps {
  profile: Profile;
  productId: string;
  activeId: string;
  onSelectPage: (pageId: string, productId: string) => void;
}

export function SidebarA({ profile, productId, activeId, onSelectPage }: SidebarAProps) {
  const [expandedPillars, setExpandedPillars] = useState<Record<string, boolean>>(
    () => Object.fromEntries(Object.keys(IA).map(id => [id, true]))
  );
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const togglePillar = (id: string) =>
    setExpandedPillars(prev => ({ ...prev, [id]: !prev[id] }));

  const toggleGroup = (gid: string) =>
    setExpandedGroups(prev => ({ ...prev, [gid]: prev[gid] === false ? true : !(prev[gid] ?? true) }));

  const groupExpanded = (gid: string) => expandedGroups[gid] !== false;

  return (
    <aside style={{
      width: 244,
      flexShrink: 0,
      background: '#fff',
      borderRight: `1px solid ${T.border}`,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      fontSize: 14,
      lineHeight: 1.5,
    }}>
      {Object.values(IA).map(product => {
        const accessible = !!(profile.products[product.id]?.unlocked);
        const groups = accessible ? visibleGroups(profile, product.id) : [];
        const isOpen = expandedPillars[product.id] ?? false;

        return (
          <div key={product.id}>
            <PillarHeader
              product={product}
              expanded={isOpen}
              onToggle={() => togglePillar(product.id)}
            />
            {isOpen && (
              <div style={{ padding: '4px 8px 8px' }}>
                {!accessible ? (
                  <div style={{
                    padding: '8px 12px',
                    fontSize: 12,
                    color: T.textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <Icon name="lock" size={12} color={T.textDisabled} />
                    {(profile.products[product.id] as { unlocked: false; reason: string })?.reason ?? 'Locked'}
                  </div>
                ) : (
                  groups.map(g => (
                    <GroupSection
                      key={g.id}
                      group={g}
                      activeId={activeId}
                      expanded={groupExpanded(g.id)}
                      onToggle={() => toggleGroup(g.id)}
                      onSelectPage={(id) => onSelectPage(id, product.id)}
                      hideHeader={groups.length === 1}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}
