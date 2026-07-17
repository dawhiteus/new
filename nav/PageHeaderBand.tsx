import React from 'react';
import { Icon } from './icons';

// ── Tier 1: Blue Page Header band ─────────────────────────────────────
// For operational / management pages (forms, tables, workflows).
// Mirrors the production PageHeader: 135° gradient, 28px/700 title,
// 14px subtitle at 75% white, optional action/filter slot on the right.

export interface PageBandMeta {
  icon: string;
  label: string;
  subtitle: string;
}

export function PageHeaderBand({ meta, action }: { meta: PageBandMeta; action?: React.ReactNode }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #004A7C 0%, #005B94 60%, #0071B8 100%)',
      padding: '28px 32px 32px',
      color: '#fff',
      flexShrink: 0,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <Icon name={meta.icon} size={24} color="#fff" />
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.15 }}>
              {meta.label}
            </span>
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
            {meta.subtitle}
          </div>
        </div>
        {action && <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{action}</div>}
      </div>
    </div>
  );
}

// Demo page-level action button (e.g. "+ New Requirement")
export function BandAction({ label }: { label: string }) {
  return (
    <button style={{
      padding: '10px 18px',
      borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.25)',
      background: 'rgba(255,255,255,0.15)',
      color: '#fff',
      fontSize: 14,
      fontWeight: 500,
      fontFamily: 'inherit',
      cursor: 'pointer',
    }}>
      {label}
    </button>
  );
}

// ── Tier 2: Slim context toolbar ──────────────────────────────────────
// For analytical workbench pages (Portfolio Compiler, Scenario Modeler,
// Hub Locator). Fixed-height white toolbar: page identity (left),
// context switcher (center), data-as-of timestamp (right).

export function ContextToolbar({ pageLabel, contextName, dataAsOf }: {
  pageLabel: string;
  contextName: string;
  dataAsOf: string;
}) {
  return (
    <div style={{
      height: 48,
      flexShrink: 0,
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      position: 'relative',
    }}>
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#6b7280',
      }}>
        {pageLabel}
      </span>

      {/* Context switcher — centered */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <button style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '5px 14px',
          borderRadius: 9999,
          border: '1px solid #d1d5db',
          background: '#fff',
          fontSize: 13,
          color: '#374151',
          fontFamily: 'inherit',
          cursor: 'pointer',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: 9999, background: '#005b94', flexShrink: 0 }} />
          {contextName}
          <Icon name="chevron-down" size={11} color="#6b7280" />
        </button>
      </div>

      <span style={{ marginLeft: 'auto', fontSize: 12, color: '#6b7280' }}>
        {dataAsOf}
      </span>
    </div>
  );
}
