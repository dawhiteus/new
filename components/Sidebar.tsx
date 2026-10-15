import React, { useState } from 'react';
import {
  Menu,
  LayoutGrid,
  FileText,
  CreditCard,
  TrendingUp as FundingIcon,
  CheckSquare,
  BarChart3,
  BarChart2,
  Users,
  MapPin,
  Activity,
  Settings,
  Palette,
  Briefcase,
  Target,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Table2,
  Calendar,
  Search,
  Star,
} from 'lucide-react';
import { cn } from './ui/utils';
import { useNavigate, useLocation } from 'react-router-dom';

type ViewType = 'broker-flow' | 'liquid-ai' | 'cfo-dashboard';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const licenseAdminItems = [
  {
    id: 'license-tracker',
    label: 'License Tracker',
    icon: FileText,
  },
  {
    id: 'payments-dashboard',
    label: 'Payments Dashboard',
    icon: CreditCard,
  },
  {
    id: 'funding-sources',
    label: 'Funding Sources',
    icon: FundingIcon,
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: CheckSquare,
  },
  {
    id: 'cfo-dashboard' as ViewType,
    label: 'Financial Intelligence',
    icon: BarChart2,
  },
];

const workplaceOpsItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: BarChart3,
  },
  {
    id: 'teams',
    label: 'Teams',
    icon: Users,
  },
  {
    id: 'locations',
    label: 'Locations',
    icon: MapPin,
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: Activity,
  },
  {
    id: 'liquid-ai' as ViewType,
    label: 'Liquid AI',
    icon: Sparkles,
  },
  {
    id: 'setup',
    label: 'Setup',
    icon: Settings,
  },
  {
    id: 'branding',
    label: 'Branding',
    icon: Palette,
  },
];

const workplaceStrategyItems = [
  {
    id: 'portfolio-manager',
    label: 'Portfolio Manager',
    icon: Briefcase,
  },
  {
    id: 'hub-locator',
    label: 'Hub Locator',
    icon: Target,
  },
];

const transactionManagerItems = [
  {
    id: 'broker-flow' as ViewType,
    label: 'Requirements',
    icon: Table2,
  },
];

const activitySubItems = [
  { id: 'reservations', label: 'Reservations', icon: Calendar, path: '/workplace/activity/reservations' },
  { id: 'searches',     label: 'Searches',     icon: Search,   path: '/workplace/activity/searches'     },
  { id: 'reviews',      label: 'Reviews',      icon: Star,     path: '/workplace/activity/reviews'      },
];

