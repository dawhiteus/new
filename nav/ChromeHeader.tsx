import React, { useState } from 'react';
import { Icon } from './icons';
import type { Profile } from './nav-data';

// Design-system token palette (mirrors colors_and_type.css)
const T = {
  ls500: '#005b94',
  ls600: '#004d7d',
  ls50:  '#e6f1f8',
  text:  '#374151',
  textMuted: '#6b7280',
  border: '#e5e7eb',
  page:   '#f8f9fa',
  danger: '#dc3545',
} as const;

// ── LiquidSpace glyph ─────────────────────────────────────────────────
// color: brand blue when LiquidSpace is the primary brand (no co-brand),
// muted gray when rendered as the de-emphasized "Powered by" mark.

function LiquidSpaceMark({ muted = false, size = 28 }: { muted?: boolean; size?: number }) {
  const fill = muted ? '#9ca3af' : T.ls500;
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-label="LiquidSpace">
      <rect x="1" y="1" width="26" height="26" rx="8" fill={fill} />
      <path
        d="M7 16 Q10.5 11 14 14.5 T21 13"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Co-brand lockup ───────────────────────────────────────────────────
// Customer brand leads (their logo/wordmark, full color); LiquidSpace
// follows as a de-emphasized grayscale "POWERED BY" lockup. When there is
// no customer co-brand, LiquidSpace renders alone in primary brand blue.

function CoBrand({ showCustomer, orgName }: { showCustomer: boolean; orgName: string }) {
  if (!showCustomer) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <LiquidSpaceMark />
        <div style={{ fontSize: 18, fontWeight: 700, color: T.ls500, letterSpacing: '-0.01em', lineHeight: 1 }}>
          Liquid<span style={{ fontWeight: 400 }}>Space</span>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      {/* Customer wordmark — stands in for the customer's uploaded logo */}
      <div style={{ fontSize: 19, fontWeight: 600, color: T.ls500, letterSpacing: '-0.01em', lineHeight: 1 }}>
        {orgName}
      </div>
      <div style={{ width: 1, height: 28, background: T.border }} />
      {/* De-emphasized LiquidSpace lockup */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <LiquidSpaceMark muted />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{
            fontSize: 7,
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            fontWeight: 600,
            lineHeight: 1,
            marginBottom: 3,
          }}>
            Powered by
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#9ca3af', letterSpacing: '-0.01em', lineHeight: 1 }}>
            Liquid<span style={{ fontWeight: 400 }}>Space</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Icon button (search / bell / settings) ────────────────────────────

interface IconBtnProps {
  iconName: string;
  title: string;
  badge?: number;
}

function ChromeIconBtn({ iconName, title, badge }: IconBtnProps) {
  const [hover, setHover] = useState(false);
  return (
    <button
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        background: hover ? T.page : 'transparent',
        color: T.text,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 100ms ease',
        flexShrink: 0,
      }}
    >
      <Icon name={iconName} size={18} />
      {badge != null && badge > 0 && (
        <span style={{
          position: 'absolute',
          top: 4,
          right: 4,
          background: T.danger,
          color: '#fff',
          borderRadius: 9999,
          fontSize: 9,
          fontWeight: 700,
          minWidth: 14,
          height: 14,
          lineHeight: '14px',
          padding: '0 4px',
          textAlign: 'center',
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}

// ── User pill ─────────────────────────────────────────────────────────

function UserPill({ profile }: { profile: Profile }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      aria-label={`Account: ${profile.name}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 38,
        padding: '0 10px 0 4px',
        background: '#fff',
        border: `1.5px solid ${hover ? T.ls600 : T.ls500}`,
        borderRadius: 9999,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'border-color 100ms ease',
        flexShrink: 0,
      }}
    >
      <span style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: T.ls500,
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '-0.01em',
        flexShrink: 0,
      }}>
        {profile.initials}
      </span>
      <Icon name="menu" size={16} color={T.ls500} />
    </button>
  );
}

// ── Chrome header ─────────────────────────────────────────────────────

interface ChromeHeaderProps {
  profile: Profile;
  showCoBrand: boolean;
}

export function ChromeHeader({ profile, showCoBrand }: ChromeHeaderProps) {
  return (
    <div style={{
      height: 64,
      flexShrink: 0,
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#fff',
      borderBottom: `1px solid ${T.border}`,
      position: 'relative',
      zIndex: 20,
    }}>
      <CoBrand showCustomer={showCoBrand && profile.orgLogo !== null} orgName={profile.org} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <ChromeIconBtn iconName="search" title="Search (⌘K)" />
        <ChromeIconBtn iconName="bell" title="Notifications" badge={profile.notificationCount} />
        <ChromeIconBtn iconName="settings" title="Settings" />
        <div style={{ width: 8 }} />
        <UserPill profile={profile} />
      </div>
    </div>
  );
}
