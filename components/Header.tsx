import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Search, Bell, Settings, HelpCircle, User, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  description?: string;
  onMenuToggle: () => void;
}

export function Header({ title, description, onMenuToggle }: HeaderProps) {
  return (
    <div className="bg-primary text-primary-foreground px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Menu Toggle for Mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="lg:hidden h-9 w-9 p-0 text-primary-foreground hover:bg-white/10"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: 700, 
                lineHeight: 1.2, 
                fontFamily: 'Inter, sans-serif',
                color: '#FFFFFF',
                marginBottom: '4px'
              }}>
                {title}
              </h1>
              {description && (
                <p style={{ 
                  fontSize: '16px', 
                  fontWeight: 400, 
                  lineHeight: 1.5, 
                  fontFamily: 'Inter, sans-serif',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  {description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search..."
                className="w-80 pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-lg h-9 text-sm focus:ring-2 focus:ring-white/50 focus:border-white/50"
                style={{
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 w-9 p-0 text-white hover:bg-white/10 rounded-lg"
              >
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 w-9 p-0 text-white hover:bg-white/10 rounded-lg"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 w-9 p-0 text-white hover:bg-white/10 rounded-lg relative"
              >
                <Bell className="h-4 w-4" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </Button>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center gap-3 ml-2">
              <Avatar className="h-8 w-8 border border-white/20">
                <AvatarFallback className="text-xs bg-white/20 text-white">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1">
                <span 
                  className="text-white"
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  David Miller
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-white hover:bg-white/10 rounded"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}