import React from 'react';

interface PageShellProps {
  title: string;
  breadcrumb: string[];
  children?: React.ReactNode;
}

export function PageShell({ title, breadcrumb, children }: PageShellProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-page)', fontFamily: 'Inter, sans-serif' }}>
      {/* Page header */}
      <div style={{ background: 'linear-gradient(135deg, #004A7C 0%, #005b94 60%, #0071B8 100%)', padding: '28px 32px 32px' }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 mb-2">
          {breadcrumb.map((crumb, i) => (
            <React.Fragment key={crumb}>
              {i > 0 && (
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>/</span>
              )}
              <span
                style={{
                  fontSize: 12,
                  color: i === breadcrumb.length - 1 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)',
                  fontWeight: i === breadcrumb.length - 1 ? 500 : 400,
                }}
              >
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px', marginBottom: 0 }}>
          {title}
        </h1>
      </div>

      {/* Content area */}
      <div style={{ padding: '32px' }}>
        {children ?? (
          <div
            className="rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border)',
              minHeight: 320,
            }}
          >
            <p style={{ fontSize: 14, color: 'var(--text-disabled)' }}>
              {title} — coming soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
