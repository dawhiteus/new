import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed?: boolean;
}

export function NavItem({ to, icon, label, collapsed }: NavItemProps) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-2 w-full px-3 py-2 rounded-[14px] transition-colors duration-150 select-none',
          'text-sm font-normal text-[#374151] hover:bg-[#e6f1f8] hover:text-[#005b94]',
          isActive && 'bg-[#005b94] !text-white font-medium hover:bg-[#004d7d] hover:!text-white',
          collapsed && 'justify-center px-2',
        )
      }
    >
      <span className="flex-shrink-0 h-5 w-5">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}
