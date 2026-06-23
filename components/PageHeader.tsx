import React from 'react';

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onAIAssistantOpen?: () => void;
  isAIDrawerOpen?: boolean;
  hideAIButton?: boolean;
  children?: React.ReactNode;
}

export function PageHeader({
  icon,
  title,
  subtitle,
  children,
}: PageHeaderProps) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #004A7C 0%, #005B94 60%, #0071B8 100%)',
        padding: '28px 32px 32px',
        color: '#FFFFFF',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {icon}
              <h1 style={{
                fontSize: '28px',
                fontWeight: 700,
                letterSpacing: '-0.3px',
                fontFamily: 'Inter, sans-serif',
                color: '#FFFFFF',
              }}>
                {title}
              </h1>
            </div>
            <p style={{
              fontSize: '14px',
              fontWeight: 400,
              fontFamily: 'Inter, sans-serif',
              color: 'rgba(255, 255, 255, 0.75)',
            }}>
              {subtitle}
            </p>
          </div>
          {children && (
            <div className="flex items-center gap-3">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}