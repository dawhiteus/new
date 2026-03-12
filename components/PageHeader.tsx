import React from 'react';
import { Button } from './ui/button';
import { Bot } from 'lucide-react';

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onAIAssistantOpen: () => void;
  isAIDrawerOpen: boolean;
  children?: React.ReactNode;
}

export function PageHeader({ 
  icon, 
  title, 
  subtitle, 
  onAIAssistantOpen, 
  isAIDrawerOpen,
  children 
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
          
          <div className="flex items-center gap-3">
            {children}
            <Button
              variant="ghost"
              size="sm"
              onClick={onAIAssistantOpen}
              className={`relative h-9 px-3 transition-all duration-300 ${
                isAIDrawerOpen 
                  ? 'bg-[#003A5A]/10 text-[#003A5A] border-[#003A5A]/20' 
                  : 'hover:bg-white/80 border-white/20 text-white'
              }`}
              style={{
                background: isAIDrawerOpen 
                  ? 'rgba(0, 58, 90, 0.1)' 
                  : 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                boxShadow: isAIDrawerOpen 
                  ? '0 0 20px rgba(0, 58, 90, 0.3)' 
                  : '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Bot className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">LiquidAI</span>
              {!isAIDrawerOpen && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#0080FC] rounded-full ai-pulse"></div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}