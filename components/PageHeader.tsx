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
    <div className="px-6 py-8" style={{ backgroundColor: '#005B94', color: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {icon}
              <h1 style={{
                fontSize: '28px',
                fontWeight: 700,
                lineHeight: 1.2,
                fontFamily: 'Inter, sans-serif',
                color: '#FFFFFF'
              }}>
                {title}
              </h1>
            </div>
            <p style={{
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: 1.5,
              fontFamily: 'Inter, sans-serif',
              color: 'rgba(255, 255, 255, 0.9)'
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