export function Sidebar({ currentView, onViewChange, isOpen, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isWorkplacePath = location.pathname.startsWith('/workplace');
  const isActivityPath = location.pathname.startsWith('/workplace/activity');

  const [workplaceOpsExpanded, setWorkplaceOpsExpanded] = useState(isWorkplacePath);
  const [workplaceStrategyExpanded, setWorkplaceStrategyExpanded] = useState(false);
  const [transactionManagerExpanded, setTransactionManagerExpanded] = useState(true);
  const [activityManualExpanded, setActivityManualExpanded] = useState(false);
  const activityExpanded = isActivityPath || activityManualExpanded;
  const isActivityActive = isActivityPath;

  if (!isOpen) {
    return (
      <div className="fixed left-0 top-0 h-full w-16 bg-white border-r border-border flex flex-col z-50">
        <div className="p-2 pt-6">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Menu className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        
        <nav className="flex-1 px-2 pt-4 space-y-1">
          {transactionManagerItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "w-full flex items-center justify-center p-3 rounded-lg transition-colors",
                  isActive
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
                style={isActive ? { backgroundColor: '#005B94' } : {}}
                title={item.label}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-border flex flex-col z-50">
      {/* Header */}
      <div className="p-4 pt-6 border-b" style={{ borderColor: '#E5E7EB' }}>
        <button
          onClick={onToggle}
          className="mb-4 p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Menu className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-6 px-4 overflow-y-auto">
        {/* License Administration */}
        <div className="mb-6">
          <div 
            style={{ 
              fontSize: '13px', 
              fontWeight: 700, 
              color: '#374151', 
              fontFamily: 'Inter, sans-serif',
              marginBottom: '12px',
              paddingLeft: '12px',
            }}
          >
            License Administration
          </div>
          <div className="space-y-1">
            {licenseAdminItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'license-tracker') {
                      window.open('https://crayon-duo-80396629.figma.site/', '_blank');
                    } else if (item.id === 'cfo-dashboard') {
                      onViewChange('cfo-dashboard');
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    currentView === item.id
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                  style={{
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: currentView === item.id ? '#005B94' : 'transparent',
                  }}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workplace Operations */}
        <div className="mb-6">
          <button
            onClick={() => setWorkplaceOpsExpanded(!workplaceOpsExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 mb-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div 
              style={{ 
                fontSize: '13px', 
                fontWeight: 700, 
                color: '#374151', 
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Workplace Operations
            </div>
            {workplaceOpsExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </button>
          {workplaceOpsExpanded && (
            <div className="space-y-1">
              {workplaceOpsItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                if (item.id === 'activity') {
                  return (
                    <div key="activity">
                      <button
                        onClick={() => setActivityManualExpanded(m => !m)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                          isActivityActive ? "text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        )}
                        style={{ fontSize:'14px', fontFamily:'Inter, sans-serif', backgroundColor: isActivityActive ? '#005B94' : 'transparent' }}
                      >
                        <Activity className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate flex-1 text-left">Activity</span>
                        {activityExpanded ? <ChevronDown className="h-3.5 w-3.5 opacity-60" /> : <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
                      </button>
                      {activityExpanded && (
                        <div className="ml-4 mt-1 space-y-0.5">
                          {activitySubItems.map(sub => {
                            const SubIcon = sub.icon;
                            const isSubActive = location.pathname === sub.path;
                            return (
                              <button
                                key={sub.id}
                                onClick={() => navigate(sub.path)}
                                className={cn(
                                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                                  isSubActive ? "text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                )}
                                style={{ fontSize:'13px', fontFamily:'Inter, sans-serif', backgroundColor: isSubActive ? '#005B94' : 'transparent' }}
                              >
                                <SubIcon className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{sub.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'dashboard') {
                        window.open('https://same-wasp-78624830.figma.site/', '_blank');
                      } else if (item.id === 'liquid-ai') {
                        onViewChange(item.id as ViewType);
                      } else if (item.id === 'teams') {
                        navigate('/workplace/teams');
                      } else if (item.id === 'locations') {
                        navigate('/workplace/locations');
                      } else if (item.id === 'setup') {
                        navigate('/workplace/setup');
                      } else if (item.id === 'branding') {
                        navigate('/workplace/branding');
                      }
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      isActive
                        ? "text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                    style={{
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif',
                      backgroundColor: isActive ? '#005B94' : 'transparent',
                    }}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Workplace Strategy */}
        <div className="mb-6">
          <button
            onClick={() => setWorkplaceStrategyExpanded(!workplaceStrategyExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 mb-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div 
              style={{ 
                fontSize: '13px', 
                fontWeight: 700, 
                color: '#374151', 
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Workplace Strategy
            </div>
            {workplaceStrategyExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </button>
          {workplaceStrategyExpanded && (
            <div className="space-y-1">
              {workplaceStrategyItems.map((item) => {
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    style={{
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Transaction Manager */}
        <div className="mb-6">
          <button
            onClick={() => setTransactionManagerExpanded(!transactionManagerExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 mb-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div 
              style={{ 
                fontSize: '13px', 
                fontWeight: 700, 
                color: '#374151', 
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Transaction Manager
            </div>
            {transactionManagerExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </button>
          {transactionManagerExpanded && (
            <div className="space-y-1">
              {transactionManagerItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      isActive
                        ? "text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                    style={{
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif',
                      backgroundColor: isActive ? '#005B94' : 'transparent',
                    }}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}