import React, { useState } from 'react';
import { PROFILES, type Profile } from './nav-data';

export type Variant = 'A' | 'B' | 'C';

const T = {
  ls500:     '#005b94',
  ls50:      '#e6f1f8',
  ls900:     '#002238',
  text:      '#374151',
  textMuted: '#6b7280',
  border:    '#e5e7eb',
  page:      '#f8f9fa',
} as const;

const VARIANT_LABELS: Record<Variant, string> = {
  A: 'Unified Sidebar',
  B: 'Product Switcher',
  C: 'Rail + Sidebar',
};

const PROFILE_HINTS: Record<string, string> = {
  internal:          'Both products, all pages, plus Internal Tools group.',
  enterprise_admin:  'Full access to both products — typical customer admin.',
  enterprise_member: 'Operations only (4 pages). Strategy is locked.',
};

interface ProfilePanelProps {
  profile: Profile;
  showCoBrand: boolean;
  variant: Variant;
  onProfileChange: (key: string) => void;
  onCoBrandChange: (val: boolean) => void;
  onVariantChange: (v: Variant) => void;
}

export function ProfilePanel({
  profile,
  showCoBrand,
  variant,
  onProfileChange,
  onCoBrandChange,
  onVariantChange,
}: ProfilePanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 50,
      fontFamily: 'Inter, sans-serif',
    }}>
      {collapsed ? (
        <button
          onClick={() => setCollapsed(false)}
          title="Open Tweaks panel"
          style={{
            width: 36,
            height: 36,
            borderRadius: 9999,
            background: T.ls900,
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,.25)',
          }}
        >
          ⚙
        </button>
      ) : (
        <div style={{
          width: 256,
          background: '#fffef9',
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,.12)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: T.ls900,
            color: '#fff',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                fontSize: 8, fontWeight: 700, letterSpacing: '0.08em',
                background: 'rgba(255,255,255,.18)', padding: '2px 6px', borderRadius: 4,
              }}>TWEAKS</span>
              <span style={{ fontSize: 11, opacity: 0.78 }}>Nav system</span>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              style={{
                background: 'transparent', border: 'none',
                color: 'rgba(255,255,255,.7)', cursor: 'pointer',
                fontSize: 14, padding: '0 2px', lineHeight: 1,
              }}
            >×</button>
          </div>

          {/* Body */}
          <div style={{ padding: '12px 12px 14px' }}>

            {/* ── Variant selector ── */}
            <SectionLabel>Nav pattern</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, marginBottom: 12 }}>
              {(['A', 'B', 'C'] as Variant[]).map(v => (
                <VariantButton
                  key={v}
                  label={v}
                  sublabel={VARIANT_LABELS[v]}
                  selected={variant === v}
                  recommended={false}
                  onSelect={() => onVariantChange(v)}
                />
              ))}
            </div>

            {/* ── Profile selector ── */}
            <SectionLabel>Permission profile</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
              {Object.values(PROFILES).map(p => (
                <ProfileOption
                  key={p.key}
                  profile={p}
                  selected={profile.key === p.key}
                  onSelect={() => onProfileChange(p.key)}
                />
              ))}
            </div>
            <div style={{
              fontSize: 11, color: T.textMuted, lineHeight: 1.4, marginBottom: 12,
              padding: '6px 8px', background: T.page, borderRadius: 8,
            }}>
              {PROFILE_HINTS[profile.key]}
            </div>

            {/* ── Chrome toggle ── */}
            <SectionLabel>Chrome</SectionLabel>
            <ToggleRow
              label="Customer co-brand"
              checked={showCoBrand}
              onChange={onCoBrandChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.08em', color: T.textMuted, marginBottom: 6,
    }}>
      {children}
    </div>
  );
}

function VariantButton({
  label,
  sublabel,
  selected,
  recommended,
  onSelect,
}: {
  label: string;
  sublabel: string;
  selected: boolean;
  recommended: boolean;
  onSelect: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        padding: '8px 4px 6px',
        borderRadius: 8,
        border: `1.5px solid ${selected ? T.ls500 : T.border}`,
        background: selected ? T.ls50 : hover ? T.page : '#fff',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'all 100ms ease',
        position: 'relative',
      }}
    >
      <span style={{
        fontSize: 16,
        fontWeight: 700,
        color: selected ? T.ls500 : T.text,
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 9,
        color: selected ? T.ls500 : T.textMuted,
        textAlign: 'center',
        lineHeight: 1.2,
      }}>
        {sublabel}
      </span>
      {recommended && (
        <span style={{
          position: 'absolute',
          top: -6,
          right: -4,
          fontSize: 7,
          fontWeight: 700,
          letterSpacing: '0.04em',
          background: '#28a745',
          color: '#fff',
          padding: '1px 4px',
          borderRadius: 4,
        }}>
          REC
        </span>
      )}
    </button>
  );
}

function ProfileOption({
  profile,
  selected,
  onSelect,
}: {
  profile: Profile;
  selected: boolean;
  onSelect: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 8px', borderRadius: 8,
        border: `1px solid ${selected ? T.ls500 : T.border}`,
        background: selected ? T.ls50 : hover ? T.page : '#fff',
        cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        transition: 'all 100ms ease',
      }}
    >
      <span style={{
        width: 24, height: 24, borderRadius: '50%',
        background: selected ? T.ls500 : T.border,
        color: selected ? '#fff' : T.textMuted,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 700, flexShrink: 0,
      }}>
        {profile.initials}
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.text, lineHeight: 1.2 }}>
          {profile.shortLabel}
        </div>
        <div style={{ fontSize: 10, color: T.textMuted, lineHeight: 1.2 }}>
          {profile.role}
        </div>
      </div>
    </button>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 8, cursor: 'pointer', padding: '4px 0',
    }}>
      <span style={{ fontSize: 12, color: T.text }}>{label}</span>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 36, height: 20, borderRadius: 9999,
          background: checked ? T.ls500 : T.border,
          position: 'relative', transition: 'background 150ms ease',
          flexShrink: 0, cursor: 'pointer',
        }}
      >
        <div style={{
          position: 'absolute', top: 2, left: checked ? 18 : 2,
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,.2)', transition: 'left 150ms ease',
        }} />
      </div>
    </label>
  );
}
