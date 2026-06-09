import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  FileText,
  CreditCard,
  Banknote,
  CheckSquare,
  LayoutDashboard,
  Sparkles,
  Users,
  MapPin,
  Activity,
  Settings,
  Palette,
  Zap,
  GitBranch,
  Table2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';
import { NavItem } from './NavItem';
import { NavSection } from './NavSection';
import { AIDrawerProvider, useAIDrawer } from '../context/AIDrawerContext';
import { AIDrawer } from '../components/ai-drawer';
import { Toaster } from '../components/ui/toast';

const NAV = [
  {
    label: 'License Administrator',
    defaultOpen: true,
    items: [
      { to: '/license/tracker',  icon: <FileText  strokeWidth={2} />, label: 'License Tracker'     },
      { to: '/license/payments', icon: <CreditCard strokeWidth={2} />, label: 'Payments Dashboard'  },
      { to: '/license/funding',  icon: <Banknote  strokeWidth={2} />, label: 'Funding Sources'     },
      { to: '/license/tasks',    icon: <CheckSquare strokeWidth={2} />, label: 'Tasks'              },
    ],
  },
  {
    label: 'Workplace Operations',
    defaultOpen: false,
    items: [
      { to: '/workplace/dashboard',  icon: <LayoutDashboard strokeWidth={2} />, label: 'Dashboard'  },
      { to: '/workplace/liquid-ai',  icon: <Sparkles       strokeWidth={2} />, label: 'LiquidAI'   },
      { to: '/workplace/teams',      icon: <Users           strokeWidth={2} />, label: 'Teams'      },
      { to: '/workplace/locations',  icon: <MapPin          strokeWidth={2} />, label: 'Locations'  },
      { to: '/workplace/activity',   icon: <Activity        strokeWidth={2} />, label: 'Activity'   },
      { to: '/workplace/setup',      icon: <Settings        strokeWidth={2} />, label: 'Setup'      },
      { to: '/workplace/branding',   icon: <Palette         strokeWidth={2} />, label: 'Branding'   },
    ],
  },
  {
    label: 'Transaction Manager',
    defaultOpen: true,
    items: [
      { to: '/transactions/list',    icon: <Table2      strokeWidth={2} />, label: 'Transactions'   },
      { to: '/transactions/tasks',   icon: <CheckSquare strokeWidth={2} />, label: 'Tasks'          },
    ],
  },
];

function SidebarContents({ collapsed }: { collapsed: boolean }) {
  return (
    <nav className="flex flex-col gap-4 px-3 py-4 flex-1 overflow-y-auto">
      {NAV.map((section) => (
        <NavSection
          key={section.label}
          label={section.label}
          defaultOpen={section.defaultOpen}
          collapsed={collapsed}
        >
          {section.items.map((item) => (
            <NavItem key={item.to} {...item} collapsed={collapsed} />
          ))}
        </NavSection>
      ))}
    </nav>
  );
}

function LayoutInner() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isOpen, isExpanded, agentCard, dealContext, closeDrawer, toggleExpand } = useAIDrawer();

  const isFullscreen = location.pathname === '/workplace/liquid-ai';

  if (isFullscreen) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-page)' }}>
        <Outlet />
        <Toaster />
      </div>
    );
  }

  const sidebarW = sidebarCollapsed ? 64 : 256;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--surface-page)', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col fixed inset-y-0 left-0 z-40 transition-all duration-300"
        style={{
          width: sidebarW,
          backgroundColor: 'var(--surface-sidebar)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* Logo / wordmark row */}
        <div
          className="flex items-center justify-between px-4 flex-shrink-0"
          style={{ height: 56, borderBottom: '1px solid var(--border)' }}
        >
          {!sidebarCollapsed && (
            <span className="text-[13px] font-bold tracking-tight" style={{ color: 'var(--ls-500)' }}>
              LS Operations
            </span>
          )}
          <button
            onClick={() => setSidebarCollapsed((c) => !c)}
            className={clsx(
              'p-1.5 rounded-lg hover:bg-gray-100 transition-colors',
              sidebarCollapsed && 'mx-auto',
            )}
            style={{ color: 'var(--text-muted)' }}
          >
            {sidebarCollapsed
              ? <ChevronRight className="h-4 w-4" strokeWidth={2} />
              : <ChevronLeft  className="h-4 w-4" strokeWidth={2} />
            }
          </button>
        </div>

        <SidebarContents collapsed={sidebarCollapsed} />
      </aside>

      {/* ── Mobile Overlay ──────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar Drawer ───────────────────────── */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex flex-col md:hidden transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        style={{
          width: 256,
          backgroundColor: 'var(--surface-sidebar)',
          borderRight: '1px solid var(--border)',
        }}
      >
        <div
          className="flex items-center justify-between px-4 flex-shrink-0"
          style={{ height: 56, borderBottom: '1px solid var(--border)' }}
        >
          <span className="text-[13px] font-bold tracking-tight" style={{ color: 'var(--ls-500)' }}>
            LS Operations
          </span>
          <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: 'var(--text-muted)' }}>
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
        <SidebarContents collapsed={false} />
      </aside>

      {/* ── Main Content ────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{
          marginLeft: sidebarW,
          paddingRight: isOpen ? 424 : 0,
          transition: 'margin-left 300ms ease, padding-right 350ms cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        {/* Mobile top bar */}
        <div
          className="md:hidden flex items-center gap-3 px-4 flex-shrink-0"
          style={{ height: 56, borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-sidebar)' }}
        >
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: 'var(--text-muted)' }}>
            <Menu className="h-5 w-5" strokeWidth={2} />
          </button>
          <span className="text-[13px] font-bold tracking-tight" style={{ color: 'var(--ls-500)' }}>
            LS Operations
          </span>
        </div>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* ── AI Drawer ───────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <AIDrawer
            isOpen={isOpen}
            onClose={closeDrawer}
            isExpanded={isExpanded}
            onToggleExpand={toggleExpand}
            agentCard={agentCard}
            dealContext={dealContext}
          />
        )}
      </AnimatePresence>

      <Toaster />
    </div>
  );
}

export function AppLayout() {
  return (
    <AIDrawerProvider>
      <LayoutInner />
    </AIDrawerProvider>
  );
}
